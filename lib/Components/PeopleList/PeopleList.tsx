import { useState } from "react";
import "./PeopleList.css";
import { auth } from "@/lib/firebase";

export function PeopleList({
  people,
  projectId,
}: {
  people: Record<string, string>;
  projectId: string;
}) {
  // Variables
  const [hover, setHover] = useState(-1);

  async function addPerson() {
    if (!auth.currentUser) return;

    let email = prompt(
      "Enter email of the person you would like to invite to this project:"
    );
    if (email == null) return;
    while (!email || email.trim() === "") {
      if (email == null) return;
      email = prompt("Email cannot be empty. Please enter a valid email:");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_LINK}/api/coop/addPersonInvite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await auth.currentUser.getIdToken(true)}`,
        },
        body: JSON.stringify({ email: email, projectId: projectId }),
      }
    );

    if (response.ok) {
      alert(`Sent invite to ${email}`);
    } else {
      alert((await response.text()) || "Failed to send invite");
    }
  }

  async function removePerson(person: string) {
    if (!auth.currentUser) return;

    const confirmed = confirm(
      `Are you sure you want to remove ${people[person]} from this project?`
    );
    if (!confirmed) return;

    fetch(`${process.env.NEXT_PUBLIC_LINK}/api/coop/removePerson`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser.getIdToken(true)}`,
      },
      body: JSON.stringify({
        projectId: projectId,
        uid: person,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert(`Removed ${people[person]} from the project`);
        } else {
          alert("Failed to remove person");
        }
      })
      .catch((error) => {
        console.error("Error removing person:", error);
      });
  }

  return (
    <div className="people-list">
      {Object.keys(people).map((person, index) => (
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
          onMouseEnter={() => setHover(index)}
          onMouseLeave={() => setHover(-1)}
          key={index}
        >
          <p>{people[person]}</p>
          {hover === index &&
          projectId.split("_")[0] !== person &&
          projectId.split("_")[0] !== auth.currentUser?.uid ? (
            <span
              style={{
                color: "red",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => removePerson(person)}
            >
              Remove
            </span>
          ) : null}
        </div>
      ))}
      <h2 className="add-person" onClick={addPerson}>
        +
      </h2>
    </div>
  );
}
