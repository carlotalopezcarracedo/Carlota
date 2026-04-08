# Optimización de imágenes, filtros de proyectos y sección de clientes — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reducir el peso de las imágenes de ~130 MB a ~5 MB, añadir filtros de categoría en proyectos y una sección de clientes con logos animados.

**Architecture:** Script de Node con `sharp` comprime las imágenes a WebP una sola vez antes del deploy. `App.tsx` se modifica en tres áreas independientes: tipo + datos de proyectos, componente `Projects` con filtros, y nuevo componente `Clients` con marquee.

**Tech Stack:** React 19, Framer Motion 12, Vite 6, TypeScript, Tailwind CSS, sharp (devDependency), Node.js ESM

---

## Mapa de archivos

| Archivo | Acción |
|---|---|
| `scripts/optimize-images.mjs` | Crear — script de compresión |
| `public/logos/` | Crear carpeta — logos de clientes |
| `App.tsx` | Modificar — tipo, datos, componentes |
| `package.json` | Modificar — añadir `sharp` |

---

## Task 1: Instalar sharp y crear el script de optimización

**Files:**
- Modify: `package.json`
- Create: `scripts/optimize-images.mjs`

- [ ] **Step 1: Instalar sharp**

```bash
npm install --save-dev sharp
```

Expected: `sharp` aparece en `devDependencies` de `package.json`.

- [ ] **Step 2: Crear el script `scripts/optimize-images.mjs`**

```js
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { extname, basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const MAX_WIDTH = 1200;
const QUALITY = 80;

const files = await readdir(PUBLIC_DIR);

const pngFiles = files.filter(f =>
  ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase())
);
const gifFiles = files.filter(f => extname(f).toLowerCase() === '.gif');

for (const file of pngFiles) {
  const input = join(PUBLIC_DIR, file);
  const outputName = basename(file, extname(file)) + '.webp';
  const output = join(PUBLIC_DIR, outputName);
  await sharp(input)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);
  console.log(`✓ ${file} → ${outputName}`);
}

for (const file of gifFiles) {
  const input = join(PUBLIC_DIR, file);
  const outputName = basename(file, '.gif') + '.webp';
  const output = join(PUBLIC_DIR, outputName);
  await sharp(input, { pages: 1 })
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);
  console.log(`✓ ${file} → ${outputName} (primer frame)`);
}

console.log('\n✅ Optimización completada.');
```

- [ ] **Step 3: Ejecutar el script**

```bash
node scripts/optimize-images.mjs
```

Expected output (ejemplo):
```
✓ ana-san-juan.png → ana-san-juan.webp
✓ aceites-retamar.png → aceites-retamar.webp
✓ nobreh.png → nobreh.webp
✓ orestes-comunica.png → orestes-comunica.webp
✓ vitamina-3.png → vitamina-3.webp
✓ quimeras-del-norte.gif → quimeras-del-norte.webp (primer frame)

✅ Optimización completada.
```

Verificar que en `/public` han aparecido los archivos `.webp` con tamaños drásticamente menores.

- [ ] **Step 4: Commit**

```bash
git add scripts/optimize-images.mjs package.json package-lock.json public/*.webp
git commit -m "feat: add image optimization script and generate WebP versions"
```

---

## Task 2: Guardar logos de clientes

**Files:**
- Create: `public/logos/` (carpeta)

- [ ] **Step 1: Crear carpeta de logos**

Crear la carpeta `public/logos/` en el explorador de archivos.

- [ ] **Step 2: Guardar los logos con estos nombres exactos**

Guardar cada archivo de logo en `public/logos/` con los siguientes nombres:

| Logo compartido en el chat | Nombre de archivo |
|---|---|
| Logo Óptima (círculo con rayo + texto) | `optima.png` |
| Logo Kairas (corona + texto KAIRAS) | `kairas.png` |
| Logo Quimeras del Norte (árbol + texto caligráfico) | `quimeras-del-norte.png` |
| Logo XGAP Fitness Center (icono fitness + texto) | `xgap.png` |
| Logo Nobreh (trébol + texto NOBREH) | `nobreh.png` |

