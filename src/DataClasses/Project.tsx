export interface ProjectObject { name: string; id?: string }

export class Project {
  public name: string;
  public id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  static fromMap(allData: { name: string; id?: string }): Project {
    let project: Project = new Project(
      allData.name,
      allData.id || "0"
    );
    return project;
  }
}
