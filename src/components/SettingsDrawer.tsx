import React from 'react';
import { X, Building2, Palette, DollarSign, Check } from 'lucide-react';

interface SettingsDrawerProps {
  onClose: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-r border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 text-slate-200">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">إعدادات المنصة والهوية المؤسسية</h2>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block text-slate-400 font-bold">اسم المجموعة / الشركة المعتمَد</label>
              <input
                type="text"
                defaultValue="المجموعة المؤسسية القابضة"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400 font-bold">النسق والألوان المؤسسية</label>
              <div className="grid grid-cols-3 gap-2">
                <button className="bg-slate-950 border border-amber-500/50 p-2 rounded flex items-center justify-center gap-1.5 text-amber-300 font-bold">
                  <Palette className="w-3.5 h-3.5" />
                  <span>كحلي وذهبي</span>
                </button>
                <button className="bg-slate-950 border border-slate-800 p-2 rounded flex items-center justify-center gap-1.5 text-slate-400">
                  <span>أخضر ملكي</span>
                </button>
                <button className="bg-slate-950 border border-slate-800 p-2 rounded flex items-center justify-center gap-1.5 text-slate-400">
                  <span>رمادي وفضي</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400 font-bold">العملة الرسمية والسنة المالية</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="SAR (ريال سعودي)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white pr-8"
                  />
                  <DollarSign className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
                <input
                  type="text"
                  defaultValue="2026 / 2027"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 text-slate-400">
              <span className="font-bold text-white block">صيغة التصدير التلقائية للحزم</span>
              <p>تفعيل التصدير التلقائي لكافة صيغ (Excel, Word, PDF, PPTX, ZIP) مع محرك الحسابات المدمج.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>

      </div>
    </div>
  );
};
