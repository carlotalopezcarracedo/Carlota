import React, { useRef, useState, useEffect, createContext, useContext } from 'react';
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Mail, Linkedin, Instagram } from 'lucide-react';

// --- Context for Cursor ---
const CursorContext = createContext({
  setCursorVariant: (variant: string) => {},
  cursorVariant: "default",
  cursorText: "",
  setCursorText: (text: string) => {}
});

// --- Types ---

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string[];
}

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

// --- Data ---

const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Creadora de Contenido",
    company: "Orestes Comunica",
    period: "Agosto 2024 - Actualidad",
    description: [
      "Elaboración de diseños y redacción de copys",
      "Grabación y edición de vídeos",
      "Creación de páginas web y tours virtuales"
    ]
  },
  {
    role: "Diseñadora Gráfica",
    company: "AREA 10 Marketing",
    period: "Marzo 2024 - Abril 2024",
    description: [
      "Creación de diseños y redacción de copys",
      "Grabación y edición de Reels/TikToks"
    ]
  },
  {
    role: "Diseñadora Gráfica",
    company: "Freelancer",
    period: "Enero 2023 - Febrero 2024",
    description: [
      "Creación de diseños y logotipos personalizados",
      "Desarrollo de identidades visuales"
    ]
  },
  {
    role: "Creadora de Contenido",
    company: "Farmacia Carmen Goicoa",
    period: "Sept - Dic 2021",
    description: [
      "Diseño de plantillas y posts para redes sociales",
      "Gestión de contenido digital"
    ]
  }
];

