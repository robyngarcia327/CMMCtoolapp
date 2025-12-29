
import React, { useState } from 'react';
import { Requirement, AssessmentObjective, Artifact } from '../types';
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2, FileUp, Info, ArrowRight, Paperclip, FileCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from "react-oidc-context";

interface BulkImportProps {
  requirements: Requirement[];
  activeFrameworkId: string;
  onBatchUpdate: (updatedReqs: Requirement[]) => void;
  activeClientId?: string;
}

export const BulkImport: React.FC<BulkImportProps> = ({ requirements, activeFrameworkId, onBatchUpdate, activeClientId }) => {
  const auth = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{ updated: number, artifactsUploaded: number, errors: string[] } | null>(null);

  const activeReqs = requirements.filter(r => r.framework === activeFrameworkId);

  const handleDownloadTemplate = () => {
    // CSV Header with new Evidence Filenames column
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Control ID,Family,Title,Implementation Statement,Status (met/not_met/pending),Evidence Filenames (Comma Separated)\n";

    // Add all current requirements as rows
    activeReqs.forEach(req => {
      const status = req.objectives.every(o => o.status === 'met') ? 'met' : 
                     req.objectives.some(o => o.status === 'not_met') ? 'not_met' : 'pending';
      
      const row = [
        req.id,
        req.family,
        `"${req.title.replace(/"/g, '""')}"`,
        `"${(req.response || '').replace(/"/g, '""')}"`,
        status,
        "" // Placeholder for filenames
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
    // Fix: Explicitly type 'files' as File[] to resolve 'unknown' type inference issues in following operations (Line 53)
    const files: File[] = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Fix: Using typed 'files' array ensures 'f' is correctly identified as File (Line 56)
    const csvFile = files.find(f => f.name.endsWith('.csv'));
    if (!csvFile) {
        alert("Please ensure at least one .csv file is selected.");
        return;
    }

    // Fix: Filtering typed 'files' array results in correct File[] type for 'artifactFiles' (Line 62)
    const artifactFiles = files.filter(f => !f.name.endsWith('.csv'));

    setIsProcessing(true);
    setImportResults(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Fix: 'artifactFiles' is now correctly identified as File[] (Line 70)
      processBatch(text, artifactFiles);
    };
    // Fix: 'csvFile' is now correctly identified as a File (which is a Blob) (Line 72)
    reader.readAsText(csvFile);
  };

  const processBatch = async (csvText: string, providedFiles: File[]) => {
    const lines = csvText.split(/\r?\n/);
    const updatedReqs: Requirement[] = [];
    const errors: string[] = [];
    let updatedCount = 0;
    let artifactCount = 0;

    const idToken = auth.user?.id_token;

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Naive CSV parser (handles basic quotes)
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length < 5) continue;

        const [id, family, title, response, status, evidenceFilesStr] = parts.map(p => p?.replace(/^"|"$/g, '').trim() || "");

        const existingReq = activeReqs.find(r => r.id === id);
        if (existingReq) {
            const cleanStatus = status.toLowerCase() as AssessmentObjective['status'];
            const validStatuses: AssessmentObjective['status'][] = ['met', 'not_met', 'pending', 'na'];
            const finalStatus = validStatuses.includes(cleanStatus) ? cleanStatus : 'pending';
            
            const updatedObjectives = existingReq.objectives.map(obj => ({
                ...obj,
                status: finalStatus
            }));

            // Handle Evidence Mapping if files provided
            if (evidenceFilesStr && providedFiles.length > 0 && idToken && activeClientId) {
                const filenamesToMatch = evidenceFilesStr.split(',').map(f => f.trim());
                for (const fname of filenamesToMatch) {
                    const matchedFile = providedFiles.find(f => f.name === fname);
                    if (matchedFile) {
                        try {
                            await api.uploadEvidence(idToken, activeClientId, matchedFile, id);
                            artifactCount++;
                        } catch (uploadErr) {
                            errors.push(`Row ${i + 1}: Failed to upload ${fname}.`);
                        }
                    } else {
                        errors.push(`Row ${i + 1}: Filename "${fname}" listed in CSV but not found in upload batch.`);
                    }
                }
            } else if (evidenceFilesStr && providedFiles.length === 0) {
                errors.push(`Row ${i + 1}: Filenames listed but no evidence files were selected for upload.`);
            }

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
    
    setImportResults({ updated: updatedCount, artifactsUploaded: artifactCount, errors });
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 overflow-y-auto h-full">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <FileSpreadsheet className="text-green-600" size={32} /> Smart Bulk Import
        </h1>
        <p className="text-slate-600 mt-2">
          Update implementation statements, statuses, and **upload evidence files** in a single batch.
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
              <h3 className="font-bold text-slate-800 mb-2">Populate & Map</h3>
              <p className="text-xs text-slate-500 mb-6">Enter implementation narratives. In the 'Evidence Filenames' column, type the names of the files you want to link.</p>
              <div className="mt-auto flex gap-2 text-blue-600">
                  <ArrowRight size={24} className="opacity-20 animate-pulse" />
                  <ArrowRight size={24} className="opacity-40 animate-pulse" />
                  <ArrowRight size={24} className="opacity-80 animate-pulse" />
              </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 font-bold">3</div>
              <h3 className="font-bold text-slate-800 mb-2">Batch Upload</h3>
              <p className="text-xs text-slate-500 mb-6">Select your CSV **and** all the evidence files listed in it at the same time.</p>
              
              <label className="mt-auto w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer ring-offset-2 hover:ring-2 ring-blue-500">
                {isProcessing ? <Loader2 size={16} className="animate-spin"/> : <FileUp size={16} />}
                {isProcessing ? 'Linking Data...' : 'Select Files'}
                <input type="file" multiple accept=".csv,image/*,.pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileUpload} disabled={isProcessing} />
              </label>
          </div>
      </div>

      {importResults && (
          <div className={`p-6 rounded-2xl border animate-in fade-in slide-in-from-bottom-4 duration-500 ${importResults.errors.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                  {importResults.errors.length > 0 ? <AlertTriangle className="text-amber-600" /> : <CheckCircle2 className="text-green-600" />}
                  <h3 className="font-bold text-slate-900">Batch Processing Complete</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                      <div className="bg-blue-600 text-white p-2 rounded-lg"><FileSpreadsheet size={20}/></div>
                      <div>
                          <div className="text-2xl font-black text-slate-900">{importResults.updated}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase">Controls Updated</div>
                      </div>
                  </div>
                   <div className="bg-white/50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                      <div className="bg-indigo-600 text-white p-2 rounded-lg"><Paperclip size={20}/></div>
                      <div>
                          <div className="text-2xl font-black text-slate-900">{importResults.artifactsUploaded}</div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase">Evidence Files Linked</div>
                      </div>
                  </div>
              </div>
              
              {importResults.errors.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-amber-200">
                      <p className="text-xs font-bold text-amber-800 uppercase mb-2 flex items-center gap-2"><AlertTriangle size={14}/> Validation Notices ({importResults.errors.length})</p>
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
          <FileCheck className="text-indigo-600 shrink-0" size={24} />
          <div className="text-sm text-indigo-900 space-y-2">
              <p className="font-bold uppercase tracking-wider text-xs opacity-70">Bulk Evidence Logic</p>
              <ul className="list-disc pl-4 space-y-1 opacity-90">
                  <li><strong>Matching:</strong> The system looks for exact filename matches (e.g., <code>Screen_1.png</code>).</li>
                  <li><strong>Multiple Selection:</strong> In Step 3, hold <code>Ctrl</code> (Windows) or <code>Cmd</code> (Mac) to select both the CSV and the folders/files.</li>
                  <li><strong>Status:</strong> If you mark a row as <code>met</code>, but don't provide evidence files, it will still update the status, but the control health score may reflect missing documentation.</li>
              </ul>
          </div>
      </div>
    </div>
  );
};
