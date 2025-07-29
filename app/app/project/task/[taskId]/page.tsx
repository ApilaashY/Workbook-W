"use client";

import "./Task.css";
import "../../[projectId]/Project.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import { useRouter } from "next/navigation";
import { ProjectClass } from "@/lib/DataClasses/ProjectClass";
import {
  addTask,
  deleteTask,
  ProjectStore,
  updateCommentData,
  updateTask,
  updateTaskOrder,
} from "@/lib/store";
import {
  TaskClass,
  TaskProgressStats,
  TaskProgressTypes,
} from "@/lib/DataClasses/TaskClass";
import { ProgressStatus } from "@/lib/Components/ProgressStatus/ProgressStatus";
import { AttachedDocs } from "@/lib/Components/AttachedDocs/AttachedDocs";
import { SearchBox } from "@/lib/Components/SearchBox/SearchBox";
import { createIdTrail, db, popLastTask } from "@/lib/firebase";
import { Priority } from "@/lib/Components/Priority/Priority";
import { promptMessage } from "@/lib/Components/Dialogs/PromptDialogs";
import { CommentBox } from "@/lib/Components/CommentBox/CommentBox";
import { onValue, ref } from "firebase/database";
// import { CommentBox } from "@/lib/Components/CommentBox/CommentBox";

