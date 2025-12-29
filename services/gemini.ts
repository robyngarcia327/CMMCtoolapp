
import { GoogleGenAI } from "@google/genai";
import { Requirement, AuvikDevice } from '../types';

const SYSTEM_INSTRUCTION_CHAT = `
You are an expert cybersecurity compliance consultant specialized in CMMC 2.0 and NIST SP 800-171A.
Your goal is to assist compliance teams by outlining what is required to reach compliance.
- Explain complex requirements in simple terms.
- Suggest specific artifacts needed for evidence based on NIST 800-171A methodology.
- Help outline documentation requirements (SSP, POA&M).
- Maintain a professional but helpful tone.
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
  if (title.includes("Incident Response")) {
    standard = "NIST SP 800-61 Rev. 2 (Computer Security Incident Handling Guide)";
  } else if (title.includes("Disaster Recovery")) {
    standard = "NIST SP 800-34 Rev. 1 (Contingency Planning Guide)";
  }

  const prompt = `
    Generate a formal compliance document following ${standard} standards.
    Document Title: ${title}
    
    STRICT REQUIREMENT: 
    If this is an Incident Response Plan (IRP), DO NOT refer to it as an SSP or an SSP Annex. 
    It must be a standalone organizational policy document.
    
    Details provided:
    ${Object.entries(answers).map(([q, a]) => `${q}: ${a}`).join('\n')}
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: "You are a lead federal cybersecurity architect writing mission-critical documentation. You strictly follow NIST standards without conflating different document types.",
      }
    });
    return response.text || "Failed to generate document.";
  } catch (e) {
    return "Error generating document.";
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
