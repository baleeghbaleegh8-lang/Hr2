export type ScopeComplexity = 'مختصر' | 'أساسي' | 'متقدم' | 'احترافي' | 'مؤسسي شامل' | 'موسوعي';

export interface ProjectDefinition {
  projectName: string;
  domain: string;
  sector: string;
  orgType: string;
  orgSize: string; // e.g. "100-500 موظف"
  targetUsers: string[];
  goal: string;
  scope: string;
  complexity: ScopeComplexity;
  levelOfDetail: string;
  fileTypes: ('XLSX' | 'DOCX' | 'PDF' | 'PPTX' | 'CSV' | 'JSON' | 'ZIP')[];
  language: string;
  direction: 'RTL' | 'LTR';
  themeColor: string;
}

export interface JobTitle {
  title: string;
  code: string;
  level: 'قيادي' | 'إشرافي' | 'تنفيذي' | 'تخصصي';
  count: number;
  reportTo: string;
  responsibilities: string[];
  qualifications: string;
}

export interface SectionUnit {
  name: string;
  code: string;
  unitName: string;
  jobTitles: JobTitle[];
}

export interface Department {
  name: string;
  code: string;
  deptHead: string;
  sections: SectionUnit[];
}

export interface Sector {
  name: string;
  code: string;
  leadTitle: string;
  departments: Department[];
}

export interface OrgStructure {
  companyName: string;
  totalEmployeesCount: number;
  boardChair: string;
  ceoTitle: string;
  sectors: Sector[];
}

export interface DictionaryItem {
  code: string;
  term: string;
  englishTerm: string;
  abbreviation: string;
  shortDefinition: string;
  detailedDefinition: string;
  domain: string;
  category: string;
  termType: string;
  relatedTerms: string[];
  synonyms: string[];
  antonyms?: string[];
  usageExample: string;
  sourceReference: string;
  notes?: string;
}

export interface ItemTerminology {
  uid: string; // e.g., HR-EMP-001
  category: string;
  title: string;
  description: string;
  department: string;
  level: string;
  standardCode: string;
}

export interface FormulaItem {
  code: string;
  name: string;
  description: string;
  inputs: string[];
  calculationMethod: string;
  mathFormula: string;
  excelFormula: string;
  unit: string;
  sampleResult: number | string;
  minThreshold: number;
  maxThreshold: number;
  acceptableLevel: string;
  warningLevel: string;
  riskLevel: string;
  practicalExample: string;
  sourceReference: string;
}

export interface DatePeriodItem {
  code: string;
  title: string;
  periodType: 'أيام' | 'أسابيع' | 'أشهر' | 'سنوات' | 'فترة مالية';
  defaultDurationDays: number;
  startDateField: string;
  endDateField: string;
  slaTargetDays: number;
  retentionYears: number;
  renewalNoticeDays: number;
  notes: string;
}

export interface GovernancePrinciple {
  code: string;
  principle: string;
  description: string;
  responsibleBody: string;
  controlMechanism: string;
  complianceEvidence: string;
}

export interface AuthorityMatrixItem {
  processCode: string;
  processName: string;
  department: string;
  boardAuthority: 'اعتماد' | 'مراجعة' | 'علم' | '-';
  ceoAuthority: 'اعتماد' | 'توصية' | 'مراجعة' | 'تنفيذ';
  vpAuthority: 'توصية' | 'مراجعة' | 'تنفيذ' | '-';
  deptHeadAuthority: 'تنفيذ' | 'مراجعة' | 'توصية' | '-';
  financialThresholdSAR: number | string;
}

export interface HREmployeeRecord {
  empCode: string;
  fullName: string;
  jobTitle: string;
  department: string;
  hireDate: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  totalSalary: number;
  contractType: string;
  annualLeaveBalanceDays: number;
  status: 'نشط' | 'في إجازة' | 'إنهاء خدمة';
}

export interface ChartOfAccount {
  accountCode: string;
  accountName: string;
  englishName: string;
  accountType: 'أصول' | 'التزامات' | 'حقوق ملكية' | 'إيرادات' | 'مصروفات';
  category: string;
  parentCode: string | null;
  isHeader: boolean;
  normalBalance: 'مدينة' | 'دائنة';
  budgetAllocation: number;
}

