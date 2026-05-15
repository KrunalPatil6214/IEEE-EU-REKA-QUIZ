"use client";

import { useState, useEffect, } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// ─── Data ────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    question:
      "The lab's main water supply is locked down, but you find a backup 5V water pump. You need to wire a system that automatically dispenses clean water into a container only when a survivor's hand (or a rescue dog) is placed directly beneath the spout. Which sensor is best suited to detect this close-proximity presence and trigger the pump's relay?",
    options: [
      "MQ-2 Gas Sensor",
      "Infrared (IR) Proximity Sensor",
      "LDR (Photoresistor)",
      "Soil Moisture Sensor",
    ],
    ans: 1,
  },
  {
    question:
      "You need to fabricate a custom replacement gear to fix a jammed mechanical door lock. You decide to use the lab's emergency FDM 3D printer. To ensure the newly printed gear has maximum structural strength and its teeth don't snap off under shear force, how should the part be oriented on the build plate?",
    options: [
      "Upright, so the layer lines are parallel to the rotational force.",
      "Flat on its face, so the layer lines are perpendicular to the rotational force.",
      "At a 45-degree angle to minimize the use of support material.",
      "Print orientation has no effect on the mechanical strength of FDM parts.",
    ],
    ans: 1,
  },
  {
    question:
      "You are wiring an ESP32 microcontroller to send an automated SOS signal over the local network. You only have a 9V battery, but supplying 9V directly to the ESP32 will fry the board. What component must you wire between the battery and the microcontroller to safely step the voltage down?",
    options: [
      "A 10k ohm pull-up resistor",
      "A 3.3V Voltage Regulator (e.g., LM3940)",
      "An L298N Motor Driver",
      "A standard NPN Transistor",
    ],
    ans: 1,
  },
  {
    question:
      "You are trapped in the lab's high-speed transport testing bay. To safely use a prototype ladder frame chassis as a battering ram to break through the loading dock doors, you must ensure the TIG welds hold. Which non-destructive testing method would allow you to check the welds for microscopic internal flaws without damaging the frame?",
    options: [
      "Ultrasonic Testing",
      "Visual Inspection with a high-powered magnifying glass",
      "Applying a heavy load until the metal begins to yield",
      "Measuring the electrical resistance from one end of the frame to the other",
    ],
    ans: 0,
  },
  {
    question:
      "To safely extract a highly reactive chemical key from a corrosive acid bath, you must coat a regular pair of tongs with a microscopically thin, ultra-hard protective layer using the lab's Physical Vapor Deposition (PVD) chamber. What state of matter is the coating material transformed into during this process before it adheres to the tongs?",
    options: [
      "A supercooled liquid",
      "A dense, pressurized gas",
      "A plasma or vaporized state",
      "A Bose-Einstein condensate",
    ],
    ans: 2,
  },
  {
    question:
      "The final blast door requires two separate, physically distant switches to be flipped ON simultaneously to activate the release mechanism. If either switch is OFF, or if both are OFF, the door remains locked. Which logic gate fundamentally represents this security setup?",
    options: ["OR Gate", "XOR Gate", "AND Gate", "NOT Gate"],
    ans: 2,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "landing"
  | "user-details"
  | "countdown"
  | "quiz"
  | "result-success"
  | "result-fail";

interface UserDetails {
  name: string;
  college: string;
  location: string;
}

// ─── Scanlines overlay ────────────────────────────────────────────────────────

function Scanlines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,200,0.018) 2px, rgba(0,255,200,0.018) 4px)",
      }}
    />
  );
}

// ─── Glitch text ─────────────────────────────────────────────────────────────