Los logos restantes (Copiabarata, Karra Coaching, Prime Energía, AE League, Kulmen Visuals, Gotas de Santiago, Elephant and Castle, Vitamina 3, Orestes Comunica, Aceites Retamar, Ana San Juan) se mostrarán como texto hasta tener sus archivos.

- [ ] **Step 3: Verificar**

```bash
ls public/logos/
```

Expected: `kairas.png  nobreh.png  optima.png  quimeras-del-norte.png  xgap.png`

- [ ] **Step 4: Commit**

```bash
git add public/logos/
git commit -m "feat: add client logos to public/logos"
```

---

## Task 3: Actualizar el tipo `ProjectItem` y los datos de proyectos

**Files:**
- Modify: `App.tsx` — interfaz `ProjectItem` (línea ~22) y array `PROJECTS` (línea ~76)

- [ ] **Step 1: Añadir el campo `category` a la interfaz `ProjectItem`**

Localizar la interfaz en `App.tsx` y reemplazarla:

```ts
// ANTES (aprox. línea 22):
interface ProjectItem {
  id: string;
  title: string;
  type: string;
  description: string;
  concept: string[];
  visuals: string[];
  color: string;
  imageSrc?: string;
  imageSeed?: string;
  link?: string;
}

// DESPUÉS:
interface ProjectItem {
  id: string;
  title: string;
  type: string;
  category: ("web" | "social" | "branding" | "producto")[];
  description: string;
  concept: string[];
  visuals: string[];
  color: string;
  imageSrc?: string;
  link?: string;
}
```

- [ ] **Step 2: Reemplazar el array `PROJECTS` completo**

Reemplazar todo el bloque `const PROJECTS: ProjectItem[] = [...]` con:

