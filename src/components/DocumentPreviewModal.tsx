import React, { useState } from 'react';
import { X, FileSpreadsheet, FileText, Download, ZoomIn, ZoomOut, ChevronRight, ChevronLeft, RefreshCw, FolderArchive } from 'lucide-react';
import { InstitutionalSystem } from '../types/institutional';
import { downloadSingleFormat } from '../services/exportService';

interface DocumentPreviewModalProps {
  system: InstitutionalSystem;
  onClose: () => void;
  onRegenerateRequest?: (prompt: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ system, onClose, onRegenerateRequest }) => {
  const [format, setFormat] = useState<'XLSX' | 'DOCX' | 'PDF' | 'PPTX'>('XLSX');
  const [activeSheet, setActiveSheet] = useState('01_ExecutiveOverview');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const sheets = [
    '01_ExecutiveOverview',
    '02_OrgStructure',
    '03_Terminology',
    '04_HRPayroll',
    '05_SOPLibrary',
    '06_RiskRegister',
    '07_FormulasCalculations',
    '08_KPIsDashboard'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 dir-rtl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>معاينة المستند المباشرة المتقدمة (Document Preview Engine)</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                  {system.projectDefinition.projectName}
                </span>
              </h2>
              <p className="text-xs text-slate-400">معاينة التنسيق الحقيقي والجدول والصيغ قبل التصدير والتحميل النهائي</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              onClick={() => downloadSingleFormat(system, format)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>تحميل {format}</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 border-b border-slate-800 text-xs">
          
          {/* Format Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['XLSX', 'DOCX', 'PDF', 'PPTX'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  format === fmt
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Zoom and Page Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                className="p-1 text-slate-400 hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-white px-2 text-[11px]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                className="p-1 text-slate-400 hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 text-slate-300">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="p-0.5 text-slate-400 hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs">صفحة {currentPage} من 15</span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-0.5 text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Preview Canvas Area */}
        <div className="flex-1 bg-slate-950 overflow-auto p-6 flex justify-center items-start">
          <div
            className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            
            {/* XLSX Preview */}
            {format === 'XLSX' && (
              <div className="space-y-4">
                {/* Excel Tabs Header */}
                <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-800 pb-2">
                  {sheets.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSheet(s)}
                      className={`px-3 py-1.5 rounded-t-lg text-xs font-mono font-bold transition whitespace-nowrap ${
                        activeSheet === s
                          ? 'bg-emerald-600 text-white border-t-2 border-emerald-400'
                          : 'bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Simulated Sheet Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-amber-400">ورقة العمل: {activeSheet}</span>
                    <span className="font-mono">صيغ Excel النشطة: SUMIFS, XLOOKUP, IF</span>
                  </div>

                  <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-xl">
                    <table className="w-full text-xs text-right text-slate-300">
                      <thead className="bg-slate-900 text-amber-300 border-b border-slate-800 font-bold">
                        <tr>
                          <th className="p-3 border-l border-slate-800 font-mono">A (الكود)</th>
                          <th className="p-3 border-l border-slate-800">B (العنصر/الوصف)</th>
                          <th className="p-3 border-l border-slate-800">C (الإدارة/المنفذ)</th>
                          <th className="p-3 border-l border-slate-800 font-mono">D (القيمة/الصيغة)</th>
                          <th className="p-3">E (الحالة)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {system.hrEmployees.slice(0, 5).map((emp, i) => (
                          <tr key={i} className="hover:bg-slate-800/40 font-mono">
                            <td className="p-3 border-l border-slate-800 text-amber-400 font-bold">{emp.empCode}</td>
                            <td className="p-3 border-l border-slate-800 text-white font-sans">{emp.fullName}</td>
                            <td className="p-3 border-l border-slate-800 font-sans">{emp.jobTitle}</td>
                            <td className="p-3 border-l border-slate-800 text-emerald-400 font-bold">=SUM({emp.basicSalary}+{emp.housingAllowance})</td>
                            <td className="p-3 text-emerald-300 font-sans">{emp.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* DOCX / PDF Preview */}
            {(format === 'DOCX' || format === 'PDF') && (
              <div className="space-y-6 text-slate-200">
                
                {/* Document Header */}
                <div className="border-b-2 border-amber-500 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-white">{system.projectDefinition.projectName}</h3>
                    <p className="text-xs text-slate-400">دليل الحوكمة والسياسات والإجراءات التوثيقي المعتمَد</p>
                  </div>
                  <div className="text-left font-mono text-xs text-slate-400">
                    <div>كود المشروع: {system.uid}</div>
                    <div>تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="space-y-4 text-xs leading-relaxed">
                  <h4 className="font-bold text-amber-400 text-sm border-r-4 border-amber-400 pr-2">
                    الفصل الأول: الملخص التنفيذي ومبادئ الحوكمة
                  </h4>
                  <p className="text-slate-300">
                    {system.executiveSummary.overview}
                  </p>

                  <h4 className="font-bold text-amber-400 text-sm border-r-4 border-amber-400 pr-2 pt-2">
                    الفصل الثاني: مصفوفة تفويض الصلاحيات (Authority Matrix)
                  </h4>
                  <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
                    <table className="w-full text-xs text-right text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">العملية الإدارية</th>
                          <th className="p-2.5">مجلس الإدارة</th>
                          <th className="p-2.5">الرئيس التنفيذي</th>
                          <th className="p-2.5">مدير الإدارة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {system.authorityMatrix.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 text-white font-bold">{item.processName}</td>
                            <td className="p-2.5 text-amber-300">{item.boardAuthority}</td>
                            <td className="p-2.5 text-emerald-400">{item.ceoAuthority}</td>
                            <td className="p-2.5 text-slate-400">{item.deptHeadAuthority}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* PPTX Preview */}
            {format === 'PPTX' && (
              <div className="space-y-4">
                <div className="aspect-[16/9] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-8 flex flex-col justify-between shadow-2xl relative">
                  <div className="space-y-2">
                    <span className="text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                      العرض التنفيذي لمجلس الإدارة - شريحة رقم {currentPage}
                    </span>
                    <h3 className="text-xl font-extrabold text-white pt-2">{system.projectDefinition.projectName}</h3>
                    <p className="text-xs text-slate-400">{system.executiveSummary.overview}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 block">إجمالي القوى العاملة</span>
                      <span className="text-lg font-bold text-amber-300 font-mono">{system.orgStructure.totalEmployeesCount} موظف</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 block">علامة فحص الجودة</span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">{system.qaReport.overallScore} / 100</span>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 block">مبادئ الحوكمة</span>
                      <span className="text-lg font-bold text-blue-400 font-mono">{system.governancePrinciples.length} مبدأ</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
