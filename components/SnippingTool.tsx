import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, Monitor } from 'lucide-react';

interface SnippingToolProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export const SnippingTool: React.FC<SnippingToolProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const startCapture = async () => {
      try {
        // Use getDisplayMedia to capture screen/window/tab
        const mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        
        // Handle user stopping the stream via browser UI
        mediaStream.getVideoTracks()[0].onended = () => {
           stopStream(mediaStream);
        };

      } catch (err) {
        console.error("Error accessing screen:", err);
        setError("Permission denied or cancelled. Please allow screen access to capture artifacts.");
      }
    };

    startCapture();

    return () => {
      if (stream) stopStream(stream);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopStream = (s: MediaStream) => {
    s.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  const takeSnapshot = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
        stopStream(stream); // Stop sharing after capture
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-5xl w-full relative">
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <h3 className="font-semibold flex items-center gap-2">
            <Monitor size={20} /> Artifact Snipping Tool
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="bg-black relative aspect-video flex items-center justify-center">
          {error ? (
            <div className="text-red-400 text-center p-6">
              <p className="mb-4">{error}</p>
              <button onClick={onClose} className="bg-slate-700 px-4 py-2 rounded text-white">Close</button>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              className="max-h-[60vh] w-auto object-contain" 
              autoPlay 
              muted 
            />
          )}
        </div>

        <div className="p-6 flex justify-center gap-4 bg-slate-100">
           {!error && (
             <button
              onClick={takeSnapshot}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
             >
               <Camera size={20} /> Capture Artifact
             </button>
           )}
        </div>
        
        <div className="px-6 pb-6 text-slate-500 text-sm text-center">
           Select a window or screen to share. Click "Capture Artifact" to save the current frame as evidence.
        </div>
      </div>
    </div>
  );
};
