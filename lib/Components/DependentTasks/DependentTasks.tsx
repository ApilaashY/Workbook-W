import { useMemo } from "react";
import "./DependentTasks.css";
import { store, updateTask } from "@/lib/store";
import { alertMessage } from "../Dialogs/AlertDialog";
import { taskSelect } from "../Dialogs/TaskSelectDialog";
import { TaskObject } from "@/lib/DataClasses/TaskClass";
import Link from "next/link";
import ProgressIndicator from "../ProgressIndicator/ProgressIndicator";

export function DependentTasks({
  taskList,
  updateFunction,
  id,
}: {
  taskList: string[];
  updateFunction: typeof updateTask;
  id: string;
}) {
  const tasks = useMemo(() => {
    return (
      (taskList ?? [])
        .map((val) => {
          let task: TaskObject | undefined = store
            .getState()
            .projects.find((p) => val.startsWith(p.id));

          // If the task is not the dependent task itself, keep looking in its subtasks
          while (task !== undefined && task.id !== val) {
            task = (task.tasks ?? []).find((t) => val === t.id);
          }

          if (task === undefined) return null;

          return task;
        })
        .filter((task): task is TaskObject => task !== null) ?? []
    );
  }, [taskList]);

  function addTask(name: string | null): boolean {
    console.log(name);

    if (name === null) return false;

    if (name.trim().length === 0) {
      alertMessage("Error", "Task Name can't be Empty");
      return false;
    }

    updateFunction(id, "dependencies", [...tasks, name]);
    return true;
  }

  return (
    <div className="dependent-tasks">
      {tasks.length > 0 && (
        <ProgressIndicator
          value={
            tasks.filter((t) => t.progress === "Done").length / tasks.length
          }
        />
      )}
      {tasks.map((val, index) => {
        return (
          <Link
            href={`/app/project/task/${val.id}`}
            className="task-subtask-item"
            key={index}
            style={{
              border: `2px solid ${
                val.progress === "Done" ? "var(--primary)" : "transparent"
              }`,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {val.title}
            </div>
          </Link>
        );
      })}
      <h3
        className="add-task"
        onClick={async () =>
          addTask(
            await taskSelect(
              store.getState().projects.find((p) => p.id === id.split("-")[0]),
              [id, ...taskList]
            )
          )
        }
      >
        + Add Task
      </h3>
    </div>
  );
}
