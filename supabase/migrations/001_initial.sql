-- ============================================================
-- Greenscape Pro QuoteBot: Initial Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pricing items: the master pricing database (200+ items)
CREATE TABLE gs_pricing_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL CHECK (unit IN ('sqft', 'lnft', 'each', 'lump', 'zone', 'load')),
  unit_price DECIMAL(10,2) NOT NULL,
  min_quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clients
CREATE TABLE gs_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Phoenix',
  state TEXT NOT NULL DEFAULT 'AZ',
  zip TEXT,
  hoa_required BOOLEAN NOT NULL DEFAULT false,
  hoa_name TEXT,
  notes TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site walks
CREATE TABLE gs_site_walks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES gs_clients(id) ON DELETE CASCADE,
  walk_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  project_types TEXT[] NOT NULL DEFAULT '{}',
  scope_notes TEXT NOT NULL DEFAULT '',
  site_conditions TEXT,
  measurements TEXT,
  budget_discussed TEXT,
  timeline_expectation TEXT,
  hoa_required BOOLEAN NOT NULL DEFAULT false,
  render_needed BOOLEAN NOT NULL DEFAULT false,
  photo_urls TEXT[] NOT NULL DEFAULT '{}',
  raw_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Proposals
CREATE TABLE gs_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_walk_id UUID NOT NULL REFERENCES gs_site_walks(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES gs_clients(id) ON DELETE CASCADE,
  proposal_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'sent', 'signed', 'rejected', 'expired')),
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL DEFAULT '',
  scope_of_work TEXT NOT NULL DEFAULT '',
  timeline_estimate TEXT NOT NULL DEFAULT '',
  warranty_terms TEXT NOT NULL DEFAULT '',
  payment_terms TEXT NOT NULL DEFAULT '',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(6,4) NOT NULL DEFAULT 0.0856,
  tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  ai_model_used TEXT,
  ai_cost_cents INTEGER DEFAULT 0,
  ai_generation_notes TEXT,
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  client_email TEXT,
  client_name TEXT,
  client_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Proposal line items
CREATE TABLE gs_proposal_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES gs_proposals(id) ON DELETE CASCADE,
  pricing_item_id UUID REFERENCES gs_pricing_items(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  line_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  ai_suggested BOOLEAN NOT NULL DEFAULT true,
  manually_adjusted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Activity log
CREATE TABLE gs_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES gs_proposals(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_gs_pricing_items_category ON gs_pricing_items(category);
CREATE INDEX idx_gs_pricing_items_active ON gs_pricing_items(is_active);
CREATE INDEX idx_gs_site_walks_client ON gs_site_walks(client_id);
CREATE INDEX idx_gs_site_walks_status ON gs_site_walks(status);
CREATE INDEX idx_gs_proposals_client ON gs_proposals(client_id);
CREATE INDEX idx_gs_proposals_status ON gs_proposals(status);
CREATE INDEX idx_gs_proposals_number ON gs_proposals(proposal_number);
CREATE INDEX idx_gs_proposal_line_items_proposal ON gs_proposal_line_items(proposal_id);
CREATE INDEX idx_gs_activity_log_proposal ON gs_activity_log(proposal_id);
CREATE INDEX idx_gs_activity_log_created ON gs_activity_log(created_at);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION gs_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gs_pricing_items_updated_at
  BEFORE UPDATE ON gs_pricing_items
  FOR EACH ROW EXECUTE FUNCTION gs_update_updated_at();

CREATE TRIGGER gs_clients_updated_at
  BEFORE UPDATE ON gs_clients
  FOR EACH ROW EXECUTE FUNCTION gs_update_updated_at();

CREATE TRIGGER gs_proposals_updated_at
  BEFORE UPDATE ON gs_proposals
  FOR EACH ROW EXECUTE FUNCTION gs_update_updated_at();