export interface ProcurementItem {
  prCode: string;
  description: string;
  requestingDept: string;
  vendorName: string;
  poAmount: number;
  orderDate: string;
  deliveryDate: string;
  status: 'طلب شراء' | 'مقارنة عروض' | 'أمر شراء' | 'مكتمل' | 'ملغى';
  contractTermMonths: number;
}

export interface SOPStep {
  stepNumber: number;
  action: string;
  actor: string;
  durationHours: number;
  inputsRequired: string;
  outputProduced: string;
  controlCheck: string;
}

export interface SOPItem {
  sopCode: string; // e.g. SOP-HR-001
  title: string;
  objective: string;
  scope: string;
  ownerDepartment: string;
  inputs: string[];
  steps: SOPStep[];
  outputs: string[];
  associatedForms: string[];
  recordsRetention: string;
  kpiCode: string;
  riskCode: string;
  slaTargetHours: number;
  version: string;
  reviewDate: string;
}

export interface RiskItem {
  riskCode: string; // e.g. RSK-HR-001
  description: string;
  cause: string;
  impactDescription: string;
  likelihoodRating: number; // 1 to 5
  impactRating: number; // 1 to 5
  riskScore: number; // calculated Likelihood x Impact
  riskLevel: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
  currentControls: string;
  proposedControls: string;
  riskOwner: string;
  mitigationPlan: string;
  dueDate: string;
  residualRisk: string;
}

export interface KPIItem {
  kpiCode: string; // e.g. KPI-HR-001
  name: string;
  definition: string;
  target: number;
  baseline: number;
  actual: number;
  achievementPercentage: number; // (Actual/Target) * 100 or reverse
  unit: string;
  trend: 'صاعد' | 'مستقر' | 'هابط';
  frequency: 'شهري' | 'ربعي' | 'سنوي';
  dataSource: string;
  ownerDepartment: string;
  isLowerBetter: boolean;
  performanceLevel: 'ممتاز' | 'جيد جداً' | 'تحذير' | 'حرج';
}

export interface LegislationItem {
  refCode: string;
  lawName: string;
  lawType: 'نظام حكومي' | 'لائحة تنفيذية' | 'معيار جودة' | 'سياسة داخلية';
  refNumber: string;
  issueDate: string;
  effectiveDate: string;
  articleNumber: string;
  subject: string;
  requirementSummary: string;
  institutionalApplication: string;
  complianceLevel: 'ملتزم بالكامل' | 'التزام جزئي' | 'قيد المراجعة' | 'بحاجة إلى مصدر موثوق/مراجعة قانونية';
  responsibleOwner: string;
  sourceUrl?: string;
  reviewNeeded: boolean;
}

export interface RACIRow {
  processCode: string;
  processName: string;
  responsibleRole: string; // R
  accountableRole: string; // A
  consultedRole: string; // C
  informedRole: string; // I
}

export interface FormTemplate {
  formCode: string; // e.g. HR-FRM-001
  formName: string;
  version: string;
  issueDate: string;
  department: string;
  purpose: string;
  fields: { fieldName: string; fieldType: string; isRequired: boolean; placeholder: string }[];
  instructions: string;
  approvalChain: string[];
}

export interface WorkPlanTask {
  taskCode: string;
  activityName: string;
  responsibleName: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  resources: string;
  costSAR: number;
  status: 'لم يبدأ' | 'قيد التنفيذ' | 'مكتمل' | 'متأخر';
  completionPercentage: number;
  associatedRisk: string;
}

export interface DataDictionaryField {
  fieldId: string;
  arabicName: string;
  technicalName: string;
  dataType: 'NVARCHAR' | 'INTEGER' | 'DECIMAL' | 'DATE' | 'BOOLEAN' | 'ENUM';
  length: string;
  isRequired: boolean;
  defaultValue: string;
  dataSource: string;
  relatedTable: string;
  validationRule: string;
  usageDescription: string;
}

export interface QACheckResult {
  category: string;
  checkItem: string;
  status: 'PASSED' | 'WARNING' | 'ERROR' | 'REVIEW_REQUIRED';
  details: string;
  fixable?: boolean;
  affectedCodes?: string[];
  recommendation?: string;
}

