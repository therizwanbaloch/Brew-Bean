import React from 'react';
import { 
  Coffee, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Award, 
  Truck, 
  Leaf, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const stats = [
    { label: 'Batches Roasted Daily', value: '50+' },
    { label: 'Ethical Farm Partners', value: '12' },
    { label: 'Happy Coffee Lovers', value: '15k+' },
    { label: 'Satisfaction Rate', value: '99.4%' },
  ];

  const milestones = [
    {
      year: '2023',
      title: 'The Seed Idea',
      description: 'Started in a small home roastery with a single goal: deliver fresh, specialty-grade coffee directly to homes.'
    },
    {
      year: '2024',
      title: 'Direct Trade Partnerships',
      description: 'Partnered with sustainable, single-origin coffee farms to cut out middlemen and guarantee fair pay to growers.'
    },
    {
      year: '2025',
      title: 'Micro-Roastery Expansion',
      description: 'Scaled up to state-of-the-art precision roasters, locking in maximum aroma and profile consistency.'
    },
    {
      year: '2026',
      title: 'National Craft Community',
      description: 'Serving thousands of daily brewers across the country with fresh, roasted-on-demand coffee beans.'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Page Header Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Our Heritage & Craft
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            About Our Roastery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We are dedicated to the art of exceptional coffee. From high-altitude farms to small-batch roasting, every step is designed to bring out peak flavor in every mug.
          </p>
        </div>

        {/* Brand Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {stats.map((item, idx) => (
            <div key={idx} className="text-center space-y-1 p-2">
              <p className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">{item.value}</p>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Core Story Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Why We Started
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Great mornings start with genuine coffee. We noticed that store-bought coffee had lost its magic — sitting on shelves for months, losing subtle aromas, and tasting flat.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We built our brand to bridge the gap between coffee growers and coffee drinkers. By controlling the roast quality and roasting in precise batches, we ensure every bag shipped is at its peak flavor profile.
            </p>
          </div>

          <div className="space-y-3 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Our Promise</p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                100% Specialty Grade Arabica Beans
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Freshly Roasted in Small Batches
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Zero Artificial Additives or Preservatives
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Direct Fair-Trade Sourcing
              </li>
            </ul>
          </div>
        </div>

        {/* Values Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Our Core Values</h2>
            <p className="text-xs text-slate-500">The standards we live and roast by every day.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit border border-emerald-100">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Sustainable Farming</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We work exclusively with farms that practice environmentally friendly cultivation and fair labor standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit border border-amber-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Master Crafters</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every origin has a unique roast profile. We meticulously calibrate time and temperature for peak aroma.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit border border-indigo-100">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Peak Freshness</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Orders are packed and dispatched quickly so your beans arrive when flavor notes are at their finest.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Our Journey So Far</h2>
            <p className="text-xs text-slate-500">Key milestones in building our roastery.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                <span className="text-xs font-bold text-amber-600 font-mono bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                  {m.year}
                </span>
                <h4 className="font-bold text-xs text-slate-900 pt-1">{m.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Simple Call to Action Footer Card */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border border-slate-800">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold tracking-tight">Taste the difference for yourself</h3>
            <p className="text-xs text-slate-400">Discover our collection of single-origin and signature coffee blends.</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-xs whitespace-nowrap"
          >
            Explore Catalog
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}