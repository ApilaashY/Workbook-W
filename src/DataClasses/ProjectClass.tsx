import { TaskClass, type TaskObject } from "./TaskClass";

export interface ProjectObject {
  title: string;
  id: string;
  tasks?: TaskObject[];
  taskCount?: number;
}

export class ProjectClass {
  public title: string;
  public id: string;
  public tasks: TaskClass[];
  public taskCount: number;

  constructor(
    title: string,
    id: string,
    tasks: TaskClass[],
    taskCount: number
  ) {
    this.title = title;
    this.id = id;
    this.tasks = tasks ?? [];
    this.taskCount = taskCount;
  }

  static fromMap(allData: ProjectObject): ProjectClass {
    let project: ProjectClass = new ProjectClass(
      allData.title,
      allData.id || "0",
      (allData.tasks || []).map((task) => TaskClass.fromMap(task)),
      allData.taskCount ?? allData.tasks?.length ?? 0
    );
    return project;
  }

  static getTaskCount(allData: TaskClass | TaskObject): number {
    allData.taskCount = allData.taskCount ?? 0;
    allData.taskCount++;
    return allData.taskCount - 1;
  }

  toMap(): ProjectObject {
    return {
      title: this.title,
      id: this.id,
      tasks: this.tasks.map((val) => val.toMap()),
      taskCount: this.taskCount,
    };
  }
}
