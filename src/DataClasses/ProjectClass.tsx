export interface ProjectObject { name: string; id?: string }

export class ProjectClass {
  public name: string;
  public id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  static fromMap(allData: { name: string; id?: string }): ProjectClass {
    let project: ProjectClass = new ProjectClass(
      allData.name,
      allData.id || "0"
    );
    return project;
  }
}
