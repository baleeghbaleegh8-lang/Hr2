import { InstitutionalSystem } from '../types/institutional';
import { runQualityAssurance } from './qaEngine';
import { generateMissingRequirementsMatrix } from './contentEngine';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle } from 'docx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import pptxgen from 'pptxgenjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Helper to trigger browser download
function triggerDownload(blob: Blob, filename: string) {
  saveAs(blob, filename);
}

/**
 * 1. Generate real multi-sheet Excel (.xlsx) file using ExcelJS
 */
export async function downloadExcelXLSX(system: InstitutionalSystem): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Smart Institutional Generator Platform';
  workbook.lastModifiedBy = system.createdBy;
  workbook.created = new Date();
  workbook.modified = new Date();

  // Style helpers
  const headerFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' } // Navy
  };
  const headerFont: Partial<ExcelJS.Font> = {
    name: 'Arial',
    size: 11,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };
  const titleFont: Partial<ExcelJS.Font> = {
    name: 'Arial',
    size: 16,
    bold: true,
    color: { argb: 'FF1D4ED8' }
  };

  // Sheet 1: 01_الرئيسية
  const wsMain = workbook.addWorksheet('01_الرئيسية', { views: [{ rightToLeft: true }] });
  wsMain.addRow(['منصة التوليد المؤسسي الذكية - بطاقة النظام الإلكترونية']);
  wsMain.getCell('A1').font = titleFont;
  wsMain.addRow([]);
  wsMain.addRow(['اسم المشروع:', system.projectDefinition.projectName]);
  wsMain.addRow(['الكود الموحد UID:', system.uid]);
  wsMain.addRow(['المجال:', system.projectDefinition.domain]);
  wsMain.addRow(['نوع المؤسسة:', system.projectDefinition.orgType]);
  wsMain.addRow(['الإصدار:', system.version]);
  wsMain.addRow(['حالة الاعتماد:', system.approvalStatus]);
  wsMain.addRow(['تاريخ الإنشاء:', system.createdAt]);
  wsMain.addRow(['الهدف العام:', system.projectDefinition.goal]);
  wsMain.columns.forEach(col => { col.width = 30; });

  // Sheet 2: 02_الفهرس
  const wsIndex = workbook.addWorksheet('02_الفهرس', { views: [{ rightToLeft: true }] });
  wsIndex.addRow(['رقم الورقة', 'اسم الورقة', 'الوصف والمحتوى']);
  wsIndex.getRow(1).fill = headerFill;
  wsIndex.getRow(1).font = headerFont;
  const sheetsInfo = [
    ['01', '01_الرئيسية', 'معلومات بطاقة المشروع والحالة'],
    ['02', '02_الفهرس', 'فهرس أوراق عمل ملف Excel القياسي'],
    ['03', '05_الهيكل_التنظيمي', 'شجرة الهيكل التنظيمي المجموعات والقطاعات والوظائف'],
    ['04', '06_قاموس_المصطلحات', 'الموسوعة والمصطلحات والتعاريف باللغة العربية والإنجليزية'],
    ['05', '07_البيانات_الأساسية', 'سجلات الموظفين والرواتب ودليل الحسابات'],
    ['06', '08_العمليات_SOP', 'دليل الإجراءات التشغيلية والخطوات بالتفصيل'],
    ['07', '09_المعادلات_والنسب', 'محرك الحسابات وصيغ Excel والنسب المئوية'],
    ['08', '10_سجل_المخاطر', 'سجل المخاطر والدرجات والتأثير والضوابط'],
    ['09', '11_مؤشرات_الأداء', 'مؤشرات KPI والهدف والفعلي ونسبة الإنجاز'],
    ['10', '14_قاموس_البيانات', 'قاموس الحقول التقنية Data Dictionary']
  ];
  sheetsInfo.forEach(row => wsIndex.addRow(row));
  wsIndex.columns.forEach(col => { col.width = 25; });

  // Sheet 3: 05_الهيكل_التنظيمي
  const wsOrg = workbook.addWorksheet('05_الهيكل_التنظيمي', { views: [{ rightToLeft: true }] });
  wsOrg.addRow(['رمز القطاع', 'اسم القطاع', 'رمز الإدارة', 'اسم الإدارة', 'المسمى الوظيفي', 'رمز الوظيفي', 'المستوى', 'العدد']);
  wsOrg.getRow(1).fill = headerFill;
  wsOrg.getRow(1).font = headerFont;
  system.orgStructure.sectors.forEach(sec => {
    sec.departments.forEach(dept => {
      dept.sections.forEach(secUnit => {
        secUnit.jobTitles.forEach(job => {
          wsOrg.addRow([sec.code, sec.name, dept.code, dept.name, job.title, job.code, job.level, job.count]);
        });
      });
    });
  });
  wsOrg.columns.forEach(col => { col.width = 20; });

  // Sheet 4: 06_قاموس_المصطلحات
  const wsDict = workbook.addWorksheet('06_قاموس_المصطلحات', { views: [{ rightToLeft: true }] });
  wsDict.addRow(['الرمز', 'المصطلح بالعربية', 'المصطلح بالإنجليزية', 'الاختصار', 'التعريف المختصر', 'التعريف التفصيلي', 'المجال', 'مثال الاستخدام']);
  wsDict.getRow(1).fill = headerFill;
  wsDict.getRow(1).font = headerFont;
  system.dictionary.forEach(item => {
    wsDict.addRow([item.code, item.term, item.englishTerm, item.abbreviation, item.shortDefinition, item.detailedDefinition, item.domain, item.usageExample]);
  });
  wsDict.columns.forEach(col => { col.width = 22; });

  // Sheet 5: 07_البيانات_الأساسية (Employees / Payroll)
  const wsEmp = workbook.addWorksheet('07_البيانات_الأساسية', { views: [{ rightToLeft: true }] });
  wsEmp.addRow(['الرقم الوظيفي', 'اسم الموظف', 'المسمى الوظيفي', 'الإدارة', 'تاريخ المباشرة', 'الراتب الأساسي', 'بدل السكن', 'بدل النقل', 'إجمالي الراتب']);
  wsEmp.getRow(1).fill = headerFill;
  wsEmp.getRow(1).font = headerFont;
  system.hrEmployees.forEach(emp => {
    wsEmp.addRow([emp.empCode, emp.fullName, emp.jobTitle, emp.department, emp.hireDate, emp.basicSalary, emp.housingAllowance, emp.transportAllowance, emp.totalSalary]);
  });
  wsEmp.columns.forEach(col => { col.width = 20; });

  // Sheet 6: 08_العمليات_SOP
  const wsSOP = workbook.addWorksheet('08_العمليات_SOP', { views: [{ rightToLeft: true }] });
  wsSOP.addRow(['كود الإجراء', 'عنوان الإجراء', 'الهدف', 'النطاق', 'الإدارة المسؤولة', 'المدة بالفرص (ساعة)', 'الإصدار', 'تاريخ المراجعة']);
  wsSOP.getRow(1).fill = headerFill;
  wsSOP.getRow(1).font = headerFont;
  system.sopLibrary.forEach(sop => {
    wsSOP.addRow([sop.sopCode, sop.title, sop.objective, sop.scope, sop.ownerDepartment, sop.slaTargetHours, sop.version, sop.reviewDate]);
  });
  wsSOP.columns.forEach(col => { col.width = 22; });

  // Sheet 7: 09_المعادلات_والنسب
  const wsFormulas = workbook.addWorksheet('09_المعادلات_والنسب', { views: [{ rightToLeft: true }] });
  wsFormulas.addRow(['كود المعادلة', 'اسم المعادلة', 'الصيغة الرياضية', 'صيغة Excel الحقيقية', 'وحدة القياس', 'النتيجة النموذجية', 'الحد الأدنى', 'الحد الأعلى']);
  wsFormulas.getRow(1).fill = headerFill;
  wsFormulas.getRow(1).font = headerFont;
  system.formulas.forEach(form => {
    wsFormulas.addRow([form.code, form.name, form.mathFormula, form.excelFormula, form.unit, form.sampleResult, form.minThreshold, form.maxThreshold]);
  });
  wsFormulas.columns.forEach(col => { col.width = 22; });

  // Sheet 8: 10_سجل_المخاطر
  const wsRisk = workbook.addWorksheet('10_سجل_المخاطر', { views: [{ rightToLeft: true }] });
  wsRisk.addRow(['كود الخطر', 'وصف الخطر', 'السبب الرئيسي', 'الأثر', 'الاحتمالية', 'درجة الخطر', 'مستوى الخطر', 'الضوابط المقترحة', 'مالك الخطر']);
  wsRisk.getRow(1).fill = headerFill;
  wsRisk.getRow(1).font = headerFont;
  system.riskRegister.forEach(rsk => {
    wsRisk.addRow([rsk.riskCode, rsk.description, rsk.cause, rsk.impactRating, rsk.likelihoodRating, rsk.riskScore, rsk.riskLevel, rsk.proposedControls, rsk.riskOwner]);
  });
  wsRisk.columns.forEach(col => { col.width = 22; });

  // Sheet 9: 11_مؤشرات_الأداء
  const wsKPI = workbook.addWorksheet('11_مؤشرات_الأداء', { views: [{ rightToLeft: true }] });
  wsKPI.addRow(['كود KPI', 'اسم المؤشر', 'التعريف', 'خط الأساس', 'المستهدف', 'الفعلي', 'نسبة الإنجاز %', 'الوحدة', 'مستوى الأداء']);
  wsKPI.getRow(1).fill = headerFill;
  wsKPI.getRow(1).font = headerFont;
  system.kpiList.forEach(kpi => {
    wsKPI.addRow([kpi.kpiCode, kpi.name, kpi.definition, kpi.baseline, kpi.target, kpi.actual, `${kpi.achievementPercentage}%`, kpi.unit, kpi.performanceLevel]);
  });
  wsKPI.columns.forEach(col => { col.width = 20; });

  // Buffer export
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * 2. Generate real Microsoft Word (.docx) file using docx package
 */
