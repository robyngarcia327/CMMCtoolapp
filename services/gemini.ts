
import { GoogleGenAI } from "@google/genai";
import { Requirement, AuvikDevice, Risk } from '../types';

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
  relevantRequirements: Requirement[]
): Promise<string> => {
  const prompt = `
    Act as a Lead CMMC Assessor. Perform a detailed GAP ANALYSIS on the provided policy document.
    
    TARGET DOMAIN: ${domainName}
    
    EXPECTED CONTROLS TO AUDIT AGAINST:
    ${relevantRequirements.map(r => `- ${r.id}: ${r.title} (${r.description})`).join('\n')}
    
    POLICY TEXT TO REVIEW:
    """
    ${policyText}
    """
    
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

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        systemInstruction: "You are a specialized CMMC/NIST 800-171 Policy Auditor. You provide high-fidelity, actionable feedback to help organizations reach Level 2 certification." 
      }
    });
    return response.text || "Policy audit failed to generate.";
  } catch (e) {
    return "Critical error during AI Policy Audit. Please check document size and API connectivity.";
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
