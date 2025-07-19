"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useRouter } from "next/navigation";
import { ProjectClass } from "@/lib/DataClasses/ProjectClass";
import {
  addProjectTask,
  ProjectStore,
  updateProject,
  updateTaskOrder,
} from "@/lib/store";
import { TaskProgressStats } from "@/lib/DataClasses/TaskClass";
import { ProgressStatus } from "@/lib/Components/ProgressStatus/ProgressStatus";
import { AttachedDocs } from "@/lib/Components/AttachedDocs/AttachedDocs";
import { SearchBox } from "@/lib/Components/SearchBox/SearchBox";
import "./Project.css";

function SortableTask({
  task,
  color,
  ...props
}: {
  task: ProjectClass;
  color: string;
}) {
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

export default function Project({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  // Hooks
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));
  const dispatch = useDispatch();

  // Variables
  const [id, setId] = useState<string>("");
  const [project, setProject] = useState<ProjectClass | undefined>(undefined);
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  // Handle async params in useEffect
  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.projectId || "");
    });
  }, [params]);

  const projectInfo: ProjectClass | undefined = projectData.find(
    (p) => p.id === id
  );

  // Go back to the app page if the projectInfo is empty and there is a valid id
  useEffect(() => {
    if (!projectInfo && id) router.push("/app");
  }, [projectInfo, id, router]);

  // Update project state when projectData changes
  useEffect(() => {
    const newProject = projectData.find((p) => p.id === id);
    if (newProject !== undefined) {
      setProject(newProject);
    }
  }, [projectData, id]);

  // Handle the case where project is not found
  if (!projectInfo && id) {
    return <div>Project not found</div>;
  }

  // Don't render anything if we don't have project data yet
  if (!project) {
    return <div>Loading...</div>;
  }

  function createNewTask() {
    if (!project) return; // Early return if project is undefined

    let data: string | null | undefined = null;
    while (data === null) {
      data = prompt("Enter title of new task")?.trim();
      if (data === null || data === undefined) {
        return; // User cancelled
      } else if (data === "") {
        alert(`Task title cannot be empty`);
        data = null;
      } else {
        addProjectTask(project.id, data);
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    if (!project) return; // Early return if project is undefined

    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Get the indices of the active and over tasks
      const id1 = project.tasks.findIndex((task) => task.id === active.id);
      const id2 = project.tasks.findIndex((task) => task.id === over.id);

      if (!id1 || !id2) {
        console.error("Invalid task IDs:", active.id, over.id);
        return;
      }

      // Update the task order in the database and in the store
      updateTaskOrder(project.id, id1, id2, dispatch);
    }
  }

  return (
    <div className="project-window">
      <div className="project-task-list">
        <h2>Project Task List</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
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
                    color={TaskProgressStats[task.progress].color}
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

        <h3 className="info-label">Search For Task</h3>
        <SearchBox tasks={project.tasks} />
      </div>
    </div>
  );
}
