import { InstitutionalSystem, ProjectDefinition } from '../types/institutional';
import { createInstitutionalSystemFromPrompt } from './generatorEngine';

export async function generateSystemWithAI(
  promptText: string,
  overrides?: Partial<ProjectDefinition>
): Promise<InstitutionalSystem> {
  try {
    const response = await fetch('/api/generate-system', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptText,
        domain: overrides?.domain,
        scope: overrides?.scope,
        levelOfDetail: overrides?.levelOfDetail,
        orgType: overrides?.orgType,
      }),
    });

    if (!response.ok) {
      console.warn('Backend AI route unavailable, falling back to instant structural generator.');
      return createInstitutionalSystemFromPrompt(promptText, overrides);
    }

    const result = await response.json();
    if (result.success && result.data) {
      // Merge AI result with structured generator base to guarantee all 20+ tabs are populated
      const baseSystem = createInstitutionalSystemFromPrompt(promptText, overrides);
      
      const aiData = result.data;
      if (aiData.projectDefinition?.projectName) {
        baseSystem.projectDefinition.projectName = aiData.projectDefinition.projectName;
      }
      if (aiData.projectDefinition?.goal) {
        baseSystem.projectDefinition.goal = aiData.projectDefinition.goal;
      }
      if (aiData.dictionary && Array.isArray(aiData.dictionary) && aiData.dictionary.length > 0) {
        baseSystem.dictionary = aiData.dictionary;
      }
      if (aiData.formulas && Array.isArray(aiData.formulas) && aiData.formulas.length > 0) {
        baseSystem.formulas = aiData.formulas;
      }
      if (aiData.sopLibrary && Array.isArray(aiData.sopLibrary) && aiData.sopLibrary.length > 0) {
        baseSystem.sopLibrary = aiData.sopLibrary;
      }
      if (aiData.riskRegister && Array.isArray(aiData.riskRegister) && aiData.riskRegister.length > 0) {
        baseSystem.riskRegister = aiData.riskRegister;
      }
      if (aiData.kpiList && Array.isArray(aiData.kpiList) && aiData.kpiList.length > 0) {
        baseSystem.kpiList = aiData.kpiList;
      }
      if (aiData.chartOfAccounts && Array.isArray(aiData.chartOfAccounts) && aiData.chartOfAccounts.length > 0) {
        baseSystem.chartOfAccounts = aiData.chartOfAccounts;
      }
      if (aiData.executiveSummary?.overview) {
        baseSystem.executiveSummary.overview = aiData.executiveSummary.overview;
      }

      return baseSystem;
    } else {
      return createInstitutionalSystemFromPrompt(promptText, overrides);
    }
  } catch (err) {
    console.error('Error during AI generation call, using structural generator fallback:', err);
    return createInstitutionalSystemFromPrompt(promptText, overrides);
  }
}
