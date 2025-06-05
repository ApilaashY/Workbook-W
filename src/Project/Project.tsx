import { Link, useLocation } from "react-router-dom";
import "./Project.css";
import type { ProjectClass } from "../DataClasses/ProjectClass";
import type { TaskClass } from "../DataClasses/TaskClass";

export function Project({
  setTaskStack,
}: {
  setTaskStack: React.Dispatch<
    React.SetStateAction<(ProjectClass | TaskClass)[]>
  >;
}) {
  const location = useLocation();
  const project = location.state as ProjectClass;

  return (
    <div className="project-window">
      <div className="project-task-list">
        <h2>Project Task List</h2>
        {project.tasks.map((task) => (
          <Link to={`/project/task/${task.id}`} state={task} key={task.id}>
            <button
              className="project-task-item"
              onClick={() => {
                setTaskStack([project]);
              }}
            >
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
