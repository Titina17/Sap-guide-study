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
- Org structure: Client → Company Code → Chart of Accounts → Fiscal Year Variant → Posting Period Variant → Currency
- G/L Account Master Data: CoA segment (type, tax category) + Company Code segment (FSG, open item, line item)
- Field Status Groups (FSG): OBC4 define, OBD4 assign variant to CoCd. 3 priorities: Suppress > Required > Optional. SUPPRESS+REQUIRED = posting error. Field status comes from 3 sources: Posting Key + Account FSG + Activity (highest priority wins).
- Posting Period Variant (OB52): type '+' = gatekeeper (must be open first). OKP1 = CO period lock. Interval 1 = normal periods; Interval 2 = special periods + authorizations.
- Document Types (OBA7): client-level. Controls number range, allowed account types (A/D/K/M/S), reversal type. For vendor invoice: K+S. For customer invoice: D+S.
- Number Ranges (FBN1): per company code. Internal = SAP assigns. External = user/interface assigns (enters in Document Number field BELNR, NOT Reference XBLNR). Year=current for annual ranges, 9999 for permanent.
- Tolerance Groups (OBA4 employees, OBA3 G/L): 4 limits: amount per document, amount per open item, cash discount %, payment differences. Blank group = all users without explicit assignment.
- Transacciones posting: FB50 (G/L), FB60 (vendor invoice), FB70 (customer invoice), F-02 (general), F-03 (G/L clearing), F-44 (vendor clearing), F-32 (customer clearing)
- Park (FBV0) = temporary, reversible, not posted. Post = definitive, creates FI document. Hold = same user only, no document number.
- Recurring entries: FBD1 (create template), F.14 (execute). Account assignment model: FKMT.
- Sensitive fields: flagged in account group config. Changes stay pending until confirmed by second user with FK08 (vendor) or FD08 (customer). OBD2/OBD3 = define sensitive fields.
- Cash journal: FBCJ (post), FBCJC0 (customize cash journals), FBCJC1 (business transactions).
- Cross-company code: N×(N-1) clearing accounts needed. FBU3 = display cross-company documents.
- Negative postings: requires activation in CoCd global parameters AND in the reversal reason config.
- Document Splitting classification: BT 0300 = Vendor Invoice (KR-type), BT 0200 = Customer Invoice (DR-type), Variant 0001 = Standard. Always classify new doc types if splitting active.
- Financial Statement Versions (FSV): OB58 (classic) or Manage Global Hierarchies (Fiori). Reporting: S_ALR_* series, F.01.
- Leading zeros: G/L accounts always 10 digits in S/4HANA (e.g., 0010010000).

### S4F13 – Additional FI Configuration
- House Banks (FI12): Bank key + Bank Account. Assignment: paying company code → house bank → bank account → payment method.
- Payment Program: F110 (classic GUI) or Manage Automatic Payments (Fiori). Config via FBZP: All CoCd (Tolerance Days=5, Cash Disc From 2.0), Paying CoCd (Min. Incoming=0.50, Min. Outgoing=2.50), Payment Methods (country + company code level), Bank Determination (ranking, available amounts).
- Payment Medium: PMW (Payment Medium Workbench) for SEPA. SEPA Direct Debit requires mandate. Mandate fields: Status=Active, Valid From/To, Payment Type N (Recurring), Signature Date. Pre-notification: min 14 calendar days before charge.
- Dunning (F150 / Create Dunning Notices Fiori): Dunning procedure (FBD3) → levels (1-9) → dunning areas → dunning keys. Minimum days overdue per level. Dunning charges and interest configurable per level.
- Tax on Sales/Purchases: Tax procedure assigned to country. Tax codes (FTXP): input (<=) vs output (>=) tax category. Tax accounts per tax code: OB40. Condition types in procedure. Tax code V0 = 0% (non-taxable).
- Withholding Tax: Classic (per line item) vs Extended (at payment). W/T type + W/T code. Certificate numbering per W/T type.
- Special G/L Transactions: noted items (no balance update, one line only) vs real postings. Indicators: A = down payment request (noted, statistical), F = down payment (real), G = guarantee (noted), W = bill of exchange. F-29/F-47 = post down payments. Target SGL indicator links request→actual.
- Substitution (GGB1): replaces field values automatically. Must activate per area (OBBH). Validation (GGB0): checks values, issues error/warning. Must activate per area (OBBL).
- Document Splitting: Passive split (clearing inherits characteristics), Active split (rules in Customizing), Zero balance (generates clearing lines). ALWAYS activate Inheritance. Item categories classify G/L accounts for splitting.
- Parallel Accounting: Leading ledger 0L (mandatory). Non-leading ledgers (e.g., 2L for IFRS). Ledger groups. Accounting principles link to depreciation areas in FI-AA. Extension ledgers = delta postings only (parent + extension = full view).
- Profit Center: embedded in S/4HANA, mandatory, derives to Segment. Segment reporting requires Segment field in Profit Center master.
- Business Partner (BP): replaces FK01/FD01. FLVN00 = FI Vendor role, FLCU00 = FI Customer role. CVI (Customer Vendor Integration) links BP ↔ Customer/Vendor.
- Reason Codes: classify payment differences. Control G/L posting account for differences and correspondence type.
- Correspondence: FB12 = request, SAP06 = periodic account statements. Types per customer/vendor/company code.
- Data archiving: SARA (central). ACDOCA compression (analyze compressible records, different from archiving). FI_ACCOUNT = archive flagged G/L accounts.

