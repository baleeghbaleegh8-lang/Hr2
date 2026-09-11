import React, { useState, useRef, useEffect } from 'react';
import { InstitutionalSystem, QACheckResult, QualityReport, MissingRequirementItem, QASignature } from '../types/institutional';
import { runQualityAssurance, autoFixQualityIssues } from '../services/qaEngine';
import { generateMissingRequirementsMatrix } from '../services/contentEngine';
import { downloadSingleFormat, exportQAReportPDFDownload } from '../services/exportService';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Wrench,
  RefreshCw,
  Download,
  Filter,
  Search,
  ArrowRight,
  Sparkles,
  Award,
  Check,
  Calculator,
  Network,
  Users,
  Scale,
  Calendar,
  FileCheck2,
  Cpu,
  AlertCircle,
  PieChart,
  BarChart3,
  TrendingUp,
  Gauge,
  Layers,
  Activity,
  FileText,
  FileSignature,
  PenTool,
  Eraser,
  Stamp,
  Lock,
  Shield,
  CheckCircle,
  Trash2,
  UserCheck
} from 'lucide-react';

interface QAReportModalProps {
  system: InstitutionalSystem;
  onClose: () => void;
  onUpdateSystem: (updated: InstitutionalSystem) => void;
  onProceedToExport?: () => void;
}

