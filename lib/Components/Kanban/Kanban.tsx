import { TaskClass, TaskProgressStats } from "@/lib/DataClasses/TaskClass";
import { NiceCheckbox } from "../NiceCheckbox/NiceCheckbox";
import { useRouter } from "next/navigation";
import { updateTask } from "@/lib/store";
import "./Kanban.css";

export default function Kanban({
  tasks,
  setKanbanMode,
}: {
  tasks: TaskClass[];
  setKanbanMode: (mode: boolean) => void;
}) {
  const router = useRouter();

  const kanbanSections = ["Scheduled", "Not Started", "In Progress", "Done"];

  function handleClick(task: TaskClass) {
    router.push(`/app/project/task/${task.id}`);
  }

  // Function to handle checkbox click without triggering parent click
  function handleCheckBoxClick(
    e: React.MouseEvent<HTMLInputElement>,
    task: TaskClass
  ) {
    e.stopPropagation();

    updateTask(
      task.id,
      "progress",
      e.currentTarget.checked ? "Done" : "Not Started"
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        padding: "3em",
      }}
    >
      <h3 style={{ cursor: "pointer" }} onClick={() => setKanbanMode(false)}>
        X
      </h3>
      <div className="kanban">
        {kanbanSections.map((section) => (
          <div className="kanban-section" key={section}>
            <h2>{section}</h2>
            {tasks
              .filter((task) => task.progress === section)
              .map((task) => (
                <button
                  key={task.id}
                  className="project-task-item"
                  style={{
                    border: `2px solid ${
                      TaskProgressStats[task.progress].color
                    }`,
                    marginBottom: "0.5em",
                    width: "100%",
                  }}
                  onClick={() => handleClick(task)}
                >
                  <NiceCheckbox
                    value={task.progress == "Done"}
                    onClick={(e) => handleCheckBoxClick(e, task)}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{task.title}</span>
                  </div>
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
