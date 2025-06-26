import { configureStore, createSlice } from "@reduxjs/toolkit";
import { ProjectClass, type ProjectObject } from "./DataClasses/ProjectClass";
import { TaskClass, type TaskObject } from "./DataClasses/TaskClass";
import { ref, update } from "firebase/database";
import { db } from "./firebase";

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

    console.log(current);

    total += "/tasks/" + currentData.tasks?.findIndex((task) => task.id === current);
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
    addProjectTasks: (
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

        //update(ref(db, "projects/" + proj.id), {...proj});
      }
    },
    addTasks: (state, action: { payload: { id: string; data: string } }) => {
      let task = findTaskById(state, action.payload.id) as TaskObject | undefined;
      console.log(task?.title);
      if (task) {
        task.tasks = [
          ...(task.tasks || []),
          new TaskClass(
            action.payload.data,
            task.id + "-" + TaskClass.getTaskCount(task)
          ).toMap(),
        ];
        //update(ref(db, `projects/${createIdTrail(action.payload.id, state)}`), task);
      }
    },
    updateTask: (
      state,
      action: {
        payload: {
          id: string;
          category: "title" | "description" | "progress";
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

      ((previousData as TaskObject).tasks || [])[index] =
        TaskClass.fromMap({
          ...currentData,
          [action.payload.category]: action.payload.data,
        } as TaskObject).toMap();

      //update(ref(db, `projects/${createIdTrail(action.payload.id, state)}`), previousData!.tasks[index]);
    },
  },
});

export const store = configureStore({
  reducer: {
    projects: projectSlice.reducer,
  },
});

export const { addProject, addProjectTasks, addTasks, updateTask } =
  projectSlice.actions;
