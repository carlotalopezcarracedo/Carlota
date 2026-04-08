# Diseño: Optimización de imágenes, filtros de proyectos y sección de clientes

**Fecha:** 2026-04-08  
**Proyecto:** Portfolio de Carlota López (GitHub Pages — `/Carlota/`)

---

## 1. Optimización de imágenes

### Problema
Las imágenes en `/public` son archivos sin comprimir de hasta 44MB (GIF) y 18MB (PNG). No hay lazy loading. Todo se descarga al cargar la página.

### Solución

**Script de compresión** (`scripts/optimize-images.mjs`):
- Usa `sharp` (Node.js) para procesar todas las imágenes de `/public`
- Genera versiones `.webp` al 80% de calidad, máximo 1200px de ancho
- El GIF `quimeras-del-norte.gif` se convierte a PNG estático (`quimeras-del-norte.webp`)
- Se ejecuta manualmente con `node scripts/optimize-images.mjs` antes de cada deploy
- Los archivos originales se conservan (no se borran)

**Resultado estimado:**

| Imagen | Antes | Después |
|---|---|---|
| `quimeras-del-norte.gif` | 44 MB | ~300 KB |
| `orestes-comunica.png` | 18 MB | ~200 KB |
| `nobreh.png` | 14 MB | ~150 KB |
| `ana-san-juan.png` | 10 MB | ~120 KB |
| `aceites-retamar.png` | 5 MB | ~80 KB |
| `vitamina-3.png` | 1.2 MB | ~30 KB |
| **Total** | **~130 MB** | **~4–6 MB** |

**Lazy loading en `ParallaxImage`:**
- `<motion.img>` recibe `loading="lazy"` y `decoding="async"`
- Los proyectos con índice 0 y 1 usan `loading="eager"` (visibles al cargar)
- Placeholder visual: el `bg-neutral-900` existente sirve como estado de carga, sin cambios visuales

**Cambios en referencias de imágenes:**
- Todos los `imageSrc` en `PROJECTS` cambian de `.png`/`.gif` a `.webp`
- La URL se construye igual: `` `${import.meta.env.BASE_URL}${project.imageSrc}` ``

---

## 2. Filtros de categoría en proyectos

### Cambio en el tipo `ProjectItem`
El campo `type` (string descriptivo) se mantiene. Se añade:
```ts
category: ("web" | "social" | "branding" | "producto")[]
```
Permite que un proyecto aparezca en múltiples categorías.

### Tabs de filtro
- Opciones: `Todos · Web · Redes Sociales · Branding · Diseño de Producto`
- Tab activo: underline animado con Framer Motion (`layoutId` para transición suave)
- Cambio de categoría: fade + slide de los proyectos con `AnimatePresence`
- Mobile: tabs en scroll horizontal

### Proyectos por categoría

| Categoría | Proyectos |
|---|---|
| Web | Ana Sanjuán, Kairas, Copiabarata, Quimeras del Norte |
| Redes Sociales | Aceites Retamar, XGAP Fitness Center, Kairas (RRSS) |
| Branding | Quimeras del Norte, Nobreh, Vitamina 3, Óptima, Kulmen Visuals, Elephant and Castle, Kairas |
| Diseño de Producto | Orestes Comunica, Gotas de Santiago |

### Proyectos nuevos completos

**WEB**
- **Kairas** — `link: "http://kairas.es/"`, `category: ["web", "branding"]`, imagen: placeholder de color con nombre
- **Copiabarata** — `link: "https://www.copiabarata.com/"`, `category: ["web"]`, imagen: placeholder

**REDES SOCIALES**
- **XGAP Fitness Center** — `link: "https://www.instagram.com/xgapfitnesscenter/"`, `category: ["social"]`, imagen: placeholder
- **Kairas (RRSS)** — `link: "https://www.instagram.com/kairas.ai/"`, `category: ["social"]`, imagen: placeholder (distinto a Kairas web)

**BRANDING**
- **Óptima** — `category: ["branding"]`, imagen: placeholder
- **Kulmen Visuals** — `link: "https://kulmenvisuals.com/"`, `category: ["branding"]`, imagen: placeholder
- **Elephant and Castle** — `category: ["branding"]`, imagen: placeholder

**DISEÑO DE PRODUCTO**
- **Gotas de Santiago** — `category: ["producto"]`, imagen: placeholder

### Placeholder visual
Para proyectos sin imagen: `div` con fondo de color sólido (derivado de `project.color`) y el nombre del proyecto centrado en tipografía bold. Mismo ratio `aspect-[4/3]` que las imágenes reales.

---

## 3. Sección de Clientes

### Posición
Después de la sección de Proyectos, antes del Footer.

### Layout
```
[Título "Clientes" — estilo editorial de la web]
[Fila de logos en marquee infinito animado]
```

### Marquee
- Animación CSS con Framer Motion o `animation: scroll` CSS puro
- Los logos se duplican para continuidad visual
- Hover sobre cualquier logo: pausa la animación
- Fondo: `bg-neutral-950` (oscuro) para que los logos blancos sean visibles

### Logos disponibles (archivos PNG)
Guardar en `/public/logos/`:
- `optima.png`
- `kairas.png`
- `quimeras-del-norte-logo.png`
- `xgap.png`
- `nobreh.png`

### Clientes sin logo (texto estilizado)
Misma fuente display de la web, opacidad reducida (50%), mismo tamaño visual que los logos:
- Copiabarata
- Karra Coaching
- Prime Energía
- AE League
- Kulmen Visuals
- Gotas de Santiago
- Elephant and Castle
- Vitamina 3
- Orestes Comunica
- Aceites Retamar
- Ana San Juan

---

## 4. Archivos a crear/modificar

| Archivo | Acción |
|---|---|
| `scripts/optimize-images.mjs` | Crear — script de compresión |
| `public/logos/` | Crear — carpeta con logos de clientes |
| `App.tsx` | Modificar — tipo, datos, componentes |
| `package.json` | Modificar — añadir `sharp` como devDependency |

---

## 5. Fuera de alcance

- No se tocan animaciones existentes (parallax, preloader, cursor)
- No se modifica el diseño visual de secciones existentes (Hero, Sobre mí, Experiencia)
- No se añade routing ni páginas de detalle de proyecto
- Los logos de clientes sin archivo se sustituyen por texto, no por imágenes de placeholder externas
