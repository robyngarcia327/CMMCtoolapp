
import { GoogleGenAI, Type } from "@google/genai";
import { Requirement, AuvikDevice, Risk, ProjectTask, PolicySection } from '../types';
import * as mammoth from 'mammoth';

const decodeBase64ToText = (base64: string): string => {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Error decoding base64 to text:", e);
    return "";
  }
};

const extractTextFromDocx = async (base64: string): Promise<string> => {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const result = await mammoth.extractRawText({ arrayBuffer: bytes.buffer });
    return result.value;
  } catch (e) {
    console.error("Error extracting text from DOCX:", e);
    return "";
  }
};

const SYSTEM_INSTRUCTION_CHAT = `
You are an expert cybersecurity compliance consultant specialized in CMMC 2.0 and NIST SP 800-171A.
Your goal is to assist compliance teams by outlining what is required to reach compliance.
- Explain complex requirements in simple terms.
- Suggest specific artifacts needed for evidence based on NIST 800-171A methodology.
- Help outline documentation requirements (SSP, POA&M).
- Maintain a professional but helpful tone.
`;

const FAIR_SYSTEM_INSTRUCTION = `
You are a FAIR (Factor Analysis of Information Risk) Certified Professional.
You help cybersecurity teams quantitatively evaluate risk scenarios.
Use the FAIR taxonomy: 
- Loss Event Frequency (Threat Event Frequency + Vulnerability)
- Loss Magnitude (Primary Loss + Secondary Loss)
Provide specific, data-driven estimates for risk factors based on the user's business context.
`;

export const sendChatMessage = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
          ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
          { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CHAT,
      },
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error connecting to the AI assistant. Please verify your API configuration.";
  }
};

export const analyzeRiskWithFair = async (risk: Risk): Promise<string> => {
  const prompt = `
    Analyze this cyber risk scenario using the FAIR model ontology.
    RISK SCENARIO:
    Title: ${risk.riskTitle}
    Deficiency: ${risk.deficiencyDescription}
    Category: ${risk.riskCategory}

    Provide a breakdown of the following factors with estimations:
    1. Threat Event Frequency (TEF): How often does the threat agent contact the asset?
    2. Vulnerability (V): What is the probability that the threat results in a loss?
    3. Primary Loss: Immediate financial impact (e.g., productivity loss).
    4. Secondary Loss: Long-term impact (e.g., reputation, legal, fines).

    Suggest 3 specific mitigation strategies to reduce "Resistance Strength" gaps.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { systemInstruction: FAIR_SYSTEM_INSTRUCTION }
    });
    return response.text || "Analysis failed.";
  } catch (e) {
    return "Error connecting to the FAIR AI engine.";
  }
};

export const explainRequirement = async (req: Requirement): Promise<string> => {
  const prompt = `
    Please act as a Senior Cybersecurity Compliance Assessor.
    Provide a detailed breakdown for NIST SP 800-171 / CMMC 2.0 Requirement.

    CONTROL DETAILS:
    ID: ${req.id}
    Title: ${req.title}
    Description: ${req.description}
    Discussion/Domain: ${req.discussion || req.family}
    
    EXPECTED OUTPUT FORMAT (Markdown):
    1. **Audit Summary**: A 2-3 sentence explanation for a business owner.
    2. **Evidence Requirements**: A list of 3-5 specific artifacts (e.g., 'Active Directory GPO Settings for Password Complexity') that would prove compliance to a 3PAO auditor.
    3. **Common Gaps**: Typical reasons small businesses fail this specific control.
    4. **Assessor Tip**: A technical shortcut or best practice.
  `;
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
          systemInstruction: SYSTEM_INSTRUCTION_CHAT
      }
    });
    
    if (!response.text) {
        throw new Error("Empty response from AI engine");
    }
    
    return response.text;
  } catch (e: any) {
    console.error("AI Explanation Error:", e);
    return `AI Synthesis Failed. (Error: ${e.message || 'Check Connectivity'}). Ensure the Control ID ${req.id} is a valid NIST 800-171 reference and your API key is active.`;
  }
};

export const outlineRequirementsRoadmap = async (
  requirements: Requirement[]
): Promise<string> => {
  const gaps = requirements.filter(r => r.objectives.some(o => o.status === 'not_met' || o.status === 'pending'));
  
  const prompt = `
    Analyze these ${gaps.length} unimplemented security controls and provide a prioritized remediation roadmap.
    Group them by logical implementation order (e.g., 'Foundational Policies' first, then 'Technical Infrastructure').
    
    Gaps list:
    ${gaps.slice(0, 30).map(g => `- ${g.id}: ${g.title}`).join('\n')}
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION_CHAT }
    });
    return response.text || "Failed to generate roadmap.";
  } catch (e) {
    return "Could not generate roadmap at this time. Please ensure you have identified specific gaps in the mission control.";
  }
};

