"use client";

import { useEffect, useState } from "react";
import CoreService from "@/app/hooks/auth-controller";
import styles from "./Hero.module.css";

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

export default function Hero() {
     const [data, setData] = useState<HeroData | null>(null);
     const [loading, setLoading] = useState(true);

      const service = new CoreService();

      const fetchData = async () => {
        try {
          setLoading(true);
          const [usersResult, eventsResult] = await Promise.all([
            service.get("users/total-users"),
            service.get("events/total-events"),
          ]);

          setData({
            totalUsers: usersResult.data?.totalUsers,
            totalEvents: eventsResult.data?.totalEvents,
          });
        } catch (error) {
          console.error("fetchData error:", error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchData();
      }, []);
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.inner}>
        {/* Left Column */}
        <div className={styles.left}>
          <div className={styles.badge}>
            <span>🌿</span>
            <span>Nigeria&apos;s Premier CS Student Body</span>
          </div>

          <h1 className={styles.headline}>
            Empowering
            <br />
            Nigeria&apos;s{" "}
            <em className={styles.highlight}>Tech
            <br />
            Generation</em>
          </h1>

          <p className={styles.subtext}>
            NACOS unites Computer Science students across 48 institutions —
            providing resources, community, and career pathways for
            tomorrow&apos;s innovators.
          </p>

          <div className={styles.ctas}>
            <button className={styles.ctaPrimary}>Access Dashboard →</button>
            <button className={styles.ctaSecondary}>Learn About NACOS</button>
          </div>

          <div className={styles.stats}>
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
          </div>
        </div>

        {/* Right Column — Resource Overview Card */}
        <div className={styles.right}>
          <div className={styles.card}>
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
          </div>
        </div>
      </div>
    </section>
  );
}
