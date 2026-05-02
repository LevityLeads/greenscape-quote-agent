'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { formatCurrency, formatUnit } from '@/lib/format';
import type { ProposalLineItem } from '@/types';

interface LineItemEditorProps {
  items: ProposalLineItem[];
  onSave: (items: ProposalLineItem[]) => void;
  saving?: boolean;
}

export default function LineItemEditor({ items, onSave, saving }: LineItemEditorProps) {
  const [editableItems, setEditableItems] = useState<ProposalLineItem[]>(items);
  const [hasChanges, setHasChanges] = useState(false);

  const updateItem = (index: number, field: keyof ProposalLineItem, value: string | number) => {
    setEditableItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value, manually_adjusted: true };
      // Recalculate line total
      if (field === 'quantity' || field === 'unit_price') {
        item.line_total = Math.round(Number(item.quantity) * Number(item.unit_price) * 100) / 100;
      }
      updated[index] = item;
      return updated;
    });
    setHasChanges(true);
  };

  const removeItem = (index: number) => {
    setEditableItems((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const addItem = () => {
    const newItem: ProposalLineItem = {
      id: `new-${Date.now()}`,
      proposal_id: items[0]?.proposal_id || '',
      pricing_item_id: null,
      category: 'Miscellaneous',
      name: 'New Item',
      description: '',
      unit: 'each',
      quantity: 1,
      unit_price: 0,
      line_total: 0,
      sort_order: editableItems.length,
      ai_suggested: false,
      manually_adjusted: true,
      created_at: new Date().toISOString(),
    };
    setEditableItems((prev) => [...prev, newItem]);
    setHasChanges(true);
  };

  // Group by category
  const grouped: Record<string, { items: ProposalLineItem[]; indexes: number[] }> = {};
  editableItems.forEach((item, index) => {
    if (!grouped[item.category]) {
      grouped[item.category] = { items: [], indexes: [] };
    }
    grouped[item.category].items.push(item);
    grouped[item.category].indexes.push(index);
  });

  const subtotal = editableItems.reduce((sum, item) => sum + item.line_total, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Line Items ({editableItems.length})
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={addItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Item
          </Button>
          {hasChanges && (
            <Button size="sm" onClick={() => onSave(editableItems)} loading={saving}>
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Grouped Items */}
      <div className="space-y-6">
        {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([category, { items: catItems, indexes }]) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">{category}</span>
              <span className="text-xs text-slate-600">
                {formatCurrency(catItems.reduce((s, i) => s + i.line_total, 0))}
              </span>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden divide-y divide-slate-700/30">
              <AnimatePresence>
                {catItems.map((item, catIdx) => {
                  const globalIdx = indexes[catIdx];
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3"
                    >
                      <div className="grid grid-cols-12 gap-2 items-center">
                        {/* Name */}
                        <div className="col-span-12 sm:col-span-4">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(globalIdx, 'name', e.target.value)}
                            className="w-full bg-transparent text-sm text-slate-200 font-medium focus:outline-none focus:bg-slate-800 px-1 py-0.5 rounded"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(globalIdx, 'description', e.target.value)}
                            className="w-full bg-transparent text-xs text-slate-500 focus:outline-none focus:bg-slate-800 px-1 py-0.5 rounded mt-0.5"
                            placeholder="Description..."
                          />
                        </div>

                        {/* Quantity */}
                        <div className="col-span-3 sm:col-span-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(globalIdx, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 text-right"
                            step="0.01"
                            min="0"
                          />
                          <span className="text-[10px] text-slate-600 px-1">{formatUnit(item.unit)}</span>
                        </div>

                        {/* Unit Price */}
                        <div className="col-span-3 sm:col-span-2">
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => updateItem(globalIdx, 'unit_price', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 text-right"
                            step="0.01"
                            min="0"
                          />
                          <span className="text-[10px] text-slate-600 px-1">per {formatUnit(item.unit)}</span>
                        </div>

                        {/* Line Total */}
                        <div className="col-span-4 sm:col-span-3 text-right">
                          <span className="text-sm font-medium text-slate-200">{formatCurrency(item.line_total)}</span>
                          {item.manually_adjusted && (
                            <span className="block text-[10px] text-amber-500">edited</span>
                          )}
                        </div>

                        {/* Delete */}
                        <div className="col-span-2 sm:col-span-1 text-right">
                          <button
                            onClick={() => removeItem(globalIdx)}
                            className="p-1 rounded hover:bg-red-900/30 text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="flex justify-end">
        <div className="text-right space-y-1">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Subtotal</span>
            <span className="text-lg font-semibold text-slate-200">{formatCurrency(subtotal)}</span>
          </div>
          {hasChanges && (
            <p className="text-xs text-amber-400">Unsaved changes</p>
          )}
        </div>
      </div>
    </div>
  );
}
