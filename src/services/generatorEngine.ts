import { InstitutionalSystem, ProjectDefinition } from '../types/institutional';
import { runQualityAssurance } from './qaEngine';
import { enrichSystemWithComprehensiveEngine } from './contentEngine';

export function createInstitutionalSystemFromPrompt(
  promptText: string,
  overrides?: Partial<ProjectDefinition>
): InstitutionalSystem {
  const textLower = promptText.toLowerCase();

  // Detect domain
  let domain = 'الموارد البشرية ورأس المال البشري';
  let prefix = 'HR';
  let companyName = 'المؤسسة الوطنية المتقدمة';

  if (textLower.includes('مال') || textLower.includes('محاسب') || textLower.includes('finance') || textLower.includes('acc')) {
    domain = 'الأنظمة المالية والمحاسبية والموازنات';
    prefix = 'FIN';
  } else if (textLower.includes('مشتري') || textLower.includes('عقود') || textLower.includes('procurement')) {
    domain = 'إدارة المشتريات والموردين والعقود';
    prefix = 'PUR';
  } else if (textLower.includes('حوكم') || textLower.includes('مخاطر') || textLower.includes('امتثال') || textLower.includes('governance')) {
    domain = 'إطار الحوكمة وإدارة المخاطر والامتثال';
    prefix = 'GOV';
  } else if (textLower.includes('تشغيل') || textLower.includes('إجراء') || textLower.includes('sop') || textLower.includes('عمليات')) {
    domain = 'إدارة العمليات والإجراءات التشغيلية SOP';
    prefix = 'OPS';
  } else if (textLower.includes('مرافق') || textLower.includes('صيان') || textLower.includes('fm')) {
    domain = 'إدارة المرافق والخدمات والتشغيل';
    prefix = 'FM';
  } else if (textLower.includes('مشروع') || textLower.includes('مشاريع') || textLower.includes('pmo')) {
    domain = 'إدارة المشاريع ومتابعة الإنجاز PMO';
    prefix = 'PMO';
  } else if (textLower.includes('جودة') || textLower.includes('تدقيق') || textLower.includes('iso')) {
    domain = 'إدارة الجودة الشاملة والرقابة الداخلية';
    prefix = 'QA';
  }

  const projDef: ProjectDefinition = {
    projectName: overrides?.projectName || `النظام المؤسسي الشامل لـ (${promptText.trim()})`,
    domain: overrides?.domain || domain,
    sector: overrides?.sector || 'إداري وتشغيلي',
    orgType: overrides?.orgType || 'شركة مساهمة / مؤسسة أعمال',
    orgSize: overrides?.orgSize || '150 - 300 موظف',
    targetUsers: [
      'الإدارة التنفيذية والقيادات العليا',
      'مدراء القطاعات والإدارات التشغيلية',
      'مسؤولي الحوكمة والمخاطر والامتثال',
      'أخصائي النظام والعمليات'
    ],
    goal: `تأسيس وأتمتة وبناء البنية التحتية المعرفية والأنظمة التشغيلية الخاصة بـ (${promptText}) بدقة واحترافية.`,
    scope: 'الهيكل التنظيمي + الإجراءات SOP + النماذج + القواميس + المعادلات + المخاطر + لوحة KPIs + أدلة العمل',
    complexity: overrides?.complexity || 'مؤسسي شامل',
    levelOfDetail: overrides?.levelOfDetail || 'مستوفى بالكامل مع كافة الأوراق والدلائل',
    fileTypes: overrides?.fileTypes || ['XLSX', 'DOCX', 'PDF', 'PPTX', 'CSV', 'JSON', 'ZIP'],
    language: overrides?.language || 'العربية الفصحى الرسمية',
    direction: 'RTL',
    themeColor: 'الأزرق الكحلي والذهبي المؤسسي'
  };

  const sysUid = `SYS-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

  const baseSystem: InstitutionalSystem = {
    id: `sys-${Date.now()}`,
    uid: sysUid,
    version: 'V1.0',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    createdBy: 'محرك التوليد المؤسسي الذكي',
    approvalStatus: 'معتمد',

    projectDefinition: projDef,

    orgStructure: {
      companyName,
      totalEmployeesCount: 220,
      boardChair: 'رئيس مجلس الإدارة',
      ceoTitle: 'الرئيس التنفيذي (CEO)',
      sectors: [
        {
          name: `قطاع ${domain}`,
          code: `SEC-${prefix}-01`,
          leadTitle: `نائب الرئيس لـ ${domain}`,
          departments: [
            {
              name: `إدارة العمليات التخصصية لـ ${domain}`,
              code: `DEP-${prefix}-01`,
              deptHead: `مدير إدارة ${domain}`,
              sections: [
                {
                  name: `قسم التخطيط والمتابعة`,
                  code: `SEC-${prefix}-SEC1`,
                  unitName: 'وحدة ضبط الجودة والأداء',
                  jobTitles: [
                    {
                      title: `رئيس قسم تخطيط ${domain}`,
                      code: `JOB-${prefix}-001`,
                      level: 'إشرافي',
                      count: 1,
                      reportTo: 'مدير الإدارة',
                      responsibilities: [
                        'متابعة تطبيق المؤشرات والأنظمة المعتمدة',
                        'إعداد التقارير الدورية ولوحات القيادة',
                        'مراجعة نماذج وإجراءات العمل الشاملة'
                      ],
                      qualifications: 'بكالوريوس إدارة/تخصص ذو صلة + خبرة 6 سنوات'
                    },
                    {
                      title: `أخصائي أول ${domain}`,
                      code: `JOB-${prefix}-002`,
                      level: 'تخصصي',
                      count: 3,
                      reportTo: 'رئيس القسم',
                      responsibilities: [
                        'تنفيذ العمليات اليومية وإدخال السجلات',
                        'مطابقة البيانات ومتابعة مؤشرات الأداء'
                      ],
                      qualifications: 'بكالوريوس أخصائي مع خبرة 3 سنوات'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    dictionary: [
      {
        code: `DICT-${prefix}-001`,
        term: `نظام ${domain}`,
        englishTerm: `${domain} Institutional System`,
        abbreviation: prefix,
        shortDefinition: `المنظومة القياسية المعتمدة لإدارة وتنفيذ كافة عمليات ${domain}.`,
        detailedDefinition: `مجموعة شاملة ومتكاملة من اللوائح، الإجراءات التشغيلية SOP، النماذج المرقومة، المعادلات الرياضية، ومؤشرات KPI المخصصة لضبط حوكمة وأداء المجال.`,
        domain,
        category: 'مصطلحات عامة',
        termType: 'مفهوم أساسي',
        relatedTerms: ['الحوكمة', 'مصفوفة الصلاحيات DOA', 'سجل المخاطر'],
        synonyms: ['الدليل التنفيذي', 'نظام العمل القياسي'],
        usageExample: 'يتم تطبيق هذا النظام على كافة الإدارات والفروع التابعة للمؤسسة.',
        sourceReference: 'الدليل المؤسسي القياسي لإدارة الأعمال'
      },
      {
        code: `DICT-${prefix}-002`,
        term: 'مصفوفة المسائل والمسؤوليات RACI',
        englishTerm: 'RACI Matrix',
        abbreviation: 'RACI',
        shortDefinition: 'أداة حوكمة توزع الأدوار (المسؤول، المساءل، الاستشاري، والمُعلم).',
        detailedDefinition: 'جدول تحليلي يحدد بدقة مسؤولية التنفيذ (Responsible)، والمساءلة النهائية (Accountable)، وجهات الاستشارة (Consulted)، والجهات المتلقية للإشعار (Informed) لكل عملية.',
        domain: 'الحوكمة والإدارة',
        category: 'أدوات الحوكمة',
        termType: 'إطار تنظيم',
        relatedTerms: ['مصفوفة الصلاحيات', 'الوصف الوظيفي'],
        synonyms: ['مصفوفة الأنشطة والمسؤوليات'],
        usageExample: 'تستند كافة إجراءات SOP إلى مصفوفة RACI المعتمدة بالمنصة.',
        sourceReference: 'معايير الإدارة المؤسسية ومعهد PMI'
      }
    ],

    items: [
      {
        uid: `${prefix}-ITM-001`,
        category: 'بيانات أساسية',
        title: `كود السجل الرئيسي لـ ${domain}`,
        description: 'المعرف الموحد لكافة المدخلات والمستندات ذات الصلة.',
        department: 'الإدارة التشغيلية',
        level: 'إجباري',
        standardCode: `STD-${prefix}-01`
      },
      {
        uid: `${prefix}-ITM-002`,
        category: 'النماذج المعتمدة',
        title: 'سجل تدقيق واكتشاف الأخطاء',
        description: 'نموذج مرقوم لتوثيق حالات الانحراف والإجراءات التصحيحية.',
        department: 'الجودة والرقابة',
        level: 'رقابي',
        standardCode: `STD-${prefix}-02`
      }
    ],

    formulas: [
      {
        code: `FORM-${prefix}-001`,
        name: `نسبة كفاءة إنجاز عمليات ${domain}`,
        description: 'قياس نسبة المخرجات المكتملة في الوقت المحدد مقارنة بإجمالي الطلبات الواردة.',
        inputs: ['عدد الطلبات المكتملة في الوقت المحدد', 'إجمالي الطلبات الواردة'],
        calculationMethod: 'النسبة = (الطلبات المكتملة في الوقت ÷ إجمالي الطلبات) × 100',
        mathFormula: 'EfficiencyRatio = (CompletedOnTime / TotalRequests) * 100',
        excelFormula: '=(A2/B2)*100',
        unit: 'نسبة مئوية (%)',
        sampleResult: '94.2%',
        minThreshold: 80,
        maxThreshold: 100,
        acceptableLevel: 'أكبر من 90%',
        warningLevel: 'بين 75% إلى 89%',
        riskLevel: 'أقل من 75% يمثل خللاً تشغيلياً حرجاً',
        practicalExample: 'إنجاز 188 طلب من أصل 200 طلب: النسبة = 94%.',
        sourceReference: 'دليل مؤشرات الأداء المؤسسي القياسي'
      },
      {
        code: `FORM-${prefix}-002`,
        name: 'حساب الانحراف عن الميزانية المخططة',
        description: 'قياس فارق التكلفة الفعلية عن التكلفة التقديرية المعتمدة.',
        inputs: ['التكلفة الفعلية', 'التكلفة المعتمدة بالميزانية'],
        calculationMethod: 'الانحراف (%) = ((التكلفة الفعلية - التكلفة المعتمدة) ÷ التكلفة المعتمدة) × 100',
        mathFormula: 'Variance = ((ActualCost - BudgetCost) / BudgetCost) * 100',
        excelFormula: '=((A2-B2)/B2)*100',
        unit: 'نسبة مئوية (%)',
        sampleResult: '-2.5%',
        minThreshold: -10,
        maxThreshold: 5,
        acceptableLevel: 'انحراف أقصى 5% زيادة أو وفر 10%',
        warningLevel: 'زيادة التكلفة بين 6% إلى 15%',
        riskLevel: 'تجاوز 15% يتطلب قرار اعتماد استثنائي',
        practicalExample: 'إنفاق 97,500 SAR مقابل ميزانية 100,000 SAR: الانحراف = -2.5% (وفر ممتاز).',
        sourceReference: 'المعايير المالية والمحاسبية الدولية'
      }
    ],

    datePeriods: [
      {
        code: `PER-${prefix}-001`,
        title: 'مُهلة إنجاز المستندات والطلبات الرسمية (SLA Target)',
        periodType: 'أيام',
        defaultDurationDays: 5,
        startDateField: 'تاريخ استلام الطلب',
        endDateField: 'تاريخ الاعتماد النهائي',
        slaTargetDays: 5,
        retentionYears: 7,
        renewalNoticeDays: 30,
        notes: 'يتم احتساب أيام العمل الفعلية بخلاف العطلات الأسبوعية والرسمية.'
      }
    ],

    governancePrinciples: [
      {
        code: `GOV-${prefix}-001`,
        principle: 'الشفافية والمساءلة في كافة العمليات',
        description: 'توفير آليات توثيق محكمة لكل إجراء مع الالتزام بالشفافية الكاملة.',
        responsibleBody: 'لجنة الحوكمة والمخاطر',
        controlMechanism: 'التدقيق الآلي والاحتفاظ بسجل النشاطات',
        complianceEvidence: 'تقارير المراجعة ومحاضر الاجتماعات المعتمدة'
      }
    ],

    authorityMatrix: [
      {
        processCode: `AUTH-${prefix}-001`,
        processName: `اعتماد الميزانية والخطة السنوية لـ ${domain}`,
        department: 'الإدارة العليا',
        boardAuthority: 'اعتماد',
        ceoAuthority: 'توصية',
        vpAuthority: 'مراجعة',
        deptHeadAuthority: 'توصية',
        financialThresholdSAR: 'حسب خطة الشركة'
      }
    ],

    hrEmployees: [
      {
        empCode: 'EMP-000201',
        fullName: 'خالد بن سلطان الماجد',
        jobTitle: `مدير إدارة ${domain}`,
        department: `إدارة ${domain}`,
        hireDate: '2020-02-01',
        basicSalary: 22000,
        housingAllowance: 5500,
        transportAllowance: 1500,
        totalSalary: 29000,
        contractType: 'عقد غير محدد المدة',
        annualLeaveBalanceDays: 20,
        status: 'نشط'
      }
    ],

    chartOfAccounts: [
      {
        accountCode: '5201',
        accountName: `مصاريف تشغيلية لـ ${domain}`,
        englishName: `${domain} Operational Expenses`,
        accountType: 'مصروفات',
        category: 'مصاريف تشغيلية',
        parentCode: '5200',
        isHeader: false,
        normalBalance: 'مدينة',
        budgetAllocation: 1200000
      }
    ],

    procurementOrders: [
      {
        prCode: `PR-${prefix}-001`,
        description: `توريد وتأمين متطلبات وأنظمة ${domain}`,
        requestingDept: `إدارة ${domain}`,
        vendorName: 'شركة النظم التقنية المتطورة',
        poAmount: 115000,
        orderDate: '2026-08-10',
        deliveryDate: '2026-09-30',
        status: 'أمر شراء',
        contractTermMonths: 6
      }
    ],

    sopLibrary: [
      {
        sopCode: `SOP-${prefix}-001`,
        title: `الإجراء التشغيلي القياسي لإدارة وتنفيذ ${domain}`,
        objective: `تأطير خطوات ومراحل العمل بصورة موثوقة لحوكمة وتسهيل إجراءات ${domain}.`,
        scope: `تطبق هذه الإجراءات على كافة المستويات الإدارية المعنية بـ ${domain}.`,
        ownerDepartment: `إدارة ${domain}`,
        inputs: ['بيانات الطلب المكتملة', 'الميزانية المعتمدة', 'سجلات المطابقة'],
        steps: [
          {
            stepNumber: 1,
            action: 'استلام المدخلات ومراجعة الاستيفاء الفني',
            actor: 'أخصائي النظام',
            durationHours: 4,
            inputsRequired: 'نموذج تقديم الطلب المكتمل',
            outputProduced: 'إشعار قبول الطلب وتعيين رقم UID',
            controlCheck: 'التحقق من اكتمال كافة المرفقات الإلزامية'
          },
          {
            stepNumber: 2,
            action: 'معالجة وتطبيق المعايير الحسابية أو الفنية',
            actor: 'رئيس القسم التشغيلي',
            durationHours: 8,
            inputsRequired: 'الملف المقبول',
            outputProduced: 'مسودة المخرج النهائي',
            controlCheck: 'تطبيق محرك المعادلات FORM وشروط الامتثال'
          },
          {
            stepNumber: 3,
            action: 'المراجعة النهائية وتأكيد الاعتماد التنسيقي',
            actor: 'مدير الإدارة',
            durationHours: 2,
            inputsRequired: 'مسودة المخرج + تقرير فحص الجودة QA',
            outputProduced: 'المستند المعتمد النهائي للتصدير',
            controlCheck: 'مطابقة الصلاحيات مع مصفوفة DOA'
          }
        ],
        outputs: ['المستند المعتمد النهائي', 'تقرير المتابعة والتدقيق'],
        associatedForms: [`${prefix}-FRM-001 (نموذج طلب جديد)`, `${prefix}-FRM-002 (نموذج اعتماد المخرج)`],
        recordsRetention: '7 سنوات بالأرشيف الرقمي',
        kpiCode: `KPI-${prefix}-001`,
        riskCode: `RSK-${prefix}-001`,
        slaTargetHours: 14,
        version: 'V1.0',
        reviewDate: '2026-06-30'
      }
    ],

    riskRegister: [
      {
        riskCode: `RSK-${prefix}-001`,
        description: `خطر التأخير أو التعثر في استكمال طلبات ${domain}`,
        cause: 'عدم اكتمال الوثائق المقدمة أو ضغط العمل في الفترات الموسمية',
        impactDescription: 'تأخر الإنجاز وانخفاض مؤشر رضا العملاء والجهات المستفيدة',
        likelihoodRating: 2,
        impactRating: 4,
        riskScore: 8,
        riskLevel: 'متوسط',
        currentControls: 'متابعة التنبيهات الدورية وضبط المستهدفات الزمنية SLAs',
        proposedControls: 'تفعيل التنبيهات الآلية المبكرة قبل انتهاء مهلة الإنجاز بـ 24 ساعة',
        riskOwner: `رئيس قسم تخطيط ${domain}`,
        mitigationPlan: 'إعادة توزيع الحمل التشغيلي بين الأخصائيين فور رصد التنبيه',
        dueDate: '2026-11-01',
        residualRisk: 'منخفض'
      }
    ],

    kpiList: [
      {
        kpiCode: `KPI-${prefix}-001`,
        name: `معدل الالتزام باتفاقيات مستوى الخدمة SLA لـ ${domain}`,
        definition: 'نسبة المعاملات والطلبات المنفذة ضمن الزمن المحدد للعملية.',
        target: 95,
        baseline: 88,
        actual: 96.5,
        achievementPercentage: 101.5,
        unit: '%',
        trend: 'صاعد',
        frequency: 'شهري',
        dataSource: 'تقارير النظام والداشبورد الحي',
        ownerDepartment: `إدارة ${domain}`,
        isLowerBetter: false,
        performanceLevel: 'ممتاز'
      }
    ],

    legislationLibrary: [
      {
        refCode: `LEG-${prefix}-001`,
        lawName: 'الأنظمة واللوائح الحكومية والمعايير القياسية المعتمدة',
        lawType: 'معيار جودة',
        refNumber: 'قرار مؤسسي معتمد رقم 104',
        issueDate: '2025-01-01',
        effectiveDate: '2025-01-01',
        articleNumber: 'المادة العامة',
        subject: `الضوابط والاشتراطات العامة لتنظيم ${domain}`,
        requirementSummary: 'الالتزام التام بإجراءات الحوكمة مع حفظ السجلات وتوفير خطوط تدقيق مستقلة.',
        institutionalApplication: 'تضمين المتطلبات في كافة النماذج والإجراءات التشغيلية المعتمدة.',
        complianceLevel: 'ملتزم بالكامل',
        responsibleOwner: 'إدارة الحوكمة والامتثال',
        reviewNeeded: false
      }
    ],

    raciMatrix: [
      {
        processCode: `PROC-${prefix}-001`,
        processName: `إعداد وتشغيل ومتابعة أنظمة ${domain}`,
        responsibleRole: `أخصائي ${domain}`,
        accountableRole: `مدير إدارة ${domain}`,
        consultedRole: 'إدارة الحوكمة والرقابة',
        informedRole: 'الرئيس التنفيذي'
      }
    ],

    formsLibrary: [
      {
        formCode: `${prefix}-FRM-001`,
        formName: `نموذج طلب تنفيذ إجراء في ${domain}`,
        version: 'V1.0',
        issueDate: '2026-01-01',
        department: `إدارة ${domain}`,
        purpose: 'توثيق وتسجيل بيانات الطلب والتحقق من المستندات المرفقة.',
        fields: [
          { fieldName: 'كود الطلب الفريد UID', fieldType: 'نص إجباري', isRequired: true, placeholder: `${prefix}-REQ-0000` },
          { fieldName: 'اسم مقدم الطلب والإدارة', fieldType: 'نص إجباري', isRequired: true, placeholder: 'الاسم والإدارة' },
          { fieldName: 'موضوع الطلب والتفاصيل', fieldType: 'نص تفصيلي', isRequired: true, placeholder: 'شرح مختصر' }
        ],
        instructions: 'تعبئة جميع الحقول وإرفاق المستندات المعتمدة قبل التقديم.',
        approvalChain: ['مقدم الطلب', 'أخصائي المعالجة', 'مدير الإدارة']
      }
    ],

    workPlan: [
      {
        taskCode: `TSK-${prefix}-001`,
        activityName: `تطبيق وتشغيل المرحلة الأولى من نظام ${domain}`,
        responsibleName: `فريق العمل الإداري والتقني`,
        startDate: '2026-10-01',
        endDate: '2026-11-15',
        durationDays: 45,
        resources: 'برامج التشغيل والكوادر المعتمدة',
        costSAR: 50000,
        status: 'قيد التنفيذ',
        completionPercentage: 30,
        associatedRisk: `RSK-${prefix}-001`
      }
    ],

    dataDictionary: [
      {
        fieldId: `FLD_${prefix}_001`,
        arabicName: 'كود الطلب الموحد',
        technicalName: `${prefix}_RequestID`,
        dataType: 'NVARCHAR',
        length: '30',
        isRequired: true,
        defaultValue: `${prefix}-000000`,
        dataSource: `جدول ${domain} الرئيسي`,
        relatedTable: `TBL_${prefix}_Master`,
        validationRule: 'UNIQUE, NOT NULL',
        usageDescription: 'المعرف الموحد لكافة المعاملات في هذا المجال.'
      }
    ],

    userManual: {
      introduction: `دليل التشغيل والاستخدام الخاص بنظام (${domain}). يساعد هذا الدليل على توضيح دورة العمل وآلية إدخال البيانات والتصدير.`,
      systemObjectives: [
        'توحيد المفاهيم والإجراءات لضمان أعلى مستويات الجودة.',
        'أتمتة الحسابات والمعادلات وتقليل نسبة الخطأ البشري.',
        'توفير مخرجات احترافية قابلة للتنزيل والتعديل والطباعة.'
      ],
      setupInstructions: [
        {
          title: 'التهيئة الأولى',
          content: 'التحقق من البيانات والمسميات الوظيفية واستيفاء الهيكل التنظيمي.'
        }
      ],
      dataEntryGuide: [
        {
          title: 'إدخال البيانات',
          content: 'استخدام الشاشات والنماذج المرقومة للتحكم بكافة البيانات المدخلة.'
        }
      ],
      operationsGuide: [
        {
          title: 'تشغيل العمليات',
          content: 'الالتزام بالخطوات المحددة في دليل SOP الخاص بالمجال.'
        }
      ],
      reportsAndDashboardGuide: [
        {
          title: 'التقارير والتصدير',
          content: 'متابعة الداشبورد التفاعلي واستخراج التقارير والملفات بجميع الصيغ.'
        }
      ],
      faqList: [
        {
          question: 'كيف أستطيع تصدير النظام إلى ملف Excel حقيقي؟',
          answer: 'اضغط على زر [إنشاء XLSX] في مركز التصدير للحصول على ملف Excel منسق بـ 15 ورقة عمل مع الصيغ بالجداول.'
        }
      ]
    },

    executiveSummary: {
      overview: `يمثل هذا النظام البنية المعرفية والتنفيذية المكتملة لـ ${domain}.`,
      currentStatus: 'جاهز ومعتمد ومستوفى كافة الاشتراطات الحوكمية والفنية.',
      keyMetrics: [
        { label: 'نسبة الجاهزية والربط', value: '100%', trend: 'مكتمل' },
        { label: 'معدل الالتزام بـ SLAs', value: '96.5%', trend: 'ممتاز' }
      ],
      keyRisks: [`تأخر الاستجابة في مواسم الضغط`],
      keyRecommendations: [`تطبيق أتمتة إضافية للخطوات التكرارية`],
      actionPlanSummary: 'استكمال المتابعة الميدانية ورفع التقارير الشهرية للإدارة.'
    },

    qaReport: {
      overallScore: 96,
      passedCount: 16,
      warningCount: 0,
      errorCount: 0,
      reviewRequiredCount: 1,
      checks: [
        { category: 'التصميم والتكامل', checkItem: 'تكامل المحرك والهيكل التنظيمي', status: 'PASSED', details: 'تم توليد البنية كاملة.' }
      ],
      qaDate: new Date().toISOString().split('T')[0],
      status: 'جاهز للتصدير'
    }
  };

  // Run QA check engine
  baseSystem.qaReport = runQualityAssurance(baseSystem);

  return enrichSystemWithComprehensiveEngine(baseSystem);
}
