"use client";

import { useDispatch, useSelector } from "react-redux";
import { Suspense, useEffect, useMemo, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectClass } from "@/lib/DataClasses/ProjectClass";
import {
  addProjectTask,
  ProjectStore,
  updateProject,
  updateTask,
  updateTaskOrder,
} from "@/lib/store";
import {
  PriorityStats,
  TaskClass,
  TaskProgressStats,
} from "@/lib/DataClasses/TaskClass";
import { ProgressStatus } from "@/lib/Components/ProgressStatus/ProgressStatus";
import { AttachedDocs } from "@/lib/Components/AttachedDocs/AttachedDocs";
import { SearchBox } from "@/lib/Components/SearchBox/SearchBox";
import "./Project.css";
import { PeopleList } from "@/lib/Components/PeopleList/PeopleList";
import { promptMessage } from "@/lib/Components/Dialogs/PromptDialog";
import { NiceCheckbox } from "@/lib/Components/NiceCheckbox/NiceCheckbox";
import { FaSearch } from "react-icons/fa";
import { alertMessage } from "@/lib/Components/Dialogs/AlertDialog";
import Kanban from "@/lib/Components/Kanban/Kanban";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

function SortableTask({
  task,
  color,
  moveable,
  searchDetails,
  ...props
}: {
  task: TaskClass;
  color: string;
  moveable: boolean;
  searchDetails?: [string, string, string, string]; // [category, before, match, after]
  dragging?: boolean;
}) {
  // Hooks and attributes
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const router = useRouter();
  const searchParams = useSearchParams();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: `2px solid ${color}`,
    marginBottom: "0.5em",
    width: "100%",
  };

  function handleClick() {
    router.push(
      `/app/project/task/${task.id}${
        searchParams.get("sample") === "true" ? "?sample=true" : ""
      }`,
    );
  }

  // Function to handle checkbox click without triggering parent click
  function handleCheckBoxClick(e: React.MouseEvent<HTMLInputElement>) {
    e.stopPropagation();

    if (searchParams.get("sample") === "true") return;

    updateTask(
      task.id,
      "progress",
      e.currentTarget.checked ? "Done" : "Not Started",
    );
  }

  return (
    <button
      ref={setNodeRef}
      className="project-task-item"
      style={style}
      onClick={handleClick}
      {...(moveable ? attributes : {})}
      {...(moveable ? props : {})}
    >
      <NiceCheckbox
        value={task.progress == "Done"}
        onClick={handleCheckBoxClick}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {searchDetails && searchDetails[0] == "Title" ? (
          <span>
            {searchDetails[1]}
            <strong>{searchDetails[2]}</strong>
            {searchDetails[3]}
          </span>
        ) : (
          <span>{task.title}</span>
        )}
        {searchDetails && searchDetails[0] != "Title" ? (
          <>
            <br />
            <p>
              {`${searchDetails[0]}: ${searchDetails[1]}`}
              <strong>{searchDetails[2]}</strong>
              {`${searchDetails[3]}`}
            </p>
          </>
        ) : null}
      </div>
      {moveable ? (
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
      ) : (
        <div></div>
      )}
    </button>
  );
}

export default function Project({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectSuspenseWrapper params={params} />
    </Suspense>
  );
}

