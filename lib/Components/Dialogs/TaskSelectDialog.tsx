import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./Dialogs.css";
import { ProjectObject } from "@/lib/DataClasses/ProjectClass";
import { TaskObject } from "@/lib/DataClasses/TaskClass";

interface TaskSelectDialogProps {
  tasks: ProjectObject;
  currentTaskId: string[];
  onResolve: (value: string | null) => void;
}

function TaskSelectDialog({
  tasks,
  currentTaskId,
  onResolve,
}: TaskSelectDialogProps) {
  const [value, setValue] = useState<number | null>(null);
  const [taskStack, setTaskStack] = useState<TaskObject[][]>([
    (tasks.tasks ?? []).filter((task) => !currentTaskId.includes(task.id)),
  ]);

  const handleConfirm = () => {
    onResolve(value != null ? taskStack[taskStack.length - 1][value].id : null);
  };

  const handleCancel = () => {
    onResolve(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  const selectedStyle = {
    border: `2px solid var(--primary)`,
    marginBottom: "0.5em",
    width: "100%",
  };

  return (
    <div
      className="prompt-overlay"
      onClick={handleCancel}
      onKeyDown={handleKeyDown}
    >
      <div className="prompt-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-header">
          <h3>
            {taskStack.length > 1 && (
              <span
                style={{ marginRight: "1em", cursor: "pointer" }}
                onClick={() => setTaskStack((prev) => prev.slice(0, -1))}
              >
                {"<"}
              </span>
            )}
            Select Task
          </h3>
        </div>

        <div className="prompt-body">
          {taskStack[taskStack.length - 1].map((task, index) => (
            <button
              key={index}
              className="task-subtask-item"
              style={value === index ? selectedStyle : {}}
              onClick={() =>
                setValue(taskStack[taskStack.length - 1].indexOf(task))
              }
              onDoubleClick={() => {
                setValue(null);
                setTaskStack((prev) => [
                  ...prev,
                  (task.tasks ?? []).filter(
                    (task) => !currentTaskId.includes(task.id)
                  ),
                ]);
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{task.title}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="prompt-footer">
          <button
            onClick={handleCancel}
            className="prompt-btn prompt-btn-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="prompt-btn prompt-btn-confirm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export function taskSelectDialog(
  tasks: ProjectObject,
  currentTaskId: string[]
): Promise<string | null> {
  return new Promise((resolve) => {
    // Create a container for the dialog
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };

    const handleResolve = (value: string | null) => {
      cleanup();
      resolve(value);
    };

    root.render(
      <TaskSelectDialog
        tasks={tasks}
        currentTaskId={currentTaskId}
        onResolve={handleResolve}
      />
    );
  });
}

// Convenience function that matches browser prompt API
export function taskSelect(
  tasks: ProjectObject | undefined,
  currentTaskId: string[]
): Promise<string | null> {
  if (!tasks) return Promise.resolve(null);

  return taskSelectDialog(tasks, currentTaskId);
}
