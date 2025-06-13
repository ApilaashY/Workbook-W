export interface TaskObject {
  title: string;
  description?: string;
  id: string;
  progress?: number;
  subtasks?: TaskObject[];
  taskCount?: number;
}

export class TaskClass {
  public title: string;
  public description: string;
  public id: string;
  public progress: number;
  public subtasks: TaskClass[];
  public taskCount: number;

  constructor(
    title: string,
    id: string,
    description?: string,
    progress?: number,
    subtasks?: TaskClass[],
    taskCount?: number
  ) {
    this.title = title.trim();
    this.id = id.trim();
    this.description = (description ?? "").trim();
    this.progress = progress ?? 0;
    this.subtasks = subtasks ?? [];
    this.taskCount = taskCount ?? subtasks?.length ?? 0;
  }

  static fromMap(allData: TaskObject): TaskClass {
    let task: TaskClass = new TaskClass(
      allData.title.trim(),
      allData.id.trim(),
      allData.description?.trim() || "",
      allData.progress,
      allData.subtasks?.map(TaskClass.fromMap) || [],
      allData.taskCount ?? allData.subtasks?.length ?? 0
    );
    return task;
  }

  getTaskCount(): number {
    this.taskCount++;
    return this.taskCount - 1;
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
