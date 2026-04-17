import Link from "next/link";
import "./home.css";
import Navbar from "@/lib/Components/Navbar/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="starter">
        <div className="starter-content">
          <div className="starter-text">
            <h1>
              Manage Projects Like a <span className="highlight">Pro</span>
            </h1>
            <p>
              Streamline your workflow, collaborate with your team, and deliver
              projects on time with an intuitive project management platform.
            </p>
            <Link href="/signup" className="styled-button">
              Get Started
            </Link>
          </div>
          <div className="hero-image">
            <div className="mockup-browser">
              <div className="browser-bar">
                <div className="browser-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="browser-content">
                <div className="project-card-demo">
                  <h3>Sample Project</h3>
                  <div className="task-demo">
                    <div className="task-item">✓ Design wireframes</div>
                    <div className="task-item">⏳ Develop frontend</div>
                    <div className="task-item">⏳ Backend integration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <h2>Everything you need to succeed</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Task Management</h3>
            <p>Organize tasks, set deadlines, and track progress.</p>
          </div>
          <div className="feature-item">
            <h3>Collaboration Tools</h3>
            <p>Work together with your team in real-time.</p>
          </div>
          <div className="feature-item">
            <h3>Dynamic Structure</h3>
            <p>Customize your project structure to fit your needs.</p>
          </div>
        </div>
      </div>

      <div className="cta">
        <h2>Ready to get started?</h2>
        <p>Join many people already using Workbook to manage their projects</p>
        <Link href="/signup" className="styled-button">
          Create a Free Account
        </Link>
      </div>

      <div
        className="features"
        style={{ background: "var(--bubbleBackgroundColor)" }}
      >
        <h2>How Workbook Works</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>1. Create Projects</h3>
            <p>
              Start by creating projects for your work, school, or personal
              goals. Organize everything in one place.
            </p>
          </div>
          <div className="feature-item">
            <h3>2. Add Tasks</h3>
            <p>
              Break down projects into manageable tasks. Set deadlines,
              priorities, and dependencies.
            </p>
          </div>
          <div className="feature-item">
            <h3>3. Collaborate</h3>
            <p>
              Invite team members, assign tasks, and work together in real-time
              to achieve your goals.
            </p>
          </div>
        </div>
      </div>

      <div className="features">
        <h2>Why Choose Workbook?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>🆓 Free to Start</h3>
            <p>
              Get started with our generous free tier. No credit card required.
              Upgrade only when you need more features.
            </p>
          </div>
          <div className="feature-item">
            <h3>⚡ Lightning Fast</h3>
            <p>
              Built with modern technology for instant loading and real-time
              updates. No more waiting around.
            </p>
          </div>
          <div className="feature-item">
            <h3>🔒 Secure & Private</h3>
            <p>
              Your data is encrypted and protected with enterprise-grade
              security. We take privacy seriously.
            </p>
          </div>
          <div className="feature-item">
            <h3>📱 Works Everywhere</h3>
            <p>
              Access your projects from any device - desktop, tablet, or mobile.
              Your work is always with you.
            </p>
          </div>
          <div className="feature-item">
            <h3>👥 Built for Teams</h3>
            <p>
              Collaborate seamlessly with team members. Share projects, assign
              tasks, and track progress together.
            </p>
          </div>
          <div className="feature-item">
            <h3>🎨 Customizable</h3>
            <p>
              Organize your way with flexible project structures. Create nested
              tasks and customize to fit your workflow.
            </p>
          </div>
        </div>
      </div>

      <footer
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          borderTop: "1px solid var(--borderColor)",
          marginTop: "4rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
            }}
          >
            <Link
              href="/about"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              About
            </Link>
            <Link
              href="/privacy"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              Terms of Service
            </Link>
            <Link
              href="/resources"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              Resources
            </Link>
            <Link
              href="/contact"
              style={{ color: "var(--primary)", textDecoration: "none" }}
            >
              Contact
            </Link>
          </div>
          <p style={{ color: "var(--secondaryText)", margin: "0" }}>
            © 2025 Workbook. All rights reserved. Built by Apilaash Yoharan.
          </p>
        </div>
      </footer>
    </>
  );
}
