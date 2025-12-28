
import { GoogleGenAI } from "@google/genai";
import { Requirement, AuvikDevice } from '../types';

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
      model: 'gemini-3-flash-preview',
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
    Outline exactly what is required to satisfy NIST 800-171 requirement ${req.id}: "${req.title}"?
    Description: ${req.description}
    
    Explain:
    1. Plain-English meaning.
    2. Assessment Objectives required (NIST 800-171A).
    3. Specific examples of evidence (Examine, Interview, Test).
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { systemInstruction: SYSTEM_INSTRUCTION_CHAT }
    });
    return response.text || "No explanation available.";
  } catch (e) {
    console.error("Explain AI Error:", e);
    return "Failed to retrieve explanation from AI gateway. Please try again in a few moments.";
  }
};

export const outlineRequirementsRoadmap = async (
  requirements: Requirement[]
): Promise<string> => {
  const gaps = requirements.filter(r => r.objectives.some(o => o.status === 'not_met' || o.status === 'pending'));
  
  const prompt = `
    Based on the following list of unimplemented security controls, provide a prioritized roadmap for compliance.
    
    Controls to address:
    ${gaps.slice(0, 20).map(g => `- ${g.id}: ${g.title}`).join('\n')}
    
    Provide:
    1. Quick Wins (Documentation/Policies)
    2. Critical Technical Gaps
    3. Evidence collection strategies.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { systemInstruction: SYSTEM_INSTRUCTION_CHAT }
    });
    return response.text || "Failed to generate outline.";
  } catch (e) {
    return "Could not generate roadmap at this time.";
  }
};

export const analyzePolicyGap = async (
  req: Requirement,
  policyText: string
): Promise<string> => {
  const prompt = `
    Analyze the gaps between this policy text and NIST 800-171 Requirement ${req.id}.
    Requirement Description: ${req.description}
    Policy Text: "${policyText}"
    
    Identify what is missing or insufficient.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
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

export const generateComplianceDocument = async (
  type: string,
  title: string,
  answers: Record<string, string>
): Promise<string> => {
  const auditContext = answers['Audit_Intelligence_Context'] || "";
  const filteredAnswers = { ...answers };
  delete filteredAnswers['Audit_Intelligence_Context'];

  const prompt = `
    Generate a professional ${type} titled "${title}" strictly aligned with NIST 800-18 guidelines.
    
    Front Matter:
    ${Object.entries(filteredAnswers).map(([q, a]) => `${q}: ${a}`).join('\n')}
    
    Control Context:
    ${auditContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { 
        systemInstruction: "You are a senior federal cybersecurity architect. Output in professional Markdown.",
        temperature: 0.1 
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
    Analyze the following network device topology for NIST 800-171 compliance.
    
    Devices:
    ${devices.map(d => `- ${d.name} (${d.type}): IP ${d.ipAddress}, VLAN ${d.vlan || 'Unknown'}`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { systemInstruction: "You are a network security architect." }
    });
    return response.text || "Analysis failed.";
  } catch (e) {
    return "Error analyzing topology.";
  }
};
