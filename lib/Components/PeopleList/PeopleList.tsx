import "./PeopleList.css";
import { auth } from "@/lib/firebase";

export function PeopleList({
  people,
  projectId,
}: {
  people: Record<string, string>;
  projectId: string;
}) {
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

  return (
    <div className="people-list">
      {Object.values(people).map((person, index) => (
        <p key={index}>{person}</p>
      ))}
      <h2 className="add-person" onClick={addPerson}>
        +
      </h2>
    </div>
  );
}