export interface QASignature {
  signerName: string;
  signerTitle: string;
  signerDepartment: string;
  signedAt: string;
  signatureHash: string;
  signatureDataUrl?: string;
  approvalStatus: 'معتمد' | 'معتمد بشرط' | 'قيد المراجعة';
  notes?: string;
}

export interface QualityReport {
  overallScore: number;
  passedCount: number;
  warningCount: number;
  errorCount: number;
  reviewRequiredCount: number;
  checks: QACheckResult[];
  qaDate: string;
  status: 'جاهز للتصدير' | 'يتطلب مراجعة';
  signature?: QASignature;
}

export interface UserManualSection {
  title: string;
  content: string;
  steps?: string[];
}

export interface UserManual {
  introduction: string;
  systemObjectives: string[];
  setupInstructions: UserManualSection[];
  dataEntryGuide: UserManualSection[];
  operationsGuide: UserManualSection[];
  reportsAndDashboardGuide: UserManualSection[];
  faqList: { question: string; answer: string }[];
}

export interface ExecutiveSummary {
  overview: string;
  currentStatus: string;
  keyMetrics: { label: string; value: string; trend: string }[];
  keyRisks: string[];
  keyRecommendations: string[];
  actionPlanSummary: string;
}

export interface InstitutionalSystem {
  id: string;
  uid: string;
  projectDefinition: ProjectDefinition;
  version: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  approvalStatus: 'مسودة' | 'قيد المراجعة' | 'معتمد' | 'مؤرشف';
  
  // Modules
  orgStructure: OrgStructure;
  dictionary: DictionaryItem[];
  items: ItemTerminology[];
  formulas: FormulaItem[];
  datePeriods: DatePeriodItem[];
  governancePrinciples: GovernancePrinciple[];
  authorityMatrix: AuthorityMatrixItem[];
  hrEmployees: HREmployeeRecord[];
  chartOfAccounts: ChartOfAccount[];
  procurementOrders: ProcurementItem[];
  sopLibrary: SOPItem[];
  riskRegister: RiskItem[];
  kpiList: KPIItem[];
  legislationLibrary: LegislationItem[];
  raciMatrix: RACIRow[];
  formsLibrary: FormTemplate[];
  workPlan: WorkPlanTask[];
  dataDictionary: DataDictionaryField[];
  userManual: UserManual;
  executiveSummary: ExecutiveSummary;
  qaReport: QualityReport;

  // Comprehensive Institutional Content Engine Modules (Requirements 144 - 243)
  missingRequirementsMatrix?: MissingRequirementItem[];
  masterIndex?: MasterIndexEntry[];
  policiesLibrary?: PolicyDocument[];
  slaLibrary?: SLAItem[];
  databaseTables?: DatabaseTableDefinition[];
  complianceRegister?: ComplianceRegisterItem[];
  capaRecords?: CAPARecord[];
  strategicFramework?: StrategicFramework;
  scenarioAnalysis?: ScenarioAnalysis;
  businessRules?: BusinessRuleItem[];
  workflowSteps?: WorkflowStepItem[];
  productModeConfig?: ProductModeConfig;
  completionCertificate?: ProjectCompletionCertificate;
}

export interface MissingRequirementItem {
  id: string;
  requirement: string;
  importance: 'ضروري للإكمال' | 'اختياري' | 'يحتاج مراجعة' | 'متغير حسب النظام';
  availabilityStatus: 'متوفر' | 'غير متوفر' | 'تحتاج مراجعة' | 'تحتاج إدخال المستخدم' | 'تحتاج مصدر';
  source: string;
  actionRequired: string;
  category: string;
}

export interface MasterIndexEntry {
  id: string;
  code: string;
  mainCategory: string;
  subCategory: string;
  title: string;
  description: string;
  contentType: 'سياسة' | 'SOP' | 'نموذج' | 'مؤشر KPI' | 'معادلة' | 'مخاطرة' | 'جدول' | 'مستند';
  sourceAttribution: 'FACT' | 'RULE' | 'CALCULATION' | 'ASSUMPTION' | 'RECOMMENDATION' | 'EXAMPLE' | 'USER DATA';
  status: 'نشط' | 'مسودة' | 'تحت المراجعة';
  version: string;
  lastUpdated: string;
  internalLink: string;
}