function SortableTask({
  task,
  color,
  ...props
}: {
  task: TaskClass;
  color: string;
  dragging?: boolean;
}) {
  // Hooks and attributes
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const router = useRouter();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: `2px solid ${color}`,
    marginBottom: "0.5em",
    width: "100%",
  };

  function handleClick() {
    router.push(`/app/project/task/${task.id}`);
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

export default function Task({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  // Hooks
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));
  const dispatch = useDispatch();

  // Variables
  const [id, setId] = useState<string>("");
  const [task, setTask] = useState<TaskClass | undefined>(undefined);
  const [dragging, setDragging] = useState(false);
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );
  const goBack = useRef(false);
  const gotComments = useRef(false);

  // Handle async params in useEffect
  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.taskId || "");
    });
  }, [params]);

  // Go to app page if the id is not valid
  useEffect(() => {
    if (goBack.current) router.push("/app");
  }, [goBack, router]);

  // Update the task data if changed
  useEffect(() => {
    const newTask = findTaskById(projectData, id as string);
    if (newTask !== undefined) {
      setTask(newTask);
    } else if (id && projectData.length > 0) {
      // Only trigger redirect if we have an ID and projectData has loaded, but no task found
      goBack.current = true;
    }
  }, [projectData, id]);

  // Get comments for the task
  useEffect(() => {
    if (!task || gotComments.current) return;

    gotComments.current = true; // Prevent multiple subscriptions

    onValue(
      ref(db, `comments/${createIdTrail(task.id, projectData)}/comments`),
      (snapshot) => {
        const comments = snapshot.val() || {};
        if (comments) {
          dispatch(
            updateCommentData({
              id: task.id,
              comments: Object.values(comments),
            })
          );
        }
      }
    );
  }, [task]);

  // Handle the case where we should redirect
  if (goBack.current) {
    return <div>Task not found</div>;
  }

  // Don't render anything if we don't have task data yet
  if (!task) {
    return <div>Loading...</div>;
  }

  // Function that finds a task by its ID
  function findTaskById(data: ProjectClass[], id: string): TaskClass {
    // Split the ID into parts
    const idParts = id.split("-");
    let currentId: string = idParts[0];

    let currentData: ProjectClass | TaskClass | undefined = (
      data as ProjectClass[]
    ).find((project) => project.id === currentId);

    // GO through the parts of the ID to find the task
    for (let i = 1; i < idParts.length; i++) {
      currentId += "-" + idParts[i];

      if (currentData === undefined) return new TaskClass("", "");
      else if (!currentData.id.includes("-")) {
        currentData = (currentData as ProjectClass).tasks.find(
          (task) => task && task.id === currentId
        );
      } else {
        currentData = (currentData as TaskClass).tasks.find(
          (subtask) => subtask.id === currentId
        );
      }
    }
    return currentData as TaskClass;
  }

  // Function that changes task data
  async function editTaskInfo(
    category: "title" | "description",
    required: boolean
  ) {
    if (!task) return; // Early return if task is undefined

    // Get the user's new value
    let data: string | null = null;
    while (data === null) {
      data = await promptMessage(
        `Enter new title ${category}`,
        task[category],
        category === "description"
      );

      if (data === null) {
        return; // User cancelled
      }
    }

    // Update the task with the new data
    if (required && data.trim() === "") {
      alert(`Task ${category} cannot be empty`);
      data = null;
    } else {
      task[category] = data.trim();
      updateTask(id, category, data);
    }
  }

  // Function to create a new subtask
  async function createNewTask() {
    if (!task) return; // Early return if task is undefined

    let data: string | null | undefined = null;
    while (data === null) {
      data = (await promptMessage("Enter title of new subtask"))?.trim();
      if (data === null || data === undefined) {
        return; // User cancelled
      } else if (data === "") {
        alert(`Task title cannot be empty`);
        data = null;
      } else {
        addTask(task.id, data);
      }
    }
  }

  // Function to delete the current task and go back
  async function deleteTaskButton() {
    if (!task) return; // Early return if task is undefined

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    await deleteTask(task.id);
    const lastTask: string = popLastTask(task.id);
    router.push(
      !lastTask.includes("-")
        ? `/app/project/${lastTask}`
        : `/app/project/task/${lastTask}`
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    if (!task) return; // Early return if project is undefined

    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Get the indices of the active and over tasks
      const id1 = task.tasks.findIndex((task) => task.id === active.id);
      const id2 = task.tasks.findIndex((task) => task.id === over.id);

      if (id1 === -1 || id2 === -1) {
        console.error("Invalid task IDs:", active.id, over.id);
        return;
      }

      // Update the task order in the database and in the store
      updateTaskOrder(task.id, id1, id2, dispatch);
    }
  }

  return (
    <div className="project-window">
      {/* Left Menu with task information */}
      <div className="task-stats">
        <h2
          onClick={() => editTaskInfo("title", true)}
          className="task-information-text"
        >
          {task.title}
        </h2>
        <h2
          onClick={() => editTaskInfo("description", false)}
          className="task-information-text task-description"
        >
          {task.description.trim().length === 0
            ? "No Description"
            : task.description}
        </h2>

        <h3 className="info-label">Progress Status:</h3>
        <select
          value={task.progress}
          className="task-progress-select"
          onChange={(e) => updateTask(id, "progress", e.target.value)}
          style={{
            backgroundColor: TaskProgressStats[task.progress].color,
            color: TaskProgressStats[task.progress].color.startsWith("#ff")
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

        <h3 className="info-label">Check Status of all Subtasks:</h3>
        <ProgressStatus project={task} />

        <h3 className="info-label">Attached Links</h3>
        <AttachedDocs
          links={task.attachedDocs}
          updateFunction={updateTask}
          id={id}
        />

        <h3
          className={
            "info-label" +
            (task.dueDate &&
            TaskProgressStats[task.progress].alertLate &&
            new Date(task.dueDate) < new Date(Date.now())
              ? " late-text"
              : "")
          }
          onClick={
            task.dueDate &&
            TaskProgressStats[task.progress].alertLate &&
            new Date(task.dueDate) < new Date(Date.now())
              ? () => alert("This Task is Past Its Due Date")
              : undefined
          }
        >
          Due Date
        </h3>
        <ReactDatePicker
          selected={task.dueDate ? new Date(task.dueDate) : undefined}
          onChange={(date) => updateTask(id, "dueDate", date?.toISOString())}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Due Date and Time"
          className="date-picker"
        />

        <h3 className="info-label">Priority:</h3>
        <Priority priority={task.priority} id={task.id} />

        <h3 className="info-label">Search For Task</h3>
        <SearchBox tasks={task.tasks} />

        <h3 className="info-label">Comments</h3>
        <CommentBox
          comments={task.comments}
          projectLink={createIdTrail(task.id, projectData)}
          people={
            projectData.find((project) => project.id == task.id.split("-")[0])
              ?.people || {}
          }
        />

        <span className="fill" />

        <button className="delete-task" onClick={deleteTaskButton}>
          Delete Task
        </button>
      </div>

      {/* Right Menu with subtask list */}
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
                  color={TaskProgressStats[subtask.progress].color}
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
  );
}
