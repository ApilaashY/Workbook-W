export interface TaskObject {
  title: string;
  description?: string;
  id: string;
  progress?: TaskProgress;
  tasks?: TaskObject[];
  taskCount?: number;
  attachedDocs?: [string, string][]
}

export class TaskClass {
  public title: string;
  public description: string;
  public id: string;
  public progress: TaskProgress;
  public tasks: TaskClass[];
  public taskCount: number;
  public attachedDocs: [string, string][];

  constructor(
    title: string,
    id: string,
    description?: string,
    progress?: TaskProgress,
    tasks?: TaskClass[],
    taskCount?: number,
    attachedDocs?: [string, string][]
  ) {
    this.title = title.trim();
    this.id = id.trim();
    this.description = (description ?? "").trim();
    this.progress = progress ?? "Not Started";
    this.tasks = tasks ?? [];
    this.taskCount = taskCount ?? tasks?.length ?? 0;
    this.attachedDocs = attachedDocs ?? [];
  }

  static fromMap(allData: TaskObject): TaskClass {
    let task: TaskClass = new TaskClass(
      allData.title.trim(),
      allData.id.trim(),
      allData.description?.trim() || "",
      allData.progress || "Not Started",
      allData.tasks?.map(TaskClass.fromMap) || [],
      allData.taskCount ?? allData.tasks?.length ?? 0,
      allData.attachedDocs ?? [],
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
  "Done": "#32cb6c",
};