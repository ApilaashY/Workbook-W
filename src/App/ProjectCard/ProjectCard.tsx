import { useSelector } from "react-redux";
import type { ProjectClass } from "../../DataClasses/ProjectClass";
import "./ProjectCard.css";
import type { ProjectStore } from "../../store";

export function ProjectCard({ project }: { project: string }) {
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  const projectInfo: ProjectClass | undefined = projectData.find(
    (p) => p.id === project
  );

  return (
    <div className="project-card">
      <h3>{projectInfo!.title}</h3>
      <p>ID: {projectInfo!.id}</p>
    </div>
  );
}
