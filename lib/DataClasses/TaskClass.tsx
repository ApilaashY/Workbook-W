export interface TaskObject {
  title: string;
  description?: string;
  id: string;
  progress?: TaskProgress;
  tasks?: TaskObject[];
  taskCount?: number;
  attachedDocs?: [string, string][];
  dueDate?: string | undefined;
}

export class TaskClass {
  public title: string;
  public description: string;
  public id: string;
  public progress: TaskProgress;
  public tasks: TaskClass[];
  public taskCount: number;
  public attachedDocs: [string, string][];
  public dueDate: string | undefined;

  constructor(
    title: string,
    id: string,
    description?: string,
    progress?: TaskProgress,
    tasks?: TaskClass[],
    taskCount?: number,
    attachedDocs?: [string, string][],
    dueDate?: string | undefined
  ) {
    this.title = title.trim();
    this.id = id.trim();
    this.description = (description ?? "").trim();
    this.progress = progress ?? "Not Started";
    this.tasks = tasks ?? [];
    this.taskCount = taskCount ?? tasks?.length ?? 0;
    this.attachedDocs = attachedDocs ?? [];
    this.dueDate = dueDate;
  }

  static fromMap(allData: TaskObject): TaskClass {
    const task: TaskClass = new TaskClass(
      allData.title.trim(),
      allData.id.trim(),
      allData.description?.trim() || "",
      allData.progress || "Not Started",
      allData.tasks?.map(TaskClass.fromMap) || [],
      allData.taskCount ?? allData.tasks?.length ?? 0,
      allData.attachedDocs ?? [],
      allData.dueDate
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
      tasks: this.tasks.map((val) => val.toMap()),
      attachedDocs: this.attachedDocs,
      dueDate: this.dueDate,
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
export const TaskProgressStats: Record<
  TaskProgress,
  { color: string; alertLate: boolean }
> = {
  "Not Started": { color: "#808080", alertLate: true },
  "In Progress": { color: "#ffff00", alertLate: true },
  Scheduled: { color: "#0000ff", alertLate: true },
  Done: { color: "#32cb6c", alertLate: false },
};