```ts
const PROJECTS: ProjectItem[] = [
  {
    id: "01",
    title: "Ana Sanjuán",
    type: "Diseño Web & UI/UX",
    category: ["web"],
    description: "Diseño y desarrollo de la presencia digital para una consultora de RRHH y mentoring. La web refleja profesionalidad y cercanía a través de una estética minimalista, colores neutros y una estructura de navegación intuitiva orientada a la conversión de clientes corporativos.",
    concept: [
      "Identidad serena y profesional",
      "Experiencia de usuario fluida",
      "Diseño responsive adaptativo",
      "Enfoque en servicios de mentoring"
    ],
    visuals: ["Mockups de alta fidelidad", "Sistema de diseño minimalista", "Tipografía editorial"],
    color: "text-rose-300",
    imageSrc: "/ana-san-juan.webp",
    link: "https://ana-sanjuan.com/"
  },
  {
    id: "02",
    title: "Aceites Retamar",
    type: "Social Media & Dirección de Arte",
    category: ["social"],
    description: "Estrategia de contenido y diseño gráfico para redes sociales. El proyecto 'Aceite con Alma' busca conectar con el consumidor a través de una narrativa visual que mezcla la tradición del aceite de oliva con un estilo de vida moderno y gastronómico.",
    concept: [
      "Narrativa visual 'Con Alma'",
      "Formas orgánicas y fluidas",
      "Paleta de colores tierra y oro",
      "Fotografía de producto en contexto"
    ],
    visuals: ["Feed de Instagram cohesivo", "Historias interactivas", "Fotografía gastronómica"],
    color: "text-yellow-400",
    imageSrc: "/aceites-retamar.webp",
  },
  {
    id: "03",
    title: "Orestes Comunica",
    type: "Publicidad Exterior & Creatividad",
    category: ["producto"],
    description: "Diseño de campaña de publicidad exterior y creatividades para agencia de marketing. Una propuesta visual disruptiva basada en el contraste tipográfico y mensajes directos (copywriting) que interpelan al espectador en el entorno urbano.",
    concept: [
      "Copywriting de impacto",
      "Contraste cromático fuerte",
      "Diseño para gran formato",
      "Comunicación disruptiva"
    ],
    visuals: ["Mupis y vallas publicitarias", "Cartelería urbana", "Aplicaciones de marca"],
    color: "text-orange-500",
    imageSrc: "/orestes-comunica.webp",
  },
  {
    id: "04",
    title: "Quimeras del Norte",
    type: "Branding & Web",
    category: ["web", "branding"],
    description: "Proyecto de identidad corporativa y web para una plataforma de narrativas gallegas. La propuesta se centra en traspasar las historias y escritos de diversos personajes gallegos al entorno digital.",
    concept: [
      "Misión: Difundir narraciones gallegas",
      "Color verde: Naturaleza y entorno",
      "Roble (Carballo): Elemento central",
      "Quimera: Mitología e historias imposibles"
    ],
    visuals: ["Logotipo serif elegante", "Símbolo de árbol estilizado", "Sistema visual completo"],
    color: "text-emerald-400",
    imageSrc: "/quimeras-del-norte.webp",
  },
  {
    id: "05",
    title: "Nobreh",
    type: "Identidad Corporativa | Inversiones",
    category: ["branding"],
    description: "Desarrollo de imagen visual corporativa para una empresa familiar de gestión de inversiones. Se requería una identidad que transmitiera elegancia y simplicidad.",
    concept: [
      "Color amarillo: Riqueza",
      "Trébol: Fortuna",
      "5 hojas: Miembros de la familia",
      "Estilo: Minimalista y sofisticado"
    ],
    visuals: ["Logotipo limpio", "Trébol estilizado", "Paleta dorada"],
    color: "text-yellow-400",
    imageSrc: "/nobreh.webp",
  },
  {
    id: "06",
    title: "Vitamina 3",
    type: "Branding | Proyecto Universitario",
    category: ["branding"],
    description: "Proyecto que refleja los valores de un equipo creativo. El nombre nace de la metáfora de aportar energía y vitalidad a las marcas.",
    concept: [
      "33,3% atípicamente diferente",
      "Dosis diaria de energía creativa",
      "Cercanía personalizada"
    ],
    visuals: ["Símbolo solar/energía", "Verde lima/Amarillo", "Tipografía bold"],
    color: "text-lime-400",
    imageSrc: "/vitamina-3.webp",
  },
  {
    id: "07",
    title: "Kairas",
    type: "Diseño Web & Branding",
    category: ["web", "branding"],
    description: "Diseño web e identidad visual para Kairas, plataforma de inteligencia artificial. Una propuesta que combina tecnología y elegancia para transmitir confianza e innovación.",
    concept: [
      "Identidad digital moderna",
      "UI/UX orientada a conversión",
      "Branding tecnológico",
      "Experiencia de usuario premium"
    ],
    visuals: ["Web responsive", "Sistema de diseño", "Logotipo"],
    color: "text-blue-400",
    link: "http://kairas.es/",
  },
  {
    id: "08",
    title: "Copiabarata",
    type: "Diseño Web",
    category: ["web"],
    description: "Diseño y desarrollo web para Copiabarata, servicio de reprografía y copistería online. Interfaz clara y funcional orientada a facilitar el proceso de pedido.",
    concept: [
      "Experiencia de compra clara",
      "Diseño funcional y directo",
      "Navegación intuitiva",
      "Enfoque en conversión"
    ],
    visuals: ["E-commerce", "Diseño de producto", "Web responsive"],
    color: "text-cyan-400",
    link: "https://www.copiabarata.com/",
  },
  {
    id: "09",
    title: "XGAP Fitness Center",
    type: "Social Media & Contenido Digital",
    category: ["social"],
    description: "Estrategia de contenido y gestión de redes sociales para centro de fitness. Contenido motivacional que refleja la energía y los valores de la comunidad deportiva.",
    concept: [
      "Contenido motivacional",
      "Identidad fitness moderna",
      "Comunidad activa",
      "Estética dinámica y potente"
    ],
    visuals: ["Feed de Instagram", "Stories", "Reels"],
    color: "text-red-400",
    link: "https://www.instagram.com/xgapfitnesscenter/",
  },
  {
    id: "10",
    title: "Kairas (RRSS)",
    type: "Social Media & Contenido Digital",
    category: ["social"],
    description: "Gestión de redes sociales y estrategia de contenido para Kairas AI. Comunicación tecnológica cercana que educa y genera comunidad en torno a la inteligencia artificial.",
    concept: [
      "Comunicación tecnológica accesible",
      "Contenido educativo",
      "Identidad digital consistente",
      "Engagement con comunidad tech"
    ],
    visuals: ["Posts", "Stories", "Contenido multimedia"],
    color: "text-blue-300",
    link: "https://www.instagram.com/kairas.ai/",
  },
  {
    id: "11",
    title: "Óptima",
    type: "Branding e Identidad Visual",
    category: ["branding"],
    description: "Desarrollo de identidad corporativa para empresa del sector energético. Una imagen que transmite eficiencia, innovación y confianza a través de una estética limpia y contemporánea.",
    concept: [
      "Energía y eficiencia",
      "Identidad profesional",
      "Sistema visual completo",
      "Confianza y modernidad"
    ],
    visuals: ["Logotipo", "Manual de marca", "Aplicaciones"],
    color: "text-orange-400",
  },
  {
    id: "12",
    title: "Kulmen Visuals",
    type: "Branding & Identidad Visual",
    category: ["branding"],
    description: "Identidad corporativa para estudio de fotografía y producción visual. Una marca premium que refleja la excelencia técnica y la visión artística del estudio.",
    concept: [
      "Elegancia visual",
      "Minimalismo sofisticado",
      "Marca premium",
      "Excelencia técnica"
    ],
    visuals: ["Logotipo", "Sistema de diseño", "Web"],
    color: "text-neutral-300",
    link: "https://kulmenvisuals.com/",
  },
  {
    id: "13",
    title: "Elephant and Castle",
    type: "Branding e Identidad Visual",
    category: ["branding"],
    description: "Proyecto de identidad visual y branding con concepto narrativo fuerte. Una propuesta que construye una marca memorable a través de la simbología y la tipografía.",
    concept: [
      "Identidad con narrativa",
      "Concepto visual distintivo",
      "Sistema de marca cohesivo",
      "Tipografía expresiva"
    ],
    visuals: ["Logotipo", "Paleta cromática", "Aplicaciones de marca"],
    color: "text-amber-400",
  },
  {
    id: "14",
    title: "Gotas de Santiago",
    type: "Diseño de Producto & Packaging",
    category: ["producto"],
    description: "Diseño de etiqueta para botella de licor Gotas de Santiago. Una propuesta visual que fusiona tradición y elegancia en el packaging, evocando la esencia del Camino de Santiago.",
    concept: [
      "Identidad artesanal y tradicional",
      "Tipografía clásica y elegante",
      "Ilustración de producto",
      "Herencia cultural gallega"
    ],
    visuals: ["Etiqueta de botella", "Diseño editorial", "Mockup de producto"],
    color: "text-amber-300",
  },
];
```

