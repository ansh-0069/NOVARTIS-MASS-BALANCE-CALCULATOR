import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  Download, CheckCircle, AlertTriangle, XCircle, TrendingUp,
  Activity, BarChart3, Shield, FileText, Share2, Zap, Target
} from 'lucide-react';
import jsPDF from 'jspdf';

// Custom Chart Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl">
      <p className="text-white font-semibold mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-300">{entry.value.toFixed(2)}%</span>
        </div>
      ))}
    </div>
  );
};

function Results({ results }) {
  const [activeView, setActiveView] = useState('overview');
  const [exportFormat, setExportFormat] = useState('pdf');

  const { results: mb_results, correction_factors, recommended_method, recommended_value,
    status, diagnostic_message, rationale, confidence_index, degradation_level } = results;

  // Prepare chart data
  const chartData = [
    { method: 'SMB', value: mb_results.smb, fill: '#64748b' },
    { method: 'AMB', value: mb_results.amb, fill: '#3b82f6' },
    { method: 'RMB', value: mb_results.rmb || 0, fill: mb_results.rmb ? '#8b5cf6' : '#475569' },
    { method: 'LK-IMB', value: mb_results.lk_imb, fill: '#10b981', ci: [mb_results.lk_imb_lower_ci, mb_results.lk_imb_upper_ci] },
    { method: 'CIMB', value: mb_results.cimb, fill: '#06b6d4', ci: [mb_results.cimb_lower_ci, mb_results.cimb_upper_ci] }
  ];

  // Radar chart for method comparison
  const radarData = [
    { metric: 'Accuracy', SMB: 70, AMB: 80, 'LK-IMB': 90, CIMB: 95 },
    { metric: 'Precision', SMB: 65, AMB: 75, 'LK-IMB': 88, CIMB: 92 },
    { metric: 'Complexity', SMB: 95, AMB: 85, 'LK-IMB': 60, CIMB: 50 },
    { metric: 'Regulatory', SMB: 60, AMB: 70, 'LK-IMB': 85, CIMB: 95 },
    { metric: 'Reliability', SMB: 70, AMB: 78, 'LK-IMB': 87, CIMB: 93 }
  ];

  const getStatusConfig = (value) => {
    if (value >= 98 && value <= 102) {
      return {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        label: 'EXCELLENT',
        gradient: 'from-green-500/20 to-green-500/5'
      };
    } else if ((value >= 95 && value < 98) || (value > 102 && value <= 105)) {
      return {
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        label: 'ACCEPTABLE',
        gradient: 'from-yellow-500/20 to-yellow-500/5'
      };
    } else {
      return {
        icon: XCircle,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        label: 'CRITICAL',
        gradient: 'from-red-500/20 to-red-500/5'
      };
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    // ... (keep your existing PDF generation code)
    const filename = `Mass_Balance_Report_${new Date().toISOString().slice(0, 10)}_${recommended_method}.pdf`;
    doc.save(filename);
  };

  const exportToCSV = () => {
    const csvData = [
      ['Method', 'Value (%)', 'Lower CI', 'Upper CI', 'Risk Level'],
      ['SMB', mb_results.smb, '-', '-', '-'],
      ['AMB', mb_results.amb, '-', '-', '-'],
      ['RMB', mb_results.rmb || 'N/A', '-', '-', '-'],
      ['LK-IMB', mb_results.lk_imb, mb_results.lk_imb_lower_ci, mb_results.lk_imb_upper_ci, mb_results.lk_imb_risk_level],
      ['CIMB', mb_results.cimb, mb_results.cimb_lower_ci, mb_results.cimb_upper_ci, mb_results.cimb_risk_level],
      [],
      ['Correction Factors'],
      ['Lambda', correction_factors.lambda],
      ['Omega', correction_factors.omega],
      ['Stoichiometric', correction_factors.stoichiometric_factor],
      [],
      ['Recommendation'],
      ['Method', recommended_method],
      ['Value', recommended_value],
      ['Status', status]
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mass_balance_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      downloadPDF();
    } else {
      exportToCSV();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Executive Summary Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-8"
      >
        <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${getStatusConfig(recommended_value).gradient} blur-3xl`} />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 ${getStatusConfig(recommended_value).bg} rounded-lg border ${getStatusConfig(recommended_value).border}`}>
                  {(() => {
                    const Icon = getStatusConfig(recommended_value).icon;
                    return <Icon className={getStatusConfig(recommended_value).color} size={24} />;
                  })()}
                </div>
                <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
              </div>
              <p className="text-slate-400 text-sm">
                Statistical validation with 95% confidence intervals
              </p>
            </div>

            {/* Export Controls */}
            <div className="flex items-center gap-3">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="pdf">PDF Report</option>
                <option value="csv">CSV Data</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/25"
              >
                <Download size={18} />
                Export
              </motion.button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-blue-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider">Recommended</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{recommended_method}</div>
              <div className="text-sm text-slate-400">Method</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={16} className="text-violet-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider">Final Result</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{recommended_value}%</div>
              <div className={`text-sm ${getStatusConfig(recommended_value).color} font-semibold`}>
                {getStatusConfig(recommended_value).label}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-green-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider">Confidence</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{confidence_index}%</div>
              <div className="text-sm text-slate-400">Statistical</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-orange-400" />
                <span className="text-xs text-slate-400 uppercase tracking-wider">Degradation</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{degradation_level}%</div>
              <div className="text-sm text-slate-400">Level</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Method Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(mb_results).filter(([key]) =>
          ['smb', 'amb', 'rmb', 'lk_imb', 'cimb'].includes(key)
        ).map(([key, value], index) => {
          const isRecommended = key === recommended_method.toLowerCase().replace('-', '_');
          const config = getStatusConfig(value || 0);

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-xl border backdrop-blur-sm ${
                isRecommended
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-slate-800/50 bg-slate-900/50'
              }`}
            >
              {isRecommended && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-violet-500" />
              )}
              
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300">
                    {key.toUpperCase().replace('_', '-')}
                  </h3>
                  {isRecommended && (
                    <div className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30">
                      SELECTED
                    </div>
                  )}
                </div>
                
                <div className={`text-3xl font-bold mb-2 ${
                  value === null ? 'text-slate-600' : config.color
                }`}>
                  {value === null ? 'N/A' : `${value}%`}
                </div>

                {/* Confidence Interval Bar for LK-IMB and CIMB */}
                {(key === 'lk_imb' || key === 'cimb') && value !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{key === 'lk_imb' ? mb_results.lk_imb_lower_ci : mb_results.cimb_lower_ci}%</span>
                      <span>{key === 'lk_imb' ? mb_results.lk_imb_upper_ci : mb_results.cimb_upper_ci}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${key === 'lk_imb' ? 'bg-green-500' : 'bg-cyan-500'}`}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 mt-1 text-center">95% CI</div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Statistical Analysis Sections */}
      {mb_results.lk_imb && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-900/20 to-slate-900/50 backdrop-blur-xl p-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-transparent blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <Activity className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">LK-IMB Statistical Analysis</h3>
                <p className="text-sm text-slate-400">Lukulay-Körner Integrated Mass Balance with 95% CI</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-5 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
                <div className="text-sm text-slate-400 mb-2">Lower CI (95%)</div>
                <div className="text-2xl font-bold text-green-400">{mb_results.lk_imb_lower_ci}%</div>
              </div>
              <div className="p-5 bg-green-500/10 rounded-xl border border-green-500/30 text-center ring-2 ring-green-500/20">
                <div className="text-sm text-slate-400 mb-2">Point Estimate</div>
                <div className="text-3xl font-bold text-green-400">{mb_results.lk_imb}%</div>
              </div>
              <div className="p-5 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
                <div className="text-sm text-slate-400 mb-2">Upper CI (95%)</div>
                <div className="text-2xl font-bold text-green-400">{mb_results.lk_imb_upper_ci}%</div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Risk Assessment:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  mb_results.lk_imb_risk_level === 'LOW' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  mb_results.lk_imb_risk_level === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {mb_results.lk_imb_risk_level}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {mb_results.cimb && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-900/20 to-slate-900/50 backdrop-blur-xl p-8"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Zap className="text-cyan-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">CIMB Statistical Analysis</h3>
                <p className="text-sm text-slate-400">Corrected Integrated Mass Balance with Pathway Factors</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-5 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
                <div className="text-sm text-slate-400 mb-2">Lower CI (95%)</div>
                <div className="text-2xl font-bold text-cyan-400">{mb_results.cimb_lower_ci}%</div>
              </div>
              <div className="p-5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-center ring-2 ring-cyan-500/20">
                <div className="text-sm text-slate-400 mb-2">Point Estimate</div>
                <div className="text-3xl font-bold text-cyan-400">{mb_results.cimb}%</div>
              </div>
              <div className="p-5 bg-slate-800/30 rounded-xl border border-slate-700/50 text-center">
                <div className="text-sm text-slate-400 mb-2">Upper CI (95%)</div>
                <div className="text-2xl font-bold text-cyan-400">{mb_results.cimb_upper_ci}%</div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Risk Assessment:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  mb_results.cimb_risk_level === 'LOW' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  mb_results.cimb_risk_level === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {mb_results.cimb_risk_level}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Interactive Visualizations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-8"
      >
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="text-blue-400" size={20} />
          Method Comparison Analysis
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart with CI */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-4">Mass Balance Results</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis 
                  dataKey="method" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  domain={[80, 110]}
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  label={{ value: 'Mass Balance (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={95} 
                  stroke="#10b981" 
                  strokeDasharray="3 3" 
                  strokeWidth={2}
                  label={{ value: "95%", position: "right", fill: "#10b981" }}
                />
                <ReferenceLine 
                  y={105} 
                  stroke="#10b981" 
                  strokeDasharray="3 3" 
                  strokeWidth={2}
                  label={{ value: "105%", position: "right", fill: "#10b981" }}
                />
                <Bar dataKey="value" fill="url(#colorValue)" radius={[8, 8, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-4">Performance Profile</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis stroke="#334155" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="LK-IMB" dataKey="LK-IMB" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="CIMB" dataKey="CIMB" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Correction Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-8"
      >
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="text-violet-400" size={20} />
          Correction Factors Applied
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Lambda (λ)', value: correction_factors.lambda, desc: 'RRF Correction', color: 'blue' },
            { label: 'Omega (ω)', value: correction_factors.omega, desc: 'MW Correction', color: 'violet' },
            { label: 'Stoichiometric (S)', value: correction_factors.stoichiometric_factor, desc: 'Pathway Factor', color: 'cyan' }
          ].map((factor, index) => (
            <motion.div
              key={factor.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 bg-${factor.color}-500/5 rounded-xl border border-${factor.color}-500/20 text-center`}
            >
              <div className={`text-sm text-${factor.color}-400 mb-2`}>{factor.label}</div>
              <div className={`text-3xl font-bold text-${factor.color}-400 mb-1`}>{factor.value}</div>
              <div className="text-xs text-slate-500">{factor.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Diagnostic Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-xl p-8"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="text-orange-400" size={20} />
          Diagnostic Assessment
        </h3>
        
        <div className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 mb-4">
          <p className="text-slate-300 leading-relaxed">{diagnostic_message}</p>
        </div>

        <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">Scientific Rationale</h4>
          <p className="text-slate-300 text-sm leading-relaxed">{rationale}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="text-slate-500 mb-1">Degradation</div>
            <div className="text-white font-semibold">{degradation_level}%</div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="text-slate-500 mb-1">Lambda</div>
            <div className="text-white font-semibold">{correction_factors.lambda}</div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="text-slate-500 mb-1">Omega</div>
            <div className="text-white font-semibold">{correction_factors.omega}</div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <div className="text-slate-500 mb-1">Stoichiometric</div>
            <div className="text-white font-semibold">{correction_factors.stoichiometric_factor}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Results;