const PROJECTS: ProjectItem[] = [
  {
    id: "01",
    title: "Kairas",
    type: "Diseno Web & Branding",
    category: ["web", "branding"],
    description: "Diseno web e identidad visual para Kairas, una agencia de automatizaciones con inteligencia artificial. Una propuesta que combina tecnologia y elegancia para transmitir confianza e innovacion.",
    concept: [
      "Identidad digital moderna",
      "UI/UX orientada a conversion",
      "Branding tecnologico",
      "Experiencia de usuario premium"
    ],
    visuals: ["Web responsive", "Sistema de diseno", "Logotipo"],
    color: "text-blue-400",
    imageSrc: "/kairas.webp",
    link: "http://kairas.es/",
  },
  {
    id: "02",
    title: "Kairas (RRSS)",
    type: "Social Media & Contenido Digital",
    category: ["social"],
    description: "Gestion de redes sociales y estrategia de contenido para Kairas. Comunicacion tecnologica cercana que convierte y genera comunidad en torno a la inteligencia artificial.",
    concept: [
      "Comunicacion tecnologica accesible",
      "Contenido educativo",
      "Identidad digital consistente",
      "Engagement con comunidad tech"
    ],
    visuals: ["Posts", "Stories", "Contenido multimedia"],
    color: "text-blue-300",
    imageSrc: "/projects/kairas-rrss.webp",
    link: "https://www.instagram.com/kairas.ai/",
  },
  {
    id: "03",
    title: "Copiabarata",
    type: "Diseno Web",
    category: ["web"],
    description: "Diseno y desarrollo web para Copiabarata, servicio de reprografia y copisteria online. Interfaz clara y funcional orientada a facilitar el proceso de pedido.",
    concept: [
      "Experiencia de compra clara",
      "Diseno funcional y directo",
      "Navegacion intuitiva",
      "Enfoque en conversion"
    ],
    visuals: ["E-commerce", "Diseno de producto", "Web responsive"],
    color: "text-cyan-400",
    imageSrc: "/copiabarata.webp",
    link: "https://www.copiabarata.com/",
  },
  {
    id: "04",
    title: "Kulmen Visuals",
    type: "Branding & Identidad Visual",
    category: ["branding"],
    description: "Identidad corporativa para una productora audiovisual independiente. Una marca premium que refleja la excelencia tecnica y la vision artistica que le definen.",
    concept: [
      "Elegancia visual",
      "Minimalismo sofisticado",
      "Marca premium",
      "Excelencia tecnica"
    ],
    visuals: ["Logotipo", "Sistema de diseno", "Web"],
    color: "text-neutral-300",
    imageSrc: "/projects/kulmen-visuals.webp",
    link: "https://kulmenvisuals.com/",
  },
  {
    id: "05",
    title: "XGAP Fitness Center",
    type: "Social Media & Contenido Digital",
    category: ["social"],
    description: "Estrategia de contenido y gestion de redes sociales para centro de fitness. Contenido motivacional que refleja la energia y los valores de la comunidad deportiva.",
    concept: [
      "Contenido motivacional",
      "Identidad fitness moderna",
      "Comunidad activa",
      "Estetica dinamica y potente"
    ],
    visuals: ["Feed de Instagram", "Stories", "Reels"],
    color: "text-red-400",
    imageSrc: "/xgap.webp",
    link: "https://www.instagram.com/xgapfitnesscenter/",
  },
  {
    id: "06",
    title: "Karra Coaching",
    type: "Branding & Identidad Visual",
    category: ["branding"],
    description: "Desarrollo de identidad corporativa para Karra Coaching, servicio de coaching personal y profesional. Una marca que transmite confianza, crecimiento y transformacion personal.",
    concept: [
      "Identidad inspiradora",
      "Colores motivacionales",
      "Tipografia moderna y legible",
      "Enfoque en desarrollo personal"
    ],
    visuals: ["Logotipo", "Tarjetas de visita", "Materiales de marketing"],
    color: "text-purple-400",
    imageSrc: "/projects/karra-coaching.webp",
  },
  {
    id: "07",
    title: "Ana Sanjuan",
    type: "Diseno Web & UI/UX",
    category: ["web"],
    description: "Diseno y desarrollo de la presencia digital para una consultora de RRHH y mentoring. La web refleja profesionalidad y cercania a traves de una estetica minimalista, colores neutros y una estructura de navegacion intuitiva.",
    concept: [
      "Identidad serena y profesional",
      "Experiencia de usuario fluida",
      "Diseno responsive adaptativo",
      "Enfoque en servicios de mentoring"
    ],
    visuals: ["Mockups de alta fidelidad", "Sistema de diseno minimalista", "Tipografia editorial"],
    color: "text-rose-300",
    imageSrc: "/ana-san-juan.webp",
    link: "https://ana-sanjuan.com/"
  },
  {
    id: "08",
    title: "Prime",
    type: "Branding e Identidad Visual",
    category: ["branding"],
    description: "Desarrollo de identidad corporativa para empresa del sector energetico. Una imagen que transmite eficiencia, innovacion y confianza a traves de una estetica limpia y contemporanea.",
    concept: [
      "Energia y eficiencia",
      "Identidad profesional",
      "Sistema visual completo",
      "Confianza y modernidad"
    ],
    visuals: ["Logotipo", "Manual de marca", "Aplicaciones"],
    color: "text-orange-400",
    imageSrc: "/projects/prime.webp",
  },
  {
    id: "09",
    title: "Gotas de Santiago",
    type: "Diseno de Producto & Packaging",
    category: ["producto"],
    description: "Diseno de etiqueta para botella de licor Gotas de Santiago. Una propuesta visual que fusiona frescura y calidad en el packaging, evocando la esencia de la pina colada.",
    concept: [
      "Identidad artesanal y tradicional",
      "Tipografia clasica y elegante",
      "Ilustracion de producto",
      "Herencia cultural gallega"
    ],
    visuals: ["Etiqueta de botella", "Diseno editorial", "Mockup de producto"],
    color: "text-amber-300",
    imageSrc: "/projects/gotas-de-santiago.webp",
  },
  {
    id: "10",
    title: "Elephant and Castle",
    type: "Branding e Identidad Visual",
    category: ["branding"],
    description: "Proyecto de identidad visual y branding para una academia de ingles. Una propuesta que construye una marca memorable a traves de la simbologia y la tipografia.",
    concept: [
      "Identidad con narrativa",
      "Concepto visual distintivo",
      "Sistema de marca cohesivo",
      "Tipografia expresiva"
    ],
    visuals: ["Logotipo", "Paleta cromatica", "Aplicaciones de marca"],
    color: "text-amber-400",
    imageSrc: "/projects/elephant-and-castle.webp",
  },
  {
    id: "11",
    title: "Quimeras del Norte",
    type: "Branding & Web",
    category: ["web", "branding"],
    description: "Proyecto de identidad corporativa y web para una plataforma de narrativas gallegas. La propuesta se centra en traspasar las historias y escritos de diversos personajes gallegos al entorno digital.",
    concept: [
      "Mision: Difundir narraciones gallegas",
      "Color verde: Naturaleza y entorno",
      "Roble (Carballo): Elemento central",
      "Quimera: Mitologia e historias imposibles"
    ],
    visuals: ["Logotipo serif elegante", "Simbolo de arbol estilizado", "Sistema visual completo"],
    color: "text-emerald-400",
    imageSrc: "/quimeras-del-norte.webp",
  },
  {
    id: "12",
    title: "Aceites Retamar",
    type: "Social Media & Direccion de Arte",
    category: ["social"],
    description: "Estrategia de contenido y diseno grafico para redes sociales. El proyecto 'Aceite con Alma' busca conectar con el consumidor a traves de una narrativa visual que mezcla la tradicion del aceite de oliva con un estilo de vida moderno.",
    concept: [
      "Narrativa visual 'Con Alma'",
      "Formas organicas y fluidas",
      "Paleta de colores tierra y oro",
      "Fotografia de producto en contexto"
    ],
    visuals: ["Feed de Instagram cohesivo", "Historias interactivas", "Fotografia gastronomica"],
    color: "text-yellow-400",
    imageSrc: "/aceites-retamar.webp",
  },
  {
    id: "13",
    title: "Nobreh",
    type: "Identidad Corporativa | Inversiones",
    category: ["branding"],
    description: "Desarrollo de imagen visual corporativa para una empresa familiar de gestion de inversiones. Se requeria una identidad que transmitiera elegancia y simplicidad.",
    concept: [
      "Color amarillo: Riqueza",
      "Trebol: Fortuna",
      "5 hojas: Miembros de la familia",
      "Estilo: Minimalista y sofisticado"
    ],
    visuals: ["Logotipo limpio", "Trebol estilizado", "Paleta dorada"],
    color: "text-yellow-400",
    imageSrc: "/nobreh.webp",
  },
  {
    id: "14",
    title: "Orestes Comunica",
    type: "Publicidad Exterior & Creatividad",
    category: ["producto"],
    description: "Diseno de campana de publicidad exterior y creatividades para agencia de marketing. Una propuesta visual disruptiva basada en el contraste tipografico y mensajes directos que interpelan al espectador en el entorno urbano.",
    concept: [
      "Copywriting de impacto",
      "Contraste cromatico fuerte",
      "Diseno para gran formato",
      "Comunicacion disruptiva"
    ],
    visuals: ["Mupis y vallas publicitarias", "Carteleria urbana", "Aplicaciones de marca"],
    color: "text-orange-500",
    imageSrc: "/projects/orestes-comunica.webp",
  },
  {
    id: "15",
    title: "Vitamina 3",
    type: "Branding | Proyecto Universitario",
    category: ["branding"],
    description: "Proyecto que refleja los valores de un equipo creativo. El nombre nace de la metafora de aportar energia y vitalidad a las marcas.",
    concept: [
      "33,3% atipicamente diferente",
      "Dosis diaria de energia creativa",
      "Cercania personalizada"
    ],
    visuals: ["Simbolo solar/energia", "Verde lima/Amarillo", "Tipografia bold"],
    color: "text-lime-400",
    imageSrc: "/vitamina-3.webp",
  },
];

