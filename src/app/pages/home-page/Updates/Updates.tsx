"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CoreService from "@/app/hooks/core-service";
import styles from "./Updates.module.css";
import { Loader2, Megaphone, Medal, Calendar } from "lucide-react";

interface Update {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
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
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const Updates: React.FC = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.get("notifications/find-all");
      if (result.success) {
        setUpdates(result.data ?? []);
      }
    } catch {
      // keep empty on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.section
      className={styles.updates}
      id="updates"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionReveal}
    >
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.badge}>STAY INFORMED</div>
          <h2 className={styles.heading}>
            Updates &amp; <span className={styles.green}>Notifications</span>
          </h2>
          <p className={styles.subtext}>
            Announcements, deadlines, results, and important news from NACOS HQ.
          </p>
        </motion.div>

        {/* Loader */}
        {loading ? (
          <div className={styles.loaderWrapper}>
            <Loader2 size={40} className={styles.spinner} />
            <p className={styles.loaderText}>Fetching updates...</p>
          </div>
        ) : updates.length === 0 ? (
          <div className={styles.empty}>
            <p>No updates available at the moment.</p>
          </div>
        ) : (
          <div className={styles.columns}>
            {/* Announcements — unread */}
            <div className={styles.column}>
              <div className={styles.columnHeader}>
                <Megaphone size={18} color="var(--green-primary)" />
                <h3 className={styles.columnTitle}>Announcements</h3>
              </div>
              <div className={styles.divider} />
              <div className={styles.list}>
                {updates
                  .filter((u) => !u.isRead)
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      className={`${styles.item} ${styles.borderGreen}`}
                      variants={itemFade}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className={styles.itemTop}>
                        <h4 className={styles.itemTitle}>{item.title}</h4>
                        <span className={`${styles.tag} ${styles.tagGreen}`}>NEW</span>
                      </div>
                      <p className={styles.itemDesc}>{item.message}</p>
                      <div className={styles.itemDate}>
                        <Calendar size={12} />
                        {formatDate(item.createdAt)}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>

            {/* Results — read */}
            <div className={styles.column}>
              <div className={styles.columnHeader}>
                <Medal size={18} color="var(--green-primary)" />
                <h3 className={styles.columnTitle}>Results &amp; Academic</h3>
              </div>
              <div className={styles.divider} />
              <div className={styles.list}>
                {updates
                  .filter((u) => u.isRead)
                  .map((item) => (
                    <motion.div
                      key={item.id}
                      className={`${styles.item} ${styles.borderBlue}`}
                      variants={itemFade}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className={styles.itemTop}>
                        <h4 className={styles.itemTitle}>{item.title}</h4>
                        <span className={`${styles.tag} ${styles.tagBlue}`}>READ</span>
                      </div>
                      <p className={styles.itemDesc}>{item.message}</p>
                      <div className={styles.itemDate}>
                        <Calendar size={12} />
                        {formatDate(item.createdAt)}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Updates;