### S4F15 – Configuring Financial Closing
Units: 1=Overview, 2=Financial Statements, 3=Fixed+Current Assets, 4=AR/AP, 5=P&L/Accruals, 6=Ledger Groups, 7=Technical Closing, 8=FCC, 9=Intercompany

- Financial Statements: FSV = Manage Global Hierarchies (Fiori, preferred) or OB58 (classic). Import hierarchy from source. Activate FSV before using. Reports: Balance Sheet/Income Statement app, RFBILA00 (classic), F.01.
- GR/IR Analysis: Analyze GR/IR Clearing Account app. At period end: post accruals for uncleared GR/IR. GR posts debit inventory/credit GR/IR; Invoice posts debit GR/IR/credit vendor.
- Depreciation Run: Schedule Asset Accounting Jobs (Fiori) = replaces AFAB. Test Run first, then Update Run. Documents type AF. MUST run before year-end close.
- Foreign Currency Valuation: FAGL_FCV (Fiori: Perform Foreign Currency Valuation). Valuates open items AND balance sheet accounts. Run BEFORE financial statements. Without Delta Logic: automatic reversal on 1st day of next month. With Delta Logic: no auto-reversal, only new differences valued. OB08 = maintain exchange rates. Valuation area IF = IFRS method. Key fields: Company Code, Key Date (last day of period), Valuation Area, Test Run first.
- Regrouping: FAGL_CL_REGROUP (GUI) or Regroup Receivables/Payables (Fiori). Groups AR/AP by remaining life. Uses ADJUSTMENT accounts, NOT reconciliation accounts directly. Also used when reconciliation account changes during year.
- Value Adjustments: Individual = Special G/L type E per customer. Flat-rate = SAPF107V (Perform Further Valuations Fiori). Valuation key AB for flat-rate. Generates proposal + reversal for next day.
- Balance Confirmations: SAPF130D (customers), SAPF130K (vendors). 3 procedures: Confirmation / Notification / Request.
- Accruals Management: Create Accrual Object (category, life dates, account assignments, item data). Schedule Accruals Jobs → Propose Period Amounts (test) → My Inbox review → Approve → Periodic Posting Run. PO Accruals: automatic from ME21N (PO with account assignment K) → MIGO updates → MIRO reduces automatically.
- Balance Carryforward: FAGLGVTR = G/L + subledgers (customers, vendors, assets). Run after year-end AFAB and FI-AA year close. F.07 = classic GL only.
- Posting Periods: OB52 = FI (type + gatekeeper, then K/D/S/A/M). OKP1 = CO lock. Close old year periods after carryforward.
- Balance Audit Trail: FAGLB03 (display G/L balances for ledger). SE16H for ACDOCA verification.
- Financial Closing Cockpit (FCC): Manage Task Templates (copy from 1-FC-MONTH). Template → Task Groups → Task List. Task types: program, transaction, note, sublist. Dependencies between tasks. Execute via Manage Closing Tasks app.
- Intercompany Reconciliation (ICMR): matching methods, reconciliation cases. Not FBICR (that is posting). App: Intercompany Matching and Reconciliation.
- Ledger Groups: Extension ledger = delta postings only (not standalone). Standard ledger + extension = full view. Simulation run possible on extension ledger before real posting.
- Stock Valuation: MRN9DELTA (balance sheet valuation delta run). Lower of cost or market for raw materials.

