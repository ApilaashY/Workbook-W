import type { ProjectObject } from "./DataClasses/ProjectClass";
import type { TaskObject } from "./DataClasses/TaskClass";
import { addProjectTask, addTask as addTaskStore, findTaskById, store, updateTask, deleteTask as deleteTaskStore } from "./store";
import { type Dispatch } from "@reduxjs/toolkit";

export type AnyObject = ProjectObject | TaskObject;

export const allCommands: {
    [command: string]:
    [string, string, (id: string, projectData: AnyObject | ProjectObject[], newData: string, dispatch: any) => Promise<string>]
} = {
    "OPENPROJECT": ["[Project Name]", "Opens a specific project. Replace [Project Name] with the id of a project. If the user gives another identification for the project such as title, figure out the id. This changes the current directory to the specified project.", openProject],
    "OPENTASK": ["[Task Name]", "Opens a specific task. Replace [Task Name] with the id of a task. If the user gives another identification for the task such as title or description, figure out the id. Use the project database I will give you later to find the id of a task depending on the task title or description or anything else. This changes the current directory to the specified task.", openTask],
    "ADDTASK": ["[Task Name]", "Create a task with the name [Task Name]. Remember, creating a task will not change the current directory, so if you would like to change data in the new task you have to use the opentask instruction. If you need the id of the new task to open it, the id will be the id of the current directory (is it exists) plus a dash then the taskCount, increment the taskCount after the id is created.", addTask],
    "CHANGETASKDESCRIPTION": ["[New Description]", "Changes the description of the current directory's task to the new description. If the current directory is not a task, then only return an ERROR.", changeTaskDescription],
    "CHANGETASKTITLE": ["[New Title]", "Changes the title of the current directory's task to the new title. If the current directory is not a task, then only return an ERROR. The user may refer to the title as the task's name or just say to change the task itself, make sure to interpret these kind of requests as title changes", changeTaskTitle],
    "GOTOPARENT": ["", "Goes back to the parent directory.", goToParent],
    "DELETETASK": ["[Task ID]", "Deletes the task with the id of [Task ID]. If the user wants to delete the current task, remember to go to the parent and then remove this task by id.", deleteTask]
}

export async function executeCommands(startId: string, commands: string, dispatch: Dispatch) {
    let id = startId;
    let commandList: string[] = commands.split("\n");
    let projectData: ProjectObject[];

    for (let i = 0; i < commandList.length; i++) {
        projectData = store.getState().projects;
        let currentData = findTaskById(projectData, id);

        let pieces: string[] = commandList[i].split(" ");

        if (pieces.length === 0 || !currentData) continue;

        id = await allCommands[pieces[0]][2](id, currentData, pieces.slice(1).join(" "), dispatch) ?? id
    }
}

async function openProject(_: string, __: AnyObject | ProjectObject[], newData: string): Promise<string> {
    return newData
}

async function openTask(_: string, __: AnyObject | ProjectObject[], newData: string): Promise<string> {
    return newData;
}

async function addTask(id: string, projectData: AnyObject | ProjectObject[], newData: string, dispatch: any): Promise<string> {
    if (!(projectData as AnyObject).id.includes("-")) {
        // This is a project object
        await addProjectTask(id, newData, dispatch);
    } else {
        // This is a task object
        await addTaskStore(id, newData, dispatch);
    }

    return id;
}

async function changeTaskTitle(id: string, _: AnyObject | ProjectObject[], newData: string, dispatch: Dispatch): Promise<string> {
    await updateTask(id, "title", newData, dispatch);

    return id;
}

async function changeTaskDescription(id: string, _: AnyObject | ProjectObject[], newData: string, dispatch: Dispatch): Promise<string> {
    await updateTask(id, "description", newData, dispatch);

    return id;
}

async function goToParent(id: string): Promise<string> {
    let pieces = id.split("-");
    if (pieces.length > 0) {
        pieces.pop();
    }
    return pieces.join("-");
}

async function deleteTask(id: string, _: AnyObject | ProjectObject[], data: string, dispatch: Dispatch): Promise<string> {
    await deleteTaskStore(data, dispatch);

    return id;
}

