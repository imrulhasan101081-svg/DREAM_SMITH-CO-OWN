import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact Us | Dream Smith Co-Own',
  description: 'Get in touch with Dream Smith Properties in Rajshahi. Office address, phone, and email.',
};

export default async function ContactPage() {
  const t = await getTranslations('Contact');

  return (
    <>
      <Header />

      <main className="pt-32 pb-24 min-h-screen bg-ivory">
        <div className="max-w-[1180px] mx-auto px-8">
          <div className="max-w-[800px] mb-16">
            <span className="font-mono text-[12px] tracking-[0.14em] uppercase text-gold mb-4 block">{t('eyebrow')}</span>
            <h1 className="font-serif font-normal text-[clamp(32px,4vw,48px)] leading-[1.15] tracking-[-0.01em] mb-6 text-navy">
              {t('title')} <em className="italic text-gold">{t('titleEmphasis')}</em>
            </h1>
            <p className="text-[17px] text-ink/70 leading-relaxed">
              {t('description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="bg-white border border-line-light p-8 rounded-sm shadow-sm mb-8">
                <h3 className="font-serif text-[22px] text-navy mb-6">{t('office.title')}</h3>
                <div className="space-y-6 text-[15px] text-ink/80">
                  <div className="flex gap-4">
                    <div className="text-gold mt-1">📍</div>
                    <div>
                      <strong>Dream Smith Properties Pvt. Ltd.</strong><br />
                      {t('office.addressLine1')}<br />
                      {t('office.addressLine2')}<br />
                      {t('office.addressLine3')}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-gold mt-1">📞</div>
                    <div>
                      <a href="tel:+8801700000000" className="hover:text-gold-bright transition-colors">+880 1700-000000</a><br />
                      <span className="text-[13px] text-ink/50">{t('office.hours')}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-gold mt-1">✉️</div>
                    <div>
                      <a href="mailto:info@dreamsmithproperties.com" className="hover:text-gold-bright transition-colors">info@dreamsmithproperties.com</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-navy text-ivory p-8 rounded-sm shadow-sm">
                <h3 className="font-serif text-[22px] text-gold-bright mb-4">{t('siteVisit.title')}</h3>
                <p className="text-[14px] text-ivory/70 leading-relaxed mb-4">
                  {t('siteVisit.description')}
                </p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-[13px] font-mono text-gold hover:underline">
                  {t('siteVisit.mapsLink')}
                </a>
              </div>
            </div>

            <div className="bg-white border border-line-light p-8 rounded-sm shadow-sm">
              <h3 className="font-serif text-[22px] text-navy mb-6">{t('formTitle')}</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
