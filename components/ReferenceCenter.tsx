import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, BookOpen, ExternalLink, Search, ShieldCheck } from 'lucide-react';
import { CMMC_REFERENCES, PREPARATION_PHASES, REFERENCE_LAST_REVIEWED, ReferenceAuthority, ReferencePhase } from '../data/cmmcReferences';

const authorityStyles: Record<ReferenceAuthority, string> = {
  Controlling: 'bg-red-50 text-red-700 border-red-200',
  Assessment: 'bg-blue-50 text-blue-700 border-blue-200',
  Implementation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Category-specific': 'bg-amber-50 text-amber-700 border-amber-200',
  Historical: 'bg-slate-100 text-slate-600 border-slate-200',
};

interface ReferenceCenterProps {
  isMspEdition?: boolean;
}

export const ReferenceCenter: React.FC<ReferenceCenterProps> = ({ isMspEdition = false }) => {
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState<ReferencePhase | 'All'>('All');
  const [authority, setAuthority] = useState<ReferenceAuthority | 'All'>('All');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CMMC_REFERENCES.filter(reference =>
      (phase === 'All' || reference.phases.includes(phase)) &&
      (authority === 'All' || reference.authority === authority) &&
      (!needle || [reference.title, reference.citation, reference.publisher, reference.summary, ...reference.phases]
        .join(' ').toLowerCase().includes(needle))
    );
  }, [query, phase, authority]);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
      <section className="rounded-3xl bg-slate-950 text-white p-7 lg:p-9 overflow-hidden relative">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-coral-600/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-coral-400 text-[10px] font-black uppercase tracking-[0.24em] mb-4">
            <ShieldCheck size={16} /> Authoritative source library
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">CMMC & CUI Reference Center</h1>
          <p className="mt-3 max-w-3xl text-slate-300 leading-relaxed">
            Trace each preparation decision to controlling law, contract clauses, assessment criteria, or implementation guidance.
            Sources are classified by authority so guidance is never mistaken for a binding requirement.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-white/10 px-3 py-1.5">{CMMC_REFERENCES.length} references</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">Reviewed {REFERENCE_LAST_REVIEWED}</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">CMMC Level 2 baseline: NIST SP 800-171 Rev. 2</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex gap-4">
        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={22} />
        <div>
          <h2 className="font-black text-amber-950">Current program notice</h2>
          <p className="text-sm text-amber-900 mt-1 leading-relaxed">
            DoD suspended the scheduled CMMC Phase II rollout on July 13, 2026. Phase I self-assessment requirements remain in place.
            The underlying DFARS 252.204-7012 and NIST SP 800-171 obligations are not canceled.{' '}
            {isMspEdition
              ? 'Confirm current status on the official DoD resource page before advising a managed client.'
              : 'Confirm current status on the official DoD resource page before making compliance decisions.'}
          </p>
          <a className="inline-flex items-center gap-1.5 mt-3 text-xs font-black text-amber-800 hover:text-amber-950" href="https://dodcio.defense.gov/CMMC/Resources-Documentation/" target="_blank" rel="noreferrer">
            Verify with DoD <ExternalLink size={13} />
          </a>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-coral-600">Preparation lifecycle</div>
          <h2 className="text-2xl font-black text-slate-950 mt-1">Start with risk, then establish and prove compliance</h2>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
          {PREPARATION_PHASES.map((item, index) => (
            <button key={item.id} onClick={() => setPhase(item.id)}
              className="text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-coral-300 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-black text-sm text-slate-900">{item.title}</h3>
                {index < PREPARATION_PHASES.length - 1 && <ArrowRight size={15} className="text-slate-300 group-hover:text-coral-500" />}
              </div>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">{item.outcome}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="p-5 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            <label className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-3 text-slate-400" />
              <input value={query} onChange={event => setQuery(event.target.value)}
                placeholder="Search title, citation, publisher, phase, or topic"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100" />
            </label>
            <select value={phase} onChange={event => setPhase(event.target.value as ReferencePhase | 'All')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">
              <option value="All">All phases</option>
              {PREPARATION_PHASES.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>
            <select value={authority} onChange={event => setAuthority(event.target.value as ReferenceAuthority | 'All')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">
              <option value="All">All authority types</option>
              {Object.keys(authorityStyles).map(item => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="mt-3 text-xs text-slate-500">{filtered.length} matching references</div>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.map(reference => (
            <article key={reference.id} className="p-5 hover:bg-slate-50/70">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`border rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${authorityStyles[reference.authority]}`}>
                      {reference.authority}
                    </span>
                    {reference.status !== 'Current' && (
                      <span className="border border-amber-200 bg-amber-50 text-amber-700 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider">
                        {reference.status}
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-950">{reference.title}</h3>
                  <p className="text-xs font-bold text-coral-700 mt-0.5">{reference.citation} · {reference.publisher}</p>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{reference.summary}</p>
                  {reference.note && <p className="text-xs text-amber-800 bg-amber-50 rounded-lg px-3 py-2 mt-3">{reference.note}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {reference.phases.map(item => <span key={item} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">{item}</span>)}
                  </div>
                </div>
                <a href={reference.url} target="_blank" rel="noreferrer"
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white hover:bg-coral-600">
                  Open source <ExternalLink size={14} />
                </a>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="p-14 text-center text-slate-400">
              <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
              <p className="font-bold">No references match these filters.</p>
              <button onClick={() => { setQuery(''); setPhase('All'); setAuthority('All'); }} className="mt-3 text-xs font-black text-coral-600">Clear filters</button>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-100 p-5 text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-900">Authority rule:</strong> Apply statute, contract language, current CFR, and current FAR/DFARS first; then incorporated NIST standards and official DoD guidance.
        Implementation publications support decisions but do not independently create a contractual obligation. Category-specific CUI and export-control authorities require contract- and data-specific review.
      </section>
    </div>
  );
};
