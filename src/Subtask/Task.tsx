import { Link, useLocation, useParams } from "react-router-dom";
import { TaskClass } from "../DataClasses/TaskClass";
import "./Task.css";
import { useEffect, useState } from "react";
import type { ProjectClass } from "../DataClasses/ProjectClass";
import { useDispatch, useSelector } from "react-redux";
import type { ProjectStore } from "../store";

export function Task({
  setTaskStack,
}: {
  setTaskStack: React.Dispatch<
    React.SetStateAction<(ProjectClass | TaskClass)[]>
  >;
}) {
  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();
  const project = location.state as string;
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  const projectInfo: TaskClass | undefined = findTaskById(projectData, project);

  if (!projectInfo) {
    return <div>Project not found</div>;
  }

  const [task, setTask] = useState(projectInfo);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newTask = findTaskById(projectData, location.state as string);
    if (newTask !== undefined) {
      setTask(newTask);
      setProgress(0);
    }
  }, [location.state, params.id]);

  function findTaskById(
    data: ProjectClass[],
    id: string
  ): TaskClass | undefined {
    const idParts = id.split("-");
    let currentId: string = idParts[0];

    let currentData: ProjectClass | TaskClass | undefined = (
      data as ProjectClass[]
    ).find((project) => project.id === currentId);

    for (let i = 1; i < idParts.length; i++) {
      currentId += "-" + idParts[i];

      if (currentData === undefined) return undefined;
      else if (!currentData.id.includes("-")) {
        currentData = (currentData as ProjectClass).tasks.find(
          (task) => task.id === currentId
        );
      } else {
        currentData = (currentData as TaskClass).subtasks.find(
          (subtask) => subtask.id === currentId
        );
      }
    }
    return currentData as TaskClass | undefined;
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
        if (category === "title") {
          const newTask = TaskClass.fromMap({
            ...task,
            title: data,
          });
          setTask(newTask); // Update the task title in state
        } else if (category === "description") {
          const newTask = TaskClass.fromMap({
            ...task,
            description: data,
          });
          setTask(newTask); // Update the task description in state
        }
        task[category] = data; // Update the task title
      }
    }
  }

  function calculateColor(progress: number): string {
    if (progress <= 50) {
      const red = 255 * (1 - progress / 50) + 255 * (progress / 50);
      const green = 0 * (1 - progress / 50) + 255 * (progress / 50);

      return `rgb(${red}, ${green}, 0)`;
    }
    const red = 255 * (1 - (progress - 50) / 50) + 0 * ((progress - 50) / 50);
    const green =
      255 * (1 - (progress - 50) / 50) + 255 * ((progress - 50) / 50);

    return `rgb(${red}, ${green}, 0)`;
  }

  return (
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
        <label>
          <h2>Progress: {progress}%</h2>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={{ width: "100%", accentColor: calculateColor(progress) }}
          />
        </label>
      </div>

      <div className="task-subtask-list">
        <h2>Sub Tasks</h2>
        <button
          onClick={() => {
            // Replace 'updateTaskAction' with your actual action creator
            dispatch({
              type: "updateTasks",
              payload: { id: task.id, data: "new sub" },
            });
            setTask(
              TaskClass.fromMap({
                ...task,
              })
            );
          }}
        >
          Add Subtask
        </button>
        {task.subtasks.map((subtask) => (
          <Link
            to={`/project/task/${subtask.id}`}
            state={subtask.id}
            key={subtask.id}
            onClick={() => {
              setTaskStack((prevStack) => [...prevStack, subtask]);
            }}
          >
            <button className="project-task-item">{subtask.title}</button>
          </Link>
        ))}
      </div>
    </div>
  );
}
