import { Project } from "./Project";

export class ProjectList {
  private projects: Project[];

  constructor() {
    this.projects = [];
  }

  addProject(project: Project): void {
    this.projects.push(project);
  }

  removeProject(id: string | number): void {
    this.projects = this.projects.filter((project) => project.id !== id);
  }

  getProjects(): Project[] {
    return this.projects;
  }

  findProjectById(id: string | number): Project | undefined {
    return this.projects.find((project) => project.id === id);
  }
}