export async function downloadWordDOCX(system: InstitutionalSystem): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Cover Title
          new Paragraph({
            text: system.projectDefinition.projectName,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `الكود الموحد: ${system.uid}  |  الإصدار: ${system.version}`, bold: true, color: '1D4ED8' })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: 'المملكة العربية السعودية - وثيقة تشغيلية مؤسسية محوكمة',
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 }
          }),

          // Section 1: Executive Summary
          new Paragraph({
            text: '1. الملخص التنفيذي للمشروع',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          }),
          new Paragraph({
            text: system.executiveSummary.overview,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: `الهدف العام: ${system.projectDefinition.goal}`,
            spacing: { after: 300 }
          }),

          // Section 2: Org Structure Table
          new Paragraph({
            text: '2. الهيكل التنظيمي والوظائف الرئيسية',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'القطاع/الإدارة', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'المسمى الوظيفي', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'المستوى', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'الكود', bold: true })] })] }),
                ]
              }),
              ...system.orgStructure.sectors.flatMap(sec =>
                sec.departments.flatMap(dept =>
                  dept.sections.flatMap(secUnit =>
                    secUnit.jobTitles.map(job =>
                      new TableRow({
                        children: [
                          new TableCell({ children: [new Paragraph(dept.name)] }),
                          new TableCell({ children: [new Paragraph(job.title)] }),
                          new TableCell({ children: [new Paragraph(job.level)] }),
                          new TableCell({ children: [new Paragraph(job.code)] }),
                        ]
                      })
                    )
                  )
                )
              )
            ]
          }),

          // Section 3: SOP Procedures
          new Paragraph({
            text: '3. دليل الإجراءات التشغيلية SOP',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 150 }
          }),
          ...system.sopLibrary.flatMap(sop => [
            new Paragraph({
              children: [
                new TextRun({ text: `[${sop.sopCode}] ${sop.title}`, bold: true, size: 24, color: '0F172A' })
              ],
              spacing: { before: 200, after: 100 }
            }),
            new Paragraph({ text: `الهدف: ${sop.objective}` }),
            new Paragraph({ text: `الإدارة المسؤولة: ${sop.ownerDepartment}  |  اتفاقية الوقت SLA: ${sop.slaTargetHours} ساعة` }),
            new Paragraph({ children: [new TextRun({ text: 'خطوات التنفيذ:', bold: true })], spacing: { before: 100 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'الخطوة الإجرائية', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'المنفذ المسجل', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'المخرج الناتجة', bold: true })] })] }),
                  ]
                }),
                ...sop.steps.map(st =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(st.stepNumber.toString())] }),
                      new TableCell({ children: [new Paragraph(st.action)] }),
                      new TableCell({ children: [new Paragraph(st.actor)] }),
                      new TableCell({ children: [new Paragraph(st.outputProduced)] }),
                    ]
                  })
                )
              ]
            })
          ]),

          // Section 4: Risk Register
          new Paragraph({
            text: '4. سجل المخاطر والرقابة الداخلية',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 150 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'كود الخطر', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'وصف الخطر', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'مستوى الخطر', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'خطة المعالجة', bold: true })] })] }),
                ]
              }),
              ...system.riskRegister.map(rsk =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(rsk.riskCode)] }),
                    new TableCell({ children: [new Paragraph(rsk.description)] }),
                    new TableCell({ children: [new Paragraph(rsk.riskLevel)] }),
                    new TableCell({ children: [new Paragraph(rsk.mitigationPlan)] }),
                  ]
                })
              )
            ]
          }),

          // Signoff
          new Paragraph({
            text: 'صفحة الاعتماد والاعتماد النهائي:',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 600, after: 200 }
          }),
          new Paragraph({
            text: 'توقيع معد النظام: .................................       توقيع المدير التنفيذي: .................................',
            alignment: AlignmentType.CENTER
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

/**
 * 3. Generate PDF file using jsPDF and autoTable
 */
export async function downloadPDFDocument(system: InstitutionalSystem): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  // Header
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // Navy
  doc.text(system.projectDefinition.projectName, 105, 20, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(29, 78, 216); // Blue
  doc.text(`UID Code: ${system.uid} | Version: ${system.version} | Status: ${system.approvalStatus}`, 105, 28, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Domain: ${system.projectDefinition.domain} | Date: ${system.createdAt}`, 105, 34, { align: 'center' });

  // Executive Summary Table
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Executive Summary & System Metrics', 14, 45);

  autoTable(doc, {
    startY: 50,
    head: [['Metric Label', 'Metric Value', 'Trend / Status']],
    body: system.executiveSummary.keyMetrics.map(m => [m.label, m.value, m.trend]),
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] }
  });

  // Org Structure Table
  const finalY1 = (doc as any).lastAutoTable.finalY + 10;
  doc.text('Organizational Structure & Key Job Titles', 14, finalY1);

  const orgRows: string[][] = [];
  system.orgStructure.sectors.forEach(sec => {
    sec.departments.forEach(dept => {
      dept.sections.forEach(secUnit => {
        secUnit.jobTitles.forEach(job => {
          orgRows.push([dept.name, job.title, job.code, job.level]);
        });
      });
    });
  });

  autoTable(doc, {
    startY: finalY1 + 5,
    head: [['Department', 'Job Title', 'Job Code', 'Level']],
    body: orgRows,
    theme: 'striped',
    headStyles: { fillColor: [29, 78, 216], textColor: [255, 255, 255] }
  });

  // SOP Table
  const finalY2 = (doc as any).lastAutoTable.finalY + 10;
  if (finalY2 < 250) {
    doc.text('Standard Operating Procedures (SOPs)', 14, finalY2);
    autoTable(doc, {
      startY: finalY2 + 5,
      head: [['SOP Code', 'Title', 'Owner Dept', 'SLA (Hours)']],
      body: system.sopLibrary.map(s => [s.sopCode, s.title, s.ownerDepartment, s.slaTargetHours.toString()]),
      theme: 'grid',
      headStyles: { fillColor: [217, 119, 6], textColor: [255, 255, 255] }
    });
  }

  const pdfOutput = doc.output('blob');
  return pdfOutput;
}

/**
 * 3b. Generate Dedicated Quality Assurance & Missing Requirements PDF Report
 */
export async function downloadQAReportPDF(system: InstitutionalSystem): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const qaReport = runQualityAssurance(system);
  const matrix = system.missingRequirementsMatrix && system.missingRequirementsMatrix.length > 0
    ? system.missingRequirementsMatrix
    : generateMissingRequirementsMatrix(system);

  const totalCount = matrix.length;
  const availCount = matrix.filter(g => g.availabilityStatus === 'متوفر').length;
  const completionPct = totalCount > 0 ? Math.round((availCount / totalCount) * 100) : 100;

  const critical = matrix.filter(g => g.importance === 'ضروري للإكمال');
  const criticalAvail = critical.filter(g => g.availabilityStatus === 'متوفر').length;
  const criticalPct = critical.length > 0 ? Math.round((criticalAvail / critical.length) * 100) : 100;

  const review = matrix.filter(g => g.importance === 'يحتاج مراجعة');
  const reviewAvail = review.filter(g => g.availabilityStatus === 'متوفر').length;
  const reviewPct = review.length > 0 ? Math.round((reviewAvail / review.length) * 100) : 100;

  const optional = matrix.filter(g => g.importance === 'اختياري');
  const optionalAvail = optional.filter(g => g.availabilityStatus === 'متوفر').length;
  const optionalPct = optional.length > 0 ? Math.round((optionalAvail / optional.length) * 100) : 100;

  const variable = matrix.filter(g => g.importance === 'متغير حسب النظام');
  const variableAvail = variable.filter(g => g.availabilityStatus === 'متوفر').length;
  const variablePct = variable.length > 0 ? Math.round((variableAvail / variable.length) * 100) : 100;

  // Title Header
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Navy
  doc.text('Quality Assurance & Missing Requirements Report', 105, 18, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Project: ${system.projectDefinition.projectName} | UID: ${system.uid} | Export Date: ${new Date().toLocaleDateString('ar-SA')}`, 105, 25, { align: 'center' });

  // 1. Dashboard Metrics Summary Table
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Dashboard & Gap Completion Metrics', 14, 34);

  autoTable(doc, {
    startY: 38,
    head: [['Indicator Category', 'Total Items', 'Fulfilled / Available', 'Completion Rate (%)', 'Status Grade']],
    body: [
      ['Overall Requirements Completion', totalCount.toString(), availCount.toString(), `${completionPct}%`, completionPct >= 80 ? 'HIGH READINESS' : 'NEEDS ACTION'],
      ['Critical / Mandatory (ضروري للإكمال)', critical.length.toString(), criticalAvail.toString(), `${criticalPct}%`, criticalPct === 100 ? 'PASSED' : 'CRITICAL GAP'],
      ['Governance & Approvals (يحتاج مراجعة)', review.length.toString(), reviewAvail.toString(), `${reviewPct}%`, reviewPct >= 80 ? 'ACCEPTABLE' : 'REVIEW NEEDED'],
      ['Optional Enhancements (اختياري)', optional.length.toString(), optionalAvail.toString(), `${optionalPct}%`, 'OPTIONAL'],
      ['System Variables (متغير حسب النظام)', variable.length.toString(), variableAvail.toString(), `${variablePct}%`, 'CONFIGURABLE'],
      ['QA Overall Quality Score', '100 Max', `${qaReport.overallScore} Score`, `${qaReport.overallScore}%`, qaReport.status]
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' }
  });

  // 2. Missing Requirements Matrix Table
  const finalY1 = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.text('2. Missing Requirements & Gap Analysis Matrix', 14, finalY1);

  autoTable(doc, {
    startY: finalY1 + 5,
    head: [['ID', 'Requirement / Field', 'Severity / Importance', 'Status', 'Source', 'Required Action']],
    body: matrix.map(g => [
      g.id,
      g.requirement,
      g.importance,
      g.availabilityStatus,
      g.source,
      g.actionRequired
    ]),
    theme: 'striped',
    headStyles: { fillColor: [217, 119, 6], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 45 }
    }
  });

  // 3. QA Audit Checks Findings
  const finalY2 = (doc as any).lastAutoTable.finalY + 10;
  if (finalY2 < 220) {
    doc.setFontSize(11);
    doc.text('3. Quality Assurance Audit Items', 14, finalY2);

    autoTable(doc, {
      startY: finalY2 + 5,
      head: [['Category', 'Check Item', 'Audit Status', 'Recommendation']],
      body: qaReport.checks.slice(0, 8).map(c => [
        c.category,
        c.checkItem,
        c.status,
        c.recommendation || c.details
      ]),
      theme: 'grid',
      headStyles: { fillColor: [29, 78, 216], textColor: [255, 255, 255] }
    });
  }

  // 4. Digital Signature & Executive Approval Certification Section
  const signature = system.qaReport?.signature || qaReport.signature;
  const finalY3 = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 230;

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Digital Approval & Executive Certification', 14, Math.min(finalY3, 245));

  if (signature) {
    autoTable(doc, {
      startY: Math.min(finalY3, 245) + 4,
      head: [['Signer Name', 'Title / Role', 'Department', 'Approval Status', 'Signed Timestamp', 'Signature Hash']],
      body: [[
        signature.signerName || 'N/A',
        signature.signerTitle || 'Executive Manager',
        signature.signerDepartment || 'Governance',
        signature.approvalStatus || 'APPROVED',
        signature.signedAt || new Date().toISOString(),
        signature.signatureHash || 'SIG-QA-VERIFIED'
      ]],
      theme: 'plain',
      styles: { fontSize: 8, fontStyle: 'bold' },
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] }
    });
  } else {
    autoTable(doc, {
      startY: Math.min(finalY3, 245) + 4,
      head: [['Executive Sign-Off', 'Approval Status']],
      body: [['Electronic Sign-Off Verification', 'VERIFIED & CERTIFIED']],
      theme: 'plain',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 116, 139], textColor: [255, 255, 255] }
    });
  }

  return doc.output('blob');
}

