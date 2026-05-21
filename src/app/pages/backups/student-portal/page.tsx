"use client";

import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  Star,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ElementType } from "react";
import { useEffect, useMemo, useState } from "react";
import styles from "./student-portal.module.css";

type Section =
  | "dashboard"
  | "pdfs"
  | "courses"
  | "results"
  | "purchases"
  | "notifications";

type StudentSession = {
  matricNumber?: string;
  name?: string;
  level?: string;
  department?: string;
};

const sections: Array<{
  id: Section;
  label: string;
  icon: ElementType;
  badge?: number;
}> = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "pdfs", label: "PDF Library", icon: FileText },
  { id: "courses", label: "My Courses", icon: BookOpen },
  { id: "results", label: "Results", icon: GraduationCap },
  { id: "purchases", label: "Purchases", icon: ShoppingBag },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 3 },
];

const pdfLibrary = [
  { name: "Final Year Project Guide", size: "5.2 MB", level: "400 Level" },
  { name: "Research Methodology", size: "3.1 MB", level: "400 Level" },
  { name: "Career Launchpad", size: "2.4 MB", level: "All Levels" },
  { name: "Database Systems", size: "2.7 MB", level: "300 Level" },
];

const courses = [
  {
    code: "CSC 401",
    title: "Advanced Software Engineering",
    credits: 3,
    progress: 86,
  },
  {
    code: "CSC 405",
    title: "Machine Learning Fundamentals",
    credits: 3,
    progress: 78,
  },
  { code: "CSC 411", title: "Cloud Computing", credits: 2, progress: 64 },
  { code: "ENT 402", title: "Entrepreneurship", credits: 2, progress: 72 },
  { code: "CSC 498", title: "Project Seminar", credits: 3, progress: 70 },
];

const results = [
  {
    code: "CSC 401",
    course: "Advanced Software Engineering",
    grade: "A",
    score: 82,
  },
  { code: "CSC 405", course: "Machine Learning", grade: "B+", score: 78 },
  { code: "CSC 411", course: "Cloud Computing", grade: "A-", score: 80 },
  { code: "ENT 402", course: "Entrepreneurship", grade: "B", score: 74 },
];

const purchases = [
  { name: "Nacos Eco Notebook", price: "₦7,500", tag: "Stationery" },
  { name: "Green & White Hoodie", price: "₦28,000", tag: "Apparel" },
  { name: "Past Question Vault", price: "₦12,000", tag: "All Levels" },
  { name: "Final Year Project Template", price: "₦6,500", tag: "Template" },
];

const notifications = [
  "New PDFs for 400 Level uploaded - special project guide added.",
  "Registration for final semester courses closes Sept 25.",
  "20% discount on NACOS merch this week only.",
  "Your result for CSC 411 has been released.",
];

const lectures = [
  {
    time: "10:30 AM",
    name: "Advanced Software Engineering",
    location: "Room 204, ICT Block",
  },
  {
    time: "12:00 PM",
    name: "Cloud Computing",
    location: "Lab 2, Faculty Building",
  },
  { time: "2:00 PM", name: "Research Seminar", location: "Online - Zoom" },
];

