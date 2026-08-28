export type PlanCode = 'readiness' | 'starter' | 'professional' | 'guided' | 'msp';
export type ProductEdition = 'ENTERPRISE' | 'MSP';

export type EntitlementKey =
  | 'risk_register'
  | 'cui_scoping'
  | 'controls'
  | 'asset_inventory'
  | 'ssp'
  | 'poam'
  | 'sprs'
  | 'responsibility_matrices'
  | 'automated_integrations'
  | 'advanced_evidence_monitoring'
  | 'guided_hours'
  | 'managed_clients'
  | 'client_portal'
  | 'portfolio_dashboard'
  | 'service_catalog'
  | 'tool_catalog'
  | 'psa_sync'
  | 'reusable_msp_templates';

export interface PlanEntitlements {
  planCode: PlanCode;
  edition: ProductEdition;
  displayName: string;
  description: string;
  monthlyPrice: string;
  annualPrice?: string;
  storageGb: number | null;
  userLimit: number | null;
  assessorLimit: number;
  guidanceHoursMonthly: number;
  managedClientLimit: number;
  capabilities: Record<EntitlementKey, boolean>;
}

const enterpriseCore: Record<EntitlementKey, boolean> = {
  risk_register: true,
  cui_scoping: true,
  controls: true,
  asset_inventory: true,
  ssp: true,
  poam: true,
  sprs: true,
  responsibility_matrices: true,
  automated_integrations: false,
  advanced_evidence_monitoring: false,
  guided_hours: false,
  managed_clients: false,
  client_portal: false,
  portfolio_dashboard: false,
  service_catalog: false,
  tool_catalog: false,
  psa_sync: false,
  reusable_msp_templates: false,
};

export const PLAN_ENTITLEMENTS: Record<PlanCode, PlanEntitlements> = {
  readiness: {
    planCode: 'readiness',
    edition: 'ENTERPRISE',
    displayName: 'Readiness',
    description: 'Initial organization setup and subscription selection.',
    monthlyPrice: 'Not subscribed',
    storageGb: 0,
    userLimit: 1,
    assessorLimit: 0,
    guidanceHoursMonthly: 0,
    managedClientLimit: 0,
    capabilities: { ...enterpriseCore },
  },
  starter: {
    planCode: 'starter',
    edition: 'ENTERPRISE',
    displayName: 'Starter',
    description: 'A focused workspace for organizations beginning their CMMC program.',
    monthlyPrice: '$299/month',
    annualPrice: '$3,200/year',
    storageGb: 50,
    userLimit: 5,
    assessorLimit: 1,
    guidanceHoursMonthly: 0,
    managedClientLimit: 0,
    capabilities: { ...enterpriseCore },
  },
  professional: {
    planCode: 'professional',
    edition: 'ENTERPRISE',
    displayName: 'Professional',
    description: 'More capacity, automation, and evidence monitoring for established compliance teams.',
    monthlyPrice: '$599/month',
    annualPrice: '$7,000/year',
    storageGb: 100,
    userLimit: 10,
    assessorLimit: 3,
    guidanceHoursMonthly: 0,
    managedClientLimit: 0,
    capabilities: {
      ...enterpriseCore,
      automated_integrations: true,
      advanced_evidence_monitoring: true,
    },
  },
  guided: {
    planCode: 'guided',
    edition: 'ENTERPRISE',
    displayName: 'Guided',
    description: 'Enterprise compliance workspace with hands-on Cuallee application guidance.',
    monthlyPrice: '$1,499/month',
    annualPrice: '$17,000/year',
    storageGb: null,
    userLimit: null,
    assessorLimit: 5,
    guidanceHoursMonthly: 5,
    managedClientLimit: 0,
    capabilities: {
      ...enterpriseCore,
      automated_integrations: true,
      advanced_evidence_monitoring: true,
      guided_hours: true,
    },
  },
  msp: {
    planCode: 'msp',
    edition: 'MSP',
    displayName: 'MSP Partner Hub',
    description: 'A multi-client operating system for MSP-delivered CMMC preparation and evidence management.',
    monthlyPrice: '$499 + $100/client/month',
    storageGb: null,
    userLimit: null,
    assessorLimit: 5,
    guidanceHoursMonthly: 0,
    managedClientLimit: -1,
    capabilities: {
      ...enterpriseCore,
      automated_integrations: true,
      advanced_evidence_monitoring: true,
      managed_clients: true,
      client_portal: true,
      portfolio_dashboard: true,
      service_catalog: true,
      tool_catalog: true,
      psa_sync: true,
      reusable_msp_templates: true,
    },
  },
};

export const normalizePlanCode = (value?: string): PlanCode => {
  const normalized = (value || '').toLowerCase() as PlanCode;
  return normalized in PLAN_ENTITLEMENTS ? normalized : 'readiness';
};

export const resolveEdition = (input: {
  planCode?: string;
  tenantType?: string;
  edition?: string;
  isParent?: boolean;
}): ProductEdition => {
  if (input.edition === 'MSP' || input.tenantType === 'MSP' || input.isParent || normalizePlanCode(input.planCode) === 'msp') {
    return 'MSP';
  }
  return 'ENTERPRISE';
};

export const getEntitlements = (planCode?: string) => PLAN_ENTITLEMENTS[normalizePlanCode(planCode)];
