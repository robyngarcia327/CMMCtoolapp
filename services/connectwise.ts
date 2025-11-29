import { Ticket, ConnectWiseConfig } from '../types';

// Mock function to simulate API call to ConnectWise Manage REST API
export const createConnectWiseTicket = async (
  ticketData: Omit<Ticket, 'id' | 'createdAt' | 'ticketNumber' | 'status'>,
  config: ConnectWiseConfig
): Promise<Ticket> => {
  console.log("Sending to ConnectWise:", {
    url: `${config.siteUrl}/v4_6_release/apis/3.0/service/tickets`,
    auth: `Basic ${btoa(`${config.companyId}+${config.publicKey}:${config.privateKey}`)}`,
    data: ticketData
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Return mock created ticket
  return {
    ...ticketData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    status: 'New',
    ticketNumber: `#${Math.floor(1000 + Math.random() * 9000)}`,
  };
};

export const getServiceBoards = async (): Promise<string[]> => {
  return ['Help Desk', 'Triage', 'Project Implementation', 'Compliance Remediation', 'NOC'];
};
