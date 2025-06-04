export interface TaskObject {
  title: string;
  description?: string;
  id?: string;
}

export class TaskClass {
  public title: string;
  public description?: string;
  public id: string;

  constructor(title: string, id: string, description?: string) {
    this.title = title;
    this.id = id;
    this.description = description;
  }

  static fromMap(allData: TaskObject): TaskClass {
    let task: TaskClass = new TaskClass(
      allData.title,
      allData.id || "0",
      allData.description || ""
    );
    return task;
  }
}
