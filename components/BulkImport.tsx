
import React, { useState } from 'react';
import { Requirement, AssessmentObjective } from '../types';
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2, FileUp, Info, ArrowRight } from 'lucide-react';

interface BulkImportProps {
  requirements: Requirement[];
  activeFrameworkId: string;
  onBatchUpdate: (updatedReqs: Requirement[]) => void;
}

export const BulkImport: React.FC<BulkImportProps> = ({ requirements, activeFrameworkId, onBatchUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{ updated: number, errors: string[] } | null>(null);

  const activeReqs = requirements.filter(r => r.framework === activeFrameworkId);

  const handleDownloadTemplate = () => {
    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Control ID,Family,Title,Implementation Statement,Status (met/not_met/pending)\n";

    // Add all current requirements as rows
    activeReqs.forEach(req => {
      const status = req.objectives.every(o => o.status === 'met') ? 'met' : 
                     req.objectives.some(o => o.status === 'not_met') ? 'not_met' : 'pending';
      
      const row = [
        req.id,
        req.family,
        `"${req.title.replace(/"/g, '""')}"`,
        `"${(req.response || '').replace(/"/g, '""')}"`,
        status
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportResults(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processCsv(text);
    };
    reader.readAsText(file);
  };

  const processCsv = (text: string) => {
    const lines = text.split(/\r?\n/);
    const updatedReqs: Requirement[] = [];
    const errors: string[] = [];
    let updatedCount = 0;

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Naive CSV parser (handles basic quotes)
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length < 5) continue;

        const [id, family, title, response, status] = parts.map(p => p.replace(/^"|"$/g, '').trim());

        const existingReq = activeReqs.find(r => r.id === id);
        if (existingReq) {
            const cleanStatus = status.toLowerCase() as AssessmentObjective['status'];
            const validStatuses: AssessmentObjective['status'][] = ['met', 'not_met', 'pending', 'na'];
            
            const finalStatus = validStatuses.includes(cleanStatus) ? cleanStatus : 'pending';
            
            // Map the single CSV status back to all objectives for that control
            const updatedObjectives = existingReq.objectives.map(obj => ({
                ...obj,
                status: finalStatus
            }));

            updatedReqs.push({
                ...existingReq,
                response: response,
                objectives: updatedObjectives
            });
            updatedCount++;
        } else {
            errors.push(`Row ${i + 1}: Control ID "${id}" not found in ${activeFrameworkId} library.`);
        }
    }

    if (updatedReqs.length > 0) {
        onBatchUpdate(updatedReqs);
    }
    
    setImportResults({ updated: updatedCount, errors });
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 overflow-y-auto h-full">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <FileSpreadsheet className="text-green-600" size={32} /> Bulk Import Utility
        </h1>
        <p className="text-slate-600 mt-2">
          Massively update implementation statements and control statuses using an Excel-compatible CSV template.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 font-bold">1</div>
              <h3 className="font-bold text-slate-800 mb-2">Download Template</h3>
              <p className="text-xs text-slate-500 mb-6">Get a CSV file pre-populated with all {activeReqs.length} controls for the active framework.</p>
              <button 
                onClick={handleDownloadTemplate}
                className="mt-auto w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <Download size={16} /> Download CSV
              </button>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 font-bold">2</div>
              <h3 className="font-bold text-slate-800 mb-2">Edit in Excel</h3>
              <p className="text-xs text-slate-500 mb-6">Open the file in Excel or Sheets. Provide implementation narratives and set statuses.</p>
              <div className="mt-auto flex gap-2 text-blue-600">
                  <ArrowRight size={24} className="opacity-20 animate-pulse" />
                  <ArrowRight size={24} className="opacity-40 animate-pulse" />
                  <ArrowRight size={24} className="opacity-80 animate-pulse" />
              </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 font-bold">3</div>
              <h3 className="font-bold text-slate-800 mb-2">Upload Modified File</h3>
              <p className="text-xs text-slate-500 mb-6">Upload your completed spreadsheet to sync changes with the mission control.</p>
              
              <label className="mt-auto w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer">
                {isProcessing ? <Loader2 size={16} className="animate-spin"/> : <FileUp size={16} />}
                {isProcessing ? 'Processing...' : 'Upload & Sync'}
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isProcessing} />
              </label>
          </div>
      </div>

      {importResults && (
          <div className={`p-6 rounded-2xl border animate-in fade-in slide-in-from-bottom-4 duration-500 ${importResults.errors.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                  {importResults.errors.length > 0 ? <AlertTriangle className="text-amber-600" /> : <CheckCircle2 className="text-green-600" />}
                  <h3 className="font-bold text-slate-900">Import Complete</h3>
              </div>
              <p className="text-sm text-slate-700">
                  Successfully updated <strong>{importResults.updated}</strong> requirements.
              </p>
              
              {importResults.errors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-amber-200">
                      <p className="text-xs font-bold text-amber-800 uppercase mb-2">Validation Errors ({importResults.errors.length})</p>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                          {importResults.errors.map((err, idx) => (
                              <p key={idx} className="text-xs text-amber-700">• {err}</p>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      )}

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex gap-4">
          <Info className="text-indigo-600 shrink-0" size={24} />
          <div className="text-sm text-indigo-900 space-y-2">
              <p className="font-bold uppercase tracking-wider text-xs opacity-70">Important Instructions</p>
              <ul className="list-disc pl-4 space-y-1 opacity-90">
                  <li>Do not modify the <strong>Control ID</strong> column, as the system uses this to match data.</li>
                  <li>Accepted statuses: <strong>met</strong>, <strong>not_met</strong>, <strong>pending</strong>.</li>
                  <li>If you have special characters or line breaks in your narratives, wrap the text in double quotes (Excel does this automatically).</li>
              </ul>
          </div>
      </div>
    </div>
  );
};