const ALL_SKILLS = [
  "Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "Canva", "Figma",
  "DaVinci Resolve", "CapCut", "Procreate", "Elementor", "WordPress",
  "Identidad Corporativa", "Branding", "Diseño Editorial", "Contenido Digital",
  "Producción Audiovisual"
];

interface ClientItem {
  name: string;
  logo?: string;
  logoClassName?: string;
}

const CLIENTS: ClientItem[] = [
  { name: "Kairas", logo: "/logos/kairas.png" },
  { name: "Óptima", logo: "/logos/optima.png" },
  { name: "Quimeras del Norte", logo: "/logos/quimerasdelnorte.png", logoClassName: "h-12 md:h-16" },
  { name: "XGAP Fitness Center", logo: "/logos/xgap.png" },
  { name: "Nobreh", logo: "/logos/nobreh.png", logoClassName: "h-12 md:h-16" },
  { name: "AE League", logo: "/logos/aeleague.png" },
  { name: "Elephant and Castle", logo: "/logos/elephantandcastle.png" },
  { name: "Kulmen Visuals", logo: "/logos/kulmen.png" },
  { name: "Prime Energía", logo: "/logos/prime.png" },
  { name: "Copiabarata", logo: "/logos/copiabarata.webp", logoClassName: "h-12 md:h-16" },
  { name: "Karra Coaching", logo: "/logos/karracoaching.webp", logoClassName: "h-14 md:h-20" },
  { name: "Gotas de Santiago", logo: "/logos/gotasdesantiago.webp", logoClassName: "h-12 md:h-16" },
  { name: "Orestes Comunica", logo: "/logos/ORESTES.webp", logoClassName: "h-7 md:h-9" },
  { name: "Ana San Juan" },
];

