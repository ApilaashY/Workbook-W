import { Toolbar } from "../Toolbar/Toolbar";
import { ProjectClass } from "../DataClasses/ProjectClass";
import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProject, type ProjectStore } from "../store";
import { useEffect, useRef } from "react";
import { get, ref } from "firebase/database";
import { auth, db, fdb } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gotInfo = useRef(false);

  useEffect(() => {
    if (gotInfo.current) return;
    gotInfo.current = true;

    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (!user) {
        navigate("/login");
        return;
      }

      getDoc(doc(fdb, "Users", user.uid)).then((doc) => {
        console.log(doc.data());
        const projectIds: string[] = doc.data()?.projects || [];

        projectIds.forEach((id) => {
          get(ref(db, `Projects/${id}`)).then((projData) => {
            console.log(projData.val());

            dispatch(addProject({ ...projData.val(), id: id }));
          });
        });
      });
    });
  }, []);

  return (
    <div className="main-window">
      <Toolbar />
      <div style={{ flex: "1 1 auto" }}>
        <div className="project-list">
          {projectData.map((project) => (
            <Link to="/project" state={project.id} key={project.id}>
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