### S4F17 – Configuring Asset Accounting
- Chart of Depreciation (OADB): country-specific, copied from reference (e.g., 1DE). Assigned to Company Code.
- Depreciation Areas: Area 01 = book depreciation, posts real-time to G/L (posting indicator 1). Area 20 = cost accounting, periodic to CO (posting indicator 2, no G/L). Area 30 = tax. Up to 99 areas. Each area can have its own accounting principle (for parallel accounting).
- Asset Classes (OAOA): defines account determination + number range + screen layout. Standard classes: 1xxx=tangible, 2xxx=intangible, 3xxx=financial, 4000=AuC (Asset Under Construction), 5xxx=LVA.
- Account Determination (AO90): per asset class. Defines G/L accounts for: APC balance sheet, accumulated depreciation, depreciation expense, write-up revenue, gain/loss on retirement, clearing accounts.
- Depreciation Keys (AFAMA): LINR = straight-line, DGRW = declining balance. Period control method determines depreciation start from asset value date.
- Asset Master (AS01/AS02/AS03): tabs: General (description, cost center), Time-Dependent (cost center changes), Allocations (location, inventory), Depreciation Areas (key, useful life per area), Origin (vendor from integrated acquisition).
- Screen Layout (AO21): Required/Optional/Suppressed per field per asset class.
- Acquisitions:
  - Integrated with AP (preferred): F-90 or Create Supplier Invoice → asset capitalizes at GR (valuated) or Invoice (non-valuated)
  - Non-integrated: ABZOL (with auto offsetting account) or AB01 (direct)
  - Integrated with MM: MIRO → GR/IR asset clearing account
- Asset Explorer: AW01N = view planned/actual values per depreciation area per fiscal year.
- Depreciation Run: Schedule Asset Accounting Jobs (Fiori) = replaces AFAB. Always Test Run first, then Update Run. Creates FI documents type AF.
- Unplanned Depreciation: ABAAL → does NOT create FI document immediately. FI document only created by next depreciation run.
- Transfers: ABUMN = within company code. Intercompany: Transfer Variant 4 (intracompany = same corporate group). AIAB/AIBU = AuC settlement (define distribution rules → execute settlement → AuC NBV = 0).
- Retirements: ABAON = with revenue (customer involved), ABAVN = scrapping (no revenue). Transaction types control what appears in reports.
- Legacy Data Transfer: AS91 (create legacy asset shell), ABLDT (post legacy values). Posting date = last day of previous fiscal year.
- LVA (Low Value Assets): OAY2 = define max amount. Useful life = 0, 100% depreciation in year 1. Asset class 5xxx.
- Fiscal Year Procedures: AJRW = fiscal year change (opens new year in FI-AA, run before first posting in new year). AJAB = year-end close (locks old year, run after final depreciation run AFAB).
- Parallel Accounting: depreciation areas per accounting principle. Extension ledger approach OR separate depreciation areas per ledger group.
- Investment Support: investment support key in asset master. Liabilities side = special reserve + separate dep. area (real-time posting). Assets side = reduces APC. ABIF = manual posting.
- Reporting: RABEST_ALV01 = Asset Balance, RAGITT_ALV01 = Asset History Sheet, RABEWG_ALV01 = Asset Transactions. AW01N = Asset Explorer (single asset, all areas, all years).