// --- Animation Components ---

const Preloader = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
      className="fixed inset-0 z-[10000] bg-neutral-100 flex items-center justify-center pointer-events-none"
    >
      <div className="overflow-hidden flex flex-col items-center gap-1 text-black font-display font-bold text-3xl md:text-6xl tracking-tighter md:flex-row md:gap-2">
        {["CARLOTA", "LÓPEZ", "©2026"].map((text, i) => (
          <motion.span
            key={i}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.2 + i * 0.1 }}
            className="block"
          >
            {text}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const { setCursorVariant, cursorText } = useContext(CursorContext);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const [variant, setLocalVariant] = useState("default");
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(media.matches);
    update();
    media.addEventListener("change", update);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [mouseX, mouseY]);

  if (isCoarsePointer) return null;

  return (
    <CursorContext.Consumer>
      {({ cursorText, setCursorVariant: _ }) => ( // We don't set here, we read
         <>
          <motion.div
            className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-exclusion bg-white flex items-center justify-center"
            style={{ 
              x: mouseX, 
              y: mouseY, 
              translateX: "-50%", 
              translateY: "-50%" 
            }}
            animate={cursorText ? "text" : "default"}
            variants={{
              default: { scale: 1 },
              text: { scale: 5, backgroundColor: "#ffffff" }
            }}
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
          />
          <motion.div 
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-exclusion text-black text-[3px] font-bold uppercase tracking-widest text-center flex items-center justify-center w-20 h-20"
            style={{ 
              x: mouseX, 
              y: mouseY, 
              translateX: "-50%", 
              translateY: "-50%" 
            }}
          >
             {cursorText && (
               <motion.span
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0 }}
               >
                 {cursorText}
               </motion.span>
             )}
          </motion.div>
        </>
      )}
    </CursorContext.Consumer>
  );
};

// Wrapper to trigger cursor changes
interface InteractiveProps {
  children: React.ReactNode;
  text?: string;
  className?: string;
}

const Interactive: React.FC<InteractiveProps> = ({ 
  children, 
  text = "", 
  className = "" 
}) => {
  const { setCursorText } = useContext(CursorContext);
  
  return (
    <div 
      className={className}
      onMouseEnter={() => setCursorText(text || "OPEN")} 
      onMouseLeave={() => setCursorText("")}
    >
      {children}
    </div>
  );
};

