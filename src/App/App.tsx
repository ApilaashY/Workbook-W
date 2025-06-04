import { Toolbar } from "../Toolbar/Toolbar";
import { ProjectClass, type ProjectObject } from "../DataClasses/ProjectClass";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ProjectCard } from "./ProjectCard/ProjectCard";
import { Project } from "../Project/Project";
import { Task } from "../Subtask/Task";
import type { TaskClass } from "../DataClasses/TaskClass";
import { useState } from "react";

function App() {
  const preProjectData: ProjectObject[] = [
    {
      title: "Project 1",
      id: "1",
      tasks: [
        { id: "t1", title: "Design UI" },
        { id: "t2", title: "Set up backend" },
      ],
    },
    {
      title: "Project 2",
      id: "2",
      tasks: [
        { id: "t3", title: "Write documentation" },
        { id: "t4", title: "Deploy to server" },
      ],
    },
    {
      title: "Project 3",
      id: "3",
      tasks: [{ id: "t5", title: "Research competitors" }],
    },
  ];

  const projectData = preProjectData.map((project) =>
    ProjectClass.fromMap(project)
  );
  const [taskStack, setTaskStack] = useState<(ProjectClass | TaskClass)[]>([]);

  return (
    <BrowserRouter>
      <div className="main-window">
        <Toolbar taskStack={taskStack} setTaskStack={setTaskStack} />
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
            <Route
              path="/project"
              element={<Project setTaskStack={setTaskStack} />}
            />
            <Route
              path="/project/task"
              element={<Task setTaskStack={setTaskStack} />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
