import React, { useState } from 'react';
import {
  X,
  Server,
  Layers,
  Database,
  Cpu,
  Activity,
  FileCode,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Search,
  CheckCircle2,
  ListFilter,
  RefreshCw,
  Terminal,
  FolderTree
} from 'lucide-react';
import { featureFlags, FeatureFlagsConfig } from '../services/featureFlags';
import { aiOrchestrator, AIProvider } from '../services/aiOrchestrator';
import { auditEngine } from '../services/auditEngine';
import { queueEngine } from '../services/queueEngine';

interface DeveloperConsoleModalProps {
  onClose: () => void;
}

export const DeveloperConsoleModal: React.FC<DeveloperConsoleModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'flags' | 'ai' | 'api' | 'audit' | 'monitoring'>('architecture');
  const [flags, setFlags] = useState<FeatureFlagsConfig>(featureFlags.getFlags());
  const [currentProvider, setCurrentProvider] = useState<AIProvider>(aiOrchestrator.getProvider());
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [selectedApiEndpoint, setSelectedApiEndpoint] = useState<string>('/api/v1/health');

  const handleToggleFlag = (key: keyof FeatureFlagsConfig) => {
    const updated = featureFlags.toggleFlag(key);
    setFlags({ ...flags, [key]: updated });
  };

  const handleProviderChange = (provider: AIProvider) => {
    aiOrchestrator.setProvider(provider);
    setCurrentProvider(provider);
  };

  const handleTestApi = async (endpoint: string) => {
    setSelectedApiEndpoint(endpoint);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    }
  };

  const dbTables = [
    'users (USR-000001)', 'organizations (ORG-000001)', 'projects (PRJ-000001)',
    'departments', 'templates (TPL-000001)', 'documents (DOC-000001)',
    'document_versions', 'fields', 'dictionaries', 'terminology',
    'formulas', 'standards', 'references', 'processes',
    'procedures', 'forms', 'KPIs (KPI-000001)', 'risks', 'controls', 'audit_logs'
  ];

  const systemLayers = [
    '1. طبقة واجهة المستخدم Frontend (React + TypeScript + Tailwind)',
    '2. طبقة منطق الأعمال Business Logic (Modular Monolith / Microservices Ready)',
    '3. طبقة الذكاء الاصطناعي AI Orchestration Layer (Multi-Provider: Gemini, OpenAI, Claude)',
    '4. طبقة إدارة القوالب Dynamic Template Engine',
    '5. طبقة التوليد Document Generation Pipeline (XLSX, DOCX, PDF, PPTX, ZIP)',
    '6. طبقة الحسابات والمعادلات Formula Engine (Excel Formulas & Live Calculators)',
    '7. طبقة قواعد البيانات Database Layer (PostgreSQL Relational Schema & UTF-8)',
    '8. طبقة معالجة الملفات File Processing Pipeline (Scan, Normalization, Extraction)',
    '9. طبقة البحث والفهرسة Search Engine (Arabic Normalization: الهمزات والتاء المربوطة)',
    '10. طبقة التكاملات API/Integration Layer (REST API /api/v1/* & Webhooks)',
    '11. طبقة المصادقة والصلاحيات Security & RBAC Layer (JWT, Rate Limiting, CORS)',
    '12. طبقة التدقيق Audit Trail Layer (User ID, IP, Action, Timestamp)',
    '13. طبقة المراقبة Logging & Monitoring Layer (CPU, Memory, Queue)',
    '14. طبقة التخزين والأرشفة Storage & Backup Layer (ZIP Bundles & Automated Retention)'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 dir-rtl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>لوحة التحكم التقنية وهندسة النظام (Developer & Architecture Console)</span>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-mono">
                  v1.0.0 (API /api/v1)
                </span>
              </h2>
              <p className="text-xs text-slate-400">فحص المعمارية الـ 14 طبقة، مفاتيح الخصائص Feature Flags، ومراقبة الذكاء الاصطناعي</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'architecture' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>المعمارية وقواعد البيانات</span>
          </button>
          <button
            onClick={() => setActiveTab('flags')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'flags' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ToggleRight className="w-4 h-4" />
            <span>مفاتيح الخصائص (Feature Flags)</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'ai' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>إدارة وتكلفة الذكاء الاصطناعي</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'api' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>مكشوفات APIs و Swagger DOCS</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'audit' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>سجل التدقيق (Audit Trail)</span>
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
              activeTab === 'monitoring' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>المراقبة المهام والتنفيذ</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              
              {/* Architecture Layers */}
              <div className="space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>معمارية النظام الـ 14 طبقة (Modular Monolith)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {systemLayers.map((layer, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{layer}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database Schema */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-400" />
                  <span>جداول قاعدة البيانات العلائقية المعتمدة (PostgreSQL Relational Schema)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {dbTables.map((tbl, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 text-center">
                      {tbl}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: FEATURE FLAGS */}
          {activeTab === 'flags' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-sm">مفاتيح الخصائص والإعدادات المتقدمة (Feature Flags)</h3>
                <p className="text-xs text-slate-400">تفعيل وتحديث المزايا التشغيلية دون إعادة بناء أو ترحيل المنصة</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(flags).map(([key, val]) => (
                  <div key={key} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-white text-xs block">{key}</span>
                      <span className="text-[11px] text-slate-400">
                        {key === 'ENABLE_AI' && 'تفعيل محرك الذكاء الاصطناعي'}
                        {key === 'ENABLE_PDF' && 'تفعيل محرك توليد مستندات PDF'}
                        {key === 'ENABLE_POWERPOINT' && 'تفعيل محرك عروض PowerPoint'}
                        {key === 'ENABLE_OFFLINE' && 'تفعيل وضع العمل دون اتصال PWA'}
                        {key === 'ENABLE_SHARING' && 'تفعيل مشاركة الروابط المؤقتة'}
                        {key === 'ENABLE_MULTI_TENANT' && 'تفعيل تعدد المؤسسات Multi-Tenant'}
                        {key === 'ENABLE_WEBSOCKETS' && 'تفعيل التحديثات اللحظية WebSockets'}
                        {key === 'ENABLE_EMAIL' && 'تفعيل خادم إشعارات البريد'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleFlag(key as keyof FeatureFlagsConfig)}
                      className={`p-1 text-2xl transition ${val ? 'text-amber-400' : 'text-slate-600'}`}
                    >
                      {val ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI ORCHESTRATOR & COST */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              
              {/* Provider Selection */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-white text-xs block">طبقة التجريد واختيار المزود (AI Provider Abstraction Layer)</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Gemini (Google)', 'OpenAI (GPT-4o)', 'Anthropic (Claude 3.5)'] as AIProvider[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handleProviderChange(p)}
                      className={`p-2.5 rounded-lg border text-xs font-bold transition ${
                        currentProvider === p
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">إجمالي الرموز (Total Tokens)</span>
                  <span className="text-2xl font-mono font-extrabold text-white">{aiOrchestrator.getTotalTokens().toLocaleString()}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">التكلفة الإجمالية المقدرة</span>
                  <span className="text-2xl font-mono font-extrabold text-emerald-400">{aiOrchestrator.getTotalCostSAR()} SAR</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-xs block">مزود الذكاء الاصطناعي النشط</span>
                  <span className="text-base font-bold text-amber-400 block pt-1">{currentProvider}</span>
                </div>
              </div>

              {/* Usage Log Table */}
              <div className="space-y-2">
                <span className="font-bold text-white text-xs block">سجل طلبات واستهلاك الذكاء الاصطناعي</span>
                <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-xl">
                  <table className="w-full text-xs text-right text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">المعرف</th>
                        <th className="p-2.5">المزود والنموذج</th>
                        <th className="p-2.5">الرموز (Tokens)</th>
                        <th className="p-2.5">التكلفة</th>
                        <th className="p-2.5">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {aiOrchestrator.getUsageLogs().map((log) => (
                        <tr key={log.id}>
                          <td className="p-2.5 font-mono text-amber-300 font-bold">{log.id}</td>
                          <td className="p-2.5">{log.provider} ({log.model})</td>
                          <td className="p-2.5 font-mono">{log.totalTokens.toLocaleString()}</td>
                          <td className="p-2.5 font-mono text-emerald-400">{log.costSAR} SAR</td>
                          <td className="p-2.5">
                            <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: API EXPLORER */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">مكشوفات APIs ونشر التوثيق (OpenAPI v3 Docs & Tester)</h3>
                  <p className="text-xs text-slate-400">اختبار نقاط النهاية لمسارات `/api/v1/*` مباشرة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">اختر API لاختباره:</span>
                  <div className="space-y-1 text-xs font-mono">
                    {[
                      '/api/v1/health',
                      '/api/v1/projects',
                      '/api/v1/templates',
                      '/api/v1/search?q=موارد',
                      '/api/v1/audit',
                      '/api/v1/developer-settings',
                      '/api/v1/docs'
                    ].map((ep) => (
                      <button
                        key={ep}
                        onClick={() => handleTestApi(ep)}
                        className={`w-full text-right p-2 rounded border transition truncate ${
                          selectedApiEndpoint === ep
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        GET {ep}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                  <span className="text-slate-400 block font-sans">الاستجابة البرمجية من الخادم (Response 200 OK):</span>
                  <pre className="bg-slate-900 p-3 rounded-lg text-emerald-300 overflow-x-auto max-h-64 border border-slate-800">
                    {apiResponse || '// اضغط على أي API لعرض استجابة الخادم اللحظية...'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-white text-sm">سجل التدقيق والأمان الحرج (Audit Trail Log)</h3>
                <p className="text-xs text-slate-400">تتبع عمليات المستخدمين بالمعرف والوقت وعنوان IP والتغييرات</p>
              </div>

              <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-xl">
                <table className="w-full text-xs text-right text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">معرف العملية</th>
                      <th className="p-2.5">المستخدم</th>
                      <th className="p-2.5">عنوان IP</th>
                      <th className="p-2.5">نوع الإجراء</th>
                      <th className="p-2.5">التغيير والنتيجة</th>
                      <th className="p-2.5">التاريخ والوقت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {auditEngine.getLogs().map((log) => (
                      <tr key={log.id}>
                        <td className="p-2.5 font-mono text-amber-300 font-bold">{log.id}</td>
                        <td className="p-2.5 text-white">{log.userName} ({log.userId})</td>
                        <td className="p-2.5 font-mono text-slate-400">{log.ipAddress}</td>
                        <td className="p-2.5 text-blue-300">{log.action}</td>
                        <td className="p-2.5 text-emerald-400">{log.newValue}</td>
                        <td className="p-2.5 font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: MONITORING & QUEUE */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">استهلاك المعالج CPU</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">14.2%</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">الذاكرة المستخدمة RAM</span>
                  <span className="text-xl font-mono font-bold text-blue-400">420 MB / 2 GB</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">زمن الاستجابة Latency</span>
                  <span className="text-xl font-mono font-bold text-amber-300">18 ms</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">حالة قاعدة البيانات</span>
                  <span className="text-xl font-mono font-bold text-emerald-400">PostgreSQL ✅</span>
                </div>
              </div>

              {/* Background Queue Monitor */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs block">طابور المهام الخلفية (Background Queue Monitor)</h4>
                {queueEngine.getJobs().map((job) => (
                  <div key={job.jobId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-300 font-bold">{job.jobId}</span>
                        <span className="font-bold text-white">{job.projectName}</span>
                        <span className="text-slate-400">({job.taskType})</span>
                      </div>
                      <span className="text-emerald-400 font-bold">{job.progressPercentage}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${job.progressPercentage}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{job.message}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
