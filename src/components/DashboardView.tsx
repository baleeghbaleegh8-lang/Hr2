import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Building2, Users, DollarSign, ShoppingBag, ShieldCheck, Cpu, HardDrive, CheckCircle2, FileText, Layers, RefreshCw, Zap } from 'lucide-react';

interface DashboardViewProps {
  onStartGenerator: (prompt: string) => void;
  onLoadDemo: () => void;
  onOpenImport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartGenerator,
  onLoadDemo,
  onOpenImport
}) => {
  const [userPrompt, setUserPrompt] = useState('');

  const samplePrompts = [
    { title: 'نظام إدارة الموارد البشرية والرواتب الشامل', domain: 'الموارد البشرية', icon: Users, text: 'أنشئ نظاماً مؤسسياً متكاملاً لإدارة الموارد البشرية يتضمن الهيكل التنظيمي، مسير الرواتب، إعداد التأمينات، تقييم KPIs، ونظام حماية الأجور.' },
    { title: 'نظام المشتريات والموردين والعقود الحوكمية', domain: 'المشتريات', icon: ShoppingBag, text: 'أنشئ نظام إدارة المشتريات والعقود والمنافسات ومقارنة العروض وتأهيل الموردين مع مصفوفة الصلاحيات DOA.' },
    { title: 'نظام المالية ودليل الحسابات والموازنات', domain: 'المالية والمحاسبة', icon: DollarSign, text: 'أنشئ نظام الموازنات التقديرية ودليل الحسابات الشامل والمصروفات التشغيلية والتقارير المالية القياسية.' },
    { title: 'إطار الحوكمة والمخاطر والامتثال المؤسسي', domain: 'الحوكمة والرقابة', icon: ShieldCheck, text: 'أنشئ إطار الحوكمة وإدارة المخاطر وسجل الضوابط الداخلية ومصفوفة RACI والامتثال بالأنظمة واللوائح.' },
    { title: 'نظام الإجراءات التشغيلية القياسية SOPs', domain: 'العمليات والجودة', icon: Cpu, text: 'أنشئ مكتبة الإجراءات التشغيلية SOP ودليل العمليات وخطوات التنفيذ واتفاقيات مستوى الخدمة SLAs.' },
    { title: 'نظام إدارة المرافق والخدمات والصيانة', domain: 'المرافق والخدمات', icon: Building2, text: 'أنشئ نظام صيانة المرافق والتشغيل وعقود الصيانة الوقائية وسجل الأصول والطلبات.' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;
    onStartGenerator(userPrompt);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>محرك المعرفة + محرك القوالب + محرك المستندات والحسابات</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          منصة التوليد المؤسسي الذكية الشاملة
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          حوّل أي فكرة أو طلب إداري إلى نظام مؤسسي متكامل يحتوي على 15 ورقة عمل Excel، أدلة Word، عروض PowerPoint، صيغ حسابية، مصفوفات حوكمة، وسجلات مخاطر مع قابليّة التصدير الفوري.
        </p>

        {/* Prompt Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-3 shadow-2xl flex flex-col sm:flex-row gap-3">
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="اكتب وصف النظام أو النطاق المؤسسي المطلوب (مثال: أنشئ نظام إدارة الموارد البشرية والرواتب أو نظام المشتريات)..."
              rows={2}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm p-3 focus:outline-none resize-none"
            />
            <div className="flex sm:flex-col justify-end gap-2 shrink-0">
              <button
                type="submit"
                disabled={!userPrompt.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <span>توليد النظام</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Quick Demo Option */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <span>أو جرب مباشرة:</span>
          <button
            onClick={onLoadDemo}
            className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>المشروع المكتمل جاهز المعاينة (DEMO HR System)</span>
          </button>
          <span>أو</span>
          <button
            onClick={onOpenImport}
            className="text-blue-400 hover:text-blue-300 font-bold underline flex items-center gap-1 bg-blue-950/40 px-3 py-1 rounded-full border border-blue-500/30"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>رفع وحوكمة ملف خارجي (XLSX/CSV)</span>
          </button>
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: '15 ورقة عمل Excel', desc: 'جداول وصيغ رياضية ورسوم بيانية حقيقية', icon: FileText, color: 'text-emerald-400' },
          { title: 'أدلة Word وPPTX', desc: 'وثائق حوكمة وعروض تقديمية تنفيذية', icon: Layers, color: 'text-blue-400' },
          { title: 'محرك الحسابات FORM', desc: 'معادلات حماية الأجور والخدمة والنسب', icon: Zap, color: 'text-amber-400' },
          { title: 'حزمة ZIP الشاملة', desc: 'توليد 12 مجลداً فرعياً منسقاً بالكامل', icon: CheckCircle2, color: 'text-purple-400' },
        ].map((feat, idx) => (
          <div key={idx} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 space-y-1">
            <feat.icon className={`w-5 h-5 ${feat.color}`} />
            <h3 className="text-sm font-bold text-slate-200">{feat.title}</h3>
            <p className="text-xs text-slate-400">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Domain Templates Grid */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>نماذج وقوالب الأنظمة المؤسسية الجاهزة</span>
          </h2>
          <span className="text-xs text-slate-400">اختر نظماً لبدء التحليل الفوري</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {samplePrompts.map((item, index) => {
            const IconComp = item.icon;
            return (
              <div
                key={index}
                onClick={() => onStartGenerator(item.text)}
                className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-amber-500/20 border border-slate-700 group-hover:border-amber-500/40 flex items-center justify-center transition">
                      <IconComp className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                      {item.domain}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.text}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:translate-x-[-4px] transition">
                  <span>توليد وبناء النظام الفوري</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