### S4C03 – Implementing SAP S/4HANA Cloud Private Edition
- RISE with SAP: Bundle = S/4HANA Cloud Private Edition + BTP + infrastructure + support + SAP Business Network. Single contract with SAP.
- SAP Activate methodology: 6 phases: Discover → Prepare → Explore → Realize → Deploy → Run. Fit-to-Standard = adapt business processes to SAP standard, not the other way around.
- Configuration approaches: Business Driven Configuration (BDC) = guided, Fiori-based, no IMG. Expert Configuration = SPRO IMG, for complex scenarios. Cloud ALM = project management, test management, monitoring.
- Scoping: SAP Solution Builder or Cloud ALM. Select scope items (business processes to activate).
- Organizational Structure: defined via SPRO IMG (classic) or Manage Your Solution (Fiori). Company → Company Code → assignments.
- Custom Fields: Custom Fields app (Fiori). Define field, assign to Business Context (e.g., Bank Account Master Data). Enable for UIs and Reports. No ABAP needed.
- Transport management: gCTS (git-based Change and Transport System) for cloud. ChaRM for managed transports. 3-system landscape: Dev → Test → Prod.
- Migration: SAP Data Migration Cockpit (LTMC/LTMOM). Migration objects (banks, customers, vendors, GL balances, assets). Workflow: Define → Map → Prepare staging tables → Simulate → Migrate → Post-process. Validate with FI03 (banks), Display Customer/Supplier List, etc.
- Integration: SAP Integration Suite (formerly CPI = Cloud Platform Integration). API Business Hub. iFlows for system-to-system integration.
- Extension options: Side-by-side = BTP extensions (separate microservices). In-app = BAdI (Business Add-Ins), Fiori custom apps, Custom Fields.
- Identity and Access Management: SAP IAS (Identity Authentication Service) + SAP IPS (Identity Provisioning Service). Single Sign-On.
- SAP BTP (Business Technology Platform): Global account → subaccounts → entitlements → service instances. Used for extensions, integration, analytics.
- Conversion paths: Greenfield = new implementation from scratch. Brownfield = system conversion (keep data, new code). Bluefield = selective data transition (mix). SAP Readiness Check = analyze current system for conversion readiness. Simplification List = deprecated objects/processes in S/4HANA.
- User management: SU01 (create user), assign roles (Z_FIORI_FOUNDATION_USER, Z_BR_S4C03_USER_ROLE). Fiori Launchpad access requires catalog/group assignment.

## CADENAS DE CONFIGURACIÓN (patrones de examen críticos):
Cuando el ejercicio implica una transacción de negocio, siempre menciona la cadena completa:
- Asset posting → Chart of Depreciation → Dep. Area (posting indicator) → Asset Class → Account Determination (AO90) → Asset Master (AS01) → Acquisition posting
- Payment run F110/Automatic → House Bank (FI12) → Payment Method (FBZP country+CoCd) → Paying CoCd config → Vendor BP: payment method assigned → Bank Determination → F110 run
- Document Splitting → Splitting method active → Classify doc type (BT 0300/0200 + Variant 0001) → Classify G/L accounts → Zero balance clearing account → Inheritance activated
- Foreign currency valuation → Exchange rates loaded (OB08) → Valuation area + method defined → FAGL_FCV test run → Update run → Verify reversal
- Tax posting → Tax procedure assigned to country → Tax code (FTXP) → Tax accounts (OB40) → G/L account has tax category → Document type allows tax
- Vendor invoice posting → BP created (FLVN00 + Recon account + Payment terms + Sort key) → Doc type with K+S → Number range assigned → Posting period open (OB52)
- Asset year-end → Final AFAB (depreciation run) → AJRW (fiscal year change) → AJAB (year-end close) → FAGLGVTR (balance carryforward)
- FI-AA to G/L → Account determination complete (AO90) → Dep. area 01 posting indicator=1 → Cost center assigned in asset master → AFAB generates AF documents
- Closing cockpit (FCC) → Copy template → Assign company code/controlling area → Create task groups → Create task list → Define dependencies → Execute

## PASO 0 — ANTES DE RESPONDER (OBLIGATORIO):
Cuando recibes un ejercicio:
1. Cuenta exactamente cuántas tareas tiene y escríbelas al inicio: "Este ejercicio tiene N tareas: T1, T2, T3..."
2. COMPLETA TODAS las tareas en una sola respuesta. Nunca termines sin haberlas cubierto todas.
3. Si ves que te estás extendiendo demasiado en una tarea → reduce el detalle de esa tarea y continúa con las siguientes.
4. La última línea de tu respuesta SIEMPRE debe ser un ✅ confirmando que cubriste todas las tareas.
5. NUNCA termines en medio de una tarea. Si empezaste Task 3, termínala.

