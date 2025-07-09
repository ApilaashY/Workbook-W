import { useNavigate, useParams } from "react-router-dom";
import { TaskClass, TaskProgressColors } from "../DataClasses/TaskClass";
import "./Task.css";
import { useEffect, useState } from "react";
import type { ProjectClass } from "../DataClasses/ProjectClass";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  deleteTask,
  popLastTask,
  updateTask,
  type ProjectStore,
} from "../store";
import { TaskProgressTypes } from "../DataClasses/TaskClass";
import { Toolbar } from "../Toolbar/Toolbar";
import { ProgressStatus } from "../Components/ProgressStatus/ProgressStatus";
import { AttachedDocs } from "../Components/AttachedDocs/AttachedDocs";
import {
  closestCenter,
  DndContext,
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

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
      className="task-subtask-item"
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

export function Task() {
  const { id = "" } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  const projectInfo: TaskClass | undefined = findTaskById(projectData, id);

  const [task, setTask] = useState(projectInfo);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const newTask = findTaskById(projectData, id as string);
    if (newTask !== undefined) {
      setTask(newTask);
    }
  }, [projectData, id]);

  if (!task) {
    return <div>Project not found</div>;
  }

  function findTaskById(data: ProjectClass[], id: string): TaskClass {
    const idParts = id.split("-");
    let currentId: string = idParts[0];

    let currentData: ProjectClass | TaskClass | undefined = (
      data as ProjectClass[]
    ).find((project) => project.id === currentId);

    for (let i = 1; i < idParts.length; i++) {
      currentId += "-" + idParts[i];

      if (currentData === undefined) return new TaskClass("", "");
      else if (!currentData.id.includes("-")) {
        currentData = (currentData as ProjectClass).tasks.find(
          (task) => task.id === currentId
        );
      } else {
        currentData = (currentData as TaskClass).tasks.find(
          (subtask) => subtask.id === currentId
        );
      }
    }
    return currentData as TaskClass;
  }

  function editTaskInfo(category: "title" | "description", required: boolean) {
    let data: string | null = null;
    while (data === null) {
      data = prompt(`Enter new title ${category}`, task[category]);
      if (data === null) {
        return; // User cancelled
      } else if (required && data.trim() === "") {
        alert(`Task ${category} cannot be empty`);
        data = null;
      } else {
        updateTask(id, category, data, dispatch);
      }
    }
  }

  function createNewTask() {
    let data: string | null | undefined = null;
    while (data === null) {
      data = prompt("Enter title of new subtask")?.trim();
      if (data === null || data === undefined) {
        return; // User cancelled
      } else if (data === "") {
        alert(`Task title cannot be empty`);
        data = null;
      } else {
        addTask(task.id, data, dispatch);
      }
    }
  }

  async function deleteTaskButton() {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    await deleteTask(task.id, dispatch);
    let lastTask: string = popLastTask(task.id);
    navigate(
      !lastTask.includes("-")
        ? `/project/${lastTask}`
        : `/project/task/${lastTask}`
    );
  }

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: any) {
    setDragging(false);
    const { active, over } = event;
    if (active.id !== over.id) {
      let id1 = task.tasks.findIndex((task) => task.id === active.id);
      let id2 = task.tasks.findIndex((task) => task.id === over.id);

      let newArr = arrayMove(task.tasks, id1, id2);

      updateTask(id, "tasks", newArr, dispatch);
    }
  }

  return (
    <div className="main-window">
      <Toolbar />
      <div className="project-window">
        <div className="task-stats">
          <h2
            onClick={() => editTaskInfo("title", true)}
            className="task-information-text"
          >
            {task.title}
          </h2>
          <h2
            onClick={() => editTaskInfo("description", false)}
            className="task-information-text"
          >
            {task.description.trim().length === 0
              ? "No Description"
              : task.description}
          </h2>

          <select
            value={task.progress}
            className="task-progress-select"
            onChange={(e) =>
              updateTask(id, "progress", e.target.value, dispatch)
            }
            style={{
              backgroundColor: TaskProgressColors[task.progress],
              color: TaskProgressColors[task.progress].startsWith("#ff")
                ? "black"
                : "white",
            }}
          >
            {TaskProgressTypes.map((progressOption) => (
              <option value={progressOption} key={progressOption}>
                {progressOption}
              </option>
            ))}
          </select>

          <h3 className="info-label">Status of all Subtasks</h3>
          <ProgressStatus project={task} />

          <h3 className="info-label">Attached Links</h3>
          <AttachedDocs
            links={task.attachedDocs}
            updateFunction={updateTask}
            id={id}
          />

          <span className="fill" />

          <button className="delete-task" onClick={deleteTaskButton}>
            Delete Task
          </button>
        </div>

        <div className="task-subtask-list">
          <h2>Sub Tasks</h2>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragMove={() => setDragging(true)}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={task.tasks}
              strategy={verticalListSortingStrategy}
            >
              <div className="task-subtask-list-items">
                {task.tasks.map((subtask) => (
                  <SortableTask
                    key={subtask.id}
                    task={subtask}
                    color={TaskProgressColors[subtask.progress]}
                    dragging={dragging}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button className="add-subtask-button" onClick={createNewTask}>
            Add Subtask
          </button>
        </div>
      </div>
    </div>
  );
}
