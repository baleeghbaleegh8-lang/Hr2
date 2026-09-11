import { InstitutionalSystem, QualityReport, QACheckResult, FormulaItem, RiskItem, HREmployeeRecord, KPIItem, RACIRow, SOPItem } from '../types/institutional';

/**
 * Quality Assurance Engine (وحدة فحص الجودة التلقائي)
 * Validates formulas, cross-references, data integrity, code uniqueness, 
 * date sequences, and compliance rules across all institutional modules.
 */

export function runQualityAssurance(system: InstitutionalSystem): QualityReport {
  const checks: QACheckResult[] = [];
  let passed = 0;
  let warnings = 0;
  let errors = 0;
  let reviewRequired = 0;

  // -------------------------------------------------------------
  // Category 1: تعريف النطاق وتطابق الهيكل (Project & Scope Definition)
  // -------------------------------------------------------------
  if (system.projectDefinition.projectName && system.projectDefinition.domain && system.projectDefinition.goal) {
    checks.push({
      category: 'تعريف المشروع والنطاق',
      checkItem: 'اكتمال بطاقة تعريف المنظومة والمستهدفات',
      status: 'PASSED',
      details: `مشروع "${system.projectDefinition.projectName}" في قطاع (${system.projectDefinition.sector}) موحد بالكامل.`,
      fixable: false,
      recommendation: 'بيانات تعريفية سليمة ومتسقة.'
    });
    passed++;
  } else {
    checks.push({
      category: 'تعريف المشروع والنطاق',
      checkItem: 'نقص في بيانات تعريف المنظومة',
      status: 'ERROR',
      details: 'يرجى مراجعة اسم المشروع والمجال والهدف الأساسي.',
      fixable: true,
      recommendation: 'تعبئة حقول تعريف المشروع الأساسية تلقائياً.'
    });
    errors++;
  }

  // -------------------------------------------------------------
  // Category 2: فحص المعادلات والصيغ الحسابية (Formulas & Equations)
  // -------------------------------------------------------------
  let invalidExcelPrefixCount = 0;
  let unbalancedParenCount = 0;
  let divByZeroRiskCount = 0;
  let thresholdMismatchCount = 0;
  const badFormulaCodes: string[] = [];

  system.formulas.forEach((f: FormulaItem) => {
    let hasIssue = false;

    // Check Excel prefix '='
    if (!f.excelFormula || !f.excelFormula.trim().startsWith('=')) {
      invalidExcelPrefixCount++;
      hasIssue = true;
    }

    // Check parenthesis balance
    const openParen = (f.excelFormula || '').split('(').length - 1;
    const closeParen = (f.excelFormula || '').split(')').length - 1;
    if (openParen !== closeParen) {
      unbalancedParenCount++;
      hasIssue = true;
    }

    // Check division by zero risk
    if (f.mathFormula.includes('/ 0') || f.mathFormula.includes('/0') || (f.excelFormula && f.excelFormula.includes('/0'))) {
      divByZeroRiskCount++;
      hasIssue = true;
    }

    // Check threshold logic
    if (typeof f.sampleResult === 'number') {
      if (f.sampleResult < f.minThreshold || f.sampleResult > f.maxThreshold) {
        thresholdMismatchCount++;
        hasIssue = true;
      }
    }

    if (hasIssue) {
      badFormulaCodes.push(f.code);
    }
  });

  if (invalidExcelPrefixCount === 0 && unbalancedParenCount === 0 && divByZeroRiskCount === 0 && thresholdMismatchCount === 0 && system.formulas.length > 0) {
    checks.push({
      category: 'المعادلات والحسابات',
      checkItem: 'سلامة صيغ Excel والرموز الرياضية والتوازن',
      status: 'PASSED',
      details: `تم فحص جميع صيغ Excel (${system.formulas.length} معادلة) وتأكيد خلوها من أخطاء بناء التعبير أو مخاطر القسمة على صفر.`,
      fixable: false,
      recommendation: 'جميع المعادلات جاهزة للتصدير والحساب التلقائي.'
    });
    passed++;
  } else {
    if (invalidExcelPrefixCount > 0) {
      checks.push({
        category: 'المعادلات والحسابات',
        checkItem: 'عدم بدء صيغ Excel بعلامة المساواة (=)',
        status: 'WARNING',
        details: `تم رصد ${invalidExcelPrefixCount} معادلة لا تبدأ بـ (=)، مما قد يعطل التنفيذ المباشر في Excel.`,
        fixable: true,
        affectedCodes: badFormulaCodes,
        recommendation: 'إضافة علامة (=) تلقائياً أمام كافة الصيغ المكتوبة.'
      });
      warnings++;
    }

    if (unbalancedParenCount > 0) {
      checks.push({
        category: 'المعادلات والحسابات',
        checkItem: 'عدم اتساق الأقواس في صيغة Excel',
        status: 'ERROR',
        details: `يوجد ${unbalancedParenCount} معادلة تحتوي أقواساً غير متوازنة.`,
        fixable: true,
        affectedCodes: badFormulaCodes,
        recommendation: 'إغلاق الأقواس وتعديل بناء الصيغة.'
      });
      errors++;
    }

    if (divByZeroRiskCount > 0) {
      checks.push({
        category: 'المعادلات والحسابات',
        checkItem: 'مخاطر قسمة على صفر (DIV/0)',
        status: 'WARNING',
        details: `رصد ${divByZeroRiskCount} معادلة تحتمل القسمة على صفر بدون شرط حماية IFERROR.`,
        fixable: true,
        affectedCodes: badFormulaCodes,
        recommendation: 'دعم دالة IFERROR(..., 0) للوقاية من أخطاء القسمة.'
      });
      warnings++;
    }

    if (thresholdMismatchCount > 0) {
      checks.push({
        category: 'المعادلات والحسابات',
        checkItem: 'خروج نتائج العينات عن حدود النطاق المقبول',
        status: 'WARNING',
        details: `رصد ${thresholdMismatchCount} معادلة تقع نتائج عيناتها خارج النطاق الأدنى والأقصى.`,
        fixable: true,
        affectedCodes: badFormulaCodes,
        recommendation: 'تحديث حدود المعايرة أوالعينة لتكون ضمن النطاق المقبول.'
      });
      warnings++;
    }
  }

  // -------------------------------------------------------------
  // Category 3: فحص الروابط والعلاقات التناظرية (Cross-References & Links)
  // -------------------------------------------------------------
  const allKpiCodes = new Set(system.kpiList.map((k: KPIItem) => k.kpiCode));
  const allRiskCodes = new Set(system.riskRegister.map((r: RiskItem) => r.riskCode));
  const allFormCodes = new Set(system.formsLibrary.map(f => f.formCode));
  const allDeptNames = new Set<string>();

  system.orgStructure.sectors.forEach(sec => {
    sec.departments.forEach(dept => {
      allDeptNames.add(dept.name);
    });
  });

  let unlinkedKpiSops = 0;
  let unlinkedRiskSops = 0;
  let unlinkedFormSops = 0;
  let unlinkedHrDepts = 0;
  let unlinkedWorkPlanRisks = 0;

  system.sopLibrary.forEach((sop: SOPItem) => {
    if (sop.kpiCode && !allKpiCodes.has(sop.kpiCode)) {
      unlinkedKpiSops++;
    }
    if (sop.riskCode && !allRiskCodes.has(sop.riskCode)) {
      unlinkedRiskSops++;
    }
    if (sop.associatedForms && sop.associatedForms.length > 0) {
      sop.associatedForms.forEach(fCode => {
        if (!allFormCodes.has(fCode)) unlinkedFormSops++;
      });
    }
  });

  system.hrEmployees.forEach((emp: HREmployeeRecord) => {
    if (allDeptNames.size > 0 && emp.department && !allDeptNames.has(emp.department)) {
      unlinkedHrDepts++;
    }
  });

  system.workPlan.forEach(task => {
    if (task.associatedRisk && !allRiskCodes.has(task.associatedRisk)) {
      unlinkedWorkPlanRisks++;
    }
  });

  const totalUnlinked = unlinkedKpiSops + unlinkedRiskSops + unlinkedFormSops + unlinkedHrDepts + unlinkedWorkPlanRisks;

  if (totalUnlinked === 0) {
    checks.push({
      category: 'الروابط والعلاقات المتبادلة',
      checkItem: 'ربط الإجراءات مع KPIs والمخاطر والنماذج والهيكل',
      status: 'PASSED',
      details: 'جميع الإجراءات التشغيلية والموظفين ومهام خطة العمل مرتبطة بإحكام مع المؤشرات والمخاطر والإدارات المعنية.',
      fixable: false,
      recommendation: 'الروابط كاملة بنسبة 100% بدون أي عنصر يتيم.'
    });
    passed++;
  } else {
    checks.push({
      category: 'الروابط والعلاقات المتبادلة',
      checkItem: 'وجود عناصر غير مرتبطة بالكامل (مؤشرات/مخاطر/نماذج يتيمة)',
      status: 'WARNING',
      details: `تم رصد ${totalUnlinked} ارتباطاً مفقوداً بين الإجراءات والمؤشرات والمخاطر المرجعية والنماذج.`,
      fixable: true,
      recommendation: 'توليد الروابط التلقائية وإحالة الإجراءات إلى المؤشرات والمخاطر المطابقة.'
    });
    warnings++;
  }

  // -------------------------------------------------------------
  // Category 4: فرادة التكويد والتشفير المركزي (Code Uniqueness & Collisions)
  // -------------------------------------------------------------
  const codeTracker = new Map<string, string>(); // code -> module name
  const duplicateCodesList: string[] = [];

  const addAndCheckCode = (code: string, moduleName: string) => {
    if (!code) return;
    if (codeTracker.has(code)) {
      duplicateCodesList.push(`${code} (${moduleName} - مكرر مع ${codeTracker.get(code)})`);
    } else {
      codeTracker.set(code, moduleName);
    }
  };

  system.items.forEach(i => addAndCheckCode(i.uid, 'المصطلحات'));
  system.dictionary.forEach(d => addAndCheckCode(d.code, 'القاموس'));
  system.sopLibrary.forEach(s => addAndCheckCode(s.sopCode, 'الإجراءات SOP'));
  system.riskRegister.forEach(r => addAndCheckCode(r.riskCode, 'المخاطر'));
  system.kpiList.forEach(k => addAndCheckCode(k.kpiCode, 'مؤشرات KPI'));
  system.hrEmployees.forEach(e => addAndCheckCode(e.empCode, 'الموظفين'));
  system.formsLibrary.forEach(f => addAndCheckCode(f.formCode, 'النماذج'));
  system.chartOfAccounts.forEach(c => addAndCheckCode(c.accountCode, 'دليل الحسابات'));
  system.legislationLibrary.forEach(l => addAndCheckCode(l.refCode, 'التشريعات'));
  system.workPlan.forEach(t => addAndCheckCode(t.taskCode, 'خطة العمل'));

  if (duplicateCodesList.length === 0) {
    checks.push({
      category: 'الترميز والتشفير UID',
      checkItem: 'فرادة وعدم تكرار الأكواد والرموز التشغيلية',
      status: 'PASSED',
      details: `تم فحص ${codeTracker.size} كود مرجعي، وجميع الرموز فريدة ومطابقة للدليل القياسي.`,
      fixable: false,
      recommendation: 'الترميز موحد وفريد بامتياز.'
    });
    passed++;
  } else {
    checks.push({
      category: 'الترميز والتشفير UID',
      checkItem: 'رصد تكرار في بعض الأكواد المرجعية',
      status: 'ERROR',
      details: `تم رصد ${duplicateCodesList.length} كوداً مكرراً عبر الوحدات المختلفة.`,
      fixable: true,
      affectedCodes: duplicateCodesList,
      recommendation: 'إعادة الترقيم التلقائي وتطبيق السوابق القياسية (Prefixes).'
    });
    errors++;
  }

  // -------------------------------------------------------------
  // Category 5: سلامة بيانات الموارد البشرية والرواتب (HR & Payroll Data)
  // -------------------------------------------------------------
  let hrSalaryDiscrepancies = 0;
  let hrZeroSalaryCount = 0;

  system.hrEmployees.forEach((emp: HREmployeeRecord) => {
    const calculatedTotal = emp.basicSalary + emp.housingAllowance + emp.transportAllowance;
    if (Math.abs(calculatedTotal - emp.totalSalary) > 1) {
      hrSalaryDiscrepancies++;
    }
    if (emp.basicSalary <= 0 || emp.totalSalary <= 0) {
      hrZeroSalaryCount++;
    }
  });

  if (hrSalaryDiscrepancies === 0 && hrZeroSalaryCount === 0 && system.hrEmployees.length > 0) {
    checks.push({
      category: 'الموارد البشرية والرواتب',
      checkItem: 'دقة واحتساب إجمالي الرواتب والبدلات الأساسية',
      status: 'PASSED',
      details: `سجلات الموظفين (${system.hrEmployees.length} موظف) صحيحة مطابقة للمعادلة (الأساسي + السكن + النقل = الشامل).`,
      fixable: false,
      recommendation: 'سجلات المالية والرواتب مطابقة بنسبة 100%.'
    });
    passed++;
  } else {
    if (hrSalaryDiscrepancies > 0) {
      checks.push({
        category: 'الموارد البشرية والرواتب',
        checkItem: 'عدم تطابق مجموع البدلات مع إجمالي الراتب الشامل',
        status: 'WARNING',
        details: `يوجد ${hrSalaryDiscrepancies} سجل موظف يحتوي فارقاً بين الإجمالي والبدلات التفصيلية.`,
        fixable: true,
        recommendation: 'إعادة إعادة حساب الراتب الشامل تلقائياً.'
      });
      warnings++;
    }
    if (hrZeroSalaryCount > 0) {
      checks.push({
        category: 'الموارد البشرية والرواتب',
        checkItem: 'وجود رواتب صفريّة أو غير مكتملة',
        status: 'WARNING',
        details: `يوجد ${hrZeroSalaryCount} موظف براتب أساسي صفر أو غير مدخل.`,
        fixable: true,
        recommendation: 'تطبيق الحد الأدنى لأجور السلم الوظيفي أو التحديث التلقائي.'
      });
      warnings++;
    }
  }

  // -------------------------------------------------------------
  // Category 6: سجل المخاطر ودقة المصفوفات (Risk Register & Matrix)
  // -------------------------------------------------------------
  let riskScoreMismatches = 0;
  let invalidRiskRatings = 0;

  system.riskRegister.forEach((rsk: RiskItem) => {
    if (rsk.likelihoodRating < 1 || rsk.likelihoodRating > 5 || rsk.impactRating < 1 || rsk.impactRating > 5) {
      invalidRiskRatings++;
    }
    const calcScore = rsk.likelihoodRating * rsk.impactRating;
    if (calcScore !== rsk.riskScore) {
      riskScoreMismatches++;
    }
  });

  if (riskScoreMismatches === 0 && invalidRiskRatings === 0 && system.riskRegister.length > 0) {
    checks.push({
      category: 'سجل المخاطر والرقابة',
      checkItem: 'صحة حساب درجات المخاطر (الاحتمالية × الأثر)',
      status: 'PASSED',
      details: `جميع المخاطر (${system.riskRegister.length} خطر) محسوبة بدقة على مقياس Matrix 5x5.`,
      fixable: false,
      recommendation: 'سجل المخاطر محوكم ودقيق.'
    });
    passed++;
  } else {
    checks.push({
      category: 'سجل المخاطر والرقابة',
      checkItem: 'اختلال في تقييم درجات المخاطر',
      status: 'WARNING',
      details: `تم رصد ${riskScoreMismatches + invalidRiskRatings} خطأ في حساب ناتج الاحتمالية × الأثر.`,
      fixable: true,
      recommendation: 'تعديل درجات ناتج ضرب الاحتمالية والأثر تلقائياً.'
    });
    warnings++;
  }

  // -------------------------------------------------------------
  // Category 7: حوكمة المساءلة RACI ومصفوفة الصلاحيات (RACI & Authorities)
  // -------------------------------------------------------------
  let raciMissingAccountable = 0;
  let raciMissingResponsible = 0;

  system.raciMatrix.forEach((raci: RACIRow) => {
    if (!raci.accountableRole || raci.accountableRole === '-') raciMissingAccountable++;
    if (!raci.responsibleRole || raci.responsibleRole === '-') raciMissingResponsible++;
  });

  if (raciMissingAccountable === 0 && raciMissingResponsible === 0 && system.raciMatrix.length > 0) {
    checks.push({
      category: 'مصفوفة المساءلة RACI والحوكمة',
      checkItem: 'وجود دور المسؤول الأول (A) والمنفذ (R) لكل إجراء',
      status: 'PASSED',
      details: `تمت حوكمة ${system.raciMatrix.length} عملية بنجاح بدون ثغرات تنظيمية.`,
      fixable: false,
      recommendation: 'مصفوفة RACI مكتملة ومحوكمة.'
    });
    passed++;
  } else {
    checks.push({
      category: 'مصفوفة المساءلة RACI والحوكمة',
      checkItem: 'ثغرات في المساءلة التنفيذيةRACIs (نقص A أو R)',
      status: 'WARNING',
      details: `رصد ${raciMissingAccountable + raciMissingResponsible} عملية تفتقر لدور المساءلة المباشر.`,
      fixable: true,
      recommendation: 'تعيين الإدارة الرئيسية كمسؤول أول تلقائياً.'
    });
    warnings++;
  }

  // -------------------------------------------------------------
  // Category 8: التشريعات والمراجع القانونية (Legislation & Compliance Rule 51)
  // -------------------------------------------------------------
  const unverifiedLegislation = system.legislationLibrary.filter(l => l.reviewNeeded || l.complianceLevel.includes('مصدر موثوق'));
  
  if (unverifiedLegislation.length > 0) {
    checks.push({
      category: 'التشريعات واللوائح',
      checkItem: 'مراجعة المراجع القانونية واللوائح التنظيمية (القاعدة الذهبية 51)',
      status: 'REVIEW_REQUIRED',
      details: `يوجد ${unverifiedLegislation.length} مادة تنظيمية مسجلة مع وسم [بحاجة إلى مراجعة قانونية/مصدر موثوق] لضمان الامتثال النظامي.`,
      fixable: false,
      recommendation: 'إشعار مستشار قانوني أو إرفاق روابط الأنظمة الرسمية.'
    });
    reviewRequired++;
  } else {
    checks.push({
      category: 'التشريعات واللوائح',
      checkItem: 'فحص المراجع والمواد القانونية والامتثال',
      status: 'PASSED',
      details: 'كافة المواد واللوائح مسجلة وموثقة بنجاح.',
      fixable: false,
      recommendation: 'المكتبة التشريعية محققة ومكتملة.'
    });
    passed++;
  }

  // -------------------------------------------------------------
  // Category 9: التواريخ والمدد المحددة (Date Chronology & SLAs)
  // -------------------------------------------------------------
  let dateSequenceErrors = 0;
  system.workPlan.forEach(t => {
    if (t.startDate && t.endDate && t.startDate > t.endDate) {
      dateSequenceErrors++;
    }
  });
  system.procurementOrders.forEach(p => {
    if (p.orderDate && p.deliveryDate && p.orderDate > p.deliveryDate) {
      dateSequenceErrors++;
    }
  });

  if (dateSequenceErrors === 0) {
    checks.push({
      category: 'المدد والتواريخ والـ SLAs',
      checkItem: 'سلامة التسلسل الزمني وتواريخ البداية والنهاية',
      status: 'PASSED',
      details: 'التسلسل الزمني لأوامر الشراء وخطة العمل سليم ولا يحتوي تعارضات زمنية.',
      fixable: false,
      recommendation: 'الجدول الزمني متسق وجاهز.'
    });
    passed++;
  } else {
    checks.push({
      category: 'المدد والتواريخ والـ SLAs',
      checkItem: 'وجود تعارض في التسلسل الزمني للتواريخ',
      status: 'WARNING',
      details: `تم رصد ${dateSequenceErrors} تاريخ بداية متأخر عن تاريخ النهاية.`,
      fixable: true,
      recommendation: 'تعديل تواريخ التسليم والتنفيذ لتكون لاحقة لتاريخ الإنشاء.'
    });
    warnings++;
  }

  // Calculate Overall Score
  const totalCheckCount = checks.length;
  const overallScore = Math.min(100, Math.max(0, Math.round(
    ((passed * 100) + (warnings * 70) + (reviewRequired * 80) + (errors * 0)) / (totalCheckCount * 100) * 100
  )));

  return {
    overallScore,
    passedCount: passed,
    warningCount: warnings,
    errorCount: errors,
    reviewRequiredCount: reviewRequired,
    checks,
    qaDate: new Date().toISOString().split('T')[0],
    status: errors === 0 ? 'جاهز للتصدير' : 'يتطلب مراجعة'
  };
}

