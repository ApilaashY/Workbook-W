import { ProjectObject } from "./DataClasses/ProjectClass";
import { TaskObject } from "./DataClasses/TaskClass";
import {
  addProjectTask,
  addTask as addTaskStore,
  store,
  updateTask,
  deleteTask as deleteTaskStore,
} from "./store";
import { type Dispatch } from "@reduxjs/toolkit";
import { findTaskById } from "./firebase";
import { confirmMessage } from "./Components/Dialogs/ConfirmDialog";

export type AnyObject = ProjectObject | TaskObject;

export const allCommands: {
  [command: string]: [
    string,
    string,
    (
      id: string,
      projectData: AnyObject | ProjectObject[],
      newData: string,
      dispatch: typeof store.dispatch
    ) => Promise<string>
  ];
} = {
  OPENPROJECT: [
    "[Project Name]",
    "Opens a specific project. Replace [Project Name] with the id of a project. If the user gives another identification for the project such as title, figure out the id. This changes the current directory to the specified project.",
    openProject,
  ],
  OPENTASK: [
    "[Task Name]",
    "Opens a specific task. Replace [Task Name] with the id of a task. If the user gives another identification for the task such as title or description, figure out the id. Use the project database I will give you later to find the id of a task depending on the task title or description or anything else. This changes the current directory to the specified task.",
    openTask,
  ],
  ADDTASK: [
    "[Task Name]",
    "Create a task with the name [Task Name]. Remember, creating a task will not change the current directory, so if you would like to change data in the new task you have to use the opentask instruction. If you need the id of the new task to open it, the id will be the id of the current directory (is it exists) plus a dash then the taskCount, increment the taskCount after the id is created.",
    addTask,
  ],
  CHANGETASKDESCRIPTION: [
    "[New Description]",
    "Changes the description of the current directory's task to the new description. If the current directory is not a task, then only return an ERROR.",
    changeTaskDescription,
  ],
  CHANGETASKTITLE: [
    "[New Title]",
    "Changes the title of the current directory's task to the new title. If the current directory is not a task, then only return an ERROR. The user may refer to the title as the task's name or just say to change the task itself, make sure to interpret these kind of requests as title changes",
    changeTaskTitle,
  ],
  GOTOPARENT: ["", "Goes back to the parent directory.", goToParent],
  DELETETASK: [
    "[Task ID]",
    "Deletes the task with the id of [Task ID]. If the user wants to delete the current task, remember to go to the parent and then remove this task by id.",
    deleteTask,
  ],
  OPENLINK: [
    "[Link Index]",
    "Opens the [Link Index]th link of the attachedDocs list in the current directory.",
    openLink,
  ],
};

export async function executeCommands(
  startId: string,
  commands: string,
  dispatch: Dispatch
) {
  let id = startId;
  const commandList: string[] = commands.split("\n");
  let projectData: ProjectObject[];

  try {
    for (let i = 0; i < commandList.length; i++) {
      if (commandList[i].trim() === "") continue;

      const understandableCommand = generateCommandString(commandList[i], id);

      if (
        understandableCommand.trim() !== "" &&
        !(await confirmMessage("Execute Command", understandableCommand))
      ) {
        console.log("Command execution cancelled by user.");
        return;
      }

      projectData = store.getState().projects;
      const currentData = findTaskById(projectData, id);

      const pieces: string[] = commandList[i].split(" ");

      if (pieces.length === 0 || !currentData) continue;

      id =
        (await allCommands[pieces[0]][2](
          id,
          currentData,
          pieces.slice(1).join(" "),
          dispatch
        )) ?? id;
    }
  } catch (e) {
    console.error("Error executing commands:", e);
  }
}

async function openProject(
  _: string,
  __: AnyObject | ProjectObject[],
  newData: string
): Promise<string> {
  return newData;
}

async function openTask(
  _: string,
  __: AnyObject | ProjectObject[],
  newData: string
): Promise<string> {
  return newData;
}

async function addTask(
  id: string,
  projectData: AnyObject | ProjectObject[],
  newData: string
): Promise<string> {
  if (!(projectData as AnyObject).id.includes("-")) {
    // This is a project object
    await addProjectTask(id, newData);
  } else {
    // This is a task object
    await addTaskStore(id, newData);
  }

  return id;
}

async function changeTaskTitle(
  id: string,
  _: AnyObject | ProjectObject[],
  newData: string
): Promise<string> {
  await updateTask(id, "title", newData);

  return id;
}

async function changeTaskDescription(
  id: string,
  _: AnyObject | ProjectObject[],
  newData: string
): Promise<string> {
  await updateTask(id, "description", newData);

  return id;
}

async function goToParent(id: string): Promise<string> {
  const pieces = id.split("-");
  if (pieces.length > 0) {
    pieces.pop();
  }
  return pieces.join("-");
}

async function deleteTask(
  id: string,
  _: AnyObject | ProjectObject[],
  data: string
): Promise<string> {
  await deleteTaskStore(data);

  return id;
}

async function openLink(
  id: string,
  data: AnyObject | ProjectObject[],
  index: string
): Promise<string> {
  const attachedDocs = (data as AnyObject).attachedDocs;
  const idx = Number(index);
  if (
    attachedDocs &&
    Array.isArray(attachedDocs) &&
    attachedDocs[idx] &&
    attachedDocs[idx][0]
  ) {
    window.open(attachedDocs[idx][1]);
  }

  return id;
}

export function commandValidator(command: string): boolean {
  for (const piece of command.split("\n")) {
    if (piece.trim() === "") continue;

    const subpieces: string[] = piece.split(" ");

    if (subpieces.length === 0) continue;

    if (
      Object.keys(allCommands).find((key) => key === subpieces[0]) === undefined
    ) {
      return false;
    }

    if (
      subpieces.length - 1 !==
      allCommands[subpieces[0]][0]
        .split("&")
        .filter((val) => val.trim().length > 0).length
    ) {
      return false;
    }
  }

  return true;
}

function generateCommandString(command: string, id: string): string {
  const pieces: string[] = command.split(" ");
  if (pieces.length === 0) return "";

  const commandKey = pieces[0];
  if (commandKey === "ADDTASK") {
    return `Add task ${pieces.slice(1).join(" ")}`;
  } else if (commandKey === "CHANGETASKDESCRIPTION") {
    return `Change the description to ${pieces.slice(1).join(" ")}`;
  } else if (commandKey === "CHANGETASKTITLE") {
    const raw = findTaskById(store.getState().projects, id);
    const task = Array.isArray(raw) ? undefined : raw;

    return `Change the title ${task?.title ?? ""} to ${pieces
      .slice(1)
      .join(" ")}`;
  } else if (commandKey === "DELETETASK") {
    const raw = findTaskById(
      store.getState().projects,
      pieces.slice(1).join(" ")
    );
    const task = Array.isArray(raw) ? undefined : raw;

    return `Delete task ${task?.title ?? ""}`;
  } else if (commandKey === "OPENLINK") {
    const raw = findTaskById(store.getState().projects, id);
    const task = Array.isArray(raw) ? undefined : raw;

    return `Open link ${
      task?.attachedDocs?.[parseInt(pieces.slice(1).join(" ")) ?? 0]?.[1] ?? ""
    }`;
  }

  return "";
}
