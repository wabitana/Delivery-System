import { motion } from "framer-motion";

export function SectionHeading({ eyebrow, title, subtitle, align = "left" }) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-600 dark:text-brand-400"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="mt-3 font-display text-3xl font-bold md:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-lg text-slate-600 dark:text-slate-300"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
