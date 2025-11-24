"use client";

// This is the main page for the app portion of the website

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import {
  addProject,
  flipInvite,
  loadSampleProject,
  ProjectStore,
  removeSampleProject,
} from "@/lib/store";
import { auth, db, fdb } from "@/lib/firebase";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { promptMessage } from "@/lib/Components/Dialogs/PromptDialog";
import { alertMessage } from "@/lib/Components/Dialogs/AlertDialog";

export default function App() {
  // Hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();

  // Variables
  const projectData = useSelector((state: ProjectStore) => state.projects);
  const [isLoading, setIsLoading] = useState(true);
  // const [emailVerified, setEmailVerified] = useState(true);

  // This sets up the projects that the current user has access to
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If the user is not logged in, redirect to the login page
      if (!user && params.get("sample") !== "true") {
        router.push("/login");
        return;
      }

      if (!user || params.get("sample") === "true") {
        // Load sample project
        dispatch(loadSampleProject());
        setIsLoading(false);
        return;
      } else if (params.get("sample") !== "true") {
        dispatch(removeSampleProject());
      }

      // If the user is logged in, get their projects from Firestore
      // setEmailVerified(user.emailVerified);

      // Get the user's projects from Firestore
      getDoc(doc(fdb, "Users", user.uid))
        .then((doc) => {
          const projectIds: string[] = doc.data()?.projects || [];
          const inviteIds: string[] = doc.data()?.invites || [];

          // If no projects, stop loading immediately
          if (projectIds.length === 0 && inviteIds.length === 0) {
            setIsLoading(false);
            return;
          }

          // Show UI immediately with first project, then load others
          let loadedCount = 0;
          const totalCount = projectIds.length + inviteIds.length;

          // Add each project to the Redux store and listen for changes from the firebase database
          projectIds.forEach((id, index) => {
            onValue(
              ref(db, `projects/${id}`),
              (projData) => {
                dispatch(
                  addProject({ ...projData.val(), id: id, invite: false })
                );
                loadedCount++;
                // Stop showing loading after first project loads (improves LCP)
                if (index === 0 || loadedCount >= totalCount) {
                  setIsLoading(false);
                }
              },
              { onlyOnce: false }
            );
          });

          // Add each invite project to the Redux store and listen for changes from the firebase database
          inviteIds.forEach((id) => {
            onValue(
              ref(db, `projects/${id}`),
              (projData) => {
                dispatch(
                  addProject({ ...projData.val(), id: id, invite: true })
                );
                loadedCount++;
                if (loadedCount >= totalCount) {
                  setIsLoading(false);
                }
              },
              { onlyOnce: false }
            );
          });
        })
        .catch(() => {
          setIsLoading(false);
        });
    });
  }, [dispatch, router, params]);

  // Function to add a new project
  async function addNewProject() {
    // Check if the user is logged in
    if (!auth.currentUser || params.get("sample") === "true") {
      alertMessage("Error", "You must be logged in to create a project.");
      return;
    }

    // if (!emailVerified) {
    //   alertDialog(
    //     "You must verify your email before creating a project. If you have already verified your email please reload the page."
    //   );
    //   return;
    // }

    // Prompt the user for a project name and keep asking while its empty
    let name = await promptMessage("Enter project name:");
    if (name == null) return;
    while (!name || name.trim() === "") {
      if (name == null) return;
      name = await promptMessage(
        "Project name cannot be empty. Please enter a valid name:"
      );
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
      // If the response is not successful, alertDialog the user
      if (response.status !== 201) {
        if (response.status === 410)
          alertMessage(
            "Error",
            "You have reached the maximum number of projects."
          );
        else
          alertMessage("Error", "Failed to create project. Please try again.");
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

  async function acceptInvite(id: string) {
    // Check if the user is logged in
    if (!auth.currentUser) {
      alertMessage("Error", "You must be logged in to accept an invite.");
      return;
    }

    if (!confirm("Are you sure you want to accept this invite?")) return;

    // Send api request to accept the invite
    fetch("/api/coop/acceptInvite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser.getIdToken(true)}`,
      },
      body: JSON.stringify({ projectId: id }),
    }).then((response) => {
      if (response.status !== 200) {
        alertMessage("Error", "Failed to accept invite. Please try again.");
        return;
      }
      dispatch(flipInvite(id));
    });
  }

  return (
    <div className="main-window">
      {/* Menu that has all projects */}
      <div style={{ flex: "1 1 auto" }}>
        <div className="project-list">
          {/* Show projects immediately as they load */}
          {projectData.map((project) =>
            project.invite ? (
              <div
                key={project.id}
                className="project-card"
                style={{
                  backgroundColor: "rgba(255, 255, 198, 1)",
                }}
                onClick={() => acceptInvite(project.id)}
              >
                <h3>{project.title}</h3>
              </div>
            ) : (
              <Link
                href={`/app/project/${project.id}${
                  params.get("sample") === "true" ? "?sample=true" : ""
                }`}
                key={project.id}
                prefetch={true}
              >
                <div className="project-card">
                  <h3>{project.title}</h3>
                </div>
              </Link>
            )
          )}
          {/* Show loading skeleton only if still loading AND no projects loaded yet */}
          {isLoading && projectData.length === 0 && (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={`skeleton-${i}`}
                  className="project-card skeleton"
                  style={{ minHeight: "80px" }}
                >
                  <div
                    style={{
                      height: "20px",
                      backgroundColor: "rgba(0,0,0,0.1)",
                      borderRadius: "4px",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <button
        className="add-project-button"
        // style={!emailVerified ? { backgroundColor: "#ff1e1eff" } : {}}
        onClick={addNewProject}
      >
        +
      </button>
    </div>
  );
}
