import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Users, 
  Lock, 
  Globe, 
  FileJson, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ChevronRight,
  ExternalLink,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Key,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TenantInsightsProps {
  organizationId: string;
}

interface M365User {
  Id: string;
  DisplayName: string;
  UserPrincipalName: string;
  AccountEnabled: boolean;
  CreatedDateTime: string;
  UserType: string;
  IsMfaRegistered?: boolean;
  DefaultMfaMethod?: string;
}

interface CAPolicy {
  id: string;
  displayName: string;
  state: string;
  conditions: any;
  grantControls: any;
}

export const TenantInsights: React.FC<TenantInsightsProps> = ({ organizationId }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'security' | 'scripts'>('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState<{
    users: M365User[];
    policies: CAPolicy[];
    org: any;
    roles: any[];
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    const newData: any = { ...mockData };

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();

        if (file.name === 'organization.json') {
          const org = JSON.parse(text);
          newData.org = Array.isArray(org) ? org[0] : org;
        } else if (file.name === 'conditional_access_policies.json') {
          newData.policies = JSON.parse(text);
        } else if (file.name === 'users.csv') {
          // Simple CSV parser
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
          newData.users = lines.slice(1).filter(l => l.trim()).map(line => {
            const values = line.split(',').map(v => v.replace(/"/g, '').trim());
            const user: any = {};
            headers.forEach((header, index) => {
              user[header] = values[index];
            });
            return user;
          });
        } else if (file.name === 'mfa_registration.csv') {
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
          const mfaData = lines.slice(1).filter(l => l.trim()).map(line => {
            const values = line.split(',').map(v => v.replace(/"/g, '').trim());
            const item: any = {};
            headers.forEach((header, index) => {
              item[header] = values[index];
            });
            return item;
          });

          // Merge MFA data into users
          if (newData.users) {
            newData.users = newData.users.map((u: any) => {
              const mfa = mfaData.find(m => m.UserPrincipalName === u.UserPrincipalName);
              if (mfa) {
                return {
                  ...u,
                  IsMfaRegistered: mfa.IsMfaRegistered === 'True',
                  DefaultMfaMethod: mfa.DefaultMfaMethod
                };
              }
              return u;
            });
          }
        } else if (file.name === 'directory_roles.csv') {
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
          newData.roles = lines.slice(1).filter(l => l.trim()).map(line => {
            const values = line.split(',').map(v => v.replace(/"/g, '').trim());
            const role: any = {};
            headers.forEach((header, index) => {
              role[header] = values[index];
            });
            return role;
          });
        }
      }
      setUploadedData(newData);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const psScript = `# .SYNOPSIS
#  Export core Microsoft 365 / Entra evidence useful for CMMC readiness.
# .NOTES
#  Requires Microsoft Graph PowerShell SDK.

param(
    [string]$OutputPath = "C:\\CMMC\\Client\\output\\M365",
    [switch]$UseDeviceCode
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force -Path $OutputPath | Out-Null

$requiredModules = @(
    "Microsoft.Graph.Authentication",
    "Microsoft.Graph.Users",
    "Microsoft.Graph.Identity.DirectoryManagement",
    "Microsoft.Graph.Identity.SignIns",
    "Microsoft.Graph.Reports"
)

foreach ($m in $requiredModules) {
    if (-not (Get-Module -ListAvailable -Name $m)) {
        Install-Module $m -Scope CurrentUser -Force -AllowClobber
    }
}

Import-Module Microsoft.Graph.Authentication
Import-Module Microsoft.Graph.Users
Import-Module Microsoft.Graph.Identity.DirectoryManagement
Import-Module Microsoft.Graph.Identity.SignIns
Import-Module Microsoft.Graph.Reports

$scopes = @(
    "Directory.Read.All",
    "User.Read.All",
    "Policy.Read.All",
    "AuditLog.Read.All",
    "Reports.Read.All",
    "Organization.Read.All"
)

if ($UseDeviceCode) {
    Connect-MgGraph -Scopes $scopes -UseDeviceCode
} else {
    Connect-MgGraph -Scopes $scopes
}

$ctx = Get-MgContext
Write-Host "Connected to tenant: $($ctx.TenantId)"

# Organization
Get-MgOrganization | ConvertTo-Json -Depth 5 | Out-File "$OutputPath\\organization.json" -Encoding utf8

# Users
Get-MgUser -All -Property Id,DisplayName,UserPrincipalName,AccountEnabled,CreatedDateTime,UserType |
    Select-Object Id,DisplayName,UserPrincipalName,AccountEnabled,CreatedDateTime,UserType |
    Export-Csv "$OutputPath\\users.csv" -NoTypeInformation

# Directory roles
Get-MgDirectoryRole | Select-Object Id,DisplayName,Description |
    Export-Csv "$OutputPath\\directory_roles.csv" -NoTypeInformation

# Conditional Access policies
Get-MgIdentityConditionalAccessPolicy | ConvertTo-Json -Depth 25 |
    Out-File "$OutputPath\\conditional_access_policies.json" -Encoding utf8

# Named locations
Get-MgIdentityConditionalAccessNamedLocation | ConvertTo-Json -Depth 10 |
    Out-File "$OutputPath\\named_locations.json" -Encoding utf8

# MFA registration summary
try {
    Get-MgReportAuthenticationMethodUserRegistrationDetail -All |
        Select-Object UserPrincipalName,IsMfaCapable,IsMfaRegistered,IsPasswordlessCapable,IsSsprEnabled,DefaultMfaMethod |
        Export-Csv "$OutputPath\\mfa_registration.csv" -NoTypeInformation
} catch {
    Write-Warning "Could not export MFA registration detail: $($_.Exception.Message)"
}

Disconnect-MgGraph
Write-Host "Export complete: $OutputPath"`;

  const handleDownloadScript = () => {
    const blob = new Blob([psScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Export-M365Evidence.ps1';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const mockData = useMemo(() => ({
    org: {
      displayName: "Cuallee Cyber Defense",
      id: "72f988bf-86f1-41af-91ab-2d7cd011db47",
      verifiedDomains: ["cualleecyber.com", "cuallee.onmicrosoft.com"]
    },
    users: [
      { Id: "1", DisplayName: "Robyn Garcia", UserPrincipalName: "robyngarcia327@gmail.com", AccountEnabled: true, CreatedDateTime: "2024-01-15", UserType: "Member", IsMfaRegistered: true, DefaultMfaMethod: "Microsoft Authenticator" },
      { Id: "2", DisplayName: "John Smith", UserPrincipalName: "jsmith@cualleecyber.com", AccountEnabled: true, CreatedDateTime: "2024-02-10", UserType: "Member", IsMfaRegistered: true, DefaultMfaMethod: "SMS" },
      { Id: "3", DisplayName: "External Auditor", UserPrincipalName: "auditor@external.com", AccountEnabled: true, CreatedDateTime: "2024-03-05", UserType: "Guest", IsMfaRegistered: false, DefaultMfaMethod: "None" },
    ],
    policies: [
      { id: "p1", displayName: "MFA for All Users", state: "enabled", conditions: { users: "All" }, grantControls: { builtInControls: ["mfa"] } },
      { id: "p2", displayName: "Block Legacy Authentication", state: "enabled", conditions: { clientAppTypes: ["other"] }, grantControls: { builtInControls: ["block"] } },
      { id: "p3", displayName: "Require Compliant Device", state: "enabledForReportingButNotEnforced", conditions: { platforms: ["All"] }, grantControls: { builtInControls: ["compliantDevice"] } },
    ],
    roles: [
      { Id: "r1", DisplayName: "Global Administrator", Description: "Can manage all aspects of Azure AD and Microsoft services." },
      { Id: "r2", DisplayName: "Security Administrator", Description: "Can read security information and reports, and manage configuration." },
    ]
  }), []);

  const data = uploadedData || mockData;

  const mfaStats = useMemo(() => {
    const total = data.users.length;
    const registered = data.users.filter(u => u.IsMfaRegistered).length;
    const percentage = Math.round((registered / total) * 100);
    return { total, registered, percentage };
  }, [data]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Shield className="text-coral-500" size={32} />
            Tenant Insights
          </h1>
          <p className="text-slate-400 mt-1">Microsoft 365 & Entra ID Configuration Evidence</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsUploading(true)}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-700 transition-all border border-slate-700"
          >
            <Upload size={16} /> Upload Evidence
          </button>
          <button 
            onClick={handleDownloadScript}
            className="bg-coral-500 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-coral-600 transition-all shadow-lg shadow-coral-500/20"
          >
            <Download size={16} /> Download PS Script
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 mb-8 w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'users', label: 'Users & MFA', icon: Users },
          { id: 'security', label: 'Security Policies', icon: Lock },
          { id: 'scripts', label: 'Automation', icon: FileJson },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Org Card */}
            <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white font-black uppercase text-sm tracking-widest mb-1">Organization Profile</h3>
                  <p className="text-slate-500 text-xs">Verified tenant information from Microsoft Graph</p>
                </div>
                <div className="bg-coral-500/10 p-2 rounded-lg">
                  <Globe className="text-coral-500" size={20} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Display Name</label>
                  <p className="text-white font-bold">{data.org.displayName}</p>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Tenant ID</label>
                  <p className="text-slate-300 font-mono text-xs break-all">{data.org.id}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1">Verified Domains</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.org.verifiedDomains.map((domain: string) => (
                      <span key={domain} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold border border-slate-700">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* MFA Summary Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * mfaStats.percentage) / 100}
                    className="text-coral-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{mfaStats.percentage}%</span>
                  <span className="text-[8px] text-slate-500 uppercase font-black">MFA Coverage</span>
                </div>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">MFA Compliance</h3>
              <p className="text-slate-500 text-xs px-4">
                {mfaStats.registered} of {mfaStats.total} users have registered MFA methods.
              </p>
            </div>

            {/* Directory Roles */}
            <div className="md:col-span-3 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Privileged Directory Roles</h3>
                <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                  {data.roles.length} Active Roles
                </span>
              </div>
              <div className="divide-y divide-slate-800">
                {data.roles.map((role) => (
                  <div key={role.Id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-coral-500/10 transition-colors">
                        <Shield className="text-slate-500 group-hover:text-coral-500" size={18} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{role.DisplayName}</p>
                        <p className="text-slate-500 text-xs line-clamp-1">{role.Description}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-700 group-hover:text-slate-500" size={16} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div 
            key="users"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search users or principal names..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-coral-500/50 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-slate-800 text-slate-300 p-2 rounded-lg hover:bg-slate-700 transition-all">
                  <Filter size={16} />
                </button>
                <button className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all">
                  Export CSV
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Display Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User Principal Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">MFA Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Default Method</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.users.map((user) => (
                    <tr key={user.Id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-coral-500/20 group-hover:text-coral-500 transition-all">
                            {user.DisplayName.charAt(0)}
                          </div>
                          <span className="text-white font-bold text-sm">{user.DisplayName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs font-mono">{user.UserPrincipalName}</td>
                      <td className="px-6 py-4">
                        {user.IsMfaRegistered ? (
                          <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={12} /> Registered
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            <AlertCircle size={12} /> Not Registered
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        {user.DefaultMfaMethod || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                          user.UserType === 'Member' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          {user.UserType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`w-2 h-2 rounded-full ${user.AccountEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div 
            key="security"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Conditional Access Policies */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-white font-black uppercase text-sm tracking-widest">Conditional Access Policies</h3>
                <Lock className="text-slate-600" size={18} />
              </div>
              <div className="p-4 space-y-4">
                {data.policies.map((policy) => (
                  <div key={policy.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-white font-bold text-sm">{policy.displayName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        policy.state === 'enabled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {policy.state}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-slate-900 px-2 py-1 rounded text-[10px] text-slate-400 flex items-center gap-1.5">
                        <Users size={10} /> {typeof policy.conditions.users === 'string' ? policy.conditions.users : 'Selected Users'}
                      </div>
                      {policy.grantControls.builtInControls.map((control: string) => (
                        <div key={control} className="bg-coral-500/10 px-2 py-1 rounded text-[10px] text-coral-400 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                          <Shield size={10} /> {control}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Recommendations */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-white font-black uppercase text-sm tracking-widest mb-6">CMMC Compliance Gaps</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-amber-500/10 p-2 rounded-lg h-fit">
                    <AlertCircle className="text-amber-500" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Incomplete MFA Coverage</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      CMMC IA.L2-3.5.3 requires multi-factor authentication for all users. Currently, {mfaStats.total - mfaStats.registered} users have not registered MFA methods.
                    </p>
                    <button className="text-coral-500 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">View Affected Users</button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-lg h-fit">
                    <Info className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Policy in Report-Only Mode</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      The "Require Compliant Device" policy is set to report-only. For CMMC compliance, this should be enforced for all CUI-handling devices.
                    </p>
                    <button className="text-coral-500 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">Remediation Steps</button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-emerald-500/10 p-2 rounded-lg h-fit">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Legacy Auth Blocked</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Legacy authentication is successfully blocked via Conditional Access, satisfying multiple CMMC AC and IA requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'scripts' && (
          <motion.div 
            key="scripts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-black uppercase text-sm tracking-widest mb-4">Evidence Collector</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Run this PowerShell script in your tenant to export the required evidence files. The script uses the Microsoft Graph SDK to pull configuration data securely.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-coral-500">1</div>
                    Download the .ps1 script
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-coral-500">2</div>
                    Run with Admin Privileges
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-coral-500">3</div>
                    Upload the output folder here
                  </div>
                </div>
                <button 
                  onClick={handleDownloadScript}
                  className="w-full mt-8 bg-white text-slate-950 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-coral-50 transition-all"
                >
                  <Download size={16} /> Download Script
                </button>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-black uppercase text-sm tracking-widest mb-4">Required Scopes</h3>
                <div className="space-y-2">
                  {['Directory.Read.All', 'User.Read.All', 'Policy.Read.All', 'Reports.Read.All', 'Organization.Read.All'].map(scope => (
                    <div key={scope} className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 font-mono text-[10px]">{scope}</span>
                      <CheckCircle2 className="text-emerald-500" size={12} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-900/80 p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono ml-4">Export-M365Evidence.ps1</span>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="p-6 font-mono text-xs text-slate-400 overflow-y-auto max-h-[500px] bg-slate-950">
                <pre className="whitespace-pre-wrap">
                  {psScript}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploading(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-coral-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-coral-500" size={32} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Upload Evidence</h2>
                <p className="text-slate-400 text-sm mt-2">Select the output folder or ZIP file from the script</p>
              </div>

              <div 
                onClick={() => document.getElementById('evidence-upload')?.click()}
                className="border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center hover:border-coral-500/50 transition-all cursor-pointer group"
              >
                <input 
                  id="evidence-upload"
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".json,.csv"
                />
                <div className="bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileJson className="text-slate-400 group-hover:text-coral-500" size={24} />
                </div>
                <p className="text-white font-bold mb-1">Drop files here</p>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-black">or click to browse</p>
                <p className="text-[10px] text-slate-600 mt-4 italic">Upload organization.json, users.csv, directory_roles.csv, etc.</p>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setIsUploading(false)}
                  className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsUploading(false)}
                  className="flex-1 bg-coral-500 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-coral-600 transition-all"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
