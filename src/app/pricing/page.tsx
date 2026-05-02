'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import { formatCurrency, formatUnit } from '@/lib/format';
import { PRICING_CATEGORIES } from '@/lib/constants';
import type { PricingItem } from '@/types';

export default function PricingPage() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function fetchPricing() {
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedCategory) params.set('category', selectedCategory);

        const res = await fetch(`/api/pricing?${params}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
        }
      } catch (err) {
        console.error('Failed to fetch pricing:', err);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchPricing, 300);
    return () => clearTimeout(debounce);
  }, [search, selectedCategory]);

  // Group by category
  const grouped: Record<string, PricingItem[]> = {};
  items.forEach((item) => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Pricing Database</h1>
        <p className="text-sm text-slate-400 mt-1">{items.length} active items across {Object.keys(grouped).length} categories</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            All
          </button>
          {PRICING_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                cat === selectedCategory
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-48 rounded-xl animate-shimmer" />
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400">No pricing items found</p>
          <p className="text-slate-500 text-xs mt-1">
            {search ? 'Try a different search term' : 'Connect Supabase and run the seed data to populate pricing'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([category, categoryItems]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-lg font-semibold text-slate-200">{category}</h2>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{categoryItems.length} items</span>
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-2.5 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-700/50">
                  <div className="col-span-3">Item</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-1">Unit</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Min Qty</div>
                </div>

                <div className="divide-y divide-slate-700/30">
                  {categoryItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3 hover:bg-slate-800/30 transition-colors items-center">
                      <div className="sm:col-span-3">
                        <p className="text-sm font-medium text-slate-200">{item.name}</p>
                      </div>
                      <div className="sm:col-span-4">
                        <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                      </div>
                      <div className="sm:col-span-1">
                        <span className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{formatUnit(item.unit)}</span>
                      </div>
                      <div className="sm:col-span-2 text-right">
                        <p className="text-sm font-semibold text-emerald-400">{formatCurrency(item.unit_price)}</p>
                      </div>
                      <div className="sm:col-span-2 text-right">
                        <p className="text-xs text-slate-500">{item.min_quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