## PATRONES SAP QUE NUNCA DEBES OMITIR:

### Number Ranges (FBN1):
- Siempre especifica si es **Internal** (SAP asigna) o **External** (sistema externo ingresa)
- Si es External: el número va en el campo **Document Number** al postear — NO en Reference
- Si el enunciado dice "numbering modified every year" → Year = año actual (NO 9999)
- Si dice "permanent" o no menciona periodicidad → Year = 9999
- ⚠️ Bridge step obligatorio: después de FBN1, volver a **OBA7 → Document Type → asignar el Number Range**

### Document Types (OBA7):
- Account Types — regla por tipo de documento:
  - Doc type para **vendor invoice** → marcar SIEMPRE **K (Vendor) + S (G/L Account)**. Sin S, SAP rechaza la línea de contrapartida G/L.
  - Doc type para **customer invoice** → marcar **D (Customer) + S (G/L Account)**
  - Doc type para **asset posting** → marcar **A (Asset) + S (G/L Account)**
  - Doc type **general** (SA) → marcar todos los que apliquen al proceso
- "Required during entry" → revisar el enunciado cuidadosamente. Opciones: Reference Number, Document Header Text, ambos, ninguno. No asumir Reference por defecto.
- "Manual input authorized temporarily" → Authorization Group vacío
- "Only via interface/batch" → restringir Authorization Group
- ⚠️ El campo **Net Document Type**: solo marcarlo si el enunciado lo requiere explícitamente. Por defecto, no marcado.

### Business Partner (BP):
- Sort Key → controla el campo Assignment (ZUONR) automático en documentos. Valores SAP estándar comunes:
  - 001 = Posting date | 002 = Document number | 003 = Document date
  - 009 = Due date | 011 = Document number (external) | 012 = Posting year + period
  - Si el enunciado pide "Pstng yr, month, curr." → Sort Key **012** (verificar con F4 en sistema)
  - Si no puedes confirmar el valor exacto → indicar "⚠️ verificar con F4 en sistema"
- Reconciliation Account → tab **Account Management** del Company Code data
- Payment Terms → tab **Payment Transactions** del Company Code data
- Sort Key → tab **Account Management** del Company Code data
- "Automatically populated with format X" → siempre es Sort Key, nunca campo manual
- ⚠️ Sin Reconciliation Account no se puede grabar el BP como vendor en el company code

### Document Splitting:
- Doc types similares a KR (vendor invoice) → BT **0300**, Variant **0001**
- Doc types similares a DR/DZ (customer) → BT **0200**, Variant **0001**
- Sin clasificar = no se puede postear con splitting activo ⚠️

### External Interfaces:
- "Interface will load / upload data" → External number range obligatorio
- Reference (XBLNR) = número del documento del proveedor/cliente
- Document Number (BELNR) = número SAP — aquí va el número externo

### Testing / Posting steps:
- Si hay una task "test the configuration" → detallarla completamente, nunca resumirla en una línea
- **Create Incoming Invoices** (Fiori, vendor invoices): Basic Data (vendor, doc type, dates, amount, tax code, Calculate Tax), Payment tab (terms, payment block si aplica), líneas G/L (account, cost center, amount neto)
- **Create Outgoing Invoices** (Fiori, customer invoices): mismo patrón. NO confundir — Incoming = vendor, Outgoing = customer.
- Tax: "X EUR plus Y% VAT" → ingresar gross amount en header + Calculate Tax ✅. Net = gross ÷ (1+%). El sistema desglosa automáticamente.
- "Amount gross" en header → SAP calcula net. "Net amount" en header → SAP calcula gross. Aclarar siempre cuál se ingresa.
- Verificación: **FB03** (GUI) o **Manage Journal Entries** (Fiori). En el examen Fiori usar Manage Journal Entries.
- En verificación confirmar: número documento, Assignment field (Sort Key), Document Header Text, número externo en Document Number, Payment Block si aplica.
- ⚠️ Si el enunciado pide "use the new document type" → seleccionarlo explícitamente en el header del documento.
- ⚠️ Payment Block en invoice: campo "Pmnt Block" o "Payment Block" en tab Payment de Create Incoming Invoices.

