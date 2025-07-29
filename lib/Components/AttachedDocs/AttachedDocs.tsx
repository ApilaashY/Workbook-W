import { useState } from "react";
import "./AttachedDocs.css";
import { updateProject, updateTask } from "@/lib/store";

export function AttachedDocs({
  links,
  updateFunction,
  id,
}: {
  links: [string, string][];
  updateFunction: typeof updateTask | typeof updateProject;
  id: string;
}) {
  const [openField, setOpenField] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");
  const [link, setLink] = useState<string>("");

  function addLink(label: string, link: string): boolean {
    if (label.trim().length === 0) {
      alert("Document Label can't be Empty");
      return false;
    } else if (link.trim().length === 0) {
      alert("Document Link can't be Empty");
      return false;
    }

    updateFunction(id, "attachedDocs", [...links, [label, link]]);
    return true;
  }

  return (
    <div className="attached-docs">
      {links.map((val, index) => (
        <a href={val[1]} target="_blank" key={index}>
          {val[0]}
        </a>
      ))}
      {openField ? (
        <div>
          <form
            className="new-doc-form"
            onSubmit={() => {
              setOpenField(!addLink(label, link));
            }}
          >
            <input
              placeholder="Document Name"
              onChange={(e) => setLabel(e.target.value)}
            />
            <input
              placeholder="Link"
              onChange={(e) => setLink(e.target.value)}
            />
            <div>
              <input type="submit" value="Add Document" />
              <button
                className="document-cancel"
                onClick={() => setOpenField(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <h2 className="add-doc" onClick={() => setOpenField(true)}>
          +
        </h2>
      )}
    </div>
  );
}