export default function StudentPortalPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [student, setStudent] = useState<StudentSession>({
    matricNumber: "NAC/CS/1234",
    name: "Chiamaka M.",
    level: "400 Level",
    department: "Computer Science",
  });

  useEffect(() => {
    const storedSession = window.localStorage.getItem("nacos_student_session");

    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession) as StudentSession;
        setStudent((current) => ({ ...current, ...parsed }));
      } catch {
        window.localStorage.removeItem("nacos_student_session");
      }
    }
  }, []);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    [],
  );

  const pageTitle = {
    dashboard: `Good morning, ${student.name?.split(" ")[0] ?? "Student"}`,
    pdfs: "PDF Library",
    courses: "My Courses",
    results: "Academic Results",
    purchases: "Merch & Resources",
    notifications: "Notifications",
  }[activeSection];

  const initials = (student.name ?? "Nacos Student")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const signOut = () => {
    window.localStorage.removeItem("nacos_student_session");
    router.push("/pages/login");
  };

  return (
    <div className={styles.portalShell}>
      <button
        type="button"
        className={styles.menuToggle}
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <aside
        className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}
      >
        <div className={styles.sidebarGlow} />
        <button
          type="button"
          className={styles.closeMenu}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

        <div className={styles.sidebarLogo}>
          <div className={styles.logoBadge}>
            <div className={styles.logoIcon}>N</div>
            <span className={styles.logoText}>NacosHub</span>
          </div>
          <div className={styles.logoSub}>Student Portal</div>
        </div>

        <nav className={styles.sidebarNav}>
          <p className={styles.navLabel}>Main</p>
          {sections.slice(0, 3).map((item) => (
            <PortalNavButton
              key={item.id}
              item={item}
              active={activeSection === item.id}
              onClick={() => {
                setActiveSection(item.id);
                setMenuOpen(false);
              }}
            />
          ))}

          <p className={styles.navLabel}>Activity</p>
          {sections.slice(3).map((item) => (
            <PortalNavButton
              key={item.id}
              item={item}
              active={activeSection === item.id}
              onClick={() => {
                setActiveSection(item.id);
                setMenuOpen(false);
              }}
            />
          ))}
        </nav>

        <div className={styles.sidebarProfile}>
          <div className={styles.profileRow}>
            <div className={styles.profileAvatar}>{initials}</div>
            <div>
              <div className={styles.profileName}>{student.name}</div>
              <div className={styles.profileMeta}>
                {student.level} · CS · {student.matricNumber}
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.signOutButton}
            onClick={signOut}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1>{pageTitle}</h1>
            <p>
              <CalendarDays size={14} /> {dateLabel} ·{" "}
              <span className={styles.activeDot} /> Active session
            </p>
          </div>
          <div className={styles.topbarRight}>
            <label className={styles.searchBar}>
              <Search size={15} />
              <input placeholder="Search courses, PDFs..." />
            </label>
            <button
              type="button"
              className={styles.notifButton}
              onClick={() => setActiveSection("notifications")}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span />
            </button>
          </div>
        </header>

        {activeSection === "dashboard" && <DashboardSection />}
        {activeSection === "pdfs" && <PdfSection />}
        {activeSection === "courses" && <CoursesSection />}
        {activeSection === "results" && <ResultsSection />}
        {activeSection === "purchases" && <PurchasesSection />}
        {activeSection === "notifications" && <NotificationsSection />}
      </main>
    </div>
  );
}

function PortalNavButton({
  item,
  active,
  onClick,
}: {
  item: { id: Section; label: string; icon: ElementType; badge?: number };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
      onClick={onClick}
    >
      <span className={styles.navIcon}>
        <Icon size={17} />
      </span>
      {item.label}
      {item.badge ? (
        <span className={styles.navBadge}>{item.badge}</span>
      ) : null}
    </button>
  );
}

