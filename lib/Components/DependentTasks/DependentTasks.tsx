import { useState } from "react";
import "./DependentTasks.css";
import { store, updateProject, updateTask } from "@/lib/store";
import { alertDialog } from "../Dialogs/AlertDialog";
import { taskSelect, taskSelectDialog } from "../Dialogs/TaskSelectDialog";
import { TaskObject } from "@/lib/DataClasses/TaskClass";

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
    console.log(name);

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
    <div className="dependent-tasks">
      {tasks.map((val, index) => {
        let task: TaskObject | undefined = store
          .getState()
          .projects.find((p) => val.startsWith(p.id));

        // If the task is not the dependent task itself, keep looking in its subtasks
        while (task !== undefined && task.id !== val) {
          task = (task.tasks ?? []).find((t) => val === t.id);
        }

        if (task === undefined) return;

        return (
          <button className="task-subtask-item" key={index}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {task.title}
            </div>
          </button>
        );
      })}
      <h3
        className="add-task"
        onClick={async () =>
          addTask(
            await taskSelect(
              store.getState().projects.find((p) => p.id === id.split("-")[0]),
              [id, ...tasks]
            )
          )
        }
      >
        + Add Task
      </h3>
    </div>
  );
}
