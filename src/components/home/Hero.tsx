import { getTranslations } from 'next-intl/server';
import HeroContent from './HeroContent';


export default async function Hero({
  totalShares,
  reservedShares,
}: {
  totalShares: number;
  reservedShares: number;
}) {
  const t = await getTranslations('HomePage.hero');
  const remaining = Math.max(totalShares - reservedShares, 0);

  return (
    <HeroContent
      tEyebrow={t('eyebrow')}
      tTitleLine1={t('titleLine1')}
      tTitleLine2={t('titleLine2')}
      tSubtitle={t('subtitle')}
      tReserveShare={t('reserveShare')}
      tSeeHowItWorks={t('seeHowItWorks')}
      stats={{
        price: '৳4,00,000',
        priceLabel: t('statPricePerShare'),
        term: '36',
        termLabel: t('statTerm'),
        termSuffix: 'MO',
        returnRate: '12.5%',
        returnLabel: t('statReturn'),
        remaining: String(remaining),
        remainingLabel: t('statRemaining'),
      }}
    />
  );
}