export const QAReportModal: React.FC<QAReportModalProps> = ({
  system,
  onClose,
  onUpdateSystem,
  onProceedToExport
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'QA_CHECKS' | 'GAP_MATRIX' | 'DIGITAL_SIGNATURE'>('QA_CHECKS');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [gapImportanceFilter, setGapImportanceFilter] = useState<string>('ALL');
  const [gapSearchQuery, setGapSearchQuery] = useState<string>('');
  const [lastFixDetails, setLastFixDetails] = useState<string[]>([]);
  const [fixSuccessMessage, setFixSuccessMessage] = useState<string | null>(null);

  // Digital Signature State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const [signerName, setSignerName] = useState<string>(system.qaReport?.signature?.signerName || 'د. عبد الله الماجد');
  const [signerTitle, setSignerTitle] = useState<string>(system.qaReport?.signature?.signerTitle || 'مدير عام الحوكمة والجودة المؤسسية');
  const [signerDepartment, setSignerDepartment] = useState<string>(system.qaReport?.signature?.signerDepartment || 'إدارة الالتزام والاستراتيجية');
  const [approvalStatus, setApprovalStatus] = useState<'معتمد' | 'معتمد بشرط' | 'قيد المراجعة'>(system.qaReport?.signature?.approvalStatus || 'معتمد');
  const [signatureNotes, setSignatureNotes] = useState<string>(system.qaReport?.signature?.notes || 'تمت مراجعة مصفوفة الفجوات واستيفاء الضوابط المؤسسية والموافقة على التصدير.');
  const [signatureSavedMsg, setSignatureSavedMsg] = useState<string | null>(null);

  // Compute fresh report
  const currentReport: QualityReport = runQualityAssurance(system);

  // Missing Requirements Matrix & Completion Dashboard Calculations
  const gapMatrix: MissingRequirementItem[] = system.missingRequirementsMatrix && system.missingRequirementsMatrix.length > 0
    ? system.missingRequirementsMatrix
    : generateMissingRequirementsMatrix(system);

  const totalGapsCount = gapMatrix.length;
  const availableGapsCount = gapMatrix.filter(g => g.availabilityStatus === 'متوفر').length;
  const overallGapCompletionPercentage = totalGapsCount > 0 
    ? Math.round((availableGapsCount / totalGapsCount) * 100) 
    : 100;

  // Breakdown by Severity / Importance Level
  const criticalGaps = gapMatrix.filter(g => g.importance === 'ضروري للإكمال');
  const criticalGapsCount = criticalGaps.length;
  const criticalAvailCount = criticalGaps.filter(g => g.availabilityStatus === 'متوفر').length;
  const criticalPct = criticalGapsCount > 0 ? Math.round((criticalAvailCount / criticalGapsCount) * 100) : 100;

  const reviewGaps = gapMatrix.filter(g => g.importance === 'يحتاج مراجعة');
  const reviewGapsCount = reviewGaps.length;
  const reviewAvailCount = reviewGaps.filter(g => g.availabilityStatus === 'متوفر').length;
  const reviewPct = reviewGapsCount > 0 ? Math.round((reviewAvailCount / reviewGapsCount) * 100) : 100;

  const optionalGaps = gapMatrix.filter(g => g.importance === 'اختياري');
  const optionalGapsCount = optionalGaps.length;
  const optionalAvailCount = optionalGaps.filter(g => g.availabilityStatus === 'متوفر').length;
  const optionalPct = optionalGapsCount > 0 ? Math.round((optionalAvailCount / optionalGapsCount) * 100) : 100;

  const variableGaps = gapMatrix.filter(g => g.importance === 'متغير حسب النظام');
  const variableGapsCount = variableGaps.length;
  const variableAvailCount = variableGaps.filter(g => g.availabilityStatus === 'متوفر').length;
  const variablePct = variableGapsCount > 0 ? Math.round((variableAvailCount / variableGapsCount) * 100) : 100;

  // Run Auto-Repair
  const handleAutoFix = () => {
    const { updatedSystem, fixedCount, fixedDetails } = autoFixQualityIssues(system);
    onUpdateSystem(updatedSystem);
    setLastFixDetails(fixedDetails);
    setFixSuccessMessage(`تم معالجة وإصلاح ${fixedCount} مشكلة بنجاح تلقائياً!`);
    setTimeout(() => {
      setFixSuccessMessage(null);
    }, 6000);
  };

  // Re-run Check
  const handleReRun = () => {
    const fresh = runQualityAssurance(system);
    const updated = { ...system, qaReport: fresh, updatedAt: new Date().toISOString() };
    onUpdateSystem(updated);
  };

  // Export QA Report text/JSON
  const handleDownloadQAReportJSON = () => {
    const blob = new Blob([JSON.stringify(currentReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QA_Report_${system.projectDefinition.projectName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter gaps
  const filteredGaps = gapMatrix.filter(gap => {
    const matchesImportance = gapImportanceFilter === 'ALL' || gap.importance === gapImportanceFilter;
    const matchesSearch = gapSearchQuery.trim() === '' ||
      gap.requirement.toLowerCase().includes(gapSearchQuery.toLowerCase()) ||
      gap.actionRequired.toLowerCase().includes(gapSearchQuery.toLowerCase()) ||
      (gap.category && gap.category.toLowerCase().includes(gapSearchQuery.toLowerCase())) ||
      gap.id.toLowerCase().includes(gapSearchQuery.toLowerCase());
    return matchesImportance && matchesSearch;
  });

  // Filter checks
  const filteredChecks = currentReport.checks.filter(chk => {
    const matchesStatus = filterStatus === 'ALL' || chk.status === filterStatus;
    const matchesSearch = searchQuery.trim() === '' ||
      chk.checkItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chk.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chk.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    if (category.includes('المعادلات')) return Calculator;
    if (category.includes('الروابط')) return Network;
    if (category.includes('الموارد')) return Users;
    if (category.includes('التشريعات')) return Scale;
    if (category.includes('المدد')) return Calendar;
    if (category.includes('الترميز')) return FileCheck2;
    return Cpu;
  };

  // Canvas Signature Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const generateDigitalStamp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Stamp Border
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 10, canvas.width - 30, canvas.height - 20);

    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 15, canvas.width - 40, canvas.height - 30);

    // Stamp Content
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('معتمد رقمياً - الحوكمة والجودة', canvas.width / 2, 35);

    ctx.fillStyle = '#34D399';
    ctx.font = '11px sans-serif';
    ctx.fillText(signerName || 'الاعتماد التنفيذي', canvas.width / 2, 55);

    ctx.fillStyle = '#6EE7B7';
    ctx.font = '9px monospace';
    ctx.fillText(`HASH: SIG-${Date.now().toString(36).toUpperCase()}`, canvas.width / 2, 75);
  };

  const handleSaveSignature = () => {
    const canvas = canvasRef.current;
    let dataUrl = system.qaReport?.signature?.signatureDataUrl;
    if (canvas) {
      dataUrl = canvas.toDataURL('image/png');
    }

    const hashId = `SIG-QA-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const newSignature: QASignature = {
      signerName: signerName || 'د. عبد الله الماجد',
      signerTitle: signerTitle || 'مدير عام الحوكمة والجودة المؤسسية',
      signerDepartment: signerDepartment || 'إدارة الالتزام والتطوير الاستراتيجي',
      signedAt: new Date().toLocaleDateString('ar-SA') + ' - ' + new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      signatureHash: system.qaReport?.signature?.signatureHash || hashId,
      signatureDataUrl: dataUrl,
      approvalStatus,
      notes: signatureNotes
    };

    const updatedReport: QualityReport = {
      ...currentReport,
      signature: newSignature
    };

    const updatedSystem: InstitutionalSystem = {
      ...system,
      qaReport: updatedReport
    };

    onUpdateSystem(updatedSystem);
    setSignatureSavedMsg('تم تثبيت التوقيع والاعتماد الرقمي للمدير بنجاح! يمكن الآن تصدير التقرير موثقاً.');
    setTimeout(() => setSignatureSavedMsg(null), 5000);
  };

  const handleClearSignature = () => {
    const updatedReport: QualityReport = {
      ...currentReport,
      signature: undefined
    };
    const updatedSystem: InstitutionalSystem = {
      ...system,
      qaReport: updatedReport
    };
    onUpdateSystem(updatedSystem);
    clearCanvas();
    setSignatureSavedMsg('تم إلغاء التوقيع والاعتماد الإلكتروني.');
    setTimeout(() => setSignatureSavedMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto dir-rtl text-right">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex flex-col gap-3 p-5 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-white">تقرير فحص الجودة والتوافق (QA Report)</h2>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    currentReport.status === 'جاهز للتصدير'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : 'bg-amber-950 text-amber-300 border-amber-500/40'
                  }`}>
                    {currentReport.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  منظومة: <span className="text-slate-200 font-semibold">{system.projectDefinition.projectName}</span> ({system.uid})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportQAReportPDFDownload(system)}
                className="py-2 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition active:scale-95"
                title="تصدير مصفوفة النواقص والمؤشرات بصيغة PDF للأرشفة"
              >
                <FileText className="w-4 h-4" />
                <span>تصدير التقرير PDF</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveViewTab('QA_CHECKS')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeViewTab === 'QA_CHECKS'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>نتائج الفحص</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950/60 rounded-full text-slate-200">
                {currentReport.checks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveViewTab('GAP_MATRIX')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeViewTab === 'GAP_MATRIX'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>مصفوفة النواقص والمؤشرات</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                criticalGapsCount > 0 ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-slate-950/60 text-slate-200'
              }`}>
                {gapMatrix.length}
              </span>
            </button>

            <button
              onClick={() => setActiveViewTab('DIGITAL_SIGNATURE')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeViewTab === 'DIGITAL_SIGNATURE'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span>التوقيع والاعتماد الرقمي</span>
              {system.qaReport?.signature ? (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  مُعتمد
                </span>
              ) : (
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-500/40 rounded-full">
                  بانتظار الاعتماد
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* Fix Success Notification Banner */}
          {fixSuccessMessage && (
            <div className="p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{fixSuccessMessage}</span>
              </div>
              <span className="text-[10px] bg-emerald-900/80 px-2.5 py-1 rounded-lg">تحديث تلقائي مفعّل</span>
            </div>
          )}

          {/* VIEW TAB 1: QA CHECKS AUDIT */}
          {activeViewTab === 'QA_CHECKS' && (
            <>
              {/* Top Score & KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                
                {/* Overall Score Card */}
                <div className="sm:col-span-2 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between shadow-lg">
                  <div className="space-y-1">
                    <span className="text-[11px] text-amber-300 font-bold block">مؤشر الجودة الكلي QA Score</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-amber-400 font-mono">{currentReport.overallScore}</span>
                      <span className="text-xs text-slate-400 font-mono">/ 100</span>
                    </div>
                    <span className="text-[10px] text-slate-300 block">
                      {currentReport.overallScore >= 90 ? 'ممتاز - جاهز للتنفيذ والتصدير' : currentReport.overallScore >= 75 ? 'جيد جداً - يتطلب تنبيهات بسيطة' : 'يحتاج مراجعة وإصلاح'}
                    </span>
                  </div>
                  <div className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <Award className="w-8 h-8 text-amber-400" />
                  </div>
                </div>

                {/* Passed Card */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">ناجح (PASSED)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">{currentReport.passedCount}</div>
                  <span className="text-[10px] text-slate-500 block">فحوصات مجتازة</span>
                </div>

                {/* Warnings Card */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">تنبيهات (WARNING)</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-400 font-mono">{currentReport.warningCount}</div>
                  <span className="text-[10px] text-slate-500 block">قابلة للتصحيح</span>
                </div>

                {/* Review Required Card */}
                <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">مراجعة قانونية</span>
                    <ShieldAlert className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-blue-400 font-mono">{currentReport.reviewRequiredCount}</div>
                  <span className="text-[10px] text-slate-500 block">اعتماد مرجعي</span>
                </div>

              </div>

              {/* Quick Actions & Auto-Fix Banner */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/15 text-blue-400 rounded-xl border border-blue-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">محرك الإصلاح التلقائي الشامل (Auto-Fix Quality Engine)</h4>
                    <p className="text-[11px] text-slate-400">
                      تصحيح صيغ Excel، إعادة إسناد الرواتب الشاملة، معالجة التكواد المكررة، وحساب المصفوفات تلقائياً.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={handleAutoFix}
                    className="flex-1 sm:flex-initial py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>تطبيق الإصلاح التلقائي الآن</span>
                  </button>

                  <button
                    onClick={handleReRun}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition"
                    title="إعادة الفحص المباشر"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>تحديث الفحص</span>
                  </button>
                </div>
              </div>

              {/* Fix details list preview if recent */}
              {lastFixDetails.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                  <span className="font-bold text-amber-400 block text-[11px]">تفاصيل الإصلاحات المطبقة مؤخراً:</span>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside max-h-32 overflow-y-auto">
                    {lastFixDetails.map((detail, idx) => (
                      <li key={idx} className="text-slate-400">{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 border border-slate-800 p-3 rounded-2xl">
                
                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                  {[
                    { id: 'ALL', label: 'الكل', count: currentReport.checks.length },
                    { id: 'PASSED', label: 'ناجح', count: currentReport.passedCount },
                    { id: 'WARNING', label: 'تنبيهات', count: currentReport.warningCount },
                    { id: 'ERROR', label: 'أخطاء', count: currentReport.errorCount },
                    { id: 'REVIEW_REQUIRED', label: 'مراجعة', count: currentReport.reviewRequiredCount },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterStatus(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                        filterStatus === tab.id
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 rounded-md text-slate-300">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث في بنود الفحص..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

              </div>

              {/* Checks List */}
              <div className="space-y-3">
                {filteredChecks.length === 0 ? (
                  <div className="text-center py-8 bg-slate-950/50 border border-slate-800/60 rounded-2xl space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">لا توجد عناصر فحص مطابقة للمحددات الحالية.</p>
                  </div>
                ) : (
                  filteredChecks.map((chk, idx) => {
                    const CategoryIcon = getCategoryIcon(chk.category);

                    return (
                      <div
                        key={idx}
                        className={`bg-slate-950 border rounded-2xl p-4 space-y-2 transition ${
                          chk.status === 'PASSED'
                            ? 'border-slate-800/80 hover:border-slate-700'
                            : chk.status === 'WARNING'
                            ? 'border-amber-500/30 bg-amber-950/10'
                            : chk.status === 'ERROR'
                            ? 'border-red-500/40 bg-red-950/10'
                            : 'border-blue-500/30 bg-blue-950/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
                              <CategoryIcon className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-medium block">{chk.category}</span>
                              <h4 className="text-xs font-bold text-white">{chk.checkItem}</h4>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {chk.status === 'PASSED' && (
                              <span className="flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>سليم ومجتاز</span>
                              </span>
                            )}
                            {chk.status === 'WARNING' && (
                              <span className="flex items-center gap-1 bg-amber-950 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>تنبيه قابل للتصحيح</span>
                              </span>
                            )}
                            {chk.status === 'ERROR' && (
                              <span className="flex items-center gap-1 bg-red-950 text-red-300 border border-red-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>خطأ بحاجة لإصلاح</span>
                              </span>
                            )}
                            {chk.status === 'REVIEW_REQUIRED' && (
                              <span className="flex items-center gap-1 bg-blue-950 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>مراجعة مرجعية</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed pr-9">{chk.details}</p>

                        {/* Affected Codes if any */}
                        {chk.affectedCodes && chk.affectedCodes.length > 0 && (
                          <div className="pr-9 flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-slate-400">العناصر المتأثرة:</span>
                            {chk.affectedCodes.slice(0, 6).map((code, cIdx) => (
                              <span key={cIdx} className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-amber-300 px-2 py-0.5 rounded">
                                {code}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Recommendation box */}
                        {chk.recommendation && (
                          <div className="mr-9 mt-1 p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-amber-400 shrink-0">التوصية:</span>
                              <span>{chk.recommendation}</span>
                            </div>
                            {chk.fixable && (
                              <button
                                onClick={handleAutoFix}
                                className="shrink-0 text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1"
                              >
                                <Wrench className="w-3 h-3" />
                                <span>إصلاح هذا البند</span>
                              </button>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* VIEW TAB 2: MISSING REQUIREMENTS MATRIX DASHBOARD */}
          {activeViewTab === 'GAP_MATRIX' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Overall Completion Rate & Graphical Progress Dashboard Banner */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-amber-500/20 to-emerald-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                      <Gauge className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-white">لوحة مؤشرات اكتمال النظام مقارنة بالنواقص (Requirements Completion Gauge)</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          overallGapCompletionPercentage >= 85
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                            : overallGapCompletionPercentage >= 60
                            ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                            : 'bg-red-950 text-red-300 border-red-500/40'
                        }`}>
                          {overallGapCompletionPercentage >= 85 ? 'جاهزية عالية واستيفاء مكتمل' : overallGapCompletionPercentage >= 60 ? 'جاهزية جزئية - يتطلب معالجة' : 'حرِج - متطلبات غير مكتملة'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        تحليل بياني مباشر لنسبة توفر البيانات الأساسية التشغيلية والمالية والإدارية في المنظومة.
                      </p>
                    </div>
                  </div>

                  {/* Main Metric Percentage Ring/Box */}
                  <div className="flex items-center gap-3 shrink-0 bg-slate-900/90 border border-slate-800 px-4 py-2.5 rounded-2xl">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">نسبة الاكتمال الكلية</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-amber-400 font-mono">{overallGapCompletionPercentage}%</span>
                        <span className="text-[10px] text-slate-500 font-mono">({availableGapsCount}/{totalGapsCount})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overall Graphical Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>مقياس التوافق والجاهزية الكلية:</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{availableGapsCount} من إجمالي {totalGapsCount} متطلب متوفر</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${overallGapCompletionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Graphical Severity Level Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* 1. Critical / Mandatory Card */}
                <div className="bg-gradient-to-br from-red-950/30 via-slate-950 to-slate-950 border border-red-500/30 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-red-300">ضروري للإكمال (حرج)</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-950 text-red-300 border border-red-500/40 rounded-full">
                      {criticalPct}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400">البنود المستوفاة:</span>
                      <span className="font-mono font-bold text-red-400">{criticalAvailCount} / {criticalGapsCount}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${criticalPct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-red-400/80 block">متطلبات نظامية واختبارية إلزامية</span>
                </div>

                {/* 2. Needs Review Card */}
                <div className="bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-950 border border-amber-500/30 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-amber-300">يحتاج مراجعة</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/40 rounded-full">
                      {reviewPct}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400">البنود المستوفاة:</span>
                      <span className="font-mono font-bold text-amber-400">{reviewAvailCount} / {reviewGapsCount}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${reviewPct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-400/80 block">تدقيق اعتمادات وصلاحيات مالية</span>
                </div>

                {/* 3. Optional Card */}
                <div className="bg-gradient-to-br from-blue-950/30 via-slate-950 to-slate-950 border border-blue-500/30 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-blue-300">اختياري (تحسينات)</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-500/40 rounded-full">
                      {optionalPct}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400">البنود المستوفاة:</span>
                      <span className="font-mono font-bold text-blue-400">{optionalAvailCount} / {optionalGapsCount}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full transition-all duration-500"
                        style={{ width: `${optionalPct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-400/80 block">خطط طوارئ وتوثيق إضافي</span>
                </div>

                {/* 4. Variable Card */}
                <div className="bg-gradient-to-br from-purple-950/30 via-slate-950 to-slate-950 border border-purple-500/30 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-purple-300">متغير حسب النظام</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/40 rounded-full">
                      {variablePct}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400">البنود المستوفاة:</span>
                      <span className="font-mono font-bold text-purple-400">{variableAvailCount} / {variableGapsCount}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
                        style={{ width: `${variablePct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-purple-400/80 block">سياسات وسلالم أجور مخصصة</span>
                </div>

              </div>

              {/* Filters & Search Toolbar for Gaps */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 border border-slate-800 p-3 rounded-2xl">
                
                {/* Importance Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                  {[
                    { id: 'ALL', label: 'كافة المتطلبات', count: gapMatrix.length },
                    { id: 'ضروري للإكمال', label: 'ضروري (حرج)', count: criticalGapsCount },
                    { id: 'يحتاج مراجعة', label: 'يحتاج مراجعة', count: reviewGapsCount },
                    { id: 'اختياري', label: 'اختياري', count: optionalGapsCount },
                    { id: 'متغير حسب النظام', label: 'متغير حسب النظام', count: variableGapsCount },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setGapImportanceFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                        gapImportanceFilter === tab.id
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 rounded-md text-slate-300">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search Input for Gaps */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={gapSearchQuery}
                    onChange={(e) => setGapSearchQuery(e.target.value)}
                    placeholder="البحث في المتطلبات والفجوات..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

              </div>

              {/* Interactive Color-Coded Matrix Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-bold">
                      <tr>
                        <th className="p-3">رمز الفجوة</th>
                        <th className="p-3">المتطلب المؤسسي والحقل المطلوب</th>
                        <th className="p-3">درجة الخطورة / الأهمية</th>
                        <th className="p-3">حالة التوفر</th>
                        <th className="p-3">المصدر الأصلي</th>
                        <th className="p-3">الإجراء التصحيحي الواجب اتخاذه</th>
                        <th className="p-3 text-center">الإجراء المباشر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredGaps.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-500">
                            لا توجد بنود مطابقة للفلاتر المحددة.
                          </td>
                        </tr>
                      ) : (
                        filteredGaps.map((gap) => {
                          const rowColorStyle = 
                            gap.importance === 'ضروري للإكمال'
                              ? 'border-r-4 border-r-red-500 bg-red-950/15 hover:bg-red-950/30'
                              : gap.importance === 'يحتاج مراجعة'
                              ? 'border-r-4 border-r-amber-500 bg-amber-950/15 hover:bg-amber-950/30'
                              : gap.importance === 'اختياري'
                              ? 'border-r-4 border-r-blue-500 bg-blue-950/15 hover:bg-blue-950/30'
                              : 'border-r-4 border-r-purple-500 bg-purple-950/15 hover:bg-purple-950/30';

                          return (
                            <tr key={gap.id} className={`transition ${rowColorStyle}`}>
                              <td className="p-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                                {gap.id}
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-white block">{gap.requirement}</span>
                                <span className="text-[10px] text-slate-400">{gap.category || 'عام'}</span>
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                                  gap.importance === 'ضروري للإكمال'
                                    ? 'bg-red-950 text-red-300 border-red-500/40'
                                    : gap.importance === 'يحتاج مراجعة'
                                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                                    : gap.importance === 'اختياري'
                                    ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                                    : 'bg-purple-950 text-purple-300 border-purple-500/40'
                                }`}>
                                  {gap.importance === 'ضروري للإكمال' && <AlertCircle className="w-3 h-3 text-red-400" />}
                                  {gap.importance === 'يحتاج مراجعة' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                                  {gap.importance === 'اختياري' && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                                  {gap.importance === 'متغير حسب النظام' && <Layers className="w-3 h-3 text-purple-400" />}
                                  <span>{gap.importance}</span>
                                </span>
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border inline-flex items-center gap-1 ${
                                  gap.availabilityStatus === 'متوفر'
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                    : gap.availabilityStatus === 'غير متوفر'
                                    ? 'bg-red-950 text-red-300 border-red-500/40'
                                    : gap.availabilityStatus === 'تحتاج مراجعة'
                                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                                    : 'bg-slate-900 text-slate-300 border-slate-700'
                                }`}>
                                  {gap.availabilityStatus === 'متوفر' && <Check className="w-3 h-3 text-emerald-400" />}
                                  {gap.availabilityStatus === 'غير متوفر' && <XCircle className="w-3 h-3 text-red-400" />}
                                  <span>{gap.availabilityStatus}</span>
                                </span>
                              </td>
                              <td className="p-3 text-slate-400 whitespace-nowrap text-[11px]">
                                {gap.source}
                              </td>
                              <td className="p-3 text-slate-300 text-[11px] leading-relaxed">
                                {gap.actionRequired}
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <button
                                  onClick={handleAutoFix}
                                  className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 mx-auto"
                                >
                                  <Wrench className="w-3 h-3" />
                                  <span>إصلاح تلقائي</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Digital Signature & Approval Certification */}
          {activeViewTab === 'DIGITAL_SIGNATURE' && (
            <div className="space-y-6">

              {/* Notification Message */}
              {signatureSavedMsg && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fade-in shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  <div className="flex-1">{signatureSavedMsg}</div>
                </div>
              )}

              {/* Header Overview Card */}
              <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                      <FileSignature className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>نظام الاعتماد والتوقيع الإلكتروني الرقمي</span>
                        <span className="text-[10px] px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-mono">
                          ISO & QA Compliant
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                        يتيح هذا النظام للمدراء والقيادات التنفيذية توثيق واعتماد تقرير فحص الجودة ومصفوفة النواقص رقمياً قبل التصدير. يضمن التوقيع سلامة المخرجات ويُرفق كختم حوكمة في كافة مستندات الـ PDF المصدّرة.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportQAReportPDFDownload(system)}
                      className="py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
                    >
                      <FileText className="w-4 h-4" />
                      <span>تصدير التقرير الموثق PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Verified Digital Certificate Seal (If already signed) */}
              {system.qaReport?.signature && (
                <div className="p-5 bg-slate-950 border-2 border-emerald-500/50 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 shrink-0">
                        <Award className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            وثيقة معتمدة وموقعة إلكترونياً
                          </span>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-md font-mono">
                            {system.qaReport.signature.approvalStatus}
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold text-white">
                          {system.qaReport.signature.signerName}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {system.qaReport.signature.signerTitle} — <span className="text-slate-400">{system.qaReport.signature.signerDepartment}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-1">
                          تاريخ التوقيع: {system.qaReport.signature.signedAt} | المعرف: <span className="text-emerald-400">{system.qaReport.signature.signatureHash}</span>
                        </p>
                        {system.qaReport.signature.notes && (
                          <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 mt-2 italic">
                            "{system.qaReport.signature.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Signature Preview Image / Seal */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      {system.qaReport.signature.signatureDataUrl ? (
                        <div className="p-2 bg-slate-900 border border-emerald-500/40 rounded-xl shadow-inner">
                          <img
                            src={system.qaReport.signature.signatureDataUrl}
                            alt="Signature Preview"
                            className="max-h-20 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center">
                          <Stamp className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
                          <span className="text-[10px] text-emerald-300 font-bold block">ختم الاعتماد الإلكتروني</span>
                        </div>
                      )}

                      <button
                        onClick={handleClearSignature}
                        className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>إلغاء الاعتماد والتوقيع</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* Digital Signature Entry & Canvas Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-md">
                
                {/* Left Column: Manager Info & Approval Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-2">
                    <UserCheck className="w-4 h-4" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider">بيانات المدير المسئول عن الاعتماد</h4>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">اسم المدير / صاحب الصلاحية</label>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      placeholder="أدخل اسم المدير المعتمد"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block">المسمى الوظيفي</label>
                      <input
                        type="text"
                        value={signerTitle}
                        onChange={(e) => setSignerTitle(e.target.value)}
                        placeholder="المسمى الوظيفي"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300 block">الإدارة / القسم</label>
                      <input
                        type="text"
                        value={signerDepartment}
                        onChange={(e) => setSignerDepartment(e.target.value)}
                        placeholder="اسم الإدارة"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">حالة الاعتماد والقرار النهائي</label>
                    <select
                      value={approvalStatus}
                      onChange={(e) => setApprovalStatus(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    >
                      <option value="معتمد">معتمد بالكامل (Fully Approved)</option>
                      <option value="معتمد بشرط">معتمد بشرط استيفاء الملاحظات (Conditional Approval)</option>
                      <option value="قيد المراجعة">قيد التقييم والمراجعة الإدارية (Under Review)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">توصيات وملاحظات المدير</label>
                    <textarea
                      rows={2}
                      value={signatureNotes}
                      onChange={(e) => setSignatureNotes(e.target.value)}
                      placeholder="أدخل أي ملاحظات إدارية على التقرير أو مصفوفة الفجوات"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition resize-none"
                    />
                  </div>
                </div>

                {/* Right Column: HTML5 Interactive Drawing Canvas Pad */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <PenTool className="w-4 h-4" />
                        <h4 className="text-xs font-extrabold uppercase tracking-wider">لوحة التوقيع والتأشير الإلكتروني</h4>
                      </div>
                      <span className="text-[10px] text-slate-400">ارسم توقيعك بالماوس أو اللمس</span>
                    </div>

                    <div className="relative group">
                      <canvas
                        ref={canvasRef}
                        width={420}
                        height={130}
                        className="w-full bg-slate-900 border-2 border-dashed border-slate-700 group-hover:border-emerald-500/60 rounded-xl cursor-crosshair touch-none transition"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                      <div className="absolute top-2 left-2 pointer-events-none text-[9px] text-slate-500 font-mono">
                        SIGNATURE PAD
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium rounded-lg flex items-center gap-1 transition"
                      >
                        <Eraser className="w-3.5 h-3.5" />
                        <span>مسح التوقيع</span>
                      </button>

                      <button
                        type="button"
                        onClick={generateDigitalStamp}
                        className="py-1.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold rounded-lg flex items-center gap-1 transition"
                      >
                        <Stamp className="w-3.5 h-3.5" />
                        <span>توليد ختم إلكتروني تلقائي</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <button
                      onClick={handleSaveSignature}
                      className="w-full py-3 px-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform active:scale-98"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>تثبيت واعتماد التوقيع الرقمي للمدير</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => exportQAReportPDFDownload(system)}
              className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-4 h-4" />
              <span>تصدير التقرير PDF</span>
            </button>

            <button
              onClick={handleDownloadQAReportJSON}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => downloadSingleFormat(system, 'ZIP')}
              className="flex-1 sm:flex-initial py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تصدير حزمة ZIP النظيفة</span>
            </button>

            {onProceedToExport && (
              <button
                onClick={onProceedToExport}
                className="flex-1 sm:flex-initial py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
              >
                <span>المتابعة لمركز التصدير</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
