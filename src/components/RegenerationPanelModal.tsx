import React, { useState } from 'react';
import { X, RefreshCw, Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { InstitutionalSystem } from '../types/institutional';

interface RegenerationPanelModalProps {
  system: InstitutionalSystem;
  onClose: () => void;
  onApplyAdjustment: (instruction: string) => void;
}

export const RegenerationPanelModal: React.FC<RegenerationPanelModalProps> = ({ system, onClose, onApplyAdjustment }) => {
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);

  const presets = [
    'غيّر الهوية اللونية للنظام إلى نسق الكحلي والذهبي الملكي',
    'أضف قسم استمرارية الأعمال وإدارة الكوارث إلى سجل المخاطر',
    'قم بتعديل إجمالي الموظفين إلى 350 موظفاً وتطوير الهيكل التنظيمي',
    'قم بتطوير حواشٍ تشريعية إضافية واستدلالات من نظام العمل السعودي'
  ];

  const handleApply = () => {
    if (!instruction.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onApplyAdjustment(instruction);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 text-slate-100 dir-rtl shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">إعادة التوليد الجزئي والتحكم بالنطاق</h2>
              <p className="text-xs text-slate-400">تعديل جزء محدد دون إعادة بناء النظام بالكامل</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-slate-300">
              سيقوم محرك التعديل الذكي بتنفيذ التعليمات المحددة مع الحفاظ على أكواد وسجلات البيانات الحالية للمشروع <span className="text-amber-300 font-bold">[{system.projectDefinition.projectName}]</span>.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-300 font-bold">اكتب تعديلك النطاقي المباشر:</label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
              placeholder="مثال: أضف قسم إدارة المخاطر السيبرانية إلى مصفوفة الصلاحيات مع تحديد مسؤوليات مدير تقنية المعلومات..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white placeholder-slate-500 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <span className="block text-slate-400 text-[11px] font-bold">أو اختر من المقترحات التنفيذية الجاهزة:</span>
            <div className="space-y-1">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setInstruction(preset)}
                  className="w-full text-right p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/50 transition truncate text-[11px]"
                >
                  ✨ {preset}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-xs font-bold">
            إلغاء
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>تطبيق التعديل الجزئي</span>
          </button>
        </div>

      </div>
    </div>
  );
};
