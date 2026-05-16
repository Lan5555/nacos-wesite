"use client";

import { useEffect, useState } from "react";
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
    <section className={styles.resources} id="resources">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.badge}>STUDY MATERIALS</div>
          <h2 className={styles.heading}>
            Level <span className={styles.green}>Resources</span>
          </h2>
          <p className={styles.subtext}>
            Past questions, lecture notes, and study guides — neatly organized
            by your level.
          </p>
        </div>

        {/* Level Tabs */}
        <div className={styles.tabs}>
          {levels.map((lvl, i) => (
            <button
              key={lvl.level}
              className={`${styles.tab} ${activeLevel === i ? styles.tabActive : ""}`}
              onClick={() => setActiveLevel(i)}
            >
              {lvl.level}
            </button>
          ))}
        </div>

        {/* Loader */}
        {loading ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.spinner} />
            <p className={styles.loaderText}>Fetching resources...</p>
          </div>
        ) : (
          <div className={styles.levelBlock}>
            <div className={styles.levelHeader}>
              <div>
                <h3 className={styles.levelTitle}>{current.level}</h3>
                <p className={styles.levelSub}>{current.subtitle}</p>
              </div>
              <div className={styles.fileCount}>{current.resources.length} Courses</div>
            </div>

            <div className={styles.resourceGrid}>
              {current.resources.map((res) => (
                <div key={res.id} className={styles.resourceCard}>
                  <div className={styles.resourceInfo}>
                    <h4 className={styles.resourceTitle}>{res.name}</h4>
                    <p className={styles.resourceSub}>{res.code} — {res.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}