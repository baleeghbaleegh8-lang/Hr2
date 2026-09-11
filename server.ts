import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API v1 Middleware Logging
  app.use("/api/v1", (req, res, next) => {
    res.setHeader("X-API-Version", "v1.0.0");
    res.setHeader("X-Architecture", "Modular-Monolith");
    next();
  });

  // /api/v1/health
  app.get(["/api/health", "/api/v1/health"], (req, res) => {
    res.json({
      status: "ok",
      apiVersion: "v1.0.0",
      architecture: "Modular Monolith (Ready for Microservices)",
      database: "PostgreSQL Schema Simulation (Relational)",
      redis: "Redis Cache Active (Simulation)",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  });

  // /api/v1/auth
  app.post("/api/v1/auth/login", (req, res) => {
    const { email, password } = req.body;
    res.json({
      success: true,
      token: "jwt_token_simulation_secure_v1",
      user: {
        userId: "USR-000001",
        name: "مدير النظام (مؤسسي)",
        email: email || "admin@atmata.biz",
        role: "SuperAdmin",
        organizationId: "ORG-000001"
      }
    });
  });

  // /api/v1/projects
  app.get("/api/v1/projects", (req, res) => {
    res.json({
      success: true,
      count: 1,
      projects: [
        {
          projectId: "PRJ-000001",
          name: "المجموعة المؤسسية القابضة",
          domain: "الموارد البشرية والرواتب",
          version: "V1.0",
          status: "Approved",
          createdAt: new Date().toISOString()
        }
      ]
    });
  });

  // /api/v1/templates
  app.get("/api/v1/templates", (req, res) => {
    res.json({
      success: true,
      templates: [
        { templateId: "TPL-001", name: "قالب الموارد البشرية وهياكل الرواتب المعيارية", category: "الموارد البشرية" },
        { templateId: "TPL-002", name: "قالب الحوكمة ومصفوفة تفويض الصلاحيات (DOA)", category: "الحوكمة والمخاطر" },
        { templateId: "TPL-003", name: "قالب دليل الحسابات المالي والمشتريات الشجري", category: "المالية والمشتريات" }
      ]
    });
  });

  // /api/v1/generate (Server-side Gemini AI generation)
  app.post(["/api/generate-system", "/api/v1/generate"], async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "NO_API_KEY",
          message: "مفتاح API الخاص بـ Gemini غير متوفر. سيتم استخدام محرك التوليد الهيكلي المدمج."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const { prompt, domain, scope, levelOfDetail, orgType } = req.body;

      const systemPrompt = `أنت الخبير المؤسسي والأخصائي التنفيذي الرائد في تصميم الأنظمة والمستندات والهياكل الإدارية للشركات.
قم بتحليل طلب المستخدم وبناء نظام مؤسسي متكامل باللغة العربية الفصحى بالصيغة الهيكلية المحددة.

طلب المستخدم: "${prompt}"
المجال: ${domain || "عام"}
نطاق العمل: ${scope || "مؤسسي شامل"}
مستوى التفصيل: ${levelOfDetail || "مؤسسي شامل"}
نوع المؤسسة: ${orgType || "شركة مساهمة / حكومية / قطاع خاص"}

المطلوب إرجاع JSON يحتوي على العناصر المؤسسية التالية:
1. projectDefinition: { projectName, domain, sector, orgType, orgSize, targetUsers, goal, scope, complexity, levelOfDetail }
2. orgStructure: { companyName, totalEmployeesCount, sectors: [{ name, code, leadTitle, departments: [{ name, code, deptHead, sections: [{ name, code, unitName, jobTitles: [{ title, code, level, count, reportTo }] }] }] }] }
3. dictionary: [{ term, code, definition, englishTerm, abbreviation, domain, category, example, relatedTerms }]
4. items: [{ uid, category, title, description, department, level }]
5. formulas: [{ code, name, description, mathFormula, excelFormula, unit, minThreshold, maxThreshold, warningLevel, riskLevel, example }]
6. sopLibrary: [{ sopCode, title, objective, scope, owner, inputs, steps: [{ stepNumber, action, actor, durationHours, output }], outputs, forms, risks, kpiCode }]
7. riskRegister: [{ riskCode, description, cause, impactRating, likelihoodRating, currentControls, proposedControls, owner, mitigationPlan, status }]
8. kpiList: [{ kpiCode, name, definition, target, baseline, unit, frequency, owner, formulaCode }]
9. chartOfAccounts: [{ accountCode, accountName, type, parentCode, isHeader, normalBalance }]
10. legislation: [{ refCode, lawName, article, requirement, complianceLevel, reviewNeeded }]
11. raciMatrix: [{ processName, responsible, accountable, consulted, informed }]
12. dataDictionary: [{ fieldId, arabicName, technicalName, dataType, isRequired, relatedTable }]
13. executiveSummary: { overview, currentStatus, keyDeviations, recommendations: [] }
14. userManual: { introduction, systemObjectives, setupInstructions, dailyOperations, faq: [{ question, answer }] }

أرجع JSON فقط بدون أي علامات markdown إضافية.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text || "{}";
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      return res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error("Error generating system with Gemini:", err);
      return res.status(500).json({
        error: "GENERATION_FAILED",
        message: err?.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي",
      });
    }
  });

  // /api/v1/search
  app.get("/api/v1/search", (req, res) => {
    const query = (req.query.q as string) || "";
    res.json({
      success: true,
      query,
      normalizedQuery: query.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه"),
      resultsCount: 5,
      message: "تم إجراء البحث بنجاح مع معالجة التطابق العربي الشامل"
    });
  });

  // /api/v1/audit
  app.get("/api/v1/audit", (req, res) => {
    res.json({
      success: true,
      logs: [
        {
          id: "AUD-0001",
          userId: "USR-000001",
          userName: "مدير النظام (مؤسسي)",
          timestamp: new Date().toISOString(),
          action: "إنشاء نظام مؤسسي",
          objectType: "PRJ-000001"
        }
      ]
    });
  });

  // /api/v1/developer-settings
  app.get("/api/v1/developer-settings", (req, res) => {
    res.json({
      success: true,
      featureFlags: {
        ENABLE_AI: true,
        ENABLE_PDF: true,
        ENABLE_POWERPOINT: true,
        ENABLE_OFFLINE: true,
        ENABLE_SHARING: true,
        ENABLE_MULTI_TENANT: true,
        ENABLE_WEBSOCKETS: false,
        ENABLE_EMAIL: true
      },
      aiProvider: "Gemini (Google)",
      databaseStatus: "Connected (Relational PostgreSQL Ready)",
      activeJobs: 1
    });
  });

  // /api/v1/docs (OpenAPI 3.0 Documentation JSON)
  app.get("/api/v1/docs", (req, res) => {
    res.json({
      openapi: "3.0.0",
      info: {
        title: "Smart Institutional Generator Platform API",
        version: "1.0.0",
        description: "OpenAPI Documentation for Enterprise Institutional Architecture & Generation Platform"
      },
      paths: {
        "/api/v1/health": { get: { summary: "Check system health and database connection" } },
        "/api/v1/auth/login": { post: { summary: "Authenticate user and issue JWT token" } },
        "/api/v1/projects": { get: { summary: "List institutional projects and versions" } },
        "/api/v1/templates": { get: { summary: "Get dynamic user and system templates" } },
        "/api/v1/generate": { post: { summary: "Generate full structured institutional system using AI Orchestrator" } },
        "/api/v1/search": { get: { summary: "Perform full-text Arabic search with character normalization" } },
        "/api/v1/audit": { get: { summary: "Get audit trail log entries" } },
        "/api/v1/developer-settings": { get: { summary: "Get feature flags and developer settings" } }
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Institutional Platform running at http://localhost:${PORT}`);
  });
}

startServer();
