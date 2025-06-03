import { Link } from "react-router-dom";
import "./Toolbar.css";

export function Toolbar() {
  return (
    <div className="toolbar">
      <div className="toolbar-top-section">
        <Link to="/">
          <h2 className="toolbar-title">Projects</h2>
        </Link>
      </div>
      <div className="toolbar-bottom-section">
        <h2 className="toolbar-title">Profile</h2>
        <h2 className="toolbar-title">Settings</h2>
      </div>
    </div>
  );
}
