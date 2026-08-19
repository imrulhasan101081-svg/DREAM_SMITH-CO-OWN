import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations } from 'next-intl/server';
import dbConnect from "@/lib/db";
import Investor from "@/lib/models/Investor";
import ProfileForm from "./ProfileForm";

export default async function InvestorProfile() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const t = await getTranslations('Portal.profile');

  await dbConnect();

  // Select only the fields the profile form needs — never send password_hash
  // or the raw encrypted ciphertext to the client. Skip .lean() so Mongoose
  // getters run and nid_number/bank_details come back decrypted.
  const investorDoc = await Investor.findById(session.user.id).select(
    "name contact email address nominee_name nominee_relation kyc_status nid_number"
  );

  if (!investorDoc) {
    return <div>Profile not found</div>;
  }

  const investor = investorDoc.toObject({ getters: true });

  // Convert ObjectId to string to pass to client component safely
  const safeInvestor = {
    ...investor,
    _id: investor._id.toString()
  };

  return (
    <div className="max-w-[700px]">
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-navy mb-1">{t('title')}</h1>
        <p className="text-[14px] text-ink/60">{t('description')}</p>
      </div>

      <ProfileForm investor={safeInvestor} />
    </div>
  );
}
