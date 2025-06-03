export class Project {
  public name: string;
  public id: string | number;

  constructor(name: string, id: string | number) {
    this.name = name;
    this.id = id;
  }

  static fromMap(allData: Map<string, any>): Project {
    let project: Project = new Project(
      allData.get("name"),
      allData.get("id") || "0"
    );
    return project;
  }
}
