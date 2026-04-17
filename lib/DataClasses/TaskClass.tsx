import { Comment } from "../Components/CommentBox/CommentBox";

export interface TaskObject {
  title: string;
  description?: string;
  id: string;
  progress?: TaskProgress;
  frequency?: TaskFrequency;
  tasks?: TaskObject[];
  taskCount?: number;
  attachedDocs?: [string, string][];
  dueDate?: string | undefined;
  comments?: Comment[];
  priority?: string;
  createdAt?: string;
  archived?: boolean;
  dependencies?: string[];
}

export class TaskClass {
  public title: string;
  public description: string;
  public id: string;
  public progress: TaskProgress;
  public frequency: TaskFrequency;
  public tasks: TaskClass[];
  public taskCount: number;
  public attachedDocs: [string, string][];
  public dueDate: string | undefined;
  public comments: Comment[];
  public priority: string;
  public createdAt: string;
  public archived: boolean;
  public dependencies?: string[];

  constructor(
    title: string,
    id: string,
    description?: string,
    progress?: TaskProgress,
    frequency?: TaskFrequency,
    tasks?: TaskClass[],
    taskCount?: number,
    attachedDocs?: [string, string][],
    dueDate?: string | undefined,
    comments?: Comment[],
    priority?: string,
    createdAt?: string,
    archived?: boolean,
    dependencies?: string[]
  ) {
    this.title = title.trim();
    this.id = id.trim();
    this.description = (description ?? "").trim();
    this.frequency = frequency ?? "None";
    this.progress = progress ?? "Not Started";
    this.tasks = tasks ?? [];
    this.taskCount = taskCount ?? tasks?.length ?? 0;
    this.attachedDocs = attachedDocs ?? [];
    this.dueDate = dueDate;
    this.comments = comments ?? [];
    this.priority = priority ?? "Medium";
    this.createdAt = createdAt ?? new Date().toISOString();
    this.archived = archived ?? false;
    this.dependencies = dependencies ?? [];
  }

  static fromMap(allData: TaskObject): TaskClass {
    const task: TaskClass = new TaskClass(
      allData.title.trim(),
      allData.id.trim(),
      allData.description?.trim() || "",
      allData.progress || "Not Started",
      allData.frequency || "None",
      allData.tasks?.map(TaskClass.fromMap) || [],
      allData.taskCount ?? allData.tasks?.length ?? 0,
      allData.attachedDocs ?? [],
      allData.dueDate,
      allData.comments || [],
      allData.priority || "Medium",
      allData.createdAt || new Date().toISOString(),
      allData.archived ?? false,
      allData.dependencies || []
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
      frequency: this.frequency,
      tasks: this.tasks.map((val) => val.toMap()),
      attachedDocs: this.attachedDocs,
      dueDate: this.dueDate,
      comments: this.comments,
      priority: this.priority,
      createdAt: this.createdAt,
      archived: this.archived,
      dependencies: this.dependencies,
    };
  }
}

export const TaskProgressTypes: string[] = [
  "Not Started",
  "In Progress",
  "Scheduled",
  "Done",
];
export type TaskFrequency = "Daily" | "Weekly" | "Monthly" | "Yearly" | "None";
export type TaskProgress = (typeof TaskProgressTypes)[number];
export const TaskProgressStats: Record<
  TaskProgress,
  { color: string; alertLate: boolean; value: number }
> = {
  "Not Started": { color: "#94a3b8", alertLate: true, value: 0 },
  "In Progress": { color: "#f59e0b", alertLate: true, value: 1 },
  Scheduled: { color: "#6366f1", alertLate: true, value: 2 },
  Done: { color: "#10b981", alertLate: false, value: 3 },
};

export const PriorityTypes: string[] = [
  "None",
  "Low",
  "Medium",
  "High",
  "Critical",
];
export type Priorities = (typeof PriorityTypes)[number];
export const PriorityStats: Record<Priorities, { value: number }> = {
  None: { value: 0 },
  Low: { value: 1 },
  Medium: { value: 2 },
  High: { value: 3 },
  Critical: { value: 4 },
};
