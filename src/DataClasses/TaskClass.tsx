export interface TaskObject {
  title: string;
  description?: string;
  id?: string;
  progress?: number;
  subtasks?: TaskObject[];
}

export class TaskClass {
  public title: string;
  public description: string;
  public id: string;
  public progress: number;
  public subtasks: TaskClass[];

  constructor(
    title: string,
    id?: string,
    description?: string,
    progress?: number,
    subtasks?: TaskClass[]
  ) {
    this.title = title.trim();
    this.id = (id ?? "0").trim();
    this.description = (description ?? "").trim();
    this.progress = progress ?? 0;
    this.subtasks = subtasks ?? [];
  }

  static fromMap(allData: TaskObject): TaskClass {
    let task: TaskClass = new TaskClass(
      allData.title.trim(),
      allData.id?.trim() || "0",
      allData.description?.trim() || "",
      allData.progress,
      allData.subtasks?.map(TaskClass.fromMap) || []
    );
    return task;
  }
}
