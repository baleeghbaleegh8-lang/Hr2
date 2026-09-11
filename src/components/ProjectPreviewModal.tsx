import React from 'react';
import { X, CheckCircle2, FileSpreadsheet, Layers, ShieldCheck, FolderArchive, ArrowLeft } from 'lucide-react';
import { InstitutionalSystem } from '../types/institutional';

interface ProjectPreviewModalProps {
  system: InstitutionalSystem;
  onClose: () => void;
  onConfirmOpenWorkspace: () => void;
}

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  system,
  onClose,
  onConfirmOpenWorkspace
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-0">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{system.projectDefinition.projectName}</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
                  {system.uid}
                </span>
              </div>
              <p className="text-xs text-slate-300">تم اكتمال توليد وفحص حزمة النظام المؤسسي بنجاح (100%)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300 max-h-[70vh] overflow-y-auto">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px]">حالة الاعتماد</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {system.approvalStatus}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">المجال القطاعي</span>
              <span className="font-bold text-white truncate block">{system.projectDefinition.domain}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">مستوى التفاصيل</span>
              <span className="font-bold text-amber-300">{system.projectDefinition.complexity}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">علامة فحص الجودة</span>
              <span className="font-bold text-blue-400 font-mono text-sm">{system.qaReport.overallScore} / 100</span>
            </div>
          </div>

          {/* Generated Sheets Preview */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>أوراق العمل والملفات المتاحة بالتصدير الآن (15 ورقة):</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { name: '01_الرئيسية', count: 'بطاقة النظام' },
                { name: '02_الفهرس', count: 'روابط ورواميز' },
                { name: '05_الهيكل_التنظيمي', count: `${system.orgStructure.sectors.length} قطاعات` },
                { name: '06_قاموس_المصطلحات', count: `${system.dictionary.length} مصطلحات` },
                { name: '07_البيانات_الأساسية', count: `${system.hrEmployees.length} سجلات` },
                { name: '08_العمليات_SOP', count: `${system.sopLibrary.length} إجراءات` },
                { name: '09_المعادلات_والنسب', count: `${system.formulas.length} معادلات` },
                { name: '10_سجل_المخاطر', count: `${system.riskRegister.length} مخاطر` },
                { name: '11_مؤشرات_الأداء', count: `${system.kpiList.length} مؤشرات` },
                { name: '12_الحوكمة_والصلاحيات', count: 'مصفوفة DOA' },
                { name: '14_قاموس_البيانات', count: 'Data Dict' },
                { name: '15_دليل_المستخدم', count: 'كتالوج التشغيل' }
              ].map((sh, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-lg flex items-center justify-between">
                  <span className="font-mono text-emerald-300 font-bold truncate">{sh.name}</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">{sh.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target File Formats */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-white block text-xs">الحزمة التصديرية المؤسسية ZIP (12 مجلداً)</span>
                <span className="text-[10px] text-slate-400">تحتوي على XLSX, DOCX, PDF, PPTX, CSV, JSON والأدلة التنفيذية</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-lg">
              جاهزة 100%
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            إغلاق
          </button>
          <button
            onClick={onConfirmOpenWorkspace}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
          >
            <span>فتح مساحة العمل والمعاينة الفاعلة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
