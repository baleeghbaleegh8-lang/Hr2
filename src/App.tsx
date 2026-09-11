import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { DashboardView } from './components/DashboardView';
import { AnalysisWizardModal } from './components/AnalysisWizardModal';
import { ProjectPreviewModal } from './components/ProjectPreviewModal';
import { InstitutionalWorkspace } from './components/InstitutionalWorkspace';
import { ImportFileModal } from './components/ImportFileModal';
import { SettingsDrawer } from './components/SettingsDrawer';
import { DeveloperConsoleModal } from './components/DeveloperConsoleModal';
import { TemplateBuilderModal } from './components/TemplateBuilderModal';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { RegenerationPanelModal } from './components/RegenerationPanelModal';
import { QAReportModal } from './components/QAReportModal';

import { InstitutionalSystem, ProjectDefinition } from './types/institutional';
import { DEMO_HR_SYSTEM } from './services/defaultHRSystem';
import { generateSystemWithAI } from './services/geminiService';
import { ImportAnalysisResult } from './services/importAnalyzerService';

export function App() {
  const [activeSystem, setActiveSystem] = useState<InstitutionalSystem | null>(DEMO_HR_SYSTEM);
  const [viewState, setViewState] = useState<'DASHBOARD' | 'WORKSPACE'>('WORKSPACE');
  
  // Modals
  const [showAnalysisWizard, setShowAnalysisWizard] = useState(false);
  const [wizardPrompt, setWizardPrompt] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSystem, setPreviewSystem] = useState<InstitutionalSystem | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // New Engineering & Architectural Modals
  const [showDeveloperConsole, setShowDeveloperConsole] = useState(false);
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [showRegenerationPanel, setShowRegenerationPanel] = useState(false);
  const [showQAModal, setShowQAModal] = useState(false);

  // Trigger generator from dashboard
  const handleStartGenerator = (prompt: string) => {
    setWizardPrompt(prompt);
    setShowAnalysisWizard(true);
  };

  // Confirm generate from wizard
  const handleConfirmGenerate = async (prompt: string, overrides: Partial<ProjectDefinition>) => {
    setShowAnalysisWizard(false);
    
    // Call AI / Structural Engine
    const generated = await generateSystemWithAI(prompt, overrides);
    setPreviewSystem(generated);
    setShowPreviewModal(true);
  };

  // Confirm preview -> open workspace
  const handleConfirmOpenWorkspace = () => {
    if (previewSystem) {
      setActiveSystem(previewSystem);
      setViewState('WORKSPACE');
      setShowPreviewModal(false);
    }
  };

  // Load DEMO Project
  const handleLoadDemo = () => {
    setActiveSystem(DEMO_HR_SYSTEM);
    setViewState('WORKSPACE');
  };

  // New system -> go to dashboard
  const handleNewSystem = () => {
    setViewState('DASHBOARD');
  };

  // Import file success
  const handleImportSuccess = (result: ImportAnalysisResult) => {
    setShowImportModal(false);
    setActiveSystem(result.restructuredSystem);
    setViewState('WORKSPACE');
  };

  // Scope adjustment / partial regeneration
  const handleApplyAdjustment = (instruction: string) => {
    if (!activeSystem) return;
    const updated = {
      ...activeSystem,
      updatedAt: new Date().toISOString(),
      executiveSummary: {
        ...activeSystem.executiveSummary,
        overview: `${activeSystem.executiveSummary.overview}\n\nتعديل نطاقي حديث: ${instruction}`
      }
    };
    setActiveSystem(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased dir-rtl text-right">
      
      {/* Top Header */}
      <HeaderNav
        activeSystem={activeSystem}
        onOpenSettings={() => setShowSettingsDrawer(true)}
        onOpenImport={() => setShowImportModal(true)}
        onLoadDemo={handleLoadDemo}
        onNewSystem={handleNewSystem}
        onOpenDeveloperConsole={() => setShowDeveloperConsole(true)}
        onOpenTemplateBuilder={() => setShowTemplateBuilder(true)}
        onOpenDocumentPreview={() => setShowDocumentPreview(true)}
        onOpenRegenerationPanel={() => setShowRegenerationPanel(true)}
        onOpenQAModal={() => setShowQAModal(true)}
      />

      {/* Main View Area */}
      {viewState === 'DASHBOARD' || !activeSystem ? (
        <DashboardView
          onStartGenerator={handleStartGenerator}
          onLoadDemo={handleLoadDemo}
          onOpenImport={() => setShowImportModal(true)}
        />
      ) : (
        <InstitutionalWorkspace
          system={activeSystem}
          onUpdateSystem={(updated) => setActiveSystem(updated)}
          onNewSystem={handleNewSystem}
          onOpenQAModal={() => setShowQAModal(true)}
        />
      )}

      {/* Requirement Analysis Wizard Modal */}
      {showAnalysisWizard && (
        <AnalysisWizardModal
          initialPrompt={wizardPrompt}
          onClose={() => setShowAnalysisWizard(false)}
          onConfirmGenerate={handleConfirmGenerate}
        />
      )}

      {/* Project Preview Modal */}
      {showPreviewModal && previewSystem && (
        <ProjectPreviewModal
          system={previewSystem}
          onClose={() => setShowPreviewModal(false)}
          onConfirmOpenWorkspace={handleConfirmOpenWorkspace}
        />
      )}

      {/* File Import Modal */}
      {showImportModal && (
        <ImportFileModal
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
        />
      )}

      {/* Settings Drawer */}
      {showSettingsDrawer && (
        <SettingsDrawer onClose={() => setShowSettingsDrawer(false)} />
      )}

      {/* Developer Console & Architecture Drawer */}
      {showDeveloperConsole && (
        <DeveloperConsoleModal onClose={() => setShowDeveloperConsole(false)} />
      )}

      {/* Dynamic Template Builder Modal */}
      {showTemplateBuilder && (
        <TemplateBuilderModal onClose={() => setShowTemplateBuilder(false)} />
      )}

      {/* Interactive Document Preview Modal */}
      {showDocumentPreview && activeSystem && (
        <DocumentPreviewModal
          system={activeSystem}
          onClose={() => setShowDocumentPreview(false)}
        />
      )}

      {/* Scope Adjustment & Regeneration Panel Modal */}
      {showRegenerationPanel && activeSystem && (
        <RegenerationPanelModal
          system={activeSystem}
          onClose={() => setShowRegenerationPanel(false)}
          onApplyAdjustment={handleApplyAdjustment}
        />
      )}

      {/* QA Report & Auto-Fix Modal */}
      {showQAModal && activeSystem && (
        <QAReportModal
          system={activeSystem}
          onClose={() => setShowQAModal(false)}
          onUpdateSystem={(updated) => setActiveSystem(updated)}
        />
      )}

    </div>
  );
}

export default App;
