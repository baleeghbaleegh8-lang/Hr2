export interface SystemTemplate {
  templateId: string; // e.g., TPL-001
  name: string;
  category: 'الموارد البشرية' | 'الحوكمة والمخاطر' | 'المالية والمشتريات' | 'العمليات والجودة' | 'تخصصي';
  version: string;
  language: string;
  pageSize: 'A4' | 'Letter';
  orientation: 'عمودي' | 'أفقي';
  themeColor: string;
  description: string;
  defaultSections: string[];
  outputTypes: ('XLSX' | 'DOCX' | 'PDF' | 'PPTX' | 'ZIP')[];
  isCustom: boolean;
}

const DEFAULT_TEMPLATES: SystemTemplate[] = [
  {
    templateId: 'TPL-001',
    name: 'قالب الموارد البشرية وهياكل الرواتب المعيارية',
    category: 'الموارد البشرية',
    version: '1.0',
    language: 'العربية',
    pageSize: 'A4',
    orientation: 'عمودي',
    themeColor: '#d97706', // Amber
    description: 'قالب مؤسسي متكامل يحتوي على سلم الرواتب، البدلات، حاسبة المادة 84، ودليل الإجراءات.',
    defaultSections: ['الهيكل التنظيمي', 'قاموس المصطلحات', 'سجل الرواتب', 'الإجراءات SOPs', 'المخاطر'],
    outputTypes: ['XLSX', 'DOCX', 'PDF', 'PPTX', 'ZIP'],
    isCustom: false
  },
  {
    templateId: 'TPL-002',
    name: 'قالب الحوكمة ومصفوفة تفويض الصلاحيات (DOA)',
    category: 'الحوكمة والمخاطر',
    version: '1.2',
    language: 'العربية',
    pageSize: 'A4',
    orientation: 'أفقي',
    themeColor: '#2563eb', // Blue
    description: 'قالب مخصص للشركات المساهمة والقابضة لتحديد صلاحيات مجلس الإدارة والرئيس التنفيذي.',
    defaultSections: ['مبادئ الحوكمة', 'مصفوفة التفويض DOA', 'مصفوفة المساءلة RACI', 'التشريعات'],
    outputTypes: ['XLSX', 'DOCX', 'PDF', 'ZIP'],
    isCustom: false
  },
  {
    templateId: 'TPL-003',
    name: 'قالب دليل الحسابات المالي والمشتريات الشجري',
    category: 'المالية والمشتريات',
    version: '2.0',
    language: 'العربية',
    pageSize: 'A4',
    orientation: 'عمودي',
    themeColor: '#059669', // Emerald
    description: 'دليل حسابات شجري خماسي المستويات مع أوامر الشراء ومحرك معادلات الكفاءة المالية.',
    defaultSections: ['دليل الحسابات COA', 'أوامر المشتريات', 'المعادلات المالية', 'مؤشرات الأداء KPIs'],
    outputTypes: ['XLSX', 'DOCX', 'PDF', 'ZIP'],
    isCustom: false
  }
];

class TemplateEngineService {
  private templates: SystemTemplate[] = [...DEFAULT_TEMPLATES];

  public getTemplates(): SystemTemplate[] {
    return this.templates;
  }

  public getTemplateById(id: string): SystemTemplate | undefined {
    return this.templates.find(t => t.templateId === id);
  }

  public addCustomTemplate(tpl: Omit<SystemTemplate, 'templateId' | 'isCustom'>): SystemTemplate {
    const newId = `TPL-CUST-${String(this.templates.length + 1).padStart(3, '0')}`;
    const newTpl: SystemTemplate = {
      ...tpl,
      templateId: newId,
      isCustom: true
    };
    this.templates.push(newTpl);
    return newTpl;
  }
}

export const templateEngine = new TemplateEngineService();
