import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { ProjectClass } from "./DataClasses/ProjectClass";

export interface ProjectStore {
  projects: ProjectClass[];
}

const projectSlice = createSlice({
  name: "projects",
  initialState: [
    {
      title: "Project 1",
      id: "1",
      tasks: [
        { id: "1-0", title: "Design UI" },
        { id: "1-1", title: "Set up backend" },
      ],
    },
    {
      title: "Project 2",
      id: "2",
      tasks: [
        { id: "2-0", title: "Write documentation" },
        { id: "2-1", title: "Deploy to server" },
      ],
    },
    {
      title: "Project 3",
      id: "3",
      tasks: [{ id: "3-0", title: "Research competitors" }],
    },
  ],
  reducers: {},
});

export const store = configureStore({
  reducer: {
    projects: projectSlice.reducer,
  },
});
