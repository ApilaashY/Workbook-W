import Navbar from "@/lib/Components/Navbar/Navbar";
import Link from "next/link";
import "./resources.css";

export const metadata = {
  title: "Resources & Guides - Workbook",
  description:
    "Expert advice, guides, and tips on project management, team collaboration, and productivity.",
};

export default function Resources() {
  const articles = [
    {
      slug: "project-management-guide",
      title: "The Ultimate Guide to Project Management for Students",
      excerpt:
        "Learn how to juggle assignments, group projects, and extracurriculars with effective project management techniques designed for students.",
      tag: "Guides",
    },
    {
      slug: "remote-team-structure",
      title: "Why Remote Teams Need Structure: A Deep Dive",
      excerpt:
        "Discover why structure is the backbone of successful remote teams and how to implement it without stifling creativity.",
      tag: "Teamwork",
    },
    {
      slug: "productivity-tips",
      title: "5 Tips to Boost Productivity with Workbook",
      excerpt:
        "Maximize your efficiency and get more done in less time with these actionable tips for using Workbook.",
      tag: "Productivity",
    },
    // Future articles can be added here
  ];

  return (
    <>
      <Navbar />
      <div className="resources-container">
        <section className="resources-hero">
          <h1>Workbook Resources</h1>
          <p>
            Insights, guides, and tips to help you manage projects and collaborate
            better.
          </p>
        </section>

        <div className="articles-grid">
          {articles.map((article) => (
            <Link
              href={`/resources/${article.slug}`}
              key={article.slug}
              className="article-card-link"
              style={{ textDecoration: "none" }}
            >
              <article className="article-card">
                <div className="article-content">
                  <span className="article-tag">{article.tag}</span>
                  <h2 className="article-title">{article.title}</h2>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="read-more">
                    Read Article <span>→</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
