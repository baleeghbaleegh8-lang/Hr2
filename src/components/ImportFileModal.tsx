import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { analyzeUploadedFile, ImportAnalysisResult } from '../services/importAnalyzerService';

interface ImportFileModalProps {
  onClose: () => void;
  onImportSuccess: (result: ImportAnalysisResult) => void;
}

export const ImportFileModal: React.FC<ImportFileModalProps> = ({
  onClose,
  onImportSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImportAnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeUploadedFile(selectedFile);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">محرك رفع وإعادة هيكلة وحوكمة الملفات الخارجية</h2>
              <p className="text-xs text-slate-400">استيراد وقراءة واستخراج قاموس البيانات وإصلاح الصيغ والأكواد</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          
          {!analysis ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center space-y-3 cursor-pointer relative bg-slate-950/50">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.json"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileSpreadsheet className="w-12 h-12 text-blue-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <p className="font-bold text-white text-sm">
                    {selectedFile ? selectedFile.name : 'سحب وإسقاط ملف Excel / CSV / JSON هنا'}
                  </p>
                  <p className="text-slate-400 text-xs">يدعم ملفات .xlsx, .xls, .csv, .json حتى حجم 50MB</p>
                </div>
              </div>

              {selectedFile && (
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري فحص وتفكيك ورسومات أوراق العمل...</span>
                    </>
                  ) : (
                    <>
                      <span>بدء تحليل الملف وإعادة الهيكلة</span>
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{analysis.fileName}</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded font-mono font-bold">
                    علامة الجودة: {analysis.dataQualityScore}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-slate-400">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="block text-[10px] text-slate-500">أوراق العمل</span>
                    <span className="font-bold text-white">{analysis.detectedSheetsCount}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="block text-[10px] text-slate-500">إجمالي الأسطر</span>
                    <span className="font-bold text-white">{analysis.totalRowsCount}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="block text-[10px] text-slate-500">قاموس الحقول</span>
                    <span className="font-bold text-amber-300">{analysis.extractedDictionaryCount} حقل</span>
                  </div>
                </div>

                {analysis.issuesList.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-amber-400 text-[11px]">ملاحظات الفحص التلقائي:</span>
                    {analysis.issuesList.map((iss, idx) => (
                      <p key={idx} className="text-slate-400 text-[11px]">• {iss}</p>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onImportSuccess(analysis)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد وبناء النظام المؤسسي من الملف المرفوع</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
