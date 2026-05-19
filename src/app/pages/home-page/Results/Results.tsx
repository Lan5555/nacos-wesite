"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CoreService from "@/app/hooks/core-service";
import styles from "./Results.module.css";
import { Loader2 } from "lucide-react";

interface Result {
  id: number;
  course: string;
  code: string;
  level: number;
  department: string;
  file: string;
  createdAt: string;
  session: string;
  semester: string;
}

interface LevelResults {
  level: string;
  results: Result[];
}

const service = new CoreService();

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemFade = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const levelOrder = [
  { label: "100 Level", value: 100 },
  { label: "200 Level", value: 200 },
  { label: "300 Level", value: 300 },
  { label: "400 Level", value: 400 },
];

const Results: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState(0);
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.get("results/find-all-results");
      if (result.success) {
        setAllResults(result.data ?? []);
      }
    } catch {
      console.log("Error fetching results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabSwitch = (index: number) => {
    setTabLoading(true);
    setActiveLevel(index);
    setTimeout(() => setTabLoading(false), 400);
  };

  // Filter results by active level
  const currentResults = allResults.filter(
    (r) => r.level === levelOrder[activeLevel].value
  );

  return (
    <motion.section
      className={styles.results}
      id="results"
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
          <div className={styles.badge}>ACADEMIC RECORDS</div>
          <h2 className={styles.heading}>
            Course <span className={styles.green}>Results</span>
          </h2>
          <p className={styles.subtext}>
            Preview semester scores by level — log in for your personal results.
          </p>
        </motion.div>

        {/* Level Tabs */}
        <motion.div
          className={styles.tabs}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {levelOrder.map((lvl, i) => (
            <motion.button
              key={lvl.label}
              className={`${styles.tab} ${activeLevel === i ? styles.tabActive : ""}`}
              onClick={() => handleTabSwitch(i)}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {lvl.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Loader */}
        {loading || tabLoading ? (
          <div className={styles.loaderWrapper}>
            <Loader2 size={40} className={styles.spinner} />
            <p className={styles.loaderText}>
              {loading ? "Fetching results..." : `Loading ${levelOrder[activeLevel].label}...`}
            </p>
          </div>
        ) : currentResults.length === 0 ? (
          <div className={styles.empty}>
            <p>No results available for {levelOrder[activeLevel].label}.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLevel}
              className={styles.tableWrapper}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              layout
            >
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Course Title</th>
                    <th>Session</th>
                    <th>Semester</th>
                    <th>File</th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {currentResults.map((result) => (
                    <motion.tr
                      key={result.id}
                      variants={itemFade}
                      layout
                    >
                      <td className={styles.code}>{result.code}</td>
                      <td className={styles.title}>{result.course}</td>
                      <td>{result.session}</td>
                      <td>{result.semester}</td>
                      <td>
                        <a
                          href={result.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileLink}
                        >
                          View PDF
                        </a>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.section>
  );
};

export default Results;