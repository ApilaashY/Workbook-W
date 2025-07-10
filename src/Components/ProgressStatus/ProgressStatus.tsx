import { useState } from "react";
import type { ProjectClass } from "../../DataClasses/ProjectClass";
import { TaskProgressStats, TaskProgressTypes, type TaskClass, type TaskProgress } from "../../DataClasses/TaskClass";
import "./ProgressStatus.css";

export function ProgressStatus({ project }: { project: ProjectClass | TaskClass }) {
    const [progressStatProperty, setProgressStatProperty] = useState<string>("Done");

    function countTasks(level: ProjectClass | TaskClass): number {
        return level.tasks.length + level.tasks.map((task) => countTasks(task)).reduce((total, x) => total + x, 0);
    }

    function countProperty(level: ProjectClass | TaskClass, property: TaskProgress): number {
        let count: number = 0;
        level.tasks.forEach((task) => {
            if (task.progress == property) count++;
            count += countProperty(task, property);
        })
        return count;
    }

    return <div style={{ display: "flex", alignItems: "center", margin: "0 0.5em" }}>
        <h3 style={{ margin: 0 }}>{countProperty(project, progressStatProperty)}/{countTasks(project)}</h3>
        <select value={progressStatProperty} className="progress-stat-select"
            onChange={(e) => setProgressStatProperty(e.target.value)}
            style={{ backgroundColor: TaskProgressStats[progressStatProperty].color, color: ((TaskProgressStats[progressStatProperty].color.startsWith("#ff")) ? "black" : "white") }}>
            {
                TaskProgressTypes.map((progressOption) => <option value={progressOption} key={progressOption}>
                    {progressOption}
                </option>)
            }
        </select>
    </div>
}