import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { ProjectClass, ProjectObject } from "./DataClasses/ProjectClass";

import { auth, createIdTrail, findTaskById, popLastTask } from "./firebase";
import { TaskClass } from "./DataClasses/TaskClass";
import { arrayMove } from "@dnd-kit/sortable";

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
  | "comments"
  | "priority";

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
    updateTaskOrder: (
      state,
      action: {
        payload: {
          id: string;
          active: number;
          over: number;
        };
      }
    ) => {
      const idParts = action.payload.id.split("-");
      let currentId: string = idParts[0];

      let currentData: ProjectClass | TaskClass | undefined = (
        state as ProjectClass[]
      ).find((project) => project.id === currentId);

      for (let i = 1; i < idParts.length; i++) {
        currentId += "-" + idParts[i];

        if (currentData === undefined) return undefined;
        else if (!currentData.id.includes("-")) {
          currentData = (currentData as ProjectClass).tasks.find(
            (task) => task.id === currentId
          );
        } else {
          currentData = (currentData as TaskClass).tasks.find(
            (task) => task.id === currentId
          );
        }
      }

      if (!currentData) return;
      currentData.tasks = arrayMove(
        currentData.tasks,
        action.payload.active,
        action.payload.over
      );
    },
    clearProjects: (state) => {
      state.filter(() => false); // Clear the state by filtering all items
    },
    flipInvite: (state, action) => {
      const index = state.findIndex((proj) => proj.id === action.payload);
      if (index !== -1) {
        state[index].invite = !state[index].invite;
      }
    },
    updateCommentData: (state, action) => {
      const idParts = action.payload.id.split("-");
      let currentId: string = idParts[0];

      let currentData: ProjectClass | TaskClass | undefined = (
        state as ProjectClass[]
      ).find((project) => project.id === currentId);

      for (let i = 1; i < idParts.length; i++) {
        currentId += "-" + idParts[i];

        if (currentData === undefined) return undefined;
        else if (!currentData.id.includes("-")) {
          currentData = (currentData as ProjectClass).tasks.find(
            (task) => task.id === currentId
          );
        } else {
          currentData = (currentData as TaskClass).tasks.find(
            (task) => task.id === currentId
          );
        }
      }

      if (!currentData) return;

      currentData.comments = action.payload.comments;
    },

    updateTask: (state, action) => {
      // Update the task on the user's side immediately
      const task = findTaskById(state, action.payload.id);
      if (!task) return; // If task is not found, exit the function

      // Update the task property based on the category
      (task as any)[action.payload.category] = action.payload.data;
    },
  },
});

export const store = configureStore({
  reducer: {
    projects: projectSlice.reducer,
  },
});

export const { addProject, clearProjects, flipInvite, updateCommentData } =
  projectSlice.actions;

export const updateTaskOrderAsync = createAsyncThunk(
  "projects/updateTaskOrderAsync",
  async (
    { id, active, over }: { id: string; active: number; over: number },
    thunkAPI
  ) => {
    thunkAPI.dispatch(
      projectSlice.actions.updateTaskOrder({ id, active, over })
    );
  }
);

export async function addProjectTask(id: string, data: string) {
  const token = await auth.currentUser?.getIdToken();

  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updateProject`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
      category: "tasks",
      data: data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`, // Add this line
    },
  });
}

export async function updateProject(
  id: string,
  category: ProjectUpdateables,
  data: unknown
) {
  const token = await auth.currentUser?.getIdToken();

  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updateProject`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
      category: category,
      data: data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`, // Add this line
    },
  });
}

export async function addTask(id: string, data: string) {
  const token = await auth.currentUser?.getIdToken();

  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updateTask`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
      category: "tasks",
      data: data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateTask(
  id: string,
  category: TaskUpdateables,
  data: unknown
) {
  // Update the task on the user's side immediately
  projectSlice.actions.updateTask({ id, category, data });

  // Update the task on the database side
  const token = await auth.currentUser?.getIdToken();

  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updateTask`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
      category: category,
      data: data,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteTask(id: string) {
  const token = await auth.currentUser?.getIdToken();

  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/deleteTask`, {
    method: "POST",
    body: JSON.stringify({
      id: id,
      path: `projects/${createIdTrail(
        popLastTask(id),
        store.getState().projects
      )}`,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateTaskOrder(
  id: string,
  active: number,
  over: number,
  dispatch: typeof store.dispatch
) {
  const token = await auth.currentUser?.getIdToken();

  await dispatch(updateTaskOrderAsync({ id, active, over }));
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updateTaskOrder`, {
    method: "POST",
    body: JSON.stringify({
      path: `projects/${createIdTrail(id, store.getState().projects)}`,
      active: active,
      over: over,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`, // Add this line
    },
  });
}
