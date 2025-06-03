import { ProjectCard } from "../ProjectCard/ProjectCard";
import { Toolbar } from "../Toolbar/Toolbar";
import { Project, type ProjectObject } from "../DataClasses/Project";
import "./App.css";

function App() {
  const preProjectData: ProjectObject[] = [
    { name: "Project 1", id: "1" },
    { name: "Project 2", id: "2" },
    { name: "Project 3", id: "3" },
  ];

  const projectData = preProjectData.map((project) => Project.fromMap(project));

  return (
    <div className="main-window">
      <Toolbar />
      <div className="project-list">
        {projectData.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