export const analyzePolicyGap = async (
  req: Requirement,
  policyText: string
): Promise<string> => {
  const prompt = `
    Audit this policy text against Requirement ${req.id} (${req.title}).
    Identify specific missing elements required by NIST 800-171.
    
    Policy Text: "${policyText}"
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: "You are a strict, detail-oriented compliance auditor." }
    });
    return response.text || "Analysis failed.";
  } catch (e) {
    return "Error analyzing policy text.";
  }
};

export const auditPolicyAgainstFramework = async (
  domainName: string,
  policyText: string,
  relevantRequirements: Requirement[],
  fileData?: { base64: string; mimeType: string }
): Promise<string> => {
  let effectivePolicyText = policyText || "";
  let inlineDataPart: any = null;

  if (fileData) {
    const base64Data = fileData.base64.split(',')[1] || fileData.base64;
    
    if (fileData.mimeType.includes('wordprocessingml') || fileData.mimeType.includes('msword')) {
      const docxText = await extractTextFromDocx(base64Data);
      effectivePolicyText += (effectivePolicyText ? "\n\n" : "") + docxText;
    } else if (fileData.mimeType === 'text/plain') {
      const text = decodeBase64ToText(base64Data);
      effectivePolicyText += (effectivePolicyText ? "\n\n" : "") + text;
    } else if (fileData.mimeType === 'application/pdf') {
      inlineDataPart = {
        inlineData: {
          data: base64Data,
          mimeType: 'application/pdf'
        }
      };
    } else {
      // Fallback for other types, though Gemini might reject them
      inlineDataPart = {
        inlineData: {
          data: base64Data,
          mimeType: fileData.mimeType
        }
      };
    }
  }

  const textPrompt = `
    Act as a Lead CMMC Assessor. Perform a detailed GAP ANALYSIS on the provided policy document.
    
    TARGET DOMAIN: ${domainName}
    
    EXPECTED CONTROLS TO AUDIT AGAINST:
    ${relevantRequirements.slice(0, 110).map(r => `- ${r.id}: ${r.title} (${r.description})`).join('\n')}
    
    ${effectivePolicyText ? `POLICY TEXT TO REVIEW:\n"""\n${effectivePolicyText}\n"""` : 'Please review the attached document for compliance analysis.'}
    
    OUTPUT FORMAT (Markdown):
    1. **Policy Maturity Score**: (0-100)
    2. **Executive Summary**: 2-3 sentences on overall document quality.
    3. **Requirement Mapping Table**:
       | Control ID | Alignment Status | Missing Components |
       |------------|------------------|--------------------|
       | [ID]       | [High/Partial/None] | [Details]       |
    4. **Critical Gaps**: List specific regulatory elements missing from the text.
    5. **Assessor Recommendations**: Professional advice for remediation.
  `;

  const contents: any[] = [{ text: textPrompt }];
  if (inlineDataPart) {
    contents.push(inlineDataPart);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: contents },
      config: { 
        systemInstruction: "You are a specialized CMMC/NIST 800-171 Policy Auditor. You provide high-fidelity, actionable feedback to help organizations reach Level 2 certification." 
      }
    });
    return response.text || "Policy audit failed to generate.";
  } catch (e: any) {
    console.error("Policy Audit Error:", e);
    if (e.message?.includes("RESOURCE_EXHAUSTED")) {
      return "AI Quota Exceeded. The system is currently processing too many requests. Please wait 60 seconds and try again.";
    }
    return "Critical error during AI Policy Audit. " + (e.message || "Please check document size and API connectivity.");
  }
};

export const analyzeNetworkDiagram = async (
  base64DataUrl: string
): Promise<string> => {
  const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) throw new Error("Invalid data");
  const mimeType = matches[1];
  const data = matches[2];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: "Identify the assessment boundaries, firewalls, and CUI repositories in this diagram. List compliance risks for NIST 800-171." }
        ]
      },
    });
    return response.text || "Analysis complete.";
  } catch (error) {
    return "Error analyzing diagram.";
  }
};

export const generateComplianceDocument = async (
  type: string,
  title: string,
  answers: Record<string, string>
): Promise<string> => {
  // Map document types to their correct NIST standards
  let standard = "NIST SP 800-18 Rev. 1 (Guide for Developing Security Plans)";
  let scopeInstruction = "This is a System Security Plan.";
  
  if (title.includes("Incident Response")) {
    standard = "NIST SP 800-61 Rev. 2 (Computer Security Incident Handling Guide)";
    scopeInstruction = "STRICT: This is an organization-wide Incident Response Plan. It IS NOT an SSP or an SSP Annex. Do not refer to it as such.";
  } else if (title.includes("Disaster Recovery")) {
    standard = "NIST SP 800-34 Rev. 1 (Contingency Planning Guide for Federal Information Systems)";
    scopeInstruction = "STRICT: This is a standalone Disaster Recovery Plan.";
  }

  const prompt = `
    Generate a professional compliance document following ${standard} methodology.
    Document Title: ${title}
    
    ${scopeInstruction}
    
    Details provided for synthesis:
    ${Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join('\n')}

    Please ensure the tone is formal and suitable for a federal auditor's review.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: "You are a lead federal cybersecurity architect writing mission-critical documentation. You strictly follow NIST standards and never conflate different document types or standards.",
      }
    });
    return response.text || "Failed to generate document.";
  } catch (e) {
    return "Error generating document.";
  }
};

