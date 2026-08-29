import React, { useMemo, useRef, useState } from 'react';
import { FileSpreadsheet, Upload, AlertTriangle, CheckCircle2, Link2, ShieldCheck } from 'lucide-react';
import { InheritanceLevel, Requirement, ResponsibilityAssignment, ResponsibilityGap, SharedResponsibilityMatrix } from '../types';

interface Props {
  clientOrgId: string;
  requirements: Requirement[];
  matrices: SharedResponsibilityMatrix[];
  gaps: ResponsibilityGap[];
  onImport: (matrix: SharedResponsibilityMatrix, gaps: ResponsibilityGap[]) => Promise<void>;
  onApproveGaps: (matrixId: string) => void;
}

const columns = ['requirementId', 'objectiveId', 'inheritance', 'providerResponsibility', 'customerResponsibility', 'serviceIds', 'toolIds', 'evidenceObligations'];

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) throw new Error('The CRM must contain a header and at least one responsibility row.');
  const headers = rows[0].map(value => value.replace(/^\uFEFF/, ''));
  const missing = columns.slice(0, 5).filter(name => !headers.includes(name));
  if (missing.length) throw new Error(`Missing required columns: ${missing.join(', ')}`);
  return rows.slice(1).map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

export const ResponsibilityCenter: React.FC<Props> = ({ clientOrgId, requirements, matrices, gaps, onImport, onApproveGaps }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [providerName, setProviderName] = useState('');
  const [providerType, setProviderType] = useState<'MSP' | 'ESP' | 'CSP'>('CSP');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const objectiveIds = useMemo(() => new Set(requirements.flatMap(r => r.objectives.map(o => `${r.id}:${o.id}`))), [requirements]);

  const importFile = async (file: File) => {
    if (!providerName.trim()) { setMessage('Enter the provider name before uploading its CRM.'); return; }
    if (!file.name.toLowerCase().endsWith('.csv')) { setMessage('This first release imports CSV. Export an Excel CRM as CSV before upload.'); return; }
    setBusy(true); setMessage('');
    try {
      const rows = parseCsv(await file.text());
      const matrixId = `CRM-${Date.now()}`;
      const assignments: ResponsibilityAssignment[] = [];
      const foundGaps: ResponsibilityGap[] = [];
      rows.forEach((row, index) => {
        const inheritance = row.inheritance.toUpperCase() as InheritanceLevel;
        if (!['FULL', 'PARTIAL', 'NONE'].includes(inheritance)) throw new Error(`Row ${index + 2}: inheritance must be Full, Partial, or None.`);
        const mapped = objectiveIds.has(`${row.requirementId}:${row.objectiveId}`);
        const providerNeeded = inheritance === 'FULL' || inheritance === 'PARTIAL';
        const customerNeeded = inheritance === 'NONE' || inheritance === 'PARTIAL';
        const base = { matrixId, requirementId: row.requirementId, objectiveId: row.objectiveId, inheritance, supportingPartyOrgIds: [], toolIds: (row.toolIds || '').split(';').filter(Boolean), serviceInstanceIds: (row.serviceIds || '').split(';').filter(Boolean), evidenceObligations: (row.evidenceObligations || '').split(';').filter(Boolean) };
        assignments.push({ ...base, id: `${matrixId}-${index}-provider`, partyType: providerType, partyOrgId: providerName.trim(), responsibility: row.providerResponsibility || '' });
        assignments.push({ ...base, id: `${matrixId}-${index}-osc`, partyType: 'OSC', partyOrgId: clientOrgId, responsibility: row.customerResponsibility || '' });
        const reasons = [!mapped && 'assessment objective is not mapped', providerNeeded && !row.providerResponsibility && 'provider responsibility is missing', customerNeeded && !row.customerResponsibility && 'customer responsibility is missing', !row.evidenceObligations && 'evidence obligation is undefined'].filter(Boolean);
        if (reasons.length) foundGaps.push({ id: `RGAP-${matrixId}-${index}`, clientOrgId, matrixId, requirementId: row.requirementId, objectiveId: row.objectiveId, description: `${providerName}: ${reasons.join('; ')}`, poamEligible: mapped, linkedTaskIds: [], status: 'DRAFT', requiresHumanApproval: true });
      });
      const matrix: SharedResponsibilityMatrix = { id: matrixId, clientOrgId, providerOrgId: providerName.trim(), providerType, serviceInstanceIds: [], version: '1.0', status: foundGaps.length ? 'CLIENT_REVIEW' : 'ACCEPTED', assignments, parserConfidence: 1, importedFileName: file.name, effectiveDate: Date.now() };
      await onImport(matrix, foundGaps);
      setMessage(`Imported ${rows.length} objective rows and identified ${foundGaps.length} draft gaps.`);
    } catch (error: any) { setMessage(error?.message || 'CRM import failed.'); }
    finally { setBusy(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  return <div className="h-full overflow-y-auto bg-slate-50 p-8"><div className="mx-auto max-w-7xl space-y-7">
    <div><h1 className="text-3xl font-black tracking-tight text-slate-900">Shared Responsibility Center</h1><p className="mt-1 text-slate-500">Map each MSP, ESP, and CSP responsibility to CMMC requirements and assessment objectives.</p></div>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="grid gap-4 md:grid-cols-[1fr_180px_auto] md:items-end">
      <label className="text-sm font-bold text-slate-700">Provider name<input value={providerName} onChange={e => setProviderName(e.target.value)} placeholder="Microsoft Azure, PreVeil, MSP name…" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal" /></label>
      <label className="text-sm font-bold text-slate-700">Provider type<select value={providerType} onChange={e => setProviderType(e.target.value as any)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal"><option>CSP</option><option>ESP</option><option>MSP</option></select></label>
      <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={e => e.target.files?.[0] && importFile(e.target.files[0])} />
      <button disabled={busy} onClick={() => inputRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Upload size={17}/>{busy ? 'Importing…' : 'Upload CRM CSV'}</button>
    </div><p className="mt-4 text-xs text-slate-500">Required headers: <code>{columns.slice(0,5).join(', ')}</code>. Optional mappings use semicolon-separated service, tool, and evidence values.</p>{message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm font-medium text-slate-700">{message}</div>}</section>
    <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl border bg-white p-5"><FileSpreadsheet className="text-blue-600"/><div className="mt-3 text-3xl font-black">{matrices.length}</div><div className="text-xs font-bold uppercase text-slate-400">Provider matrices</div></div><div className="rounded-2xl border bg-white p-5"><AlertTriangle className="text-amber-500"/><div className="mt-3 text-3xl font-black">{gaps.filter(g=>g.status==='DRAFT').length}</div><div className="text-xs font-bold uppercase text-slate-400">Draft gaps</div></div><div className="rounded-2xl border bg-white p-5"><Link2 className="text-emerald-600"/><div className="mt-3 text-3xl font-black">{matrices.reduce((n,m)=>n+m.assignments.length/2,0)}</div><div className="text-xs font-bold uppercase text-slate-400">Mapped objectives</div></div></div>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b p-5 text-sm font-black uppercase tracking-wider text-slate-700">Imported responsibility matrices</div>{matrices.length===0?<div className="p-12 text-center text-slate-500">Upload the CRM for each provider that supports this client.</div>:matrices.map(matrix=>{const matrixGaps=gaps.filter(g=>g.matrixId===matrix.id);return <div key={matrix.id} className="flex flex-col gap-4 border-b p-5 last:border-0 md:flex-row md:items-center md:justify-between"><div><div className="font-bold text-slate-900">{matrix.providerOrgId} <span className="ml-2 rounded bg-slate-100 px-2 py-1 text-xs">{matrix.providerType}</span></div><div className="mt-1 text-xs text-slate-500">{matrix.importedFileName} · {matrix.assignments.length/2} objectives · {matrixGaps.length} gaps</div></div>{matrix.status==='CLIENT_REVIEW'?<button onClick={()=>onApproveGaps(matrix.id)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white"><ShieldCheck size={17}/>Approve & sync gaps</button>:<span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"><CheckCircle2 size={17}/>Accepted</span>}</div>})}</section>
  </div></div>;
};
