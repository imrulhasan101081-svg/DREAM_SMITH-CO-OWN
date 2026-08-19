'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function CertificateView({ certificate, holding, project, investor, siteUrl }: any) {
  const t = useTranslations('Portal.certificateView');
  const verifyUrl = `${siteUrl || ''}/verify/${certificate.qr_verification_hash}`;

  return (
    <div>
      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-navy text-ivory px-6 py-2.5 text-[14px] font-medium rounded-sm hover:bg-navy-deep transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          {t('downloadPdf')}
        </button>
      </div>

      <div className="bg-white border-[8px] border-gold p-12 relative overflow-hidden shadow-2xl print:shadow-none print:border-none print:p-0 aspect-[1/1.414] w-full max-w-[800px] mx-auto print:max-w-none print:w-[210mm] print:h-[297mm]">

        {/* Certificate Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none border-[12px] border-double border-navy m-4"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
           <div className="w-96 h-96 border-4 border-gold rotate-45 flex items-center justify-center">
             <div className="w-80 h-80 border border-gold rotate-12"></div>
           </div>
        </div>

        {/* Header */}
        <div className="text-center relative z-10 mb-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full border border-gold p-1 overflow-hidden bg-navy mb-3 shadow-md">
            <Image
              src="/images/logo/official-logo-icon.png"
              alt="Dream Smith Emblem"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <h1 className="font-serif text-[40px] text-navy uppercase tracking-widest mb-1">{t('certificateOfOwnership')}</h1>
          <div className="text-[13px] text-gold uppercase tracking-[0.3em] font-mono">Dream Smith Co-Own</div>
        </div>

        {/* Body */}
        <div className="text-center relative z-10 space-y-6 mb-16">
          <p className="text-[16px] text-ink/70 uppercase tracking-widest font-mono">{t('certifyThat')}</p>
          <h2 className="font-serif text-[36px] text-navy border-b border-line-light pb-2 inline-block px-12">{investor.name}</h2>
          <p className="text-[16px] text-ink/70">{t('holdsText')}</p>
          <div className="font-serif text-[32px] text-gold-bright">{t('fractionalShares', { count: holding.share_count })}</div>
          <p className="text-[16px] text-ink/70">{t('inProjectKnownAs')}</p>
          <h3 className="font-serif text-[28px] text-navy">{project.name}</h3>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-8 relative z-10 border-t border-b border-line-light py-6 mb-12">
          <div>
            <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('certificateId')}</div>
            <div className="text-[14px] font-medium text-navy font-mono">{certificate.certificate_id}</div>
          </div>
          <div>
            <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('issueDate')}</div>
            <div className="text-[14px] font-medium text-navy">
              {new Date(certificate.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('maturityDate')}</div>
            <div className="text-[14px] font-medium text-navy">
               {new Date(holding.maturity_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-ink/50 uppercase tracking-widest font-mono mb-1">{t('guaranteedBuyback')}</div>
            <div className="text-[14px] font-medium text-navy">৳{(holding.share_count * project.buyback_amount).toLocaleString()}</div>
          </div>
        </div>

        {/* Footer & QR */}
        <div className="flex justify-between items-end relative z-10">
          <div className="space-y-8">
            <div className="w-48 border-b-2 border-navy border-dashed"></div>
            <div className="text-[12px] text-navy uppercase tracking-widest font-mono">{t('authorizedSignature')}</div>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="bg-white p-2 border border-line-light shadow-sm mb-3">
              <QRCodeSVG value={verifyUrl} size={100} level="H" />
            </div>
            <div className="text-[10px] text-ink/50 uppercase tracking-widest font-mono">{t('scanToVerify')}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
