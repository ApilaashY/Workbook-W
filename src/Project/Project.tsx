import { Link, useNavigate, useParams } from "react-router-dom";
import "./Project.css";
import type { ProjectClass } from "../DataClasses/ProjectClass";
import { useDispatch, useSelector } from "react-redux";
import { addProjectTask, type ProjectStore } from "../store";
import { TaskClass, TaskProgressColors, TaskProgressTypes, type TaskProgress } from "../DataClasses/TaskClass";
import { Toolbar } from "../Toolbar/Toolbar";
import { useEffect, useRef, useState } from "react";

export function Project() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [progressStatProperty, setProgressStatProperty] = useState<string>("Done");
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );
  const goBack = useRef(false);

  const projectInfo: ProjectClass | undefined = projectData.find(
    (p) => p.id === id
  );

  useEffect(() => {
    if (goBack.current) navigate("/");
  }, [goBack.current])

  if (!projectInfo) {
    goBack.current = true;
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

  function countTasks(level: ProjectClass | TaskClass): number {
    return level.tasks.length + level.tasks.map((task) => countTasks(task)).reduce((total, x) => total + x, 0);
  }

  function countProperty(level: ProjectClass | TaskClass, property: TaskProgress): number {
    let count: number = 0;
    level.tasks.forEach((task) => {
      if (task.progress == property) count++;
      count += countProperty(task, property);
    })
    return count;
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
          <div style={{ display: "flex", alignItems: "center", margin: "0 0.5em" }}>
            <h3 style={{ margin: 0 }}>{countProperty(project, progressStatProperty)}/{countTasks(project)}</h3>
            <select value={progressStatProperty} className="progress-stat-select"
              onChange={(e) => setProgressStatProperty(e.target.value)}
              style={{ backgroundColor: TaskProgressColors[progressStatProperty], color: ((TaskProgressColors[progressStatProperty].startsWith("#ff")) ? "black" : "white") }}>
              {
                TaskProgressTypes.map((progressOption) => <option value={progressOption} key={progressOption}>
                  {progressOption}
                </option>)
              }
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
