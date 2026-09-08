'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';

type Currency = 'BDT' | 'USD' | 'GBP' | 'AED';

interface CurrencyConfig {
  symbol: string;
  rate: number; // Conversion from BDT
  decimals: number;
  label: string;
}

const CURRENCIES: Record<Currency, CurrencyConfig> = {
  BDT: { symbol: '৳', rate: 1, decimals: 0, label: 'Bangladeshi Taka (BDT)' },
  USD: { symbol: '$', rate: 1 / 121, decimals: 0, label: 'US Dollar (USD)' },
  GBP: { symbol: '£', rate: 1 / 154, decimals: 0, label: 'British Pound (GBP)' },
  AED: { symbol: 'AED ', rate: 1 / 33, decimals: 0, label: 'UAE Dirham (AED)' },
};

const BASE_PRICE_BDT = 400000;
const BASE_RETURN_BDT = 550000;
const SQFT_PER_SHARE = 54.4;

export default function InvestmentCalculator() {
  const [shares, setShares] = useState<number>(1);
  const [currency, setCurrency] = useState<Currency>('BDT');

  const curr = CURRENCIES[currency];

  const totalInvestmentBDT = shares * BASE_PRICE_BDT;
  const totalReturnBDT = shares * BASE_RETURN_BDT;
  const totalGainBDT = totalReturnBDT - totalInvestmentBDT;
  const totalSqft = (shares * SQFT_PER_SHARE).toFixed(1);

  const formatMoney = (amountBDT: number): string => {
    const converted = amountBDT * curr.rate;
    if (currency === 'BDT') {
      return `৳${converted.toLocaleString('en-IN')}`;
    }
    return `${curr.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  };

  return (
    <div className="bg-navy border border-gold/30 rounded-sm p-6 sm:p-8 md:p-12 relative overflow-hidden shadow-2xl">
      {/* Background Architectural Watermark */}
      <div 
        className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full border border-gold/5 pointer-events-none"
        aria-hidden="true" 
      />

      {/* Header: Title + Currency Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-ivory/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-gold rounded-full" aria-hidden="true" />
            <span className="eyebrow text-gold-bright text-[11px] font-bold tracking-[0.22em]">
              PORTFOLIO SIMULATOR // CHIHNO, RAJSHAHI
            </span>
          </div>
          <h3 className="font-serif text-[clamp(24px,2.8vw,36px)] text-ivory font-normal leading-tight">
            Simulate Your <em className="italic text-gold-gradient">Equity Allocation</em>
          </h3>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5 bg-navy-deep/80 p-1 border border-gold/20 rounded-sm self-start lg:self-center">
          {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCurrency(c)}
              className={`px-3 py-1.5 text-[11px] font-mono tracking-wider transition-all duration-300 rounded-sm ${
                currency === c
                  ? 'bg-gold text-navy-deep font-bold shadow-sm'
                  : 'text-ivory/60 hover:text-ivory'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Slider & Presets */}
      <div className="py-8 border-b border-ivory/10">
        <div className="flex justify-between items-baseline mb-4">
          <label htmlFor="shares-slider" className="eyebrow text-ivory/60 text-[11px]">
            Selected Allocation Shares:
          </label>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-[clamp(32px,3.5vw,48px)] text-gold-bright figures font-normal leading-none">
              {shares}
            </span>
            <span className="eyebrow text-ivory/50 text-[11px]">
              {shares === 1 ? 'SHARE' : 'SHARES'} ({((shares / 120) * 100).toFixed(1)}% of Project)
            </span>
          </div>
        </div>

        {/* Custom Range Slider */}
        <div className="relative py-3">
          <input
            id="shares-slider"
            type="range"
            min="1"
            max="20"
            step="1"
            value={shares}
            onChange={(e) => setShares(Number(e.target.value))}
            className="w-full h-2 bg-navy-deep border border-gold/20 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-ivory/35 mt-2">
            <span>1 Share (Minimum)</span>
            <span className="hidden sm:inline">5 Shares</span>
            <span className="hidden sm:inline">10 Shares</span>
            <span>20 Shares (Max Institutional)</span>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[1, 2, 3, 5, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setShares(num)}
              className={`px-3 py-1 text-[11px] font-mono tracking-wider border transition-all ${
                shares === num
                  ? 'border-gold bg-gold/15 text-gold-bright font-semibold'
                  : 'border-ivory/10 bg-navy-deep/40 text-ivory/60 hover:border-gold/40'
              }`}
            >
              {num} {num === 1 ? 'Share' : 'Shares'}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
        {/* Metric 1: Capital Commitment */}
        <div className="bg-navy-deep/70 border border-ivory/10 p-5 rounded-sm corner-ticks">
          <div className="eyebrow text-[9.5px] text-ivory/45 mb-2 font-bold">TOTAL CAPITAL COMMITMENT</div>
          <div className="font-serif text-[clamp(24px,2.4vw,32px)] text-ivory figures font-normal leading-tight">
            {formatMoney(totalInvestmentBDT)}
          </div>
          <div className="text-[11.5px] text-ivory/40 mt-1.5">
            Registered Sub-Deed of Land
          </div>
        </div>

        {/* Metric 2: Projected 3-Yr Exit */}
        <div className="bg-navy-deep/70 border border-gold/30 p-5 rounded-sm corner-ticks">
          <div className="eyebrow text-[9.5px] text-gold-bright mb-2 font-bold">PROJECTED 3-YR BUYBACK EXIT</div>
          <div className="font-serif text-[clamp(24px,2.4vw,32px)] text-gold-bright figures font-normal leading-tight">
            {formatMoney(totalReturnBDT)}
          </div>
          <div className="text-[11.5px] text-gold/60 mt-1.5">
            Contractual Buyback Clause
          </div>
        </div>

        {/* Metric 3: Net Capital Gain */}
        <div className="bg-navy-deep/70 border border-ivory/10 p-5 rounded-sm corner-ticks">
          <div className="eyebrow text-[9.5px] text-ivory/45 mb-2 font-bold">TOTAL ESTIMATED GAIN</div>
          <div className="font-serif text-[clamp(24px,2.4vw,32px)] text-emerald-400 figures font-normal leading-tight">
            +{formatMoney(totalGainBDT)}
          </div>
          <div className="text-[11.5px] text-emerald-400/60 mt-1.5">
            +37.5% Total Net Yield
          </div>
        </div>

        {/* Metric 4: Land Equity Area */}
        <div className="bg-navy-deep/70 border border-ivory/10 p-5 rounded-sm corner-ticks">
          <div className="eyebrow text-[9.5px] text-ivory/45 mb-2 font-bold">FREEHOLD LAND OWNERSHIP</div>
          <div className="font-serif text-[clamp(24px,2.4vw,32px)] text-ivory figures font-normal leading-tight">
            {totalSqft} <span className="text-[16px] font-sans font-normal text-ivory/50">sq.ft.</span>
          </div>
          <div className="text-[11.5px] text-ivory/40 mt-1.5">
            {(shares * 0.125).toFixed(3)} Decimal Share
          </div>
        </div>
      </div>

      {/* Security Tag + Action Button */}
      <div className="pt-6 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3 text-ivory/60 text-[12px] font-light">
          <span className="w-5 h-5 rounded-full border border-gold/40 flex items-center justify-center text-gold text-[11px]">
            🛡
          </span>
          <span>100% Capital Protection with Bank Escrow & Registered Deed of Trust.</span>
        </div>

        <Link
          href={`/apply?shares=${shares}&currency=${currency}`}
          className="btn-gold px-8 py-3.5 text-[13px] tracking-wider uppercase font-semibold text-center w-full sm:w-auto"
        >
          <span>Lock {shares} {shares === 1 ? 'Share' : 'Shares'} Allocation</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
