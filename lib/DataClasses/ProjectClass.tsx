import { TaskClass, type TaskObject } from "./TaskClass";
import { Comment } from "../Components/CommentBox/CommentBox";

export interface ProjectObject {
  title: string;
  id: string;
  tasks?: TaskObject[];
  taskCount?: number;
  attachedDocs?: [string, string][];
  people: Record<string, string>;
  invite?: boolean;
  comments?: Comment[];
}

export class ProjectClass {
  public title: string;
  public id: string;
  public tasks: TaskClass[];
  public taskCount: number;
  public attachedDocs: [string, string][];
  public people: Record<string, string>;
  public invite: boolean;
  public comments?: Comment[];

  constructor(
    title: string,
    id: string,
    tasks: TaskClass[],
    taskCount: number,
    attachedDocs: [string, string][],
    people: Record<string, string>,
    invite: boolean,
    comments: Comment[]
  ) {
    this.title = title;
    this.id = id;
    this.tasks = tasks ?? [];
    this.taskCount = taskCount;
    this.attachedDocs = attachedDocs;
    this.people = people;
    this.invite = invite;
    this.comments = comments;
  }

  static fromMap(allData: ProjectObject): ProjectClass {
    const project: ProjectClass = new ProjectClass(
      allData.title,
      allData.id || "0",
      (allData.tasks || []).map((task) => TaskClass.fromMap(task)),
      allData.taskCount ?? allData.tasks?.length ?? 0,
      allData.attachedDocs ?? [],
      allData.people,
      allData.invite ?? false,
      allData.comments ?? []
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
      attachedDocs: this.attachedDocs,
      people: this.people,
      invite: this.invite,
    };
  }
}
