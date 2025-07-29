import { IoMdSend } from "react-icons/io";
import "./CommentBox.css";
import { useState } from "react";
import { auth, createIdTrail } from "@/lib/firebase";

export interface Comment {
  content: string;
  sender: string;
}

export function CommentBox({
  comments,
  projectLink,
  people,
}: {
  comments: Comment[];
  projectLink: string;
  people: { [key: string]: string };
}) {
  // Variables
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState<Comment | null>(null);

  // Function to add a comment
  async function addComment() {
    // Check if the user is logged in
    if (auth.currentUser == null) {
      alert("You must be logged in to add a comment.");
      return;
    }

    // Add the comment
    const newComment: Comment = {
      content: comment,
      sender: auth.currentUser.uid,
    };
    setComment("");

    setAddingComment(newComment);
    await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/addComment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
      },
      body: JSON.stringify({ comment: newComment, projectLink: projectLink }),
    });
    setAddingComment(null);
  }

  return (
    <div className="comment-box">
      <ul className="comment-list">
        {(addingComment ? [...comments, addingComment] : comments).map(
          (comment, index) => (
            <div key={index}>
              <p className="comment-text">
                <strong>
                  {comment.sender == auth.currentUser?.uid ? (
                    <span style={{ color: "var(--primary)" }}>You</span>
                  ) : (
                    people[comment.sender] ?? "Unknown User"
                  )}
                </strong>
                : {comment.content}
              </p>
            </div>
          )
        )}
      </ul>
      <div className="add-comment">
        <input
          className="add-comment-input"
          value={comment}
          onChange={(e) => {
            setComment(e.currentTarget.value);
          }}
        />
        <button className="add-comment-button" onClick={addComment}>
          <IoMdSend />
        </button>
      </div>
    </div>
  );
}
