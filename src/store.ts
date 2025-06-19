import { configureStore, createSlice } from "@reduxjs/toolkit";
import { ProjectClass, type ProjectObject } from "./DataClasses/ProjectClass";
import { TaskClass, type TaskObject } from "./DataClasses/TaskClass";

export interface ProjectStore {
  projects: ProjectClass[];
}

function findTaskById(
  data: ProjectObject[],
  id: string
): TaskObject | undefined {
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
      currentData = (currentData as TaskClass).subtasks.find(
        (subtask) => subtask.id === currentId
      );
    }
  }
  return currentData as TaskClass | undefined;
}

const projectSlice = createSlice({
  name: "projects",
  initialState: [
    ProjectClass.fromMap({
      title: "Project 1",
      id: "1",
      tasks: [
        { id: "1-0", title: "Design UI" },
        { id: "1-1", title: "Set up backend" },
      ],
    }).toMap(),
    ProjectClass.fromMap({
      title: "Project 2",
      id: "2",
      tasks: [
        { id: "2-0", title: "Write documentation" },
        { id: "2-1", title: "Deploy to server" },
      ],
    }).toMap(),
    ProjectClass.fromMap({
      title: "Project 3",
      id: "3",
      tasks: [{ id: "3-0", title: "Research competitors" }],
    }).toMap(),
  ],
  reducers: {
    addTasks: (state, action: { payload: { id: string; data: string } }) => {
      let task = findTaskById(state, action.payload.id);
      console.log(task?.title);
      if (task) {
        task.subtasks = [
          ...(task.subtasks || []),
          new TaskClass(
            action.payload.data,
            task.id + "-" + TaskClass.getTaskCount(task)
          ).toMap(),
        ];
      }
    },
    updateTask: (
      state,
      action: {
        payload: { id: string; category: "title" | "description"; data: any };
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
          currentData = (currentData as TaskClass).subtasks.find(
            (subtask) => subtask.id === currentId
          );
        }
      }

      let index: number;
      if (!previousData?.id.includes("-")) {
        index = (previousData as ProjectClass).tasks.findIndex(
          (obj) => obj == currentData
        );

        ((previousData as ProjectObject).tasks || [])[index] =
          TaskClass.fromMap({
            ...currentData,
            [action.payload.category]: action.payload.data,
          } as TaskObject).toMap();
      } else {
        index = (previousData as TaskClass).subtasks.findIndex(
          (obj) => obj == currentData
        );

        (previousData as TaskClass).subtasks[index] = TaskClass.fromMap({
          ...currentData,
          [action.payload.category]: action.payload.data,
        } as TaskObject);
      }
    },
  },
});

export const store = configureStore({
  reducer: {
    projects: projectSlice.reducer,
  },
});

export const { addTasks, updateTask } = projectSlice.actions;
