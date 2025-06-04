import { useLocation } from "react-router-dom";
import type { TaskClass } from "../DataClasses/TaskClass";
import "./Task.css";

export function Task() {
  const location = useLocation();
  const task = location.state as TaskClass;

  console.log(task);

  function editTaskName() {
    let data = null;
    while (data === null) {
      data = prompt("Enter new task name", task.title);
      if (data === null) {
        return; // User cancelled
      } else if (data.trim() === "") {
        alert("Task name cannot be empty");
        data = null;
      } else {
        task.title = data; // Update the task title
      }
    }
  }

  return (
    <div className="task-window">
      <div className="task-stats">
        <h2 onClick={editTaskName} className="task-information-text">
          {task.title}
        </h2>
      </div>

      <div className="task-subtask-list">
        <h2>Sub Tasks</h2>
      </div>
    </div>
  );
}
