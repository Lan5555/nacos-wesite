"use client";

import { useEffect, useState } from "react";
import CoreService from "@/app/hooks/core-service";
import styles from "./Hero.module.css";
import { useToast } from "@/app/providers/toast-provider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface HeroData {
  totalUsers?: number;
  totalEvents?: number;
}

const resourceLevels = [
  { label: "100 Level", count: 24, pct: 85 },
  { label: "200 Level", count: 31, pct: 92 },
  { label: "300 Level", count: 29, pct: 80 },
  { label: "400 Level", count: 35, pct: 95 },
  { label: "500 Level", count: 18, pct: 55 },
];

interface HeroProps {
  sharedData: (data: HeroData) => void;
  isLoading: (loading: boolean) => void;
}

const Hero: React.FC<HeroProps> = ({ sharedData, isLoading }) => {

  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();
  const service: CoreService = new CoreService();

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const floatingCard = {
    hidden: {
      opacity: 0,
      x: 80,
      rotate: 4,
      scale: 0.92,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      isLoading(true);
      const [usersResult, eventsResult] = await Promise.all([
        service.get("users/total-users"),
        service.get("events/total-events"),
      ]);
      // Always check the success status of each API call before using the data
      if (usersResult.success && eventsResult.success) {
        setData({
          totalUsers: usersResult.data['totalUsers'],
          totalEvents: eventsResult.data['totalEvents'],
        });

        sharedData({
          totalUsers: usersResult.data['totalUsers'],
          totalEvents: eventsResult.data['totalEvents'],
        });
      } else {
        showToast("Failed to load hero data. Please try again later.", "error");
      }
    } catch (error) {
      console.error("fetchData error:", error);
      showToast("Failed to load hero data. Please try again later.", "error");
    } finally {
      setLoading(false);
      isLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.inner}>
        {/* Left Column */}
        <motion.div
          className={styles.left}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className={styles.badge}
            variants={fadeUp}
            custom={0.1}
          >
            <span>🌿</span>
            <span>Nigeria&apos;s Premier CS Student Body</span>
          </motion.div>

          <motion.h1
            className={styles.headline}
            variants={fadeUp}
            custom={0.2}
          >
            Empowering
            <br />
            Nigeria&apos;s{" "}
            <em className={styles.highlight}>Tech
              <br />
              Generation</em>
          </motion.h1>

          <motion.p
            className={styles.subtext}
            variants={fadeUp}
            custom={0.3}
          >
            NACOS unites Computer Science students across 48 institutions —
            providing resources, community, and career pathways for
            tomorrow&apos;s innovators.
          </motion.p>

          <motion.div
            className={styles.ctas}
            variants={fadeUp}
            custom={0.4}
          >
            <button className={styles.ctaPrimary}
            onClick={() => {
            router.push('/pages/login')

          }}>Access Dashboard →</button>
          
            <button className={styles.ctaSecondary} id="about" >Learn About NACOS</button>
          </motion.div>

          <motion.div
            className={styles.stats}
            variants={fadeUp}
            custom={0.5}
          >
            <div className={styles.statItem}>
              <span className={styles.statNum}>
                {loading ? "..." : data?.totalUsers ? `${data.totalUsers.toLocaleString()}+` : "5,000+"}
              </span>
              <span className={styles.statLabel}>Active Members</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>48</span>
              <span className={styles.statLabel}>Chapters</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>
                200+
              </span>
              <span className={styles.statLabel}>Resources</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column — Resource Overview Card */}
        <motion.div
          className={styles.right}
          variants={floatingCard}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className={styles.card}
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.dots}>
                <span className={styles.dotGreen} />
                <span className={styles.dotGray} />
                <span className={styles.dotGray} />
              </div>
              <span className={styles.cardTitle}>Resource Overview</span>
            </div>

            <div className={styles.bars}>
              {resourceLevels.map((lvl) => (
                <div key={lvl.label} className={styles.barRow}>
                  <span className={styles.barLabel}>{lvl.label}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${lvl.pct}%` }}
                    />
                  </div>
                  <span className={styles.barCount}>{lvl.count}</span>
                </div>
              ))}
            </div>

            <div className={styles.metricGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricNum}>98%</span>
                <span className={styles.metricLabel}>Graduate Employment</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNum}>
                  {loading ? "..." : data?.totalEvents ? `${data.totalEvents}+` : "200+"}
                </span>
                <span className={styles.metricLabel}>Annual Events</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNum}>₦500K</span>
                <span className={styles.metricLabel}>Hackathon Prize</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricNum}>4.8★</span>
                <span className={styles.metricLabel}>Student Satisfaction</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
export default Hero;