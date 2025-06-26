import type { ProjectObject } from "./DataClasses/ProjectClass";
import type { TaskObject } from "./DataClasses/TaskClass";
import { addProjectTasksAsync, addTasksAsync, findTaskById, store, updateTask } from "./store";
import type { Dispatch } from "@reduxjs/toolkit";

export type AnyObject = ProjectObject | TaskObject;

export const allCommands: {
    [command: string]:
    [string, string, (id: string, projectData: AnyObject | ProjectObject[], newData: string, dispatch: any) => Promise<string>]
} = {
    "OPENPROJECT": ["[Project Name]", "Opens a specific project. Replace [Project Name] with the id of a project. If the user gives another identification for the project such as title, figure out the id. This changes the current directory to the specified project.", openProject],
    "OPENTASK": ["[Task Name]", "Opens a specific task. Replace [Task Name] with the id of a task. If the user gives another identification for the task such as title or description, figure out the id. Use the project database I will give you later to find the id of a task depending on the task title or description or anything else. This changes the current directory to the specified task.", openTask],
    "ADDTASK": ["[Task Name]", "Create a task with the name [Task Name]. Remember, creating a task will not change the current directory, so if you would like to change data in the new task you have to use the opentask instruction. If you need the id of the new task to open it, the id will be the id of the current directory (is it exists) plus a dash then the taskCount, increment the taskCount after the id is created.", addTask],
    "CHANGETASKDESCRIPTION": ["[New Description]", "Changes the description of the current directory's task to the new description. If the current directory is not a task, then only return an ERROR.", changeTaskDescription],
    "CHANGETASKTITLE": ["[New Title]", "Changes the title of the current directory's task to the new title. If the current directory is not a task, then only return an ERROR.", changeTaskTitle],
    "GOTOPARENT": ["", "Goes back to the parent directory.", goToParent]
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

        console.log(currentData);

        id = await allCommands[pieces[0]][2](id, currentData, pieces.slice(1).join(" "), dispatch) ?? id;
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
        await dispatch(addProjectTasksAsync({ id: id, data: newData }));
    } else {
        // This is a task object
        await dispatch(addTasksAsync({ id: id, data: newData }));
    }

    return id;
}

async function changeTaskTitle(id: string, _: AnyObject | ProjectObject[], newData: string, dispatch: Dispatch): Promise<string> {
    dispatch(
        updateTask({ id: id, category: "title", data: newData })
    );
    return id;
}

async function changeTaskDescription(id: string, _: AnyObject | ProjectObject[], newData: string, dispatch: Dispatch): Promise<string> {
    dispatch(
        updateTask({ id: id, category: "description", data: newData })
    );
    return id;
}

async function goToParent(id: string): Promise<string> {
    let pieces = id.split("-");
    if (pieces.length > 0) {
        pieces.pop();
    }
    return pieces.join("-");
}