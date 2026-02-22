import React, { useState, useEffect, useCallback } from 'react';
import { Requirement, AssessmentObjective, Artifact } from '../types';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  FileUp, 
  Info, 
  ArrowRight, 
  Paperclip, 
  FileCheck, 
  Image as ImageIcon,
  Save,
  Search,
  Check,
  ClipboardPaste,
  X,
  FileCheck2,
  ListRestart
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from "react-oidc-context";

interface BulkImportProps {
  requirements: Requirement[];
  activeFrameworkId: string;
  onBatchUpdate: (updatedReqs: Requirement[]) => void;
  activeClientId?: string;
}

interface GridItem extends Requirement {
    isUploading?: boolean;
    uploadError?: string;
    isDirty?: boolean;
    linkedFilenames?: string[]; // New: track files mentioned in CSV
}

export const BulkImport: React.FC<BulkImportProps> = ({ requirements, activeFrameworkId, onBatchUpdate, activeClientId }) => {
  const auth = useAuth();
  const [gridData, setGridData] = useState<GridItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);
  
  // Results UI
  const [syncSummary, setSyncSummary] = useState<{ textUpdates: number, filesLinked: number } | null>(null);

  useEffect(() => {
    const activeReqs = requirements.filter(r => r.framework === activeFrameworkId);
    setGridData(activeReqs.map(r => ({ ...r, isDirty: false })));
  }, [requirements, activeFrameworkId]);

  const handleDownloadTemplate = () => {
    // CSV Header with EXPLICIT Evidence column
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Control ID,Family,Title,Implementation Narrative,Status (met/not_met/pending),Evidence Filenames (Comma Separated)\n";

    gridData.forEach(req => {
      const status = req.objectives.every(o => o.status === 'met') ? 'met' : 
                     req.objectives.some(o => o.status === 'not_met') ? 'not_met' : 'pending';
      
      const row = [
        req.id,
        req.family,
        `"${req.title.replace(/"/g, '""')}"`,
        `"${(req.response || '').replace(/"/g, '""')}"`,
        status,
        "" // Users will put filenames here (e.g. screenshot1.png)
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeFrameworkId}_Bulk_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const csvFile = files.find(f => f.name.endsWith('.csv'));
    const evidenceFiles = files.filter(f => !f.name.endsWith('.csv'));

    if (!csvFile) {
        alert("Please include at least one .csv file in your selection.");
        return;
    }

    setIsProcessing(true);
    setSyncSummary(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      await processCsvBatch(text, evidenceFiles);
    };
    reader.readAsText(csvFile);
    e.target.value = '';
  };

  const processCsvBatch = async (csvText: string, providedFiles: File[]) => {
    const lines = csvText.split(/\r?\n/);
    const updatedGrid = [...gridData];
    // FIX: Using ID TOKEN
    const idToken = auth.user?.id_token;
    
    let textUpdates = 0;
    let filesLinked = 0;

    // Start index 1 to skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Smart CSV parsing (handles quotes and commas)
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length < 5) continue;

        const [id, family, title, response, status, evidenceFilesStr] = parts.map(p => p?.replace(/^"|"$/g, '').trim() || "");
        const idx = updatedGrid.findIndex(r => r.id === id);
        
        if (idx !== -1) {
            const cleanStatus = status.toLowerCase() as AssessmentObjective['status'];
            const validStatuses: AssessmentObjective['status'][] = ['met', 'not_met', 'pending', 'na'];
            const finalStatus = validStatuses.includes(cleanStatus) ? cleanStatus : 'pending';
            
            // 1. Update text fields
            updatedGrid[idx] = {
                ...updatedGrid[idx],
                response: response,
                isDirty: true,
                objectives: updatedGrid[idx].objectives.map(obj => ({ ...obj, status: finalStatus }))
            };
            textUpdates++;

            // 2. Handle file linking if filenames provided in CSV
            if (evidenceFilesStr && providedFiles.length > 0 && idToken && activeClientId) {
                const targets = evidenceFilesStr.split(',').map(f => f.trim());
                for (const targetName of targets) {
                    const matchedFile = providedFiles.find(f => f.name === targetName);
                    if (matchedFile) {
                        try {
                            // Link visual indicator to row immediately
                            updatedGrid[idx].isUploading = true;
                            setGridData([...updatedGrid]);

                            await api.uploadEvidence(idToken, activeClientId, matchedFile, id);
                            filesLinked++;
                            updatedGrid[idx].isUploading = false;
                        } catch (err) {
                            console.error(`Failed to bulk upload ${targetName}`, err);
                            updatedGrid[idx].uploadError = "Link Failed";
                        }
                    }
                }
            }
        }
    }

    setGridData(updatedGrid);
    setSyncSummary({ textUpdates, filesLinked });
    setIsProcessing(false);
  };

  const updateRow = (id: string, updates: Partial<GridItem>) => {
      setGridData(prev => prev.map(row => row.id === id ? { ...row, ...updates, isDirty: true } : row));
  };

  const handleSaveAll = async () => {
      setIsSavingAll(true);
      const dirtyRows = gridData.filter(r => r.isDirty);
      onBatchUpdate(dirtyRows);
      setGridData(prev => prev.map(r => ({ ...r, isDirty: false })));
      setIsSavingAll(false);
      setSyncSummary(null);
  };

  const handlePaste = useCallback(async (e: React.ClipboardEvent, reqId: string) => {
    const items = e.clipboardData.items;
    const idToken = auth.user?.id_token;

    if (!activeClientId || !idToken) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (!blob) continue;

        setGridData(prev => prev.map(r => r.id === reqId ? { ...r, isUploading: true, uploadError: undefined } : r));

        try {
          const file = new File([blob], `Screenshot_${new Date().getTime()}.png`, { type: blob.type });
          await api.uploadEvidence(idToken, activeClientId, file, reqId);
          setGridData(prev => prev.map(r => r.id === reqId ? { ...r, isUploading: false } : r));
        } catch (err) {
          setGridData(prev => prev.map(r => r.id === reqId ? { ...r, isUploading: false, uploadError: 'Upload Failed' } : r));
        }
      }
    }
  }, [activeClientId, auth.user]);

  const filteredData = gridData.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-8 py-4 shrink-0 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-4">
            <div className="bg-green-100 p-2 rounded-lg text-green-700">
                <FileSpreadsheet size={24} />
            </div>
            <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight">Interactive Bulk Assessment</h1>
                <p className="text-xs text-slate-500 font-medium">CSV Data Mapping & Clipboard Uploads</p>
            </div>
        </div>

        {syncSummary && (
            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-4 animate-in slide-in-from-right-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                    <FileCheck2 size={16}/> {syncSummary.textUpdates} Narratives Parsed
                </div>
                <div className="w-px h-4 bg-blue-200"></div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                    <Paperclip size={16}/> {syncSummary.filesLinked} Evidence Files Linked
                </div>
                <button onClick={() => setSyncSummary(null)} className="text-blue-400 hover:text-blue-600"><X size={14}/></button>
            </div>
        )}

        <div className="flex items-center gap-3">
             <div className="relative mr-2">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-48 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Filter..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            <button 
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold transition-colors"
                title="Download CSV with Evidence mapping column"
            >
                <Download size={16} /> Get Template
            </button>

            <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer border ${isProcessing ? 'bg-slate-100 border-slate-200 text-slate-400 pointer-events-none' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 ring-offset-2 hover:ring-2 ring-blue-500'}`}>
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {isProcessing ? 'Linking Files...' : 'Batch Upload'}
                <input type="file" multiple accept=".csv,image/*,.pdf,.doc,.docx" className="hidden" onChange={handleBatchUpload} disabled={isProcessing} />
            </label>

            <button 
                onClick={handleSaveAll}
                disabled={isSavingAll || !gridData.some(r => r.isDirty)}
                className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg hover:bg-black disabled:opacity-30 transition-all"
            >
                {isSavingAll ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
                Commit Changes
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 pt-4">
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-4 flex items-center gap-4 text-sm text-indigo-900">
             <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md"><Info size={18}/></div>
             <div className="flex-1">
                 <p className="font-bold">How to map evidence via CSV:</p>
                 <p className="opacity-80">Download the template, fill implementation details, and list your filenames (e.g. <code>screenshot1.png</code>) in the last column. Click **Batch Upload** and select both the CSV and the actual files.</p>
             </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-w-[1000px]">
            <table className="w-full text-left border-collapse table-fixed">
                <thead className="bg-slate-900 text-white sticky top-0 z-10">
                    <tr>
                        <th className="p-3 w-32 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Control ID</th>
                        <th className="p-3 w-1/4 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Status</th>
                        <th className="p-3 text-[10px] font-black uppercase tracking-widest border-r border-slate-800">Narrative</th>
                        <th className="p-3 w-56 text-[10px] font-black uppercase tracking-widest text-center">Linked Evidence</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredData.map((row) => {
                        const rowMet = row.objectives.every(o => o.status === 'met');
                        const rowGap = row.objectives.some(o => o.status === 'not_met');
                        const statusVal = rowMet ? 'met' : rowGap ? 'not_met' : 'pending';

                        return (
                            <tr 
                                key={row.id} 
                                className={`group hover:bg-blue-50/30 transition-colors ${activeRowId === row.id ? 'bg-blue-50/50' : ''}`}
                                onFocus={() => setActiveRowId(row.id)}
                            >
                                <td className="p-3 align-top border-r border-slate-100">
                                    <div className="font-mono text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors">{row.id}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{row.family}</div>
                                    {row.isDirty && <div className="text-[9px] font-black text-amber-600 uppercase mt-2 flex items-center gap-1"><Info size={10}/> Unsaved</div>}
                                </td>
                                <td className="p-3 align-top border-r border-slate-100">
                                    <div className="space-y-3">
                                        <select 
                                            className={`w-full text-xs font-bold py-1 px-2 rounded-lg border-2 appearance-none outline-none ${
                                                statusVal === 'met' ? 'bg-green-50 border-green-200 text-green-700' :
                                                statusVal === 'not_met' ? 'bg-red-50 border-red-200 text-red-700' :
                                                'bg-slate-50 border-slate-200 text-slate-500'
                                            }`}
                                            value={statusVal}
                                            onChange={(e) => {
                                                const s = e.target.value as any;
                                                updateRow(row.id, { objectives: row.objectives.map(o => ({ ...o, status: s })) });
                                            }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="met">Met</option>
                                            <option value="not_met">Not Met</option>
                                        </select>
                                        <div className="text-[10px] font-bold text-slate-800 leading-tight line-clamp-1">{row.title}</div>
                                    </div>
                                </td>
                                <td className="p-2 align-top border-r border-slate-100">
                                    <textarea 
                                        className="w-full h-16 bg-transparent text-xs p-2 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-lg resize-none transition-all font-medium text-slate-700"
                                        placeholder="Describe implementation..."
                                        value={row.response || ''}
                                        onChange={(e) => updateRow(row.id, { response: e.target.value })}
                                    />
                                </td>
                                <td className="p-2 align-top bg-slate-50/50">
                                    <div 
                                        className={`relative h-16 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
                                            row.isUploading ? 'border-blue-400 bg-blue-50' : 
                                            activeRowId === row.id ? 'border-blue-400 bg-white shadow-inner' : 'border-slate-200 group-hover:border-slate-300'
                                        }`}
                                        onPaste={(e) => handlePaste(e, row.id)}
                                        tabIndex={0}
                                        onClick={() => setActiveRowId(row.id)}
                                    >
                                        {row.isUploading ? (
                                            <div className="flex flex-col items-center">
                                                <Loader2 className="animate-spin text-blue-600 mb-1" size={16} />
                                                <span className="text-[9px] font-black text-blue-600 uppercase">Syncing...</span>
                                            </div>
                                        ) : row.uploadError ? (
                                            <div className="flex flex-col items-center text-red-500">
                                                <AlertTriangle size={16} className="mb-1" />
                                                <span className="text-[9px] font-bold uppercase">{row.uploadError}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                                <ClipboardPaste size={16} className="mb-1 opacity-40 group-hover:opacity-100" />
                                                <span className="text-[8px] font-black uppercase text-center leading-tight">
                                                    Paste Image<br/>(Ctrl+V)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>

      <div className="bg-slate-900 px-8 py-3 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> 
                  Organization Scope: <span className="text-white uppercase">{activeClientId}</span>
              </div>
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <FileCheck2 size={12}/> Bulk Evidence Engine v1.5
          </div>
      </div>
    </div>
  );
};
