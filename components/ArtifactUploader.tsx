import React, { useState } from 'react';
import { Paperclip, Image as ImageIcon, X, FileText, Trash2, Loader2 } from 'lucide-react';
import { Artifact } from '../types';
import { SnippingTool } from './SnippingTool';
import { api } from '../services/api';
import { useAuth } from "react-oidc-context";

interface ArtifactUploaderProps {
  requirementId: string;
  artifacts: Artifact[];
  onAddArtifact: (artifact: Artifact) => void;
  onRemoveArtifact: (id: string) => void;
  activeClientId?: string; // Needed for API calls
}

export const ArtifactUploader: React.FC<ArtifactUploaderProps> = ({
  requirementId,
  artifacts,
  onAddArtifact,
  onRemoveArtifact,
  activeClientId
}) => {
  const auth = useAuth();
  const [showSnipper, setShowSnipper] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const accessToken = auth.user?.access_token;
    
    if (!file || !activeClientId || !accessToken) return;

    setIsUploading(true);
    try {
        // FIX: Strictly using Access Token for all API calls
        const newArtifact = await api.uploadEvidence(
            accessToken,
            activeClientId,
            file,
            requirementId
        );
        onAddArtifact(newArtifact);
    } catch (error: any) {
        console.error("Upload failed", error);
        alert(error.message || "Failed to upload file to secure storage. Please try again.");
    } finally {
        setIsUploading(false);
        e.target.value = ''; // reset input
    }
  };

  const handleSnipCapture = async (dataUrl: string) => {
    const accessToken = auth.user?.access_token;
    if (!activeClientId || !accessToken) return;

    // Convert Data URL to File
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `Screen_Capture_${new Date().getTime()}.png`, { type: 'image/png' });

    setIsUploading(true);
    try {
        const newArtifact = await api.uploadEvidence(
            accessToken,
            activeClientId,
            file,
            requirementId
        );
        onAddArtifact(newArtifact);
        setShowSnipper(false);
    } catch (error: any) {
        console.error("Upload failed", error);
        alert(error.message || "Failed to upload screenshot.");
    } finally {
        setIsUploading(false);
    }
  };

  const handleDownload = async (artifact: Artifact) => {
      const accessToken = auth.user?.access_token;
      if (!activeClientId || !accessToken) return;
      try {
          const downloadUrl = await api.getDownloadUrl(accessToken, activeClientId, artifact.id);
          window.open(downloadUrl, '_blank');
      } catch (e: any) {
          alert(e.message || "Failed to retrieve secure download link.");
      }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-colors text-sm font-medium ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {isUploading ? <Loader2 size={16} className="animate-spin"/> : <Paperclip size={16} />}
          {isUploading ? 'Uploading...' : 'Upload File'}
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
        
        <button
          onClick={() => setShowSnipper(true)}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <ImageIcon size={16} />
          Snipping Tool
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {artifacts.length === 0 && (
          <p className="text-sm text-slate-400 italic">No artifacts uploaded yet.</p>
        )}
        {artifacts.map((art) => (
          <div key={art.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-slate-100 p-2 rounded">
                {art.type === 'image' ? <ImageIcon size={18} className="text-blue-500" /> : <FileText size={18} className="text-orange-500" />}
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-800 truncate">{art.name}</p>
                <p className="text-xs text-slate-500">{new Date(art.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => handleDownload(art)}
                    className="text-xs text-blue-600 hover:underline px-2"
                >
                    View
                </button>
                <button onClick={() => onRemoveArtifact(art.id)} className="text-slate-400 hover:text-red-500 p-1">
                    <Trash2 size={16} />
                </button>
            </div>
          </div>
        ))}
      </div>

      {showSnipper && (
        <SnippingTool onCapture={handleSnipCapture} onClose={() => setShowSnipper(false)} />
      )}
    </div>
  );
};