- [ ] **Step 3: Verificar que TypeScript no da errores**

```bash
npx tsc --noEmit
```

Expected: Sin errores. Si hay errores de tipo relacionados con `imageSeed`, es porque algún lugar del código aún lo usa — buscar y eliminar las referencias a `imageSeed` en el JSX.

- [ ] **Step 4: Commit**

```bash
git add App.tsx
git commit -m "feat: add category field to projects, update to WebP images, add 8 new projects"
```

---

## Task 4: Actualizar `ParallaxImage` y añadir `PlaceholderImage`

**Files:**
- Modify: `App.tsx` — componente `ParallaxImage` (aprox. línea 383) y añadir `PlaceholderImage` justo después

- [ ] **Step 1: Actualizar `ParallaxImage` para aceptar `loading` prop**

```tsx
// ANTES:
const ParallaxImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.img 
        style={{ y, scale, willChange: 'transform' }}
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// DESPUÉS:
const ParallaxImage = ({ src, alt, className, loading = "lazy" }: { src: string, alt: string, className?: string, loading?: "lazy" | "eager" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.img 
        style={{ y, scale, willChange: 'transform' }}
        src={src} 
        alt={alt}
        loading={loading}
        decoding="async"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
```

- [ ] **Step 2: Añadir `PlaceholderImage` justo después de `ParallaxImage`**

