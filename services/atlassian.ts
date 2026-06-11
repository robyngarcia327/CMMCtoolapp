
import { JiraConfig, ConfluenceConfig, Ticket } from '../types';

// Mock function to simulate creating a Jira Issue
export const createJiraTicket = async (
  ticketData: { summary: string; description: string; priority: string; requirementId: string },
  config: JiraConfig
): Promise<Ticket> => {
  console.log("Sending to Jira:", {
    url: `${config.baseUrl}/rest/api/3/issue`,
    auth: `Basic ${btoa(`${config.email}:${config.apiToken}`)}`,
    data: {
        fields: {
            project: { key: config.projectKey },
            summary: ticketData.summary,
            description: ticketData.description,
            issuetype: { name: config.issueType }
        }
    }
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const ticketNum = Math.floor(1000 + Math.random() * 9000);

  // Return mock created ticket
  return {
    id: `JIRA-${ticketNum}`,
    requirementId: ticketData.requirementId,
    summary: ticketData.summary,
    description: ticketData.description,
    priority: ticketData.priority as any,
    status: 'New', // mapped from 'To Do'
    board: config.projectKey,
    createdAt: Date.now(),
    ticketNumber: `${config.projectKey}-${ticketNum}`,
    source: 'Jira',
    url: `${config.baseUrl}/browse/${config.projectKey}-${ticketNum}`
  };
};

// Mock function to simulate publishing to Confluence
export const publishToConfluence = async (
  title: string,
  content: string, // Markdown content (would need conversion to ADF or HTML in real app)
  config: ConfluenceConfig
): Promise<string> => {
  console.log("Publishing to Confluence:", {
      url: `${config.baseUrl}/wiki/rest/api/content`,
      space: config.spaceKey,
      title: title
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return `${config.baseUrl}/wiki/spaces/${config.spaceKey}/pages/123456/${title.replace(/\s+/g, '+')}`;
};
