import React, { useState } from 'react';
import { X, LayoutTemplate, Palette, Plus, Check } from 'lucide-react';
import { templateEngine } from '../services/templateEngine';

interface TemplateBuilderModalProps {
  onClose: () => void;
  onTemplateCreated?: () => void;
}

export const TemplateBuilderModal: React.FC<TemplateBuilderModalProps> = ({ onClose, onTemplateCreated }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'الموارد البشرية' | 'الحوكمة والمخاطر' | 'المالية والمشتريات' | 'العمليات والجودة' | 'تخصصي'>('الموارد البشرية');
  const [themeColor, setThemeColor] = useState('#d97706');
  const [pageSize, setPageSize] = useState<'A4' | 'Letter'>('A4');
  const [orientation, setOrientation] = useState<'عمودي' | 'أفقي'>('عمودي');
  const [description, setDescription] = useState('');
  const [sectionsText, setSectionsText] = useState('الهيكل التنظيمي، سجل الرواتب، مصفوفة الصلاحيات، مؤشرات الأداء');

  const handleSave = () => {
    if (!name.trim()) return;

    templateEngine.addCustomTemplate({
      name,
      category,
      version: '1.0',
      language: 'العربية',
      pageSize,
      orientation,
      themeColor,
      description: description || 'قالب ديناميكي مخصص ومحفوظ مسبقاً',
      defaultSections: sectionsText.split('،').map(s => s.trim()).filter(Boolean),
      outputTypes: ['XLSX', 'DOCX', 'PDF', 'PPTX', 'ZIP']
    });

    if (onTemplateCreated) onTemplateCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 text-slate-100 dir-rtl shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">منشئ القوالب المؤسسية الديناميكية</h2>
              <p className="text-xs text-slate-400">تصميم وتأطير قالب مخصص مسبقاً لاستخدامه عبر كافة المشاريع</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block text-slate-300 font-bold">اسم القالب المؤسسي المعتمَد</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: قالب التقارير المالية والتحليل الربع سنوي"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-slate-300 font-bold">التصنيف الرئيسي</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="الموارد البشرية">الموارد البشرية</option>
                <option value="الحوكمة والمخاطر">الحوكمة والمخاطر</option>
                <option value="المالية والمشتريات">المالية والمشتريات</option>
                <option value="العمليات والجودة">العمليات والجودة</option>
                <option value="تخصصي">تخصصي</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300 font-bold">لون النسق المؤسسي</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-9 h-9 bg-slate-950 border border-slate-800 rounded cursor-pointer"
                />
                <span className="font-mono text-slate-300">{themeColor}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-slate-300 font-bold">حجم الصفحة الطباعية</label>
              <select
                value={pageSize}
                onChange={(e: any) => setPageSize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="A4">A4 القياسي</option>
                <option value="Letter">Letter</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-300 font-bold">الاتجاه</label>
              <select
                value={orientation}
                onChange={(e: any) => setOrientation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="عمودي">عمودي (Portrait)</option>
                <option value="أفقي">أفقي (Landscape)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-300 font-bold">الأقسام والوحدات الافتراضية (مفصولة بفواصل)</label>
            <input
              type="text"
              value={sectionsText}
              onChange={(e) => setSectionsText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-300 font-bold">وصف القالب والغرض التشغيلي</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="اكتب وصفاً موجزاً لنطاق القالب واستخداماته..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white placeholder-slate-500 resize-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-xs font-bold">
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
          >
            <Check className="w-4 h-4" />
            <span>حفظ القالب المؤسسي</span>
          </button>
        </div>

      </div>
    </div>
  );
};
