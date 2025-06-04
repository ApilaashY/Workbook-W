import { TaskClass, type TaskObject } from "./TaskClass";

export interface ProjectObject {
  name: string;
  id?: string;
  tasks?: TaskObject[];
}

export class ProjectClass {
  public name: string;
  public id: string;
  public tasks: TaskClass[];

  constructor(name: string, id: string, tasks: TaskClass[]) {
    this.name = name;
    this.id = id;
    this.tasks = tasks || [];
  }

  static fromMap(allData: ProjectObject): ProjectClass {
    let project: ProjectClass = new ProjectClass(
      allData.name,
      allData.id || "0",
      (allData.tasks || []).map((task) => TaskClass.fromMap(task))
    );
    return project;
  }
}
