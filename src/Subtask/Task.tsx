import { Link, useLocation, useParams } from "react-router-dom";
import { TaskClass } from "../DataClasses/TaskClass";
import "./Task.css";
import { useEffect, useState } from "react";
import type { ProjectClass } from "../DataClasses/ProjectClass";

export function Task({
  setTaskStack,
}: {
  setTaskStack: React.Dispatch<
    React.SetStateAction<(ProjectClass | TaskClass)[]>
  >;
}) {
  const location = useLocation();
  const params = useParams();

  const [task, setTask] = useState(TaskClass.fromMap(location.state));
  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [progress, setProgress] = useState(0);
  const [subtasks, setSubtasks] = useState(task.subtasks);

  useEffect(() => {
    const newTask = location.state;
    setTask(newTask);
    setTaskTitle(newTask.title);
    setTaskDescription(newTask.description);
    setSubtasks(newTask.subtasks);
    setProgress(0);
  }, [location.state, params.id]);

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
          setTaskTitle(data); // Update the task title in state
        } else if (category === "description") {
          setTaskDescription(data); // Update the task description in state
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
          {taskTitle}
        </h2>
        <h2
          onClick={() => editTaskInfo("description", false)}
          className="task-information-text"
        >
          {taskDescription.trim().length === 0
            ? "No Description"
            : taskDescription}
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
          onClick={() =>
            setSubtasks((previousTasks) => [
              ...previousTasks,
              new TaskClass(
                "new sub",
                task.id + "-" + TaskClass.getTaskCount(task)
              ),
            ])
          }
        >
          Add Subtask
        </button>
        {subtasks.map((subtask) => (
          <Link
            to={`/project/task/${subtask.id}`}
            state={subtask}
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
