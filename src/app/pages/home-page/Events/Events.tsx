"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, Tag, ArrowRight, Loader2,
  Code2, Mic2, GraduationCap, Rocket, Handshake, PartyPopper,
} from "lucide-react";
import CoreService from "@/app/hooks/core-service";
import styles from "./Events.module.css";

interface ApiEvent {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  venue: string;
}

interface Event {
  id: string;
  date: string;
  type: string;
  title: string;
  description: string;
  location: string;
  actionLabel: string;
  gradient: string;
  icon: React.ReactNode;
}

const gradients = [
  "linear-gradient(135deg, #22863a, #2dba4e)",
  "linear-gradient(135deg, #3b82f6, #60a5fa)",
  "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  "linear-gradient(135deg, #f97316, #fb923c)",
  "linear-gradient(135deg, #10b981, #34d399)",
  "linear-gradient(135deg, #0f766e, #14b8a6)",
];

const iconPool = [
  <Code2 size={28} color="#fff" />,
  <Mic2 size={28} color="#fff" />,
  <GraduationCap size={28} color="#fff" />,
  <Rocket size={28} color="#fff" />,
  <Handshake size={28} color="#fff" />,
  <PartyPopper size={28} color="#fff" />,
];

function mapApiEvent(apiEvent: ApiEvent, index: number): Event {
  const date = new Date(apiEvent.createdAt);
  const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return {
    id: String(apiEvent.id),
    date: formatted,
    type: "EVENT",
    title: apiEvent.title,
    description: apiEvent.content,
    location: apiEvent.venue,
    actionLabel: "Register",
    gradient: gradients[index % gradients.length],
    icon: iconPool[index % iconPool.length],
  };
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

const cardFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.get("events/find-all-events?date=2026-05-13");
      if (result.success) {
        setEvents((result.data ?? []).map(mapApiEvent));
      }
    } catch {
      console.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.section
      className={styles.events}
      id="events"
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
          <div className={styles.badge}>WHAT&apos;S COMING</div>
          <h2 className={styles.heading}>
            Upcoming <span className={styles.green}>Events</span>
          </h2>
          <p className={styles.subtext}>
            Tech talks, hackathons, career fairs — stay plugged in to the NACOS calendar.
          </p>
        </motion.div>

        {loading ? (
          <div className={styles.loaderWrapper}>
            <Loader2 size={40} className={styles.spinner} />
            <p className={styles.loaderText}>Fetching upcoming events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className={styles.loaderWrapper}>
            <p className={styles.loaderText}>No upcoming events at the moment. Check back soon.</p>
          </div>
        ) : (
          <motion.div
            className={styles.grid}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.08, delayChildren: 0.08 },
              },
            }}
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                className={styles.card}
                variants={cardFade}
                whileHover={{ y: -6, boxShadow: "0 22px 80px rgba(34, 133, 58, 0.12)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles.cardBanner} style={{ background: event.gradient }}>
                  <span className={styles.cardIcon}>{event.icon}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>
                      <Calendar size={12} style={{ display: "inline", marginRight: 4 }} />
                      {event.date}
                    </span>
                    <span className={styles.cardType}>
                      <Tag size={10} style={{ display: "inline", marginRight: 3 }} />
                      {event.type}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{event.title}</h3>
                  <p className={styles.cardDesc}>{event.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.location}>
                      <MapPin size={13} style={{ display: "inline", marginRight: 4 }} />
                      {event.location}
                    </span>
                    <button className={styles.actionBtn}>
                      {event.actionLabel}
                      <ArrowRight size={13} style={{ marginLeft: 6 }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}