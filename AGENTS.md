# AGENTS.md — Constitución del Proyecto (BISync POS Web)
   
   Este documento define la arquitectura, stack tecnológico, paleta fundamental y directrices que todos los agentes de IA deben seguir estrictamente en este repositorio (`bisync-pos-web`).
   
   --- 
       
   ## 1. Propósito y Alcance del Repositorio
   
   * **Naturaleza del Proyecto:** Sitio web oficial, landing page y centro de distribución pública de **BISync POS**.
   * **Objetivos clave:**
     1. Presentación comercial, características del POS y propuesta de valor para comercios.
     2. Distribución y descarga directa de instaladores para Windows (`.exe`, `.msi`) mediante GitHub Releases.
     3. Despliegue estático de alto rendimiento en **GitHub Pages**.
   * **Separación de Responsabilidades:** Este repositorio es 100% público y estático. No contiene código fuente del POS, lógica criptográfica privada de licencias ni persistencia de
   datos.                                                                                                                                                                                   
         
   --- 
       
   ## 2. Stack Tecnológico
   
   * **Framework:** [Astro](https://astro.build/) (enfoque de cero JavaScript por defecto, arquitectura basada en componentes `.astro`).                                                    
   * **Estilos:** [Tailwind CSS](https://tailwindcss.com/).                                                                                                                                 
   * **Despliegue / Hosting:** **GitHub Pages** mediante GitHub Actions oficial de Astro.
   * **Iconografía & Assets:** SVGs en línea o paquetes ligeros (ej. `lucide-astro`). Cero imágenes pesadas sin optimizar.
   * **Sin Backend:** No se permiten servidores Node/SSR dinámicos, servicios serverless que requieran base de datos ni llamadas a APIs de pago.
 
   ---
 
   ## 3. Paleta de Colores de Marca (3 Colores Base)                                                                                                                                        
 
   El diseño visual específico se definirá posteriormente con skills de UI/UX, pero **debe respetar exclusivamente estos tres colores de identidad**:
 
   | Rol | Nombre | HEX | Uso previsto |
   | :--- | :--- | :--- | :--- |
   | **Primario** | Cobalto BISync | `#1D61E0` | Botones de acción principal (CTA), enlaces, acentos de marca. |
   | **Acento Éxito** | Esmeralda | `#00B074` | Botón de descarga principal, indicadores de estado, validación. |
   | **Neutro Oscuro** | Dark Base | `#0A0D12` | Fondo dark mode, tarjetas de alto contraste o textos principales en modo claro. |
 
   > [!NOTE]
   > **No importar el diseño de la app de escritorio:** Este proyecto **no** aplica las reglas de pantallas táctiles de POS (botones de 64 px, landscape fijo de 1280x800, etc.). Es una    
   **página web moderna y responsive** (móvil, tablet y escritorio).
 
   ---
 
   ## 4. Reglas de Distribución de Instaladores (Releases)
 
   1. **PROHIBIDO versionar binarios pesados en Git:** No colocar archivos `.exe`, `.msi`, `.zip` ni instaladores dentro del árbol de carpetas (`public/`, `dist/`, etc.).
   2. **Enlaces de Descarga:** Todos los botones de descarga de la web se alimentan de la variable de entorno `PUBLIC_DOWNLOAD_URL` (centralizada en `src/config/download.ts`):
      * Enlace oficial por defecto:  
        `https://github.com/BISync-Solutions/bisync-pos-web/releases/`
   3. Los instaladores se compilan en el repositorio principal (`simple-crm`) y se publican como assets en GitHub Releases.
 
   ---
 
   ## 5. Estructura del Proyecto
 
   ```text
   bisync-pos-web/
   ├── .github/
   │   └── workflows/
   │       └── deploy.yml          # Build y deploy automático a GitHub Pages
   ├── public/
   │   ├── favicon.svg
   │   └── og-image.png            # Vista previa para redes sociales
   ├── src/
   │   ├── components/             # Componentes modulares (Hero, Features, Pricing, DownloadCTA)
   │   ├── layouts/
   │   │   └── BaseLayout.astro    # Metadata SEO, OpenGraph, fuentes y estructura HTML5
   │   ├── pages/
   │   │   └── index.astro         # Página de inicio / Landing
   │   └── styles/
   │       └── global.css          # Directivas de Tailwind y estilos base
   ├── astro.config.mjs
   ├── tailwind.config.mjs
   └── package.json
 ──────
 ## 6. Rendimiento, SEO y Accesibilidad
 
 • Lighthouse Target: Puntuación superior a 95 en Rendimiento, Accesibilidad, Buenas Prácticas y SEO.
 • Metadata y SEO: Incluir metaetiquetas completas (title, description, canonical, Open Graph y Twitter Cards) en BaseLayout.astro.
 • Semántica HTML: Uso estricto de elementos semánticos (<header>, <main>, <section>, <footer>, <nav>, <h1> único). 
 • Contraste Accesible: Garantizar ratio de contraste WCAG AA en todos los textos sobre fondos claros y oscuros.
 ──────
 ## 7. Protocolo de Ejecución para Agentes 
 
 1. Trabajar en commits pequeños y atómicos con Conventional Commits (feat:, fix:, style:, docs:).
 2. Todo componente creado debe ser responsive y libre de warnings en el linter y compilador de Astro.
 3. No instalar librerías pesadas (como UI kits complejos de React) si se puede resolver con componentes nativos de Astro y Tailwind. 