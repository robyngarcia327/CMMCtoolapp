
import { GoogleGenAI } from "@google/genai";
import { Requirement, AuvikDevice } from '../types';

// Use process.env.API_KEY directly as per guidelines
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
You are a Lead Security Architect for CMMC and NIST 800-171 compliance, specializing in Zero Trust Architecture and Network Segmentation.
Your task is to analyze network inputs (diagrams or device lists) and provide a strict security assessment.

**Key Analysis Goals:**
1. **Identify CUI Flow:** Determine where Controlled Unclassified Information (CUI) likely resides.
2. **Detect Flat Networks:** Aggressively identify if critical assets (Servers) share the same network segment (VLAN) as high-risk assets (IoT, Guest Wi-Fi).
3. **Recommend Enclaves:** If CUI is present, you MUST recommend a "CUI Enclave" strategy to isolate sensitive data.
4. **Scope Reduction:** Advise on how to move assets "Out-of-Scope" to reduce assessment costs.

**Output Format:**
- **Executive Summary:** A brief health check.
- **Vulnerability Analysis:** Specific issues (e.g., "Guest Wi-Fi on same VLAN as HR Server").
- **Enclave Recommendation:** A specific section detailing how to build a CUI Enclave (e.g., "Create VLAN 20 for CUI, deploy a Jump Box").
- **Asset List:** Categorize assets into "Likely In-Scope" and "Likely Out-of-Scope".
`;

const SYSTEM_INSTRUCTION_POLICY_AUDIT = `
You are a strict CMMC Certified Assessor (CCA). 
Your job is to compare a provided policy snippet against a specific NIST/CMMC Requirement.
- Analyze if the provided text satisfies the requirement's "Assessment Objectives".
- If it passes, say "COMPLIANT" and explain why.
- If it fails, say "NON-COMPLIANT" or "PARTIAL" and list exactly what is missing.
- Be specific. If the requirement asks for "frequency", and the text doesn't have it, flag it.
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

    // Use gemini-3-pro-preview for complex reasoning tasks
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
    // Use gemini-3-pro-preview for complex reasoning tasks
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
    **Requirement:** ${req.id} - ${req.title}
    **Description:** ${req.description}
    **Objectives:** ${req.objectives.map(o => o.description).join(', ')}

    **User's Policy Snippet:**
    "${policyText}"

    **Task:**
    Perform a Gap Analysis. Does the snippet above fully satisfy the requirement?
  `;

  try {
    // Use gemini-3-pro-preview for complex reasoning tasks
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { systemInstruction: SYSTEM_INSTRUCTION_POLICY_AUDIT }
    });
    return response.text || "Analysis failed.";
  } catch (e) {
    return "Error analyzing policy.";
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
     // Use gemini-3-pro-preview for complex reasoning tasks
     const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
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
    
    Look specifically for:
    1. **Flat Networks**: Are sensitive assets mixed with general traffic?
    2. **Missing Boundary Protection**: Is there a firewall between the internet and the CUI?
    3. **Enclave Opportunities**: Recommend where to place a CUI Enclave.
  `;

  try {
    // Use gemini-3-flash-preview for vision/analysis tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
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

export const analyzeAuvikTopology = async (
    devices: AuvikDevice[]
): Promise<string> => {
    const deviceListStr = devices.map(d => 
        `- ${d.name} (${d.type}): IP ${d.ipAddress}, VLAN ${d.vlan || 'None'}`
    ).join('\n');

    const prompt = `
      I have performed a network scan using Auvik. Here is the list of discovered devices:
      
      ${deviceListStr}
      
      **Instructions:**
      1. Analyze this topology for NIST 800-171 compliance (specifically SC.3.13.1 Boundary Protection).
      2. Identify risks (e.g., Guest WiFi on same VLAN as Servers).
      3. Propose a **Secure Enclave Architecture** for handling CUI. 
      4. Suggest which devices should remain in the "Corporate" zone and which move to the "CUI Enclave".
    `;

    try {
        // Use gemini-3-pro-preview for complex reasoning tasks
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_NETWORK
            }
        });
        return response.text || "No analysis generated.";
    } catch (error) {
        return "Error analyzing Auvik topology.";
    }
};