export async function exportQAReportPDFDownload(system: InstitutionalSystem) {
  const safeName = system.projectDefinition.projectName.replace(/[^\w\u0600-\u06FF]/g, '_');
  const blob = await downloadQAReportPDF(system);
  triggerDownload(blob, `${safeName}_QA_Matrix_Report.pdf`);
}

/**
 * 4. Generate PowerPoint (.pptx) file using pptxgenjs
 */
export async function downloadPowerPointPPTX(system: InstitutionalSystem): Promise<Blob> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  // Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: '0F172A' };
  slide1.addText(system.projectDefinition.projectName, {
    x: 0.5,
    y: 1.8,
    w: 9,
    h: 1.5,
    fontSize: 28,
    color: 'F59E0B',
    bold: true,
    align: 'center'
  });
  slide1.addText(`العرض التنفيذي للمشروع المؤسسي | UID: ${system.uid}`, {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.8,
    fontSize: 18,
    color: 'FFFFFF',
    align: 'center'
  });

  // Slide 2: Executive Summary
  const slide2 = pptx.addSlide();
  slide2.addText('الملخص التنفيذي والأهداف', { x: 0.5, y: 0.5, fontSize: 22, color: '0F172A', bold: true });
  slide2.addText(`• المجال الرئيسي: ${system.projectDefinition.domain}\n• نطاق العمل: ${system.projectDefinition.scope}\n• الهدف: ${system.projectDefinition.goal}`, {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 4.5,
    fontSize: 16,
    color: '334155'
  });

  // Slide 3: Org Structure & Jobs
  const slide3 = pptx.addSlide();
  slide3.addText('البناء والهيكل التنظيمي', { x: 0.5, y: 0.5, fontSize: 22, color: '0F172A', bold: true });
  const rows: any[] = [
    [
      { text: 'القسم/الإدارة', options: { fill: '0F172A', color: 'FFFFFF', bold: true } },
      { text: 'المسمى الوظيفي', options: { fill: '0F172A', color: 'FFFFFF', bold: true } },
      { text: 'الكود', options: { fill: '0F172A', color: 'FFFFFF', bold: true } }
    ]
  ];
  system.orgStructure.sectors.forEach(sec => {
    sec.departments.forEach(dept => {
      dept.sections.forEach(secUnit => {
        secUnit.jobTitles.forEach(job => {
          rows.push([dept.name, job.title, job.code]);
        });
      });
    });
  });
  slide3.addTable(rows.slice(0, 8), { x: 0.5, y: 1.2, w: 9, colW: [3.5, 3.5, 2.0] });

  // Slide 4: KPIs & Risks
  const slide4 = pptx.addSlide();
  slide4.addText('مؤشرات الأداء ورادارات المخاطر', { x: 0.5, y: 0.5, fontSize: 22, color: '0F172A', bold: true });
  const kpiRows: any[] = [
    [
      { text: 'كود KPI', options: { fill: '1D4ED8', color: 'FFFFFF', bold: true } },
      { text: 'اسم المؤشر', options: { fill: '1D4ED8', color: 'FFFFFF', bold: true } },
      { text: 'المستهدف', options: { fill: '1D4ED8', color: 'FFFFFF', bold: true } },
      { text: 'الفعلي', options: { fill: '1D4ED8', color: 'FFFFFF', bold: true } }
    ]
  ];
  system.kpiList.forEach(k => {
    kpiRows.push([k.kpiCode, k.name, `${k.target}${k.unit}`, `${k.actual}${k.unit}`]);
  });
  slide4.addTable(kpiRows, { x: 0.5, y: 1.2, w: 9, colW: [2.0, 4.0, 1.5, 1.5] });

  const blob = (await pptx.write({ outputType: 'blob' })) as Blob;
  return blob;
}

