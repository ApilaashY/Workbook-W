import Navbar from "@/lib/Components/Navbar/Navbar";
import "./about.css";

export const metadata = {
  title: "About Workbook - Project Management Made Simple",
  description:
    "Learn about Workbook, the intuitive project management platform designed for students, teams, and organizers. Discover our mission and features.",
};

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <section className="about-hero">
          <h1>About Workbook</h1>
          <p className="subtitle">
            Empowering teams and individuals to manage projects efficiently
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Workbook was created to provide an intuitive, flexible project
            management solution for students, teams, and organizers. We believe
            that project management tools should be simple, powerful, and
            accessible to everyone.
          </p>
          <p>
            Our platform helps you organize tasks, collaborate with team
            members, and track progress in real-time, making it easier to
            deliver projects on time and within scope.
          </p>
        </section>

        <section className="about-section">
          <h2>What Makes Workbook Different</h2>
          <div className="features-grid">
            <div className="feature-box">
              <h3>🎯 Intuitive Interface</h3>
              <p>
                Clean, modern design that makes project management enjoyable
                rather than overwhelming.
              </p>
            </div>
            <div className="feature-box">
              <h3>🔄 Real-Time Collaboration</h3>
              <p>
                Work together with your team seamlessly with live updates and
                instant synchronization.
              </p>
            </div>
            <div className="feature-box">
              <h3>📊 Dynamic Structure</h3>
              <p>
                Customize your project structure with unlimited nested tasks to
                fit any workflow.
              </p>
            </div>
            <div className="feature-box">
              <h3>🚀 Built for Speed</h3>
              <p>
                Optimized performance ensures your projects load quickly and
                respond instantly.
              </p>
            </div>
            <div className="feature-box">
              <h3>💡 Smart Features</h3>
              <p>
                Track progress, set priorities, add dependencies, and manage
                deadlines effortlessly.
              </p>
            </div>
            <div className="feature-box">
              <h3>🔒 Secure & Reliable</h3>
              <p>
                Your data is protected with enterprise-grade security and
                real-time backups.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Who We Serve</h2>
          <p>
            Workbook is designed for a wide range of users, from students
            managing school projects to professional teams coordinating complex
            initiatives:
          </p>
          <ul>
            <li>
              <strong>Students:</strong> Organize assignments, group projects,
              and study schedules
            </li>
            <li>
              <strong>Teams:</strong> Collaborate on development, marketing, and
              business projects
            </li>
            <li>
              <strong>Educators:</strong> Track class projects and student
              progress
            </li>
            <li>
              <strong>Freelancers:</strong> Manage multiple client projects and
              deadlines
            </li>
            <li>
              <strong>Event Organizers:</strong> Plan and execute events with
              detailed task breakdowns
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Technology</h2>
          <p>
            Workbook is built using modern web technologies to ensure a fast,
            reliable, and scalable experience:
          </p>
          <ul>
            <li>React and Next.js for optimal performance and SEO</li>
            <li>Firebase for real-time data synchronization</li>
            <li>Cloud infrastructure for reliability and scalability</li>
            <li>Progressive Web App (PWA) support for offline access</li>
          </ul>
        </section>

        <section className="about-section cta-section">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of users who are already managing their projects more
            effectively with Workbook.
          </p>
          <a href="/signup" className="styled-button">
            Create Free Account
          </a>
        </section>
      </div>
    </>
  );
}
