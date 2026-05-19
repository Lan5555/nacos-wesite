import styles from "./Footer.module.css";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Resources", href: "#resources" },
  { label: "Excos", href: "#excos" },
  { label: "Updates", href: "#updates" },
  { label: "Results", href: "#results" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
  { label: "Privacy", href: "#" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo}>
          <span className={styles.logoNac}>NAC</span>
          <span className={styles.logoOs}>OS</span>
          <span className={styles.logoNig}> Nigeria</span>
        </a>

        <nav className={styles.links}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
        </nav>

        <p className={styles.copy}>© 2025 NACOS Nigeria. All rights reserved.</p>
      </div>
    </footer>
  );
}
