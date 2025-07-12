"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { onValue, ref } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import { addProject, ProjectStore } from "@/lib/store";
import { auth, db, fdb } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function App() {
  const projectData = useSelector((state: ProjectStore) => state.projects);
  const [projects, setProjects] = useState(projectData);
  const dispatch = useDispatch();
  const router = useRouter();
  const gotInfo = useRef(false);

  useEffect(() => {
    setProjects(projectData);
  }, [projectData]);

  useEffect(() => {
    if (gotInfo.current) return;
    gotInfo.current = true;

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      getDoc(doc(fdb, "Users", user.uid)).then((doc) => {
        const projectIds: string[] = doc.data()?.projects || [];

        projectIds.forEach((id) => {
          onValue(ref(db, `projects/${id}`), (projData) => {
            dispatch(addProject({ ...projData.val(), id: id }));
          });
        });
      });
    });
  }, []);

  return (
    <div className="main-window">
      <div style={{ flex: "1 1 auto" }}>
        <div className="project-list">
          {projects.map((project) => (
            <Link href={`/app/project/${project.id}`} key={project.id}>
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