export const parsePolicyDocument = async (
  fileData: { base64: string; mimeType: string }
): Promise<PolicySection[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = fileData.base64.split(',')[1] || fileData.base64;
  let parts: any[] = [];

  if (fileData.mimeType.includes('wordprocessingml') || fileData.mimeType.includes('msword')) {
    const docxText = await extractTextFromDocx(base64Data);
    parts.push({ text: `Analyze this policy document text:\n\n${docxText}` });
  } else if (fileData.mimeType === 'text/plain') {
    const text = decodeBase64ToText(base64Data);
    parts.push({ text: `Analyze this policy document text:\n\n${text}` });
  } else if (fileData.mimeType === 'application/pdf') {
    parts.push({ inlineData: { data: base64Data, mimeType: 'application/pdf' } });
  } else {
    // Fallback
    parts.push({ inlineData: { data: base64Data, mimeType: fileData.mimeType } });
  }
  
  const prompt = `
    Analyze this policy document and extract its main sections based on headers, sub-headers, and the table of contents if present. 
    For each section, provide a clear title and the full text content of that section.
    Break it down logically (e.g., 'Access Control Policy', 'Password Requirements', 'Remote Access', 'Incident Response Plan').
    
    Return the sections as a JSON array of objects with 'title' and 'content' properties.
  `;
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING }
            },
            required: ["title", "content"]
          }
        }
      }
    });

    const sections = JSON.parse(response.text || '[]');
    return sections.map((s: any) => ({
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: s.title,
      content: s.content
    }));
  } catch (e: any) {
    console.error("Policy Parsing Error:", e);
    if (e.message?.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("AI Quota Exceeded. The system is currently processing too many requests. Please wait 60 seconds and try again.");
    }
    throw e;
  }
};

