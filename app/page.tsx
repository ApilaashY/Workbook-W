import Link from "next/link";
import "./home.css";

export default function Home() {
  return (
    <>
      <nav>
        <h1>Workbook</h1>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Register</Link>
          <Link href="/app">Dashboard</Link>
        </div>
      </nav>

      <div className="starter">
        <div className="starter-content">
          <h1>
            Manage Projects Like a <span className="highlight">Pro</span>
          </h1>
          <p>
            Streamline your workflow, collaborate with your team, and deliver
            projects on time with an intuitive project management platform.
          </p>
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
    </>
  );
}
