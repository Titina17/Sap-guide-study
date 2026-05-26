/**
 * SAP FI Study Assistant — Floating Chat Widget
 * Inject with: <script src="assistant.js"></script> before </body>
 * Works on: index.html, s4f12.html, s4f13.html, s4f15.html, s4f17.html, s4c03.html
 */
(function () {
  'use strict';

  // ─── SYSTEM PROMPT ──────────────────────────────────────────────────────────
  const SYSTEM_PROMPT = `Eres un experto instructor SAP FI especializado en la certificación C_TS4FI_2023 (SAP S/4HANA Financial Accounting). Tu rol es ayudar al estudiante a resolver ejercicios prácticos de configuración SAP, guiándolo paso a paso como si fuera una sesión de laboratorio real.

## CURSOS QUE DOMINAS:

### S4F12 – Basics of Customizing for Financial Accounting
- Organizational structure: Client, Company Code, Chart of Accounts, Fiscal Year Variant, Posting Period Variant, Currency
- G/L Account Master Data: Chart of accounts segment + Company code segment
- Field Status Groups y Field Status Variants (OBC4, OBD4)
- Document types (OBA7), Number ranges (FBN1), Posting keys
- Tolerance groups (OBA4 users, OBA3 G/L accounts)
- Transacciones: FB50, FB60, FB70, FB01, F-02, F-03, F-44, F-32
- Recurring entries (FBD1, F.14), Parked documents (FBV0), Hold documents
- Account assignment model (FKMT), Fast entry
- Open item management, Clearing (manual y automático)
- Cash journal (FBCJ, FBCJC0 config)
- Financial Statement Versions (FSV - OB58), Reporting S_ALR_*
- Leading zeros en G/L accounts (10 dígitos en S/4HANA)

### S4F13 – Additional FI Configuration
- House Banks y Bank Accounts (FI12, T-code: FI12)
- Payment Program (F110): Payment methods (FBZP), Paying company codes, Bank determination, Payment medium
- Dunning Program (F150): Dunning procedures (FBD3), Dunning levels, Dunning areas, Dunning keys
- Tax on Sales/Purchases: Tax codes (FTXP), Tax procedures (OBYZ), Condition types, Tax accounts (OB40)
- Withholding Tax: Classic vs Extended, W/T types (SPRO), W/T codes, Certificate numbering
- Special G/L Transactions: Down payments (F-29/F-47), Guarantees, Bills of exchange
- Special G/L indicators: A (down payment request), F (down payment real), W (bill of exchange)
- Substitution (GGB1) y Validation (GGB0) rules — prerequisite: activación por área (OBBH/OBBL)
- Document Splitting: Zero balance clearing account, Passive split (derivation), Active split (item categories, business transaction variants)
- Profit Center Accounting en S/4HANA (obligatorio, embedded, reemplaza EC-PCA)
- Segment Reporting — derivación desde Profit Center
- Parallel Accounting: Leading ledger (0L), Non-leading ledgers, Ledger groups, Accounting principles
- Customer/Vendor Integration (CVI) — Business Partners (BP transaction)
- FLCU00/FLVN00 = account groups estándar SAP para customers/vendors

### S4F15 – Configuring Financial Closing
- Accruals and Deferrals: FBS1 (documento de accrual/deferral), F.81 (reversión masiva)
- GR/IR Account maintenance (F.19) — ajuste de diferencias GR/IR al cierre
- Foreign Currency Valuation (FAGL_FC_VAL): Exchange rate types (M=standard, B=buying, G=selling), Delta logic (solo diferencias nuevas), OB08 (cargar tipos de cambio)
- Reclassification: FAGL_FC_TRANS (reclasificación de balances), Regrouping por vencimiento (F101)
- Balance carryforward: FAGLGVTR (new G/L, S/4HANA), F.07 (classic GL)
- Financial Statements: FSV config (OB58), F.01 (reporte FSV)
- Closing cockpit (CLOCO): Task lists, Task types, Dependencies entre tareas
- Intercompany reconciliation (FBICR)
- Depreciation posting run (AFAB) como parte del cierre
- Período de cierre: OB52 (posting periods), MMPV (MM period close)

### S4F17 – Configuring Asset Accounting
- Chart of Depreciation (OADB) — asignado al Company Code
- Depreciation Areas: Area 01 (book depreciation, posts to G/L), áreas derivadas, APC+depreciation
- Asset Classes (OAOA): Account determination, Number range, Screen layout rule
- Account determination (AO90): Acquisition accounts, Accumulated depreciation, Depreciation expense
- Asset Master Data (AS01/AS02): tabs General, Time-dependent, Allocations, Depreciation areas
- Acquisition: F-90 (external), AB01 (direct), MIRO integrado con MM (cuenta GR/IR assets)
- Depreciation: AFAB (planned run), ABAA (unplanned depreciation), keys: LINR (straight-line), DGRW (declining balance)
- Transfer within company code: ABUMN
- Intercompany asset transfer
- Retirement: ABAON (with customer/revenue), ABAVN (scrapping sin ingresos)
- Legacy asset transfer: AS91 (crear legacy), ABLDT (transfer values)
- Fiscal year procedures: AJRW (fiscal year change), AJAB (year-end close — después de AFAB final)
- Low value assets (LVA): immediate depreciation, umbral de valor
- Parallel valuation: múltiples depreciation areas para IFRS/local GAAP

### S4C03 – Implementing SAP S/4HANA Cloud Private Edition
- RISE with SAP: Bundle completo (S/4HANA Cloud, BTP, infrastructure, support)
- SAP Activate methodology: 6 fases (Discover, Prepare, Explore, Realize, Deploy, Run)
- Fit-to-Standard workshops — adaptar procesos al estándar SAP, no al revés
- Business Driven Configuration (BDC) vs Expert Configuration
- Scoping en SAP Solution Manager o Cloud ALM
- Transport management: ChaRM, gCTS para cloud
- Integration: SAP Integration Suite (ex-CPI), API Business Hub
- Extension options: Side-by-side (BTP), In-app (BAdi, Fiori custom apps)
- Identity and Access Management: SAP IAS, SAP IPS
- SAP BTP (Business Technology Platform): subaccounts, entitlements, service instances
- Conversion path: Greenfield (new implementation) vs Brownfield (system conversion) vs Bluefield (selective data transition)
- SAP Readiness Check, Simplification List

## CADENAS DE CONFIGURACIÓN (patrones de examen críticos):
Cuando el ejercicio implica una transacción de negocio, siempre menciona la cadena completa:
- Asset posting → requiere: Chart of Depreciation + Depreciation Area + Asset Class + Account Determination + Asset Master
- Payment run F110 → requiere: House Bank + Payment Method + Paying Company Code + Vendor payment method assignment + Bank Determination
- Document Splitting → requiere: Splitting method + Document type assignment + Business transaction + Item categories + Zero balance account
- Foreign currency posting → requiere: Exchange rate type + Currency in company code + Translation ratios (OB08)
- Tax posting → requiere: Tax procedure + Tax code (FTXP) + Tax account (OB40) + Tax indicator in G/L master

## FORMATO DE RESPUESTA:
1. **Identifica** módulo(s) y transacción(es) principales
2. **Prerequisitos** de configuración (cadena)
3. **Ruta exacta**: Transaction: FB50 | IMG: SPRO → Financial Accounting → ...
4. **Pasos campo por campo** con valores esperados
5. ✅ **Verificación**: qué documento/resultado esperar
6. ⚠️ **Errores comunes** y cómo evitarlos

Usa ## para secciones principales, ### para subsecciones.
Usa **negrita** para transacciones y campos SAP.
Usa \`código\` para valores técnicos (T-codes, table names, field names).
Responde en el mismo idioma que el estudiante (español o inglés).
Sé preciso — no inventes T-codes, table names ni field names. Si no estás seguro, indícalo.
El examen C_TS4FI_2023 es performance-based y open-book — enfócate en comprensión real y rutas de configuración verificables.`;

  // ─── STATE ───────────────────────────────────────────────────────────────────
  let history = [];
  let isOpen = false;
  let isLoading = false;
  let apiKey = sessionStorage.getItem('sap_ai_key') || '';

  // ─── INJECT STYLES ───────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #sap-ai-fab {
      position: fixed; bottom: 24px; right: 24px; z-index: 9998;
      width: 54px; height: 54px; border-radius: 50%;
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      border: none; cursor: pointer;
      box-shadow: 0 4px 16px rgba(29,78,216,0.45), 0 1px 4px rgba(0,0,0,0.15);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; transition: all 0.2s; color: white;
      font-family: system-ui, sans-serif;
    }
    #sap-ai-fab:hover { transform: translateY(-2px) scale(1.06); box-shadow: 0 8px 24px rgba(29,78,216,0.5); }
    #sap-ai-fab.open { background: linear-gradient(135deg, #475569, #334155); }

    #sap-ai-badge {
      position: absolute; top: -3px; right: -3px;
      width: 16px; height: 16px; border-radius: 50%;
      background: #ef4444; border: 2px solid white;
      font-size: 9px; font-weight: 700; color: white;
      display: flex; align-items: center; justify-content: center;
      font-family: system-ui, sans-serif;
    }

    #sap-ai-panel {
      position: fixed; bottom: 90px; right: 24px; z-index: 9999;
      width: 400px; height: 580px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
      display: flex; flex-direction: column;
      font-family: 'Inter', system-ui, sans-serif;
      transform: scale(0.95) translateY(10px);
      opacity: 0; pointer-events: none;
      transition: all 0.2s cubic-bezier(0.34, 1.3, 0.64, 1);
      overflow: hidden;
    }
    #sap-ai-panel.visible {
      transform: scale(1) translateY(0);
      opacity: 1; pointer-events: all;
    }

    #sap-ai-header {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      padding: 14px 16px; display: flex; align-items: center; gap: 10px;
      flex-shrink: 0;
    }
    #sap-ai-header-icon {
      width: 34px; height: 34px; border-radius: 8px;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0;
    }
    #sap-ai-header-text { flex: 1; }
    #sap-ai-header-title { color: #fff; font-size: 13px; font-weight: 700; }
    #sap-ai-header-sub { color: rgba(255,255,255,0.7); font-size: 10px; margin-top: 1px; }
    #sap-ai-close {
      background: rgba(255,255,255,0.15); border: none; cursor: pointer;
      width: 28px; height: 28px; border-radius: 6px;
      color: white; font-size: 16px; display: flex; align-items: center;
      justify-content: center; transition: background 0.15s; flex-shrink: 0;
    }
    #sap-ai-close:hover { background: rgba(255,255,255,0.25); }

    #sap-ai-clear {
      background: rgba(255,255,255,0.15); border: none; cursor: pointer;
      width: 28px; height: 28px; border-radius: 6px;
      color: white; font-size: 12px; display: flex; align-items: center;
      justify-content: center; transition: background 0.15s; flex-shrink: 0;
      font-family: system-ui, sans-serif; margin-right: 4px;
    }
    #sap-ai-clear:hover { background: rgba(255,255,255,0.25); }

    #sap-ai-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 12px;
      background: #f8fafc;
      scroll-behavior: smooth;
    }
    #sap-ai-messages::-webkit-scrollbar { width: 4px; }
    #sap-ai-messages::-webkit-scrollbar-track { background: transparent; }
    #sap-ai-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

    .sap-msg-row { display: flex; gap: 8px; align-items: flex-start; }
    .sap-msg-row.user { flex-direction: row-reverse; }

    .sap-msg-avatar {
      width: 28px; height: 28px; border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; flex-shrink: 0; margin-top: 2px;
    }
    .sap-msg-avatar.ai { background: linear-gradient(135deg, #1d4ed8, #1e40af); }
    .sap-msg-avatar.user { background: #e2e8f0; }

    .sap-msg-bubble {
      max-width: 85%; padding: 10px 13px;
      border-radius: 12px; font-size: 13px; line-height: 1.6;
      word-break: break-word;
    }
    .sap-msg-bubble.ai {
      background: #fff; color: #1e293b;
      border: 1px solid #e2e8f0;
      border-radius: 4px 12px 12px 12px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .sap-msg-bubble.user {
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      color: #fff;
      border-radius: 12px 4px 12px 12px;
      box-shadow: 0 2px 8px rgba(29,78,216,0.3);
    }

    .sap-msg-bubble h2 {
      font-size: 13px; font-weight: 700; color: #1d4ed8;
      margin: 12px 0 6px; padding-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
    }
    .sap-msg-bubble h2:first-child { margin-top: 0; }
    .sap-msg-bubble h3 {
      font-size: 11px; font-weight: 700; color: #475569;
      margin: 10px 0 4px; text-transform: uppercase; letter-spacing: 0.05em;
    }
    .sap-msg-bubble p { margin: 3px 0; }
    .sap-msg-bubble code {
      background: #eff6ff; color: #1d4ed8;
      padding: 1px 5px; border-radius: 4px;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 11px;
    }
    .sap-msg-bubble strong { color: #0f172a; font-weight: 600; }
    .sap-msg-bubble.user strong { color: rgba(255,255,255,0.9); }
    .sap-msg-bubble.user code { background: rgba(255,255,255,0.2); color: #fff; }

    .sap-msg-bubble .sap-warn {
      background: #fff7ed; border: 1px solid #fed7aa;
      border-radius: 6px; padding: 7px 10px; margin: 6px 0; font-size: 12px;
      color: #9a3412;
    }
    .sap-msg-bubble .sap-ok {
      background: #f0fdf4; border: 1px solid #bbf7d0;
      border-radius: 6px; padding: 7px 10px; margin: 6px 0; font-size: 12px;
      color: #15803d;
    }
    .sap-msg-bubble .sap-info {
      background: #eff6ff; border: 1px solid #bfdbfe;
      border-radius: 6px; padding: 7px 10px; margin: 6px 0; font-size: 12px;
      color: #1e40af;
    }
    .sap-msg-bubble ul { padding-left: 4px; list-style: none; }
    .sap-msg-bubble ul li { display: flex; gap: 6px; margin: 3px 0; }
    .sap-msg-bubble ul li::before { content: "▸"; color: #1d4ed8; flex-shrink: 0; margin-top: 1px; }
    .sap-msg-bubble ol { padding-left: 16px; }
    .sap-msg-bubble ol li { margin: 3px 0; }

    .sap-loading-dots { display: inline-flex; gap: 4px; align-items: center; padding: 4px 0; }
    .sap-loading-dots span {
      width: 6px; height: 6px; border-radius: 50%;
      background: #1d4ed8; opacity: 0.4;
      animation: sap-bounce 1.2s infinite;
    }
    .sap-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .sap-loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes sap-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40% { transform: translateY(-5px); opacity: 1; }
    }

    #sap-ai-quick { padding: 10px 14px 0; display: flex; gap: 6px; flex-wrap: wrap; flex-shrink: 0; }
    .sap-quick-btn {
      background: #eff6ff; border: 1px solid #bfdbfe;
      color: #1d4ed8; border-radius: 20px;
      padding: 4px 11px; font-size: 11px; cursor: pointer;
      transition: all 0.15s; font-family: inherit; white-space: nowrap;
    }
    .sap-quick-btn:hover { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }

    #sap-ai-input-area {
      padding: 10px 14px 14px; flex-shrink: 0;
      border-top: 1px solid #e2e8f0; background: #fff;
    }
    #sap-ai-input-wrap {
      display: flex; gap: 8px; align-items: flex-end;
      background: #f8fafc; border: 1.5px solid #e2e8f0;
      border-radius: 10px; padding: 8px 10px;
      transition: border-color 0.15s;
    }
    #sap-ai-input-wrap:focus-within { border-color: #1d4ed8; background: #fff; }
    #sap-ai-textarea {
      flex: 1; background: transparent; border: none; outline: none;
      font-size: 13px; color: #1e293b; resize: none;
      font-family: 'Inter', system-ui, sans-serif;
      line-height: 1.5; max-height: 100px; overflow-y: auto;
    }
    #sap-ai-textarea::placeholder { color: #94a3b8; }
    #sap-ai-send {
      width: 32px; height: 32px; border-radius: 7px;
      background: #1d4ed8; border: none; cursor: pointer;
      color: white; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s; flex-shrink: 0;
    }
    #sap-ai-send:hover:not(:disabled) { background: #1e40af; transform: translateY(-1px); }
    #sap-ai-send:disabled { background: #cbd5e1; cursor: not-allowed; }
    #sap-ai-footer {
      text-align: center; font-size: 10px; color: #94a3b8;
      margin-top: 6px; font-family: system-ui, sans-serif;
    }
    #sap-ai-error {
      margin: 0 14px 8px; padding: 8px 11px;
      background: #fef2f2; border: 1px solid #fecaca;
      border-radius: 7px; color: #dc2626; font-size: 12px;
      display: none;
    }

    @media (max-width: 480px) {
      #sap-ai-panel { width: calc(100vw - 24px); right: 12px; bottom: 80px; }
      #sap-ai-fab { right: 16px; bottom: 16px; }
    }
    #sap-ai-key-screen {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 28px 24px; background: #f8fafc; gap: 16px; text-align: center;
    }
    #sap-ai-key-screen .key-icon {
      width: 56px; height: 56px; border-radius: 14px;
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      display: flex; align-items: center; justify-content: center; font-size: 26px;
      box-shadow: 0 4px 14px rgba(29,78,216,0.35);
    }
    #sap-ai-key-screen h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
    #sap-ai-key-screen p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.6; }
    #sap-ai-key-screen a { color: #1d4ed8; text-decoration: none; font-weight: 600; }
    #sap-ai-key-screen a:hover { text-decoration: underline; }
    #sap-ai-key-input {
      width: 100%; box-sizing: border-box;
      border: 1.5px solid #e2e8f0; border-radius: 9px;
      padding: 10px 13px; font-size: 13px; font-family: 'Courier New', monospace;
      color: #1e293b; background: #fff; outline: none; transition: border-color 0.15s;
    }
    #sap-ai-key-input:focus { border-color: #1d4ed8; }
    #sap-ai-key-input::placeholder { font-family: system-ui, sans-serif; color: #94a3b8; }
    #sap-ai-key-save {
      width: 100%; padding: 10px; border-radius: 9px;
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      border: none; color: white; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.15s; font-family: inherit;
    }
    #sap-ai-key-save:hover { opacity: 0.9; transform: translateY(-1px); }
    #sap-ai-key-save:disabled { background: #cbd5e1; cursor: not-allowed; transform: none; }
    #sap-ai-key-err { font-size: 11px; color: #dc2626; display: none; margin: -8px 0 0; }
    #sap-ai-key-tip {
      font-size: 11px; color: #94a3b8; padding: 10px 12px;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
      line-height: 1.6; text-align: left; width: 100%; box-sizing: border-box;
    }
    #sap-ai-keybtn {
      background: rgba(255,255,255,0.15); border: none; cursor: pointer;
      padding: 4px 9px; border-radius: 6px; color: rgba(255,255,255,0.8);
      font-size: 10px; transition: background 0.15s; font-family: system-ui, sans-serif; flex-shrink: 0;
    }
    #sap-ai-keybtn:hover { background: rgba(255,255,255,0.25); color: white; }
  `;
  document.head.appendChild(style);

  // ─── BUILD DOM ───────────────────────────────────────────────────────────────
  const fab = document.createElement('button');
  fab.id = 'sap-ai-fab';
  fab.title = 'SAP FI Study Assistant';
  fab.innerHTML = `<span id="sap-ai-badge">AI</span>🎓`;

  const panel = document.createElement('div');
  panel.id = 'sap-ai-panel';
  panel.innerHTML = `
    <div id="sap-ai-header">
      <div id="sap-ai-header-icon">🎓</div>
      <div id="sap-ai-header-text">
        <div id="sap-ai-header-title">SAP FI Study Assistant</div>
        <div id="sap-ai-header-sub">C_TS4FI_2023 · S4F12 · S4F13 · S4F15 · S4F17 · S4C03</div>
      </div>
      <button id="sap-ai-keybtn" title="API Key">🔑 Key</button>
      <button id="sap-ai-clear" title="Nuevo chat">↺</button>
      <button id="sap-ai-close" title="Cerrar">✕</button>
    </div>
    <div id="sap-ai-key-screen" style="display:none">
      <div class="key-icon">🔑</div>
      <h3>Conecta tu API Key</h3>
      <p>El asistente usa la API de Anthropic.<br>Tu key se guarda solo en esta sesión del navegador.</p>
      <input id="sap-ai-key-input" type="password" placeholder="sk-ant-api03-..." autocomplete="off" />
      <div id="sap-ai-key-err">⚠️ La key debe empezar con sk-ant-</div>
      <button id="sap-ai-key-save" disabled>Guardar y empezar →</button>
      <div id="sap-ai-key-tip">
        <strong>¿Dónde obtengo mi API Key?</strong><br>
        1. Ve a <a href="https://console.anthropic.com/settings/keys" target="_blank">console.anthropic.com</a><br>
        2. Crea una nueva key<br>
        3. Pégala aquí — no se guarda en ningún servidor
      </div>
    </div>
    <div id="sap-ai-messages"></div>
    <div id="sap-ai-quick"></div>
    <div id="sap-ai-error"></div>
    <div id="sap-ai-input-area">
      <div id="sap-ai-input-wrap">
        <textarea id="sap-ai-textarea" rows="2"
          placeholder="Pega tu ejercicio aquí... (Enter = enviar)"></textarea>
        <button id="sap-ai-send" disabled title="Enviar">➤</button>
      </div>
      <div id="sap-ai-footer">Powered by Claude Sonnet 4 · Material SAP S/4HANA FI</div>
    </div>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  // ─── REFS ────────────────────────────────────────────────────────────────────
  const messagesEl = document.getElementById('sap-ai-messages');
  const textarea   = document.getElementById('sap-ai-textarea');
  const sendBtn    = document.getElementById('sap-ai-send');
  const errorEl    = document.getElementById('sap-ai-error');
  const quickEl    = document.getElementById('sap-ai-quick');
  const keyScreen  = document.getElementById('sap-ai-key-screen');
  const keyInput   = document.getElementById('sap-ai-key-input');
  const keySave    = document.getElementById('sap-ai-key-save');
  const keyErr     = document.getElementById('sap-ai-key-err');

  // ─── QUICK PROMPTS ───────────────────────────────────────────────────────────
  const QUICK = [
    '¿Cómo configuro un House Bank?',
    'Cadena de configuración de Asset Accounting',
    '¿Qué es el Document Splitting?',
    'Pasos para el Payment Program F110',
  ];

  function renderQuickPrompts() {
    quickEl.innerHTML = '';
    QUICK.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'sap-quick-btn';
      btn.textContent = q;
      btn.onclick = () => { textarea.value = q; textarea.dispatchEvent(new Event('input')); textarea.focus(); };
      quickEl.appendChild(btn);
    });
  }

  // ─── API KEY MANAGEMENT ──────────────────────────────────────────────────────
  function showKeyScreen() {
    keyScreen.style.display = 'flex';
    messagesEl.style.display = 'none';
    quickEl.style.display = 'none';
    document.getElementById('sap-ai-input-area').style.display = 'none';
    keyInput.value = '';
    keyErr.style.display = 'none';
    setTimeout(() => keyInput.focus(), 150);
  }

  function showChatScreen() {
    keyScreen.style.display = 'none';
    messagesEl.style.display = 'flex';
    document.getElementById('sap-ai-input-area').style.display = 'block';
  }

  keyInput.addEventListener('input', function () {
    const val = this.value.trim();
    keySave.disabled = !val;
    keyErr.style.display = 'none';
  });

  keySave.addEventListener('click', function () {
    const val = keyInput.value.trim();
    if (!val.startsWith('sk-ant-')) {
      keyErr.style.display = 'block';
      return;
    }
    apiKey = val;
    sessionStorage.setItem('sap_ai_key', val);
    showChatScreen();
    if (history.length === 0) addWelcome();
    setTimeout(() => textarea.focus(), 150);
  });

  keyInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') keySave.click();
  });

  // ─── TOGGLE PANEL ────────────────────────────────────────────────────────────
  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('visible', isOpen);
    fab.classList.toggle('open', isOpen);
    document.getElementById('sap-ai-badge').style.display = isOpen ? 'none' : 'flex';
    if (isOpen) {
      if (!apiKey) {
        showKeyScreen();
      } else {
        showChatScreen();
        if (history.length === 0) addWelcome();
        setTimeout(() => textarea.focus(), 200);
      }
    }
  }

  fab.addEventListener('click', togglePanel);
  document.getElementById('sap-ai-close').addEventListener('click', togglePanel);
  document.getElementById('sap-ai-clear').addEventListener('click', clearChat);
  document.getElementById('sap-ai-keybtn').addEventListener('click', function () {
    apiKey = '';
    sessionStorage.removeItem('sap_ai_key');
    history = [];
    showKeyScreen();
  });

  // ─── WELCOME MESSAGE ─────────────────────────────────────────────────────────
  function addWelcome() {
    const welcome = '¡Hola! Soy tu asistente de estudio SAP FI para la certificación **C_TS4FI_2023**.\n\nPega cualquier ejercicio o pregunta — te ayudo con rutas IMG, transacciones, valores de campos y cadenas de configuración. Cubro todos los módulos: S4F12, S4F13, S4F15, S4F17 y S4C03.\n\n¿Qué ejercicio resolvemos?';
    appendMessage('ai', welcome);
    renderQuickPrompts();
  }

  function clearChat() {
    history = [];
    messagesEl.innerHTML = '';
    addWelcome();
    errorEl.style.display = 'none';
  }

  // ─── MARKDOWN → HTML ─────────────────────────────────────────────────────────
  function mdToHtml(text) {
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Close open list if needed
      if (inList && !line.match(/^[-•*]\s/)) { html += '</ul>'; inList = false; }

      if (line.startsWith('## ')) {
        html += `<h2>${escape(line.slice(3))}</h2>`;
      } else if (line.startsWith('### ')) {
        html += `<h3>${escape(line.slice(4))}</h3>`;
      } else if (line.startsWith('⚠️')) {
        html += `<div class="sap-warn">${inlineFormat(line)}</div>`;
      } else if (line.startsWith('✅')) {
        html += `<div class="sap-ok">${inlineFormat(line)}</div>`;
      } else if (line.startsWith('📌') || line.startsWith('💡')) {
        html += `<div class="sap-info">${inlineFormat(line)}</div>`;
      } else if (line.match(/^[-•*]\s/)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${inlineFormat(line.slice(2))}</li>`;
      } else if (line.match(/^\d+\.\s/)) {
        html += `<p>${inlineFormat(line)}</p>`;
      } else if (line.trim() === '' || line.startsWith('```')) {
        html += '<p> </p>';
      } else {
        html += `<p>${inlineFormat(line)}</p>`;
      }
    }
    if (inList) html += '</ul>';
    return html;
  }

  function inlineFormat(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function escape(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ─── APPEND MESSAGE ──────────────────────────────────────────────────────────
  function appendMessage(role, content, isLoading = false) {
    const row = document.createElement('div');
    row.className = `sap-msg-row ${role}`;

    const avatar = document.createElement('div');
    avatar.className = `sap-msg-avatar ${role}`;
    avatar.textContent = role === 'ai' ? '🎓' : '👤';

    const bubble = document.createElement('div');
    bubble.className = `sap-msg-bubble ${role}`;

    if (isLoading) {
      bubble.innerHTML = '<div class="sap-loading-dots"><span></span><span></span><span></span></div>';
      bubble.id = 'sap-loading-bubble';
    } else {
      bubble.innerHTML = role === 'ai' ? mdToHtml(content) : `<p>${inlineFormat(content)}</p>`;
    }

    row.appendChild(avatar);
    row.appendChild(bubble);

    // Hide quick prompts once user sends first message
    if (role === 'user') quickEl.style.display = 'none';

    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  // ─── SEND MESSAGE ────────────────────────────────────────────────────────────
  async function sendMessage() {
    const text = textarea.value.trim();
    if (!text || isLoading) return;

    textarea.value = '';
    textarea.style.height = 'auto';
    sendBtn.disabled = true;
    errorEl.style.display = 'none';
    isLoading = true;

    appendMessage('user', text);

    history.push({ role: 'user', content: text });

    // Loading bubble
    appendMessage('ai', '', true);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });

      const loadingBubble = document.getElementById('sap-loading-bubble');
      if (loadingBubble) loadingBubble.closest('.sap-msg-row').remove();

      if (res.status === 401) {
        apiKey = ''; sessionStorage.removeItem('sap_ai_key');
        showKeyScreen();
        keyErr.textContent = '⚠️ API Key inválida. Verifica e intenta de nuevo.';
        keyErr.style.display = 'block';
        isLoading = false; history.pop(); return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply = data.content?.find(b => b.type === 'text')?.text || 'Sin respuesta.';

      history.push({ role: 'assistant', content: reply });
      appendMessage('ai', reply);

    } catch (err) {
      const loadingBubble = document.getElementById('sap-loading-bubble');
      if (loadingBubble) loadingBubble.closest('.sap-msg-row').remove();
      errorEl.style.display = 'block';
      errorEl.textContent = `⚠️ Error de conexión (${err.message}). Verifica tu red e intenta de nuevo.`;
      history.pop(); // remove failed user message
    } finally {
      isLoading = false;
      sendBtn.disabled = !textarea.value.trim();
    }
  }

  // ─── INPUT EVENTS ────────────────────────────────────────────────────────────
  textarea.addEventListener('input', function () {
    sendBtn.disabled = !this.value.trim() || isLoading;
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 100) + 'px';
  });

  textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

})();