export interface PolicyDocument {
  policyCode: string;
  title: string;
  objective: string;
  scope: string;
  principles: string[];
  definitions: { term: string; def: string }[];
  responsibilities: string[];
  authorities: string[];
  rules: string[];
  exceptions: string[];
  controls: string[];
  violationsAndPenalties: string[];
  references: string[];
  forms: string[];
  effectiveDate: string;
  reviewCycle: string;
  approvalBody: string;
}

export interface SLAItem {
  serviceCode: string;
  serviceName: string;
  serviceLevel: 'عادي' | 'مرتفع' | 'حرج';
  responseTimeHours: number;
  completionTimeHours: number;
  workingHours: string;
  workingDays: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  exceptions: string;
  escalationPoint: string;
  associatedKpiCode: string;
  penaltiesOrConsequences: string;
}

export interface DatabaseTableDefinition {
  tableName: string;
  technicalTableName: string;
  tableType: 'Master Data' | 'Transaction' | 'Lookup' | 'Log';
  primaryKey: string;
  foreignKeys: { field: string; referencesTable: string; referencesField: string }[];
  description: string;
  fields: DataDictionaryField[];
}

export interface ComplianceRegisterItem {
  complianceId: string;
  refCode: string;
  requirement: string;
  responsibleOwner: string;
  frequency: string;
  dueDate: string;
  status: 'ملتزم بالكامل' | 'التزام جزئي' | 'قيد المراجعة' | 'غير ملتزم';
  evidence: string;
  riskLevel: string;
  correctiveAction: string;
}

export interface CAPARecord {
  capaId: string;
  issueTitle: string;
  rootCauseMethod: '5 Whys' | 'Fishbone (Ishikawa)' | 'RCA Matrix';
  rootCauseDetails: string[];
  correctiveAction: string;
  preventiveAction: string;
  owner: string;
  targetDate: string;
  status: 'مفتوح' | 'قيد التنفيذ' | 'مغلق ومحقق';
}

export interface StrategicFramework {
  vision: string;
  mission: string;
  coreValues: string[];
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  pestel: { political: string[]; economic: string[]; social: string[]; technological: string[]; environmental: string[]; legal: string[] };
  bscPerspectives: {
    financial: string[];
    customer: string[];
    internalProcesses: string[];
    learningAndGrowth: string[];
  };
  okrList: { objective: string; keyResults: string[]; initiatives: string[]; owner: string; progressPct: number }[];
}

export interface ScenarioAnalysis {
  baseCase: { revenueSAR: number; costSAR: number; profitSAR: number; roiPct: number; notes: string };
  bestCase: { revenueSAR: number; costSAR: number; profitSAR: number; roiPct: number; notes: string };
  worstCase: { revenueSAR: number; costSAR: number; profitSAR: number; roiPct: number; notes: string };
}

export interface BusinessRuleItem {
  ruleId: string;
  title: string;
  condition: string;
  action: string;
  priority: 'عالية جداً' | 'عالية' | 'متوسطة' | 'عادية';
  effectiveDate: string;
  status: 'نشط' | 'معطل';
  ownerDepartment: string;
}

export interface WorkflowStepItem {
  stepOrder: number;
  stepName: string;
  actorRole: string;
  condition: string;
  ifApproved: string;
  ifRejected: string;
  escalationHours: number;
}

export interface ProductModeConfig {
  isProductMode: boolean;
  productName: string;
  productTagline: string;
  targetAudience: string;
  licenseType: 'ترخيص مؤسسي أحادي' | 'ترخيص متعدد الفروع' | 'قالب مفتوح';
  readmeGuide: string;
  storeLandingSpecs: string;
}

export interface ProjectCompletionCertificate {
  certificateId: string;
  issuedAt: string;
  overallCompletionPct: number;
  verificationChecklist: { checkName: string; passed: boolean; note: string }[];
  evaluations: { dimension: string; score: number; status: 'ممتاز' | 'مقبول' | 'تحت المراجعة'; comments: string }[];
  status: 'مشروع مكتمل 100%' | 'مشروع مكتمل مع تنبيهات' | 'يتطلب معالجة النواقص';
}

