"use client";

import { useEffect, useState } from "react";
import CoreService from "@/app/hooks/core-service";
import styles from "./About.module.css";
import { BookOpen, Lightbulb, Handshake, Rocket, Globe, Trophy } from "lucide-react";
import { motion } from "framer-motion";

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
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className={styles.badge}>ABOUT NACOS UNIJOS</div>

          <h2 className={styles.heading}>
  More Than a Tech Association —{" "}
  <span className={styles.green}>A Community Built for Growth</span>
</h2>

          <p className={styles.body}>
            NACOS UNIJOS is the official chapter of the Nigeria Association of
            Computing Students at the University of Jos, bringing together
            passionate students driven by technology, innovation, leadership, and
            academic excellence.
          </p>

          <p className={styles.body}>
            More than just a student association, NACOS UNIJOS is a thriving
            community where future software engineers, designers, cybersecurity
            experts, data scientists, and tech leaders connect, learn, build, and
            grow together through events, workshops, mentorship, collaborations,
            and real-world opportunities.
          </p>

          <p className={styles.body}>
            We are committed to creating an environment where students can explore
            their potential, develop industry-ready skills, contribute to impactful
            projects, and become part of Nigeria’s growing digital future.
          </p>

          <div className={styles.valuesGrid}>
            {values.map((v, index) => (
              <motion.div
                key={v.label}
                className={styles.valueCard}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                  rotateX: 4,
                  rotateY: -4,
                }}
              >
                <span className={styles.valueIcon}>{v.icon}</span>
                <span className={styles.valueLabel}>{v.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className={styles.estCard}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className={styles.estLabel}>
              NACOS UNIJOS
            </span>
            <p className={styles.estSub}>
              University of Jos Tech Community
            </p>
          </motion.div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>
                {loading ? "..." : data?.totalUsers ? `${data.totalUsers.toLocaleString()}+` : "500+"}
              </span>
              <span className={styles.statLabel}>Student Members</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statNum}>
                {loading ? "..." : data?.totalEvents ? `${data.totalEvents}+` : "50+"}
              </span>
              <span className={styles.statLabel}>Events & Workshops</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statNum}>Tech</span>
              <span className={styles.statLabel}>Innovation & Leadership</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statNum}>UNIJOS</span>
              <span className={styles.statLabel}>Building Digital Excellence</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;




