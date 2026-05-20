"use client";

import { motion } from "framer-motion";
import { Clock, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { FaFacebook, FaTelegram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import CoreService from "@/app/hooks/core-service";
import styles from "./Contact.module.css";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85 },
  },
};

const itemFade = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const service = new CoreService();

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await service.send("contact/send-email", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

      if (result.success) {
        setSubmitted(true);
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setError(result.message || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const socials = [
    { icon: <FaXTwitter size={16} />, label: "Twitter" },
    { icon: <FaFacebook size={16} />, label: "Facebook" },
    { icon: <FaYoutube size={16} />, label: "YouTube" },
    { icon: <FaTelegram size={16} />, label: "Telegram" },
    { icon: <Mail size={16} />, label: "Email" },
  ];

  const infoItems = [
    {
      icon: <MapPin size={18} />,
      label: "Address",
      value: "NACOS Secretariat, Dept. of Computer Science, University of Jos",
    },
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: "info@nacosnigeria.org.ng",
    },
    {
      icon: <Phone size={18} />,
      label: "Phone",
      value: "+234 803 000 1234",
    },
    {
      icon: <Clock size={18} />,
      label: "Office Hours",
      value: "Monday – Friday, 9AM – 5PM WAT",
    },
  ];

  return (
    <motion.section
      className={styles.contact}
      id="contact"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionReveal}
    >
      <div className={styles.inner}>
        {/* Left */}
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85 }}
        >
          <div className={styles.badge}>GET IN TOUCH</div>
          <h2 className={styles.heading}>
            Contact <span className={styles.green}>NACOS</span>
          </h2>
          <p className={styles.subtext}>
            Questions, partnerships, or feedback — we&apos;d love to hear from
            you.
          </p>

          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="firstName" className={styles.label}>
                First Name
              </label>
              <input
                id="firstName"
                className={styles.input}
                type="text"
                name="firstName"
                placeholder="Emeka"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name
              </label>
              <input
                id="lastName"
                className={styles.input}
                type="text"
                name="lastName"
                placeholder="Okafor"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              name="email"
              placeholder="emeka@university.edu.ng"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="subject" className={styles.label}>
              Subject
            </label>
            <input
              id="subject"
              className={styles.input}
              type="text"
              name="subject"
              placeholder="General Enquiry"
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <textarea
              id="message"
              className={styles.textarea}
              name="message"
              placeholder="Type your message here..."
              value={form.message}
              onChange={handleChange}
              rows={5}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {submitted && (
            <p className={styles.success}>
              Message sent successfully! We&apos;ll get back to you soon.
            </p>
          )}

          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={15} className={styles.spinner} /> Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </motion.div>

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.1 }}
        >
          <h3 className={styles.hqTitle}>NACOS Headquarters</h3>

          <div className={styles.infoList}>
            {infoItems.map((item, i) => (
              <motion.div
                key={item.label}
                className={styles.infoItem}
                variants={itemFade}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.06 }}
              >
                <div className={styles.infoIcon}>{item.icon}</div>
                <div>
                  <div className={styles.infoLabel}>{item.label}</div>
                  <div className={styles.infoValue}>{item.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.socials}>
            {socials.map((s) => (
              <motion.button
                key={s.label}
                className={styles.socialBtn}
                aria-label={s.label}
                whileHover={{ y: -2, scale: 1.02 }}
                transition={{ duration: 0.25 }}
              >
                {s.icon}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;
