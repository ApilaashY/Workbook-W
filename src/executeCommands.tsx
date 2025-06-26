import type { ProjectObject } from "./DataClasses/ProjectClass";
import type { TaskObject } from "./DataClasses/TaskClass";
import { addProjectTasks, addTasks, findTaskById, updateTask } from "./store";
import type { Dispatch } from "@reduxjs/toolkit";

export type AnyObject = ProjectObject | TaskObject;

export const allCommands: {
    [command: string]:
    [string, string, (id: string, projectData: AnyObject | ProjectObject[], newData: string, dispatch: Dispatch) => string]
} = {
    "OPENPROJECT": ["[Project Name]", "Opens a specific project. Replace [Project Name] with the id of a project. If the user gives another identification for the project such as title, figure out the id. This changes the current directory to the specified project.", openProject],
    "OPENTASK": ["[Task Name]", "Opens a specific task. Replace [Task Name] with the id of a task. If the user gives another identification for the task such as title or description, figure out the id. Use the project database I will give you later to find the id of a task depending on the task title or description or anything else. This changes the current directory to the specified task.", openTask],
    "ADDTASK": ["[Task Name]", "Create a task with the name [Task Name]. Creating a task will change the current directory to the new task, so the instructions done after adding a new task will be done within the new task.", addTask],
    "CHANGETASKDESCRIPTION": ["[New Description]", "Changes the description of the current directory's task to the new description. If the current directory is not a task, then only return an ERROR.", changeTaskDescription]
}

export function executeCommands(startId: string, projectData: ProjectObject[], commands: string, dispatch: Dispatch) {
    let id = startId;
    let commandList: string[] = commands.split("\n");

    for (let i = 0; i < commandList.length; i++) {
        let currentData = findTaskById(projectData, id);

        let pieces: string[] = commandList[i].split(" ");

        if (pieces.length === 0 || !currentData) continue;

        id = allCommands[pieces[0]][2](id, currentData, pieces.slice(1).join(" "), dispatch) ?? id;

        console.log(id);
        console.log(pieces.slice(1).join(" "));
        console.log(currentData);
    }
}

function openProject(id: string, projectData: AnyObject | ProjectObject[], newData: string): string {
    return (projectData as ProjectObject[]).find((proj) => proj.id == newData)?.id ?? id;
}

function openTask(id: string, projectData: AnyObject | ProjectObject[], newData: string): string {
    return (projectData as (AnyObject)).tasks?.find((task) => task.id == newData)?.id ?? id;
}

function addTask(id: string, projectData: AnyObject | ProjectObject[], newData: string, dispatch: Dispatch): string {
    const oldLen: number = (projectData as AnyObject).taskCount ?? 0;
    if (!(projectData as AnyObject).id.includes("-")) {
        // This is a project object
        dispatch(addProjectTasks({ id: id, data: newData }));
    } else {
        // This is a task object
        dispatch(addTasks({ id: id, data: newData }))
    }

    return id + "-" + (projectData as AnyObject).taskCount?.toString() || "";
}

function changeTaskDescription(id: string, _: AnyObject | ProjectObject[], newData: string, dispatch: Dispatch): string {
    dispatch(
        updateTask({ id: id, category: "description", data: newData })
    );
    return id;
}