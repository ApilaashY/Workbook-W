import { Link, useLocation, useNavigate } from "react-router-dom";
import { TaskClass, TaskProgressColors } from "../DataClasses/TaskClass";
import "./Task.css";
import { useEffect, useState } from "react";
import type { ProjectClass } from "../DataClasses/ProjectClass";
import { useDispatch, useSelector } from "react-redux";
import { addTasks, updateTask, type ProjectStore } from "../store";
import { TaskProgressTypes } from "../DataClasses/TaskClass";
import { Toolbar } from "../Toolbar/Toolbar";

export function Task() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const project = location.state as string;
  let projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  const projectInfo: TaskClass | undefined = findTaskById(projectData, project);

  if (!projectInfo) {
    navigate("/")
    return <div>Project not found</div>;
  }

  const [task, setTask] = useState(projectInfo);

  useEffect(() => {
    const newTask = findTaskById(projectData, location.state as string);
    if (newTask !== undefined) {
      setTask(newTask);
    }
  }, [projectData, location.state]);

  function findTaskById(data: ProjectClass[], id: string): TaskClass {
    const idParts = id.split("-");
    let currentId: string = idParts[0];

    let currentData: ProjectClass | TaskClass | undefined = (
      data as ProjectClass[]
    ).find((project) => project.id === currentId);

    for (let i = 1; i < idParts.length; i++) {
      currentId += "-" + idParts[i];

      if (currentData === undefined) return new TaskClass("", "");
      else if (!currentData.id.includes("-")) {
        currentData = (currentData as ProjectClass).tasks.find(
          (task) => task.id === currentId
        );
      } else {
        currentData = (currentData as TaskClass).tasks.find(
          (subtask) => subtask.id === currentId
        );
      }
    }
    return currentData as TaskClass;
  }

  function editTaskInfo(category: "title" | "description", required: boolean) {
    let data: string | null = null;
    while (data === null) {
      data = prompt(`Enter new title ${category}`, task[category]);
      if (data === null) {
        return; // User cancelled
      } else if (required && data.trim() === "") {
        alert(`Task ${category} cannot be empty`);
        data = null;
      } else {
        updateTask(location.state, category, data, dispatch);
      }
    }
  }

  function createNewTask() {
    let data: string | null | undefined = null;
    while (data === null) {
      data = prompt("Enter title of new subtask")?.trim();
      if (data === null || data === undefined) {
        return; // User cancelled
      } else if (data === "") {
        alert(`Task title cannot be empty`);
        data = null;
      } else {
        dispatch(addTasks({ id: task.id, data: data }));
      }
    }
  }

  return (
    <div className="main-window">
      <Toolbar />
      <div className="task-window">
        <div className="task-stats">
          <h2
            onClick={() => editTaskInfo("title", true)}
            className="task-information-text"
          >
            {task.title}
          </h2>
          <h2
            onClick={() => editTaskInfo("description", false)}
            className="task-information-text"
          >
            {task.description.trim().length === 0
              ? "No Description"
              : task.description}
          </h2>

          <select value={task.progress} className="task-progress-select" onChange={(e) =>
            updateTask(location.state, "progress", e.target.value, dispatch)
          }
            style={{ backgroundColor: TaskProgressColors[task.progress], color: ((TaskProgressColors[task.progress].startsWith("#ff")) ? "black" : "white") }}>
            {
              TaskProgressTypes.map((progressOption) => <option value={progressOption} key={progressOption}>
                {progressOption}
              </option>)
            }
          </select>
        </div>

        <div className="task-subtask-list">
          <h2>Sub Tasks</h2>
          <div className="task-subtask-list-items">
            {task.tasks.map((subtask) => (
              <Link
                to={`/project/task/${subtask.id}`}
                state={subtask.id}
                key={subtask.id}
              >
                <button className="task-subtask-item" style={{
                  border: `2px solid ${TaskProgressColors[subtask.progress]}`
                }}>{subtask.title}</button>
              </Link>
            ))}</div>
          <button
            className="add-subtask-button"
            onClick={createNewTask}
          >
            Add Subtask
          </button>
        </div>
      </div>
    </div>
  );
}
