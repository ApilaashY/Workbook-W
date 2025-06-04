import { Toolbar } from "../Toolbar/Toolbar";
import { ProjectClass, type ProjectObject } from "../DataClasses/ProjectClass";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ProjectCard } from "./ProjectCard/ProjectCard";
import { Project } from "../Project/Project";
import { Task } from "../Subtask/Task";

function App() {
  const preProjectData: ProjectObject[] = [
    {
      name: "Project 1",
      id: "1",
      tasks: [
        { id: "t1", title: "Design UI" },
        { id: "t2", title: "Set up backend" },
      ],
    },
    {
      name: "Project 2",
      id: "2",
      tasks: [
        { id: "t3", title: "Write documentation" },
        { id: "t4", title: "Deploy to server" },
      ],
    },
    {
      name: "Project 3",
      id: "3",
      tasks: [{ id: "t5", title: "Research competitors" }],
    },
  ];

  const projectData = preProjectData.map((project) =>
    ProjectClass.fromMap(project)
  );

  return (
    <BrowserRouter>
      <div className="main-window">
        <Toolbar />
        <div style={{ flex: "1 1 auto" }}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="project-list">
                  {projectData.map((project) => (
                    <Link to="/project" state={project} key={project.id}>
                      <ProjectCard project={project} />
                    </Link>
                  ))}
                </div>
              }
            />
            <Route path="/project" element={<Project />} />
            <Route path="/project/task" element={<Task />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
