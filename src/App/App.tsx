import { Toolbar } from "../Toolbar/Toolbar";
import { ProjectClass, type ProjectObject } from "../DataClasses/ProjectClass";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ProjectCard } from "./ProjectCard/ProjectCard";
import { Project } from "../Project/Project";

function App() {
  const preProjectData: ProjectObject[] = [
    { name: "Project 1", id: "1" },
    { name: "Project 2", id: "2" },
    { name: "Project 3", id: "3" },
  ];

  const projectData = preProjectData.map((project) => ProjectClass.fromMap(project));

  return (

    <BrowserRouter>
      <div className="main-window">
        <Toolbar />
        <div style={{ flex: "1 1 auto" }}>
          <Routes>
            <Route path="/" element={
              <div className="project-list">
                {projectData.map((project) => (
                  <Link to="/project" state={{ project }} key={project.id}>
                    <ProjectCard project={project} /></Link>
                ))}
              </div>} />
            <Route path="/project" element={<Project />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter >
  );
}

export default App;