```tsx
const PlaceholderImage = ({ title, color }: { title: string; color: string }) => (
  <div className="w-full h-full flex items-center justify-center bg-neutral-900">
    <span className={`font-display text-2xl md:text-3xl font-bold uppercase tracking-tighter ${color} opacity-30 text-center px-8`}>
      {title}
    </span>
  </div>
);
```

- [ ] **Step 3: Commit**

```bash
git add App.tsx
git commit -m "feat: add lazy loading to ParallaxImage, add PlaceholderImage component"
```

---

## Task 5: Añadir filtros de categoría al componente `Projects`

**Files:**
- Modify: `App.tsx` — componente `Projects` (aprox. línea 653)

- [ ] **Step 1: Reemplazar el componente `Projects` completo**

Localizar `const Projects = () => {` y reemplazar todo el componente con:

```tsx
type CategoryFilter = "todos" | "web" | "social" | "branding" | "producto";

const CATEGORY_FILTERS: { id: CategoryFilter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "web", label: "Web" },
  { id: "social", label: "Redes Sociales" },
  { id: "branding", label: "Branding" },
  { id: "producto", label: "Diseño de Producto" },
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("todos");

  const filteredProjects = activeFilter === "todos"
    ? PROJECTS
    : PROJECTS.filter(p => p.category.includes(activeFilter));

  return (
    <section id="proyectos" className="py-24 px-6 md:px-12 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
        <SectionLabel text="Proyectos" />
        
        <div className="col-span-12 md:col-span-10">
          <div className="mb-12">
            <MaskTextReveal 
              className="font-display text-[9vw] md:text-[8vw] leading-[0.85] font-bold text-white tracking-tighter uppercase"
              text="PROYECTOS SELECCIONADOS"
            />
          </div>

          {/* Filter tabs */}
          <div className="mb-20 overflow-x-auto scrollbar-none">
            <div className="flex gap-0 border-b border-neutral-800 min-w-max">
              {CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className="relative px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors duration-300 whitespace-nowrap cursor-pointer"
                  style={{ color: activeFilter === filter.id ? '#ffffff' : '#737373' }}
                >
                  {filter.label}
                  {activeFilter === filter.id && (
                    <motion.span
                      layoutId="filter-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-32"
            >
              {filteredProjects.map((project, index) => (
                <div key={project.id} className="group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
                  
                  {/* Image Section */}
                  <div className={`col-span-12 md:col-span-7 ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                    <Interactive text="VIEW">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Abrir ${project.title} en nueva pestaña`}
                          className="block"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 group">
                            {project.imageSrc ? (
                              <ParallaxImage 
                                src={`${import.meta.env.BASE_URL}${project.imageSrc.replace(/^\//, "")}`}
                                alt={project.title}
                                loading={index < 2 ? "eager" : "lazy"}
                                className="w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-700"
                              />
                            ) : (
                              <PlaceholderImage title={project.title} color={project.color} />
                            )}
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                              <div className="bg-black text-white p-3 rounded-full border border-white/5 shadow-lg transform transition-transform duration-300 group-hover:scale-110 flex items-center justify-center w-12 h-12">
                                <ArrowUpRight className="w-6 h-6" />
                              </div>
                            </div>
                          </div>
                        </a>
                      ) : (
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 group">
                          {project.imageSrc ? (
                            <ParallaxImage 
                              src={`${import.meta.env.BASE_URL}${project.imageSrc.replace(/^\//, "")}`}
                              alt={project.title}
                              loading={index < 2 ? "eager" : "lazy"}
                              className="w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                          ) : (
                            <PlaceholderImage title={project.title} color={project.color} />
                          )}
                          <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            <div className="bg-black text-white p-3 rounded-full border border-white/5 shadow-lg transform transition-transform duration-300 group-hover:scale-110 flex items-center justify-center w-12 h-12 cursor-pointer">
                              <ArrowUpRight className="w-6 h-6" />
                            </div>
                          </div>
                        </div>
                      )}
                    </Interactive>
                  </div>

                  {/* Text Section */}
                  <div className="col-span-12 md:col-span-5 flex flex-col justify-center h-full pt-8">
                    <FadeUp>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-xs font-mono text-neutral-500">{String(index + 1).padStart(2, '0')}</span>
                        <span className="h-[1px] flex-grow bg-neutral-800"></span>
                        <span className={`text-xs font-bold uppercase tracking-widest ${project.color}`}>{project.type}</span>
                      </div>
                      
                      <h3 className="font-display text-5xl md:text-6xl text-white mb-8 group-hover:ml-4 transition-all duration-500">
                        {project.title}
                      </h3>
                      
                      <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                        {project.description}
                      </p>

                      <div className="space-y-4 border-l border-neutral-800 pl-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-2">Concepto</h4>
                        <ul className="space-y-2">
                          {project.concept.map((item, i) => (
                            <li key={i} className="text-sm text-neutral-500 flex items-center gap-2">
                              <span className={`w-1 h-1 rounded-full ${project.color.replace('text-', 'bg-')}`}></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </FadeUp>
                  </div>

                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Verificar en el navegador**

```bash
npm run dev
```

Comprobar:
- Los 5 tabs aparecen encima de los proyectos
- La línea blanca se desliza al cambiar de tab
- Al seleccionar "Web" solo se ven Ana Sanjuán, Kairas, Copiabarata, Quimeras del Norte
- Las primeras 2 imágenes cargan de inmediato; el resto usa lazy loading
- Los proyectos sin imagen muestran el nombre con el placeholder de color

- [ ] **Step 3: Commit**

```bash
git add App.tsx
git commit -m "feat: add category filter tabs to projects section"
```

---

## Task 6: Crear el componente `Clients`

**Files:**
- Modify: `App.tsx` — añadir datos `CLIENTS` y componente `Clients` antes del componente `App`

- [ ] **Step 1: Añadir los datos de clientes justo después de `ALL_SKILLS`**

Localizar `const ALL_SKILLS = [` y añadir después del array:

```ts
interface ClientItem {
  name: string;
  logo?: string;
}

const CLIENTS: ClientItem[] = [
  { name: "Kairas", logo: "/logos/kairas.png" },
  { name: "Óptima", logo: "/logos/optima.png" },
  { name: "Quimeras del Norte", logo: "/logos/quimeras-del-norte.png" },
  { name: "XGAP Fitness Center", logo: "/logos/xgap.png" },
  { name: "Nobreh", logo: "/logos/nobreh.png" },
  { name: "Copiabarata" },
  { name: "Karra Coaching" },
  { name: "Prime Energía" },
  { name: "AE League" },
  { name: "Kulmen Visuals" },
  { name: "Gotas de Santiago" },
  { name: "Elephant and Castle" },
  { name: "Vitamina 3" },
  { name: "Orestes Comunica" },
  { name: "Aceites Retamar" },
  { name: "Ana San Juan" },
];
```

- [ ] **Step 2: Añadir el componente `Clients` antes del componente `Footer`**

```tsx
const Clients = () => {
  const [paused, setPaused] = useState(false);
  const repeated = [...CLIENTS, ...CLIENTS, ...CLIENTS];

  return (
    <section className="py-20 px-6 md:px-12 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-screen-2xl mx-auto mb-12">
        <FadeUp>
          <div className="flex items-center gap-6">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">Clientes</span>
          </div>
        </FadeUp>
      </div>

      <div
        className="overflow-hidden relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />

        <div className="relative flex w-full overflow-hidden">
          {/* Track 1 */}
          <div
            className="flex items-center gap-12 py-6 whitespace-nowrap"
            style={{
              animation: 'marquee 40s linear infinite',
              animationPlayState: paused ? 'paused' : 'running',
            }}
          >
            {repeated.map((client, i) => (
              <ClientLogo key={i} client={client} />
            ))}
          </div>
          {/* Track 2 (duplicate for seamless loop) */}
          <div
            className="absolute top-0 flex items-center gap-12 py-6 whitespace-nowrap"
            style={{
              left: '100%',
              animation: 'marquee2 40s linear infinite',
              animationPlayState: paused ? 'paused' : 'running',
            }}
          >
            {repeated.map((client, i) => (
              <ClientLogo key={i} client={client} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ClientLogo = ({ client }: { client: ClientItem }) => {
  if (client.logo) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}${client.logo.replace(/^\//, "")}`}
        alt={client.name}
        loading="lazy"
        className="h-8 md:h-10 w-auto object-contain opacity-40 hover:opacity-100 transition-opacity duration-300"
        style={{ mixBlendMode: 'screen' }}
      />
    );
  }
  return (
    <span className="text-sm md:text-base font-bold uppercase tracking-widest text-neutral-600 hover:text-neutral-300 transition-colors duration-300 cursor-default select-none">
      {client.name}
    </span>
  );
};
```

> Nota: `mix-blend-mode: screen` hace que el fondo blanco de los logos desaparezca sobre el fondo oscuro, dejando visible solo el logotipo.

- [ ] **Step 3: Verificar en el navegador**

```bash
npm run dev
```

Comprobar:
- La sección aparece con todos los clientes
- Los logos con archivo aparecen como imagen; los demás como texto
- El marquee se mueve de derecha a izquierda
- Al hacer hover sobre la sección el scroll se pausa

- [ ] **Step 4: Commit**

```bash
git add App.tsx
git commit -m "feat: add Clients marquee section with logos"
```

---

## Task 7: Insertar la sección de clientes en el layout de la página

**Files:**
- Modify: `App.tsx` — función `App()` (aprox. línea 960)

- [ ] **Step 1: Añadir `<Clients />` en el JSX de `App`**

Localizar en la función `App()`:

```tsx
<Projects />
<Formation />
```

Reemplazar con:

```tsx
<Projects />
<Clients />
<Formation />
```

- [ ] **Step 2: Verificar la página completa**

```bash
npm run dev
```

Comprobar el orden de secciones:
1. Hero
2. Profile
3. Experience
4. InfiniteMarquee (skills)
5. **Projects** (con filtros de categoría)
6. **Clients** (nueva sección con logos)
7. Formation
8. Methodology
9. Footer

- [ ] **Step 3: Commit final**

```bash
git add App.tsx
git commit -m "feat: insert Clients section between Projects and Formation"
```

---

## Task 8: Build de verificación final

- [ ] **Step 1: Build de producción**

```bash
npm run build
```

Expected: Sin errores. El output se genera en `dist/`.

- [ ] **Step 2: Preview local**

```bash
npm run preview
```

Abrir en el navegador y comprobar:
- Las imágenes WebP cargan correctamente
- Los filtros funcionan
- La sección de clientes se ve bien
- No hay referencias a imágenes rotas en la consola del navegador

- [ ] **Step 3: Commit final si todo está bien**

```bash
git add -A
git commit -m "chore: verify production build passes"
```

---

## Notas para después

- Cuando tengas las imágenes de los proyectos nuevos (Copiabarata, Kairas web, XGAP, etc.), ponlas en `/public/` y añade su ruta en el campo `imageSrc` del proyecto correspondiente en el array `PROJECTS`.
- Para añadir logos de nuevos clientes: guardar en `/public/logos/` y añadir la entrada en el array `CLIENTS` con el campo `logo`.
- Si añades imágenes nuevas, ejecutar `node scripts/optimize-images.mjs` antes de hacer deploy para generar sus `.webp`.
