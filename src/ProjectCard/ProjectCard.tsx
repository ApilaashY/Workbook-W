import "./ProjectCard.css";

interface ProjectCardProps {
  project: {
    name: string;
    id: string | number;
    // add other properties if needed
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <p>ID: {project.id}</p>
    </div>
  );
}
