import { InstitutionalSystem } from '../types/institutional';
import { enrichSystemWithComprehensiveEngine } from './contentEngine';

const RAW_DEMO_HR_SYSTEM: InstitutionalSystem = {
  id: 'demo-hr-system-001',
  uid: 'SYS-HRM-2026-001',
  version: 'V1.0',
  createdAt: '2026-09-11',
  updatedAt: '2026-09-11',
  createdBy: 'محلل النظم المؤسسية الرئيسي',
  approvalStatus: 'معتمد',

  projectDefinition: {
    projectName: 'النظام المؤسسي المتكامل لإدارة الموارد البشرية',
    domain: 'الموارد البشرية ورأس المال البشري',
    sector: 'إداري وتنفيذي',
    orgType: 'شركة مساهمة مقفلة (قطاع خاص / مؤسسي)',
    orgSize: '250 - 500 موظف',
    targetUsers: [
      'مدير عام الموارد البشرية',
      'مدراء الإدارات والأقسام',
      'أخصائي التعويضات والمزايا',
      'مسؤولي الاستقطاب والتوظيف',
      'المراقب المالي والمدقق الداخلي'
    ],
    goal: 'بناء بنية معرفية ونظام تشغيلي متكامل وحوكمة شؤون الموارد البشرية والرواتب والأداء والامتثال وفق أحدث المعايير القياسية.',
    scope: 'تخطيط القوى العاملة + التوظيف + الهيكل التنظيمي + مسير الرواتب + تقييم الأداء + اللوائح والسياسات + الحوكمة والمخاطر',
    complexity: 'مؤسسي شامل',
    levelOfDetail: 'موسوعي متكامل مع كافة الجداول والروابط والمعادلات والنماذج',
    fileTypes: ['XLSX', 'DOCX', 'PDF', 'PPTX', 'CSV', 'JSON', 'ZIP'],
    language: 'العربية الفصحى الرسمية',
    direction: 'RTL',
    themeColor: 'الأزرق الكحلي والذهبي المؤسسي'
  },

  orgStructure: {
    companyName: 'المجموعة المؤسسية العربية القابضة',
    totalEmployeesCount: 380,
    boardChair: 'رئيس مجلس الإدارة',
    ceoTitle: 'الرئيس التنفيذي (CEO)',
    sectors: [
      {
        name: 'قطاع الموارد البشرية والخدمات المشتركة',
        code: 'SEC-HR-01',
        leadTitle: 'نائب الرئيس للموارد البشرية',
        departments: [
          {
            name: 'إدارة العمليات وشؤون الموظفين',
            code: 'DEP-OPS-01',
            deptHead: 'مدير إدارة عمليات شؤون الموظفين',
            sections: [
              {
                name: 'قسم الرواتب والاستحقاقات',
                code: 'SEC-PAY-01',
                unitName: 'وحدة المسيرات والمكافآت',
                jobTitles: [
                  {
                    title: 'رئيس قسم الرواتب والأجور',
                    code: 'JOB-HR-001',
                    level: 'إشرافي',
                    count: 1,
                    reportTo: 'مدير إدارة العمليات',
                    responsibilities: [
                      'إعداد وتدقيق مسيرات الرواتب الشهرية',
                      'مراجعة البدلات والتأمينات الاجتماعية والاستقطاعات',
                      'إعداد تسويات نهاية الخدمة ومكافآت الأداء'
                    ],
                    qualifications: 'بكالوريوس محاسبة / موارد بشرية + خبرة لا تقل عن 7 سنوات'
                  },
                  {
                    title: 'أخصائي أول رواتب ومزايا',
                    code: 'JOB-HR-002',
                    level: 'تخصصي',
                    count: 2,
                    reportTo: 'رئيس قسم الرواتب',
                    responsibilities: ['إدخال متغيرات الشهر من إجازات وحضور وغياب', 'مطابقة المبالغ مع الإدارة المالية'],
                    qualifications: 'بكالوريوس إدارة أعمال / محاسبة + خبرة 4 سنوات'
                  }
                ]
              },
              {
                name: 'قسم العلاقات الحكومية والامتثال',
                code: 'SEC-GOV-01',
                unitName: 'وحدة الجوازات والمنصات الحكومية',
                jobTitles: [
                  {
                    title: 'مشرف العلاقات الحكومية (معقب تنفيذ)',
                    code: 'JOB-HR-003',
                    level: 'إشرافي',
                    count: 2,
                    reportTo: 'مدير إدارة العمليات',
                    responsibilities: ['متابعة التأشيرات والإقامات ورخص العمل', 'متابعة نسبة التوطين (سعودة) وتحديث المنصات'],
                    qualifications: 'بكالوريوس نظام / إدارة مع خبرة 5 سنوات'
                  }
                ]
              }
            ]
          },
          {
            name: 'إدارة أداء وتطوير رأس المال البشري',
            code: 'DEP-DEV-02',
            deptHead: 'مدير إدارة تطوير رأس المال البشري',
            sections: [
              {
                name: 'قسم الاستقطاب والتوظيف',
                code: 'SEC-REC-01',
                unitName: 'وحدة مقابلة واختيار الكفاءات',
                jobTitles: [
                  {
                    title: 'أخصائي استقطاب الكفاءات',
                    code: 'JOB-HR-004',
                    level: 'تخصصي',
                    count: 3,
                    reportTo: 'مدير إدارة التمويل والتطوير',
                    responsibilities: ['إعلان الوظائف وفرز السير الذاتية', 'تنسيق المقابلات وإعداد العروض الوظيفية'],
                    qualifications: 'بكالوريوس إدارة موارد بشرية + خبرة 3 سنوات'
                  }
                ]
              },
              {
                name: 'قسم التدريب وإدارة الأداء',
                code: 'SEC-TRN-02',
                unitName: 'وحدة تقييم KPIs وOKRs',
                jobTitles: [
                  {
                    title: 'أخصائي تطوير وإدارة الأداء',
                    code: 'JOB-HR-005',
                    level: 'تخصصي',
                    count: 2,
                    reportTo: 'مدير إدارة التمويل والتطوير',
                    responsibilities: ['متابعة الدورات التقييمية النصف سنوية والسنوية', 'تحليل الفجوات التدريبية وإعداد خطط التطوير'],
                    qualifications: 'بكالوريوس موارد بشرية / تطوير تنظيمي'
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
      code: 'DICT-HR-001',
      term: 'مسير الرواتب والأجور',
      englishTerm: 'Payroll Sheet',
      abbreviation: 'PAY',
      shortDefinition: 'البيان المالي الشهري التفصيلي الذي يحصر استحقاقات واستقطاعات جميع الموظفين.',
      detailedDefinition: 'جدول محاسبي معتمد يتضمن الأجر الأساسي، بدل السكن، بدل النقل، البدلات الأخرى، مجموع الأجر الخاضع للتأمينات، الخصومات والاستقطاعات، وصافي المبلغ المحول لحسابات الموظفين عبر نظام حماية الأجور.',
      domain: 'الموارد البشرية والمالية',
      category: 'مصطلحات مالية وإدارية',
      termType: 'مفهوم أساسي',
      relatedTerms: ['الأجر الأساسي', 'نظام حماية الأجور WPS', 'الاستقطاعات القانونية'],
      synonyms: ['كشف الرواتب', 'جدول الأجور'],
      usageExample: 'يتم اعتماد مسير الرواتب من مدير الموارد البشرية والمدير المالي بحلول يوم 25 من كل شهر.',
      sourceReference: 'نظام العمل واللوائح المالية المؤسسية المعتمدة'
    },
    {
      code: 'DICT-HR-002',
      term: 'مكافأة نهاية الخدمة',
      englishTerm: 'End of Service Benefit',
      abbreviation: 'EOSB',
      shortDefinition: 'المبلغ المالي المستحق للموظف عند انتهاء أو إنهاء عقد عمله.',
      detailedDefinition: 'استحقاق نظامي يلتزم به صاحب العمل تجاه العامل عند انتهاء عقد العمل، ويتم حسابه بناءً على الأجر الأخير ومدة الخدمة ونوع سبب الانتهاء (استقالة، فسخ عقد، إنهاء من الشركة).',
      domain: 'أنظمة وقوانين العمل',
      category: 'مزايا واستحقاقات',
      termType: 'معيار قانوني',
      relatedTerms: ['أجر الأخير', 'مدة الخدمة', 'الاستقالة'],
      synonyms: ['تعويض نهاية الخدمة'],
      usageExample: 'تستحق مكافأة نهاية الخدمة بواقع أجر نصف شهر عن كل سنة من السنوات الخمس الأولى وأجر شهر عن كل سنة تالية.',
      sourceReference: 'المادة (84 و 85) من نظام العمل والعمال'
    },
    {
      code: 'DICT-HR-003',
      term: 'مؤشر دوران الموظفين',
      englishTerm: 'Employee Turnover Rate',
      abbreviation: 'ETR',
      shortDefinition: 'نسبة الموظفين الذين يغادرون المؤسسة خلال فترة زمنية محددة.',
      detailedDefinition: 'مؤشر قيادي يقيس معدل مغادرة الكوادر البشرية للشركة سواءً بالاستقالة أو إنهاء الخدمة مقسوماً على متوسط إجمالي عدد الموظفين في الفترة، مضروباً في 100.',
      domain: 'تخطيط وتحليل الموارد البشرية',
      category: 'مؤشرات الأداء KPI',
      termType: 'مؤشر تحليلي',
      relatedTerms: ['معدل الاستبقاء', 'الرضا الوظيفي', 'المقابلات الشخصية للترك'],
      synonyms: ['معدل التسرب الوظيفي'],
      usageExample: 'تهدف الشركة إلى تخفيض معدل دوران الموظفين الإرادي إلى أقل من 8% سنوياً.',
      sourceReference: 'معايير معهد CIPD لإدارة الموارد البشرية'
    },
    {
      code: 'DICT-HR-004',
      term: 'مصفوفة الصلاحيات المسندة',
      englishTerm: 'Delegation of Authority Matrix',
      abbreviation: 'DOA',
      shortDefinition: 'جدول يحدد الحدود المالية والإدارية لاعتماد القرارات لكل مستوى قيادي.',
      detailedDefinition: 'وثيقة حوكمة حاسمة تبين من يملك صلاحية التوصية، المراجعة، والاعتماد لكافة العمليات مثل التعيين، الترقية، تعديل الرواتب، الشراء، والمصروفات.',
      domain: 'الحوكمة والرقابة الداخلية',
      category: 'حوكمة وصلاحيات',
      termType: 'إطار تنظيم',
      relatedTerms: ['مصفوفة RACI', 'الفصل بين المهام', 'الصلاحيات المالية'],
      synonyms: ['جدول تفويض الصلاحيات'],
      usageExample: 'لا يجوز تعيين أي موظف بفرع إلا بعد موافقة رئيس القطاع وفق مصفوفة DOA.',
      sourceReference: 'دليل الحوكمة والرقابة الداخلية المؤسسية'
    }
  ],

  items: [
    {
      uid: 'HR-EMP-001',
      category: 'بيانات أفراد',
      title: 'رقم الموظف الفريد',
      description: 'كود معرف غير مكرر يتكون من ستة أرقام يعين فور توقيع العقد.',
      department: 'شؤون الموظفين',
      level: 'إجبارية أساسية',
      standardCode: 'ISO-27001-HR'
    },
    {
      uid: 'HR-ATT-001',
      category: 'سجلات الحضور',
      title: 'بصمة الدخول والخروج',
      description: 'سجل زمني حي موثق الكترونياً لدخول الموظف لمقر العمل.',
      department: 'العمليات',
      level: 'إشرافي يومي',
      standardCode: 'ATT-SOP-01'
    },
    {
      uid: 'FIN-ACC-001',
      category: 'دليل الحسابات',
      title: 'حساب رواتب وأجور مستحقة',
      description: 'حساب التزام مالية يمثل إجمالي أجور الشهر قبل الصرف.',
      department: 'المالية',
      level: 'دليل محاسبي standard',
      standardCode: 'COA-2101'
    },
    {
      uid: 'PROC-PUR-001',
      category: 'مشتريات خدمات',
      title: 'طلب عقد تدريب خارجي',
      description: 'طلب شراء خدمة تدريب موظفين معتمد من مدير الموارد البشرية.',
      department: 'المشتريات والتدريب',
      level: 'تشغيلي',
      standardCode: 'PR-TRN-001'
    },
    {
      uid: 'GOV-RSK-001',
      category: 'مخاطر تشغيلية',
      title: 'خطر عدم الامتثال بنسب التوطين',
      description: 'خطر انخفاض النسبة عن نطاق "بلاتيني/أخضر مرتفع" في نطاقات.',
      department: 'الحوكمة والامتثال',
      level: 'عالي الخطورة',
      standardCode: 'RSK-GOV-01'
    }
  ],

  formulas: [
    {
      code: 'FORM-HR-001',
      name: 'حساب صافي الراتب الشهري',
      description: 'معادلة حساب المبلغ الفعلي المحول لحساب الموظف البنكي بعد الإضافات والاستقطاعات.',
      inputs: ['الراتب الأساسي', 'بدل السكن', 'بدل النقل', 'بدلات أخرى', 'خصم التأمينات الاجتماعية (GOSI)', 'خصم التأخير والغياب'],
      calculationMethod: 'الصافي = (الأساسي + بدل السكن + بدل النقل + بدلات) - (استقطاع التأمينات + الخصومات والجزاءات)',
      mathFormula: 'NetSalary = (Basic + Housing + Transport + Allowances) - (GOSI_Deduction + Penalties)',
      excelFormula: '=SUM(C2:F2)-SUM(G2:H2)',
      unit: 'ريال سعودي (SAR)',
      sampleResult: '14,250 SAR',
      minThreshold: 4000,
      maxThreshold: 100000,
      acceptableLevel: 'مطابق لعقد العمل ووثيقة الرواتب',
      warningLevel: 'انحراف أرقام الخصومات أكثر من 15%',
      riskLevel: 'خطأ في معادلة الصافي يؤدي إلى تحويل مالي خاطئ',
      practicalExample: 'موظف أساسيه 10,000 + سكن 2,500 + نقل 1,000 = 13,500. خصم تأمينات 975 = الصافي 12,525 SAR.',
      sourceReference: 'نظام حماية الأجور واللائحة المالية الداخلية'
    },
    {
      code: 'FORM-HR-002',
      name: 'حساب مكافأة نهاية الخدمة (إنهاء الشركة)',
      description: 'حساب مستحق الموظف عند فسخ العقد أو إنهائه من جانب المؤسسة.',
      inputs: ['الراتب الأخير الشامل (أساسي+سكن)', 'عدد سنوات الخدمة الكلية'],
      calculationMethod: 'إذا السنوات <= 5: المستحق = (الراتب الشامل ÷ 2) × السنوات. إذا > 5: المستحق = (الراتب الشامل ÷ 2) × 5 + الراتب الشامل × (السنوات - 5).',
      mathFormula: 'EOSB = IF(Years<=5, (LastSalary/2)*Years, ((LastSalary/2)*5) + (LastSalary*(Years-5)))',
      excelFormula: '=IF(B2<=5, (A2/2)*B2, ((A2/2)*5) + (A2*(B2-5)))',
      unit: 'ريال سعودي (SAR)',
      sampleResult: '62,500 SAR',
      minThreshold: 0,
      maxThreshold: 500000,
      acceptableLevel: 'طبيعي ومطابق لمادة 84',
      warningLevel: 'تجاوز فترة الحساب دون تدقيق الإجازات المستهلكة',
      riskLevel: 'حساب غير دقيق يتسبب في نزاع عمالي',
      practicalExample: 'خدمة 7 سنوات براتب شامل 10,000 SAR: (5000×5) + (10000×2) = 25,000 + 20,000 = 45,000 SAR.',
      sourceReference: 'المادة 84 من نظام العمل'
    },
    {
      code: 'FORM-HR-003',
      name: 'نسبة تكلفة الموارد البشرية إلى الميزانية التشغيلية',
      description: 'قياس الحجم المالي للرواتب والمزايا مقارنة بإجمالي المصاريف التشغيلية للشركة.',
      inputs: ['إجمالي ميزانية الرواتب والمزايا السنوية', 'إجمالي المصاريف التشغيلية السنوية (OPEX)'],
      calculationMethod: 'النسبة = (إجمالي مصاريف الموارد البشرية ÷ إجمالي OPEX) × 100',
      mathFormula: 'HR_Cost_Ratio = (Total_HR_Cost / Total_OPEX) * 100',
      excelFormula: '=(A2/B2)*100',
      unit: 'نسبة مئوية (%)',
      sampleResult: '38.5%',
      minThreshold: 20,
      maxThreshold: 55,
      acceptableLevel: 'بين 30% إلى 45%',
      warningLevel: 'إذا تجاوزت 50%',
      riskLevel: 'تجاوز 60% يهدد الاستدامة المالية للشركة',
      practicalExample: 'مصاريف HR تبلغ 15,000,000 SAR وإجمالي OPEX يبلغ 40,000,000 SAR: النسبة = 37.5%.',
      sourceReference: 'المعايير المالية والإدارية للتخطيط المالي'
    }
  ],

  datePeriods: [
    {
      code: 'PER-HR-001',
      title: 'فترة التجربة والقياس العمالي',
      periodType: 'أيام',
      defaultDurationDays: 90,
      startDateField: 'تاريخ مباشرة العمل',
      endDateField: 'تاريخ انتهاء التجربة',
      slaTargetDays: 90,
      retentionYears: 5,
      renewalNoticeDays: 15,
      notes: 'يمكن تمديدها باتفاق كتابي لمدة 90 يوماً إضافية شرط ألا تتجاوز 180 يوماً متصلة.'
    },
    {
      code: 'PER-HR-002',
      title: 'المدة الإخطار المسبق لإلغاء العقد',
      periodType: 'أيام',
      defaultDurationDays: 60,
      startDateField: 'تاريخ إشعار خطي بالإنهاء',
      endDateField: 'تاريخ سريان إنهاء الخدمة',
      slaTargetDays: 60,
      retentionYears: 10,
      renewalNoticeDays: 60,
      notes: 'إذا كان العقد غير محدد المدة، يجب ألا يقل الإشعار عن 60 يوماً وفق المادة 75.'
    },
    {
      code: 'PER-HR-003',
      title: 'مدّة الاستبقاء الأرشيفي لملفات الموظفين',
      periodType: 'سنوات',
      defaultDurationDays: 3650,
      startDateField: 'تاريخ استقال/انتهاء خدمة الموظف',
      endDateField: 'تاريخ إتلاف/أرشفة الملف النهائية',
      slaTargetDays: 3650,
      retentionYears: 10,
      renewalNoticeDays: 30,
      notes: 'يجب حفظ السجلات والقيود والأنشطة المالية والعمالية لمدة لا تقل عن 10 سنوات نظاماً.'
    }
  ],

  governancePrinciples: [
    {
      code: 'GOV-PRIN-001',
      principle: 'الشفافية والعدالة في التوظيف والترقيات',
      description: 'ضمان تكافؤ الفرص لجميع المتقدمين والموظفين بناءً على الكفاءة والسياسات المعلنة دون تحيز.',
      responsibleBody: 'لجنة الموارد البشرية والترشيحات',
      controlMechanism: 'سجل التقييم المعياري وإجراء مقابلة من لجنة مشتركة',
      complianceEvidence: 'محاضر التقييم الموقعة وتطابق المؤهلات مع بطاقة الوصف الوظيفي'
    },
    {
      code: 'GOV-PRIN-002',
      principle: 'الفصل بين الصلاحيات والمهام الحساسة',
      description: 'منع وجود موظف واحد يملك صلاحية إدخال بيانات الرواتب وصلاحية الاعتماد والصرف المالي.',
      responsibleBody: 'إدارة الرقابة الداخلية والتدقيق',
      controlMechanism: 'تفعيل صلاحيات المستخدمين بالنظام ثلاثي المستويات (إدخال - مراجعة - اعتماد)',
      complianceEvidence: 'سجل تدقيق النظام Audit Trail ومصفوفة DOA'
    }
  ],

  authorityMatrix: [
    {
      processCode: 'AUTH-HR-001',
      processName: 'الموافقة على استحداث وظيفة جديدة بالميزانية',
      department: 'الموارد البشرية والتخطيط',
      boardAuthority: 'علم',
      ceoAuthority: 'اعتماد',
      vpAuthority: 'توصية',
      deptHeadAuthority: 'تنفيذ',
      financialThresholdSAR: 'ضمن الميزانية المعتمدة'
    },
    {
      processCode: 'AUTH-HR-002',
      processName: 'تعديل سلم الرواتب والبدلات العامة',
      department: 'الموارد البشرية والمالية',
      boardAuthority: 'اعتماد',
      ceoAuthority: 'توصية',
      vpAuthority: 'مراجعة',
      deptHeadAuthority: '-',
      financialThresholdSAR: '> 500,000 SAR'
    },
    {
      processCode: 'AUTH-HR-003',
      processName: 'الترقية الاستثنائية وزيادة الراتب فردية',
      department: 'تطوير رأس المال البشري',
      boardAuthority: '-',
      ceoAuthority: 'اعتماد',
      vpAuthority: 'توصية',
      deptHeadAuthority: 'مراجعة',
      financialThresholdSAR: 'حسب اللائحة'
    }
  ],

  hrEmployees: [
    {
      empCode: 'EMP-000101',
      fullName: 'أحمد بن عبدالله العتيبي',
      jobTitle: 'مدير عام الموارد البشرية',
      department: 'الموارد البشرية',
      hireDate: '2019-03-15',
      basicSalary: 28000,
      housingAllowance: 7000,
      transportAllowance: 2000,
      totalSalary: 37000,
      contractType: 'عقد دائم غير محدد المدة',
      annualLeaveBalanceDays: 22,
      status: 'نشط'
    },
    {
      empCode: 'EMP-000102',
      fullName: 'سارة بنت خالد الشمري',
      jobTitle: 'رئيس قسم الرواتب والاستحقاقات',
      department: 'العمليات وشؤون الموظفين',
      hireDate: '2021-06-01',
      basicSalary: 16000,
      housingAllowance: 4000,
      transportAllowance: 1500,
      totalSalary: 21500,
      contractType: 'عقد محدد المدة',
      annualLeaveBalanceDays: 18,
      status: 'نشط'
    },
    {
      empCode: 'EMP-000103',
      fullName: 'محمد بن إبراهيم المنصور',
      jobTitle: 'أخصائي استقطاب كفاءات أول',
      department: 'التوظيف والاستقطاب',
      hireDate: '2022-01-10',
      basicSalary: 12000,
      housingAllowance: 3000,
      transportAllowance: 1000,
      totalSalary: 16000,
      contractType: 'عقد محدد المدة',
      annualLeaveBalanceDays: 14,
      status: 'نشط'
    },
    {
      empCode: 'EMP-000104',
      fullName: 'نورة بنت فيصل السبيعي',
      jobTitle: 'أخصائية تدريب وتطوير',
      department: 'تطوير رأس المال البشري',
      hireDate: '2023-04-18',
      basicSalary: 10500,
      housingAllowance: 2625,
      transportAllowance: 1000,
      totalSalary: 14125,
      contractType: 'عقد محدد المدة',
      annualLeaveBalanceDays: 25,
      status: 'في إجازة'
    }
  ],

  chartOfAccounts: [
    {
      accountCode: '2101',
      accountName: 'مصاريف الرواتب والأجور المستحقة',
      englishName: 'Salaries & Wages Payable',
      accountType: 'التزامات',
      category: 'التزامات متداولة',
      parentCode: '2100',
      isHeader: false,
      normalBalance: 'دائنة',
      budgetAllocation: 25000000
    },
    {
      accountCode: '5101',
      accountName: 'مصاريف رواتب الموظفين الأساسية',
      englishName: 'Basic Salaries Expense',
      accountType: 'مصروفات',
      category: 'مصاريف الموارد البشرية',
      parentCode: '5100',
      isHeader: false,
      normalBalance: 'مدينة',
      budgetAllocation: 18000000
    },
    {
      accountCode: '5102',
      accountName: 'مصاريف بدل السكن والنقل',
      englishName: 'Housing & Transport Allowance Expense',
      accountType: 'مصروفات',
      category: 'مصاريف الموارد البشرية',
      parentCode: '5100',
      isHeader: false,
      normalBalance: 'مدينة',
      budgetAllocation: 5500000
    },
    {
      accountCode: '5103',
      accountName: 'حصة الشركة في التأمينات الاجتماعية (GOSI)',
      englishName: 'Company GOSI Contribution Expense',
      accountType: 'مصروفات',
      category: 'التأمينات والاشتراطات',
      parentCode: '5100',
      isHeader: false,
      normalBalance: 'مدينة',
      budgetAllocation: 2100000
    }
  ],

  procurementOrders: [
    {
      prCode: 'PR-HR-2026-001',
      description: 'توريد وتنفيذ برنامج القيادات التنفيذية وتطوير المهارات',
      requestingDept: 'تطوير الموارد البشرية',
      vendorName: 'أكاديمية التنمية الإدارية المتقدمة',
      poAmount: 185000,
      orderDate: '2026-08-01',
      deliveryDate: '2026-10-15',
      status: 'أمر شراء',
      contractTermMonths: 3
    },
    {
      prCode: 'PR-HR-2026-002',
      description: 'اشتراك سنوي في منصة الاختبارات النفسية والسلوكية للتوظيف',
      requestingDept: 'قسم التوظيف',
      vendorName: 'شركة الحلول الذكية للتقييم',
      poAmount: 42000,
      orderDate: '2026-07-10',
      deliveryDate: '2026-07-15',
      status: 'مكتمل',
      contractTermMonths: 12
    }
  ],

  sopLibrary: [
    {
      sopCode: 'SOP-HR-001',
      title: 'إجراءات إعداد وصرف مسير الرواتب الشهري',
      objective: 'ترسيخ آلية قياسية موحدة لإعداد، مراجعة، اعتماد وصرف الأجور الشهرية بدقة وبدون أخطاء في المواعيد النظامية.',
      scope: 'جميع موظفي الكادر الدائم والمؤقت بالمجموعة القابضة وشركاتها التابعة.',
      ownerDepartment: 'قسم الرواتب والاستحقاقات',
      inputs: [
        'سجلات الحضور والغياب المعتمدة من البصمة',
        'طلبات الإجازات المعتمدة نظاماً',
        'قرارات التعيين، التعديل والإنهاء الشهرية',
        'مستندات الخصومات والجزاءات المعتمدة'
      ],
      steps: [
        {
          stepNumber: 1,
          action: 'سحب بيانات الحضور والغياب والإجازات وتدقيق المدخلات',
          actor: 'أخصائي الرواتب',
          durationHours: 8,
          inputsRequired: 'ملف تقارير الحضور الذاتي',
          outputProduced: 'مسودة كشف المتغيرات الأولية',
          controlCheck: 'مطابقة إجمالي عدد الموظفين مع القائمة المعتمدة'
        },
        {
          stepNumber: 2,
          action: 'تطبيق معادلات الاحتساب وإعداد كشف المسير المالي المبدئي',
          actor: 'رئيس قسم الرواتب',
          durationHours: 6,
          inputsRequired: 'كشف المتغيرات + سلم الرواتب',
          outputProduced: 'مسير الرواتب المقترح بصيغة XLSX',
          controlCheck: 'التحقق من عدم وجود مبالغ سالبة أو فروقات غير مبررة'
        },
        {
          stepNumber: 3,
          action: 'المراجعة والاعتماد المالي والإداري للصرف',
          actor: 'مدير عام الموارد البشرية + المدير المالي',
          durationHours: 4,
          inputsRequired: 'تقرير الفروقات الشهرية + المسير المكتمل',
          outputProduced: 'نموذج اعتماد المسير النهائي المربوط مع البنك',
          controlCheck: 'مطابقة إجمالي المبلغ مع ميزانية الأجور الشهرية'
        },
        {
          stepNumber: 4,
          action: 'توليد ملف حماية الأجور (WPS) وتحويل المبالغ للبنك',
          actor: 'مدير المحاسبة والمالية',
          durationHours: 2,
          inputsRequired: 'الملف المعتمد',
          outputProduced: 'إيصالات الصرف وإيداع الحسابات',
          controlCheck: 'مطابقة الهاش والتشفير الخاص بمنصة مدد / البنك'
        }
      ],
      outputs: ['مسير الرواتب المعتمد النهائي', 'ملف حماية الأجور WPS المعتمد', 'قيد المحاسبة الآلي للرواتب'],
      associatedForms: ['HR-FRM-001 (نموذج إشعار متغيرات رواتب)', 'HR-FRM-002 (نموذج اعتماد مسير الرواتب)'],
      recordsRetention: '10 سنوات في الأرشيف المالي والإداري',
      kpiCode: 'KPI-HR-001',
      riskCode: 'RSK-HR-001',
      slaTargetHours: 24,
      version: 'V2.0',
      reviewDate: '2026-01-15'
    },
    {
      sopCode: 'SOP-HR-002',
      title: 'إجراءات استقطاب وتعيين الموظفين الجدد',
      objective: 'تحديد خطوات طلب واستقطاب وإجراء المقابلات وتوقيع العقود للكوادر المتميزة.',
      scope: 'إدارة التوظيف والاستقطاب لجميع الوظائف الشاغرة.',
      ownerDepartment: 'قسم الاستقطاب والتوظيف',
      inputs: ['طلب احتياج وظيفي معتمد', 'بطاقة الوصف الوظيفي المعتمدة', 'الميزانية الشاغرة'],
      steps: [
        {
          stepNumber: 1,
          action: 'نشر الإعلان الوظيفي وتلقي السير الذاتية عبر البوابة',
          actor: 'أخصائي التوظيف',
          durationHours: 48,
          inputsRequired: 'الوصف الوظيفي والمعايير',
          outputProduced: 'القائمة الطويلة للCandidates',
          controlCheck: 'التأكد من توفر المهارات الدنيا المطلوبة'
        },
        {
          stepNumber: 2,
          action: 'إجراء المقابلات الأولية والفنية وإعداد نموذج التقييم',
          actor: 'لجنة التوظيف المكونة من الموارد البشرية ومدير الإدارة',
          durationHours: 12,
          inputsRequired: 'السير الذاتية المفرزة',
          outputProduced: 'القائمة القصيرة ونموذج التقييم المعياري',
          controlCheck: 'التأكد من توقيع أعضاء اللجنة على نموذج المقابلة'
        },
        {
          stepNumber: 3,
          action: 'إصدار العرض الوظيفي الرسمي وتوقيع العقد الموحد',
          actor: 'مدير التوظيف',
          durationHours: 24,
          inputsRequired: 'قرار الاعتماد من رئيس القطاع',
          outputProduced: 'العرض الوظيفي الموقّع + عقد العمل في القوى',
          controlCheck: 'مطابقة المزايا مع سلم الرواتب واللائحة'
        }
      ],
      outputs: ['عقد عمل معتمد', 'ملف موظف جديد مكتمل المستندات'],
      associatedForms: ['HR-FRM-003 (طلب احتياج وظيفي)', 'HR-FRM-004 (نموذج تقييم مقابلة وظيفية)'],
      recordsRetention: 'طيلة مدة خدمة الموظف + 10 سنوات بعد الانتهاء',
      kpiCode: 'KPI-HR-002',
      riskCode: 'RSK-HR-002',
      slaTargetHours: 120,
      version: 'V1.1',
      reviewDate: '2026-03-20'
    }
  ],

  riskRegister: [
    {
      riskCode: 'RSK-HR-001',
      description: 'تأخير صرف مسير الرواتب الشهرية عن الموعد المحدد (قبل 28 من الشهر)',
      cause: 'تأخر الإدارات في تسليم كشوفات الحضور أو خطأ في معالجة بيانات البصمة والإجازات',
      impactDescription: 'تأثر رضا الموظفين، إمكانية غرامات عدم الامتثال بنظام حماية الأجور',
      likelihoodRating: 2,
      impactRating: 4,
      riskScore: 8,
      riskLevel: 'متوسط',
      currentControls: 'جدول زمني صارم لإغلاق الإدخالات في يوم 20 من كل شهر',
      proposedControls: 'ربط آلي مباشر بين نظام الحضور الذكي ومحرك حساب الرواتب',
      riskOwner: 'رئيس قسم الرواتب والاستحقاقات',
      mitigationPlan: 'إرسال تذكيرات آلية للإدارات قبل يوم 18 من كل شهر لتأكيد البيانات',
      dueDate: '2026-10-01',
      residualRisk: 'منخفض جداً'
    },
    {
      riskCode: 'RSK-HR-002',
      description: 'انخفاض نسبة التوطين (السعودة) والدخول في النطاق الأصفر أو الأحمر',
      cause: 'استقالة مفاجئة لكوادر وطنية أو توسع في التعيين دون موازنة التوطين',
      impactDescription: 'توقف خدمات المنصات الحكومية، تعليق تأشيرات الاستقدام، إيقاف نقل الخدمة',
      likelihoodRating: 2,
      impactRating: 5,
      riskScore: 10,
      riskLevel: 'عالي',
      currentControls: 'متابعة أسبوعية لنسبة التوطين عبر منصة قوى ونطاقات',
      proposedControls: 'خطة إحلال وظيفي إلزامية وتوظيف احتياطي للوظائف القابلة للتوطين',
      riskOwner: 'مشرف العلاقات الحكومية والامتثال',
      mitigationPlan: 'الاحتفاظ بهامش توطين آمن لا يقل عن 5% فوق الحد الأدنى للنطاق الماسي',
      dueDate: 'مستمر شهرياً',
      residualRisk: 'متوسط مقبول'
    },
    {
      riskCode: 'RSK-HR-003',
      description: 'تسرب الموظفين أصحاب الكفاءات العالية (High Performers Turnover)',
      cause: 'عدم منافسة الأجور المباشرة أو نقص بيئة الحوافز والترقيات الوظيفية',
      impactDescription: 'فقدان المعرفة المؤسسية، انخفاض الإنتاجية، زيادة تكاليف الاستقطاب والتدريب',
      likelihoodRating: 3,
      impactRating: 4,
      riskScore: 12,
      riskLevel: 'عالي',
      currentControls: 'مراجعة سنوية للأداء وعقد مقابلة خروج الاستقالة (Exit Interview)',
      proposedControls: 'تحديث سلم الأجور والمزايا وإطلاق خطط التعاقب الوظيفي والاحتفاظ بالمواهب',
      riskOwner: 'مدير تطوير رأس المال البشري',
      mitigationPlan: 'تقديم مكافآت استبقاء مرتهنة بالإنتاجية ومسارات وظيفية واضحة',
      dueDate: '2026-12-31',
      residualRisk: 'متوسط'
    }
  ],

  kpiList: [
    {
      kpiCode: 'KPI-HR-001',
      name: 'معدل الدقة والانضباط الزمني لصرف الرواتب',
      definition: 'نسبة الأشهر التي تم فيها صرف الرواتب بدون أخطاء قبل اليوم 27 من الشهر.',
      target: 100,
      baseline: 91.6,
      actual: 100,
      achievementPercentage: 100,
      unit: '%',
      trend: 'مستقر',
      frequency: 'شهري',
      dataSource: 'تقارير الإيداع البنكي ومنصة مدد',
      ownerDepartment: 'قسم الرواتب والاستحقاقات',
      isLowerBetter: false,
      performanceLevel: 'ممتاز'
    },
    {
      kpiCode: 'KPI-HR-002',
      name: 'متوسط الزمن اللازم لشغل الوظيفة الشاغرة (Time to Hire)',
      definition: 'عدد الأيام المستغرقة ابتداءً من الاعتماد حتى توقيع العقد ومباشرة الموظف.',
      target: 30,
      baseline: 45,
      actual: 28,
      achievementPercentage: 107.1,
      unit: 'يوم',
      trend: 'صاعد',
      frequency: 'ربعي',
      dataSource: 'نظام إدارة التوظيف ATS وسجلات المباشرة',
      ownerDepartment: 'قسم الاستقطاب والتوظيف',
      isLowerBetter: true,
      performanceLevel: 'ممتاز'
    },
    {
      kpiCode: 'KPI-HR-003',
      name: 'معدل دوران الموظفين الإرادي السنوي',
      definition: 'نسبة الموظفين المستقيلين من إجمالي متوسط القوة العاملة.',
      target: 7,
      baseline: 11.2,
      actual: 6.4,
      achievementPercentage: 109.3,
      unit: '%',
      trend: 'صاعد',
      frequency: 'سنوي',
      dataSource: 'سجلات الموارد البشرية وقرارات تسوية الخدمة',
      ownerDepartment: 'إدارة العمليات وشؤون الموظفين',
      isLowerBetter: true,
      performanceLevel: 'ممتاز'
    },
    {
      kpiCode: 'KPI-HR-004',
      name: 'متوسط ساعات التدريب لكل موظف سنوياً',
      definition: 'مجموع ساعات التدريب المنفذة مقسومة على إجمالي عدد الموظفين.',
      target: 35,
      baseline: 20,
      actual: 38,
      achievementPercentage: 108.5,
      unit: 'ساعة / موظف',
      trend: 'صاعد',
      frequency: 'سنوي',
      dataSource: 'سجلات قسم التدريب والتطوير',
      ownerDepartment: 'قسم التدريب وإدارة الأداء',
      isLowerBetter: false,
      performanceLevel: 'ممتاز'
    }
  ],

  legislationLibrary: [
    {
      refCode: 'LEG-LBR-084',
      lawName: 'نظام العمل والعمال السعودي',
      lawType: 'نظام حكومي',
      refNumber: 'مرسوم ملكي رقم م/51',
      issueDate: '1426-08-23',
      effectiveDate: '1427-02-25',
      articleNumber: 'المادة 84',
      subject: 'مكافأة نهاية الخدمة في حالة إنهاء العقد من صاحب العمل',
      requirementSummary: 'يلتزم صاحب العمل بدفع مكافأة بواقع أجر نصف شهر عن كل سنة من السنوات الـ 5 الأولى، وأجر شهر عن كل سنة تالية.',
      institutionalApplication: 'محسوبة تلقائياً بمحرك المعادلات المدمج ومستندة بجميع حاسبات الخدمة.',
      complianceLevel: 'ملتزم بالكامل',
      responsibleOwner: 'قسم الرواتب والاستحقاقات',
      sourceUrl: 'https://hrsd.gov.sa/saudi-labor-law',
      reviewNeeded: false
    },
    {
      refCode: 'LEG-LBR-075',
      lawName: 'نظام العمل والعمال السعودي',
      lawType: 'نظام حكومي',
      refNumber: 'مرسوم ملكي رقم م/51',
      issueDate: '1426-08-23',
      effectiveDate: '1427-02-25',
      articleNumber: 'المادة 75',
      subject: 'مدة الإشعار بالإلغاء للعقود غير محددة المدة',
      requirementSummary: 'إذا كان العقد غير محدد المدة يجوز لأي من الطرفين إنهاؤه بناءً على سبب مشروع بموجب إشعار كتابي يرسل قبل 60 يوماً على الأقل.',
      institutionalApplication: 'منصوبة كشرط إجباري في نماذج إشعارات عدم التجديد والإنهاء.',
      complianceLevel: 'ملتزم بالكامل',
      responsibleOwner: 'الشؤون القانونية والموارد البشرية',
      reviewNeeded: false
    },
    {
      refCode: 'LEG-GOSI-001',
      lawName: 'نظام التأمينات الاجتماعية والفرع المهني',
      lawType: 'نظام حكومي',
      refNumber: 'نظام المؤسسة العامة للتأمينات',
      issueDate: '1421-03-01',
      effectiveDate: '1421-03-01',
      articleNumber: 'المادة 18 و 19',
      subject: 'نسب اشتراكات فرع الأخطار المهنية والمعاشات',
      requirementSummary: 'استقطاع 9.75% من أجر المشترك السعودي (معاشات) + 11.75% تحمّلها المؤسسة. والأجنبي 2% أخطار مهنية تحمّلها المؤسسة.',
      institutionalApplication: 'مدرجة تلقائياً في معادلة حساب الصافي وإقرارات المؤسسة.',
      complianceLevel: 'ملتزم بالكامل',
      responsibleOwner: 'قسم الرواتب والأجور',
      reviewNeeded: false
    }
  ],

  raciMatrix: [
    {
      processCode: 'PROC-HR-001',
      processName: 'إعداد واقتراح الميزانية التقديرية السنوية للوظائف والرواتب',
      responsibleRole: 'مدير عام الموارد البشرية',
      accountableRole: 'الرئيس التنفيذي (CEO)',
      consultedRole: 'مدراء القطاعات والمدير المالي',
      informedRole: 'مجلس الإدارة'
    },
    {
      processCode: 'PROC-HR-002',
      processName: 'الموافقة على تعيين الوظائف القيادية (مدير إدارة فما فوق)',
      responsibleRole: 'أخصائي أول التوظيف',
      accountableRole: 'الرئيس التنفيذي / لجنة الترشيحات',
      consultedRole: 'نائب الرئيس المباشر',
      informedRole: 'مدير شؤون الموظفين'
    },
    {
      processCode: 'PROC-HR-003',
      processName: 'إجراء تقييم الأداء السنوي ومراجعة العلاوات',
      responsibleRole: 'المدير المباشر لكل موظف',
      accountableRole: 'مدير تطوير رأس المال البشري',
      consultedRole: 'أخصائي الأداء',
      informedRole: 'جميع الموظفين المعنيين'
    }
  ],

  formsLibrary: [
    {
      formCode: 'HR-FRM-001',
      formName: 'نموذج طلب إجازة رسمية (سنوية / مرضية / اضطرارية)',
      version: 'V2.0',
      issueDate: '2026-01-01',
      department: 'عمليات الموارد البشرية',
      purpose: 'توثيق طلب الموظف للحصول على إجازة والتحقق من رصيده المتاح قبل الاعتماد.',
      fields: [
        { fieldName: 'الرقم الوظيفي واسم الموظف', fieldType: 'نص إجباري', isRequired: true, placeholder: 'EMP-000000' },
        { fieldName: 'نوع الإجازة', fieldType: 'قائمة خيارات', isRequired: true, placeholder: 'سنوية / مرضية / بدون راتب' },
        { fieldName: 'تاريخ بداية ونهاية الإجازة', fieldType: 'تاريخ', isRequired: true, placeholder: 'YYYY-MM-DD' },
        { fieldName: 'عدد الأيام المطلوبة', fieldType: 'رقم حاسوبي', isRequired: true, placeholder: 'أرقام فقط' },
        { fieldName: 'اسم وبيانات الموظف البديل', fieldType: 'نص اختيار', isRequired: false, placeholder: 'اسم الموظف المغطي' }
      ],
      instructions: 'يجب تقديم طلب الإجازة السنوية قبل 14 يوماً من تاريخ البدء المخطط له.',
      approvalChain: ['الموظف مقدم الطلب', 'المدير المباشر', 'أخصائي شؤون الموظفين (التحقق من الرصيد)', 'مدير الإدارة']
    },
    {
      formCode: 'HR-FRM-002',
      formName: 'نموذج اعتماد مسير الرواتب والأجور الشهري',
      version: 'V1.5',
      issueDate: '2026-01-01',
      department: 'قسم الرواتب والمالية',
      purpose: 'اعتماد المبالغ النهائية المطابقة لمسير الرواتب قبل تحويلها للبنوك.',
      fields: [
        { fieldName: 'الشهر والسنة المالية', fieldType: 'شهر/سنة', isRequired: true, placeholder: 'أغسطس 2026' },
        { fieldName: 'إجمالي مبلغ الرواتب الأساسية', fieldType: 'مبلغ مال', isRequired: true, placeholder: '0.00 SAR' },
        { fieldName: 'إجمالي البدلات والمزايا', fieldType: 'مبلغ مال', isRequired: true, placeholder: '0.00 SAR' },
        { fieldName: 'إجمالي الاستقطاعات والخصومات', fieldType: 'مبلغ مال', isRequired: true, placeholder: '0.00 SAR' },
        { fieldName: 'إجمالي الصافي المحول للبنوك', fieldType: 'مبلغ مال النهائي', isRequired: true, placeholder: '0.00 SAR' }
      ],
      instructions: 'يطبق بعد استكمال توقيعات الثلاثية الحوكمية (أخصائي الرواتب - مدير الموارد البشرية - المدير المالي).',
      approvalChain: ['معد المسير (رئيس الرواتب)', 'مدير عام الموارد البشرية', 'المدير المالي التنفيذي']
    }
  ],

  workPlan: [
    {
      taskCode: 'TSK-HR-001',
      activityName: 'تحديث سلم الرواتب وبطاقات الوصف الوظيفي لجميع القطاعات',
      responsibleName: 'فريق تطوير الموارد البشرية + استشاري فرعي',
      startDate: '2026-10-01',
      endDate: '2026-11-30',
      durationDays: 60,
      resources: 'ميزانية تطويرية + برامج التحليل الوظيفي',
      costSAR: 75000,
      status: 'لم يبدأ',
      completionPercentage: 0,
      associatedRisk: 'RSK-HR-003'
    },
    {
      taskCode: 'TSK-HR-002',
      activityName: 'أتمتة طلبات الإجازات ومسيرات حماية الأجور عبر المنصة الذكية',
      responsibleName: 'أخصائي تقنية المعلومات + أخصائي الرواتب',
      startDate: '2026-09-15',
      endDate: '2026-10-15',
      durationDays: 30,
      resources: 'محرك الربط البرمجي المدمج API',
      costSAR: 25000,
      status: 'قيد التنفيذ',
      completionPercentage: 45,
      associatedRisk: 'RSK-HR-001'
    }
  ],

  dataDictionary: [
    {
      fieldId: 'FLD_EMP_001',
      arabicName: 'الرقم الوظيفي',
      technicalName: 'EmployeeID',
      dataType: 'NVARCHAR',
      length: '20',
      isRequired: true,
      defaultValue: 'EMP-000000',
      dataSource: 'جدول الموظفين الأساسي HR_Employees',
      relatedTable: 'HR_Employees',
      validationRule: 'UNIQUE, NOT NULL, Pattern: EMP-[0-9]{6}',
      usageDescription: 'المعرف الموحد الرئيسي لكل موظف بكافة الملفات والأنظمة المالية والتشغيلية.'
    },
    {
      fieldId: 'FLD_SAL_002',
      arabicName: 'الراتب الأساسي الشهري',
      technicalName: 'BasicSalary',
      dataType: 'DECIMAL',
      length: '18,2',
      isRequired: true,
      defaultValue: '0.00',
      dataSource: 'عقد الموظف وسلّم الرواتب',
      relatedTable: 'HR_Payroll',
      validationRule: 'BasicSalary >= 3000',
      usageDescription: 'القيمة المالية المجردة التي تحسب بناءً عليها بدلات السكن ومكافأة نهاية الخدمة.'
    },
    {
      fieldId: 'FLD_GOS_003',
      arabicName: 'حصة استقطاع التأمينات (الموظف)',
      technicalName: 'GOSI_EmployeeDeduction',
      dataType: 'DECIMAL',
      length: '18,2',
      isRequired: true,
      defaultValue: '0.00',
      dataSource: 'محرك المعادلات القانونية FORM-HR-001',
      relatedTable: 'HR_Payroll',
      validationRule: '=(BasicSalary + HousingAllowance) * 0.0975',
      usageDescription: 'المبلغ النظامي المستقطع شهرياً من راتب الموظف السعودي لصالح المؤسسة العامة للتأمينات.'
    }
  ],

  userManual: {
    introduction: 'مرحباً بكم في دليل المستخدم الشامل الخاص بالنظام المؤسسي المتكامل لإدارة الموارد البشرية. يهدف هذا الدليل إلى تبسيط إدارة القوى العاملة ومسيرات الرواتب وتفعيل قواعد الامتثال والحوكمة.',
    systemObjectives: [
      'توحيد البنية المعرفية والهياكل التنظيمية لشؤون الموظفين.',
      'أتمتة وحوكمة إعداد وحساب مسيرات الرواتب الشهرية والبدلات بدقة متناهية.',
      'ضمان الالتزام الكامل بنظام العمل السعودي ومتطلبات التأمينات ونظام حماية الأجور.',
      'إدارة المخاطر التشغيلية والقانونية ومتابعة مؤشرات الأداء KPIs بصورة حية.',
      'تصدير كافّة مخرجات النظام إلى صيغ XLSX, DOCX, PDF, PPTX وحزم ZIP بضغطة زر واحدة.'
    ],
    setupInstructions: [
      {
        title: 'الخطوة الأولى: إعداد البيانات الأساسية للشركة',
        content: 'انتقل إلى تبويب "إعدادات المنصة" وقم بتعبئة اسم المؤسسة، الشعار، العملة الرسمية (SAR)، والافتراضات المالية.'
      },
      {
        title: 'الخطوة الثانية: تحديث بطاقات الهيكل التنظيمي والوظائف',
        content: 'قم بمراجعة قطاعات وإدارات الشركة، وأضف أو عدّل المسميات الوظيفية والأكواد الخاصة بها في شاشة الهيكل التنظيمي.'
      }
    ],
    dataEntryGuide: [
      {
        title: 'إدخال ومراجعة سجلات الموظفين والرواتب',
        content: 'استخدم شاشة "الموارد البشرية والرواتب" للتحكم بالرواتب الأساسية والبدلات وعقود الموظفين وتاريخ المباشرة.'
      }
    ],
    operationsGuide: [
      {
        title: 'تشغيل محرك الإجراءات SOP وحاسبة المعادلات',
        content: 'عند استحقاق صرف الشهر، افتح حاسبة المعادلات التشغيلية للتحقق من قيم الصافي واستقطاعات التأمينات ومكافآت الخدمة.'
      }
    ],
    reportsAndDashboardGuide: [
      {
        title: 'استخدام لوحة المعلومات التفاعلية ومركز التصدير',
        content: 'تعرض الشاشة الرئيسية بطاقات KPIs والنسب والمخاطر. اضغط على أزرار التصدير بالأعلى للحصول على ملفات الم خرجات الحقيقية.'
      }
    ],
    faqList: [
      {
        question: 'هل ملف Excel الناتج يحتوي على جداول وصيغ حقيقية أم مجرد قيم؟',
        answer: 'الملف الناتج عبر المنصة هو ملف XLSX حقيقي مبني بمكتبة ExcelJS يحتوي على أوراق عمل متعددة، صيغ رياضية (SUMIFS, IF, XLOOKUP)، وتنسيق شرطي وجداول منسقة جاهزة.'
      },
      {
        question: 'كيف يمكن تنزيل الحزمة المؤسسية الكاملة؟',
        answer: 'يمكنك اختيار زر "تنزيل الحزمة الكاملة (ZIP)" من مركز التصدير لإنشاء أرشيف مضغوط يحتوي على كافة مجلدات المشروع الـ 12.'
      }
    ]
  },

  executiveSummary: {
    overview: 'يمثل هذا النظام الحزمة المؤسسية القياسية الشاملة لإدارة وتحويل الموارد البشرية والمزايا لشؤون الموظفين بإنتاجية عالية وحوكمة متينة.',
    currentStatus: 'النظام في حالة "معتمد وجاهز للتشغيل والتصدير"، حيث تم فحص كافة الصيغ والجداول والهياكل بنجاح بنسبة 100%.',
    keyMetrics: [
      { label: 'إجمالي الموظفين المسجلين', value: '380 موظف', trend: '+5.2% سنوي' },
      { label: 'دقة مسير الرواتب والالتزام بالوقت', value: '100%', trend: 'ممتاز' },
      { label: 'نسبة تكلفة الموارد البشرية إلى OPEX', value: '38.5%', trend: 'ضمن النطاق المخطط' },
      { label: 'معدل دوران الموظفين الإرادي', value: '6.4%', trend: 'أقل من المستهدف (7%)' }
    ],
    keyRisks: [
      'تأخير رفع بيانات الحضور والغياب الشهرية يسبب ضغطاً على معالجة الرواتب.',
      'تغير نسب التوطين أو متطلبات المنصات الحكومية يتطلب استبقاء نسب آمنة.'
    ],
    keyRecommendations: [
      'تفعيل الربط الآلي الشامل لبيانات البصمة للحضور والغياب لمنع الإدخال اليدوي.',
      'تحديث سلم الرواتب والمزايا بشكل دوري كل عامين للمحافظة على جاذبية الشركة للمواهب.'
    ],
    actionPlanSummary: 'استكمال الربط الآلي خلال 30 يوماً وتدريب كافة مسؤولي الموارد البشرية على استخدام الأدلة المرفقة.'
  },

  qaReport: {
    overallScore: 98,
    passedCount: 18,
    warningCount: 1,
    errorCount: 0,
    reviewRequiredCount: 1,
    checks: [
      { category: 'الهيكل والترميز', checkItem: 'فحص عدم تكرار كود UID الوظائف والمستندات', status: 'PASSED', details: 'كافة الأكواد فريدة ومربوطة بنسق موحد (HR-EMP, SOP-HR, RSK-HR)' },
      { category: 'المعادلات والحسابات', checkItem: 'صحة صيغ Excel وقيم الرواتب والمستحقات', status: 'PASSED', details: 'تم التحقق من صيغ Excel وتطابق مخرجات الصافي مع المدخلات' },
      { category: 'التشريعات والامتثال', checkItem: 'مطابقة مواد نظام العمل والتأمينات', status: 'PASSED', details: 'المادتان 84 و 75 ونسب التأمينات مراجعة بالكامل' },
      { category: 'المراجع القانونية الخارجية', checkItem: 'فحص أرقام التعاميم الخارجية الخاصة بالطوارئ', status: 'REVIEW_REQUIRED', details: 'ينصح بالمراجعة القانونية السنوية الدورية للتعاميم المستجدة' },
      { category: 'التنسيق والاتجاه', checkItem: 'فحص اتجاه الواجهات وتنسيق الطباعة RTL', status: 'PASSED', details: 'جميع الجداول والملفات RTL وجاهزة للطباعة والتصدير' }
    ],
    qaDate: '2026-09-11',
    status: 'جاهز للتصدير'
  }
};

export const DEMO_HR_SYSTEM: InstitutionalSystem = enrichSystemWithComprehensiveEngine(RAW_DEMO_HR_SYSTEM);

