
import { GoogleGenAI } from "@google/genai";
import { Requirement, AuvikDevice } from '../types';

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_CHAT = `
You are an expert cybersecurity compliance consultant specialized in CMMC 2.0 and NIST SP 800-171A.
Your goal is to assist compliance teams by outlining what is required to reach compliance.
- Explain complex requirements in simple terms.
- Suggest specific artifacts needed for evidence.
- Help outline documentation requirements (SSP, POA&M).
- Maintain a professional but helpful tone.
`;

export const sendChatMessage = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const contents = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CHAT,
      },
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error connecting to the AI assistant.";
  }
};

export const outlineRequirementsRoadmap = async (
  requirements: Requirement[]
): Promise<string> => {
  const gaps = requirements.filter(r => r.objectives.some(o => o.status === 'not_met' || o.status === 'pending'));
  
  const prompt = `
    Based on the following list of unimplemented security controls, please provide a prioritized roadmap outlining exactly what is required to achieve full compliance.
    
    Controls to address:
    ${gaps.map(g => `- ${g.id}: ${g.title}`).join('\n')}
    
    Provide a step-by-step outline:
    1. Quick Wins (Easy implementation)
    2. Critical Gaps (High impact on score)
    3. Long-term technical projects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION_CHAT }
    });
    return response.text || "Failed to generate outline.";
  } catch (e) {
    return "Could not generate roadmap at this time.";
  }
};

export const explainRequirement = async (req: Requirement): Promise<string> => {
  const prompt = `
    Outline exactly what is required to satisfy NIST 800-171 requirement ${req.id}: "${req.title}"?
    Description: ${req.description}
    
    Explain:
    1. Plain-English meaning.
    2. Assessment Objectives required.
    3. Types of evidence needed.
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION_CHAT }
    });
    return response.text || "No explanation available.";
  } catch (e) {
    return "Failed to retrieve explanation.";
  }
};

export const analyzePolicyGap = async (
  req: Requirement,
  policyText: string
): Promise<string> => {
  const prompt = `
    Outline the gaps between this policy snippet and Requirement ${req.id}.
    Requirement: ${req.description}
    Policy Text: "${policyText}"
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { systemInstruction: "You are a strict compliance auditor." }
    });
    return response.text || "Analysis failed.";
  } catch (e) {
    return "Error analyzing policy.";
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
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: "Analyze this network diagram and outline the security boundaries and CUI flows." }
        ]
      },
    });
    return response.text || "Analysis complete.";
  } catch (error) {
    return "Error analyzing diagram.";
  }
};

/**
 * Enhanced Compliance Document Generator
 * Specifically designed to handle System Security Plans (SSP) and Incident Response Plans (IRP).
 */
export const generateComplianceDocument = async (
  type: string,
  title: string,
  answers: Record<string, string>
): Promise<string> => {
  // Extract audit context if provided
  const auditContext = answers['Audit_Intelligence_Context'] || "";
  const filteredAnswers = { ...answers };
  delete filteredAnswers['Audit_Intelligence_Context'];

  const prompt = `
    Generate a professional ${type} titled "${title}".
    
    ### Organization Details:
    ${Object.entries(filteredAnswers).map(([q, a]) => `${q}: ${a}`).join('\n')}
    
    ${auditContext ? `
    ### COMPLIANCE AUDIT DATA (USE THIS FOR THE CONTROLS SECTION):
    Below are the actual implementation narratives and evidence metadata from our live system. 
    You MUST incorporate these details into the relevant sections of the ${type}.
    
    ${auditContext}
    ` : ""}
    
    ### FORMATTING GUIDELINES:
    1. Output in Markdown.
    2. Use professional, clear, and assertive compliance language.
    3. For System Security Plans (SSP): Structure by Domain (Access Control, Identification & Authentication, etc.).
    4. For Incident Response Plans (IRP): Ensure NIST SP 800-61 Rev 2 methodology is used.
    5. Always reference provided digital evidence (filenames) where applicable to demonstrate "Institutionalized" status.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        systemInstruction: "You are a master federal compliance architect and auditor. Your goal is to produce highly professional, audit-ready documentation.",
        temperature: 0.2 // Lower temperature for more consistent compliance language
      }
    });
    return response.text || "Failed to generate document.";
  } catch (e) {
    console.error("DocGen AI Error:", e);
    return "Error generating document. Please check the API logs.";
  }
};

export const analyzeAuvikTopology = async (
  devices: AuvikDevice[]
): Promise<string> => {
  const prompt = `
    Analyze the following network device topology for cybersecurity compliance (NIST 800-171 / CMMC).
    Identify potential risks such as flat networks, improper segmentation, or insecure configurations.
    
    Devices:
    ${devices.map(d => `- ${d.name} (${d.type}): IP ${d.ipAddress}, VLAN ${d.vlan || 'Unknown'}, Firmware ${d.firmware || 'Unknown'}`).join('\n')}
    
    Provide a detailed security analysis and recommendations for improvement to ensure secure handling of CUI.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { systemInstruction: "You are a network security architect specialized in CMMC." }
    });
    return response.text || "Analysis failed.";
  } catch (e) {
    return "Error analyzing topology.";
  }
};
