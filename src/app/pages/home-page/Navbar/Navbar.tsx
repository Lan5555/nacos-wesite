"use client";
import { useState } from "react";
import styles from "./Navbar.module.css";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const navLinks = ["About", "Resources", "Excos", "Updates", "Results", "Events", "Contact"];

  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={styles.inner}>
        {/* Logo */}
        <a href="#" className={styles.logo}>
          <span className={styles.logoIcon}>N</span>
          <span className={styles.logoText}>
            <span className={styles.na}>NAC</span>
            <span className={styles.cos}>OS</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {navLinks.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} className={styles.navLink}>
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className={styles.navActions}>
          <button className={styles.signIn} onClick={() => {
            router.push('/pages/login')

          }}>Sign In</button>
          <button className={styles.portal} onClick={() => router.push('/pages/student')}>Student Portal →</button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? styles.barOpen : styles.bar} />
          <span className={menuOpen ? styles.barOpen : styles.bar} />
          <span className={menuOpen ? styles.barOpen : styles.bar} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link}
            </a>
          ))}
          <div className={styles.mobileActions}>
            <button className={styles.signIn}>Sign In</button>
            <button className={styles.portal}>Student Portal →</button>
          </div>
        </div>
      )}
    </motion.nav>
  );
}

export default Navbar;
