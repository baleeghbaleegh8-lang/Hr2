import React, { useState } from 'react';
import {
  InstitutionalSystem,
  SOPItem,
  RiskItem,
  KPIItem,
  FormulaItem,
  DictionaryItem,
  HREmployeeRecord,
  ChartOfAccount,
  FormTemplate,
  LegislationItem,
  AuthorityMatrixItem
} from '../types/institutional';
import { downloadSingleFormat } from '../services/exportService';
import {
  checkRelationshipIntegrity,
  calculateCompletenessScore,
  calculateInstitutionalMaturity
} from '../services/integrityEngine';
import {
  LayoutDashboard,
  Network,
  BookOpen,
  Calculator,
  Calendar,
  ShieldCheck,
  Users,
  DollarSign,
  ShoppingBag,
  Cpu,
  AlertTriangle,
  BarChart3,
  Scale,
  Grid,
  FileCheck2,
  ListTodo,
  Database,
  FileText,
  CheckCircle2,
  Download,
  Search,
  Plus,
  Trash2,
  FileSpreadsheet,
  FolderArchive,
  RefreshCw,
  Award,
  CheckCircle,
  AlertCircle,
  Target,
  Workflow,
  Sliders,
  Briefcase,
  Layers,
  Shield
} from 'lucide-react';

interface InstitutionalWorkspaceProps {
  system: InstitutionalSystem;
  onUpdateSystem: (updated: InstitutionalSystem) => void;
  onNewSystem: () => void;
  onOpenQAModal?: () => void;
}

