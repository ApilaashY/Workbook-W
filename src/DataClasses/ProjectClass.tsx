import { TaskClass, type TaskObject } from "./TaskClass";

export interface ProjectObject {
  title: string;
  id?: string;
  tasks: TaskObject[];
}

export class ProjectClass {
  public title: string;
  public id: string;
  public tasks: TaskClass[];

  constructor(title: string, id: string, tasks: TaskClass[]) {
    this.title = title;
    this.id = id;
    this.tasks = tasks ?? [];
  }

  static fromMap(allData: ProjectObject): ProjectClass {
    let project: ProjectClass = new ProjectClass(
      allData.title,
      allData.id || "0",
      (allData.tasks || []).map((task) => TaskClass.fromMap(task))
    );
    return project;
  }
}
