import dbConnect from "@/lib/db";
import Holding from "@/lib/models/Holding";
import Certificate from "@/lib/models/Certificate";
import Project from "@/lib/models/Project";
import Investor from "@/lib/models/Investor";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getTranslations, getLocale } from 'next-intl/server';
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { headers } from "next/headers";
import CertificateView from "./CertificateView";

export default async function CertificatePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "investor") {
    redirect({ href: "/login", locale: await getLocale() });
  }

  const t = await getTranslations('Portal.certificateView');

  await dbConnect();

  // Ensure populated models are registered
  Project.findOne();
  Investor.findOne();

  const holding = await Holding.findOne({
    _id: params.id,
    investor_id: session.user.id
  }).populate('project_id').populate('investor_id').lean();

  if (!holding) {
    notFound();
  }

  const certificate = await Certificate.findOne({ holding_id: holding._id }).lean();
  if (!certificate) {
    // Edge case if certificate wasn't generated somehow
    return <div className="p-12 text-center text-red-500">{t('notYetIssued')}</div>;
  }

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const siteUrl = process.env.NEXTAUTH_URL || (host ? `${protocol}://${host}` : "");

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="font-serif text-[24px] text-navy">{t('pageTitle')}</h1>
          <p className="text-[14px] text-ink/60">{t('pageSubtitle')}</p>
        </div>
      </div>

      <CertificateView
        certificate={JSON.parse(JSON.stringify(certificate))}
        holding={JSON.parse(JSON.stringify(holding))}
        project={JSON.parse(JSON.stringify(holding.project_id))}
        investor={JSON.parse(JSON.stringify(holding.investor_id))}
        siteUrl={siteUrl}
      />
    </div>
  );
}