function ProjectSuspenseWrapper({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  // Hooks
  const router = useRouter();
  const sensors = useSensors(useSensor(PointerSensor));
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Variables
  const [id, setId] = useState<string>("");
  const [project, setProject] = useState<ProjectClass | undefined>(undefined);
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects,
  );
  const [sortBy, setSortBy] = useState<string>("Custom");
  const [taskClassification, setTaskClassification] =
    useState<string>("General Tasks");
  const [ascending, setAscending] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<
    [string, string, string, string, TaskClass][]
  >([]);
  const [kanbanMode, setKanbanMode] = useState<boolean>(false);

  // Cache filtered tasks (only recalculates when project.tasks or taskClassification changes)
  const filteredTasks = useMemo(() => {
    if (!project) return [];

    if (taskClassification === "General Tasks") {
      return project.tasks.filter((task) => !task.archived);
    } else if (taskClassification === "Archived") {
      return project.tasks.filter((task) => task.archived);
    } else if (taskClassification === "Finished") {
      return project.tasks.filter(
        (task) => !task.archived && task.progress === "Done",
      );
    } else if (taskClassification === "Unfinished") {
      return project.tasks.filter(
        (task) => !task.archived && task.progress !== "Done",
      );
    } else {
      return project.tasks; // "All"
    }
  }, [project, taskClassification]);

  // Cache sorted tasks (only recalculates when filteredTasks, sortBy, or ascending changes)
  const sortedTasks = useMemo(() => {
    const dup = [...filteredTasks];

    if (sortBy === "Creation Date") {
      return dup.sort((a, b) => {
        const diff =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return ascending ? diff : -diff;
      });
    } else if (sortBy === "Alphabetical") {
      return dup.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return ascending ? comparison : -comparison;
      });
    } else if (sortBy === "Priority") {
      return dup.sort((a, b) => {
        const diff =
          PriorityStats[a.priority].value - PriorityStats[b.priority].value;
        return ascending ? diff : -diff;
      });
    } else if (sortBy === "Due Date") {
      return dup.sort((a, b) => {
        const diff =
          new Date(a.dueDate || "").getTime() -
          new Date(b.dueDate || "").getTime();
        return ascending ? diff : -diff;
      });
    }
    return dup; // Custom
  }, [filteredTasks, sortBy, ascending]);

  // Check if the user is signed in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user && searchParams.get("sample") !== "true") {
        router.push("/login");
        return;
      }
    });
  }, [projectData, router, searchParams]);

  // Handle async params in useEffect
  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.projectId || "");
    });
  }, [params]);

  const projectInfo: ProjectClass | undefined = projectData.find(
    (p) => p.id === id,
  );

  // Go back to the app page if the projectInfo is empty and there is a valid id
  useEffect(() => {
    if (!projectInfo && id)
      router.push(
        `/app${searchParams.get("sample") === "true" ? "?sample=true" : ""}`,
      );
  }, [projectInfo, id, router, searchParams]);

  // Update project state when projectData changes
  useEffect(() => {
    const newProject = projectData.find((p) => p.id === id);
    if (newProject !== undefined) {
      setProject(newProject);
    }
  }, [projectData, id]);

  // Handle Escape key to close search
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showSearch) {
        setShowSearch(false);
        setSearchResults([]);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showSearch]);

  // Handle the case where project is not found
  if (!projectInfo && id) {
    return <div>Project not found</div>;
  }

  // Don't render anything if we don't have project data yet
  if (!project) {
    return <div>Loading...</div>;
  }

  async function createNewTask() {
    // Check if the user is logged in
    if (!auth.currentUser || searchParams.get("sample") === "true") {
      alertMessage("Error", "You must be logged in to create a task.");
      return;
    }

    if (!project) return; // Early return if project is undefined

    let data: string | null | undefined = null;
    while (data === null) {
      data = (await promptMessage("Enter title of new task"))?.trim();
      if (data === null || data === undefined) {
        return; // User cancelled
      } else if (data === "") {
        alertMessage("Error", "Task title cannot be empty");
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

      if (id1 === -1 || id2 === -1) {
        console.error("Invalid task IDs:", active.id, over.id);
        return;
      }

      // Update the task order in the database and in the store
      updateTaskOrder(project.id, id1, id2, dispatch);
    }
  }

  return kanbanMode ? (
    <Kanban tasks={project.tasks} setKanbanMode={setKanbanMode} />
  ) : (
    <div className="project-window">
      <header className="project-header">
        <h1 className="project-title-large">{project.title}</h1>
        <div className="project-action-bar">
          <div className="project-action-bar-left">
            <button className="add-task-button" onClick={createNewTask}>
              + Add Task
            </button>
            <div
              className="search-trigger"
              onClick={() => {
                setSearchResults([]);
                setShowSearch((prev) => !prev);
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5em",
                color: "#64748b",
                fontSize: "0.9rem",
              }}
            >
              <FaSearch />
              <span>Search tasks...</span>
            </div>
          </div>

          <div className="project-action-bar-right">
            <select
              className="sort-select"
              onChange={(e) => setTaskClassification(e.target.value)}
              value={taskClassification}
            >
              <option value="General Tasks">General Tasks</option>
              <option value="Archived">Archived</option>
              <option value="Finished">Finished</option>
              <option value="Unfinished">Unfinished</option>
              <option value="All">All Projects</option>
            </select>
            <select
              className="sort-select"
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option value="Custom">Custom Order</option>
              <option value="Creation Date">Shared Date</option>
              <option value="Alphabetical">A-Z Name</option>
              <option value="Priority">Priority Level</option>
              <option value="Due Date">Goal Date</option>
            </select>
            {sortBy !== "Custom" && (
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  padding: "0 0.5em",
                }}
                onClick={() => setAscending((prev) => !prev)}
              >
                {!ascending ? "↑" : "↓"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="project-main-content">
        <section className="project-task-list">
          {showSearch ? (
            <div className="project-task-list-only">
              <SearchBox
                tasks={project.tasks}
                results={searchResults}
                setResults={setSearchResults}
              />
              {searchResults.map((result) => (
                <SortableTask
                  key={result[4].id}
                  task={result[4]}
                  color={TaskProgressStats[result[4].progress].color}
                  moveable={false}
                  searchDetails={
                    result.slice(0, 4) as [string, string, string, string]
                  }
                />
              ))}
              {searchResults.length === 0 && (
                <div
                  style={{
                    padding: "2em",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No tasks found matching your search.
                </div>
              )}
            </div>
          ) : sortBy !== "Custom" ? (
            <div className="project-task-list-only">
              {sortedTasks.map((task) => (
                <SortableTask
                  key={task.id}
                  task={task}
                  color={TaskProgressStats[task.progress].color}
                  moveable={false}
                />
              ))}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={filteredTasks}
                strategy={verticalListSortingStrategy}
              >
                <div className="project-task-list-only">
                  {sortedTasks.map((task) => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      color={TaskProgressStats[task.progress].color}
                      moveable={true}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        <aside className="project-task-summary">
          <div className="project-info-card">
            <h3 className="info-label">Statistics</h3>
            <ProgressStatus project={project} />
          </div>

          <div className="project-info-card">
            <h3 className="info-label">Resources</h3>
            <AttachedDocs
              links={project.attachedDocs}
              updateFunction={updateProject}
              id={id}
              sample={searchParams.get("sample") === "true"}
            />
          </div>

          <div className="project-info-card">
            <h3 className="info-label">Collaborators</h3>
            <PeopleList
              people={project.people ?? {}}
              projectId={project.id}
              sample={searchParams.get("sample") === "true"}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}
