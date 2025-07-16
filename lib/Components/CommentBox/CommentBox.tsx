import { IoMdSend } from "react-icons/io";
import "./CommentBox.css";
import { updateTask } from "@/lib/store";
import { useState } from "react";

export interface Comment {
  content: string;
  sender: string;
}

export function CommentBox({
  comments,
  id,
}: {
  comments: Comment[];
  id: string;
}) {
  // Variables
  const [comment, setComment] = useState("");

  return (
    <div className="comment-box">
      <ul className="comment-list">
        {comments.map((comment, index) => (
          <div key={index}>
            <p className="comment-text">
              <strong>
                {comment.sender == "You" ? (
                  <span style={{ color: "var(--primary)" }}>
                    {comment.sender}
                  </span>
                ) : (
                  comment.sender
                )}
              </strong>
              : {comment.content}
            </p>
          </div>
        ))}
      </ul>
      <div className="add-comment">
        <input
          className="add-comment-input"
          value={comment}
          onChange={(e) => {
            setComment(e.currentTarget.value);
          }}
        />
        <button
          className="add-comment-button"
          onClick={() => {
            updateTask(id, "comments", { content: comment, sender: "You" });
            setComment("");
          }}
        >
          <IoMdSend />
        </button>
      </div>
    </div>
  );
}