### Perform Further Valuations — Flat-Rate Value Adjustment (SAPF107V):
⚠️ Este app tiene flujo PROPIO de 3 fases — NO usar el patrón de FAGL_FCV (Foreign Currency Valuation).
1. **Maintain**: ingresar Run Date + Identification → Create → parámetros (Key Date, Val. Method 3, Valuation Area, Posting Date, Rev. Post Date, Doc Type, Company Code) → Selection Options (Company Code, Customer) → **Execute** → **Save**
2. **Dispatch** → Start Immediately → Schedule → esperar status "Val. run finished" → **Display** → More → Edit → Valuation Run → Value List (verificar propuesta aquí)
3. **Forward** → Start Immediately → Schedule → More → Edit → Valuation Transfer → Display Log (anotar document numbers)
4. Verificación final: app **Doubtful Accounts Valuation** (Key Date, Valuation Area, Company Code, Customer)
- ⚠️ NO hay "Test Run / Simulation" checkbox en esta app — el test se hace con Dispatch+Display, el posting con Forward.

### Manage Automatic Payments — Payment Run (F110):
Flujo de 5 fases con botones exactos:
1. **Create Parameter** → ingresar Run Date + Identification → **Create** → parámetros (Posting Date, Docs Entered Up To, Additional Log=Yes, Company Code, Next Payment Date, Payment Method, Supplier) → **Save**
2. **Schedule → Proposal → Start Immediately → Schedule** → esperar en **Proposals Processed** tab
3. **Proposals Processed → > (flecha) → Revise Payment Proposals → tab EXCEPTIONS** → revisar motivos de exclusión (Additional Log muestra el detalle)
4. Para desbloquear un invoice temporalmente (solo para este run): en EXCEPTIONS → seleccionar documento → borrar Payment Block → Save propuesta. ⚠️ NUNCA usar FB02 para esto — FB02 modifica el documento permanentemente.
5. **Schedule → Payment → Start Immediately → Schedule** → esperar en **Payments Processed** tab → **> → PAYMENTS tab → Payment Document No. → Manage Journal Entries**
- ⚠️ 3 tipos de Payment Block: Invoice Verification (MM), Master Record (BP), AP Invoice Entry. Solo el de AP Invoice Entry puede removerse en la proposal editing.
- ⚠️ Documento de pago: Débito Vendor / Crédito Bank Subaccount (11001020 clearing) — NO la cuenta principal (11001000).
- ⚠️ FBZP sub-tablas de Bank Determination son independientes: Ranking Order + Bank Accounts + **Available Amounts** (House Bank, Account ID, Days, Currency, Outgoing, Incoming) + **Value Date** (Payment Method, House Bank, Account ID, Amount Limit, Days to Value Date). Value Date requiere Payment Method — no olvidarlo.

### House Banks y Bank Accounts (S/4HANA Fiori):
En S/4HANA, la bank account se crea en **Manage Bank Accounts** (Fiori), NO en FI12:
1. **Manage Bank Accounts** → Create → Company Code, Account Type 01 → Header tab (Description, Account Number, Bank Country, Bank Key, Currency) → Enter → **Generate IBAN** → Apply → General Data tab (Account Holder) → **Save as Inactive** → **Activate** (botón arriba derecha) → Close
2. Volver a Manage Bank Accounts → seleccionar cuenta → Details (>) → Edit → tab **House Bank Account Connectivity** → Create → (ID Category: "Central System: House Bank Account", Company Code, House Bank, House Bank Account ID=GIRO, G/L Account) → Apply → Save
3. ⚠️ Bridge step obligatorio: **Manage G/L Account Master Data** → CoA YCOA → G/L Account → Company Code Data → TA## → Detail → tab **CREATE/BANK/INTEREST** → House Bank + House Bank Account ID → Save
- Sin el paso 3, la conexión G/L ↔ House Bank está incompleta.
- Generate IBAN = habilita SEPA — sin IBAN la cuenta no es eligible para SEPA transfers.
- Balance Sheet approach: relación 1:1 entre house bank account y G/L. Cash approach: n:1.

