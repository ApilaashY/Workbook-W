import Navbar from "@/lib/Components/Navbar/Navbar";
import "./privacy.css";

export const metadata = {
  title: "Privacy Policy - Workbook",
  description:
    "Read Workbook's privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function Privacy() {
  return (
    <>
      <Navbar />
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 28, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Workbook (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to
            protecting your personal information and your right to privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our project management platform.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <p>
            We collect information that you voluntarily provide to us when you:
          </p>
          <ul>
            <li>Register for an account (email address, name, password)</li>
            <li>Create and manage projects and tasks</li>
            <li>Invite team members or collaborators</li>
            <li>Contact us for support or feedback</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you access our service, we automatically collect:</p>
          <ul>
            <li>Device information (browser type, operating system)</li>
            <li>Usage data (pages visited, features used, time spent)</li>
            <li>IP address and general location information</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions and send notifications</li>
            <li>Enable collaboration features with team members</li>
            <li>Respond to your comments, questions, and support requests</li>
            <li>
              Send administrative information, updates, and security alerts
            </li>
            <li>
              Monitor and analyze usage patterns to improve user experience
            </li>
            <li>
              Detect, prevent, and address technical issues and security threats
            </li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>4. Information Sharing and Disclosure</h2>
          <p>
            We do not sell your personal information. We may share information
            in the following circumstances:
          </p>
          <ul>
            <li>
              <strong>With Team Members:</strong> Project and task information
              is shared with collaborators you invite
            </li>
            <li>
              <strong>Service Providers:</strong> We use third-party services
              (Firebase, Google Analytics) to operate our platform
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights and safety
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger,
              acquisition, or sale of assets
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. This includes:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Secure authentication mechanisms</li>
            <li>Regular security assessments</li>
            <li>Access controls and monitoring</li>
          </ul>
          <p>
            However, no method of transmission over the Internet is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>6. Your Privacy Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>
              <strong>Access:</strong> Request a copy of your personal
              information
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate data
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal
              information
            </li>
            <li>
              <strong>Portability:</strong> Request transfer of your data
            </li>
            <li>
              <strong>Opt-Out:</strong> Unsubscribe from marketing
              communications
            </li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information
            provided below.
          </p>
        </section>

        <section>
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience,
            analyze usage, and assist in our marketing efforts. You can control
            cookie settings through your browser preferences.
          </p>
        </section>

        <section>
          <h2>8. Third-Party Services</h2>
          <p>Our service integrates with third-party services including:</p>
          <ul>
            <li>
              <strong>Firebase:</strong> For authentication, database, and
              hosting
            </li>
            <li>
              <strong>Google Analytics:</strong> For usage analytics
            </li>
            <li>
              <strong>Google AdSense:</strong> For displaying advertisements
            </li>
          </ul>
          <p>
            These services have their own privacy policies, and we encourage you
            to review them.
          </p>
        </section>

        <section>
          <h2>9. Data Retention</h2>
          <p>
            We retain your personal information only as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law.
          </p>
        </section>

        <section>
          <h2>10. Children's Privacy</h2>
          <p>
            Our service is not intended for users under the age of 13. We do not
            knowingly collect personal information from children under 13. If
            you become aware that a child has provided us with personal
            information, please contact us.
          </p>
        </section>

        <section>
          <h2>11. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries
            other than your own. We ensure appropriate safeguards are in place
            to protect your information in accordance with this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last Updated&quot; date.
          </p>
        </section>

        <section>
          <h2>13. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please
            contact us at:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:apilaashy@gmail.com">
              apilaashy@gmail.com
            </a>
          </p>
        </section>
      </div>
    </>
  );
}
