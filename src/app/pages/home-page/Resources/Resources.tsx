"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CoreService from "@/app/hooks/core-service";
import styles from "./Resources.module.css";


interface Resource {
  id: number;
  name: string;
  code: string;
  level: string;
  department: string;
}

interface LevelData {
  level: string;
  subtitle: string;
  resources: Resource[];
}

const defaultLevels: LevelData[] = [
  { level: "100 Level", subtitle: "Programming basics, Mathematics, Logic, Computer Hardware", resources: [] },
  { level: "200 Level", subtitle: "Data Structures, Algorithms, Discrete Math, OOP", resources: [] },
  { level: "300 Level", subtitle: "Operating Systems, Networks, Database, Software Engineering", resources: [] },
  { level: "400 Level", subtitle: "AI, Compilers, Computer Graphics, Project Management", resources: [] },
];

const service = new CoreService();

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const contentFade = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

const itemFade = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Resources() {
  const [activeLevel, setActiveLevel] = useState(0);
  const [levels, setLevels] = useState<LevelData[]>(defaultLevels);
  const [loading, setLoading] = useState(true);
 

 const fetchData = async () => {
  try {
    setLoading(true);
    
    const result = await service.get("courses/find-all-courses");

    const allCourses: Resource[] = result.data ?? [];

   
    setLevels([
      { level: "100 Level", subtitle: defaultLevels[0].subtitle, resources: allCourses.filter(c => c.level === "100") },
      { level: "200 Level", subtitle: defaultLevels[1].subtitle, resources: allCourses.filter(c => c.level === "200") },
      { level: "300 Level", subtitle: defaultLevels[2].subtitle, resources: allCourses.filter(c => c.level === "300") },
      { level: "400 Level", subtitle: defaultLevels[3].subtitle, resources: allCourses.filter(c => c.level === "400") },
    ]);

  } catch (error) {
    console.error("Resources fetchData error:", error);
  } finally {
    setLoading(false);
  }
};
  

  useEffect(() => {
    fetchData();
  }, []);

  const current = levels[activeLevel];

  return (
    <motion.section
      className={styles.resources}
      id="resources"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionReveal}
    >
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.badge}>STUDY MATERIALS</div>
          <h2 className={styles.heading}>
            Level <span className={styles.green}>Resources</span>
          </h2>
          <p className={styles.subtext}>
            Past questions, lecture notes, and study guides — neatly organized
            by your level.
          </p>
        </motion.div>

        {/* Level Tabs */}
        <motion.div
          className={styles.tabs}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {levels.map((lvl, i) => (
            <motion.button
              key={lvl.level}
              className={`${styles.tab} ${activeLevel === i ? styles.tabActive : ""}`}
              onClick={() => setActiveLevel(i)}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {lvl.level}
            </motion.button>
          )
           )
            }
        </motion.div>

        {/* Loader */}
        {loading ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.spinner} />
            <p className={styles.loaderText}>Fetching resources...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLevel}
              className={styles.levelBlock}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              layout
            >
              <motion.div
                className={styles.levelHeader}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                layout
              >
                <div>
                  <h3 className={styles.levelTitle}>{current.level}</h3>
                  <p className={styles.levelSub} > {current.subtitle}</p>
                </div>
                <motion.div
                  className={styles.fileCount}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  layout
                >
                  {current.resources.length} Courses
                </motion.div>
              </motion.div>

              <motion.div
                className={styles.resourceGrid}
                variants={contentFade}
                initial="hidden"
                animate="visible"
                layout
              >
                {current.resources.map((res) => (
                  <motion.div
                    key={res.id}
                    className={styles.resourceCard}
                    variants={itemFade}
                    whileHover={{ y: -4, boxShadow: "0 18px 45px rgba(34, 133, 58, 0.1)" }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    layout
                  >
                    <div className={styles.resourceInfo}>
                      <h4 className={styles.resourceTitle}>{res.name}</h4>
                      <p className={styles.resourceSub}>{res.code} — {res.department}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.section>
  );
}
