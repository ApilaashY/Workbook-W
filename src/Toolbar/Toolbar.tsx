import { Link } from "react-router-dom";
import "./Toolbar.css";
import { ProjectClass } from "../DataClasses/ProjectClass";
import type { TaskClass } from "../DataClasses/TaskClass";

export function Toolbar({
  taskStack,
  setTaskStack,
}: {
  taskStack: (ProjectClass | TaskClass)[];
  setTaskStack: React.Dispatch<
    React.SetStateAction<(ProjectClass | TaskClass)[]>
  >;
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-top-section">
        <Link to="/" onClick={() => setTaskStack([])}>
          <h2 className="toolbar-title">Projects</h2>
        </Link>
        {taskStack.map((item) => (
          <Link
            to={`/${item instanceof ProjectClass ? "project" : "task"}`}
            key={item.id}
          >
            <h2 className="toolbar-title">{item.title}</h2>
          </Link>
        ))}
      </div>
      <div className="toolbar-bottom-section">
        <h2 className="toolbar-title">Profile</h2>
        <h2 className="toolbar-title">Settings</h2>
      </div>
    </div>
  );
}