function GlitchText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block select-none ${className}`}
      style={{ fontFamily: "'Fira Code', 'Roboto Mono', monospace" }}
    >
      <span aria-hidden className="absolute inset-0 text-[#45A29E] opacity-60" style={{ clipPath: "inset(30% 0 40% 0)", transform: "translateX(-2px)" }}>
        {text}
      </span>
      <span aria-hidden className="absolute inset-0 text-[#FFC300] opacity-40" style={{ clipPath: "inset(60% 0 10% 0)", transform: "translateX(2px)" }}>
        {text}
      </span>
      {text}
    </span>
  );
}

// ─── Boot terminal ────────────────────────────────────────────────────────────

const BOOT_LINES = [
  "EUREKA LAB EMERGENCY TERMINAL v4.7.1",
  "Initialising secure subsystems...",
  "Memory: 512MB — INTEGRITY: DEGRADED",
  "Network: LOCAL ONLY — EXTERNAL: SEVERED",
  "Bio-hazard containment: CRITICAL",
  "Survivor clearance: PENDING IDENTITY",
  ">>> Access Level: RESTRICTED",
  "Override code accepted — loading interface...",
];

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i];
        if (line !== undefined) {
          setLines((prev) => [...prev, line]);
        }
        i++;
      } else {
        clearInterval(id);
        setTimeout(() => setReady(true), 400);
      }
    }, 280);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="border border-[#45A29E]/40 rounded-sm p-6 bg-[#0B0C10]/90 font-mono text-sm space-y-1 min-h-[260px]">
        {lines.filter((l): l is string => typeof l === "string").map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={
              l.startsWith(">>>")
                ? "text-[#FFC300]"
                : l.includes("CRITICAL") || l.includes("SEVERED")
                ? "text-red-400"
                : l.includes("DEGRADED") || l.includes("PENDING")
                ? "text-[#FFC300]/80"
                : "text-[#45A29E]/90"
            }
          >
            <span className="text-[#45A29E]/40 mr-2 select-none">$</span>
            {l}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={onComplete}
              className="group relative overflow-hidden border border-[#45A29E] px-10 py-4 font-mono text-[#45A29E] tracking-widest text-sm uppercase transition-all hover:text-[#0B0C10] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#45A29E]"
            >
              <span className="absolute inset-0 bg-[#45A29E] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative">[ HOLD TO OVERRIDE MAINFRAME ]</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── User Details Form ────────────────────────────────────────────────────────

function UserDetailsForm({
  onSubmit,
}: {
  onSubmit: (d: UserDetails) => void;
}) {
  const [form, setForm] = useState({ name: "", college: "", location: "" });
  const [errors, setErrors] = useState({ name: false, college: false, location: false });

  const handle = () => {
    const e = {
      name: !form.name.trim(),
      college: !form.college.trim(),
      location: !form.location.trim(),
    };
    setErrors(e);
    if (!e.name && !e.college && !e.location) onSubmit(form);
  };

  const fields: { key: keyof typeof form; label: string; placeholder: string }[] = [
    { key: "name", label: "SURVIVOR DESIGNATION", placeholder: "Enter your name..." },
    { key: "college", label: "FACILITY OF ORIGIN", placeholder: "Your college / institution..." },
    { key: "location", label: "LAST KNOWN COORDINATES", placeholder: "Your location..." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <p className="font-mono text-[#45A29E]/60 text-xs tracking-widest mb-2">IDENTITY VERIFICATION REQUIRED</p>
        <h2
          className="text-2xl text-[#EAEAEA] tracking-tight"
          style={{ fontFamily: "'Fira Code', monospace" }}
        >
          Survivor Registration
        </h2>
      </div>

      <div className="border border-[#45A29E]/30 bg-[#0B0C10]/80 p-7 space-y-6 rounded-sm">
        {fields.map(({ key, label, placeholder }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Label
              className="font-mono text-[10px] tracking-[0.2em] text-[#45A29E]/70 mb-2 block"
            >
              {label}
            </Label>
            <Input
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
              placeholder={placeholder}
              className={`bg-transparent border rounded-none font-mono text-[#EAEAEA] placeholder:text-[#888]/50 focus-visible:ring-[#45A29E] focus-visible:ring-1 focus-visible:ring-offset-0 transition-all ${
                errors[key]
                  ? "border-red-500/80"
                  : "border-[#45A29E]/30 hover:border-[#45A29E]/60"
              }`}
            />
            {errors[key] && (
              <p className="text-red-400 font-mono text-[10px] mt-1 tracking-widest">
                // FIELD REQUIRED
              </p>
            )}
          </motion.div>
        ))}

        <Button
          onClick={handle}
          className="w-full mt-4 bg-transparent border border-[#45A29E] text-[#45A29E] font-mono tracking-widest text-xs hover:bg-[#45A29E] hover:text-[#0B0C10] rounded-none transition-all py-5"
        >
          CONFIRM IDENTITY — PROCEED TO LAB
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function Countdown({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) { onDone(); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="font-mono text-[#45A29E]/60 text-xs tracking-widest">COMMENCING IN</p>
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ scale: 1.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="text-[96px] font-mono text-[#FFC300] leading-none"
          style={{ textShadow: "0 0 40px rgba(255,195,0,0.4)" }}
        >
          {count === 0 ? "GO" : count}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Option Card ──────────────────────────────────────────────────────────────

function OptionCard({
  label,
  text,
  onClick,
  state,
  delay,
}: {
  label: string;
  text: string;
  onClick: () => void;
  state: "idle" | "selected" | "correct" | "wrong" | "dimmed";
  delay: number;
}) {
  const base =
    "relative w-full text-left border px-5 py-4 font-mono transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#45A29E] rounded-sm";

  const styles: Record<string, string> = {
    idle: "border-[#45A29E]/25 bg-transparent text-[#EAEAEA] hover:border-[#45A29E] hover:bg-[#45A29E]/5",
    selected: "border-[#FFC300] bg-[#FFC300]/10 text-[#FFC300]",
    correct: "border-[#45A29E] bg-[#45A29E]/20 text-[#45A29E]",
    wrong: "border-red-500 bg-red-500/15 text-red-400",
    dimmed: "border-[#888]/15 bg-transparent text-[#888]/40",
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={`${base} ${styles[state]}`}
      disabled={state === "dimmed" || state === "correct" || state === "wrong"}
    >
      <span className="text-[#45A29E]/50 mr-3 text-xs">[{label}]</span>
      <span className="text-sm leading-relaxed">{text}</span>
      {(state === "correct") && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#45A29E] text-xs font-mono">
          ✓ CORRECT
        </span>
      )}
      {(state === "wrong") && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 text-xs font-mono">
          ✗ WRONG
        </span>
      )}
    </motion.button>
  );
}

// ─── Quiz Screen ──────────────────────────────────────────────────────────────

const LABELS = ["A", "B", "C", "D"];

function QuizScreen({
  qIndex,
  score,
  onAnswer,
}: {
  qIndex: number;
  score: number;
  onAnswer: (correct: boolean) => void;
}) {
  const q = QUESTIONS[qIndex];
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const pick = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const correct = i === q.ans;
    setTimeout(() => onAnswer(correct), 1100);
  };

  const optionState = (i: number) => {
    if (!revealed) return "idle";
    if (i === q.ans) return "correct";
    if (i === selected && i !== q.ans) return "wrong";
    return "dimmed";
  };

  return (
    <motion.div
      key={qIndex}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between font-mono text-xs text-[#888] border-b border-[#45A29E]/20 pb-3">
        <span className="text-[#45A29E]/80">
          SECTOR <span className="text-[#FFC300]">{qIndex + 1}</span>
          <span className="text-[#888]">/6</span> CLEARED
        </span>
        <span>
          SYSTEM INTEGRITY:{" "}
          <span className="text-[#45A29E]">{score * 2}/12 pts</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-[2px] bg-[#45A29E]/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#45A29E]"
          initial={{ width: `${(qIndex / 6) * 100}%` }}
          animate={{ width: `${((qIndex + 1) / 6) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <div className="border border-[#45A29E]/20 bg-[#0D0F13] p-6 rounded-sm">
        <p className="font-mono text-[10px] tracking-widest text-[#45A29E]/50 mb-3">
          // QUERY {String(qIndex + 1).padStart(2, "0")}
        </p>
        <p className="text-[#EAEAEA] text-base leading-relaxed">
          {q.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, i) => (
          <OptionCard
            key={i}
            label={LABELS[i]}
            text={opt}
            onClick={() => pick(i)}
            state={optionState(i)}
            delay={i * 0.06}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({
  success,
  score,
  user,
  onRestart: _onRestart,
}: {
  success: boolean;
  score: number;
  user: UserDetails;
  onRestart: () => void; // kept for future use
}) {
  const total = 12;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-xl mx-auto text-center space-y-8"
    >
      {/* Status banner */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full py-5 border font-mono tracking-[0.3em] text-sm ${
          success
            ? "border-[#45A29E] bg-[#45A29E]/10 text-[#45A29E]"
            : "border-red-500 bg-red-500/10 text-red-400"
        }`}
      >
        {success ? "[ ACCESS GRANTED ]" : "[ SYSTEM LOCKDOWN ]"}
      </motion.div>

      {/* Glitch title */}
      <div>
        <GlitchText
          text={success ? "ESCAPE SUCCESSFUL" : "BREACH DETECTED"}
          className={`text-4xl font-bold ${success ? "text-[#45A29E]" : "text-red-400"}`}
        />
      </div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border border-[#45A29E]/20 bg-[#0D0F13] p-6 rounded-sm space-y-4"
      >
        <p className="font-mono text-[10px] tracking-widest text-[#45A29E]/50">// MISSION REPORT</p>

        <div className="flex justify-center">
          <div className="text-center">
            <div
              className={`text-7xl font-mono font-bold ${success ? "text-[#FFC300]" : "text-red-400"}`}
              style={{ textShadow: success ? "0 0 30px rgba(255,195,0,0.3)" : "0 0 30px rgba(239,68,68,0.3)" }}
            >
              {score * 2}
            </div>
            <div className="font-mono text-[#888] text-xs tracking-widest mt-1">
              / {total} POINTS
            </div>
          </div>
        </div>

        <div className="w-full h-[3px] bg-[#45A29E]/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${success ? "bg-[#45A29E]" : "bg-red-500"}`}
            initial={{ width: 0 }}
            animate={{ width: `${(score * 2 / total) * 100}%` }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </div>
      </motion.div>

      {/* User card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="border border-[#45A29E]/20 bg-[#0D0F13] p-6 rounded-sm text-left space-y-3"
      >
        <p className="font-mono text-[10px] tracking-widest text-[#45A29E]/50 mb-4">// SURVIVOR RECORD</p>

        {[
          { label: "DESIGNATION", value: user.name },
          { label: "FACILITY", value: user.college },
          { label: "COORDINATES", value: user.location },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-4 border-b border-[#45A29E]/10 pb-2">
            <span className="font-mono text-[10px] tracking-widest text-[#888] shrink-0">{label}</span>
            <span className="font-mono text-[#EAEAEA] text-sm text-right">{value}</span>
          </div>
        ))}
      </motion.div>

      {/* <Button
        onClick={onRestart}
        className="w-full bg-transparent border border-[#888]/40 text-[#888] font-mono tracking-widest text-xs hover:border-[#45A29E] hover:text-[#45A29E] rounded-none transition-all py-4"
      >
        RESTART PROTOCOL
      </Button> */}
    </motion.div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function EurekaLabQuiz() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [user, setUser] = useState<UserDetails>({ name: "", college: "", location: "" });
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleUserSubmit = (d: UserDetails) => {
    setUser(d);
    setPhase("countdown");
  };

  const handleCountdownDone = () => setPhase("quiz");

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      const next = score + 1;
      setScore(next);
      if (qIndex + 1 >= QUESTIONS.length) {
        setPhase("result-success");
      } else {
        setQIndex((i) => i + 1);
      }
    } else {
      setPhase("result-fail");
    }
  };

  const restart = () => {
    setPhase("landing");
    setQIndex(0);
    setScore(0);
    setUser({ name: "", college: "", location: "" });
  };

  return (
    <div
      className="relative min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center p-6 overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Scanlines />

      {/* Corner decorations */}
      {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map(
        (pos) => (
          <div
            key={pos}
            aria-hidden
            className={`absolute ${pos} w-6 h-6 border-[#45A29E]/30`}
            style={{
              borderWidth: 0,
              boxShadow: `${pos.includes("right") ? "-1px" : "1px"} ${pos.includes("bottom") ? "-1px" : "1px"} 0 0 rgba(69,162,158,0.3)`,
            }}
          />
        )
      )}

      {/* Header */}
      <motion.div
        className="mb-10 text-center select-none"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-mono text-[10px] tracking-[0.35em] text-[#45A29E]/40 mb-1">
          EUREKA RESEARCH FACILITY — TERMINAL ACCESS
        </p>
        <h1
          className="text-3xl md:text-4xl text-[#EAEAEA] tracking-tight"
          style={{ fontFamily: "'Fira Code', 'Roboto Mono', monospace" }}
        >
          <GlitchText text="THE EU-REKA VAULT" />
        </h1>
      </motion.div>

      {/* Phase renderer */}
      <div className="w-full max-w-2xl flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "landing" && (
            <motion.div key="landing" exit={{ opacity: 0 }} className="w-full">
              <BootSequence onComplete={() => setPhase("user-details")} />
            </motion.div>
          )}

          {phase === "user-details" && (
            <motion.div key="user-details" className="w-full">
              <UserDetailsForm onSubmit={handleUserSubmit} />
            </motion.div>
          )}

          {phase === "countdown" && (
            <motion.div key="countdown" exit={{ opacity: 0 }} className="w-full flex justify-center">
              <Countdown onDone={handleCountdownDone} />
            </motion.div>
          )}

          {phase === "quiz" && (
            <motion.div key={`quiz-${qIndex}`} className="w-full">
              <QuizScreen
                qIndex={qIndex}
                score={score}
                onAnswer={handleAnswer}
              />
            </motion.div>
          )}

          {(phase === "result-success" || phase === "result-fail") && (
            <motion.div key="result" className="w-full">
              <ResultScreen
                success={phase === "result-success"}
                score={score}
                user={user}
                onRestart={restart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <p className="mt-8 font-mono text-[10px] text-[#888]/30 tracking-widest select-none">
        SYS STATUS: CRITICAL — CONTAINMENT BREACH IN PROGRESS
      </p>
    </div>
  );
}