import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Application from "@/lib/models/Application";
import Project from "@/lib/models/Project";
import Investor from "@/lib/models/Investor";
import Holding from "@/lib/models/Holding";
import Certificate from "@/lib/models/Certificate";
import { requirePermission, logAction, rbacErrorResponse } from "@/lib/rbac";
import { hashValue } from "@/lib/encryption";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let admin;
  try {
    admin = await requirePermission("certificate.issue");
  } catch (err) {
    return rbacErrorResponse(err);
  }

  try {
    await dbConnect();
    const body = await req.json();
    const { agreementRef, chequeRef } = body;

    if (!agreementRef || !chequeRef) {
      return NextResponse.json(
        { error: "Agreement Reference and Cheque Reference are required." },
        { status: 400 }
      );
    }

    // Use a Mongoose transaction to ensure atomicity
    const sessionDB = await mongoose.startSession();
    sessionDB.startTransaction();

    try {
      // 1. Fetch application
      const application = await Application.findById(params.id).session(sessionDB);
      if (!application) {
        throw new Error("Application not found.");
      }
      if (application.status === "converted") {
        throw new Error("Application has already been converted.");
      }

      // 2. Fetch project & enforce share cap
      const project = await Project.findById(application.project_id).session(sessionDB);
      if (!project) {
        throw new Error("Project not found.");
      }

      const availableShares = project.total_shares - (project.shares_reserved || 0);
      if (application.shares_requested > availableShares) {
        throw new Error(`Insufficient shares. Only ${availableShares} shares left.`);
      }

      // 3. Increment reserved shares on Project (Atomic increment)
      const updatedProject = await Project.findOneAndUpdate(
        { _id: project._id, shares_reserved: { $lte: project.total_shares - application.shares_requested } },
        { $inc: { shares_reserved: application.shares_requested } },
        { returnDocument: 'after', session: sessionDB }
      );

      if (!updatedProject) {
         throw new Error("Failed to reserve shares due to concurrency. Share cap may have been reached.");
      }

      // 4. Create or find Investor
      // application.nid_number is decrypted on read (Mongoose getter), and
      // nid_number in the DB is stored encrypted with a random IV, so it
      // can't be matched directly — look up via the deterministic hash.
      const nidHash = hashValue(application.nid_number);
      let investor = await Investor.findOne({ nid_hash: nidHash }).session(sessionDB);

      if (!investor) {
        // Generate temporary password (phone number default)
        const passwordHash = await bcrypt.hash(application.contact, 10);

        investor = await Investor.create([{
          name: application.full_name,
          contact: application.contact,
          email: application.email,
          address: application.address,
          nid_number: application.nid_number,
          nid_hash: nidHash,
          nominee_name: application.nominee_name,
          nominee_relation: application.nominee_relation,
          nominee_contact: application.nominee_contact,
          bank_details: application.bank_details,
          kyc_status: "pending", // staff verifies later manually
          login_email: application.email.toLowerCase(),
          password_hash: passwordHash,
        }], { session: sessionDB }).then(res => res[0]);
      }

      // 5. Create Holding
      const purchaseDate = new Date();
      const maturityDate = new Date();
      maturityDate.setMonth(maturityDate.getMonth() + project.term_months);
      if (!investor) {
        throw new Error("Failed to create or find investor.");
      }

      const holding = await Holding.create([{
        investor_id: investor._id,
        project_id: project._id,
        share_count: application.shares_requested,
        purchase_date: purchaseDate,
        maturity_date: maturityDate,
        agreement_ref: agreementRef,
        cheque_ref: chequeRef,
        status: "active"
      }], { session: sessionDB }).then(res => res[0]);

      // 6. Generate Certificate
      const hash = crypto.createHash('sha256').update(`${holding._id.toString()}-${purchaseDate.getTime()}`).digest('hex');
      const certId = `DSCO-CERT-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      await Certificate.create([{
        certificate_id: certId,
        holding_id: holding._id,
        qr_verification_hash: hash,
        issue_date: purchaseDate
      }], { session: sessionDB });

      // 7. Mark Application as converted
      application.status = "converted";
      await application.save({ session: sessionDB });

      await sessionDB.commitTransaction();
      sessionDB.endSession();

      await logAction({
        admin,
        action: "certificate.issue",
        resourceType: "Application",
        resourceId: params.id,
        resourceLabel: application.full_name,
        newValue: {
          investorId: investor._id.toString(),
          holdingId: holding._id.toString(),
          certificateId: certId,
          shares: application.shares_requested,
        },
        description: `Converted application for ${application.full_name} into a holding (${application.shares_requested} share(s)) and issued certificate ${certId}`,
        req,
      });

      return NextResponse.json({ success: true, message: "Successfully converted to holding." });

    } catch (error: any) {
      await sessionDB.abortTransaction();
      sessionDB.endSession();
      return NextResponse.json({ error: error.message || "Failed to convert." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