export const InstitutionalWorkspace: React.FC<InstitutionalWorkspaceProps> = ({
  system,
  onUpdateSystem,
  onNewSystem,
  onOpenQAModal
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Calculator State
  const [calcSalary, setCalcSalary] = useState(12000);
  const [calcYears, setCalcYears] = useState(6);
  const [calcEosbResult, setCalcEosbResult] = useState<number>(0);

  const calculateEOSB = () => {
    let total = 0;
    if (calcYears <= 5) {
      total = (calcSalary / 2) * calcYears;
    } else {
      total = ((calcSalary / 2) * 5) + (calcSalary * (calcYears - 5));
    }
    setCalcEosbResult(total);
  };

  const integrityReport = checkRelationshipIntegrity(system);
  const completeness = calculateCompletenessScore(system);
  const maturityReport = calculateInstitutionalMaturity(system);

  const menuItems = [
    { id: 'dashboard', label: 'لوحة قيادة النظام', icon: LayoutDashboard },
    { id: 'gap_matrix', label: 'تحليل الفجوات والنواقص (Gap Matrix)', icon: AlertCircle },
    { id: 'master_index', label: 'الفهرس الذكي والمشترك (Master Index)', icon: ListTodo },
    { id: 'policies', label: 'دليل السياسات واللوائح وSLAs', icon: FileCheck2 },
    { id: 'strategy_bsc', label: 'التخطيط الاستراتيجي وBSC والسيناريوهات', icon: Target },
    { id: 'rules_workflow', label: 'قواعد العمل ومحرك سير الموافقات', icon: Workflow },
    { id: 'certificate', label: 'شهادة اكتمال المشروع والمنتج', icon: Award },
    { id: 'maturity', label: 'تقرير النضج والاكتمال والنزاهة', icon: Award },
    { id: 'org', label: 'الهيكل التنظيمي والوظائف', icon: Network },
    { id: 'dictionary', label: 'قاموس المصطلحات والموسوعة', icon: BookOpen },
    { id: 'formulas', label: 'محرك الحسابات والمعادلات', icon: Calculator },
    { id: 'dates', label: 'المدد والتواريخ والـ SLAs', icon: Calendar },
    { id: 'governance', label: 'الحوكمة ومصفوفة الصلاحيات', icon: ShieldCheck },
    { id: 'hr', label: 'الموارد البشرية والرواتب', icon: Users },
    { id: 'finance', label: 'المالية ودليل الحسابات', icon: DollarSign },
    { id: 'procurement', label: 'المشتريات والعقود والموردين', icon: ShoppingBag },
    { id: 'sop', label: 'الإجراءات التشغيلية SOPs', icon: Cpu },
    { id: 'risks', label: 'سجل المخاطر والرقابة', icon: AlertTriangle },
    { id: 'kpi', label: 'مؤشرات الأداء KPIs', icon: BarChart3 },
    { id: 'legislation', label: 'التشريعات واللوائح', icon: Scale },
    { id: 'raci', label: 'مصفوفة المساءلة RACI', icon: Grid },
    { id: 'forms', label: 'النماذج المؤسسية المرقومة', icon: FileCheck2 },
    { id: 'workplan', label: 'خطة العمل والمهام', icon: ListTodo },
    { id: 'datadict', label: 'قاموس البيانات التقني', icon: Database },
    { id: 'manual', label: 'دليل المستخدم والتوثيق', icon: FileText },
    { id: 'qa', label: 'تقرير فحص الجودة QA', icon: CheckCircle2 },
    { id: 'export', label: 'مركز التصدير الحزم ZIP', icon: Download },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden dir-rtl">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-l border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
          
          <div className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-amber-400 font-bold block">النظام النشط والمعتمد</span>
            <h2 className="text-xs font-bold text-white truncate">{system.projectDefinition.projectName}</h2>
            <span className="text-[10px] text-slate-400 font-mono block">{system.uid}</span>
          </div>

          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Sidebar Footer Action */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => downloadSingleFormat(system, 'ZIP')}
            className="w-full py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow flex items-center justify-center gap-2"
          >
            <FolderArchive className="w-3.5 h-3.5 text-amber-300" />
            <span>تنزيل حزمة ZIP</span>
          </button>
          <button
            onClick={onNewSystem}
            className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium rounded-lg flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span>توليد نظام جديد</span>
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <main className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Search Bar Top */}
        <div className="flex items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث الحوري بالمصطلحات، الإجراءات، الأكواد، النماذج، والمخاطر..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadSingleFormat(system, 'XLSX')}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>تصدير Excel (15 ورقة)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-slate-400 text-xs font-medium">إجمالي الموظفين المخطط</span>
                <div className="text-2xl font-extrabold text-white font-mono">{system.orgStructure.totalEmployeesCount}</div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">هيكل وظيفي محوكم</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-slate-400 text-xs font-medium">درجة النضج المؤسسي</span>
                <div className="text-2xl font-extrabold text-amber-300 font-mono">{maturityReport.overallMaturityScore} / 100</div>
                <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">{maturityReport.maturityLevel}</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-slate-400 text-xs font-medium">معدل الاكتفاء الكلي</span>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">{completeness.overallCompletenessScore}%</div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">مكتمل المحتوى والبيانات</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-slate-400 text-xs font-medium">علامة فحص الجودة QA Score</span>
                <div className="text-2xl font-extrabold text-blue-400 font-mono">{system.qaReport.overallScore} / 100</div>
                <span className="text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-500/30">جاهز للتصدير والتنفيذ</span>
              </div>
            </div>

            {/* Executive Overview */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>الملخص التنفيذي وأهداف المنظومة</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {system.executiveSummary.overview}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 text-xs">أبرز المخاطر المرصودة:</span>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    {system.executiveSummary.keyRisks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400 text-xs">التوصيات والخطوات القادمة:</span>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    {system.executiveSummary.keyRecommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB: GAP MATRIX (Rule: Don't leave gaps - Req 145 & 237) */}
        {activeTab === 'gap_matrix' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <span>مصفوفة تحليل الفجوات والنواقص (Missing Requirements Matrix)</span>
                </h3>
                <p className="text-xs text-slate-400">قاعدة "لا تترك فجوات": كشف وتحليل كافة المتطلبات الناقصة ومصادرها والإجراء الموصى به.</p>
              </div>
              <span className="text-xs bg-amber-950/80 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl font-mono font-bold">
                عناصر تحت المتابعة: {(system.missingRequirementsMatrix || []).length}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                    <tr>
                      <th className="p-3">رمز الفجوة</th>
                      <th className="p-3">المتطلب التنظيمي / التشغيلي</th>
                      <th className="p-3">الأهمية والضرورة</th>
                      <th className="p-3">حالة التوفر</th>
                      <th className="p-3">المصدر الأصلي</th>
                      <th className="p-3">الإجراء التصحيحي الواجب اتخاذه</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {(system.missingRequirementsMatrix || []).map((gap) => (
                      <tr key={gap.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 font-mono font-bold text-amber-400">{gap.id}</td>
                        <td className="p-3 font-medium text-white">{gap.requirement}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            gap.importance === 'ضروري للإكمال' ? 'bg-red-950 text-red-300 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {gap.importance}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            gap.availabilityStatus === 'متوفر' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}>
                            {gap.availabilityStatus}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{gap.source}</td>
                        <td className="p-3 text-emerald-300 font-medium">{gap.actionRequired}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MASTER INDEX (Req 148 & 149 & 239) */}
        {activeTab === 'master_index' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-blue-400" />
                  <span>الفهرس الذكي والمشترك الموحد (Master Index & Content Classification)</span>
                </h3>
                <p className="text-xs text-slate-400">فهرس ذكي يجمع السياسات، الإجراءات، النماذج، والمؤشرات مع وسم المصادر (FACT, RULE, CALCULATION, USER DATA).</p>
              </div>
              <span className="text-xs bg-blue-950/80 text-blue-300 border border-blue-500/40 px-3 py-1.5 rounded-xl font-mono font-bold">
                إجمالي السجلات المفهرسة: {(system.masterIndex || []).length}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold">
                    <tr>
                      <th className="p-3">الرمز Code</th>
                      <th className="p-3">العنوان والبيان</th>
                      <th className="p-3">التصنيف الرئيسي</th>
                      <th className="p-3">نوع المحتوى</th>
                      <th className="p-3">وسم المصدر (Attribution Tag)</th>
                      <th className="p-3">الحالة والإصدار</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {(system.masterIndex || []).map((idx) => (
                      <tr key={idx.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 font-mono font-bold text-blue-400">{idx.code}</td>
                        <td className="p-3 font-medium text-white">{idx.title}</td>
                        <td className="p-3 text-slate-400">{idx.mainCategory}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-[10px]">
                            {idx.contentType}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded font-mono text-[10px] font-bold">
                            {idx.sourceAttribution}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-400">{idx.status} ({idx.version})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: POLICIES & SLAS (Req 157 & 158 & 161) */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-400" />
                  <span>دليل السياسات واللوائح المعتمدة واتفاقيات مستوى الخدمة SLAs</span>
                </h3>
                <p className="text-xs text-slate-400">سياسات محوكمة بالكامل متضمنة المبادئ، القواعد، الاستثناءات، والجزاءات.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {(system.policiesLibrary || []).map((pol) => (
                <div key={pol.policyCode} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-lg font-mono font-extrabold text-xs">
                        {pol.policyCode}
                      </span>
                      <h4 className="text-base font-bold text-white">{pol.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400">تاريخ النفاذ: {pol.effectiveDate} | الاعتماد: {pol.approvalBody}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-amber-400 block">الهدف والنطاق:</span>
                      <p className="text-slate-300">{pol.objective}</p>
                      <p className="text-slate-400 text-[11px] pt-1">النطاق: {pol.scope}</p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-emerald-400 block">المبادئ الحاكمة:</span>
                      <ul className="text-slate-300 list-disc list-inside space-y-0.5">
                        {pol.principles.map((pr, i) => <li key={i}>{pr}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <span className="font-bold text-blue-400 block">القواعد التشغيلية والجزاءات عند المخالفة:</span>
                    <ul className="text-slate-300 list-disc list-inside space-y-1">
                      {pol.rules.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: STRATEGY, BSC & SCENARIOS (Req 190 - 202) */}
        {activeTab === 'strategy_bsc' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  <span>التخطيط الاسترايتيجي وبطاقة الأداء المتوازن (BSC) وسيناريوهات الأداء</span>
                </h3>
                <p className="text-xs text-slate-400">الرؤية، الرسالة، تحليل SWOT، أبعاد BSC الأربعة، وسيناريوهات التحليل المالي.</p>
              </div>
            </div>

            {system.strategicFramework && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-amber-400 text-sm">الرؤية والرسالة الاستراتيجية</h4>
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    <strong>الرؤية:</strong> {system.strategicFramework.vision}
                  </p>
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    <strong>الرسالة:</strong> {system.strategicFramework.mission}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-emerald-400 text-sm">تحليل SWOT</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-emerald-400 block text-[11px]">نقاط القوة Strengths</span>
                      <ul className="list-disc list-inside text-slate-300 text-[10px] space-y-0.5">
                        {system.strategicFramework.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="font-bold text-red-400 block text-[11px]">نقاط الضعف Weaknesses</span>
                      <ul className="list-disc list-inside text-slate-300 text-[10px] space-y-0.5">
                        {system.strategicFramework.swot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Scenarios */}
            {system.scenarioAnalysis && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-white text-sm">محرك السيناريوهات التقديرية (Base / Best / Worst Case)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold text-blue-400 block">السيناريو المرجعي (Base Case)</span>
                    <div className="text-lg font-mono font-extrabold text-white">
                      {system.scenarioAnalysis.baseCase.profitSAR.toLocaleString()} SAR
                    </div>
                    <span className="text-[10px] text-slate-400 block">{system.scenarioAnalysis.baseCase.notes}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold text-emerald-400 block">السيناريو الأفضل (Best Case)</span>
                    <div className="text-lg font-mono font-extrabold text-emerald-400">
                      {system.scenarioAnalysis.bestCase.profitSAR.toLocaleString()} SAR
                    </div>
                    <span className="text-[10px] text-slate-400 block">{system.scenarioAnalysis.bestCase.notes}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-400 block">السيناريو الأدنى (Worst Case)</span>
                    <div className="text-lg font-mono font-extrabold text-amber-400">
                      {system.scenarioAnalysis.worstCase.profitSAR.toLocaleString()} SAR
                    </div>
                    <span className="text-[10px] text-slate-400 block">{system.scenarioAnalysis.worstCase.notes}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: RULES & WORKFLOW (Req 218 - 220) */}
        {activeTab === 'rules_workflow' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-emerald-400" />
                  <span>مستودع قواعد العمل (Business Rules) ومحرك سير الموافقات والاعتمادات</span>
                </h3>
                <p className="text-xs text-slate-400">قواعد تشغيلية منفصلة عن الكود البرمجي مع تحديد مسارات الاعتماد والتصعيد.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-white text-sm">مستودع قواعد العمل (Rules Repository)</h4>
                <div className="space-y-3 text-xs">
                  {(system.businessRules || []).map((rule) => (
                    <div key={rule.ruleId} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-amber-400">{rule.ruleId}</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded text-[10px]">
                          {rule.priority}
                        </span>
                      </div>
                      <h5 className="font-bold text-white">{rule.title}</h5>
                      <p className="text-slate-300 text-[11px]"><strong>الشرط:</strong> {rule.condition}</p>
                      <p className="text-emerald-300 text-[11px]"><strong>الإجراء:</strong> {rule.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-white text-sm">مسار سير الموافقات والاعتمادات (Approval Workflow)</h4>
                <div className="space-y-3 text-xs">
                  {(system.workflowSteps || []).map((step) => (
                    <div key={step.stepOrder} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-400">الخطوة {step.stepOrder}: {step.stepName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">التصعيد: {step.escalationHours} ساعة</span>
                      </div>
                      <p className="text-slate-300 text-[11px]"><strong>المسؤول:</strong> {step.actorRole}</p>
                      <p className="text-emerald-300 text-[11px]"><strong>عند الموافقة:</strong> {step.ifApproved}</p>
                      <p className="text-red-300 text-[11px]"><strong>عند الرفض:</strong> {step.ifRejected}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CERTIFICATE & PRODUCT MODE (Req 230 & 234) */}
        {activeTab === 'certificate' && (
          <div className="space-y-6">
            {system.completionCertificate && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-xl font-mono text-xs font-bold">
                      {system.completionCertificate.certificateId}
                    </span>
                    <h3 className="text-xl font-extrabold text-white">شهادة اكتمال وجاهزية النظام المؤسسي (Project Completion Certificate)</h3>
                    <p className="text-xs text-slate-400">توثيق رسمي يؤكد خلو النظام من الفجوات وجاهزيته للتطبيق والبيع والتشغيل.</p>
                  </div>
                  <div className="bg-emerald-950/80 border border-emerald-500/50 p-3 rounded-2xl text-center">
                    <span className="text-[10px] text-emerald-300 font-bold block">نسبة الاكتمال المعتمدة</span>
                    <span className="text-2xl font-mono font-extrabold text-emerald-400">{system.completionCertificate.overallCompletionPct}%</span>
                  </div>
                </div>

                {/* Evaluations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {system.completionCertificate.evaluations.map((ev, i) => (
                    <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{ev.dimension}</span>
                        <span className="font-mono text-emerald-400 font-bold">{ev.score}%</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{ev.comments}</p>
                    </div>
                  ))}
                </div>

                {/* Verification Checklist */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-white text-xs">قوائم التحقق الشاملة من متطلبات الجودة والحوكمة (16/16 Verification Points):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {system.completionCertificate.verificationChecklist.map((ch, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-slate-300 font-medium">{ch.checkName}</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">
                          ✓ {ch.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: MATURITY & INTEGRITY */}
        {activeTab === 'maturity' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">تقرير النضج المؤسسي والاكتمال وفحص النزاهة</h3>
                <p className="text-xs text-slate-400">تقييم 11 بعداً للحوكمة، فحص النزاهة العلاائقية، ونسب الاكتفاء</p>
              </div>
            </div>

            {/* Maturity Score Highlight */}
            <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs text-amber-300 font-bold block">مستوى النضج المؤسسي المعتمد</span>
                    <h4 className="text-xl font-extrabold text-white">{maturityReport.maturityLevel}</h4>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-3xl font-mono font-extrabold text-amber-300">{maturityReport.overallMaturityScore}</span>
                  <span className="text-xs text-slate-400 font-mono block">من 100</span>
                </div>
              </div>

              {/* Completeness Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">محتوى الإجراءات</span>
                  <span className="font-mono font-bold text-emerald-400">{completeness.contentCompleteness}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">بيانات السجلات</span>
                  <span className="font-mono font-bold text-blue-400">{completeness.dataCompleteness}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">محرك الصيغ</span>
                  <span className="font-mono font-bold text-amber-300">{completeness.formulaCompleteness}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">التشريعات</span>
                  <span className="font-mono font-bold text-purple-400">{completeness.referenceCompleteness}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">التصميم والتأطير</span>
                  <span className="font-mono font-bold text-emerald-300">{completeness.designCompleteness}%</span>
                </div>
              </div>
            </div>

            {/* 11 Dimensions List */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">تقييم الأبعاد الإحدى عشر للحوكمة والنضج:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {maturityReport.dimensions.map((dim, idx) => (
                  <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{dim.name}</span>
                      <span className="font-mono font-bold text-amber-300 text-xs">{dim.score} / 100</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{dim.keyNotes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationship Integrity Checker Results */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>نتائج فحص الاتساق والنزاهة العلاائقية (Relationship Integrity Checker):</span>
              </h4>

              {integrityReport.issues.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>لم يتم العثور على أي اتصالات أو عناصر يتيمة المكونات. النظام متكامل علاائقياً بنسبة 100%.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {integrityReport.issues.map((iss) => (
                    <div key={iss.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400">{iss.category}: {iss.message}</span>
                        <span className="font-mono text-[10px] text-slate-500">{iss.id}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">التوصية: {iss.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: ORG STRUCTURE */}
        {activeTab === 'org' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">الهيكل التنظيمي والوظائف المعيارية</h3>
                <p className="text-xs text-slate-400">توزيع القطاعات والإدارات والأقسام مع بطاقات الوصف المرقومة</p>
              </div>
            </div>

            <div className="space-y-4">
              {system.orgStructure.sectors.map((sec, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                        {sec.code}
                      </span>
                      <h4 className="font-bold text-white text-sm">{sec.name}</h4>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">المسؤول: {sec.leadTitle}</span>
                  </div>

                  <div className="space-y-3">
                    {sec.departments.map((dept, j) => (
                      <div key={j} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-300 text-xs">{dept.name} ({dept.code})</span>
                          <span className="text-[11px] text-slate-400">مدير الإدارة: {dept.deptHead}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          {dept.sections.flatMap(s => s.jobTitles).map((job, k) => (
                            <div key={k} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-xs">{job.title}</span>
                                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono">{job.code}</span>
                              </div>
                              <p className="text-[11px] text-slate-400">المستوى: {job.level} | العدد المطلوب: {job.count}</p>
                              <p className="text-[10px] text-slate-500">المؤهلات: {job.qualifications}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DICTIONARY */}
        {activeTab === 'dictionary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">قاموس المصطلحات والموسوعة المؤسسية</h3>
                <p className="text-xs text-slate-400">المفاهيم والتعاريف والمصطلحات باللغتين العربية والإنجليزية</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {system.dictionary.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 text-sm">{item.term}</span>
                    <span className="text-xs text-slate-400 font-mono">{item.englishTerm} ({item.abbreviation})</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.detailedDefinition}</p>
                  <div className="text-[10px] text-slate-500 bg-slate-950 p-2 rounded border border-slate-800/80">
                    <span className="font-bold text-slate-400">مثال الاستخدام: </span>
                    <span>{item.usageExample}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FORMULAS & CALCULATOR */}
        {activeTab === 'formulas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">محرك الحسابات والمعادلات التشغيلية</h3>
                <p className="text-xs text-slate-400">صيغ Excel الحقيقية والحاسبة التفاعلية المباشرة</p>
              </div>
            </div>

            {/* Live Interactive EOSB Calculator Component */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-800/50 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-sm">حاسبة مستحقات نهاية الخدمة التفاعلية الحية (المادة 84)</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">الراتب الأخير الشامل (SAR)</label>
                  <input
                    type="number"
                    value={calcSalary}
                    onChange={(e) => setCalcSalary(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">عدد سنوات الخدمة الكلية</label>
                  <input
                    type="number"
                    value={calcYears}
                    onChange={(e) => setCalcYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={calculateEOSB}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow"
                  >
                    احتساب الآن
                  </button>
                </div>
              </div>

              {calcEosbResult > 0 && (
                <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/40 flex items-center justify-between">
                  <span className="text-xs text-slate-300">إجمالي مكافأة نهاية الخدمة المستحقة:</span>
                  <span className="text-xl font-extrabold text-amber-300 font-mono">{calcEosbResult.toLocaleString()} SAR</span>
                </div>
              )}
            </div>

            {/* Formulas List */}
            <div className="space-y-3">
              {system.formulas.map((f, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{f.name} ({f.code})</span>
                    <span className="text-xs font-mono bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      {f.excelFormula}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{f.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1">
                    <div>الصيغة الرياضية: <span className="text-slate-200 font-mono">{f.mathFormula}</span></div>
                    <div>وحدة القياس: <span className="text-amber-300">{f.unit}</span></div>
                    <div>نتيجة عينة: <span className="text-emerald-400 font-bold">{f.sampleResult}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: HR & PAYROLL */}
        {activeTab === 'hr' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">سجلات الموارد البشرية والرواتب</h3>
                <p className="text-xs text-slate-400">بيانات الموظفين والرواتب الأساسية والبدلات وصافي المستحق</p>
              </div>
            </div>

            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
              <table className="w-full text-xs text-right text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">الرقم الوظيفي</th>
                    <th className="p-3">الاسم الكامل</th>
                    <th className="p-3">المسمى الوظيفي</th>
                    <th className="p-3">تاريخ المباشرة</th>
                    <th className="p-3">الأساسي</th>
                    <th className="p-3">السكن</th>
                    <th className="p-3">النقل</th>
                    <th className="p-3">إجمالي الشامل</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {system.hrEmployees.map((emp, i) => (
                    <tr key={i} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono text-amber-300 font-bold">{emp.empCode}</td>
                      <td className="p-3 text-white font-medium">{emp.fullName}</td>
                      <td className="p-3">{emp.jobTitle}</td>
                      <td className="p-3 font-mono">{emp.hireDate}</td>
                      <td className="p-3 font-mono">{emp.basicSalary.toLocaleString()}</td>
                      <td className="p-3 font-mono">{emp.housingAllowance.toLocaleString()}</td>
                      <td className="p-3 font-mono">{emp.transportAllowance.toLocaleString()}</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">{emp.totalSalary.toLocaleString()} SAR</td>
                      <td className="p-3">
                        <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px]">
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: SOP PROCEDURES */}
        {activeTab === 'sop' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">دليل الإجراءات التشغيلية القياسية SOPs</h3>
                <p className="text-xs text-slate-400">خطوات التنفيذ، المنفذ، المخرجات، والضوابط الرقابية</p>
              </div>
            </div>

            <div className="space-y-4">
              {system.sopLibrary.map((sop, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                        {sop.sopCode}
                      </span>
                      <h4 className="font-bold text-white text-sm">{sop.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400">الإصدار {sop.version} | SLA: {sop.slaTargetHours} ساعة</span>
                  </div>

                  <p className="text-xs text-slate-300">{sop.objective}</p>

                  {/* Steps Table */}
                  <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
                    <table className="w-full text-xs text-right text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">#</th>
                          <th className="p-2.5">الخطوة الإجرائية</th>
                          <th className="p-2.5">المنفّذ</th>
                          <th className="p-2.5">المخرج الناتجة</th>
                          <th className="p-2.5">الضابط الرقابي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {sop.steps.map((st, k) => (
                          <tr key={k}>
                            <td className="p-2.5 font-bold text-amber-400 font-mono">{st.stepNumber}</td>
                            <td className="p-2.5 text-white">{st.action}</td>
                            <td className="p-2.5 text-slate-300">{st.actor}</td>
                            <td className="p-2.5 text-emerald-400">{st.outputProduced}</td>
                            <td className="p-2.5 text-slate-400">{st.controlCheck}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: RISK REGISTER */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">سجل المخاطر والرقابة الداخلية</h3>
                <p className="text-xs text-slate-400">المخاطر التشغيلية، الدرجات، الضوابط المقترحة، ومالك الخطر</p>
              </div>
            </div>

            <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
              <table className="w-full text-xs text-right text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">كود الخطر</th>
                    <th className="p-3">وصف الخطر</th>
                    <th className="p-3">السبب</th>
                    <th className="p-3">الدرجة</th>
                    <th className="p-3">المستوى</th>
                    <th className="p-3">خطة المعالجة</th>
                    <th className="p-3">مالك الخطر</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {system.riskRegister.map((rsk, i) => (
                    <tr key={i} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono text-amber-300 font-bold">{rsk.riskCode}</td>
                      <td className="p-3 text-white font-medium">{rsk.description}</td>
                      <td className="p-3">{rsk.cause}</td>
                      <td className="p-3 font-mono font-bold text-amber-400">{rsk.riskScore}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rsk.riskLevel === 'عالي' ? 'bg-red-950 text-red-300 border border-red-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {rsk.riskLevel}
                        </span>
                      </td>
                      <td className="p-3">{rsk.mitigationPlan}</td>
                      <td className="p-3 text-slate-400">{rsk.riskOwner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 12: KPIS */}
        {activeTab === 'kpi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">مؤشرات قياس الأداء KPIs</h3>
                <p className="text-xs text-slate-400">المستهدفات، خط الأساس، الفعلي، ونسبة الإنجاز</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {system.kpiList.map((kpi, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{kpi.name}</span>
                    <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded">
                      {kpi.kpiCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{kpi.definition}</p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">المستهدف</span>
                      <span className="font-bold text-white">{kpi.target} {kpi.unit}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">الفعلي</span>
                      <span className="font-bold text-emerald-400">{kpi.actual} {kpi.unit}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="block text-[10px] text-slate-500">الإنجاز</span>
                      <span className="font-bold text-amber-300">{kpi.achievementPercentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 20: EXPORT CENTER */}
        {(activeTab === 'export' || activeTab === 'qa') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">مركز التصدير والحزم والتنزيل المؤسسي</h3>
                <p className="text-xs text-slate-400">تنزيل الملفات الحقيقية بمختلف الصيغ وحزم ZIP الشاملة</p>
              </div>
            </div>

            {/* QA Summary */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>نتيجة فحص الجودة التلقائي (QA Report Score)</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-extrabold text-emerald-400">
                    {system.qaReport.overallScore} / 100
                  </span>
                  {onOpenQAModal && (
                    <button
                      onClick={onOpenQAModal}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>عرض التقرير التفاعلي والإصلاح</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl text-center border border-slate-800 text-emerald-400">
                  <span className="block text-[10px] text-slate-500">ناجح</span>
                  <span className="font-mono font-bold text-sm">{system.qaReport.passedCount}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl text-center border border-slate-800 text-amber-400">
                  <span className="block text-[10px] text-slate-500">تنبيهات</span>
                  <span className="font-mono font-bold text-sm">{system.qaReport.warningCount}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl text-center border border-slate-800 text-red-400">
                  <span className="block text-[10px] text-slate-500">أخطاء</span>
                  <span className="font-mono font-bold text-sm">{system.qaReport.errorCount}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl text-center border border-slate-800 text-blue-400">
                  <span className="block text-[10px] text-slate-500">مراجعة قانونية</span>
                  <span className="font-mono font-bold text-sm">{system.qaReport.reviewRequiredCount}</span>
                </div>
              </div>
            </div>

            {/* Export Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <FileSpreadsheet className="w-6 h-6" />
                  <h4 className="font-bold text-white text-sm">ملف Excel القياسي (.xlsx)</h4>
                </div>
                <p className="text-xs text-slate-400">15 ورقة عمل كاملة مع الصيغ والجداول المنسقة والأدلة.</p>
                <button
                  onClick={() => downloadSingleFormat(system, 'XLSX')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow"
                >
                  تنزيل Excel (.xlsx)
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-blue-400">
                  <FileText className="w-6 h-6" />
                  <h4 className="font-bold text-white text-sm">ملف Word التوثيقي (.docx)</h4>
                </div>
                <p className="text-xs text-slate-400">وثيقة حوكمة وأدلة إجرائية وجداول توقيع رسمية.</p>
                <button
                  onClick={() => downloadSingleFormat(system, 'DOCX')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow"
                >
                  تنزيل Word (.docx)
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <FolderArchive className="w-6 h-6" />
                  <h4 className="font-bold text-white text-sm">حزمة ZIP المؤسسية الشاملة</h4>
                </div>
                <p className="text-xs text-slate-400">توليد المجلدات الـ 12 الفرعية بكافة الملفات والتنسيقات.</p>
                <button
                  onClick={() => downloadSingleFormat(system, 'ZIP')}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow"
                >
                  تنزيل حزمة ZIP كاملة
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
};
