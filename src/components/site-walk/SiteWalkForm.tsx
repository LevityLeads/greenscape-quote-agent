'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { PROJECT_TYPES, type SiteWalkFormData } from '@/types';
import type { AIGenerationResult } from '@/types';
import { formatCurrency } from '@/lib/format';
import { AI_MODEL_DISPLAY } from '@/lib/constants';

interface SiteWalkFormProps {
  onComplete: (proposalId: string, result: AIGenerationResult & { proposalId?: string; proposalNumber?: string; subtotal: number; taxRate: number; taxAmount: number; total: number; generationTimeSeconds: number }) => void;
}

const STEPS = ['Client Info', 'Site Walk Notes', 'Generate', 'Review'];

export default function SiteWalkForm({ onComplete }: SiteWalkFormProps) {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<(AIGenerationResult & { proposalId?: string; proposalNumber?: string; subtotal: number; taxRate: number; taxAmount: number; total: number; generationTimeSeconds: number }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const [form, setForm] = useState<SiteWalkFormData>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientCity: 'Phoenix',
    clientState: 'AZ',
    clientZip: '',
    hoaRequired: false,
    hoaName: '',
    walkDate: new Date().toISOString().split('T')[0],
    projectTypes: [],
    scopeNotes: '',
    siteConditions: '',
    measurements: '',
    budgetDiscussed: '',
    timelineExpectation: '',
    renderNeeded: false,
    rawNotes: '',
  });

  const updateForm = useCallback((updates: Partial<SiteWalkFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleProjectType = useCallback((type: string) => {
    setForm((prev) => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter((t) => t !== type)
        : [...prev.projectTypes, type],
    }));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || errData.error || 'Generation failed');
      }

      const result = await res.json();
      setGenerationResult(result);
      setStep(3);
      addToast('Proposal generated successfully', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      addToast(`Generation failed: ${message}`, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return form.clientName.trim().length > 0;
    if (step === 1) return form.scopeNotes.trim().length > 10 && form.projectTypes.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      // Auto-start generation
      setTimeout(handleGenerate, 500);
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 ${
                i < step ? 'bg-emerald-600 text-white' :
                i === step ? 'bg-emerald-600 text-white ring-4 ring-emerald-600/20' :
                'bg-slate-700 text-slate-400'
              }`}>
                {i < step ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 transition-colors duration-300 ${
                  i < step ? 'bg-emerald-600' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {STEPS.map((label, i) => (
            <span key={label} className={`text-xs font-medium ${i === step ? 'text-emerald-400' : 'text-slate-500'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-1">Client Information</h2>
                <p className="text-sm text-slate-400">Enter the client details for this proposal.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Client Name *"
                    value={form.clientName}
                    onChange={(e) => updateForm({ clientName: e.target.value })}
                    placeholder="John & Sarah Martinez"
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => updateForm({ clientEmail: e.target.value })}
                  placeholder="john@email.com"
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={form.clientPhone}
                  onChange={(e) => updateForm({ clientPhone: e.target.value })}
                  placeholder="(480) 555-0123"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Property Address"
                    value={form.clientAddress}
                    onChange={(e) => updateForm({ clientAddress: e.target.value })}
                    placeholder="4521 E Desert Cove Ave"
                  />
                </div>
                <Input
                  label="City"
                  value={form.clientCity}
                  onChange={(e) => updateForm({ clientCity: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="State"
                    value={form.clientState}
                    onChange={(e) => updateForm({ clientState: e.target.value })}
                  />
                  <Input
                    label="ZIP"
                    value={form.clientZip}
                    onChange={(e) => updateForm({ clientZip: e.target.value })}
                    placeholder="85028"
                  />
                </div>
              </div>

              {/* HOA Section */}
              <div className="border border-slate-700 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hoaRequired}
                    onChange={(e) => updateForm({ hoaRequired: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-200">HOA Approval Required</span>
                    <p className="text-xs text-slate-500">This property is in an HOA-governed community</p>
                  </div>
                </label>
                {form.hoaRequired && (
                  <div className="mt-3 ml-7">
                    <Input
                      label="HOA Name"
                      value={form.hoaName}
                      onChange={(e) => updateForm({ hoaName: e.target.value })}
                      placeholder="Desert Ridge Community Association"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-1">Site Walk Notes</h2>
                <p className="text-sm text-slate-400">Describe what the client wants. Be as detailed or brief as you like: the AI fills in the gaps.</p>
              </div>

              {/* Project Types */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Project Types *</label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleProjectType(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        form.projectTypes.includes(type)
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/30'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300 border border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scope Notes */}
              <Textarea
                label="Scope Notes *"
                value={form.scopeNotes}
                onChange={(e) => updateForm({ scopeNotes: e.target.value })}
                placeholder={"Example: Big backyard, roughly 600sqft patio area. They want travertine pavers, not concrete. Fire pit in the corner, gas line already stubbed out. Some string lights over the patio. New drip irrigation for the planting beds along the back wall. Maybe a small water feature near the entrance. Budget around 35K, wants it done before Thanksgiving."}
                rows={6}
              />

              {/* Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Site Conditions"
                  value={form.siteConditions}
                  onChange={(e) => updateForm({ siteConditions: e.target.value })}
                  placeholder="Flat lot, existing concrete patio to demo, some caliche..."
                  rows={3}
                />
                <Textarea
                  label="Measurements"
                  value={form.measurements}
                  onChange={(e) => updateForm({ measurements: e.target.value })}
                  placeholder="Patio area: ~600sqft, back wall: 45ft, side yard: 12ft wide..."
                  rows={3}
                />
                <Input
                  label="Budget Discussed"
                  value={form.budgetDiscussed}
                  onChange={(e) => updateForm({ budgetDiscussed: e.target.value })}
                  placeholder="$30-40K range"
                />
                <Input
                  label="Timeline Expectation"
                  value={form.timelineExpectation}
                  onChange={(e) => updateForm({ timelineExpectation: e.target.value })}
                  placeholder="Before Thanksgiving, ASAP, flexible..."
                />
              </div>

              <div className="border border-slate-700 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.renderNeeded}
                    onChange={(e) => updateForm({ renderNeeded: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-200">3D Render Needed</span>
                    <p className="text-xs text-slate-500">Client requested or project warrants a visual rendering</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              {generating ? (
                <>
                  {/* Animated Generation State */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center animate-pulse-glow">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 animate-spin" style={{ animationDuration: '3s' }}>
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-slate-100">Generating Your Proposal</h3>
                    <p className="text-sm text-slate-400 max-w-md">
                      The AI is interpreting your site walk notes, matching pricing items, and building a detailed proposal. This typically takes 10-30 seconds.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Using {AI_MODEL_DISPLAY}
                  </div>
                </>
              ) : error ? (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-red-900/20 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-red-400">Generation Failed</h3>
                    <p className="text-sm text-slate-400 max-w-md">{error}</p>
                  </div>
                  <Button onClick={handleGenerate}>Try Again</Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-emerald-900/20 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-slate-300">Ready to generate. Click below to start.</p>
                  <Button onClick={handleGenerate} size="lg">Generate Proposal</Button>
                </>
              )}
            </div>
          )}

          {step === 3 && generationResult && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 mb-1">Review Proposal</h2>
                  <p className="text-sm text-slate-400">
                    {generationResult.proposalNumber && `#${generationResult.proposalNumber} | `}
                    Generated in {generationResult.generationTimeSeconds}s | AI cost: ~${(generationResult.estimatedCostCents / 100).toFixed(2)}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    if (generationResult.proposalId) {
                      onComplete(generationResult.proposalId, generationResult);
                    }
                  }}
                >
                  View Full Proposal
                </Button>
              </div>

              {/* Project Summary */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">{generationResult.projectTitle}</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{generationResult.projectDescription}</p>
              </div>

              {/* Line Items Preview */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-700/50">
                  <h3 className="text-sm font-semibold text-slate-200">Line Items ({generationResult.lineItems.length})</h3>
                </div>
                <div className="divide-y divide-slate-700/30">
                  {generationResult.lineItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-800/30">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">{item.category}</span>
                          <span className="text-sm font-medium text-slate-200 truncate">{item.name}</span>
                          {item.confidence < 0.7 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400" title="Low confidence: Marcus should verify">
                              Verify
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.quantity} {item.unit} @ {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <span className="text-sm font-medium text-slate-200 ml-4">{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-600 px-5 py-4 space-y-2">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Subtotal</span>
                    <span>{formatCurrency(generationResult.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Tax ({(generationResult.taxRate * 100).toFixed(2)}%)</span>
                    <span>{formatCurrency(generationResult.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-emerald-400 pt-2 border-t border-slate-700">
                    <span>Total</span>
                    <span>{formatCurrency(generationResult.total)}</span>
                  </div>
                </div>
              </div>

              {/* AI Notes */}
              {generationResult.aiNotes && (
                <div className="bg-amber-900/10 border border-amber-800/30 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    AI Notes for Review
                  </h3>
                  <p className="text-sm text-slate-300 whitespace-pre-line">{generationResult.aiNotes}</p>
                </div>
              )}

              {/* Suggested Upsells */}
              {generationResult.suggestedUpsells && generationResult.suggestedUpsells.length > 0 && (
                <div className="bg-blue-900/10 border border-blue-800/30 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">Suggested Upsells</h3>
                  <ul className="space-y-1">
                    {generationResult.suggestedUpsells.map((upsell, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-blue-400 mt-0.5">+</span>
                        {upsell}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {step < 2 && (
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === 1 ? 'Generate Proposal' : 'Next'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Button>
        </div>
      )}
    </div>
  );
}
