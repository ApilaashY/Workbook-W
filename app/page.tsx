import Link from "next/link";
import "./home.css";
import AuthNav from "@/lib/Components/AuthNav";

export default function Home() {
  return (
    <>
      <nav>
        <Link className="nav-name" href="/">
          Workbook
        </Link>

        <div className="nav-links">
          <Link href="/">Home</Link>
          {/* <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link> */}

          <AuthNav />
        </div>
      </nav>

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
        <h1>Ready to get started?</h1>
        <p>Join many people already using Workbook to manage their projects</p>
        <Link href="/signup" className="styled-button">
          Create a Free Account
        </Link>
      </div>
    </>
  );
}
