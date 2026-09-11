import React from 'react';
import { Layers, ShieldCheck, Download, Sparkles, Settings, FileSpreadsheet, FolderArchive, RefreshCw, Upload, Terminal, LayoutTemplate, Eye, Wand2 } from 'lucide-react';
import { InstitutionalSystem } from '../types/institutional';
import { downloadSingleFormat } from '../services/exportService';

interface HeaderNavProps {
  activeSystem: InstitutionalSystem | null;
  onOpenSettings: () => void;
  onOpenImport: () => void;
  onLoadDemo: () => void;
  onNewSystem: () => void;
  onOpenDeveloperConsole: () => void;
  onOpenTemplateBuilder: () => void;
  onOpenDocumentPreview?: () => void;
  onOpenRegenerationPanel?: () => void;
  onOpenQAModal?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeSystem,
  onOpenSettings,
  onOpenImport,
  onLoadDemo,
  onNewSystem,
  onOpenDeveloperConsole,
  onOpenTemplateBuilder,
  onOpenDocumentPreview,
  onOpenRegenerationPanel,
  onOpenQAModal
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg dir-rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Right Logo & Branding */}
        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer" onClick={onNewSystem}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-900/40 border border-amber-400/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-amber-200 via-white to-blue-200">
                منصة التوليد المؤسسي الذكية
              </h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                Enterprise AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Smart Institutional Generator Platform</p>
          </div>
        </div>

        {/* Center Active System Badge or Quick Actions */}
        {activeSystem ? (
          <div className="hidden md:flex items-center space-x-3 space-x-reverse bg-slate-800/80 border border-slate-700/60 rounded-full px-4 py-1.5 text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium truncate max-w-[180px]">
              {activeSystem.projectDefinition.projectName}
            </span>
            <span className="text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded font-mono text-[11px]">
              {activeSystem.uid}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {activeSystem.approvalStatus}
            </span>
          </div>
        ) : (
          <div className="hidden lg:flex items-center space-x-2 space-x-reverse text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>وضع التوليد الشامل لـ 15 ورقة عمل ومستندات مؤسسية متكاملة</span>
          </div>
        )}

        {/* Left Action Buttons */}
        <div className="flex items-center space-x-2 space-x-reverse">
          
          {/* Developer Console Button */}
          <button
            onClick={onOpenDeveloperConsole}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition"
            title="فتح لوحة التحكم وهندسة النظام الـ 14 طبقة"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">لوحة الهندسة</span>
          </button>

          {/* Template Builder Button */}
          <button
            onClick={onOpenTemplateBuilder}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition"
            title="إنشاء وتطبيق القوالب الديناميكية"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden xl:inline">القوالب</span>
          </button>

          {activeSystem && (
            <div className="flex items-center space-x-1.5 space-x-reverse">
              {onOpenQAModal && (
                <button
                  onClick={onOpenQAModal}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-lg transition"
                  title="فتح تقرير فحص الجودة التلقائي QA Report"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">فحص الجودة QA</span>
                  <span className="font-mono text-[10px] bg-emerald-900/80 px-1 rounded text-emerald-200">
                    {activeSystem.qaReport?.overallScore ?? 100}
                  </span>
                </button>
              )}

              {onOpenDocumentPreview && (
                <button
                  onClick={onOpenDocumentPreview}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
                  title="المعاينة المباشرة للمستندات"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">المعاينة</span>
                </button>
              )}

              {onOpenRegenerationPanel && (
                <button
                  onClick={onOpenRegenerationPanel}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 rounded-lg transition"
                  title="إعادة التوليد الجزئي"
                >
                  <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">تعديل جزئي</span>
                </button>
              )}

              <button
                onClick={() => downloadSingleFormat(activeSystem, 'ZIP')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg shadow-md border border-blue-400/30 transition"
                title="تنزيل الحزمة الكاملة (ZIP)"
              >
                <FolderArchive className="w-3.5 h-3.5 text-amber-300" />
                <span>تنزيل ZIP</span>
              </button>
            </div>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="الإعدادات والهوية"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
