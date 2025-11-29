import React, { useState } from 'react';
import { Paperclip, Image as ImageIcon, X, FileText, Trash2 } from 'lucide-react';
import { Artifact } from '../types';
import { SnippingTool } from './SnippingTool';

interface ArtifactUploaderProps {
  requirementId: string;
  artifacts: Artifact[];
  onAddArtifact: (artifact: Artifact) => void;
  onRemoveArtifact: (id: string) => void;
}

export const ArtifactUploader: React.FC<ArtifactUploaderProps> = ({
  requirementId,
  artifacts,
  onAddArtifact,
  onRemoveArtifact,
}) => {
  const [showSnipper, setShowSnipper] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For demo, creating a fake URL. In real app, upload to S3/Blob storage
    const mockUrl = URL.createObjectURL(file);
    
    const newArtifact: Artifact = {
      id: Date.now().toString(),
      requirementId,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      url: mockUrl,
      timestamp: Date.now(),
    };
    onAddArtifact(newArtifact);
    e.target.value = ''; // reset
  };

  const handleSnipCapture = (dataUrl: string) => {
    const newArtifact: Artifact = {
      id: Date.now().toString(),
      requirementId,
      name: `Screen_Capture_${new Date().toLocaleTimeString()}.png`,
      type: 'image',
      url: dataUrl,
      timestamp: Date.now(),
    };
    onAddArtifact(newArtifact);
    setShowSnipper(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-colors text-sm font-medium">
          <Paperclip size={16} />
          Upload File
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
        
        <button
          onClick={() => setShowSnipper(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 transition-colors text-sm font-medium"
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
                {art.type === 'image' && (
                    <a href={art.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">View</a>
                )}
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
