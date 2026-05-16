"use client";

import { useEffect, useState } from "react";
import CoreService from "@/app/hooks/core-service";
import styles from "./About.module.css";
import { BookOpen, Lightbulb, Handshake, Rocket, Globe, Trophy } from "lucide-react";

interface AboutData {
  message?: string;
  established?: number;
  totalUsers?: number;
  chapters?: number;
  graduateEmployment?: number;
  totalEvents?: number;
}

const values = [
  { icon: <BookOpen size={20} />, label: "Academic Excellence" },
  { icon: <Lightbulb size={20} />, label: "Innovation Culture" },
  { icon: <Handshake size={20} />, label: "Strong Community" },
  { icon: <Rocket size={20} />, label: "Career Readiness" },
  { icon: <Globe size={20} />, label: "Global Mindset" },
  { icon: <Trophy size={20} />, label: "Integrity First" },
];

interface AboutProps {
  data: any;
  loading: boolean;
}

const About: React.FC<AboutProps> = ({ data, loading }) => {
  return (
    <section className={styles.about} id="about">
      <div className={styles.inner}>
        {/* Left */}
        <div className={styles.left}>
          <div className={styles.badge}>WHO WE ARE</div>

          <h2 className={styles.heading}>
            Building Nigeria&apos;s{" "}
            <span className={styles.green}>Digital Future</span>
          </h2>

          <p className={styles.body}>
            NACOS — the Nigeria Association of Computer Science Students — is
            the umbrella body uniting CS students across Nigeria&apos;s
            universities and polytechnics. Since{" "}
            {loading ? <span className={styles.skeletonText} /> : data?.established ?? 2008}, we&apos;ve been championing academic
            excellence, professional growth, and social development.
          </p>

          <p className={styles.body}>
            We believe every Computer Science student deserves access to quality
            study materials, mentorship from industry leaders, and a thriving
            community of peers pushing each other toward greatness.
          </p>

          <div className={styles.valuesGrid}>
            {values.map((v) => (
              <div key={v.label} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <span className={styles.valueLabel}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className={styles.right}>
          <div className={styles.estCard}>
            <span className={styles.estLabel}>
              Est. {loading ? <span className={styles.skeletonText} /> : data?.established ?? 2008}
            </span>
            <p className={styles.estSub}>Nigeria&apos;s Premier CS Student Association</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>
                {loading ? "..." : data?.totalUsers ? `${data.totalUsers.toLocaleString()}+` : "5,000+"}
              </span>
              <span className={styles.statLabel}>Active Members</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{loading ? "..." : data?.chapters ?? 48}</span>
              <span className={styles.statLabel}>Chapters Nationwide</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>
                {loading ? "..." : data?.graduateEmployment ? `${data.graduateEmployment}%` : "98%"}
              </span>
              <span className={styles.statLabel}>Graduate Employment</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>
                    {loading ? "..." : data?.totalEvents ? `${data.totalEvents}+` : "120+"}
              </span>
              <span className={styles.statLabel}>Events Per Year</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;




