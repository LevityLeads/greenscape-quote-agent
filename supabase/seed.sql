-- ============================================================
-- Greenscape Pro QuoteBot: Seed Data
-- 200+ realistic pricing items for Phoenix, AZ landscaping
-- ============================================================

-- Clear existing data
TRUNCATE gs_pricing_items CASCADE;

-- ============================================================
-- HARDSCAPE (40 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Hardscape', 'Concrete Pavers - Standard', 'Standard interlocking concrete pavers, Belgard or Tremron equivalent', 'sqft', 18.00, 100, 'Includes sand base and polymeric sand joints'),
('Hardscape', 'Concrete Pavers - Premium', 'Premium textured concrete pavers with color blending', 'sqft', 24.00, 100, 'Belgard Mega-Arbel or equivalent'),
('Hardscape', 'Concrete Pavers - Permeable', 'Permeable interlocking pavers for drainage areas', 'sqft', 28.00, 50, 'Meets AZ stormwater requirements'),
('Hardscape', 'Travertine Pavers - Standard', 'Tumbled travertine pavers, ivory/beige tones', 'sqft', 25.00, 100, 'Popular for Phoenix heat resistance'),
('Hardscape', 'Travertine Pavers - Premium', 'Select-grade travertine with minimal veining', 'sqft', 35.00, 100, 'French pattern or custom layout'),
('Hardscape', 'Travertine Pavers - Silver', 'Silver/grey travertine, modern aesthetic', 'sqft', 38.00, 80, 'Contemporary design applications'),
('Hardscape', 'Natural Stone - Flagstone', 'Arizona flagstone, natural cut', 'sqft', 22.00, 50, 'Dry-laid with decomposed granite joints'),
('Hardscape', 'Natural Stone - Flagstone Mortared', 'Arizona flagstone with mortar-set installation', 'sqft', 30.00, 50, 'On concrete slab base'),
('Hardscape', 'Natural Stone - Slate', 'Natural slate pavers, earth tones', 'sqft', 28.00, 50, 'Heat-treated for AZ temperatures'),
('Hardscape', 'Stamped Concrete', 'Colored and stamped concrete, standard patterns', 'sqft', 14.00, 150, 'Includes color hardener and release agent'),
('Hardscape', 'Stamped Concrete - Premium', 'Multi-color stamped concrete with custom patterns', 'sqft', 18.00, 150, 'Hand-carved borders available'),
('Hardscape', 'Concrete - Brushed Finish', 'Standard brushed/broom-finish concrete', 'sqft', 10.00, 100, 'Economical patio or walkway option'),
('Hardscape', 'Concrete - Exposed Aggregate', 'Exposed aggregate decorative concrete', 'sqft', 16.00, 100, 'Desert aggregate blend'),
('Hardscape', 'Concrete - Colored', 'Integrally colored concrete with smooth finish', 'sqft', 13.00, 100, 'Wide range of earth tones'),
('Hardscape', 'Porcelain Pavers - Standard', 'Outdoor-rated porcelain tile pavers, 2cm thick', 'sqft', 30.00, 80, 'Pedestal or mortar-set installation'),
('Hardscape', 'Porcelain Pavers - Premium', 'Large-format porcelain pavers with wood or stone look', 'sqft', 42.00, 80, '24x48 or 24x24 format'),
('Hardscape', 'Paver Border - Soldier Course', 'Contrasting paver border, soldier course pattern', 'lnft', 12.00, 20, 'Single row contrasting border'),
('Hardscape', 'Paver Border - Double', 'Double-row decorative paver border', 'lnft', 22.00, 20, 'Accent color included'),
('Hardscape', 'Paver Edge Restraint', 'Aluminum or plastic paver edge restraint', 'lnft', 4.50, 50, 'Includes spikes'),
('Hardscape', 'Concrete Sealer', 'Penetrating or film-forming concrete/paver sealer', 'sqft', 1.50, 100, 'Reapply every 2-3 years'),
('Hardscape', 'Stone Veneer - Natural', 'Natural stone veneer for walls, columns, and accents', 'sqft', 32.00, 20, 'Includes mortar bed and grouting'),
('Hardscape', 'Stone Veneer - Manufactured', 'Manufactured stone veneer, Eldorado or equivalent', 'sqft', 24.00, 20, 'Lighter weight, easier installation'),
('Hardscape', 'Fire Pit - Gas, Round', 'Built-in gas fire pit, 42" round, natural stone cap', 'each', 4500.00, 1, 'Includes gas line from stub-out'),
('Hardscape', 'Fire Pit - Gas, Rectangle', 'Built-in rectangular gas fire pit, 24x48"', 'each', 5500.00, 1, 'Linear flame, modern design'),
('Hardscape', 'Fire Pit - Wood Burning', 'Masonry wood-burning fire pit with steel insert', 'each', 3200.00, 1, 'Check HOA before specifying'),
('Hardscape', 'Fireplace - Outdoor', 'Full outdoor fireplace with chimney, natural stone', 'each', 12000.00, 1, 'Structural permit required'),
('Hardscape', 'Seat Wall', 'Masonry seat wall with cap stone, 18" tall', 'lnft', 85.00, 6, 'Matches patio material palette'),
('Hardscape', 'Seat Wall - With Lights', 'Seat wall with integrated LED strip lighting', 'lnft', 110.00, 6, 'Low-voltage LED, includes transformer share'),
('Hardscape', 'Column/Pillar - Standard', 'Masonry column, 18x18", stone or stucco finish', 'each', 1800.00, 1, 'Up to 6ft tall'),
('Hardscape', 'Column/Pillar - With Light', 'Masonry column with integrated cap light', 'each', 2200.00, 1, 'LED cap light included'),
('Hardscape', 'Steps - Concrete', 'Formed concrete steps with matching finish', 'lnft', 95.00, 4, 'Per linear foot of step width'),
('Hardscape', 'Steps - Natural Stone', 'Natural stone slab steps', 'lnft', 140.00, 4, 'Thick-cut flagstone or travertine'),
('Hardscape', 'Steps - Paver', 'Paver-clad steps with bullnose treads', 'lnft', 120.00, 4, 'Matches paver patio materials'),
('Hardscape', 'Coping - Pool/Wall', 'Natural stone or paver coping for walls and pool edges', 'lnft', 28.00, 20, 'Bullnose or square edge'),
('Hardscape', 'Expansion Joint', 'Silicone expansion joint for concrete flatwork', 'lnft', 3.50, 20, 'Required every 10-12ft'),
('Hardscape', 'Concrete Slab - Base', 'Reinforced concrete slab base for structures', 'sqft', 12.00, 50, '4" thick with #4 rebar grid'),
('Hardscape', 'Decorative Gravel Border', 'Decomposed granite or decorative rock border strip', 'sqft', 6.00, 20, 'Steel or aluminum edging included'),
('Hardscape', 'Stucco Finish - Walls', 'Three-coat stucco finish on block walls or structures', 'sqft', 14.00, 30, 'Color-matched to home exterior'),
('Hardscape', 'BBQ Island - Basic', 'L-shaped BBQ island, block construction, stucco finish', 'each', 6500.00, 1, 'Does not include grill or appliances'),
('Hardscape', 'BBQ Island - Premium', 'Custom BBQ island with stone veneer and granite top', 'each', 12000.00, 1, 'Does not include appliances');

-- ============================================================
-- LANDSCAPE (30 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Landscape', 'Desert Plantings - 5gal', '5-gallon desert-adapted shrubs and accent plants', 'each', 175.00, 3, 'Includes planting, backfill, root stimulator'),
('Landscape', 'Desert Plantings - 15gal', '15-gallon specimen desert plants (agave, yucca, etc.)', 'each', 350.00, 1, 'Includes planting and initial support'),
('Landscape', 'Desert Plantings - 24" Box', '24" box desert trees or large specimens', 'each', 550.00, 1, 'Requires staking for first year'),
('Landscape', 'Tree - 24" Box', '24-inch box tree, desert-adapted species', 'each', 450.00, 1, 'Mesquite, Palo Verde, Ironwood, etc.'),
('Landscape', 'Tree - 36" Box', '36-inch box tree, semi-mature specimen', 'each', 850.00, 1, 'Immediate impact, staking required'),
('Landscape', 'Tree - 48" Box', '48-inch box tree, mature specimen', 'each', 1500.00, 1, 'Crane placement may be required'),
('Landscape', 'Tree - Multi-trunk Palo Verde', 'Multi-trunk Palo Verde, 36" box', 'each', 1200.00, 1, 'Signature desert aesthetic'),
('Landscape', 'Tree - Date Palm', 'Date palm, 10-12ft clear trunk', 'each', 2000.00, 1, 'Crane required for placement'),
('Landscape', 'Tree - Mediterranean Fan Palm', 'Mediterranean fan palm, 8-10ft', 'each', 800.00, 1, 'Drought-tolerant palm option'),
('Landscape', 'Saguaro Cactus', 'Salvaged saguaro cactus, 6-8ft', 'each', 1800.00, 1, 'Permit and tag verification required'),
('Landscape', 'Saguaro Cactus - Large', 'Salvaged saguaro, 10-14ft with arms', 'each', 3500.00, 1, 'Crane placement, permit required'),
('Landscape', 'Decomposed Granite - Standard', 'Decomposed granite ground cover, 3" depth', 'sqft', 3.50, 100, 'Stabilized DG available at $4.50/sqft'),
('Landscape', 'Decomposed Granite - Stabilized', 'Polymer-stabilized DG for walkways', 'sqft', 4.50, 50, 'Firmer surface, less tracking'),
('Landscape', 'River Rock - 3/4"', '3/4" river rock ground cover, 3" depth', 'sqft', 5.00, 50, 'Natural earth tones'),
('Landscape', 'River Rock - 1.5"', '1.5" decorative river rock', 'sqft', 5.50, 50, 'Larger profile for accent areas'),
('Landscape', 'Mexican Beach Pebble', 'Black or mixed Mexican beach pebble', 'sqft', 7.50, 20, 'Premium decorative accent rock'),
('Landscape', 'Rip Rap - Drainage', 'Large rip rap stone for drainage channels', 'sqft', 6.00, 30, 'Functional and decorative drainage'),
('Landscape', 'Boulders - Accent', 'Decorative accent boulders, 18-30"', 'each', 350.00, 1, 'Placed with equipment'),
('Landscape', 'Boulders - Feature', 'Large feature boulders, 36-48"', 'each', 650.00, 1, 'Statement pieces, equipment placement'),
('Landscape', 'Boulders - Massive', 'Massive character boulder, 48"+', 'each', 1200.00, 1, 'Crane placement may be required'),
('Landscape', 'Sod - Bermuda', 'Bermuda grass sod installation', 'sqft', 2.50, 200, 'Includes prep, grade, and first mow'),
('Landscape', 'Sod - Fescue (Overseed)', 'Winter rye/fescue overseed for Bermuda lawns', 'sqft', 1.50, 200, 'Seasonal, October through March'),
('Landscape', 'Mulch - Shredded Bark', 'Shredded bark mulch, 3" depth', 'sqft', 3.00, 50, 'Replenish annually'),
('Landscape', 'Landscape Fabric', 'Commercial-grade weed barrier fabric', 'sqft', 1.25, 100, 'Under rock and mulch areas'),
('Landscape', 'Steel Edging', 'Steel landscape edging, 4" height', 'lnft', 8.00, 20, 'Defines planting bed borders'),
('Landscape', 'Aluminum Edging', 'Aluminum landscape edging, clean modern line', 'lnft', 10.00, 20, 'Premium edge definition'),
('Landscape', 'Planting Bed Prep', 'Soil amendment, grading, and preparation for planting beds', 'sqft', 3.00, 50, 'Includes organic amendments'),
('Landscape', 'Flower Bed - Annual Color', 'Seasonal annual flower installation', 'sqft', 8.00, 20, 'Changed 2-3 times per year'),
('Landscape', 'Groundcover - Trailing', 'Trailing groundcover plants (lantana, dalea)', 'sqft', 6.00, 30, 'Full coverage in 1-2 seasons'),
('Landscape', 'Container Planting', 'Large decorative pot with planted arrangement', 'each', 400.00, 1, 'Pot and plants included');

-- ============================================================
-- WATER FEATURES (15 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Water Features', 'Fountain - Freestanding', 'Freestanding decorative fountain, 3-4ft', 'each', 2500.00, 1, 'Self-contained with recirculating pump'),
('Water Features', 'Fountain - Wall Mounted', 'Wall-mounted water feature with basin', 'each', 3500.00, 1, 'Requires wall structure or retrofit'),
('Water Features', 'Fountain - Custom Urn/Pot', 'Oversized pot or urn converted to bubbling fountain', 'each', 1800.00, 1, 'Choice of vessel styles'),
('Water Features', 'Pond - Small', 'Small garden pond, up to 50 sqft', 'each', 4500.00, 1, 'Liner, pump, filtration included'),
('Water Features', 'Pond - Medium', 'Medium garden pond, 50-100 sqft', 'each', 8000.00, 1, 'With biological filtration system'),
('Water Features', 'Pond - Large', 'Large feature pond, 100+ sqft', 'each', 14000.00, 1, 'Custom design, premium filtration'),
('Water Features', 'Waterfall - Small', 'Small cascading waterfall, 3-4ft drop', 'each', 5000.00, 1, 'Natural boulder construction'),
('Water Features', 'Waterfall - Medium', 'Medium waterfall feature, 5-7ft drop', 'each', 9000.00, 1, 'Multiple cascades, natural look'),
('Water Features', 'Waterfall - Large', 'Large signature waterfall, 8ft+ drop', 'each', 15000.00, 1, 'Major focal point, structural engineering'),
('Water Features', 'Bubbler Rock', 'Natural boulder with drilled bubbler', 'each', 2000.00, 1, 'Basin, pump, plumbing included'),
('Water Features', 'Stream/Creek - Per Foot', 'Naturalistic stream bed construction', 'lnft', 120.00, 10, 'Includes liner, rock, and planting pockets'),
('Water Features', 'Scupper - Wall', 'Stainless or copper wall scupper into basin', 'each', 2800.00, 1, 'Modern/contemporary water feature'),
('Water Features', 'Water Feature Lighting', 'Submersible LED lighting for water features', 'each', 350.00, 1, 'Color-changing options available'),
('Water Features', 'Water Feature - Auto Fill', 'Automatic fill valve and float system', 'each', 450.00, 1, 'Essential for Phoenix evaporation rates'),
('Water Features', 'Splash Pad - Residential', 'In-ground splash pad with jets and drain', 'each', 8500.00, 1, 'Great for families, permit required');

-- ============================================================
-- LIGHTING (20 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Lighting', 'Path Light - Standard', 'Low-voltage LED path light, brass/copper', 'each', 175.00, 4, 'WAC, Kichler, or equivalent'),
('Lighting', 'Path Light - Premium', 'Premium LED path light, architectural design', 'each', 275.00, 4, 'Unique Lighting or FX Luminaire'),
('Lighting', 'Uplight - Standard', 'LED directional uplight for trees and architecture', 'each', 225.00, 2, 'Adjustable beam angle'),
('Lighting', 'Uplight - Premium', 'Premium LED uplight with color temperature control', 'each', 375.00, 2, 'Wi-fi controllable, dimming'),
('Lighting', 'Downlight - Tree Mount', 'LED downlight mounted in tree canopy', 'each', 300.00, 2, 'Moonlighting effect, natural look'),
('Lighting', 'Wall Wash Light', 'LED wall wash for textured surfaces', 'each', 250.00, 2, 'Grazing light for stone walls'),
('Lighting', 'Step Light - Recessed', 'Recessed LED step light, brass housing', 'each', 185.00, 4, 'Safety and accent lighting'),
('Lighting', 'Deck/Patio Light - Recessed', 'In-ground recessed LED paver light', 'each', 200.00, 4, 'Flush-mount in hardscape'),
('Lighting', 'String Lights - Commercial', 'Commercial-grade LED string lights on cable', 'lnft', 18.00, 30, 'Includes posts or attachment points'),
('Lighting', 'String Lights - Premium', 'Premium Edison-style string lights on steel cable', 'lnft', 24.00, 30, 'Dimmable, heavy-duty connectors'),
('Lighting', 'LED Strip - Hardscape', 'LED strip light for under-cap or cove installation', 'lnft', 22.00, 10, 'IP67 waterproof rating'),
('Lighting', 'LED Strip - Color Changing', 'RGBW LED strip for dynamic color effects', 'lnft', 32.00, 10, 'Wi-fi controller included per zone'),
('Lighting', 'Spotlight - Accent', 'Adjustable LED spotlight for focal points', 'each', 195.00, 1, 'MR16 LED, multiple beam spreads'),
('Lighting', 'Underwater Light', 'Submersible LED for pools or water features', 'each', 350.00, 1, 'Nicheless or niche-mount options'),
('Lighting', 'Transformer - 300W', '300W low-voltage transformer with timer', 'each', 450.00, 1, 'Supports 15-20 fixtures'),
('Lighting', 'Transformer - 600W', '600W low-voltage transformer with smart controls', 'each', 750.00, 1, 'Supports 30-40 fixtures, Wi-fi enabled'),
('Lighting', 'Landscape Wire - 12/2', '12-gauge, 2-conductor direct-burial wire', 'lnft', 2.50, 100, 'Standard lighting wire run'),
('Lighting', 'Landscape Wire - 10/2', '10-gauge, 2-conductor for long runs', 'lnft', 3.50, 50, 'Reduces voltage drop on long runs'),
('Lighting', 'Photocell / Timer', 'Astronomical timer or photocell for auto on/off', 'each', 120.00, 1, 'Set-and-forget operation'),
('Lighting', 'Smart Lighting Controller', 'Wi-fi lighting controller with app and scheduling', 'each', 350.00, 1, 'Zone control, dimming, scenes');

-- ============================================================
-- IRRIGATION (18 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Irrigation', 'Drip Zone - Standard', 'Complete drip irrigation zone with emitters and tubing', 'zone', 550.00, 1, 'Covers up to 500 sqft of planting area'),
('Irrigation', 'Drip Zone - Large', 'Large drip zone for extensive planting areas', 'zone', 800.00, 1, 'Covers 500-1000 sqft'),
('Irrigation', 'Spray Zone - Turf', 'Pop-up spray zone for turf areas', 'zone', 450.00, 1, 'Rotary nozzles for even coverage'),
('Irrigation', 'Spray Zone - Rotor', 'Rotor zone for large turf areas', 'zone', 500.00, 1, 'Coverage up to 2500 sqft'),
('Irrigation', 'Smart Controller - Basic', 'Wi-fi smart irrigation controller, 8 zones', 'each', 550.00, 1, 'Weather-based auto-adjustment'),
('Irrigation', 'Smart Controller - Pro', 'Professional smart controller, 16 zones, flow sensor', 'each', 1200.00, 1, 'Leak detection, zone-level monitoring'),
('Irrigation', 'Rain/Freeze Sensor', 'Wireless rain and freeze sensor', 'each', 175.00, 1, 'Prevents watering during rain events'),
('Irrigation', 'Flow Sensor', 'Inline flow sensor for leak detection', 'each', 250.00, 1, 'Pairs with smart controller'),
('Irrigation', 'Backflow Preventer', 'RPZ backflow prevention device', 'each', 650.00, 1, 'Required by Phoenix code'),
('Irrigation', 'Valve Box - Standard', 'Standard irrigation valve box with valve', 'each', 185.00, 1, 'Includes valve and wiring'),
('Irrigation', 'Mainline - 1" PVC', '1" PVC mainline installation', 'lnft', 5.50, 50, 'Schedule 40 PVC with primer and glue'),
('Irrigation', 'Mainline - 1.5" PVC', '1.5" PVC mainline for larger systems', 'lnft', 7.00, 30, 'For commercial-grade residential systems'),
('Irrigation', 'Lateral Line - 3/4"', '3/4" lateral line to valve boxes', 'lnft', 4.00, 20, 'Standard zone supply line'),
('Irrigation', 'Drip Tubing', '1/2" drip distribution tubing', 'lnft', 1.50, 50, 'With pressure compensating emitters'),
('Irrigation', 'Bubbler - Tree', 'Flood bubbler for tree wells', 'each', 45.00, 3, 'Deep watering for established trees'),
('Irrigation', 'Irrigation Repair/Retrofit', 'Repair or modify existing irrigation zones', 'each', 350.00, 1, 'Per zone retrofit'),
('Irrigation', 'Drip Conversion', 'Convert spray zone to drip for water savings', 'zone', 400.00, 1, 'Water-efficient upgrade'),
('Irrigation', 'System Blowout/Winterize', 'Compressed air blowout for winter prep', 'each', 150.00, 1, 'Annual maintenance item');

-- ============================================================
-- OUTDOOR KITCHEN (20 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Outdoor Kitchen', 'Built-in Grill - 32"', '32" built-in gas grill, stainless steel', 'each', 3500.00, 1, 'Bull, Blaze, or equivalent'),
('Outdoor Kitchen', 'Built-in Grill - 36" Premium', '36" premium built-in grill', 'each', 5500.00, 1, 'Lynx, DCS, or equivalent'),
('Outdoor Kitchen', 'Built-in Grill - 42" Pro', '42" professional-grade built-in grill', 'each', 8000.00, 1, 'Top-tier brands, rotisserie included'),
('Outdoor Kitchen', 'Side Burner - Double', 'Double side burner, built-in', 'each', 1200.00, 1, 'Great for sauces and sides'),
('Outdoor Kitchen', 'Pizza Oven - Built-in', 'Wood or gas-fired built-in pizza oven', 'each', 4500.00, 1, 'Reaches 800F+'),
('Outdoor Kitchen', 'Smoker - Built-in', 'Built-in smoker/charcoal grill combo', 'each', 3000.00, 1, 'Offset or cabinet-style'),
('Outdoor Kitchen', 'Countertop - Granite', 'Outdoor-grade granite countertop', 'sqft', 95.00, 15, 'Sealed for outdoor exposure'),
('Outdoor Kitchen', 'Countertop - Concrete', 'Custom cast concrete countertop', 'sqft', 80.00, 15, 'Sealed and colored to specification'),
('Outdoor Kitchen', 'Countertop - Tile', 'Porcelain tile countertop with bullnose edge', 'sqft', 65.00, 15, 'Heat and weather resistant'),
('Outdoor Kitchen', 'Countertop - Quartzite', 'Natural quartzite outdoor countertop', 'sqft', 130.00, 15, 'Premium natural stone option'),
('Outdoor Kitchen', 'Sink - Bar', 'Stainless bar sink with faucet', 'each', 850.00, 1, 'Includes drain and supply lines'),
('Outdoor Kitchen', 'Sink - Full Size', 'Full-size stainless outdoor sink', 'each', 1400.00, 1, 'Prep-kitchen capable'),
('Outdoor Kitchen', 'Refrigerator - Undercounter', 'Outdoor-rated undercounter refrigerator', 'each', 1800.00, 1, 'UL-rated for outdoor use'),
('Outdoor Kitchen', 'Refrigerator - Drawer', 'Outdoor-rated refrigerator drawer unit', 'each', 2200.00, 1, 'Convenient pull-out access'),
('Outdoor Kitchen', 'Ice Maker', 'Built-in outdoor ice maker', 'each', 2000.00, 1, 'Clear ice, 50lb/day capacity'),
('Outdoor Kitchen', 'Kegerator/Tap', 'Outdoor-rated kegerator or draft system', 'each', 2500.00, 1, 'Single or dual tap'),
('Outdoor Kitchen', 'Gas Line - Run', 'Gas line from meter to outdoor kitchen', 'lnft', 35.00, 20, 'Licensed plumber, permit required'),
('Outdoor Kitchen', 'Electrical - Outdoor', 'Outdoor electrical circuit with GFCI outlets', 'each', 650.00, 1, 'Per circuit, permit required'),
('Outdoor Kitchen', 'Exhaust Hood - Outdoor', 'Stainless steel outdoor vent hood', 'each', 2800.00, 1, 'For covered kitchen areas'),
('Outdoor Kitchen', 'Storage Door/Drawer', 'Stainless steel access door or drawer set', 'each', 450.00, 1, 'Various sizes available');

-- ============================================================
-- PERGOLA & SHADE (18 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Pergola & Shade', 'Wood Pergola - Standard', 'Cedar or redwood pergola, standard design', 'sqft', 65.00, 100, 'Stained and sealed, 4-post minimum'),
('Pergola & Shade', 'Wood Pergola - Premium', 'Premium wood pergola with decorative details', 'sqft', 95.00, 100, 'Custom joinery, upgraded hardware'),
('Pergola & Shade', 'Wood Pergola - Attached', 'Ledger-mounted wood pergola attached to home', 'sqft', 75.00, 80, 'Structural connection to house'),
('Pergola & Shade', 'Aluminum Pergola - Standard', 'Powder-coated aluminum pergola', 'sqft', 85.00, 100, 'Low maintenance, will not rot'),
('Pergola & Shade', 'Aluminum Pergola - Louvered', 'Motorized louvered aluminum pergola', 'sqft', 140.00, 100, 'Adjustable louvers, rain sensor option'),
('Pergola & Shade', 'Steel Pergola - Modern', 'Custom steel pergola, modern design', 'sqft', 110.00, 80, 'Powder-coated, clean lines'),
('Pergola & Shade', 'Ramada - Stucco/Block', 'Solid-roof ramada with stucco columns and block', 'sqft', 120.00, 100, 'Full shade, matches home construction'),
('Pergola & Shade', 'Shade Sail - Standard', 'Commercial-grade shade sail with hardware', 'sqft', 18.00, 100, '95% UV block, 10-year fabric warranty'),
('Pergola & Shade', 'Shade Sail - Premium', 'Premium architectural shade sail, custom color', 'sqft', 28.00, 100, 'Hypar or multi-point design'),
('Pergola & Shade', 'Lattice Panel', 'Cedar or vinyl lattice panel for existing structure', 'sqft', 22.00, 20, 'Privacy or partial shade screening'),
('Pergola & Shade', 'Ceiling Fan - Outdoor', 'Outdoor-rated ceiling fan for pergola/ramada', 'each', 550.00, 1, 'Wet-rated, includes installation'),
('Pergola & Shade', 'Misting System', 'High-pressure misting system for shade structures', 'lnft', 25.00, 20, 'Essential for Phoenix summer comfort'),
('Pergola & Shade', 'Misting System - Premium', 'High-pressure mist system with pump and filtration', 'lnft', 40.00, 20, 'No drip, 1000 PSI system'),
('Pergola & Shade', 'Retractable Awning', 'Motorized retractable awning', 'sqft', 35.00, 60, 'Somfy motor, remote control'),
('Pergola & Shade', 'Drop Shade - Manual', 'Manual roll-down shade screen for pergola sides', 'sqft', 15.00, 30, 'UV and wind protection'),
('Pergola & Shade', 'Drop Shade - Motorized', 'Motorized roll-down shade with remote', 'sqft', 28.00, 30, 'Solar or hardwired motor'),
('Pergola & Shade', 'Pergola Post Wrap', 'Stone or tile veneer wrap for pergola posts', 'each', 800.00, 4, 'Upgraded post appearance'),
('Pergola & Shade', 'Pergola Lighting Package', 'Integrated lighting for pergola structure', 'each', 1500.00, 1, 'String lights, downlights, or LED strips');

-- ============================================================
-- ARTIFICIAL TURF (12 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Artificial Turf', 'Turf - Economy', 'Economy-grade artificial turf, 50oz face weight', 'sqft', 9.00, 200, 'Budget option, still looks good'),
('Artificial Turf', 'Turf - Standard', 'Standard artificial turf, 60-70oz face weight', 'sqft', 12.00, 200, 'Most popular residential grade'),
('Artificial Turf', 'Turf - Premium', 'Premium artificial turf, 80oz+ with dual-blade', 'sqft', 16.00, 100, 'Ultra-realistic, multi-color blend'),
('Artificial Turf', 'Turf - Pet Friendly', 'Antimicrobial pet-friendly turf with drainage', 'sqft', 14.00, 100, 'Enhanced drainage and odor control'),
('Artificial Turf', 'Putting Green - Standard', 'Putting green turf, medium speed', 'sqft', 18.00, 100, 'Includes contour and cup installation'),
('Artificial Turf', 'Putting Green - Pro', 'Tournament-speed putting green turf', 'sqft', 24.00, 80, 'Stimpmeter 10+ speed, multiple cups'),
('Artificial Turf', 'Turf Base Prep', 'Base preparation for artificial turf: excavation, Class II base, compaction', 'sqft', 3.50, 200, 'Required for all turf installations'),
('Artificial Turf', 'Turf - Fringe/Rough', 'Taller-blade fringe or rough turf for putting greens', 'sqft', 15.00, 30, 'Surrounding the putting surface'),
('Artificial Turf', 'Infill - Standard', 'Silica sand and crumb rubber infill', 'sqft', 1.00, 200, 'Standard infill blend'),
('Artificial Turf', 'Infill - Organic', 'Organic/plant-based infill, cooler surface temp', 'sqft', 2.00, 200, 'Reduces surface temperature 15-20F'),
('Artificial Turf', 'Turf Seaming', 'Seaming and joining of turf panels', 'lnft', 8.00, 20, 'Professional glue and tape method'),
('Artificial Turf', 'Turf Edging/Border', 'Aluminum or bender-board edging for turf perimeter', 'lnft', 6.00, 30, 'Clean edge definition');

-- ============================================================
-- RETAINING WALLS (15 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Retaining Walls', 'Block Wall - Standard', 'CMU block retaining wall, up to 4ft', 'sqft', 38.00, 30, 'Face square footage, includes footing'),
('Retaining Walls', 'Block Wall - Tall', 'Engineered block retaining wall, 4-8ft', 'sqft', 52.00, 30, 'Requires engineering, geogrid reinforcement'),
('Retaining Walls', 'Segmental Block - Decorative', 'Decorative segmental retaining wall block (Belgard, Pavestone)', 'sqft', 42.00, 30, 'Multiple color and texture options'),
('Retaining Walls', 'Natural Stone Wall', 'Dry-stacked or mortared natural stone retaining wall', 'sqft', 55.00, 20, 'Arizona sandstone or limestone'),
('Retaining Walls', 'Natural Stone Wall - Premium', 'Premium natural stone wall with tight joints', 'sqft', 72.00, 20, 'Select stone, meticulous craftsmanship'),
('Retaining Walls', 'Boulder Wall', 'Stacked boulder retaining wall', 'lnft', 55.00, 15, 'Per linear foot, up to 3ft tall'),
('Retaining Walls', 'Boulder Wall - Large', 'Large boulder retaining wall, 3-5ft', 'lnft', 85.00, 15, 'Equipment-placed boulders'),
('Retaining Walls', 'Gabion Wall', 'Wire gabion basket wall filled with stone', 'sqft', 45.00, 20, 'Modern industrial aesthetic'),
('Retaining Walls', 'Wall Cap - Flat', 'Flat stone or concrete cap for retaining wall', 'lnft', 18.00, 15, 'Finished top edge'),
('Retaining Walls', 'Wall Cap - Bullnose', 'Bullnose or tumbled cap stone for seat walls', 'lnft', 24.00, 15, 'Comfortable sitting surface'),
('Retaining Walls', 'Wall Drain - French', 'French drain behind retaining wall', 'lnft', 22.00, 20, 'Critical for wall longevity'),
('Retaining Walls', 'Geogrid Reinforcement', 'Geogrid reinforcement layers for tall walls', 'sqft', 4.00, 50, 'Required for walls over 4ft'),
('Retaining Walls', 'Wall Footing - Concrete', 'Poured concrete footing for retaining wall', 'lnft', 35.00, 15, 'Reinforced with rebar'),
('Retaining Walls', 'Stucco Finish - Wall', 'Stucco finish coat on block retaining wall', 'sqft', 12.00, 30, 'Color-matched to property'),
('Retaining Walls', 'Engineering - Wall Design', 'Structural engineering for retaining walls over 4ft', 'each', 1500.00, 1, 'Required by Maricopa County');

-- ============================================================
-- SITE PREP (18 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Site Prep', 'Demolition - Concrete', 'Concrete demolition and removal', 'sqft', 4.50, 50, 'Up to 4" thick standard concrete'),
('Site Prep', 'Demolition - Concrete Thick', 'Thick concrete or reinforced demolition', 'sqft', 7.00, 50, '4"+ thick or heavily reinforced'),
('Site Prep', 'Demolition - Pavers', 'Paver or stone removal and disposal', 'sqft', 3.00, 50, 'Careful removal, substrate may be reusable'),
('Site Prep', 'Demolition - Landscape', 'Existing landscape removal (plants, rock, features)', 'sqft', 3.50, 100, 'Includes plant disposal'),
('Site Prep', 'Demolition - Structure', 'Structure demolition (old pergola, wall, etc.)', 'each', 1500.00, 1, 'Price varies significantly by size'),
('Site Prep', 'Grading - Standard', 'Rough grading and leveling for flatwork', 'sqft', 2.50, 100, 'Machine grading to elevation'),
('Site Prep', 'Grading - Fine', 'Fine grading and compaction for paver base', 'sqft', 3.50, 100, 'Laser-level precision'),
('Site Prep', 'Grading - Drainage', 'Drainage grading to direct water flow', 'sqft', 4.00, 100, 'Critical for monsoon management'),
('Site Prep', 'Excavation - Standard', 'Standard excavation, 6-12" depth', 'sqft', 5.00, 50, 'Soft to medium soil'),
('Site Prep', 'Excavation - Deep', 'Deep excavation for footings, pools, etc.', 'sqft', 8.00, 30, 'Below 12" depth'),
('Site Prep', 'Excavation - Caliche', 'Caliche layer removal (hardpan calcium carbonate)', 'sqft', 12.00, 20, 'Common in Phoenix, requires breaker'),
('Site Prep', 'Haul-Off - Standard', 'Debris haul-off, standard dump trailer load', 'load', 450.00, 1, 'Approx 5 cubic yards per load'),
('Site Prep', 'Haul-Off - Heavy', 'Heavy material haul-off (concrete, caliche)', 'load', 650.00, 1, 'Weight surcharges may apply'),
('Site Prep', 'Haul-Off - Green Waste', 'Green waste and plant material disposal', 'load', 350.00, 1, 'Recycling facility disposal'),
('Site Prep', 'Compaction - Sub-base', 'Mechanical compaction of sub-base material', 'sqft', 1.50, 100, 'Plate compactor or roller'),
('Site Prep', 'Aggregate Base - Class II', 'Class II road base aggregate, 4" depth', 'sqft', 3.00, 100, 'Standard base for pavers and turf'),
('Site Prep', 'Sand Bedding Layer', 'Leveling sand layer for paver installation', 'sqft', 1.50, 100, '1" ASTM C33 concrete sand'),
('Site Prep', 'Dust Control', 'Dust control during construction', 'each', 300.00, 1, 'Water truck or polymer application');

-- ============================================================
-- MISCELLANEOUS (14 items)
-- ============================================================
INSERT INTO gs_pricing_items (category, name, description, unit, unit_price, min_quantity, notes) VALUES
('Miscellaneous', 'Design Fee - Standard', 'Landscape design, 2D plan with plant schedule', 'lump', 750.00, 1, 'Credited toward project if contract signed'),
('Miscellaneous', 'Design Fee - Premium', 'Full design package with 3D renderings', 'lump', 1500.00, 1, 'Includes 2 revision rounds'),
('Miscellaneous', 'Design Fee - Complex', 'Complex multi-phase design with engineering', 'lump', 2500.00, 1, 'Large properties or intricate designs'),
('Miscellaneous', 'Permit Fee - Standard', 'Standard building permit for structures', 'each', 750.00, 1, 'Pergolas, walls under 4ft, fences'),
('Miscellaneous', 'Permit Fee - Structural', 'Structural permit with engineering review', 'each', 1500.00, 1, 'Walls over 4ft, outdoor kitchens'),
('Miscellaneous', 'Permit Fee - Electrical', 'Electrical permit for lighting or kitchen circuits', 'each', 500.00, 1, 'Required for hardwired installations'),
('Miscellaneous', 'HOA Submission', 'HOA architectural review submission and follow-up', 'each', 350.00, 1, 'Includes plans, material samples, forms'),
('Miscellaneous', 'HOA Submission - Complex', 'Complex HOA submission with renderings', 'each', 650.00, 1, 'For strict HOAs or large projects'),
('Miscellaneous', 'Project Management', 'Dedicated project management for large projects', 'lump', 2000.00, 1, 'Projects over $40K'),
('Miscellaneous', 'Temporary Fencing', 'Temporary construction fencing', 'lnft', 5.00, 50, 'Safety requirement for open excavations'),
('Miscellaneous', 'Site Protection', 'Protection of existing landscape and structures during construction', 'lump', 500.00, 1, 'Tarps, barriers, plywood protection'),
('Miscellaneous', 'Final Cleanup', 'Post-construction detailed cleanup', 'lump', 400.00, 1, 'Power wash, debris removal, touch-ups'),
('Miscellaneous', 'Warranty Extension', '5-year extended warranty on workmanship', 'lump', 800.00, 1, 'Beyond standard 2-year coverage'),
('Miscellaneous', 'Maintenance Program Setup', 'Setup for ongoing maintenance program', 'lump', 350.00, 1, 'Quarterly maintenance visits');