const Magnetic: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (ref.current) {
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      position.x.set(middleX * 0.3); // Adjust strength
      position.y.set(middleY * 0.3);
    }
  };

  const reset = () => {
    position.x.set(0);
    position.y.set(0);
  };

  const { x, y } = position;
  return (
    <motion.div
      style={{ x, y }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

interface MaskTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

const MaskTextReveal: React.FC<MaskTextRevealProps> = ({ text, className = "", delay = 0 }) => {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.03,
          },
        },
      }}
      className={`overflow-hidden flex flex-wrap gap-x-[0.25em] ${className}`}
    >
      {words.map((word, i) => (
        <span className="overflow-hidden inline-block" key={i}>
          <motion.span
            className="inline-block text-inherit"
            variants={{
              hidden: { y: "110%" },
              visible: {
                y: 0,
                transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
};

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
}

const FadeUp: React.FC<FadeUpProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const ParallaxImage = ({ src, alt, className, loading = "lazy" }: { src: string, alt: string, className?: string, loading?: "lazy" | "eager" }) => {
  const ref = useRef(null);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (isCoarsePointer) {
    return (
      <div ref={ref} className={`overflow-hidden relative ${className}`}>
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={loading === "eager" ? "high" : "auto"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.img
        style={{ y, scale, willChange: 'transform' }}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={loading === "eager" ? "high" : "auto"}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const PlaceholderImage = ({ title, color }: { title: string; color: string }) => (
  <div className="w-full h-full flex items-center justify-center bg-neutral-900">
    <span className={`font-display text-2xl md:text-3xl font-bold uppercase tracking-tighter ${color} opacity-30 text-center px-8`}>
      {title}
    </span>
  </div>
);

const SectionLabel = ({ text, sticky = true }: { text: string; sticky?: boolean }) => (
  <div className="col-span-12 md:col-span-2 mb-8 md:mb-0">
    <div className={`${sticky ? "md:sticky md:top-32" : ""} flex items-center gap-3`}>
      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
      <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400">
        {text}
      </span>
    </div>
  </div>
);

// --- Structural Components ---

const Navbar = ({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const menuItems = [
    { label: "Perfil", href: "#perfil" },
    { label: "Experiencia", href: "#experiencia" },
    { label: "Proyectos", href: "#proyectos" },
    { label: "Formación", href: "#formacion" },
    { label: "Metodología", href: "#metodologia" }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 2 }} // Delay for preloader
      className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center bg-neutral-950/70 backdrop-blur-md md:bg-transparent md:backdrop-blur-0 md:mix-blend-exclusion text-white pointer-events-none"
    >
      <div className="pointer-events-auto">
         <Interactive text="HOME">
            <span className="text-sm font-bold tracking-[0.2em] uppercase">Carlota López</span>
         </Interactive>
      </div>
      <div className="flex items-center gap-8 pointer-events-auto relative">
        <a href="mailto:carlotalopecarracedo@gmail.com" className="hidden md:block">
           <Interactive text="MAIL">
              <span className="text-xs font-bold uppercase tracking-widest hover:text-neutral-300 transition-colors">
                Disponible para proyectos
              </span>
           </Interactive>
        </a>
        <Magnetic>
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="w-10 h-10 flex flex-col justify-center gap-1.5 group cursor-pointer"
          >
            <Interactive text="MENU">
              <div className="flex flex-col gap-1.5 items-end">
                <span className="w-full h-[2px] bg-white group-hover:w-1/2 transition-all duration-300"></span>
                <span className="w-2/3 h-[2px] bg-white group-hover:w-full transition-all duration-300"></span>
              </div>
            </Interactive>
          </button>
        </Magnetic>
        {menuOpen && (
          <div className="fixed inset-0 z-[9999]">
            <div
              className="absolute inset-0 bg-neutral-950/85 backdrop-blur-3xl backdrop-saturate-200"
              onClick={() => setMenuOpen(false)}
            ></div>
            <div className="relative h-full w-full flex flex-col">
              <div className="px-6 md:px-12 pt-8 flex items-center justify-between text-white">
                <span className="text-sm font-bold tracking-[0.2em] uppercase">Carlota López</span>
                <button
                  type="button"
                  className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest"
                  onClick={() => setMenuOpen(false)}
                >
                  Close
                  <span className="relative w-5 h-5">
                    <span className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2 rotate-45"></span>
                    <span className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2 -rotate-45"></span>
                  </span>
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <ul className="text-center">
                  {menuItems.map((item, i) => (
                    <li key={item.href} className="flex items-center justify-center gap-6">
                      <span className="text-xs md:text-sm text-neutral-400 w-10 text-right">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      <a
                        href={item.href}
                        className="font-display text-5xl md:text-7xl lg:text-8xl text-white hover:opacity-80 transition-opacity leading-[1.05]"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] md:h-screen w-full flex flex-col justify-center items-center px-4 overflow-clip md:overflow-hidden"
    >
      <motion.div style={{ opacity, scale }} className="relative z-10 w-full max-w-[94vw] px-[2vw]">
        
        <div className="flex flex-col items-center">
            {/* Massive Typography */}
            <h1 className="font-display font-black text-[15vw] leading-[0.85] tracking-tighter text-white mix-blend-normal text-center cursor-default">
              <span className="block overflow-hidden px-[0.04em] py-[0.02em]">
                 <motion.span 
                   initial={{ y: "100%" }} 
                   animate={{ y: 0 }} 
                   transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 2.2 }}
                   className="block"
                 >
                   CARLOTA
                 </motion.span>
              </span>
              <span className="block overflow-hidden ml-[10vw] -mt-[2.2vw] px-[0.04em] py-[0.02em] relative z-10">
                 <motion.span 
                   initial={{ y: "100%" }} 
                   animate={{ y: 0 }} 
                   transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 2.35 }}
                   className="block"
                 >
                   LÓPEZ
                 </motion.span>
              </span>
            </h1>
        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 3, duration: 1 }}
           className="mt-16 flex flex-col md:flex-row justify-between items-end w-full px-2"
        >
          <div className="hidden md:block text-xs font-mono text-neutral-500 max-w-xs">
            PORTFOLIO 2026 ©<br/>
            DISEÑO GRÁFICO & CONTENIDO
          </div>
          
          <div className="flex gap-8 items-center text-xs font-bold tracking-widest uppercase text-neutral-400">
            <span>Branding</span>
            <span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
            <span>Digital</span>
            <span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
            <span>Motion</span>
          </div>
        </motion.div>

      </motion.div>
      
      {/* Background visual element */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none z-0" />

      {/* Neon glows removed (user requested) */}
    </section>
  );
};

const Profile = () => {
  return (
    <section id="perfil" className="py-24 px-6 md:px-12 relative z-10 bg-neutral-950">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
        <SectionLabel text="Perfil" sticky={false} />
        <div className="col-span-12 md:col-span-10">
          <FadeUp>
            <h2 className="font-display text-3xl md:text-5xl lg:text-7xl font-medium leading-[1.12] md:leading-[1.08] lg:leading-[1.06] text-white bg-transparent mb-10 md:mb-12">
              Creadora de contenido y diseñadora gráfica especializada en branding, diseño digital y producción audiovisual.
            </h2>
          </FadeUp>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 border-t border-neutral-800 pt-10 md:pt-12">
            <FadeUp delay={0.2}>
              <p className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed">
                <span className="text-white font-medium">Filosofía estratégica.</span> Cada elemento visual tiene un propósito. Cuento con amplia experiencia en el desarrollo de identidades corporativas, diseño de materiales gráficos y gestión de contenido multiplataforma.
              </p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed">
                Me especializo en crear identidades que cuentan historias, utilizando simbolismo cultural, color con propósito y una simplicidad elegante.
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  return (
    <section id="experiencia" className="py-24 px-6 md:px-12 relative z-10 bg-neutral-950">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
        <SectionLabel text="Experiencia" />
        <div className="col-span-12 md:col-span-10">
          {EXPERIENCE.map((job, index) => (
            <FadeUp key={index} delay={index * 0.1}>
              <Interactive text="EXP">
                <div className="group relative py-12 border-t border-neutral-800 transition-all hover:bg-neutral-900/40 -mx-4 px-4 sm:px-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-4 mb-4">
                    <h3 className="text-2xl md:text-4xl font-display font-medium text-white group-hover:translate-x-4 transition-transform duration-500 ease-out">
                      {job.role}
                    </h3>
                    <span className="font-mono text-sm text-neutral-500">{job.period}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 text-neutral-400 font-medium uppercase tracking-wider text-sm">
                      {job.company}
                    </div>
                    <div className="md:col-span-8">
                      <ul className="space-y-2">
                        {job.description.map((desc, i) => (
                          <li key={i} className="text-neutral-500 text-lg flex items-start gap-3">
                            <span className="mt-2.5 w-1 h-1 bg-neutral-700 rounded-full shrink-0"></span>
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Interactive>
            </FadeUp>
          ))}
          <div className="border-t border-neutral-800"></div>
        </div>
      </div>
    </section>
  );
};

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
        <SectionLabel text="Proyectos" sticky={false} />

        <div className="col-span-12 md:col-span-10">
          <div className="mb-4 md:mb-6">
            <MaskTextReveal
              className="font-display text-[9vw] md:text-[8vw] leading-[0.85] font-bold text-white tracking-tighter uppercase"
              text="PROYECTOS SELECCIONADOS"
            />
          </div>

          {/* Filter tabs */}
          <div className="mb-20 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
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

const InfiniteMarquee = () => {
  return (
    <section className="py-12 bg-neutral-950 border-t border-neutral-900 overflow-hidden">
       <div className="relative flex w-full overflow-hidden">
         <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-8" style={{ pointerEvents: 'none' }}>
            {[...ALL_SKILLS, ...ALL_SKILLS].map((skill, i) => (
              <span key={i} className="text-4xl md:text-6xl font-display font-bold text-transparent stroke-text hover:text-white transition-colors duration-300 select-none cursor-default" style={{ WebkitTextStroke: '1px #333' }}>
                {skill}
              </span>
            ))}
         </div>
         <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 py-8" style={{ left: '100%', pointerEvents: 'none' }}>
            {[...ALL_SKILLS, ...ALL_SKILLS].map((skill, i) => (
              <span key={i} className="text-4xl md:text-6xl font-display font-bold text-transparent stroke-text hover:text-white transition-colors duration-300 select-none cursor-default" style={{ WebkitTextStroke: '1px #333' }}>
                {skill}
              </span>
            ))}
         </div>
       </div>
    </section>
  );
};

const Formation = () => {
  return (
    <section id="formacion" className="py-16 md:py-24 border-t border-neutral-900 px-6 md:px-12 bg-neutral-950">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 min-w-0">
         <SectionLabel text="Formación" />
         <div className="col-span-12 md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 min-w-0 w-full">
            <FadeUp>
              <div className="space-y-3 min-w-0">
                <h3 className="text-2xl sm:text-2xl md:text-3xl text-white font-display leading-tight break-words max-w-[22ch]">
                  Grado en Publicidad y RR.PP.
                </h3>
                <p className="text-neutral-500 text-xs sm:text-xs md:text-sm font-mono uppercase tracking-[0.1em] md:tracking-widest">
                  Universidad de Vigo · 2020-2024
                </p>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.2}>
               <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full">
                 {[
                   { lang: "Español", lvl: "Nativo" },
                   { lang: "Gallego", lvl: "Nativo" },
                   { lang: "Inglés", lvl: "Profesional" }
                 ].map((item, i) => (
                   <Interactive key={i} text={item.lvl}>
                    <div className="border border-neutral-800 p-2.5 sm:p-3 md:p-4 text-center hover:bg-white hover:text-black transition-colors duration-300 w-full min-w-0 max-w-full">
                      <div className="font-bold text-xs sm:text-sm md:text-lg mb-1 break-words">{item.lang}</div>
                      <div className="text-[9px] sm:text-[10px] uppercase tracking-tight md:tracking-widest opacity-60">{item.lvl}</div>
                    </div>
                   </Interactive>
                 ))}
               </div>
            </FadeUp>
         </div>
      </div>
    </section>
  );
};

const Methodology = () => {
  return (
    <section id="metodologia" className="py-32 px-6 md:px-12 bg-neutral-900/20 border-t border-neutral-900">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-16">
          <SectionLabel text="Metodología" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-neutral-800 border border-neutral-800">
          {[
            { title: "Investigación", desc: "Análisis profundo del cliente, competencia y sector. Definición clara de la misión.", icon: "01" },
            { title: "Estrategia", desc: "Desarrollo conceptual, justificación y creación de simbolismos únicos.", icon: "02" },
            { title: "Producción", desc: "Diseño meticuloso de aplicaciones y desarrollo de entregables finales.", icon: "03" }
          ].map((item, i) => (
            <Interactive key={i} text={item.title}>
              <div className="bg-neutral-950 p-12 md:p-16 group hover:bg-neutral-900 transition-colors duration-500 relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-9xl font-display font-black text-white">{item.icon}</span>
                </div>
                
                <div className="relative z-10 h-full flex flex-col justify-between min-h-[200px]">
                  <h4 className="text-3xl font-display text-white mb-6">{item.title}</h4>
                  <p className="text-neutral-400 leading-relaxed">{item.desc}</p>
                  <div className="mt-8 w-12 h-[1px] bg-neutral-700 group-hover:w-full group-hover:bg-white transition-all duration-700"></div>
                </div>
              </div>
            </Interactive>
          ))}
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
        decoding="async"
        className={`${client.logoClassName ?? "h-8 md:h-10"} w-auto object-contain opacity-40 hover:opacity-100 transition-opacity duration-300 flex-shrink-0`}
        style={{ mixBlendMode: 'screen' }}
      />
    );
  }
  return (
    <span className="text-sm md:text-base font-bold uppercase tracking-widest text-neutral-600 hover:text-neutral-300 transition-colors duration-300 cursor-default select-none flex-shrink-0">
      {client.name}
    </span>
  );
};

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

const Footer = () => {
  return (
    <footer
      className="w-full bg-neutral-950 border-t border-neutral-900 pt-24 pb-12 px-6 md:px-12 relative overflow-hidden"
    >
      <div className="max-w-screen-2xl mx-auto relative z-10">
        <div className="flex flex-col items-start mb-32">
          <MaskTextReveal 
            className="font-display font-black text-[11vw] leading-[0.85] text-white tracking-tighter uppercase mb-8"
            text="¿Trabajamos"
          />
          <MaskTextReveal 
            className="font-display font-black text-[11vw] leading-[0.85] text-white tracking-tighter uppercase" 
            delay={0.2}
            text="Juntos?"
          />
          
          <Interactive text="EMAIL ME">
            <motion.a 
              href="mailto:carlotalopecarracedo@gmail.com" 
              className="mt-16 text-2xl md:text-3xl text-neutral-400 hover:text-white transition-colors flex items-center gap-4 group"
              whileHover={{ x: 20 }}
            >
              <span className="border-b border-transparent group-hover:border-white pb-1">carlotalopecarracedo@gmail.com</span>
              <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </Interactive>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-end border-t border-neutral-900 pt-12">
          <div className="flex gap-8 mb-8 md:mb-0">
             <Interactive text="LINKEDIN">
              <a href="#" className="p-4 border border-neutral-800 rounded-full hover:bg-white hover:text-black transition-all duration-300 flex"><Linkedin size={20} /></a>
             </Interactive>
             <Interactive text="INSTA">
              <a href="#" className="p-4 border border-neutral-800 rounded-full hover:bg-white hover:text-black transition-all duration-300 flex"><Instagram size={20} /></a>
             </Interactive>
             <Interactive text="MAIL">
              <a href="#" className="p-4 border border-neutral-800 rounded-full hover:bg-white hover:text-black transition-all duration-300 flex"><Mail size={20} /></a>
             </Interactive>
          </div>
          <div className="text-right text-xs font-mono text-neutral-600 uppercase tracking-widest">
            <p className="mb-2">© 2026 Carlota López Carracedo</p>
            <p>Galicia, España</p>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-white opacity-[0.03] blur-[100px] rounded-full pointer-events-none hidden md:block"></div>

      {/* Footer neon accent removed per user request */}
    </footer>
  );
};

function App() {
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState("default");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = {
      overflowX: html.style.overflowX,
      overflowY: html.style.overflowY,
      touchAction: html.style.touchAction,
      overscrollBehaviorY: html.style.overscrollBehaviorY,
    };
    const prevBody = {
      overflowX: body.style.overflowX,
      overflowY: body.style.overflowY,
      touchAction: body.style.touchAction,
      overscrollBehaviorY: body.style.overscrollBehaviorY,
    };

    html.style.overflowX = 'hidden';
    html.style.overflowY = 'auto';
    html.style.touchAction = 'auto';
    html.style.overscrollBehaviorY = 'auto';
    body.style.overflowX = 'hidden';
    body.style.overflowY = 'auto';
    body.style.touchAction = 'auto';
    body.style.overscrollBehaviorY = 'auto';

    return () => {
      html.style.overflowX = prevHtml.overflowX;
      html.style.overflowY = prevHtml.overflowY;
      html.style.touchAction = prevHtml.touchAction;
      html.style.overscrollBehaviorY = prevHtml.overscrollBehaviorY;
      body.style.overflowX = prevBody.overflowX;
      body.style.overflowY = prevBody.overflowY;
      body.style.touchAction = prevBody.touchAction;
      body.style.overscrollBehaviorY = prevBody.overscrollBehaviorY;
    };
  }, []);

  return (
    <CursorContext.Provider value={{ cursorText, setCursorText, setCursorVariant, cursorVariant }}>
      <div className="bg-neutral-950 min-h-screen text-neutral-200 selection:bg-white selection:text-black overflow-x-hidden md:cursor-none relative">
        <Preloader />
        <CustomCursor />
        {/* Soft neon edge glows */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
          <span className="absolute top-[8vh] -left-[8vw] w-[34vw] h-[34vw] rounded-full bg-fuchsia-500/10 blur-[80px]"></span>
          <span className="absolute top-[28vh] -right-[10vw] w-[30vw] h-[30vw] rounded-full bg-fuchsia-500/10 blur-[85px]"></span>
          <span className="absolute top-[85vh] -left-[12vw] w-[28vw] h-[28vw] rounded-full bg-fuchsia-500/10 blur-[90px]"></span>
          <span className="absolute top-[140vh] -right-[14vw] w-[32vw] h-[32vw] rounded-full bg-fuchsia-500/10 blur-[95px]"></span>
          <span className="absolute top-[200vh] -left-[10vw] w-[30vw] h-[30vw] rounded-full bg-fuchsia-500/10 blur-[90px]"></span>
          <span className="absolute top-[260vh] -right-[12vw] w-[34vw] h-[34vw] rounded-full bg-fuchsia-500/10 blur-[100px]"></span>
          <span className="absolute top-[320vh] -left-[14vw] w-[32vw] h-[32vw] rounded-full bg-fuchsia-500/10 blur-[95px]"></span>
          <span className="absolute -bottom-[10vh] -right-[14vw] w-[32vw] h-[32vw] rounded-full bg-fuchsia-500/10 blur-[95px]"></span>
        </div>
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
          <div className={menuOpen ? "blur-[16px] brightness-50 saturate-50 transition-all duration-300" : "transition-all duration-300"}>
          <Hero />
          <main>
            <Profile />
            <Experience />
            <InfiniteMarquee />
            <Projects />
            <Clients />
            <Formation />
            <Methodology />
          </main>
          <Footer />
        </div>
      </div>
    </CursorContext.Provider>
  );
}

export default App;












