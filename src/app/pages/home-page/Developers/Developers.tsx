"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import CoreService from "@/app/hooks/core-service";
import styles from "./Developers.module.css";
import { Globe, Code2, Server, Layers, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Image from 'next/image';

interface DevData {
  id: number;
  name: string;
  email: string;
  position?: string;
  department?: string;
  profileImage?: string;
  level?: number;
  isStaff?: boolean;
}

const service = new CoreService();

const staticDevInfo: Record<number, {
  role: string;
  title: string;
  bio: string;
  stack: string[];
  portfolio: string;
  github: string;
  icon: React.ReactNode;
  accent: string;
}> = {
  3: {
    role: "Lead Developer",
    title: "Full Stack Engineer • Mobile Developer • Game Developer",
    bio: "Full stack engineer building scalable backend systems, modern web apps, mobile applications, and interactive gaming experiences with performance-focused architecture.",
    stack: [
      "Flutter",
      "wxWidgets",
      "NestJS",
      "Go",
      "PostgreSQL",
      "React",
      "Next.js",
      "TypeScript",
      "Three.js",
      "Unity",
      "Java",
      "Others.."
    ],
    portfolio: "https://portfolio-nu-steel-90.vercel.app/",
    github: "github.com/lan5555",
    icon: <Server size={18} />,
    accent: "#3b82f6",
  },
  16: {
    role: "Frontend Lead",
    title: "Full Stack Engineer",
    bio: "Full stack engineer specialising in modern web applications, crafting clean, responsive frontends and scalable backend systems with a strong focus on performance and user experience.",
    stack: ["Next.js", "React.js", "Javascript(ES6+)", "TypeScript", "Node.js", "MongoDB", "Firebase", "Tailwind", "Framer Motion", "Figma"],
    portfolio: "https://ramlah-portfolio.vercel.app/",
    github: "github.com/Ramlah22/",
    icon: <Layers size={18} />,
    accent: "#22863a",
  }
};

const contributors = [
  { name: "Joseph Akujieze", role: "FE", image: "/joseph.jpeg", label: "Frontend Developer" },
  { name: "Ibrahim Umar Aliyu", role: "FE", image: "/ibrahim.jpeg", label: "Frontend Developer" },
  { name: "Victor Ilonze", role: "BE", image: "/victor.jpeg", label: "Backend Developer" },
];

function DevCard({ dev, info, index }: {
  dev: DevData;
  info: typeof staticDevInfo[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated border glow */}
      <motion.div
        className={styles.cardGlow}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `radial-gradient(circle at 50% 0%, ${info.accent}30, transparent 70%)` }}
      />

      {/* Top accent bar */}
      <motion.div
        className={styles.accentBar}
        style={{ background: info.accent }}
        animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.4 }}
      />

      <div className={styles.cardInner}>
        {/* Profile Image */}
        <div className={styles.imageSection}>
          <motion.div
            className={styles.imageWrap}
            animate={{ scale: hovered ? 1.03 : 1 }}
            transition={{ duration: 0.4 }}
          >
            {dev.profileImage ? (
              <img
                src={dev.profileImage}
                alt={dev.name}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.initialsAvatar} style={{ background: info.accent }}>
                {dev.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            )}
            <motion.div
              className={styles.imageOverlay}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ background: `${info.accent}20` }}
            />
          </motion.div>

          {/* Role badge */}
          <motion.div
            className={styles.roleBadge}
            style={{ background: `${info.accent}18`, border: `1px solid ${info.accent}40`, color: info.accent }}
            animate={{ y: hovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {info.icon}
            {info.role}
          </motion.div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <h3 className={styles.name}>{dev.name}</h3>
          <p className={styles.title}>{info.title}</p>
          <p className={styles.dept}>{dev.department || "Software Engineering"}</p>

          <motion.p
            className={styles.bio}
            animate={{ opacity: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            {info.bio}
          </motion.p>

          {/* Stack */}
          <div className={styles.stack}>
            {info.stack.map((s, i) => (
              <motion.span
                key={s}
                className={styles.stackTag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 + i * 0.05 }}
                whileHover={{ scale: 1.08, backgroundColor: `${info.accent}20` }}
              >
                {s}
              </motion.span>
            ))}
          </div>

          {/* Links */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className={styles.links}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
              >
                <a
                  href={info.portfolio}
                  className={styles.linkBtn}
                  style={{ background: info.accent }}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  <Globe size={13} /> Portfolio
                </a>
                <a
                  href={`https://${info.github}`}
                  className={styles.linkGhost}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                >
                  <FaGithub size={13} /> GitHub
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function Developers() {
  const [devs, setDevs] = useState<Record<number, DevData>>({});
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  useEffect(() => {
    const fetchDevs = async () => {
      try {
        const [fe, be] = await Promise.all([
          service.get("admin/find-one/3"),
          service.get("admin/find-one/16"),
        ]);
        setDevs({
          3: fe.data,
          16: be.data,
        });
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    };
    fetchDevs();
  }, []);

  return (
    <section className={styles.section} id="developers">
      {/* Subtle background pattern */}
      <div className={styles.bgPattern} />

      <div className={styles.inner}>
        {/* Header */}
        <motion.div
          ref={headerRef}
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.badge}>
            <Code2 size={12} />
            BUILT BY
          </div>
          <h2 className={styles.heading}>
            The <span className={styles.green}>Dev Team</span>
          </h2>
          <p className={styles.subtext}>
            The minds behind every pixel and every endpoint. Hover a card to explore.
          </p>
        </motion.div>

        {/* Cards */}
        <div className={styles.cards}>
          {loading ? (
            [0, 1].map(i => (
              <div key={i} className={styles.skeleton} />
            ))
          ) : (
            [3, 16].map((id, index) => (
              devs[id] && (
                <DevCard
                  key={id}
                  dev={devs[id]}
                  info={staticDevInfo[id]}
                  index={index}
                />
              )
            ))
          )}
        </div>

        {/* Contributors */}
        <motion.div
          className={styles.contributors}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className={styles.contribLabel}>also shipped some things</p>
          <div className={styles.contribList}>
            {contributors.map((c) => (
              <motion.div key={c.name} className={styles.contribCard} whileHover={{ y: -4 }}>
                <div className={styles.contribImgWrap}>
                  <img src={c.image} alt={c.name} className={styles.contribImg} />
                </div>
                <div className={styles.contribInfo}>
                  <span className={styles.contribName}>{c.name}</span>
                  <span className={styles.contribRole}>{c.label}</span>
                  <span
                    className={styles.contribTag}
                    style={{
                      background: c.role === "FE" ? "rgba(34,134,58,0.15)" : "rgba(59,130,246,0.15)",
                      color: c.role === "FE" ? "#2dba4e" : "#60a5fa",
                    }}
                  >
                    {c.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}