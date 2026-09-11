export type AIProvider = 'Gemini (Google)' | 'OpenAI (GPT-4o)' | 'Anthropic (Claude 3.5)';

export interface AIUsageLog {
  id: string;
  timestamp: string;
  provider: AIProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costSAR: number;
  status: 'نجاح' | 'إخفاق' | 'تم استخدام المحرك المدمج';
  promptSnippet: string;
}

class AIOrchestratorService {
  private currentProvider: AIProvider = 'Gemini (Google)';
  private usageLogs: AIUsageLog[] = [
    {
      id: 'LOG-001',
      timestamp: new Date().toISOString(),
      provider: 'Gemini (Google)',
      model: 'gemini-3.8-flash',
      promptTokens: 1250,
      completionTokens: 3400,
      totalTokens: 4650,
      costSAR: 0.08,
      status: 'نجاح',
      promptSnippet: 'توليد نظام الموارد البشرية والرواتب للمجموعة المؤسسية'
    }
  ];

  public getProvider(): AIProvider {
    return this.currentProvider;
  }

  public setProvider(provider: AIProvider) {
    this.currentProvider = provider;
  }

  public logUsage(log: Omit<AIUsageLog, 'id' | 'timestamp'>) {
    const newEntry: AIUsageLog = {
      ...log,
      id: `LOG-${String(this.usageLogs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString()
    };
    this.usageLogs.unshift(newEntry);
  }

  public getUsageLogs(): AIUsageLog[] {
    return this.usageLogs;
  }

  public getTotalCostSAR(): number {
    return Number(this.usageLogs.reduce((acc, l) => acc + l.costSAR, 0).toFixed(2));
  }

  public getTotalTokens(): number {
    return this.usageLogs.reduce((acc, l) => acc + l.totalTokens, 0);
  }
}

export const aiOrchestrator = new AIOrchestratorService();
