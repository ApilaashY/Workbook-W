import { PriorityTypes } from "@/lib/DataClasses/TaskClass";
import "./Priority.css";
import { updateTask } from "@/lib/store";

export function Priority({ priority, id }: { priority: string; id: string }) {
  return (
    <div className="priority-container">
      <select
        value={priority}
        className="priority-select"
        onChange={(e) => updateTask(id, "priority", e.target.value)}
        style={priority === "Critical" ? { border: "2px solid red" } : {}}
      >
        {PriorityTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}
