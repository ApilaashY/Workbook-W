import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { ProjectClass, ProjectObject } from "./DataClasses/ProjectClass";
import { TaskClass, TaskObject } from "./DataClasses/TaskClass";

import { popLastTask, createIdTrail, findTaskById } from "./firebase";

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
    updateProject: (
      state,
      action: {
        payload: {
          id: string;
          category: ProjectUpdateables;
          data: unknown;
        };
      }
    ) => {
      const index = state.findIndex(
        (project) => project.id == action.payload.id
      );

      const currentData = state[index];

      state[index] = ProjectClass.fromMap({
        ...currentData,
        [action.payload.category]: action.payload.data,
      } as ProjectObject).toMap();
    },
    addProjectTask: (
      state,
      action: { payload: { id: string; data: string } }
    ) => {
      const proj = state.find((proj) => proj.id === action.payload.id);

      if (proj) {
        proj.tasks = [
          ...(proj.tasks || []),
          new TaskClass(
            action.payload.data,
            proj.id + "-" + ProjectClass.getTaskCount(proj)
          ).toMap(),
        ];
      }
    },
    addTask: (state, action: { payload: { id: string; data: string } }) => {
      const task = findTaskById(state, action.payload.id) as
        | TaskObject
        | undefined;

      if (task) {
        task.tasks = [
          ...(task.tasks || []),
          new TaskClass(
            action.payload.data,
            task.id + "-" + TaskClass.getTaskCount(task)
          ).toMap(),
        ];
      }
    },
    deleteTask: (state, action: { payload: { id: string } }) => {
      const parentTask = findTaskById(state, popLastTask(action.payload.id)) as
        | ProjectObject
        | TaskObject
        | undefined;

      if (!parentTask) return;

      parentTask.tasks ??= [];

      let index = 0;

      for (let i = 0; i < (parentTask.tasks.length || 0); i++) {
        if (parentTask.tasks[i].id == action.payload.id) {
          index = i;
        }
      }

      parentTask.tasks.splice(index, 1);
    },
    updateTask: (
      state,
      action: {
        payload: {
          id: string;
          category: TaskUpdateables;
          data: unknown;
        };
      }
    ) => {
      const idParts = action.payload.id.split("-");
      let currentId: string = idParts[0];

      let previousData: ProjectClass | TaskClass | undefined;
      let currentData: ProjectClass | TaskClass | undefined = (
        state as ProjectClass[]
      ).find((project) => project.id === currentId);

      for (let i = 1; i < idParts.length; i++) {
        currentId += "-" + idParts[i];

        if (currentData === undefined) return undefined;
        else if (!currentData.id.includes("-")) {
          previousData = currentData;
          currentData = (currentData as ProjectClass).tasks.find(
            (task) => task.id === currentId
          );
        } else {
          previousData = currentData;
          currentData = (currentData as TaskClass).tasks.find(
            (task) => task.id === currentId
          );
        }
      }

      const index: number = previousData!.tasks.findIndex(
        (obj) => obj == currentData
      );

      ((previousData as TaskObject).tasks || [])[index] = TaskClass.fromMap({
        ...currentData,
        [action.payload.category]: action.payload.data,
      } as TaskObject).toMap();
    },
  },
});

export const store = configureStore({
  reducer: {
    projects: projectSlice.reducer,
  },
});

export const { addProject } = projectSlice.actions;

const addProjectTaskAsync = createAsyncThunk(
  "projects/addProjectTasksAsync",
  async ({ id, data }: { id: string; data: string }, thunkAPI) => {
    // Do async work here (e.g., API call)
    // Optionally dispatch addProjectTasks here
    thunkAPI.dispatch(projectSlice.actions.addProjectTask({ id, data }));
  }
);

const updateProjectAsync = createAsyncThunk(
  "projects/updateProjectAsync",
  async (
    {
      id,
      category,
      data,
    }: {
      id: string;
      category: ProjectUpdateables;
      data: unknown;
    },
    thunkAPI
  ) => {
    // Do async work here (e.g., API call)
    // Optionally dispatch addProjectTasks here
    thunkAPI.dispatch(
      projectSlice.actions.updateProject({ id, category, data })
    );
  }
);

const addTaskAsync = createAsyncThunk(
  "projects/addTasksAsync",
  async ({ id, data }: { id: string; data: string }, thunkAPI) => {
    // Do async work here (e.g., API call)
    // Optionally dispatch addProjectTasks here
    thunkAPI.dispatch(projectSlice.actions.addTask({ id, data }));
  }
);

const deleteTaskAsync = createAsyncThunk(
  "projects/deleteTasksAsync",
  async ({ id }: { id: string }, thunkAPI) => {
    // Do async work here (e.g., API call)
    // Optionally dispatch addProjectTasks here
    thunkAPI.dispatch(projectSlice.actions.deleteTask({ id }));
  }
);

const updateTaskAsync = createAsyncThunk(
  "projects/updateTasksAsync",
  async (
    {
      id,
      category,
      data,
    }: {
      id: string;
      category: TaskUpdateables;
      data: unknown;
    },
    thunkAPI
  ) => {
    // Do async work here (e.g., API call)
    // Optionally dispatch addProjectTasks here
    thunkAPI.dispatch(projectSlice.actions.updateTask({ id, category, data }));
  }
);

export async function addProjectTask(
  id: string,
  data: string,
  dispatch: typeof store.dispatch
) {
  await dispatch(addProjectTaskAsync({ id, data }));
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updatetask`, {
    method: "POST",
    body: JSON.stringify({
      id: `projects/${createIdTrail(id, store.getState().projects)}`,
      data: findTaskById(store.getState().projects, id) || {},
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

export async function updateProject(
  id: string,
  category: ProjectUpdateables,
  data: unknown,
  dispatch: typeof store.dispatch
) {
  await dispatch(updateProjectAsync({ id, category, data }));
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updatetask`, {
    method: "POST",
    body: JSON.stringify({
      id: `projects/${id}`,
      data: store.getState().projects.find((project) => project.id == id) || {},
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

export async function addTask(
  id: string,
  data: string,
  dispatch: typeof store.dispatch
) {
  await dispatch(addTaskAsync({ id, data }));
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updatetask`, {
    method: "POST",
    body: JSON.stringify({
      id: `projects/${createIdTrail(id, store.getState().projects)}`,
      data: findTaskById(store.getState().projects, id) || {},
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

export async function updateTask(
  id: string,
  category: TaskUpdateables,
  data: unknown,
  dispatch: typeof store.dispatch
) {
  await dispatch(updateTaskAsync({ id, category, data }));
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updatetask`, {
    method: "POST",
    body: JSON.stringify({
      id: `projects/${createIdTrail(id, store.getState().projects)}`,
      data: findTaskById(store.getState().projects, id) || {},
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

export async function deleteTask(id: string, dispatch: typeof store.dispatch) {
  await dispatch(deleteTaskAsync({ id }));
  await fetch(`${process.env.NEXT_PUBLIC_LINK}/api/database/updatetask`, {
    method: "POST",
    body: JSON.stringify({
      id: `projects/${createIdTrail(
        popLastTask(id),
        store.getState().projects
      )}`,
      data: findTaskById(store.getState().projects, popLastTask(id)) || {},
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}
