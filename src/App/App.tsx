import { Toolbar } from "../Toolbar/Toolbar";
import { ProjectClass } from "../DataClasses/ProjectClass";
import "./App.css";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ProjectCard } from "./ProjectCard/ProjectCard";
import { Project } from "../Project/Project";
import { Task } from "../Subtask/Task";
import { useSelector } from "react-redux";
import type { ProjectStore } from "../store";
import { useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../firebase";

function App() {
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  useEffect(() => {
    onValue(
      ref(db, "projects"),
      (data) => {
        console.log(data.val())
      });
  })

  return (
    <BrowserRouter>
      <div className="main-window">
        <Toolbar
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
              element={<Project />}
            />
            <Route
              path="/project/task/:id"
              element={<Task />}
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
