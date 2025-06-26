import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Project.css";
import type { ProjectClass } from "../DataClasses/ProjectClass";
import { useDispatch, useSelector } from "react-redux";
import { addProjectTask, type ProjectStore } from "../store";
import { TaskProgressColors } from "../DataClasses/TaskClass";
import { Toolbar } from "../Toolbar/Toolbar";
import { useState } from "react";

export function Project() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  const projectInfo: ProjectClass | undefined = projectData.find(
    (p) => p.id === (location.state as string)
  );

  if (!projectInfo) {
    navigate("/")
    return <div>Project not found</div>;
  }

  const [project, _] = useState(projectInfo);

  function createNewTask() {
    let data: string | null | undefined = null;
    while (data === null) {
      data = prompt("Enter title of new task")?.trim();
      if (data === null || data === undefined) {
        return; // User cancelled
      } else if (data === "") {
        alert(`Task title cannot be empty`);
        data = null;
      } else {
        addProjectTask(project.id, data, dispatch);
      }
    }
  }

  return (
    <div className="main-window">
      <Toolbar />
      <div className="project-window">
        <div className="project-task-list">
          <h2>Project Task List</h2>
          <div className="project-task-list-only">
            {projectInfo?.tasks.map((task) => (
              <Link
                to={`/project/task/${task.id}`}
                state={task.id}
                key={task.id}
              >
                <button
                  className="project-task-item"
                  style={{
                    border: `2px solid ${TaskProgressColors[task.progress]}`,
                  }}
                >
                  {task.title}
                </button>
              </Link>
            ))}
          </div>
          <button className="add-task-button" onClick={createNewTask}>
            Add Task
          </button>
        </div>

        <div className="project-task-summary">
          <h2>Task Summary</h2>
        </div>
      </div>
    </div>
  );
}
