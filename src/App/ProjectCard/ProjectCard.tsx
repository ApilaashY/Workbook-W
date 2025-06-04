import type { ProjectClass } from "../../DataClasses/ProjectClass";
import "./ProjectCard.css";

export function ProjectCard({ project }: { project: ProjectClass }) {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>ID: {project.id}</p>
    </div>
  );
}
