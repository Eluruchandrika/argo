import  { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    else if (formData.message.length < 10)
      newErrors.message = "Message must be at least 10 characters.";

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simulate sending message
    console.log("Sending message:", formData);
    setSubmitted(true);

    // Reset form after submission
    setFormData({ name: "", email: "", subject: "", message: "" });
    setErrors({});
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 32 }}>Contact Us</h1>

      <div
        style={{
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* Contact Info */}
        <section
          style={{
            flex: "1 1 300px",
            border: "1px solid #ddd",
            padding: 24,
            borderRadius: 8,
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2 className="text-black">Get in Touch</h2>

          <p>
            We’d love to hear from you! Whether you have a question, feedback, or
            want to collaborate, reach out through any of the following:
          </p>

          <ul style={{ listStyle: "none", padding: 0, marginTop: 20, lineHeight: 1.8 }}>
            <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MapPin size={20} />
              <span>Ananthapur , India</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Phone size={20} />
              <a href="tel:+1234567890" style={{ color: "#0077cc", textDecoration: "none" }}>
                +91 7032525222
              </a>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Mail size={20} />
              <a href="mailto:support@yourdomain.com" style={{ color: "#0077cc", textDecoration: "none" }}>
                eluruchandrika12@gmail.com
              </a>
            </li>
          </ul>

          <div style={{ marginTop: 32 }}>
            <h3>Follow Us</h3>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              <a
                href="https://twitter.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                style={{ color: "#1DA1F2" }}
              >
                <Twitter size={28} />
              </a>
              <a
                href="https://facebook.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ color: "#1877F2" }}
              >
                <Facebook size={28} />
              </a>
              <a
                href="https://www.linkedin.com/in/chandrika-eluru/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: "#0A66C2" }}
              >
                <Linkedin size={28} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: "#E1306C" }}
              >
                <Instagram size={28} />
              </a>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section
          style={{
            flex: "1 1 500px",
            border: "1px solid #ddd",
            padding: 24,
            borderRadius: 8,
            backgroundColor: "#fff",
          }}
        >
          <h2 className="text-black">Send a Message</h2>
          {submitted && (
            <p
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                padding: 12,
                borderRadius: 4,
                marginBottom: 20,
                border: "1px solid #c3e6cb",
              }}
            >
              Thank you! Your message has been sent successfully.
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: 6, fontWeight: "bold", color:"black"}}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: errors.name ? "1px solid #dc3545" : "1px solid #ccc",
                marginBottom: errors.name ? 6 : 20,
              }}
              placeholder="Your full name"
            />
            {errors.name && (
              <small style={{ color: "#dc3545", marginBottom: 14, display: "block" }}>
                {errors.name}
              </small>
            )}

            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: 6, fontWeight: "bold" , color:"black"}}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: errors.email ? "1px solid #dc3545" : "1px solid #ccc",
                marginBottom: errors.email ? 6 : 20,
              }}
              placeholder="Your email address"
            />
            {errors.email && (
              <small style={{ color: "#dc3545", marginBottom: 14, display: "block" }}>
                {errors.email}
              </small>
            )}

            <label
              htmlFor="subject"
              style={{ display: "block", marginBottom: 6, fontWeight: "bold" , color:"black"}}
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: errors.subject ? "1px solid #dc3545" : "1px solid #ccc",
                marginBottom: errors.subject ? 6 : 20,
              }}
              placeholder="Brief subject"
            />
            {errors.subject && (
              <small style={{ color: "#dc3545", marginBottom: 14, display: "block" }}>
                {errors.subject}
              </small>
            )}

            <label
              htmlFor="message"
              style={{ display: "block", marginBottom: 6, fontWeight: "bold" , color:"black"}}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: errors.message ? "1px solid #dc3545" : "1px solid #ccc",
                marginBottom: errors.message ? 6 : 20,
                resize: "vertical",
              }}
              placeholder="Write your message here..."
            />
            {errors.message && (
              <small style={{ color: "#dc3545", marginBottom: 14, display: "block" }}>
                {errors.message}
              </small>
            )}

            <button
              type="submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                backgroundColor: "#0077cc",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 16,
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005fa3")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0077cc")}
            >
              Send Message <Send size={20} />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
