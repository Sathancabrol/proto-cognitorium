import React, { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { QuickCreateType } from "./QuickAddNodeModal";

const hoverSpring = { type: "spring" as const, stiffness: 500, damping: 35 };

const corner = {
  position: "absolute" as const,
  width: "10px",
  height: "10px",
  border: "1.5px solid var(--accent, #3b82f6)",
  pointerEvents: "none" as const,
  zIndex: 2,
};

const triggerStyle = {
  position: "relative" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.55rem",
  backgroundColor: "var(--layer, #ffffff)",
  backgroundImage: `repeating-linear-gradient(
    var(--dossier-stripe-angle, 119deg),
    color-mix(in srgb, var(--foreground, #0f172a) 6%, transparent) 0,
    color-mix(in srgb, var(--foreground, #0f172a) 6%, transparent) 1px,
    transparent 1px,
    transparent 5px
  )`,
  color: "var(--foreground, #0f172a)",
  padding: "0.55rem 1rem",
  cursor: "pointer",
  willChange: "transform",
  border: "1px solid var(--border, #e2e8f0)",
  borderRadius: "0.75rem",
  outline: "none",
  fontFamily: "inherit",
  fontSize: "inherit",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const panelStyle = {
  position: "relative" as const,
  backgroundColor: "var(--layer, #ffffff)",
  border: "1px dotted var(--border, #cbd5e1)",
  borderRadius: "1rem",
  width: "min(22rem, 90vw)",
  color: "var(--foreground, #0f172a)",
  overflow: "hidden",
  willChange: "transform",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.05)",
  zIndex: 50,
};

const headerStyle = {
  position: "relative" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.75rem 1rem",
  borderBottom: "1px dotted var(--border, #cbd5e1)",
  boxSizing: "border-box" as const,
  backgroundColor: "color-mix(in srgb, var(--foreground, #0f172a) 3%, var(--layer, #ffffff))",
};

const iconBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const gridStyle = {
  position: "relative" as const,
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  overflow: "hidden",
  willChange: "transform",
  backgroundColor: "var(--layer, #ffffff)",
};

const cellStyle = {
  position: "relative" as const,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  gap: "0.45rem",
  padding: "0.9rem 0.4rem",
  backgroundColor: "var(--layer, #ffffff)",
  color: "var(--foreground-feint, #64748b)",
  userSelect: "none" as const,
};

const hoverFill = {
  position: "absolute" as const,
  inset: 0,
  backgroundColor: "var(--accent-light, rgba(59, 130, 246, 0.1))",
  pointerEvents: "none" as const,
};

const cellIcon = {
  position: "relative" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--accent, #3b82f6)",
};

const cellLabel = {
  position: "relative" as const,
  fontFamily: "var(--font-mono, monospace)",
  fontSize: "10px",
  color: "var(--foreground, #0f172a)",
  lineHeight: 1.1,
  letterSpacing: "var(--kicker-tracking-tight, 0.08em)",
  textTransform: "uppercase" as const,
  fontWeight: 600,
  textAlign: "center" as const,
};

function CloseIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.546 1.354L1.354 10.546" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M10.546 10.546L1.354 1.354" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

// Tactical Custom Icons
function ExperienceIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function HardSkillIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.7 6.3 3.6 3.6a1 1 0 0 1 0 1.4L8.2 21.4a1 1 0 0 1-.7.3H3.5a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7L12.9 6a1 1 0 0 1 1.4 0l.4.3z" />
      <path d="M16 3a2.4 2.4 0 0 1 3.4 3.4l-1.4 1.4-3.4-3.4L16 3z" />
    </svg>
  );
}

function SoftSkillIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function FormationIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 6h10" />
      <path d="M6 10h10" />
      <path d="M6 14h6" />
    </svg>
  );
}

function CapacityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 0-5 5v1a5 5 0 0 0-2 4 5 5 0 0 0 3 4.5V19a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3v-2.5a5 5 0 0 0 3-4.5 5 5 0 0 0-2-4V7a5 5 0 0 0-5-5z" />
      <path d="M12 6v6" />
      <path d="M9 10h6" />
    </svg>
  );
}

function HorizonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export interface CreateMenuItem {
  type: QuickCreateType | 'ai_distiller';
  icon: React.ComponentType;
  label: string;
  badge?: string;
  action: () => void;
}

function Corners() {
  return (
    <>
      <span style={{ ...corner, top: -1, left: -1, borderRight: "none", borderBottom: "none" }} />
      <span style={{ ...corner, top: -1, right: -1, borderLeft: "none", borderBottom: "none" }} />
      <span style={{ ...corner, bottom: -1, left: -1, borderRight: "none", borderTop: "none" }} />
      <span style={{ ...corner, bottom: -1, right: -1, borderLeft: "none", borderTop: "none" }} />
    </>
  );
}

