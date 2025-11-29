import { GoogleGenAI } from "@google/genai";
import { Requirement } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_CHAT = `
You are an expert cybersecurity compliance consultant specialized in CMMC 2.0 (Level 1 and 2) and NIST SP 800-171A.
Your goal is to assist compliance teams who may be inexperienced.
- Explain complex requirements in simple terms.
- Suggest types of evidence (artifacts) for specific controls.
- Provide examples of policy language.
- If asked about a specific requirement (e.g., 3.1.1), explain the Assessment Objectives clearly.
- Maintain a professional but encouraging tone.
`;

const SYSTEM_INSTRUCTION_DOC_GEN = `
You are a senior technical writer and compliance officer.
Your task is to generate comprehensive cybersecurity documents, including System Security Plans (SSP), Incident Response Plans (IRP), Disaster Recovery Plans (DRP), and Table Top Exercise Reports.
- Use formal, audit-ready language (shall, must, will).
- For Plans (SSP, IRP, DRP): Structure them with clear roles, responsibilities, and procedural steps. Map to NIST 800-171 requirements where applicable.
- For Reports (Table Top, Lessons Learned): Use an objective, analytical tone. Focus on observations, root causes, and corrective actions.
- Do not hallucinate company details; use placeholders like [Company Name] if not provided.
- Output the result in clean Markdown format with headers.
`;

const SYSTEM_INSTRUCTION_NETWORK = `
You are a Lead Security Architect for CMMC and NIST 800-171 compliance.
Your role is to analyze network diagrams and provide technical feedback on system boundaries.
- Identify where CUI (Controlled Unclassified Information) might flow.
- Determine if the network segmentation is sufficient for "Out-of-Scope" designations.
- Recommend architectural changes (e.g., placing a firewall, using a DMZ, implementing VDI) to reduce compliance scope or improve security.
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
    // Add current message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

export const explainRequirement = async (req: Requirement): Promise<string> => {
  const prompt = `
    Can you explain NIST 800-171 requirement ${req.id}: "${req.title}"?
    Description: ${req.description}
    
    Please explain:
    1. What this actually means in plain English.
    2. What are the key Assessment Objectives?
    3. What kind of artifacts (screenshots, policies, logs) would satisfy this?
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION_CHAT }
    });
    return response.text || "No explanation available.";
  } catch (e) {
    return "Failed to retrieve explanation.";
  }
};

export const generateComplianceDocument = async (
  docType: string,
  docTitle: string,
  userInputs: Record<string, string>
): Promise<string> => {
  const inputString = Object.entries(userInputs)
    .filter(([_, val]) => val.trim() !== '') // Only include answered questions
    .map(([key, val]) => `**${key}**: ${val}`)
    .join('\n');

  const prompt = `
    Generate a ${docTitle} (${docType}).
    
    Use the following context and interview answers provided by the user:
    ${inputString}
    
    Instructions:
    - If the document is a "Plan" (SSP, IRP, DRP), outline the policy, scope, roles, and specific procedures.
    - If the document is a "Report" (Table Top, Lessons Learned), summarize the event, findings, and improvements.
    - If specific details (like Company Name) were provided in the answers, insert them. Otherwise use placeholders.
    - Ensure the content is aligned with NIST SP 800-171 and CMMC requirements.
    - Provide a complete, professional draft structure.
  `;

  try {
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION_DOC_GEN }
    });
    return response.text || "Could not generate document.";
  } catch (e) {
    console.error(e);
    return "Error generating document.";
  }
};

export const analyzeNetworkDiagram = async (
  base64DataUrl: string
): Promise<string> => {
  // Extract base64 data and mime type
  const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid data URL");
  }
  const mimeType = matches[1];
  const data = matches[2];

  const prompt = `
    Analyze this network diagram for CMMC and NIST 800-171 compliance.
    
    Please provide:
    1. **System Boundary Definition**: Identify the perimeter of the Information System.
    2. **Scope Analysis**:
       - List likely **In-Scope** assets (storing/processing CUI).
       - List likely **Out-of-Scope** assets (logically separated).
    3. **Recommendations**: Suggest infrastructure changes (e.g., VLANs, Firewalls, Jump Boxes) to better isolate CUI or reduce the assessment scope.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for vision capabilities
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_NETWORK
      }
    });
    return response.text || "Analysis complete, but no text returned.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Error analyzing the diagram. Please try again.";
  }
};