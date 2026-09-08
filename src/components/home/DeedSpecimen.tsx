'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export default function DeedSpecimen() {
  const [activeTab, setActiveTab] = useState<'deed' | 'safeguards' | 'audit'>('deed');

  return (
    <div className="bg-ivory border border-line-light rounded-sm p-6 sm:p-10 md:p-14 relative shadow-xl">
      {/* Header section */}
      <div className="max-w-[720px] mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-gold" aria-hidden="true" />
          <span className="eyebrow text-gold text-[11px] font-bold tracking-[0.24em]">
            INSTITUTIONAL TRUST ARTIFACT // DEED OF TITLE
          </span>
        </div>
        <h2 className="font-serif text-[clamp(28px,3.4vw,46px)] text-navy font-normal leading-[1.08] tracking-[-0.015em] mb-4 text-balance">
          Audited Ownership. <em className="italic text-gold">Legally Irrevocable.</em>
        </h2>
        <p className="text-ink/65 text-[15.5px] leading-relaxed">
          Every Dream Smith Co-Own investment is backed by a registered sub-deed of land title, executed in the investor’s legal name at the Government Sub-Registry Office.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line-light mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('deed')}
          className={`pb-3 px-4 text-[12px] font-mono tracking-wider transition-all border-b-2 -mb-px ${
            activeTab === 'deed'
              ? 'border-gold text-navy font-bold'
              : 'border-transparent text-ink/50 hover:text-ink'
          }`}
        >
          01 // DEED SPECIMEN
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('safeguards')}
          className={`pb-3 px-4 text-[12px] font-mono tracking-wider transition-all border-b-2 -mb-px ${
            activeTab === 'safeguards'
              ? 'border-gold text-navy font-bold'
              : 'border-transparent text-ink/50 hover:text-ink'
          }`}
        >
          02 // 3-TIER LEGAL SHIELD
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-[12px] font-mono tracking-wider transition-all border-b-2 -mb-px ${
            activeTab === 'audit'
              ? 'border-gold text-navy font-bold'
              : 'border-transparent text-ink/50 hover:text-ink'
          }`}
        >
          03 // ESCROW ARCHITECTURE
        </button>
      </div>

      {/* Tab 1: Deed Specimen Card */}
      {activeTab === 'deed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Visual Certificate Frame */}
          <div className="lg:col-span-7 bg-navy-deep text-ivory border-2 border-gold/40 p-6 sm:p-8 rounded-sm relative shadow-2xl corner-ticks overflow-hidden">
            {/* Background Official Sovereign Seal Watermark */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] overflow-hidden"
              aria-hidden="true"
            >
              <Image
                src="/images/logo/official-logo-icon.png"
                alt=""
                width={380}
                height={380}
                className="object-contain scale-110"
              />
            </div>

            {/* Guilloché Header Band */}
            <div className="flex justify-between items-center pb-6 border-b border-gold/25 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full border border-gold/60 p-1 flex items-center justify-center bg-navy shadow-inner shrink-0 overflow-hidden">
                  <Image
                    src="/images/logo/official-logo-icon.png"
                    alt="Dream Smith Official Logo"
                    width={38}
                    height={38}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="eyebrow text-gold-bright text-[10px] tracking-[0.2em] font-bold">
                    DREAM SMITH CO-OWN // AZO GROUP
                  </div>
                  <div className="text-[10px] font-mono text-ivory/40">
                    REGISTRY REF: DS-2026-CH88-77F
                  </div>
                </div>
              </div>
              <span className="hidden sm:inline-block border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase rounded-sm">
                ● AUDITED &amp; ACTIVE
              </span>
            </div>

            {/* Certificate Body */}
            <div className="py-6 space-y-4 relative z-10">
              <div className="text-center py-2">
                <div className="font-serif italic text-[14px] text-gold/80 mb-1">Official Specimen</div>
                <div className="font-serif text-[clamp(20px,2.2vw,28px)] text-ivory tracking-wide uppercase">
                  Certificate of Land Co-Ownership
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-navy-surface/80 p-4 border border-ivory/10 rounded-sm text-[12px]">
                <div>
                  <span className="eyebrow text-[8.5px] text-ivory/40 block mb-1">ASSET ASCRIPTION</span>
                  <span className="font-semibold text-ivory">Dream Smith Chihno</span>
                  <span className="block text-[10px] text-ivory/50 font-mono">10-Storey Tower, Rajshahi</span>
                </div>
                <div>
                  <span className="eyebrow text-[8.5px] text-ivory/40 block mb-1">ALLOCATION EQUITY</span>
                  <span className="font-serif text-gold-bright text-[15px] figures">1 Share / ৳4,00,000</span>
                  <span className="block text-[10px] text-ivory/50">0.125 Decimal Land Right</span>
                </div>
                <div>
                  <span className="eyebrow text-[8.5px] text-ivory/40 block mb-1">DEED REGISTRATION</span>
                  <span className="text-ivory font-mono text-[11px]">Sub-Registry Office, Rajshahi</span>
                </div>
                <div>
                  <span className="eyebrow text-[8.5px] text-ivory/40 block mb-1">BUYBACK COVENANT</span>
                  <span className="text-emerald-400 font-serif text-[13px]">৳5,50,000 (36 Months)</span>
                </div>
              </div>

              {/* Cryptographic Hash Band */}
              <div className="bg-navy/90 p-3 border border-gold/20 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10.5px] font-mono text-ivory/60">
                <div className="truncate">
                  <span className="text-gold">SHA-256 HASH:</span> e4b8...88ca91fc20
                </div>
                <Link
                  href="/verify/DS-2026-CH88"
                  className="text-gold-bright hover:underline shrink-0 text-[11px]"
                >
                  Verify Registry Ledger ↗
                </Link>
              </div>
            </div>

            {/* Official Stamp & Signatures */}
            <div className="pt-4 border-t border-ivory/10 flex flex-wrap justify-between items-center gap-3 text-[10px] font-mono text-ivory/50 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span>LEGAL ESCROW AGENT: DUAL-KEY BANK TRUST</span>
              </div>
              <div className="flex items-center gap-2 bg-gold/10 border border-gold/30 px-2.5 py-1 rounded-sm text-gold-bright">
                <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/logo/official-logo-icon.png"
                    alt="Seal"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <span className="tracking-wider uppercase text-[9px]">OFFICIAL CORPORATE SEAL APPROVED</span>
              </div>
            </div>
          </div>

          {/* Side Narrative & Verification Callout */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h4 className="font-serif text-[22px] text-navy font-normal">
                Why a Registered Deed Matters
              </h4>
              <p className="text-[14px] text-ink/70 leading-relaxed">
                Unlike synthetic tokens or unbacked promises, you hold direct, unencumbered freehold land equity. Even in the most extreme economic scenarios, physical land in central Rajshahi retains permanent tangible value.
              </p>
              
              <ul className="space-y-3 pt-2">
                {[
                  'Registered directly at Government Sub-Registry Office',
                  'Nominee rights & hereditary estate transmission supported',
                  'Quarterly physical site inspection reports published',
                  'Guaranteed buyback backed by corporate bank guarantee',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[13px] text-ink/80">
                    <span className="text-gold font-bold text-[14px]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-line-light p-5 rounded-sm flex items-center justify-between gap-4">
              <div>
                <div className="eyebrow text-[10px] text-gold font-bold">LIVE CERTIFICATE VERIFICATION</div>
                <div className="text-[12px] text-ink/70 mt-0.5">Lookup any issued deed by certificate ID.</div>
              </div>
              <Link
                href="/verify"
                className="btn-outline-ink px-4 py-2 text-[12px] font-mono tracking-wider shrink-0"
              >
                Verify Deed ↗
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 3-Tier Legal Shield */}
      {activeTab === 'safeguards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="bg-white border border-line-light p-6 rounded-sm corner-ticks">
            <div className="font-serif text-[28px] text-gold mb-3 leading-none">01</div>
            <h4 className="font-serif text-[18px] text-navy mb-2">Government Sub-Registry</h4>
            <p className="text-[13.5px] text-ink/70 leading-relaxed">
              Every co-ownership share is officially stamped and recorded in the local land registry with complete mutation records.
            </p>
          </div>
          <div className="bg-white border border-line-light p-6 rounded-sm corner-ticks">
            <div className="font-serif text-[28px] text-gold mb-3 leading-none">02</div>
            <h4 className="font-serif text-[18px] text-navy mb-2">Dual-Key Escrow Custody</h4>
            <p className="text-[13.5px] text-ink/70 leading-relaxed">
              Investor funds are deposited into a designated project escrow account, disbursed only against audited construction milestones.
            </p>
          </div>
          <div className="bg-white border border-line-light p-6 rounded-sm corner-ticks">
            <div className="font-serif text-[28px] text-gold mb-3 leading-none">03</div>
            <h4 className="font-serif text-[18px] text-navy mb-2">Contractual Buyback Deed</h4>
            <p className="text-[13.5px] text-ink/70 leading-relaxed">
              Fixed 3-year term buyback at ৳5,50,000 per share with institutional repurchase guarantees by AZO Group.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Escrow Architecture */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-line-light p-8 rounded-sm">
          <h4 className="font-serif text-[22px] text-navy mb-4">Milestone-Gated Financial Governance</h4>
          <p className="text-[14px] text-ink/70 leading-relaxed mb-6 max-w-[780px]">
            Capital is never exposed to speculative risks. Every taka raised is strictly tied to physical construction stages verified by independent chartered engineers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-ivory border border-line-light rounded-sm">
              <div className="eyebrow text-[9px] text-emerald-600 font-bold mb-1">STAGE 1 // COMPLETED</div>
              <div className="font-serif text-[16px] text-navy">Land Mutation</div>
              <div className="text-[11px] text-ink/50 mt-1">100% Freehold Title</div>
            </div>
            <div className="p-4 bg-ivory border border-line-light rounded-sm">
              <div className="eyebrow text-[9px] text-emerald-600 font-bold mb-1">STAGE 2 // COMPLETED</div>
              <div className="font-serif text-[16px] text-navy">Piling &amp; Soil Test</div>
              <div className="text-[11px] text-ink/50 mt-1">Bearing Test Verified</div>
            </div>
            <div className="p-4 bg-ivory border border-gold/40 rounded-sm">
              <div className="eyebrow text-[9px] text-gold font-bold mb-1">STAGE 3 // ACTIVE</div>
              <div className="font-serif text-[16px] text-navy">Superstructure</div>
              <div className="text-[11px] text-ink/50 mt-1">Floors 1 through 10</div>
            </div>
            <div className="p-4 bg-ivory border border-line-light rounded-sm">
              <div className="eyebrow text-[9px] text-ink/40 font-bold mb-1">STAGE 4 // FINAL</div>
              <div className="font-serif text-[16px] text-navy">Handover &amp; Exit</div>
              <div className="text-[11px] text-ink/50 mt-1">Buyback Disbursement</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