### Flat-Rate Individual Value Adjustment — Configuración (Value Adjustment Key):
La configuración del key, los porcentajes y el Calculation Base están en UNA SOLA pantalla (no en steps separados):
- IMG: FA → AR/AP → Business Transactions → Closing → Valuate → Flat-Rate Individual Value Adjustment → Define Flat-Rate Individual Value Adjustment
- En la misma entrada: Key ##, Description, Calculation Base (Net Amount), y las entradas de porcentaje CON Valuation Area incluida:
  | Valuation Area | Days Overdue (from) | Percentage Rate |
  | (área vinculada a 0L) | 30 | 10 |
  | (área vinculada a 0L) | 60 | 20 |
- Para identificar el Valuation Area → SPRO: FA → AR/AP → Closing → Valuate → Define Valuation Areas → buscar área con Ledger = 0L para TA##
- Bridge step en Customer Master (BP → Account Management → **Value Adjustment** = key ##) → sin esto el key no aplica al cliente en el valuation run.

## PROTOCOLO DE COMPLETITUD — CHECK ANTES DE TERMINAR:
Antes de enviar tu respuesta, verifica punto por punto:
- ¿Cubrí TODAS las tasks y subtareas del ejercicio?
- ¿En OBA7: marqué K+S para vendor, D+S para customer? ¿Required fields correctos (Document Header Text vs Reference según enunciado)?
- ¿En FBN1: Internal vs External? Year correcto? Bridge step de vuelta a OBA7?
- ¿En BP: Reconciliation Account + Sort Key (con F4 caveat si incierto) + Payment Terms + tabs correctas?
- ¿En Document Splitting: BT 0300 vendor, BT 0200 customer, Variant 0001?
- ¿En testing: app correcta (Incoming=vendor, Outgoing=customer)? ¿Dónde va el número externo (Document Number no Reference)? ¿Profit Center si la cuenta lo requiere?
- ¿En Perform Further Valuations: usé el flujo Dispatch→Display→Forward (NO el patrón FCV)?
- ¿En Manage Automatic Payments: usé "Create Parameter" y "Schedule→Proposal/Payment→Start Immediately"?
- ¿En House Bank: usé Manage Bank Accounts (Fiori)? ¿Incluí Generate IBAN? ¿Incluí bridge step Manage G/L Account Master Data?
- ¿En Flat-Rate Value Adjustment: porcentajes + Valuation Area en UNA sola entrada (no steps separados)?
- ¿En FBZP Bank Determination: Available Amounts y Value Date son sub-tablas SEPARADAS? ¿Value Date incluye Payment Method?
Si detectas algo faltante → agrégalo con el label "📌 **Paso adicional requerido:**"

## FORMATO DE RESPUESTA:
1. **Resumen inicial**: módulos, número de tareas, dependencias entre ellas
2. Por cada tarea: Transacción + Ruta IMG + pasos campo por campo
3. ⚠️ Bridge steps explícitos entre tareas
4. ✅ Verificación al final de cada tarea
5. ⚠️ Errores comunes específicos del patrón SAP

Usa ## para tareas, ### para subtareas.
Usa **negrita** para transacciones y campos SAP.
Usa \`código\` para T-codes, nombres de tabla y field names.
Responde en el mismo idioma que el estudiante (español o inglés).
Sé preciso — no inventes T-codes ni field names. Si no puedes verificar un valor → "⚠️ verificar en sistema con F4".
El examen C_TS4FI_2023 es performance-based y open-book — cada paso debe ser ejecutable directamente en SAP.

## LONGITUD Y DENSIDAD — REGLA DE ORO:
**PRIMERO cubre TODAS las tasks. DESPUÉS añade detalle si sobra espacio.**
- Una tabla de campos reemplaza párrafos. Úsalas siempre.
- Máximo 1 línea de introducción por task: solo "Transaction + IMG path" y directo a los pasos.
- NO repitas información del enunciado. NO escribas notas obvias.
- Si el ejercicio tiene 4 tasks → las 4 deben aparecer completas en tu respuesta, sin excepción.
- Una respuesta que cubre 4 tasks con 80% de detalle es MEJOR que una que cubre 2 tasks con 100% de detalle.`;

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
          max_tokens: 16000,
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
      if (!res.ok) {
        let body = '';
        try { const j = await res.json(); body = j.error?.message || JSON.stringify(j); } catch(e) {}
        throw new Error(`HTTP ${res.status}: ${body}`);
      }

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
