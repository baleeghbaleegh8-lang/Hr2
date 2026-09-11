import React, { useState } from 'react';
import { X, Sparkles, Sliders, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { ProjectDefinition, ScopeComplexity } from '../types/institutional';

interface AnalysisWizardModalProps {
  initialPrompt: string;
  onClose: () => void;
  onConfirmGenerate: (prompt: string, overrides: Partial<ProjectDefinition>) => void;
}

export const AnalysisWizardModal: React.FC<AnalysisWizardModalProps> = ({
  initialPrompt,
  onClose,
  onConfirmGenerate
}) => {
  const [promptText, setPromptText] = useState(initialPrompt);
  const [domain, setDomain] = useState('الموارد البشرية ورأس المال البشري');
  const [complexity, setComplexity] = useState<ScopeComplexity>('مؤسسي شامل');
  const [orgType, setOrgType] = useState('شركة مساهمة / قطاع خاص');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      onConfirmGenerate(promptText, {
        domain,
        complexity,
        orgType
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">محرك تحليل المكونات والمتطلبات المؤسسية</h2>
              <p className="text-xs text-slate-400">تحليل المكونات وتحديد النطاق قبل توليد الحزمة الكاملة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm text-slate-200">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-amber-300">وصف الطلب أو اسم النظام المؤسسي</label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">المجال القطاعي الرئيسي</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="الموارد البشرية ورأس المال البشري">الموارد البشرية ورأس المال البشري</option>
                <option value="إدارة المشتريات والعقود والموردين">إدارة المشتريات والعقود والموردين</option>
                <option value="الأنظمة المالية والمحاسبية والموازنات">الأنظمة المالية والمحاسبية والموازنات</option>
                <option value="إطار الحوكمة وإدارة المخاطر والامتثال">إطار الحوكمة وإدارة المخاطر والامتثال</option>
                <option value="إدارة العمليات والإجراءات التشغيلية SOP">إدارة العمليات والإجراءات التشغيلية SOP</option>
                <option value="إدارة المرافق والخدمات والتشغيل">إدارة المرافق والخدمات والتشغيل</option>
                <option value="إدارة المشاريع ومتابعة الإنجاز PMO">إدارة المشاريع ومتابعة الإنجاز PMO</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">عمق ومستوى التعقيد</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as ScopeComplexity)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="أساسي">أساسي (جداول رئيسية)</option>
                <option value="متقدم">متقدم (معادلات وهيكل)</option>
                <option value="مؤسسي شامل">مؤسسي شامل (15 ورقة عمل + حوكمة)</option>
                <option value="موسوعي">موسوعي (دليل كامل + حزمة ZIP)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2 text-xs text-slate-300">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>العناصر والأوراق التي سيتم توليدها تلقائياً:</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
              <div>• الهيكل التنظيمي والشجرة الوظيفية</div>
              <div>• قاموس المصطلحات والموسوعة</div>
              <div>• دليل الإجراءات التشغيلية SOPs</div>
              <div>• محرك المعادلات وصيغ Excel</div>
              <div>• سجل المخاطر والمشكلات الحرج</div>
              <div>• لوحة مؤشرات الأداء KPIs</div>
              <div>• مصفوفة الحوكمة للصلاحيات DOA</div>
              <div>• حزمة الملفات (XLSX, DOCX, ZIP)</div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري البناء والتوليد...</span>
                </>
              ) : (
                <>
                  <span>بدء توليد وتصميم النظام</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