function MenuCell({
  item,
  index,
  staggerInterval,
  onSelect
}: {
  item: CreateMenuItem;
  index: number;
  staggerInterval: number;
  onSelect: (item: CreateMenuItem) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const col = index % 3;
  const row = Math.floor(index / 3);
  const dotted = "1px dotted var(--border, #cbd5e1)";
  const Icon = item.icon;

  return (
    <motion.div
      style={{
        ...cellStyle,
        borderRight: col < 2 ? dotted : "none",
        borderBottom: row < 1 ? dotted : "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * staggerInterval + 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(item)}
    >
      <motion.div style={hoverFill} initial={false} animate={{ opacity: hovered ? 1 : 0 }} transition={hoverSpring} />
      <span style={cellIcon}>
        <Icon />
      </span>
      <span style={cellLabel}>{item.label}</span>
    </motion.div>
  );
}

export interface MotionCreateButtonProps {
  onOpenQuickAdd: (type: QuickCreateType) => void;
  onOpenDistiller: () => void;
  menuSpring?: { stiffness: number; damping: number };
  clipPathDuration?: number;
  contentOffsetY?: number;
  contentScale?: number;
  staggerInterval?: number;
  buttonLabel?: string;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const MotionCreateButton: React.FC<MotionCreateButtonProps> = ({
  onOpenQuickAdd,
  onOpenDistiller,
  menuSpring = { stiffness: 260, damping: 24 },
  clipPathDuration = 0.25,
  contentOffsetY = 30,
  contentScale = 0.94,
  staggerInterval = 0.04,
  buttonLabel = "Ajouter / Créer",
  variant = 'auto',
  className = ""
}) => {
  const [open, setOpen] = useState(false);

  const items: CreateMenuItem[] = [
    { 
      type: 'experience', 
      icon: ExperienceIcon, 
      label: "Expérience", 
      action: () => onOpenQuickAdd('experience') 
    },
    { 
      type: 'skill_tech', 
      icon: HardSkillIcon, 
      label: "Hard Skill", 
      action: () => onOpenQuickAdd('skill_tech') 
    },
    { 
      type: 'skill_soft', 
      icon: SoftSkillIcon, 
      label: "Soft Skill", 
      action: () => onOpenQuickAdd('skill_soft') 
    },
    { 
      type: 'formation', 
      icon: FormationIcon, 
      label: "Formation", 
      action: () => onOpenQuickAdd('formation') 
    },
    { 
      type: 'capacity', 
      icon: CapacityIcon, 
      label: "Capacité", 
      action: () => onOpenQuickAdd('capacity') 
    },
    { 
      type: 'horizon', 
      icon: HorizonIcon, 
      label: "Horizon ROME", 
      action: () => onOpenQuickAdd('horizon') 
    },
  ];

  const handleSelectItem = (item: CreateMenuItem) => {
    setOpen(false);
    item.action();
  };

  return (
    <MotionConfig transition={{ type: "spring", ...menuSpring }}>
      <div className={`create-stage ${variant === 'dark' ? 'dossier-dark' : ''} ${className}`}>
        <motion.div className="create-root relative">
          {!open && (
            <motion.button
              layoutId="create-wrapper"
              onClick={() => setOpen(true)}
              style={{ ...triggerStyle, clipPath: "inset(0)" }}
              className="hover:border-blue-400 group transition-colors select-none"
              title="Ajouter un nœud, une compétence, une expérience ou un horizon"
            >
              <Corners />
              <motion.span
                layoutId="create-text"
                style={{
                  position: "relative",
                  willChange: "transform",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "11px",
                  letterSpacing: "var(--kicker-tracking-loose, 0.1em)",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
                className="text-slate-800 dark:text-zinc-100 group-hover:text-blue-600 transition-colors"
              >
                {buttonLabel}
              </motion.span>
              <motion.div
                layoutId="create-icon"
                style={{
                  ...iconBox,
                  position: "relative",
                  rotate: 45,
                  willChange: "transform",
                  color: "var(--accent, #3b82f6)",
                  fontSize: "0.625rem",
                }}
              >
                <CloseIcon />
              </motion.div>
            </motion.button>
          )}

          <AnimatePresence mode="popLayout">
            {open && (
              <motion.div
                key="create-wrapper"
                layoutId="create-wrapper"
                style={panelStyle}
                initial={{ clipPath: "inset(0)" }}
                animate={{ clipPath: "inset(0)" }}
                exit={{ clipPath: "inset(0)" }}
                transition={{ type: "spring", ...menuSpring, clipPath: { duration: clipPathDuration } }}
              >
                <Corners />
                {/* Header */}
                <div style={headerStyle}>
                  <motion.span
                    layoutId="create-text"
                    style={{
                      willChange: "transform",
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "11px",
                      letterSpacing: "var(--kicker-tracking-loose, 0.1em)",
                      textTransform: "uppercase",
                      color: "var(--foreground-feint, #64748b)",
                      fontWeight: 700,
                    }}
                  >
                    Nouveau Dossier / Nœud
                  </motion.span>
                  <motion.div
                    key="create-icon"
                    layoutId="create-icon"
                    onClick={() => setOpen(false)}
                    style={{
                      ...iconBox,
                      cursor: "pointer",
                      padding: "0.5rem",
                      margin: "-0.5rem",
                      willChange: "transform",
                      color: "var(--foreground, #0f172a)",
                      fontSize: "0.625rem",
                    }}
                    initial={{ rotate: 45 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 45 }}
                    className="hover:text-red-500 transition-colors"
                  >
                    <CloseIcon />
                  </motion.div>
                </div>

                {/* 3x2 Grid */}
                <motion.div
                  key="grid"
                  style={gridStyle}
                  initial={{ opacity: 0, y: contentOffsetY, scale: contentScale }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: contentOffsetY, scale: contentScale }}
                  transition={{ type: "spring", ...menuSpring }}
                >
                  {items.map((item, index) => (
                    <MenuCell
                      key={item.label}
                      item={item}
                      index={index}
                      staggerInterval={staggerInterval}
                      onSelect={handleSelectItem}
                    />
                  ))}
                </motion.div>

                {/* Bottom AI Distiller Shortcut Bar */}
                <div className="p-2 bg-slate-50 dark:bg-zinc-900 border-t border-dotted border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setOpen(false);
                      onOpenDistiller();
                    }}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>✨ Distillateur IA de Récits & CV</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </MotionConfig>
  );
};

export default MotionCreateButton;
