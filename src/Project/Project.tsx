import { Link, useLocation } from "react-router-dom";
import "./Project.css";
import type { ProjectObject } from "../DataClasses/ProjectClass";

export function Project() {
  const location = useLocation();
  const state = location.state as ProjectObject;

  console.log(state);

  return (
    <div className="project-window">
      <div className="project-task-list">
        <h2>Project Task List</h2>
        {state.tasks?.map((task) => (
          <Link to="/project/task" state={task} key={task.id}>
            <button className="project-task-item" onClick={() => {}}>
              {task.title}
            </button>
          </Link>
        ))}
      </div>

      <div className="project-task-summary">
        <h2>Task Summary</h2>
      </div>
    </div>
  );
}