function DashboardSection() {
  return (
    <section className={styles.section}>
      <div className={styles.statsGrid}>
        <StatCard
          icon={Star}
          label="Current GPA"
          value="3.82"
          sub="+0.04 this semester"
          tone="dark"
        />
        <StatCard
          icon={CheckCircle2}
          label="Credits Earned"
          value="24"
          sub="of 30 this year"
          tone="green"
        />
        <StatCard
          icon={Download}
          label="PDF Downloads"
          value="18"
          sub="From PDF library"
          tone="mint"
        />
        <StatCard
          icon={Zap}
          label="Courses Active"
          value="5"
          sub="Harmattan 2026"
          tone="gold"
        />
      </div>

      <div className={styles.twoCol}>
        <article className={styles.card}>
          <CardHeader
            icon={CalendarDays}
            title="Today's Lectures"
            meta="Today"
          />
          <div className={styles.lectureGrid}>
            {lectures.map((lecture) => (
              <div className={styles.lectureCard} key={lecture.name}>
                <span>{lecture.time}</span>
                <strong>{lecture.name}</strong>
                <p>{lecture.location}</p>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.card}>
          <CardHeader icon={TrendingUp} title="Academic Progress" />
          <div className={styles.progressPanel}>
            <div className={styles.gpaRing}>
              <svg
                width="96"
                height="96"
                viewBox="0 0 96 96"
                aria-hidden="true"
              >
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#e6faf0"
                  strokeWidth="8"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#22b864"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <strong>3.82</strong>
                <span>/ 4.0</span>
              </div>
            </div>
            <div className={styles.gpaDetails}>
              <div>
                <span>Standing</span>
                <strong>First Class</strong>
              </div>
              <div>
                <span>Level</span>
                <strong>400</strong>
              </div>
              {courses.slice(0, 2).map((course) => (
                <ProgressRow
                  key={course.code}
                  label={course.title}
                  value={course.progress}
                />
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function PdfSection() {
  return (
    <section className={styles.section}>
      <article className={styles.card}>
        <CardHeader
          icon={FileText}
          title="PDF Library"
          meta="400 Level selected"
        />
        <div className={styles.itemGrid}>
          {pdfLibrary.map((pdf) => (
            <div className={styles.itemTile} key={pdf.name}>
              <div className={styles.tileTop}>
                <div className={styles.tileIcon}>
                  <FileText size={21} />
                </div>
                <span>{pdf.size}</span>
              </div>
              <strong>{pdf.name}</strong>
              <p>{pdf.level} Resource</p>
              <div className={styles.tileFooter}>
                <button type="button" className={styles.ghostButton}>
                  Preview
                </button>
                <button type="button" className={styles.primaryButton}>
                  <Download size={15} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function CoursesSection() {
  return (
    <section className={styles.section}>
      <article className={styles.card}>
        <CardHeader
          icon={BookOpen}
          title="Available Courses"
          meta="Harmattan Semester 2026"
        />
        <div className={styles.itemGrid}>
          {courses.map((course) => (
            <div className={styles.itemTile} key={course.code}>
              <div className={styles.tileTop}>
                <div className={styles.tileIcon}>
                  <BookOpen size={21} />
                </div>
                <span>{course.credits} cr.</span>
              </div>
              <code>{course.code}</code>
              <strong>{course.title}</strong>
              <p>1st Semester · {course.credits} Credit Hours</p>
              <ProgressRow label="Course progress" value={course.progress} />
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function ResultsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.twoCol}>
        <article className={styles.card}>
          <CardHeader
            icon={GraduationCap}
            title="Academic Results"
            meta="Live-ready data"
          />
          <div className={styles.resultList}>
            {results.map((result) => (
              <div className={styles.resultRow} key={result.code}>
                <div>
                  <strong>{result.course}</strong>
                  <span>{result.code}</span>
                </div>
                <div className={styles.gradeChip}>
                  <div className={styles.scoreTrack}>
                    <span style={{ width: `${result.score}%` }} />
                  </div>
                  <b>{result.grade}</b>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className={styles.card}>
          <CardHeader icon={TrendingUp} title="Score Overview" />
          <div className={styles.scoreList}>
            {results.map((result) => (
              <ProgressRow
                key={result.code}
                label={result.code}
                value={result.score}
              />
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function PurchasesSection() {
  return (
    <section className={styles.section}>
      <article className={styles.card}>
        <CardHeader icon={ShoppingBag} title="Merch & Resources" />
        <div className={styles.itemGrid}>
          {purchases.map((item) => (
            <div className={styles.itemTile} key={item.name}>
              <div className={styles.tileTop}>
                <div className={styles.tileIcon}>
                  <ShoppingBag size={21} />
                </div>
                <span>{item.tag}</span>
              </div>
              <strong>{item.name}</strong>
              <p className={styles.price}>{item.price}</p>
              <button type="button" className={styles.primaryButton}>
                Add to Cart
                <ChevronRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function NotificationsSection() {
  return (
    <section className={styles.section}>
      <article className={styles.card}>
        <CardHeader icon={Bell} title="Notifications" meta="3 unread" />
        <div className={styles.notificationList}>
          {notifications.map((item, index) => (
            <div
              className={`${styles.notificationRow} ${index === 3 ? styles.readNotification : ""}`}
              key={item}
            >
              <span>
                <Bell size={16} />
              </span>
              <div>
                <strong>{item}</strong>
                <p>
                  {index === 0
                    ? "2 hours ago"
                    : index === 1
                      ? "Yesterday"
                      : `${index + 1} days ago`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: ElementType;
  label: string;
  value: string;
  sub: string;
  tone: "dark" | "green" | "mint" | "gold";
}) {
  return (
    <article className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[tone]}`}>
        <Icon size={22} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{sub}</p>
      </div>
    </article>
  );
}

function CardHeader({
  icon: Icon,
  title,
  meta,
}: {
  icon: ElementType;
  title: string;
  meta?: string;
}) {
  return (
    <header className={styles.cardHeader}>
      <h2>
        <span>
          <Icon size={17} />
        </span>
        {title}
      </h2>
      {meta ? <p>{meta}</p> : null}
    </header>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.progressRow}>
      <span>{label}</span>
      <div>
        <i style={{ width: `${value}%` }} />
      </div>
      <b>{value}%</b>
    </div>
  );
}
