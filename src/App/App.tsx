import { Toolbar } from "../Toolbar/Toolbar";
import { ProjectClass } from "../DataClasses/ProjectClass";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import { ProjectCard } from "./ProjectCard/ProjectCard";
import { useSelector } from "react-redux";
import type { ProjectStore } from "../store";
import { useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { auth, db, fdb } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth"

function App() {
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (!user) {
        navigate("/login");
      }
    })

    getDoc(doc(fdb, "Users", "A6vQ9GPYBzfxjmHpfDooPA7YUEl1")).then((doc) => {
      console.log(doc.data());
    })

    onValue(
      ref(db, "Projects"),
      (data) => {
        console.log(data.val())
      });
  }, [])

  return (
    <div className="main-window">
      <Toolbar />
      <div style={{ flex: "1 1 auto" }}>

        <div className="project-list">
          {projectData.map((project) => (
            <Link to="/project" state={project.id} key={project.id}>
              <ProjectCard project={project.id} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
