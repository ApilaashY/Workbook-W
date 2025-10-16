import { useState } from "react";
import "./DependentTasks.css";
import { store, updateProject, updateTask } from "@/lib/store";
import { alertDialog } from "../Dialogs/AlertDialog";
import { taskSelect, taskSelectDialog } from "../Dialogs/TaskSelectDialog";

export function DependentTasks({
  tasks,
  updateFunction,
  id,
}: {
  tasks: string[];
  updateFunction: typeof updateTask;
  id: string;
}) {
  function addTask(name: string | null): boolean {
    if (name === null) return false;

    if (name.trim().length === 0) {
      alertDialog({
        title: "Error",
        message: "Task Name can't be Empty",
      });
      return false;
    }

    updateFunction(id, "dependencies", [...tasks, name]);
    return true;
  }

  return (
    <div className="attached-docs">
      {tasks.map((val, index) => (
        <a href={val[1]} target="_blank" key={index}>
          {val[0]}
        </a>
      ))}
      <h3
        className="add-doc"
        onClick={async () =>
          addTask(
            await taskSelect(
              store.getState().projects.find((p) => p.id === id.split("-")[0])
            )
          )
        }
      >
        + Add Task
      </h3>
    </div>
  );
}
