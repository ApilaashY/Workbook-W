import { Toolbar } from "../Toolbar/Toolbar";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProject, type ProjectStore } from "../store";
import { useEffect, useRef, useState } from "react";
import { onValue, ref } from "firebase/database";
import { auth, db, fdb } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const projectData = useSelector(
    (state: ProjectStore) => state.projects
  );
  const [projects, setProjects] = useState(projectData)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gotInfo = useRef(false);


  useEffect(() => {
    setProjects(projectData)
  }, [projectData])

  useEffect(() => {
    if (gotInfo.current) return;
    gotInfo.current = true;

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      getDoc(doc(fdb, "Users", user.uid)).then((doc) => {
        const projectIds: string[] = doc.data()?.projects || [];

        projectIds.forEach((id) => {
          onValue(ref(db, `projects/${id}`), ((projData) => {
            dispatch(addProject({ ...projData.val(), id: id }));
          }));
        });
      });
    });
  }, []);

  return (
    <div className="main-window">
      <Toolbar />
      <div style={{ flex: "1 1 auto" }}>
        <div className="project-list">
          {projects.map((project) => (
            <Link to={`/project/${project.id}`} key={project.id}>
              <div className="project-card">
                <h3>{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

