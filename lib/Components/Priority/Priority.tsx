import { PriorityTypes } from "@/lib/DataClasses/TaskClass";
import "./Priority.css";
import { updateTask } from "@/lib/store";
import { auth } from "@/lib/firebase";
import { alertMessage } from "../Dialogs/AlertDialog";

export function Priority({
  priority,
  id,
  sample,
}: {
  priority: string;
  id: string;
  sample: boolean;
}) {
  return (
    <div className="priority-container">
      <select
        value={priority}
        className="priority-select"
        onChange={(e) => {
          // Check if the user is logged in
          if (!auth.currentUser || sample) {
            alertMessage("Error", "You must be logged in to make changes.");
            return;
          }
          updateTask(id, "priority", e.target.value);
        }}
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
