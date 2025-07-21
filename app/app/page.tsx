"use client";

// This is the main page for the app portion of the website

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import { addProject, ProjectStore } from "@/lib/store";
import { auth, db, fdb } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function App() {
  console.log(
    btoa(
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/TVzmwPg+//8t\n25dYZ2cABHK0Tf5Jqk2Fj+m7K7UDtXIPXGiRWyL90sL6sZkoMnpaPC8L2GH8pCvg\nErNZDs5ma9o4LebcpwVa1m9NFrMkK8Or0LXMuRoua1JA6JLcq00Cc0HdnVjB79Jq\nm+6fSZvSqjzmijKH/fIkr150toGHdiG3GK40BsSuE25/9wiI4v5nULiyDYYeJT76\ndhRaHsxWuN10JJpS+T6Jf8Yvc3yY5OZ+lrAbn8PEQusNfvxz5lbnUFoz1svQdFpU\nAMvq/dpPXP52leQF8sYwndQaRK669f5II5z/ueWLfkg8265hymPZE3H4xOYCAolP\nVMIT+N5lAgMBAAECggEABMonjIB+ajkrHgO65ZXEEqy7nQh1bfSR0Hs9XLEw7PVf\nu1hywzw/HCyh67ht5MadqDo3BwAI9SJZB6dUp39sCyJFUzy0+cdgbWsATcjxkqv2\nnlofic8vZwsurYDcULCzK7UP4XkAB/wj0ejH8bkVOBkzcxeqiGLYcp2+p0O1hz6n\n/CP/YnEKd4oQzZUMW6Jq8TsG0Lp86OchdkjNQu2n9d/Go2Gqu2QfbDKbCxm3Y/sv\nw/Br1SRxrmGmOw353cDOq8G8Q3qzt1tEdv1yTawXBNod+9TuAXsOa72LdkQ6+X7Z\nWqT7OgtxEPvz3Gpz2Fy4KA7ilr9TgAuQVxvIPboLqQKBgQDk0tL7rEg8FgMDVqmC\n4UYma5GQU2kkv9JCChoCu9tjmuZOMvJEfLw9dq1ftIWaLV8OhL2B1obM0GPStHAI\nnBeYvDCgWE44DQopsEWQgHeTDNr3QJJZdGVo3G0eXo91t0MAlg9u5kR2BwodC5I4\nOjynMNZtrqUDINHvHo6sqyxQqQKBgQDWBbxqwnGcR0lKCpG7X6V9lpNOSPgjoRnp\nZwvfvD1nDCaopLD7Ciqfl33Oeuoq4DOq0xIvCSYQFdpcyz83j7W/tKLQofb60eNH\nACrKHObW7LIHUq6lfawUkPfS2LolssJIRsUjpYwpcpZIREJKsa2YjFtogBE1Sfqi\nakW9qqCpXQKBgGiVu3zwN2vPG71w5LU/RZLV44g1t37mdbFdcJoDRrj12YGwY27O\nHDNzhLaTieT4C9RU81DevmnqbVWmxvYIcfiLOyZudgHEY/q96G2tafm6DHKp/roI\nKzmMVgtlaOiCxIsGCzPC51OS0BqKaWBtrb804Szsf9s4KvvB2bAt5GlRAoGBAKO2\nIYl8kVEcyngDm7Q7lqh5jNZ+RKlkayC5vUB4inOPvOaVi/eLsE0Boa9XIFaJx5vs\n9uTZ167IOI9wvTuwBzPMZhq3Oehksri17QVLlFxlFE07tvJKLl5RAfDb7ZA2rByD\nXftFf/CYgVJoPFlMjmC5RJasF/2uSDUCm7RYl6rVAoGBAIbmIljzNlw6zYemXmD3\nkUWkVaF38qFNoZpB0s890V4bnn32zfgQ9RR+PF2gLbSTZ+KH4xYCwpd0thIFx8cV\nMpQ/CdAr41UJRmeeXXSqXHiYtmPQDm0+GC6vNCGGCrxA9WrnuaRWqmpCybWTKiIg\nAmmi/9jfNiskgn05LKJBIzcG\n-----END PRIVATE KEY-----\n"
    )
  );
  // Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  // Variables
  const projectData = useSelector((state: ProjectStore) => state.projects);
  // const [emailVerified, setEmailVerified] = useState(true);

  // This sets up the projects that the current user has access to
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // If the user is not logged in, redirect to the login page
      if (!user) {
        router.push("/login");
        return;
      }

      // If the user is logged in, get their projects from Firestore
      // setEmailVerified(user.emailVerified);

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
        // style={!emailVerified ? { backgroundColor: "#ff1e1eff" } : {}}
        onClick={addNewProject}
      >
        +
      </button>
    </div>
  );
}
