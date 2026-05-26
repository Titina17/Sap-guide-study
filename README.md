[README.md](https://github.com/user-attachments/files/28270319/README.md)
# 🎓 SAP FI Certification Hub
### Guías interactivas para la certificación **C_TS4FI_2023** — SAP S/4HANA Financial Accounting

> Material de estudio personal · Valentina RF · 2025–2026

---

## 📋 Contenido del proyecto

| Archivo | Curso | Descripción | Estado |
|---|---|---|---|
| `index.html` | — | Landing page · selector de cursos | ✅ Completo |
| `s4f12.html` | S4F12 | Basics of Customizing for Financial Accounting | ✅ Completo |
| `s4f13.html` | S4F13 | Additional FI Configuration in SAP S/4HANA | ✅ Completo |
| `s4f15.html` | S4F15 | Configuring the Financial Closing | ✅ Completo |
| `s4f17.html` | S4F17 | Configuring Asset Accounting | ✅ Completo |
| `s4c03.html` | S4C03 | Implementing SAP S/4HANA Cloud Private Edition | ✅ Completo |
| `assistant.js` | Todos | Asistente IA flotante · widget compartido | ✅ Activo |

---

## 🤖 Asistente IA integrado

Cada página incluye un **botón flotante 🎓** (esquina inferior derecha) que abre un chat con IA especializada en SAP FI.

**Capacidades:**
- Resuelve ejercicios de los 5 cursos paso a paso
- Proporciona rutas IMG exactas y T-codes verificados
- Explica cadenas de configuración (prerequisitos → ejecución → verificación)
- Detecta automáticamente el módulo según el contenido del ejercicio
- Mantiene historial de conversación por sesión

**Basado en:** Claude Sonnet 4 (Anthropic) · System prompt con contenido oficial SAP S/4HANA FI

---

## 🗂️ Estructura de las guías HTML

Cada guía sigue una arquitectura de tabs consistente:

```
📄 s4fXX.html
 ├── Tab: Teoría          → Conceptos clave, definiciones, tablas comparativas
 ├── Tab: Ejercicios      → Todos los ejercicios del curso con soluciones paso a paso
 ├── Tab: Comparativas    → Tablas de diferencias entre conceptos similares
 ├── Tab: Config Chains   → Cadenas de configuración para el examen
 └── Tab: Quick Reference → T-codes, IMG paths, valores de campos en tabla
```

---

## 🎯 Sobre el examen C_TS4FI_2023

| Aspecto | Detalle |
|---|---|
| Formato | Performance-based · escenarios en sistema SAP real |
| Modalidad | Open-book · acceso a documentación durante el examen |
| Duración | 180 minutos |
| Idioma | Inglés / Español disponible |
| Cursos cubiertos | S4F12, S4F13, S4F15, S4F17, S4C03, SL_RISE419 |

> ⚠️ El examen **no** es de opción múltiple tradicional. Evalúa ejecución real de configuración en SAP S/4HANA.

---

## 🚀 Uso local

No requiere servidor ni instalación. Solo abre `index.html` en cualquier navegador moderno:

```bash
# Opción 1 — abrir directamente
open index.html

# Opción 2 — servidor local (evita restricciones CORS en algunos navegadores)
python -m http.server 8000
# → http://localhost:8000
```

**Requisito para el asistente IA:** conexión a internet (llama a la API de Anthropic).

---

## 📁 Convenciones del material

- **Valores de entrenamiento** como `GR##`, `FLCU##` se identifican explícitamente y se distinguen de los estándares SAP reales
- **Bilingüe ES/EN** — todas las guías incluyen toggle de idioma
- **Cadenas de configuración** documentan el error que ocurre si cada paso prerequisito falta
- Los T-codes y rutas IMG están verificados contra el material oficial SAP

---

## 🔄 Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| v1.0 | 2025 | S4F12 completado |
| v1.1 | 2025 | S4F13 completado + PDF guía |
| v1.2 | 2026 | S4F15, S4F17, S4C03 completados |
| v1.3 | 2026 | Asistente IA integrado en todas las páginas |

---

*Material preparado con apoyo de Claude (Anthropic) · Verificado contra fuentes oficiales SAP Learning*
