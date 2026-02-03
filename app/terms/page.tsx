import Navbar from "@/lib/Components/Navbar/Navbar";
import "../privacy/privacy.css";

export const metadata = {
  title: "Terms of Service - Workbook",
  description:
    "Read Workbook's terms of service to understand the rules and guidelines for using our project management platform.",
};

export default function Terms() {
  return (
    <>
      <Navbar />
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: November 28, 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Workbook ("the Service"), you accept and
            agree to be bound by these Terms of Service ("Terms"). If you do not
            agree to these Terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            Workbook is a web-based project management platform that allows
            users to create, organize, and collaborate on projects and tasks.
            The Service includes features such as task management, team
            collaboration, progress tracking, and project organization.
          </p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <h3>3.1 Account Creation</h3>
          <p>
            To use certain features of the Service, you must create an account.
            You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Keep your password secure and confidential</li>
            <li>
              Notify us immediately of any unauthorized use of your account
            </li>
            <li>Be responsible for all activities under your account</li>
          </ul>

          <h3>3.2 Account Eligibility</h3>
          <p>
            You must be at least 13 years old to use the Service. By creating an
            account, you represent that you meet this age requirement.
          </p>
        </section>

        <section>
          <h2>4. User Content and Conduct</h2>
          <h3>4.1 Your Content</h3>
          <p>
            You retain ownership of all content you create, upload, or share
            through the Service ("User Content"). By uploading User Content, you
            grant us a license to store, process, and display your content
            solely for the purpose of providing the Service.
          </p>

          <h3>4.2 Prohibited Conduct</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Upload malicious code, viruses, or harmful content</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Scrape, crawl, or use automated tools without permission</li>
            <li>Use the Service to send spam or unsolicited communications</li>
          </ul>
        </section>

        <section>
          <h2>5. Intellectual Property</h2>
          <h3>5.1 Our Rights</h3>
          <p>
            The Service and its original content, features, and functionality
            are owned by Workbook and are protected by copyright, trademark, and
            other intellectual property laws.
          </p>

          <h3>5.2 Feedback</h3>
          <p>
            If you provide us with feedback or suggestions about the Service, we
            may use that feedback without any obligation to you.
          </p>
        </section>

        <section>
          <h2>6. Subscription and Payment</h2>
          <h3>6.1 Free and Paid Plans</h3>
          <p>
            We offer both free and paid subscription plans. The features
            available to you depend on your subscription level.
          </p>

          <h3>6.2 Billing</h3>
          <p>
            For paid subscriptions, you agree to pay all fees associated with
            your plan. Fees are billed in advance on a recurring basis (monthly
            or annually) and are non-refundable except as required by law.
          </p>

          <h3>6.3 Changes to Pricing</h3>
          <p>
            We reserve the right to modify our pricing with at least 30 days'
            notice. Continued use of the Service after price changes constitutes
            acceptance of the new pricing.
          </p>
        </section>

        <section>
          <h2>7. Privacy and Data Protection</h2>
          <p>
            Your use of the Service is also governed by our{" "}
            <a href="/privacy">Privacy Policy</a>, which explains how we
            collect, use, and protect your personal information.
          </p>
        </section>

        <section>
          <h2>8. Termination</h2>
          <h3>8.1 By You</h3>
          <p>
            You may stop using the Service and delete your account at any time.
          </p>

          <h3>8.2 By Us</h3>
          <p>
            We reserve the right to suspend or terminate your account if you
            violate these Terms or engage in conduct that we deem harmful to the
            Service or other users. We will provide notice when reasonably
            possible.
          </p>
        </section>

        <section>
          <h2>9. Disclaimers and Limitations of Liability</h2>
          <h3>9.1 Service "As Is"</h3>
          <p>
            The Service is provided "as is" and "as available" without
            warranties of any kind, either express or implied, including but not
            limited to warranties of merchantability, fitness for a particular
            purpose, or non-infringement.
          </p>

          <h3>9.2 Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, Workbook shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenues, whether incurred
            directly or indirectly, or any loss of data, use, goodwill, or other
            intangible losses resulting from:
          </p>
          <ul>
            <li>Your use or inability to use the Service</li>
            <li>Any unauthorized access to or use of our servers</li>
            <li>Any interruption or cessation of the Service</li>
            <li>Any bugs, viruses, or other harmful code</li>
            <li>Any errors or omissions in any content</li>
          </ul>
        </section>

        <section>
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Workbook and its affiliates
            from any claims, damages, losses, liabilities, and expenses
            (including legal fees) arising from your use of the Service or
            violation of these Terms.
          </p>
        </section>

        <section>
          <h2>11. Data Backup and Loss</h2>
          <p>
            While we implement backup systems, you are responsible for
            maintaining your own backup copies of your content. We are not
            liable for any loss or corruption of your data.
          </p>
        </section>

        <section>
          <h2>12. Modifications to the Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of
            the Service at any time, with or without notice. We will not be
            liable for any modification, suspension, or discontinuation of the
            Service.
          </p>
        </section>

        <section>
          <h2>13. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of
            significant changes by posting the new Terms on this page and
            updating the "Last Updated" date. Continued use of the Service after
            changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2>14. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            applicable laws. Any disputes arising from these Terms or the
            Service shall be resolved through binding arbitration, except where
            prohibited by law.
          </p>
        </section>

        <section>
          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or
            invalid, that provision shall be limited or eliminated to the
            minimum extent necessary, and the remaining provisions shall remain
            in full force and effect.
          </p>
        </section>

        <section>
          <h2>16. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:apilaashy@gmail.com">
              apilaashy@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h2>17. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire
            agreement between you and Workbook regarding the use of the Service.
          </p>
        </section>
      </div>
    </>
  );
}
