"use client";

// This is the main page for the app portion of the website

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import { addProject, ProjectStore } from "@/lib/store";
import { auth, db, fdb } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function App() {
  // Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  // Variables
  const projectData = useSelector((state: ProjectStore) => state.projects);
  const [emailVerified, setEmailVerified] = useState(true);

  // This sets up the projects that the current user has access to
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If the user is not logged in, redirect to the login page
      if (!user) {
        router.push("/login");
        return;
      }

      // If the user is logged in, get their projects from Firestore
      setEmailVerified(user.emailVerified);

      // Get the user's projects from Firestore
      getDoc(doc(fdb, "Users", user.uid)).then((doc) => {
        const projectIds: string[] = doc.data()?.projects || [];

        // Add each project to the Redux store and listen for changes from the firebase database
        projectIds.forEach((id) => {
          onValue(ref(db, `projects/${id}`), (projData) => {
            dispatch(addProject({ ...projData.val(), id: id }));
          });
        });
      });
    });
  }, [dispatch, router]);

  // Function to add a new project
  async function addNewProject() {
    // Check if the user is logged in
    if (!auth.currentUser) {
      alert("You must be logged in to create a project.");
      return;
    }

    // if (!emailVerified) {
    //   alert(
    //     "You must verify your email before creating a project. If you have already verified your email please reload the page."
    //   );
    //   return;
    // }

    // Prompt the user for a project name and keep asking while its empty
    let name = prompt("Enter project name:");
    if (name == null) return;
    while (!name || name.trim() === "") {
      if (name == null) return;
      name = prompt("Project name cannot be empty. Please enter a valid name:");
    }

    // Send api request to create a new project
    fetch("/api/database/addProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser.getIdToken(true)}`,
      },
      body: JSON.stringify({ title: name }),
    }).then((response) => {
      // If the response is not successful, alert the user
      if (response.status !== 201) {
        if (response.status === 410)
          alert("You have reached the maximum number of projects.");
        else alert("Failed to create project. Please try again.");
        return;
      }

      // Add the new project to the Redux store and listen for changes
      response.json().then(({ projectId }) => {
        onValue(ref(db, `projects/${projectId}`), (projData) => {
          dispatch(addProject({ ...projData.val(), id: projectId }));
        });
      });
    });
  }

  return (
    <div className="main-window">
      {/* Menu that has all projects */}
      <div style={{ flex: "1 1 auto" }}>
        <div className="project-list">
          {projectData.map((project) => (
            <Link href={`/app/project/${project.id}`} key={project.id}>
              <div className="project-card">
                <h3>{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button
        className="add-project-button"
        style={!emailVerified ? { backgroundColor: "#ff1e1eff" } : {}}
        onClick={addNewProject}
      >
        +
      </button>
    </div>
  );
}