export const analyzeAuvikTopology = async (
  devices: AuvikDevice[]
): Promise<string> => {
  const prompt = `
    Analyze this network inventory for CMMC 2.0 / NIST 800-171 scope compliance.
    Flag any flat network risks (missing VLAN segmentation for CUI).
    
    Device List:
    ${devices.map(d => `- ${d.name} (${d.type}): VLAN ${d.vlan || 'None'}`).join('\n')}
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: "You are a senior network security architect." }
    });
    return response.text || "Analysis failed.";
  } catch (e) {
    return "Error analyzing topology.";
  }
};

export const analyzeCmmcPackage = async (
  files: { name: string; base64: string; mimeType: string }[],
  requirements: Requirement[]
): Promise<{ summary: string; gaps: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const textPrompt = `
    Act as a CMMC 3PAO Assessor. Analyze the provided CMMC package (multiple documents and images) against NIST 800-171 / CMMC Level 2 requirements.
    Identify specific gaps where evidence is missing or insufficient.
    
    BASELINE REQUIREMENTS (NIST 800-171):
    ${requirements.slice(0, 110).map(r => `- ${r.id}: ${r.title}`).join('\n')}
    
    Analyze the attached files for compliance.
  `;

  const parts: any[] = [{ text: textPrompt }];
  
  for (const file of files) {
    const base64Data = file.base64.split(',')[1] || file.base64;
    
    if (file.mimeType.includes('wordprocessingml') || file.mimeType.includes('msword')) {
      const docxText = await extractTextFromDocx(base64Data);
      parts.push({ text: `Content of ${file.name}:\n\n${docxText}` });
    } else if (file.mimeType === 'text/plain') {
      const text = decodeBase64ToText(base64Data);
      parts.push({ text: `Content of ${file.name}:\n\n${text}` });
    } else if (file.mimeType === 'application/pdf' || file.mimeType.startsWith('image/')) {
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: file.mimeType
        }
      });
    } else {
      // Fallback
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: file.mimeType
        }
      });
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: "You are a specialized CMMC/NIST 800-171 Package Auditor. You provide high-fidelity, actionable feedback to help organizations reach Level 2 certification.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            gaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  requirementId: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  severity: { type: Type.STRING, description: "High, Medium, or Low" }
                },
                required: ["id", "title", "description", "recommendation", "severity"]
              }
            }
          },
          required: ["summary", "gaps"]
        }
      }
    });

    return JSON.parse(response.text || '{"summary": "Failed to parse", "gaps": []}');
  } catch (e: any) {
    console.error("Package Analysis Error:", e);
    if (e.message?.includes("RESOURCE_EXHAUSTED")) {
      return { 
        summary: "AI Quota Exceeded. The system is currently processing too many requests. Please wait 60 seconds and try again.", 
        gaps: [] 
      };
    }
    throw e;
  }
};

export const generateProjectPlanFromGaps = async (
  gaps: any[]
): Promise<ProjectTask[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Generate a project plan (list of tasks) to remediate the following CMMC gaps.
    Gaps:
    ${gaps.map(g => `- ${g.title}: ${g.description}`).join('\n')}
    
    Return a list of tasks with title, description, priority, and status.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              status: { type: Type.STRING, description: "backlog" },
              priority: { type: Type.STRING, description: "Low, Medium, or High" },
              linkedRequirementId: { type: Type.STRING }
            },
            required: ["id", "title", "description", "status", "priority"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Project Plan Generation Error:", e);
    return [];
  }
};