/**
 * Auto-Repair / Fix Quality Issues Engine
 * Applies automatic programmatic corrections to common fixable defects.
 */
export function autoFixQualityIssues(system: InstitutionalSystem): { updatedSystem: InstitutionalSystem; fixedCount: number; fixedDetails: string[] } {
  let fixedCount = 0;
  const fixedDetails: string[] = [];

  const updatedSystem: InstitutionalSystem = JSON.parse(JSON.stringify(system));

  // Fix 1: Add '=' prefix to Excel formulas
  updatedSystem.formulas.forEach((f: FormulaItem) => {
    if (!f.excelFormula || !f.excelFormula.trim().startsWith('=')) {
      f.excelFormula = '=' + (f.excelFormula || '').trim().replace(/^=*/, '');
      fixedCount++;
      fixedDetails.push(`تم إضافة علامة (=) للمعادلة [${f.code}] ${f.name}`);
    }
  });

  // Fix 2: HR Salary Total Discrepancies & Zero Salaries
  updatedSystem.hrEmployees.forEach((emp: HREmployeeRecord, idx) => {
    if (emp.basicSalary <= 0) {
      emp.basicSalary = 8000 + (idx * 500);
      emp.housingAllowance = Math.round(emp.basicSalary * 0.25);
      emp.transportAllowance = 1000;
      fixedCount++;
      fixedDetails.push(`تحديث الراتب الأساسي والبدلات المفقودة للموظف [${emp.empCode}] ${emp.fullName}`);
    }
    const correctTotal = emp.basicSalary + emp.housingAllowance + emp.transportAllowance;
    if (emp.totalSalary !== correctTotal) {
      emp.totalSalary = correctTotal;
      fixedCount++;
      fixedDetails.push(`تحديث الراتب الشامل للموظف [${emp.empCode}] ليكون ${correctTotal} SAR`);
    }
  });

  // Fix 3: Risk Score calculations
  updatedSystem.riskRegister.forEach((rsk: RiskItem) => {
    if (rsk.likelihoodRating < 1) rsk.likelihoodRating = 2;
    if (rsk.impactRating < 1) rsk.impactRating = 3;
    const calc = rsk.likelihoodRating * rsk.impactRating;
    if (rsk.riskScore !== calc) {
      rsk.riskScore = calc;
      if (calc >= 15) rsk.riskLevel = 'حرج';
      else if (calc >= 10) rsk.riskLevel = 'عالي';
      else if (calc >= 5) rsk.riskLevel = 'متوسط';
      else rsk.riskLevel = 'منخفض';
      fixedCount++;
      fixedDetails.push(`إعادة حساب درجة الخطر [${rsk.riskCode}] إلى (${calc})`);
    }
  });

  // Fix 4: RACI Matrix missing A/R roles
  updatedSystem.raciMatrix.forEach((raci: RACIRow) => {
    if (!raci.accountableRole || raci.accountableRole === '-') {
      raci.accountableRole = 'الرئيس التنفيذي / مدير الإدارة';
      fixedCount++;
      fixedDetails.push(`تعيين المساءلة (Accountable) للعملية [${raci.processCode}]`);
    }
    if (!raci.responsibleRole || raci.responsibleRole === '-') {
      raci.responsibleRole = 'رئيس القسم / اخصائي رئيسي';
      fixedCount++;
      fixedDetails.push(`تعيين المنفذ (Responsible) للعملية [${raci.processCode}]`);
    }
  });

  // Fix 5: Ensure duplicate codes are unique
  const usedCodes = new Set<string>();
  const fixCode = (code: string, prefix: string): string => {
    if (!code || usedCodes.has(code)) {
      const newCode = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      usedCodes.add(newCode);
      fixedCount++;
      fixedDetails.push(`إعادة ترميز كود مكرر إلى الكود الجديد [${newCode}]`);
      return newCode;
    }
    usedCodes.add(code);
    return code;
  };

  updatedSystem.items.forEach(i => i.uid = fixCode(i.uid, 'ITM'));
  updatedSystem.sopLibrary.forEach(s => s.sopCode = fixCode(s.sopCode, 'SOP'));
  updatedSystem.riskRegister.forEach(r => r.riskCode = fixCode(r.riskCode, 'RSK'));
  updatedSystem.kpiList.forEach(k => k.kpiCode = fixCode(k.kpiCode, 'KPI'));

  // Re-run Quality Assurance on updated system to generate fresh QA Report
  updatedSystem.qaReport = runQualityAssurance(updatedSystem);
  updatedSystem.updatedAt = new Date().toISOString();

  return {
    updatedSystem,
    fixedCount,
    fixedDetails
  };
}
