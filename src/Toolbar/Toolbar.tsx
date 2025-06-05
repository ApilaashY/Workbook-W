import { Link } from "react-router-dom";
import "./Toolbar.css";
import { ProjectClass } from "../DataClasses/ProjectClass";
import type { TaskClass } from "../DataClasses/TaskClass";

export function Toolbar({
  taskStack,
  setTaskStack,
  testData,
}: {
  taskStack: (ProjectClass | TaskClass)[];
  setTaskStack: React.Dispatch<
    React.SetStateAction<(ProjectClass | TaskClass)[]>
  >;
  testData: ProjectClass[];
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-top-section">
        <Link to="/" onClick={() => setTaskStack([])}>
          <h2 className="toolbar-title">Projects</h2>
        </Link>
        {taskStack.map((item, index) => {
          return (
            <Link
              to={
                !item.id.includes("-") ? "/project" : `/project/task/${item.id}`
              }
              state={item}
              key={item.id}
              onClick={() => setTaskStack((prev) => prev.slice(0, index))}
            >
              <h2 className="toolbar-title">{item.title}</h2>
            </Link>
          );
        })}
      </div>
      <div className="toolbar-bottom-section">
        <button onClick={() => console.log(testData)}>HIDFS</button>
        <h2 className="toolbar-title">Profile</h2>
        <h2 className="toolbar-title">Settings</h2>
      </div>
    </div>
  );
}
