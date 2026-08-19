import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/lib/models/Project";
import Application from "@/lib/models/Application";
import AdminUser from "@/lib/models/AdminUser";
import SiteContent from "@/lib/models/SiteContent";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // SECURITY: Only allow seed in local development, or with the secret key
  // elsewhere (preview/staging/production). Checking for "development"
  // specifically — rather than "not production" — closes the gap where a
  // preview/staging deploy has NODE_ENV unset or set to something else.
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (
    process.env.NODE_ENV !== "development" &&
    (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET)
  ) {
    return NextResponse.json(
      { error: "Forbidden — provide ?secret=SEED_SECRET" },
      { status: 403 }
    );
  }

  await dbConnect();

  const results: Record<string, string> = {};

  // ─── 1. SUPER ADMIN ────────────────────────────────────────────────────────
  const existingSuperAdmin = await AdminUser.findOne({
    email: "imrulhasanshowmick101081@gmail.com",
  });

  if (!existingSuperAdmin) {
    await AdminUser.create({
      name: "Imrul Hasan Showmick",
      email: "imrulhasanshowmick101081@gmail.com",
      role: "SUPER_ADMIN",
      permissions: [], // Super Admins have wildcard "*" — permissions array unused
      isActive: true,
    });
    results.superAdmin = "Created Super Admin: imrulhasanshowmick101081@gmail.com";
  } else {
    results.superAdmin = "Super Admin already exists";
  }

  // ─── 2. PROJECT — Dream Smith Chihno ──────────────────────────────────────
  let chihno = await Project.findOne({ slug: "chihno" });
  if (!chihno) {
    chihno = await Project.create({
      name: "Chihno",
      slug: "chihno",
      location: "Octroy morh, Motihar, Rajshahi",
      address: "Octroy morh, Motihar, Rajshahi",
      structure_details: "(G+9) 10- Storied Residential Building.",
      description:
        "Chinnoh is a premium (G+9) 10-Storied residential complex located at Octroy morh, Motihar, Rajshahi. The project offers fractional co-ownership shares at ৳4,00,000 per share (100 sq ft), with a guaranteed buy-back at ৳5,50,000 after 36 months.",
      total_shares: 274,
      shares_reserved: 0,
      price_per_share: 400000,
      buyback_amount: 550000,
      term_months: 36,
      construction_months: 30,
      first_refusal_rate: 5500,
      status: "under_construction",
      isPublished: true,
      isFeatured: true,
      constructionProgress: 0,
      progressBreakdown: {
        foundation: 0,
        structural: 0,
        interior: 0,
        exterior: 0,
        utility: 0,
        handover: 0,
      },
      land_area: "0.10240 Acre",
      amenities: [
        "24/7 Security",
        "CCTV Surveillance",
        "Backup Generator",
        "Rooftop Garden",
        "Lift / Elevator",
        "Prayer Room",
        "Parking",
      ],
      facilities: [
        "Residential Flats",
        "Studio Apartments",
        "Ground Floor Commercial",
        "Roof Terrace",
      ],
      media: [],
      gallery: [],
      visibility: {
        financials: "public",
        documents: "client",
        progress: "public",
        contacts: "client",
      },
    });
    results.project = "Created Dream Smith Chihno project";
  } else {
    results.project = "Dream Smith Chihno already exists";
  }

  // ─── 3. APPLICATIONS (sample data for dev) ──────────────────────────────
  const currentApps = await Application.countDocuments();
  if (currentApps === 0) {
    await Application.create([
      {
        full_name: "Md. Ashiqur Rahman",
        nid_number: "1990123456789",
        address: "Kadirganj, Rajshahi",
        contact: "01711223344",
        email: "ashiqur@example.com",
        nominee_name: "Farhana Rahman",
        nominee_relation: "Wife",
        nominee_contact: "01722334455",
        bank_details: "Dutch Bangla Bank, A/C: 1234567890",
        project_id: chihno._id,
        shares_requested: 2,
        status: "new",
        verificationStatus: "pending",
      },
      {
        full_name: "Sadia Islam",
        nid_number: "1985987654321",
        address: "Uposhahar, Rajshahi",
        contact: "01811223344",
        email: "sadia@example.com",
        nominee_name: "Rafiqul Islam",
        nominee_relation: "Husband",
        nominee_contact: "01822334455",
        bank_details: "Islami Bank, A/C: 9876543210",
        project_id: chihno._id,
        shares_requested: 1,
        status: "new",
        verificationStatus: "pending",
      },
    ]);
    results.applications = "Created 2 sample applications";
  } else {
    results.applications = `${currentApps} applications already exist`;
  }

  // ─── 4. SITE CONTENT (CMS defaults) ─────────────────────────────────────
  const contentDefaults: Array<{
    section: string;
    key: string;
    value: string;
    label: string;
    type: "text" | "textarea" | "url" | "email" | "phone" | "number" | "json";
  }> = [
    // Hero
    { section: "hero", key: "headline", value: "Own a piece of Rajshahi's most strategic address.", label: "Hero Headline", type: "text" },
    { section: "hero", key: "subtitle", value: "Fractional co-ownership in Dream Smith Chihno — transparent, documented, and secured by a notarized agreement.", label: "Hero Subtitle", type: "textarea" },
    // Company
    { section: "company", key: "name", value: "Dream Smith Properties Pvt. Ltd.", label: "Company Name", type: "text" },
    { section: "company", key: "rjsc", value: "RJSC Registered — Est. 2011", label: "RJSC Registration", type: "text" },
    { section: "company", key: "address", value: "Rajshahi, Bangladesh", label: "Office Address", type: "textarea" },
    { section: "company", key: "phone", value: "+880-XXXXXXXXXX", label: "Phone / WhatsApp", type: "phone" },
    { section: "company", key: "email", value: "info@dreamsmithproperties.com", label: "Office Email", type: "email" },
    { section: "company", key: "hours", value: "Sunday – Thursday: 10:00 AM – 6:00 PM", label: "Office Hours", type: "text" },
    // About
    { section: "about", key: "headline", value: "Building trust in Rajshahi's real estate since 2011.", label: "About Headline", type: "text" },
    { section: "about", key: "description", value: "Dream Smith Properties Pvt. Ltd. is a RJSC-registered real estate developer based in Rajshahi, Bangladesh.", label: "About Description", type: "textarea" },
    { section: "about", key: "md_name", value: "Managing Director", label: "MD Full Name", type: "text" },
    // Footer
    { section: "footer", key: "tagline", value: "A fractional co-ownership programme by Dream Smith Properties Pvt. Ltd., Rajshahi. RJSC registered since 2011.", label: "Footer Tagline", type: "textarea" },
  ];

  let contentCreated = 0;
  for (const item of contentDefaults) {
    const existing = await SiteContent.findOne({ section: item.section, key: item.key });
    if (!existing) {
      await SiteContent.create(item);
      contentCreated++;
    }
  }
  results.siteContent = `Created ${contentCreated} site content defaults`;

  return NextResponse.json({
    success: true,
    message: "Database seeded successfully.",
    results,
  });
}
