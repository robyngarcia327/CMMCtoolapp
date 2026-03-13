import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Upload, 
  Download, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  Trash2,
  Lock,
  Users,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { api } from '../services/api';

interface SharedDocument {
  id: string;
  name: string;
  ownerId: string;
  ownerEmail: string;
  recipientEmail: string;
  status: 'pending' | 'approved' | 'declined';
  uploadDate: string;
  fileSize: number;
  mimeType: string;
}

export const SecureVault: React.FC = () => {
  const auth = useAuth();
  const [myDocs, setMyDocs] = useState<SharedDocument[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<SharedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    recipientEmail: '',
    file: null as File | null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-docs' | 'shared-with-me'>('my-docs');

  const userEmail = auth.user?.profile.email;

  useEffect(() => {
    if (userEmail) {
      fetchDocs();
    }
  }, [userEmail]);

  const fetchDocs = async () => {
    if (!userEmail || !auth.user?.id_token) return;
    setIsLoading(true);
    try {
      const [myDocs, sharedDocs] = await Promise.all([
        api.getVaultMyDocuments(auth.user.id_token, userEmail),
        api.getVaultSharedWithMe(auth.user.id_token, userEmail)
      ]);
      
      setMyDocs(myDocs);
      setSharedWithMe(sharedDocs);
    } catch (error) {
      console.error("Failed to fetch documents", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.recipientEmail || !auth.user?.id_token) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      
      try {
        await api.shareVaultDocument(auth.user!.id_token!, {
          name: uploadData.file!.name,
          ownerId: auth.user?.profile.sub,
          ownerEmail: userEmail,
          recipientEmail: uploadData.recipientEmail,
          fileSize: uploadData.file!.size,
          mimeType: uploadData.file!.type,
          content: base64
        });

        setIsUploading(false);
        setUploadData({ recipientEmail: '', file: null });
        fetchDocs();
      } catch (error) {
        console.error("Upload failed", error);
      }
    };
    reader.readAsDataURL(uploadData.file);
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'declined') => {
    if (!auth.user?.id_token || !userEmail) return;
    try {
      await api.updateVaultStatus(auth.user.id_token, id, status, userEmail);
      fetchDocs();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const handleDownload = async (id: string) => {
    if (!auth.user?.id_token || !userEmail) return;
    try {
      const data = await api.downloadVaultDocument(auth.user.id_token, id, userEmail);
      const link = document.createElement('a');
      link.href = data.content;
      link.download = data.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!auth.user?.id_token || !userEmail) return;
    if (!confirm("Are you sure you want to delete this document? This will remove it for both you and the recipient.")) return;
    try {
      await api.deleteVaultDocument(auth.user.id_token, id, userEmail);
      fetchDocs();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Shield className="text-blue-600" size={28} />
            Secure Document Vault
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Encrypted end-to-end document sharing with organizational approval workflows.
          </p>
        </div>
        <button 
          onClick={() => setIsUploading(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          <Plus size={18} />
          Share Document
        </button>
      </div>

      {/* Tabs */}
      <div className="px-8 mt-6 shrink-0">
        <div className="flex gap-1 bg-slate-200/50 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('my-docs')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'my-docs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            My Shared Items
          </button>
          <button 
            onClick={() => setActiveTab('shared-with-me')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'shared-with-me' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Shared With Me
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {(activeTab === 'my-docs' ? myDocs : sharedWithMe).length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="text-slate-400" size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase">No Documents Found</h3>
                <p className="text-slate-500 text-sm max-w-xs mt-2">
                  {activeTab === 'my-docs' 
                    ? "You haven't shared any documents yet. Start by clicking 'Share Document'."
                    : "No one has shared any documents with you yet."}
                </p>
              </div>
            ) : (
              (activeTab === 'my-docs' ? myDocs : sharedWithMe).map(doc => (
                <div key={doc.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">{doc.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {formatFileSize(doc.fileSize)}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            {activeTab === 'my-docs' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                            {activeTab === 'my-docs' ? `To: ${doc.recipientEmail}` : `From: ${doc.ownerEmail}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                        doc.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        doc.status === 'declined' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {doc.status === 'approved' && <CheckCircle2 size={14} />}
                        {doc.status === 'declined' && <XCircle size={14} />}
                        {doc.status === 'pending' && <Clock size={14} />}
                        {doc.status}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {activeTab === 'shared-with-me' && doc.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(doc.id, 'approved')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Approve Sharing"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(doc.id, 'declined')}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              title="Decline Sharing"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                        
                        {(doc.status === 'approved' || doc.ownerEmail === userEmail) && (
                          <button 
                            onClick={() => handleDownload(doc.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Download Securely"
                          >
                            <Download size={20} />
                          </button>
                        )}

                        {doc.ownerEmail === userEmail && (
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete Document"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Share2 size={24} />
                </div>
                <button 
                  onClick={() => setIsUploading(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Share Document</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Securely transfer sensitive files to verified recipients.</p>
            </div>

            <form onSubmit={handleUpload} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Recipient Email</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="colleague@organization.com"
                    value={uploadData.recipientEmail}
                    onChange={e => setUploadData({...uploadData, recipientEmail: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Select File</label>
                <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="text-slate-400 mb-2" size={24} />
                    <p className="text-xs font-bold text-slate-500">
                      {uploadData.file ? uploadData.file.name : "Click to upload or drag and drop"}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={e => setUploadData({...uploadData, file: e.target.files?.[0] || null})}
                  />
                </label>
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                <Lock className="text-blue-600 shrink-0" size={20} />
                <p className="text-[10px] font-bold text-blue-700 leading-relaxed">
                  Files are encrypted before transmission. The recipient must manually approve the sharing request before they can access the content.
                </p>
              </div>

              <button 
                type="submit"
                disabled={!uploadData.file || !uploadData.recipientEmail}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
              >
                Initiate Secure Share
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
