import { Link, useLocation } from "react-router-dom";
import "./Toolbar.css";
import { ProjectClass } from "../DataClasses/ProjectClass";
import { TaskClass } from "../DataClasses/TaskClass";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { ProjectStore } from "../store";

export function Toolbar() {

  const location = useLocation();
  const [stack, setStack] = useState<(ProjectClass | TaskClass)[]>([]);
  let projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  useEffect(() => {
    if (!location.state) {
      setStack([]);
      return;
    }

    let newStack = new Array<ProjectClass | TaskClass>(location.state.split("-").length);

    const idParts = location.state.split("-");
    let currentId: string = idParts[0];
    let currentData: ProjectClass | TaskClass | undefined = (
      projectData as ProjectClass[]
    ).find((project) => project.id === currentId);
    newStack[0] = currentData ?? ProjectClass.fromMap({ title: "ERROR", id: "" });

    for (let i = 1; i < idParts.length; i++) {
      currentId += "-" + idParts[i];

      if (currentData === undefined) return undefined;
      else if (!currentData.id.includes("-")) {
        currentData = (currentData as ProjectClass).tasks.find(
          (task) => task.id === currentId
        );
      } else {
        currentData = (currentData as TaskClass).subtasks.find(
          (subtask) => subtask.id === currentId
        );
      }

      newStack[i] = currentData ?? TaskClass.fromMap({ title: "ERROR", id: "" });
    }

    setStack(newStack);
  }, [location.state, projectData])

  return (
    <div className="toolbar">
      <div className="toolbar-top-section">
        <Link to="/" onClick={() => setStack([])}>
          <h2 className="toolbar-title">Projects</h2>
        </Link>
        <div className='toolbar-breadcrumbs'>
          {stack.map((item, index) => {
            return (
              <>
                <h2 style={{ textAlign: "center", color: "white", margin: "0.25em" }}>V</h2>
                <Link
                  to={
                    !item.id.includes("-") ? "/project" : `/project/task/${item.id}`
                  }
                  state={item.id}
                  key={item.id}
                  onClick={() => setStack((prev) => prev.slice(0, index))}
                >
                  <h2 className="toolbar-title">{item.title}</h2>
                </Link>
              </>
            );
          })}
        </div>
      </div>
      <div className="toolbar-bottom-section">
        <h2 className="toolbar-title">Profile</h2>
        <h2 className="toolbar-title">Settings</h2>
      </div>
    </div>
  );
}
