import { Link, useNavigate, useParams } from "react-router-dom";
import "./Project.css";
import type { ProjectClass } from "../DataClasses/ProjectClass";
import { useDispatch, useSelector } from "react-redux";
import { addProjectTask, updateProject, type ProjectStore } from "../store";
import { TaskProgressColors } from "../DataClasses/TaskClass";
import { Toolbar } from "../Toolbar/Toolbar";
import { useEffect, useRef, useState } from "react";
import { ProgressStatus } from "../Components/ProgressStatus/ProgressStatus";
import { AttachedDocs } from "../Components/AttachedDocs/AttachedDocs";

export function Project() {
  const { id="" } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );
  const goBack = useRef(false);

  const projectInfo: ProjectClass | undefined = projectData.find(
    (p) => p.id === id
  );

  useEffect(() => {
    if (goBack.current) navigate("/");
  }, [goBack.current])

  if (!projectInfo) {
    goBack.current = true;
    return <div>Project not found</div>;
  }
  
  const [project, setProject] = useState(projectInfo);

  useEffect(() => {
    const newProject = projectData.find((p) => p.id === id);
    if (newProject !== undefined) {
      setProject(newProject);
    }
  }, [projectData, id]);


  function createNewTask() {
    let data: string | null | undefined = null;
    while (data === null) {
      data = prompt("Enter title of new task")?.trim();
      if (data === null || data === undefined) {
        return; // User cancelled
      } else if (data === "") {
        alert(`Task title cannot be empty`);
        data = null;
      } else {
        addProjectTask(project.id, data, dispatch);
      }
    }
  }

  function addLink(label: string, link: string): boolean {
    updateProject(id, "attachedDocs", [...project.attachedDocs, [label, link]], dispatch);
    return true;
  }



  return (
    <div className="main-window">
      <Toolbar />
      <div className="project-window">
        <div className="project-task-list">
          <h2>Project Task List</h2>
          <div className="project-task-list-only">
            {projectInfo?.tasks.map((task) => (
              <Link
                to={`/project/task/${task.id}`}
                key={task.id}
              >
                <button
                  className="project-task-item"
                  style={{
                    border: `2px solid ${TaskProgressColors[task.progress]}`,
                  }}
                >
                  {task.title}
                </button>
              </Link>
            ))}
          </div>
          <button className="add-task-button" onClick={createNewTask}>
            Add Task
          </button>
        </div>

        <div className="project-task-summary">
          <h2>Task Summary</h2>
          <h3 className="info-label">Status of all Tasks</h3>
          <ProgressStatus project={project} />

          <h3 className="info-label">Attached Documents</h3>
          <AttachedDocs links={project.attachedDocs} addLink={addLink}/>
        </div>
      </div>
    </div>
  );
}
