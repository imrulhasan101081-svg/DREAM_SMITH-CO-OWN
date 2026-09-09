import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import dbConnect from '@/lib/db';
import AzoCaresEntry from '@/lib/models/AzoCaresEntry';
import Project from '@/lib/models/Project';

export const metadata = {
  title: 'Azo Cares | Social Responsibility | Dream Smith Co-Own',
  description: '1% of all project revenues allocated directly to high-impact community programs in Rajshahi.',
};

export default async function CaresPage() {
  const t = await getTranslations('Cares');

  let entries: any[] = [];
  try {
    await dbConnect();
    Project.findOne(); // Register model
    entries = await AzoCaresEntry.find({}).populate('project_id', 'name').sort({ date: -1 }).lean();
  } catch (error) {
    console.error('Failed to fetch Azo Cares ledger:', error);
  }

  const totalDistributed = entries.reduce((acc: number, item: any) => acc + (item.amount || 0), 0);

  return (
    <>
      <main className="min-h-screen bg-ivory pb-24">
        <Header />

        {/* Header */}
        <section className="bg-navy py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="max-w-[1180px] mx-auto px-8 relative z-10 text-center">
             <span className="eyebrow text-[12px] tracking-[0.2em] text-gold mb-4 block font-bold">{t('eyebrow')}</span>
             <h1 className="font-serif text-[48px] md:text-[64px] text-ivory mb-6">{t('title')}</h1>
             <p className="text-[16px] text-ivory/70 max-w-[600px] mx-auto leading-relaxed">
               {t('description')}
             </p>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-[1180px] mx-auto px-8 -mt-12 relative z-20 mb-20">
           <div className="bg-white border border-line-light p-12 shadow-xl flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8 rounded-sm">
              <div>
                <div className="font-mono text-[13px] tracking-widest text-ink/50 uppercase mb-2">{t('totalDistributed')}</div>
                <div className="font-serif text-[48px] text-navy tabular-nums">৳{totalDistributed.toLocaleString()}</div>
              </div>
              <div className="hidden md:block w-px h-24 bg-line-light"></div>
              <div>
                <div className="font-mono text-[13px] tracking-widest text-ink/50 uppercase mb-2">{t('totalInitiatives')}</div>
                <div className="font-serif text-[48px] text-navy tabular-nums">{entries.length}</div>
              </div>
           </div>
        </section>

        {/* Ledger */}
        <section className="max-w-[900px] mx-auto px-8">
          <div className="flex justify-between items-end mb-10 border-b border-line pb-4">
             <h2 className="font-serif text-[28px] text-navy">{t('ledgerTitle')}</h2>
             <span className="text-[13px] text-ink/50 font-mono tracking-widest uppercase">{t('chronological')}</span>
          </div>

          <div className="space-y-8">
            {entries.length === 0 && (
              <div className="text-center p-12 bg-white border border-line-light rounded-sm text-ink/50">
                {t('emptyState')}
              </div>
            )}

            {entries.map((entry: any) => (
              <div key={entry._id.toString()} className="bg-white p-8 border border-line-light flex flex-col md:flex-row gap-8 shadow-sm">
                 <div className="w-full md:w-48 shrink-0 flex flex-col justify-center border-r border-line-light pr-8">
                    <div className="text-[13px] text-ink/50 font-mono tracking-widest uppercase mb-2">{t('distributedOn')}</div>
                    <div className="font-serif text-[24px] text-navy">
                      {new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                 </div>

                 <div className="flex-1">
                    <h3 className="font-serif text-[24px] text-navy mb-2">{entry.initiative}</h3>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="bg-navy/5 text-navy border border-navy/10 px-2.5 py-1 text-[11px] font-mono tracking-widest uppercase rounded-sm">{t('fundedVia', { project: entry.project_id?.name || t('unknownProject') })}</span>
                    </div>

                    <div className="font-serif text-[32px] text-sage">
                      ৳{(entry.amount || 0).toLocaleString()}
                    </div>
                 </div>

                 {entry.evidence && entry.evidence.length > 0 && (
                   <div className="w-full mt-6 md:mt-0 md:w-64 shrink-0 grid gap-2" style={{
                     gridTemplateColumns: entry.evidence.length === 1 ? '1fr' : '1fr 1fr',
                     gridAutoRows: 'min-content'
                   }}>
                      {entry.evidence.map((img: string, i: number) => (
                        <div key={i} className={`relative aspect-square border border-line-light rounded-sm overflow-hidden ${entry.evidence.length === 3 && i === 0 ? 'col-span-2 aspect-[2/1]' : ''}`}>
                          <Image
                            src={img}
                            alt={`Evidence ${i + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 128px"
                            className="object-cover transition-transform hover:scale-105 duration-500"
                            unoptimized
                          />
                        </div>
                      ))}
                   </div>
                 )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
