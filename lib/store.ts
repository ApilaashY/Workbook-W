import { configureStore, createSlice } from "@reduxjs/toolkit";
import { ProjectClass, ProjectObject } from "./DataClasses/ProjectClass";
import { TaskClass } from "./DataClasses/TaskClass";

import { createIdTrail, findTaskById } from "./firebase";

export interface ProjectStore {
  projects: ProjectClass[];
}

export type ProjectUpdateables = "attachedDocs" | "tasks";

export type TaskUpdateables =
  | "title"
  | "description"
  | "progress"
  | "dueDate"
  | "tasks"
  | "attachedDocs"
  | "comments";

const projectSlice = createSlice({
  name: "projects",
  initialState: [] as ProjectObject[],
  reducers: {
    addProject: (state, action: { payload: ProjectObject }) => {
      const index = state.findIndex((proj) => proj.id === action.payload.id);

      if (index !== -1) {
        state[index] = ProjectClass.fromMap(action.payload).toMap();
      } else {
        state.push(ProjectClass.fromMap(action.payload).toMap());
      }
    },
  },
});

export const store = configureStore({
  reducer: {
    projects: projectSlice.reducer,
  },
});

export const { addProject } = projectSlice.actions;

export async function addProjectTask(id: string, data: string) {
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updateProject`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
      category: "tasks",
      data: data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

export async function updateProject(
  id: string,
  category: ProjectUpdateables,
  data: unknown
) {
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updateProject`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
      category: category,
      data: data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

export async function addTask(id: string, data: string) {
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updateTask`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
      category: "tasks",
      data: data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

export async function updateTask(
  id: string,
  category: TaskUpdateables,
  data: unknown
) {
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updateTask`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
      category: category,
      data: data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

export async function deleteTask(id: string) {
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/deleteTask`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}
