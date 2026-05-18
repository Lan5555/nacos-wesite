"use client";

import { useEffect, useState } from "react";
import CoreService from "@/app/hooks/core-service";
import styles from "./Excos.module.css";
import { Twitter, Instagram, Calendar, Loader2 } from "lucide-react";

interface Exco {
  id: string;
  name: string;
  position?: string;
  level?: number;
  department?: string;
  profileImage?: string;
  isStaff?: boolean;
  email?: string;
}

const service = new CoreService();

  const positionOrder = [
  'President',
  'Vice President',
  'Secretary General',
  'Welfare Secretary',
  'Director of Tech and Innovation',
  'Financial Secretary',
  'Public Relations Officer',
  'Director of Academics',
  'Director of Socials',
  'Director of Sports',
  'Director of Welfare',
  'Auditor General',
  'Treasurer',
];

const Excos: React.FC = () => {
  const [excos, setExcos] = useState<Exco[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await service.get("admin/find-all");
      if (result.success) {
        const sorted = (result.data ?? []).sort((a: Exco, b: Exco) => {
          const aIndex = positionOrder.indexOf(a.position ?? '');
          const bIndex = positionOrder.indexOf(b.position ?? '');

         
          const aRank = aIndex === -1 ? positionOrder.length : aIndex;
          const bRank = bIndex === -1 ? positionOrder.length : bIndex;

          return aRank - bRank;
        });
        setExcos(sorted);
      }
    } catch {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  
  const getColor = (name: string) => {
    const colors = [
      "#22863a", "#3b82f6", "#8b5cf6",
      "#f97316", "#06b6d4", "#64748b",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <section className={styles.execs} id="excos">
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.badge}>LEADERSHIP</div>
          <h2 className={styles.heading}>
            Meet Our <span className={styles.green}>Executives</span>
          </h2>
          <p className={styles.subtext}>
            Elected student leaders championing excellence across all NACOS chapters.
          </p>
        </div>

        {/* Loader */}
        {loading ? (
          <div className={styles.loaderWrapper}>
            <Loader2 size={40} className={styles.spinner} />
            <p className={styles.loaderText}>Loading executives...</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {excos.map((exco) => (
              <div key={exco.id} className={styles.card}>
                {exco.profileImage ? (
                  <img
                    src={exco.profileImage}
                    alt={exco.name}
                    className={styles.avatarImage}
                  />
                ) : (
                  <div
                    className={styles.avatar}
                    style={{ background: getColor(exco.name) }}
                  >
                    {getInitials(exco.name)}
                  </div>
                )}
                <h3 className={styles.name}>{exco.name}</h3>
                <p className={styles.role}>{exco.position ?? "Member"}</p>
                <p className={styles.meta}>
                  {exco.isStaff ? "Staff" : `${exco.level}L`} · {exco.department}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Excos;