import Navbar from "@/lib/Components/Navbar/Navbar";
import "./contact.css";

export const metadata = {
  title: "Contact Us - Workbook",
  description:
    "Get in touch with the Workbook team for support, feedback, or business inquiries.",
};

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="contact-container">
        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p className="subtitle">
            We'd love to hear from you. Reach out with any questions, feedback,
            or concerns.
          </p>
        </section>

        <div className="contact-content">
          <section className="contact-info">
            <h2>Get in Touch</h2>

            <div className="contact-method">
              <h3>📧 Email Support</h3>
              <p>
                For general inquiries, support, or feedback:
                <br />
                <a href="mailto:apilaashy@gmail.com">
                  apilaashy@gmail.com
                </a>
              </p>
            </div>

            <div className="contact-method">
              <h3>🐛 Bug Reports</h3>
              <p>
                Found a bug? Help us improve by reporting it:
                <br />
                <a href="mailto:apilaashy@gmail.com?subject=Bug Report">
                  Report a Bug
                </a>
              </p>
            </div>

            <div className="contact-method">
              <h3>💡 Feature Requests</h3>
              <p>
                Have an idea for a new feature?
                <br />
                <a href="mailto:apilaashy@gmail.com?subject=Feature Request">
                  Suggest a Feature
                </a>
              </p>
            </div>

            <div className="contact-method">
              <h3>🤝 Business Inquiries</h3>
              <p>
                Interested in partnerships or business opportunities?
                <br />
                <a href="mailto:apilaashy@gmail.com?subject=Business Inquiry">
                  Contact for Business
                </a>
              </p>
            </div>
          </section>

          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>

            <div className="faq-item">
              <h3>How quickly will I receive a response?</h3>
              <p>
                We aim to respond to all inquiries within 24-48 hours during
                business days. For urgent issues, please mark your email as high
                priority.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is Workbook free to use?</h3>
              <p>
                Yes! Workbook offers a free tier with core project management
                features. We also offer premium plans with additional features
                for power users and teams.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do I reset my password?</h3>
              <p>
                Visit the <a href="/forgot-password">Forgot Password</a> page
                and enter your email address. You'll receive instructions to
                reset your password.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I use Workbook for team collaboration?</h3>
              <p>
                Absolutely! Workbook is designed for both individual use and
                team collaboration. You can invite team members to your projects
                and work together in real-time.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is my data secure?</h3>
              <p>
                Yes. We use industry-standard encryption and security practices
                to protect your data. Read our{" "}
                <a href="/privacy">Privacy Policy</a> for more details.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>
                We offer a 30-day money-back guarantee for all paid plans. If
                you're not satisfied, contact us for a full refund.
              </p>
            </div>
          </section>
        </div>

        <section className="additional-resources">
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <a href="/about" className="resource-card">
              <h3>📖 About Us</h3>
              <p>Learn more about Workbook and our mission</p>
            </a>
            <a href="/privacy" className="resource-card">
              <h3>🔒 Privacy Policy</h3>
              <p>How we protect your personal information</p>
            </a>
            <a href="/terms" className="resource-card">
              <h3>📄 Terms of Service</h3>
              <p>Our terms and conditions for using Workbook</p>
            </a>
            <a href="/app?sample=true" className="resource-card">
              <h3>🎮 Try Demo</h3>
              <p>Test drive Workbook with sample data</p>
            </a>
          </div>
        </section>

        <section className="contact-cta">
          <h2>Ready to get started?</h2>
          <p>Join thousands using Workbook to manage their projects</p>
          <a href="/signup" className="styled-button">
            Create Free Account
          </a>
        </section>
      </div>
    </>
  );
}
