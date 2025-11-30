

import { Requirement, Risk, Asset, User, Framework, Client, ClientData, ProjectTask, BudgetLineItem, TrainingModule } from '../types';

export const FRAMEWORKS: Framework[] = [
  { id: 'NIST800-171', name: 'NIST 800-171 / CMMC', description: 'Protecting Controlled Unclassified Information (CUI).' },
  { id: 'ISO27001', name: 'ISO 27001:2022', description: 'International standard for Information Security Management.' },
  { id: 'SOC2', name: 'SOC 2 Type II', description: 'AICPA Trust Services Criteria for Service Organizations.' },
  { id: 'HIPAA', name: 'HIPAA Security Rule', description: 'Protection of Electronic Protected Health Information (ePHI).' },
];

export const NIST_FAMILIES = [
  { id: 'AC', name: 'Access Control' },
  { id: 'AT', name: 'Awareness and Training' },
  { id: 'AU', name: 'Audit and Accountability' },
  { id: 'CM', name: 'Configuration Management' },
  { id: 'IA', name: 'Identification and Authentication' },
  { id: 'IR', name: 'Incident Response' },
  { id: 'MA', name: 'Maintenance' },
  { id: 'MP', name: 'Media Protection' },
  { id: 'PE', name: 'Physical Protection' },
  { id: 'PS', name: 'Personnel Security' },
  { id: 'RA', name: 'Risk Assessment' },
  { id: 'CA', name: 'Security Assessment' },
  { id: 'SC', name: 'System and Communications Protection' },
  { id: 'SI', name: 'System and Information Integrity' },
];

export const NIST_CSF_FUNCTIONS = [
    { id: 'GV', name: 'Govern', color: 'bg-slate-500', text: 'text-slate-700' },
    { id: 'ID', name: 'Identify', color: 'bg-blue-500', text: 'text-blue-700' },
    { id: 'PR', name: 'Protect', color: 'bg-purple-500', text: 'text-purple-700' },
    { id: 'DE', name: 'Detect', color: 'bg-orange-500', text: 'text-orange-700' },
    { id: 'RS', name: 'Respond', color: 'bg-red-500', text: 'text-red-700' },
    { id: 'RC', name: 'Recover', color: 'bg-green-500', text: 'text-green-700' },
];

export const TRAINING_MODULES: TrainingModule[] = [
    {
        id: 'MOD-AC-01',
        familyId: 'AC',
        title: 'Access Control Basics',
        description: 'Understand the difference between Authorized Users, Devices, and Processes.',
        durationMinutes: 15,
        difficulty: 'Beginner',
        content: `
# Access Control Fundamentals

Access control is the first line of defense. In NIST 800-171, it's not just about passwords; it's about **Authorization**.

## Key Concepts

1.  **Authorized Users:** People who have been vetted and given permission.
2.  **Processes:** Software scripts or services that run in the background (e.g., a backup service running as 'svc_backup').
3.  **Devices:** Computers, tablets, or phones allowed on the network.

## Implementation Tips for Technicians

*   **Active Directory Groups:** Never assign permissions to individual users. Always use Groups (e.g., 'FS_Finance_RW').
*   **Least Privilege:** If a user only needs to *read* a file, do not give them *write* access just because it's easier.
*   **Device Authentication:** Use 802.1x or MAC address filtering to ensure unknown laptops cannot just plug into the wall and get an IP address.
        `
    },
    {
        id: 'MOD-PE-01',
        familyId: 'PE',
        title: 'Physical Security Walkthrough',
        description: 'How to escort visitors and secure server rooms.',
        durationMinutes: 10,
        difficulty: 'Beginner',
        content: `
# Physical Protection

Security isn't just digital. If I can steal the server, I own the data.

## The Visitor Log
Every person who is not an employee **must** sign a logbook when entering sensitive areas (like the server room).
*   **Date/Time In**
*   **Name & Company**
*   **Purpose of Visit**
*   **Escort Name**

## Escorting
Visitors should never be left alone in areas where CUI is accessible. 
        `
    },
    {
        id: 'MOD-SC-01',
        familyId: 'SC',
        title: 'Boundary Protection & Firewalls',
        description: 'Defining what is In-Scope versus Out-of-Scope.',
        durationMinutes: 25,
        difficulty: 'Advanced',
        content: `
# System & Comm Protection

This is where many shops fail. You must define a **boundary**.

## The "CUI Enclave"
If you are a machine shop, your CNC machines probably don't need access to the HR files. 
Isolate the machines that handle CUI (blueprints, specs) into their own VLAN.

## Deny by Default
Your firewall rules should block EVERYTHING, and only allow specific traffic you need.
*   **Bad:** Allow Any -> Any
*   **Good:** Allow LAN -> Internet (Port 443 only)
        `
    }
];