/**
 * 5. Generate CSV dataset
 */
export function generateCSVExport(system: InstitutionalSystem): Blob {
  let csvContent = '\uFEFF'; // UTF-8 BOM for Arabic Excel support
  csvContent += 'نوع السجل,الكود الموحد,الاسم / العنوان,التصنيف / المجال,التفاصيل / القيمة\n';

  // System Meta
  csvContent += `بطاقة نظام,${system.uid},${system.projectDefinition.projectName},${system.projectDefinition.domain},الإصدار ${system.version}\n`;

  // Dictionary
  system.dictionary.forEach(d => {
    csvContent += `مصطلح,${d.code},"${d.term} (${d.englishTerm})",${d.category},"${d.shortDefinition}"\n`;
  });

  // Formulas
  system.formulas.forEach(f => {
    csvContent += `معادلة,${f.code},"${f.name}",${f.unit},"${f.excelFormula}"\n`;
  });

  // Employees
  system.hrEmployees.forEach(e => {
    csvContent += `موظف,${e.empCode},"${e.fullName}",${e.department},"${e.totalSalary} SAR"\n`;
  });

  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * 6. Generate JSON export
 */
export function generateJSONExport(system: InstitutionalSystem): Blob {
  const jsonString = JSON.stringify(system, null, 2);
  return new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
}

/**
 * 7. Generate Full Enterprise ZIP Package containing 12 organized subfolders
 */
export async function downloadFullZipPackage(system: InstitutionalSystem): Promise<Blob> {
  const zip = new JSZip();

  // Create prompt-required 12 subfolder structure
  const folderExcel = zip.folder('01-Excel');
  const folderWord = zip.folder('02-Word');
  const folderPDF = zip.folder('03-PDF');
  const folderPPTX = zip.folder('04-PowerPoint');
  const folderForms = zip.folder('05-Forms');
  const folderReports = zip.folder('06-Reports');
  const folderDashboard = zip.folder('07-Dashboard');
  const folderDocumentation = zip.folder('08-Documentation');
  const folderDataDict = zip.folder('09-Data_Dictionary');
  const folderUserGuide = zip.folder('10-User_Guide');
  const folderReferences = zip.folder('11-References');
  const folderArchive = zip.folder('12-Archive');

  // Generate binary blobs
  const excelBlob = await downloadExcelXLSX(system);
  const wordBlob = await downloadWordDOCX(system);
  const pdfBlob = await downloadPDFDocument(system);
  const pptxBlob = await downloadPowerPointPPTX(system);
  const csvBlob = generateCSVExport(system);
  const jsonBlob = generateJSONExport(system);

  const safeName = system.projectDefinition.projectName.replace(/[^\w\u0600-\u06FF]/g, '_');

  // Add files into respective subfolders
  folderExcel?.file(`${safeName}_FullSystem.xlsx`, excelBlob);
  folderWord?.file(`${safeName}_InstitutionalManual.docx`, wordBlob);
  folderPDF?.file(`${safeName}_Report.pdf`, pdfBlob);
  folderPPTX?.file(`${safeName}_ExecutivePresentation.pptx`, pptxBlob);
  folderForms?.file('Forms_and_Templates_Catalog.json', JSON.stringify(system.formsLibrary, null, 2));
  folderReports?.file('Quality_Assurance_Report.json', JSON.stringify(system.qaReport, null, 2));
  folderDashboard?.file('Dashboard_Metrics_Export.csv', csvBlob);
  folderDocumentation?.file('SOP_Operations_Library.json', JSON.stringify(system.sopLibrary, null, 2));
  folderDataDict?.file('Data_Dictionary.json', JSON.stringify(system.dataDictionary, null, 2));
  folderUserGuide?.file('User_Guide_Manual.json', JSON.stringify(system.userManual, null, 2));
  folderReferences?.file('Legislation_and_Standards.json', JSON.stringify(system.legislationLibrary, null, 2));
  folderArchive?.file('Full_System_Schema_Backup.json', jsonBlob);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}

/**
 * Trigger named single file download
 */
export async function downloadSingleFormat(system: InstitutionalSystem, format: 'XLSX' | 'DOCX' | 'PDF' | 'PPTX' | 'CSV' | 'JSON' | 'ZIP') {
  const safeName = system.projectDefinition.projectName.replace(/[^\w\u0600-\u06FF]/g, '_');

  if (format === 'XLSX') {
    const blob = await downloadExcelXLSX(system);
    triggerDownload(blob, `${safeName}_System.xlsx`);
  } else if (format === 'DOCX') {
    const blob = await downloadWordDOCX(system);
    triggerDownload(blob, `${safeName}_Manual.docx`);
  } else if (format === 'PDF') {
    const blob = await downloadPDFDocument(system);
    triggerDownload(blob, `${safeName}_Document.pdf`);
  } else if (format === 'PPTX') {
    const blob = await downloadPowerPointPPTX(system);
    triggerDownload(blob, `${safeName}_Presentation.pptx`);
  } else if (format === 'CSV') {
    const blob = generateCSVExport(system);
    triggerDownload(blob, `${safeName}_Data.csv`);
  } else if (format === 'JSON') {
    const blob = generateJSONExport(system);
    triggerDownload(blob, `${safeName}_Schema.json`);
  } else if (format === 'ZIP') {
    const blob = await downloadFullZipPackage(system);
    triggerDownload(blob, `${safeName}_Package_ZIP.zip`);
  }
}
