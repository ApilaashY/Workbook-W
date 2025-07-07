import { useNavigate, useParams } from "react-router-dom";
import "./Project.css";
import type { ProjectClass } from "../DataClasses/ProjectClass";
import { useDispatch, useSelector } from "react-redux";
import { addProjectTask, updateProject, type ProjectStore } from "../store";
import { TaskProgressColors } from "../DataClasses/TaskClass";
import { Toolbar } from "../Toolbar/Toolbar";
import { useEffect, useRef, useState } from "react";
import { ProgressStatus } from "../Components/ProgressStatus/ProgressStatus";
import { AttachedDocs } from "../Components/AttachedDocs/AttachedDocs";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

function SortableTask({ task, color, dragging, ...props }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const navigate = useNavigate();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: `2px solid ${color}`,
    marginBottom: "0.5em",
    width: "100%",
  };

  function handleClick() {
    navigate(`/project/task/${task.id}`);
  }

  return (
    <button
      ref={setNodeRef}
      className="project-task-item"
      style={style}
      onClick={handleClick}
      {...attributes}
      {...props}
    >
      <span>{task.title}</span>
      <span
        {...listeners}
        style={{
          cursor: "grab",
          padding: "0 0.5em",
          userSelect: "none",
        }}
        aria-label="Drag handle"
      >
        ☰
      </span>
    </button>
  );
}

export function Project() {
  const { id = "" } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );
  const goBack = useRef(false);
  const [dragging, setDragging] = useState(false);

  const projectInfo: ProjectClass | undefined = projectData.find(
    (p) => p.id === id
  );

  useEffect(() => {
    if (goBack.current) navigate("/");
  }, [goBack.current]);

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

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: any) {
    setDragging(false);
    const { active, over } = event;
    if (active.id !== over.id) {
      let id1 = project.tasks.findIndex((task) => task.id === active.id);
      let id2 = project.tasks.findIndex((task) => task.id === over.id);

      let newArr = arrayMove(project.tasks, id1, id2);

      updateProject(id, "tasks", newArr, dispatch);
    }
  }

  return (
    <div className="main-window">
      <Toolbar />
      <div className="project-window">
        <div className="project-task-list">
          <h2>Project Task List</h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragMove={() => setDragging(true)}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={project.tasks}
              strategy={verticalListSortingStrategy}
            >
              <div className="project-task-list-only">
                {project.tasks.map((task) => {
                  return (
                    <SortableTask
                      key={task.id}
                      task={task}
                      color={TaskProgressColors[task.progress]}
                      dragging={dragging}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
          <button className="add-task-button" onClick={createNewTask}>
            Add Task
          </button>
        </div>

        <div className="project-task-summary">
          <h2>Task Summary</h2>
          <h3 className="info-label">Status of all Tasks</h3>
          <ProgressStatus project={project} />

          <h3 className="info-label">Attached Links</h3>
          <AttachedDocs
            links={project.attachedDocs}
            updateFunction={updateProject}
            id={id}
          />
        </div>
      </div>
    </div>
  );
}
