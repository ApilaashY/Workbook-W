import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { ref, update } from "firebase/database";
import { db } from "./firebase";
import { ProjectClass, ProjectObject } from "./DataClasses/ProjectClass";
import { TaskClass, TaskObject } from "./DataClasses/TaskClass";

export interface ProjectStore {
  projects: ProjectClass[];
}

export function findTaskById(
  data: ProjectObject[],
  id: string
): TaskObject | ProjectObject | ProjectObject[] | undefined {
  if (!id) return data;

  const idParts = id.split("-");
  let currentId: string = idParts[0];

  let currentData: ProjectClass | TaskClass | undefined = (
    data as ProjectClass[]
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
  return currentData as TaskClass | undefined;
}

export function popLastTask(id: string): string {
  let pieces: string[] = id.split("-");
  if (pieces.length > 0) {
    pieces.pop();
  }
  return pieces.join("-");
}

function createIdTrail(id: string, data: ProjectObject[]): string {
  let parts = id.split("-");
  let total = parts[0];
  let current = parts[0];
  let currentData = data.find((proj) => proj.id === parts[0]);

  for (let i = 1; i < parts.length; i++) {
    if (!currentData) {
      return total;
    }

    current += "-" + parts[i];

    total +=
      "/tasks/" + currentData.tasks?.findIndex((task) => task.id === current);
    currentData = currentData.tasks?.find((task) => task.id === current);
  }

  return total;
}

const projectSlice = createSlice({
  name: "projects",
  initialState: [
    // ProjectClass.fromMap({
    //   title: "Project 1",
    //   id: "1",
    //   tasks: [
    //     { id: "1-0", title: "Design UI" },
    //     { id: "1-1", title: "Set up backend" },
    //   ],
    // }).toMap(),
    // ProjectClass.fromMap({
    //   title: "Project 2",
    //   id: "2",
    //   tasks: [
    //     { id: "2-0", title: "Write documentation" },
    //     { id: "2-1", title: "Deploy to server" },
    //   ],
    // }).toMap(),
    // ProjectClass.fromMap({
    //   title: "Project 3",
    //   id: "3",
    //   tasks: [{ id: "3-0", title: "Research competitors" }],
    // }).toMap(),
  ] as ProjectObject[],
  reducers: {
    addProject: (state, action: { payload: ProjectObject }) => {
      let index = state.findIndex((proj) => proj.id === action.payload.id);

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
          category: "attachedDocs" | "tasks";
          data: any;
        };
      }
    ) => {
      let index = state.findIndex((project) => project.id == action.payload.id);

      let currentData = state[index];

      state[index] = ProjectClass.fromMap({
        ...currentData,
        [action.payload.category]: action.payload.data,
      } as ProjectObject).toMap();
    },
    addProjectTask: (
      state,
      action: { payload: { id: string; data: string } }
    ) => {
      let proj = state.find((proj) => proj.id === action.payload.id);

      if (proj) {
        proj.tasks = [
          ...(proj.tasks || []),
          new TaskClass(
            action.payload.data,
            proj.id + "-" + ProjectClass.getTaskCount(proj)
          ).toMap(),
        ];

        update(ref(db, "projects/" + proj.id), { ...proj });
      }
    },
    addTask: (state, action: { payload: { id: string; data: string } }) => {
      let task = findTaskById(state, action.payload.id) as
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
      let parentTask = findTaskById(state, popLastTask(action.payload.id)) as
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
          category: "title" | "description" | "progress" | "tasks" | "dueDate";
          data: any;
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

      let index: number = previousData!.tasks.findIndex(
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
      category: "attachedDocs" | "tasks";
      data: any;
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
      category: "title" | "description" | "progress" | "tasks" | "dueDate";
      data: any;
    },
    thunkAPI
  ) => {
    // Do async work here (e.g., API call)
    // Optionally dispatch addProjectTasks here
    thunkAPI.dispatch(projectSlice.actions.updateTask({ id, category, data }));
  }
);

export async function addProjectTask(id: string, data: string, dispatch: any) {
  await dispatch(addProjectTaskAsync({ id, data }));
  update(
    ref(db, `projects/${createIdTrail(id, store.getState().projects)}`),
    findTaskById(store.getState().projects, id)!
  );
}

export async function updateProject(
  id: string,
  category: "attachedDocs" | "tasks",
  data: any,
  dispatch: any
) {
  await dispatch(updateProjectAsync({ id, category, data }));
  update(
    ref(db, `projects/${id}`),
    store.getState().projects.find((project) => project.id == id)!
  );
}

export async function addTask(id: string, data: string, dispatch: any) {
  await dispatch(addTaskAsync({ id, data }));
  update(
    ref(db, `projects/${createIdTrail(id, store.getState().projects)}`),
    findTaskById(store.getState().projects, id)!
  );
}

export async function updateTask(
  id: string,
  category: "title" | "description" | "progress" | "tasks" | "dueDate",
  data: any,
  dispatch: any
) {
  await dispatch(updateTaskAsync({ id, category, data }));
  update(
    ref(db, `projects/${createIdTrail(id, store.getState().projects)}`),
    findTaskById(store.getState().projects, id)!
  );
}

export async function deleteTask(id: string, dispatch: any) {
  await dispatch(deleteTaskAsync({ id }));

  update(
    ref(
      db,
      `projects/${createIdTrail(popLastTask(id), store.getState().projects)}`
    ),
    findTaskById(store.getState().projects, popLastTask(id))!
  );
}
