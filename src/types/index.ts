// ============================================================
// Greenscape Pro QuoteBot - Type Definitions
// ============================================================

export interface PricingItem {
  id: string;
  category: string;
  name: string;
  description: string;
  unit: 'sqft' | 'lnft' | 'each' | 'lump' | 'zone' | 'load';
  unit_price: number;
  min_quantity: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string;
  state: string;
  zip: string | null;
  hoa_required: boolean;
  hoa_name: string | null;
  notes: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteWalk {
  id: string;
  client_id: string;
  walk_date: string;
  project_types: string[];
  scope_notes: string;
  site_conditions: string | null;
  measurements: string | null;
  budget_discussed: string | null;
  timeline_expectation: string | null;
  hoa_required: boolean;
  render_needed: boolean;
  photo_urls: string[];
  raw_notes: string | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  created_at: string;
  client?: Client;
}

export interface Proposal {
  id: string;
  site_walk_id: string;
  client_id: string;
  proposal_number: string;
  status: ProposalStatus;
  project_title: string;
  project_description: string;
  scope_of_work: string;
  timeline_estimate: string;
  warranty_terms: string;
  payment_terms: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  ai_model_used: string;
  ai_cost_cents: number;
  ai_generation_notes: string | null;
  render_image?: string | null;
  sent_at: string | null;
  signed_at: string | null;
  expires_at: string | null;
  client_email: string | null;
  client_name: string | null;
  client_address: string | null;
  created_at: string;
  updated_at: string;
  line_items?: ProposalLineItem[];
  site_walk?: SiteWalk;
  client?: Client;
  activity_log?: ActivityLogEntry[];
}

export type ProposalStatus = 'draft' | 'review' | 'approved' | 'sent' | 'signed' | 'rejected' | 'expired';

export interface ProposalLineItem {
  id: string;
  proposal_id: string;
  pricing_item_id: string | null;
  category: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order: number;
  ai_suggested: boolean;
  manually_adjusted: boolean;
  created_at: string;
}

export interface ActivityLogEntry {
  id: string;
  proposal_id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

// AI Generation types
export interface AILineItem {
  category: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  confidence: number;
  notes: string;
  pricingItemId?: string;
}

export interface AIGenerationResult {
  projectTitle: string;
  projectDescription: string;
  scopeOfWork: string;
  timelineEstimate: string;
  lineItems: AILineItem[];
  aiNotes: string;
  suggestedUpsells: string[];
  estimatedCostCents: number;
  modelUsed: string;
}

export interface SiteWalkFormData {
  // Client info
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  hoaRequired: boolean;
  hoaName: string;
  existingClientId?: string;

  // Site walk details
  walkDate: string;
  projectTypes: string[];
  scopeNotes: string;
  siteConditions: string;
  measurements: string;
  budgetDiscussed: string;
  timelineExpectation: string;
  renderNeeded: boolean;
  rawNotes: string;
}

export interface DashboardStats {
  proposalsThisMonth: number;
  proposalsThisQuarter: number;
  pipelineRevenue: number;
  averageGenerationTime: number;
  winRate: number;
  totalSigned: number;
  totalSent: number;
}

export const PROJECT_TYPES = [
  'Patio / Pavers',
  'Pergola / Shade Structure',
  'Fire Pit / Fireplace',
  'Water Feature',
  'Artificial Turf',
  'Irrigation System',
  'Outdoor Kitchen',
  'Retaining Wall',
  'Landscape Planting',
  'Outdoor Lighting',
  'Pool Deck',
  'Driveway',
  'Walkway / Path',
  'Fencing',
  'Grading / Site Prep',
] as const;

export const PROPOSAL_STATUS_CONFIG: Record<ProposalStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-slate-400', bgColor: 'bg-slate-700' },
  review: { label: 'In Review', color: 'text-amber-400', bgColor: 'bg-amber-900/30' },
  approved: { label: 'Approved', color: 'text-emerald-400', bgColor: 'bg-emerald-900/30' },
  sent: { label: 'Sent', color: 'text-blue-400', bgColor: 'bg-blue-900/30' },
  signed: { label: 'Signed', color: 'text-emerald-400', bgColor: 'bg-emerald-900/30' },
  rejected: { label: 'Rejected', color: 'text-red-400', bgColor: 'bg-red-900/30' },
  expired: { label: 'Expired', color: 'text-red-400', bgColor: 'bg-red-900/30' },
};
