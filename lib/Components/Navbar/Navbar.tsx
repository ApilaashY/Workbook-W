import Link from "next/link";
import AuthNav from "../AuthNav";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav>
      <Link className="nav-name" href="/">
        Workbook
      </Link>

      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/resources">Resources</Link>
        <Link href="/contact">Contact</Link>

        <AuthNav />
      </div>
    </nav>
  );
}
