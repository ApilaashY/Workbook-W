import { Link, useLocation } from "react-router-dom";
import "./Project.css";
import type { ProjectClass } from "../DataClasses/ProjectClass";
import type { TaskClass } from "../DataClasses/TaskClass";
import { useSelector } from "react-redux";
import type { ProjectStore } from "../store";

export function Project({
  setTaskStack,
}: {
  setTaskStack: React.Dispatch<
    React.SetStateAction<(ProjectClass | TaskClass)[]>
  >;
}) {
  const location = useLocation();
  const project = location.state as string;
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  const projectInfo: ProjectClass | undefined = projectData.find(
    (p) => p.id === project
  );

  return (
    <div className="project-window">
      <div className="project-task-list">
        <h2>Project Task List</h2>
        {projectInfo?.tasks.map((task) => (
          <Link to={`/project/task/${task.id}`} state={task.id} key={task.id}>
            <button
              className="project-task-item"
              onClick={() => {
                setTaskStack([projectInfo]);
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
