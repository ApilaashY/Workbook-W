import { Toolbar } from "../Toolbar/Toolbar";
import { ProjectClass } from "../DataClasses/ProjectClass";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ProjectCard } from "./ProjectCard/ProjectCard";
import { Project } from "../Project/Project";
import { Task } from "../Subtask/Task";
import type { TaskClass } from "../DataClasses/TaskClass";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { ProjectStore } from "../store";

function App() {
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );
  const [taskStack, setTaskStack] = useState<(ProjectClass | TaskClass)[]>([]);

  return (
    <BrowserRouter>
      <div className="main-window">
        <Toolbar
          taskStack={taskStack}
          setTaskStack={setTaskStack}
          testData={projectData}
        />
        <div style={{ flex: "1 1 auto" }}>
          <Routes>
            <Route
              path="/"
              element={
                <div className="project-list">
                  {projectData.map((project) => (
                    <Link to="/project" state={project.id} key={project.id}>
                      <ProjectCard project={project.id} />
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
              path="/project/task/:id"
              element={<Task setTaskStack={setTaskStack} />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
