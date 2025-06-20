export interface TaskObject {
  title: string;
  description?: string;
  id: string;
  progress?: TaskProgress;
  subtasks?: TaskObject[];
  taskCount?: number;
}

export class TaskClass {
  public title: string;
  public description: string;
  public id: string;
  public progress: TaskProgress;
  public subtasks: TaskClass[];
  public taskCount: number;

  constructor(
    title: string,
    id: string,
    description?: string,
    progress?: TaskProgress,
    subtasks?: TaskClass[],
    taskCount?: number
  ) {
    this.title = title.trim();
    this.id = id.trim();
    this.description = (description ?? "").trim();
    this.progress = progress ?? "Not Started";
    this.subtasks = subtasks ?? [];
    this.taskCount = taskCount ?? subtasks?.length ?? 0;
  }

  static fromMap(allData: TaskObject): TaskClass {
    let task: TaskClass = new TaskClass(
      allData.title.trim(),
      allData.id.trim(),
      allData.description?.trim() || "",
      allData.progress || "Not Started",
      allData.subtasks?.map(TaskClass.fromMap) || [],
      allData.taskCount ?? allData.subtasks?.length ?? 0
    );
    return task;
  }

  static getTaskCount(allData: TaskClass | TaskObject): number {
    allData.taskCount = allData.taskCount ?? 0;
    allData.taskCount++;
    return allData.taskCount - 1;
  }

  toMap(): TaskObject {
    return {
      title: this.title,
      id: this.id,
      taskCount: this.taskCount,
      description: this.description,
      progress: this.progress,
      subtasks: this.subtasks.map((val) => val.toMap()),
    };
  }
}

export const TaskProgressTypes: string[] = [
  "Not Started",
  "In Progress",
  "Scheduled",
  "Done",
];
export type TaskProgress = (typeof TaskProgressTypes)[number];
export const TaskProgressColors: Record<TaskProgress, string> = {
  "Not Started": "#808080",
  "In Progress": "#ffff00",
  "Scheduled": "#0000ff",
  "Done": "#00ee00",
};