export const REQUIREMENTS_DATA: Requirement[] = [
  // --- NIST 800-171 Data (Expanded to all Families) ---
  // FAMILY: AC
  {
    id: '3.1.1',
    framework: 'NIST800-171',
    family: 'AC',
    title: 'Authorized Access Control',
    description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).',
    discussion: 'Access control policies control access to systems and data. This requirement focuses on account management and ensuring only approved entities can login.',
    level: '1',
    sprsWeight: 5,
    interviewQuestion: 'How do you ensure only authorized employees can log in to your systems?',
    objectives: [
      { id: 'a', description: 'Authorized users are identified.', status: 'pending' },
      { id: 'b', description: 'Processes acting on behalf of users are identified.', status: 'pending' },
      { id: 'c', description: 'Devices (and other systems) are identified.', status: 'pending' },
      { id: 'd', description: 'System access is limited to authorized users.', status: 'pending' },
    ],
    scopeStatus: 'IN_SCOPE',
    references: [
        { title: 'NIST MEP Handbook (Ch. 3)', url: 'https://www.nist.gov/mep/cybersecurity-resources-manufacturers/nist-mep-cybersecurity-self-assessment-handbook', type: 'Guide' },
        { title: 'Microsoft AD Access Control Guide', url: 'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/plan/security-best-practices/implementing-least-privilege-administrative-models', type: 'Official' }
    ],
    mappings: {
      nist800_53: ['AC-2', 'AC-3'],
      iso27001: ['A.9.2.1'],
      nist_csf: ['PR.AC-1', 'PR.AC-4', 'PR.AC-6'],
      cis_v8: ['5.1', '6.1'],
    }
  },
  {
    id: '3.1.2',
    framework: 'NIST800-171',
    family: 'AC',
    title: 'Transaction & Function Control',
    description: 'Limit information system access to the types of transactions and functions that authorized users are permitted to execute.',
    discussion: 'This is often referred to as "Role-Based Access Control" (RBAC). Users should only be able to do what their job requires.',
    level: '1',
    sprsWeight: 5,
    interviewQuestion: 'Describe how you restrict users to only the functions they need to do their job (Role-Based Access).',
    objectives: [
      { id: 'a', description: 'Types of transactions authorized users are permitted to execute are defined.', status: 'pending' },
      { id: 'b', description: 'Types of functions authorized users are permitted to execute are defined.', status: 'pending' },
      { id: 'c', description: 'System access is limited to permitted transactions/functions.', status: 'pending' },
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
      nist800_53: ['AC-2(4)', 'AC-3', 'AC-17'],
      nist_csf: ['PR.AC-3', 'PR.AC-5'],
      cis_v8: ['5.3', '6.2'],
    }
  },
  // FAMILY: AT
  {
    id: '3.2.1',
    framework: 'NIST800-171',
    family: 'AT',
    title: 'Role-Based Training',
    description: 'Ensure that managers, systems administrators, and users of organizational systems are made aware of the security risks associated with their activities.',
    discussion: 'Everyone needs to know the risks. Training should be relevant to their role.',
    level: '2',
    sprsWeight: 3,
    interviewQuestion: 'How often do you train employees on security risks, and is it specific to their role?',
    objectives: [
      { id: 'a', description: 'Security risks are identified for each role.', status: 'pending' },
      { id: 'b', description: 'Training material is updated regularly.', status: 'pending' },
    ],
    scopeStatus: 'IN_SCOPE',
    references: [
        { title: 'SANS Security Awareness Worksheets', url: '#', type: 'Template' }
    ],
    mappings: {
      nist800_53: ['AT-2', 'AT-3'],
      iso27001: ['A.7.2.2'],
      nist_csf: ['PR.AT-1', 'PR.AT-2'],
      cis_v8: ['14.1', '14.2'],
    }
  },
  // FAMILY: AU
   {
    id: '3.3.1',
    framework: 'NIST800-171',
    family: 'AU',
    title: 'System Auditing',
    description: 'Create and retain system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.',
    discussion: 'Logs are crucial for forensics. You must decide what to log based on risk.',
    level: '2',
    sprsWeight: 3,
    interviewQuestion: 'What systems are you logging, and how long do you keep the audit logs?',
    objectives: [
      { id: 'a', description: 'Audit events are defined.', status: 'pending' },
      { id: 'b', description: 'Logs are retained for a defined period.', status: 'pending' },
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
      nist800_53: ['AU-2', 'AU-6'],
      iso27001: ['A.12.4.1'],
      nist_csf: ['DE.AE-3', 'PR.PT-1'],
      cis_v8: ['8.2', '8.10'],
    }
  },
  // FAMILY: CM
  {
    id: '3.4.1',
    framework: 'NIST800-171',
    family: 'CM',
    title: 'Baseline Configurations',
    description: 'Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation) throughout the respective system development life cycles.',
    discussion: 'You need a standard image for workstations and servers (Golden Image).',
    level: '2',
    sprsWeight: 5,
    interviewQuestion: 'Do you have a standard "Golden Image" or configuration for all computers?',
    objectives: [
        { id: 'a', description: 'Baseline configurations are established.', status: 'pending' },
        { id: 'b', description: 'Inventories of systems are maintained.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['CM-2', 'CM-8'],
        nist_csf: ['ID.AM-1', 'PR.IP-1']
    }
  },
  // FAMILY: IA
  {
    id: '3.5.1',
    framework: 'NIST800-171',
    family: 'IA',
    title: 'Identification',
    description: 'Identify system users, processes acting on behalf of users, and devices.',
    discussion: 'Every user needs a unique username. No shared accounts.',
    level: '1',
    sprsWeight: 5,
    interviewQuestion: 'Do all users have unique usernames? Are shared accounts prohibited?',
    objectives: [
        { id: 'a', description: 'Users are uniquely identified.', status: 'pending' },
        { id: 'b', description: 'Processes are uniquely identified.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['IA-2'],
        nist_csf: ['PR.AC-6']
    }
  },
  // FAMILY: IR
  {
    id: '3.6.1',
    framework: 'NIST800-171',
    family: 'IR',
    title: 'Incident Handling',
    description: 'Establish an operational incident-handling capability for organizational systems that includes preparation, detection, analysis, containment, recovery, and user response activities.',
    discussion: 'You must have a plan for when things go wrong.',
    level: '2',
    sprsWeight: 3,
    interviewQuestion: 'Do you have an Incident Response Plan (IRP) that covers detection, containment, and recovery?',
    objectives: [
        { id: 'a', description: 'Incident response capability established.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['IR-4'],
        nist_csf: ['RS.RP-1']
    }
  },
  // FAMILY: MA
  {
    id: '3.7.1',
    framework: 'NIST800-171',
    family: 'MA',
    title: 'System Maintenance',
    description: 'Perform maintenance on organizational systems.',
    discussion: 'Keep systems patched and repaired. Track maintenance activities.',
    level: '2',
    sprsWeight: 1,
    interviewQuestion: 'How do you track and perform routine maintenance (patching, repairs) on your systems?',
    objectives: [
        { id: 'a', description: 'System maintenance is performed.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['MA-2'],
        nist_csf: ['PR.MA-1']
    }
  },
  // FAMILY: MP
  {
    id: '3.8.1',
    framework: 'NIST800-171',
    family: 'MP',
    title: 'Media Protection',
    description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.',
    discussion: 'USB drives, external hard drives, and printed paper with CUI must be locked up.',
    level: '1',
    sprsWeight: 3,
    interviewQuestion: 'How do you secure physical media (USB drives, paper documents) that contain sensitive info?',
    objectives: [
        { id: 'a', description: 'System media containing CUI is protected.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['MP-4'],
        nist_csf: ['PR.PT-2']
    }
  },
  // FAMILY: PS
  {
    id: '3.9.1',
    framework: 'NIST800-171',
    family: 'PS',
    title: 'Personnel Screening',
    description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.',
    discussion: 'Background checks for employees handling CUI.',
    level: '2',
    sprsWeight: 3,
    interviewQuestion: 'Do you perform background checks on all employees before granting access to CUI?',
    objectives: [
        { id: 'a', description: 'Individuals are screened prior to access authorization.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['PS-3'],
        nist_csf: ['PR.IP-11']
    }
  },
  // FAMILY: PE
  {
    id: '3.10.1',
    framework: 'NIST800-171',
    family: 'PE',
    title: 'Physical Access Control',
    description: 'Limit physical access to organizational systems, equipment, and the respective operating environments to authorized individuals.',
    discussion: 'Locks on doors, badges, visitor logs.',
    level: '1',
    sprsWeight: 5,
    interviewQuestion: 'How do you restrict physical access to your servers and office space (e.g., badges, locks)?',
    objectives: [
        { id: 'a', description: 'Physical access is limited to authorized individuals.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['PE-2', 'PE-3'],
        nist_csf: ['PR.AC-2']
    }
  },
  // FAMILY: RA
  {
    id: '3.11.1',
    framework: 'NIST800-171',
    family: 'RA',
    title: 'Risk Assessment',
    description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals, resulting from the operation of organizational systems and the associated processing, storage, or transmission of CUI.',
    discussion: 'You need to run a formal risk assessment at least annually.',
    level: '2',
    sprsWeight: 1,
    interviewQuestion: 'Do you perform a formal risk assessment at least annually?',
    objectives: [
        { id: 'a', description: 'Risk to organizational operations is assessed.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['RA-3'],
        nist_csf: ['ID.RA-1']
    }
  },
  // FAMILY: CA
  {
    id: '3.12.1',
    framework: 'NIST800-171',
    family: 'CA',
    title: 'Security Assessment',
    description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.',
    discussion: 'This is your self-assessment or internal audit process.',
    level: '2',
    sprsWeight: 1,
    interviewQuestion: 'How often do you test your security controls to make sure they work?',
    objectives: [
        { id: 'a', description: 'Security controls are assessed periodically.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['CA-2'],
        nist_csf: ['ID.RA-1']
    }
  },
  // FAMILY: SC
  {
    id: '3.13.1',
    framework: 'NIST800-171',
    family: 'SC',
    title: 'Boundary Protection',
    description: 'Monitor, control, and protect organizational communications (i.e., information transmitted or received by organizational systems) at the external boundaries and key internal boundaries of the information systems.',
    discussion: 'Firewalls, proxies, and gateways at the edge of your network.',
    level: '1',
    sprsWeight: 5,
    interviewQuestion: 'Do you use firewalls to protect your network boundary?',
    objectives: [
        { id: 'a', description: 'Communications are monitored at external boundaries.', status: 'pending' },
        { id: 'b', description: 'Communications are controlled at external boundaries.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['SC-7'],
        nist_csf: ['PR.AC-5']
    }
  },
  // FAMILY: SI
  {
    id: '3.14.1',
    framework: 'NIST800-171',
    family: 'SI',
    title: 'Flaw Remediation',
    description: 'Identify, report, and correct information and information system flaws in a timely manner.',
    discussion: 'Patch management. Fix bugs and vulnerabilities quickly.',
    level: '1',
    sprsWeight: 5,
    interviewQuestion: 'How quickly do you install security patches after they are released?',
    objectives: [
        { id: 'a', description: 'System flaws are identified.', status: 'pending' },
        { id: 'b', description: 'System flaws are corrected in a timely manner.', status: 'pending' }
    ],
    scopeStatus: 'IN_SCOPE',
    mappings: {
        nist800_53: ['SI-2'],
        nist_csf: ['ID.RA-1', 'PR.IP-12']
    }
  },

  // --- ISO 27001 Mock Data ---
  {
      id: 'A.5.1',
      framework: 'ISO27001',
      family: 'Policies',
      title: 'Policies for Information Security',
      description: 'Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel.',
      discussion: 'Core governance requirement. You need written policies.',
      level: 'Mandatory',
      interviewQuestion: 'Do you have written information security policies that are approved by management and read by all staff?',
      objectives: [
          { id: 'a', description: 'Policies defined and approved.', status: 'pending' },
          { id: 'b', description: 'Policies communicated to employees.', status: 'pending' }
      ],
      scopeStatus: 'IN_SCOPE',
      mappings: {
          nist800_53: ['PM-1'],
          nist_csf: ['GV.PO-1']
      }
  },
  {
      id: 'A.8.2',
      framework: 'ISO27001',
      family: 'Asset Management',
      title: 'Information Classification',
      description: 'Information shall be classified in accordance with the information security needs of the organization based on confidentiality, integrity, availability, and relevant interested party requirements.',
      discussion: 'Label your data (e.g. Public, Internal, Confidential).',
      level: 'Mandatory',
      interviewQuestion: 'How do you classify and label your information (e.g., Confidential, Public)?',
      objectives: [
          { id: 'a', description: 'Classification scheme defined.', status: 'pending' },
          { id: 'b', description: 'Assets labeled according to scheme.', status: 'pending' }
      ],
      scopeStatus: 'IN_SCOPE',
      mappings: {
          nist800_53: ['RA-2'],
          nist_csf: ['ID.AM-5']
      }
  },

  // --- SOC 2 Mock Data ---
  {
      id: 'CC1.1',
      framework: 'SOC2',
      family: 'Control Environment',
      title: 'Ethical Values and Integrity',
      description: 'The entity demonstrates a commitment to integrity and ethical values.',
      discussion: 'This is usually satisfied by an Employee Handbook and Code of Conduct signed by all staff.',
      level: 'Common Criteria',
      interviewQuestion: 'Do you have a Code of Conduct that employees sign annually?',
      objectives: [
          { id: 'a', description: 'Code of conduct exists.', status: 'pending' },
          { id: 'b', description: 'Employees acknowledge code annually.', status: 'pending' }
      ],
      scopeStatus: 'IN_SCOPE',
      mappings: {
          nist_csf: ['GV.OC-2']
      }
  },

  // --- HIPAA Mock Data ---
  {
      id: '164.308(a)(1)',
      framework: 'HIPAA',
      family: 'Security Management',
      title: 'Security Management Process',
      description: 'Implement policies and procedures to prevent, detect, contain, and correct security violations.',
      discussion: 'This includes Risk Analysis, Risk Management, Sanction Policy, and Information System Activity Review.',
      level: 'Required',
      interviewQuestion: 'Do you perform a regular risk analysis to identify where your ePHI is stored and what vulnerabilities exist?',
      objectives: [
          { id: 'a', description: 'Risk analysis performed.', status: 'pending' },
          { id: 'b', description: 'Risk management measures implemented.', status: 'pending' }
      ],
      scopeStatus: 'IN_SCOPE',
      mappings: {
          nist800_53: ['RA-3'],
          nist_csf: ['ID.RA-1']
      }
  },
  {
      id: '164.312(a)(1)',
      framework: 'HIPAA',
      family: 'Access Control',
      title: 'Access Control',
      description: 'Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights.',
      discussion: 'Unique User Identification, Emergency Access Procedure, Automatic Logoff, Encryption and Decryption.',
      level: 'Required',
      interviewQuestion: 'Does every user have a unique username and password to access patient data?',
      objectives: [
          { id: 'a', description: 'Unique user identification assigned.', status: 'pending' },
          { id: 'b', description: 'Emergency access procedures established.', status: 'pending' }
      ],
      scopeStatus: 'IN_SCOPE',
      mappings: {
          nist800_53: ['AC-2'],
          nist_csf: ['PR.AC-1']
      }
  },
  {
      id: '164.312(b)',
      framework: 'HIPAA',
      family: 'Audit Controls',
      title: 'Audit Controls',
      description: 'Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.',
      discussion: 'You must log who accessed what record.',
      level: 'Required',
      interviewQuestion: 'Do you keep logs of who accessed which patient records?',
      objectives: [
          { id: 'a', description: 'Audit mechanisms implemented.', status: 'pending' },
          { id: 'b', description: 'Activity reviews performed.', status: 'pending' }
      ],
      scopeStatus: 'IN_SCOPE',
      mappings: {
          nist800_53: ['AU-2'],
          nist_csf: ['PR.PT-1']
      }
  }
];

export const INITIAL_RISKS: Risk[] = [
    {
        id: 'R-001',
        description: 'Phishing attack leading to ransomware infection',
        category: 'External',
        assessmentType: 'Quantitative',
        threatEventFrequency: 12, // once a month
        vulnerability: 0.1, // 10% chance of user clicking
        lossMagnitude: 50000, // $50k cost per incident
        riskScore: 60000, // 12 * 0.1 * 50000 = $60k ALE
        remediation: 'Implement MFA, Email Filtering, and Monthly Phishing Sims.',
        owner: 'IT Director',
        status: 'Open',
        dateIdentified: Date.now() - 10000000
    },
    {
        id: 'R-002',
        description: 'Laptop theft containing unencrypted CUI',
        category: 'Physical',
        assessmentType: 'Qualitative',
        likelihood: 2,
        impact: 5,
        riskScore: 10,
        remediation: 'Full Disk Encryption (BitLocker) enforced via GPO.',
        owner: 'SysAdmin',
        status: 'Mitigated',
        dateIdentified: Date.now() - 20000000
    }
];

export const INITIAL_ASSETS: Asset[] = [
    {
        id: 'SRV-DC01',
        name: 'Domain Controller 01',
        type: 'Server',
        owner: 'IT Dept',
        location: 'HQ Server Room',
        inScopeCUI: true,
        criticality: 'High'
    },
    {
        id: 'LPT-USR-04',
        name: 'CEO Laptop',
        type: 'Workstation',
        owner: 'Jane Doe',
        location: 'Mobile',
        inScopeCUI: true,
        criticality: 'Medium'
    },
    {
        id: 'FW-EDGE-01',
        name: 'Edge Firewall',
        type: 'Network Device',
        owner: 'Network Team',
        location: 'HQ',
        inScopeCUI: true,
        criticality: 'High'
    }
];

// Mock Users with Organizations and Roles
export const INITIAL_USERS: User[] = [
    {
        id: 'u1',
        organizationId: 'client-msp',
        name: 'Alice MSP Admin',
        email: 'alice@msp.com',
        role: 'MSP_ADMIN',
        department: 'Management',
        lastLogin: Date.now(),
        mfaEnabled: true,
        hasPasskey: true // Supports TouchID/FaceID
    },
    {
        id: 'u2',
        organizationId: 'client-1',
        name: 'John Client Admin',
        email: 'john@acme.com',
        role: 'CLIENT_ADMIN',
        department: 'IT',
        lastLogin: Date.now() - 86400000,
        mfaEnabled: true,
        hasPasskey: false
    },
    {
        id: 'u3',
        organizationId: 'client-1',
        name: 'Bob Employee',
        email: 'bob@acme.com',
        role: 'CLIENT_USER',
        department: 'Sales',
        lastLogin: Date.now() - 120000,
        mfaEnabled: false, // Insecure user
        hasPasskey: false
    }
];

export const INITIAL_TASKS: ProjectTask[] = [
    {
        id: 'T-101',
        title: 'Deploy MFA for All Users',
        description: 'Roll out Duo Security to all workstations and cloud apps to satisfy AC-3.1.1.',
        status: 'in_progress',
        priority: 'High',
        assigneeId: 'u1',
        linkedRequirementId: '3.1.1',
        dueDate: Date.now() + 604800000 // +1 week
    },
    {
        id: 'T-102',
        title: 'Review System Logs',
        description: 'Weekly review of firewall and DC logs.',
        status: 'backlog',
        priority: 'Medium',
        assigneeId: 'u3',
        linkedRequirementId: '3.3.1'
    }
];

export const INITIAL_BUDGET: BudgetLineItem[] = [
    {
        id: 'B-001',
        linkedRequirementId: '3.1.1',
        name: 'Duo MFA Licenses (50 Users)',
        category: 'Software',
        costType: 'Recurring/Year',
        amount: 3600,
        notes: '$6/user/month'
    },
    {
        id: 'B-002',
        linkedRequirementId: '3.13.1',
        name: 'Firewall Replacement (Hardware)',
        category: 'Hardware',
        costType: 'One-Time',
        amount: 2500,
        notes: 'Upgrade to FortiGate 60F'
    },
     {
        id: 'B-003',
        linkedRequirementId: '3.13.1',
        name: 'Firewall Config Labor',
        category: 'Labor',
        costType: 'One-Time',
        amount: 800,
        notes: '4 hours @ $200/hr'
    }
];

// --- MSP Data ---

export const INITIAL_CLIENTS: Client[] = [
    { 
      id: 'client-msp', 
      name: 'TechFlow Solutions (MSP)', 
      industry: 'Managed Services', 
      contactName: 'Alice Johnson', 
      logoInitial: 'T',
      primaryFramework: 'ISO 27001',
      nextAuditDate: Date.now() + 1000 * 60 * 60 * 24 * 15,
      accountManager: 'Self',
      isParent: true,
      branding: {
          primaryColor: '#ff7f50', // Coral
          logoUrl: 'https://via.placeholder.com/150x50/ff7f50/ffffff?text=TechFlow+MSP'
      }
    },
    { 
      id: 'client-1', 
      name: 'Acme Defense Corp', 
      industry: 'Defense Base', 
      contactName: 'John Smith', 
      logoInitial: 'A',
      primaryFramework: 'CMMC L2',
      nextAuditDate: Date.now() + 1000 * 60 * 60 * 24 * 45,
      accountManager: 'Alice Johnson',
      isParent: false,
      branding: {
          primaryColor: '#dc2626', // Red
          logoUrl: 'https://via.placeholder.com/150x50/dc2626/ffffff?text=Acme+Defense'
      }
    },
    { 
      id: 'client-2', 
      name: 'Global Health Systems', 
      industry: 'Healthcare', 
      contactName: 'Sarah Conner', 
      logoInitial: 'G',
      primaryFramework: 'HIPAA',
      nextAuditDate: Date.now() + 1000 * 60 * 60 * 24 * 180, 
      accountManager: 'Bob Builder',
      isParent: false,
      branding: {
          primaryColor: '#059669', // Emerald
          logoUrl: 'https://via.placeholder.com/150x50/059669/ffffff?text=Global+Health'
      }
    },
];

export const createInitialClientData = (useMockData = false): ClientData => {
    // Deep copy requirements to ensure clean status for new client
    const cleanRequirements = JSON.parse(JSON.stringify(REQUIREMENTS_DATA));
    
    return {
        requirements: cleanRequirements,
        risks: useMockData ? [...INITIAL_RISKS] : [],
        assets: useMockData ? [...INITIAL_ASSETS] : [],
        users: useMockData ? [...INITIAL_USERS] : [],
        tasks: useMockData ? [...INITIAL_TASKS] : [],
        budgetItems: useMockData ? [...INITIAL_BUDGET] : [],
        artifacts: [],
        tickets: [],
        versions: [],
        wizardProgress: {
            currentStep: 'INTRO',
            currentQuestionIndex: 0
        },
        cwConfig: {
            siteUrl: '',
            companyId: '',
            publicKey: '',
            privateKey: '',
            serviceBoard: 'Compliance Remediation',
            enabled: true
        },
        jiraConfig: {
            baseUrl: '',
            email: '',
            apiToken: '',
            projectKey: '',
            issueType: 'Task',
            enabled: false
        },
        confluenceConfig: {
            baseUrl: '',
            email: '',
            apiToken: '',
            spaceKey: '',
            enabled: false
        },
        auvikConfig: {
            apiKey: '',
            tenantId: '',
            region: 'US',
            enabled: false
        },
        mspBranding: {
            logoUrl: 'https://via.placeholder.com/150x50/ff7f50/ffffff?text=TechFlow+MSP',
            primaryColor: '#ff7f50' // Coral
        }
    };
};