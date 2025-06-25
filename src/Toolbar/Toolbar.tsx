import { Link, useLocation } from "react-router-dom";
import "./Toolbar.css";
import { ProjectClass } from "../DataClasses/ProjectClass";
import { TaskClass } from "../DataClasses/TaskClass";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { findTaskById, type ProjectStore } from "../store";
import { GoogleGenAI } from "@google/genai";

const allCommands = {
  "OPENPROJECT [Project Name]": "Opens a specific project. Replace [Project Name] with the name of a project. This changes the current directory to the specified project.",
  "OPENTASK [Task Name]": "Opens a specific task. Replace [Task Name] with the name of a task. This changes the current directory to the specified task.",
  "ADDTASK [Task Name]": "Create a task with the name [Task Name]",
  "CHANGEDESCRIPTION [New Description]": "Changes the description of the current directory's task to the new description. If the current directory is not a task, then only return an ERROR."
}

export function Toolbar() {

  const location = useLocation();
  const [stack, setStack] = useState<(ProjectClass | TaskClass)[]>([]);
  let projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  function AICommands() {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBdJwUyanHls9Cw05xGm8JfK64UGwUoc4Q" });

    const prompt = "Your name is Terrance, an agentic AI for a project managementsoftware. You job is to use what I ask you, and turn it into a list of instructions, each instruction will be on seperate lines. All possible instructions are as follows "
      + Object.entries(allCommands).map(([command, description]) => `${command} (${description})`)
      + ". When I reference projects or tasks, I may make spelling mistakes, please correct them according to the project database given: "
      + JSON.stringify(findTaskById(projectData, location.state as string));

    console.log(prompt);

    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "In the do something project, change the description of this task to I like Cheese",
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        temperature: 0,
        systemInstruction: prompt
      },
    }).then((response) =>
      console.log(response.text));
  }

  useEffect(() => {
    if (!location.state || !location.state.includes("-")) {
      setStack([]);
      return;
    }

    let newStack = new Array<ProjectClass | TaskClass>(location.state.split("-").length - 1);

    const idParts = location.state.split("-");
    idParts.pop(); // Remove the current page from the list of ids
    let currentId: string = idParts[0];
    let currentData: ProjectClass | TaskClass | undefined = (
      projectData as ProjectClass[]
    ).find((project) => project.id === currentId);
    newStack[0] = currentData ?? ProjectClass.fromMap({ title: "ERROR", id: "" });

    for (let i = 1; i < idParts.length; i++) {
      currentId += "-" + idParts[i];

      if (currentData === undefined) return undefined;
      else if (!currentData.id.includes("-")) {
        currentData = (currentData as ProjectClass).tasks.find(
          (task) => task.id === currentId
        );
      } else {
        currentData = (currentData as TaskClass).tasks.find(
          (subtask) => subtask.id === currentId
        );
      }

      newStack[i] = currentData ?? TaskClass.fromMap({ title: "ERROR", id: "" });
    }

    setStack(newStack);
  }, [location.state, projectData])

  return (
    <div className="toolbar">
      <div className="toolbar-top-section">
        <Link to="/" onClick={() => setStack([])}>
          <h2 className="toolbar-title">Projects</h2>
        </Link>
        <div className='toolbar-breadcrumbs'>
          {stack.map((item, index) => {
            return (
              <div key={item.id}>
                <h2
                  style={{ textAlign: "center", color: "white", margin: "0.25em" }}>V</h2>
                <Link
                  to={
                    !item.id.includes("-") ? "/project" : `/project/task/${item.id}`
                  }
                  state={item.id}
                  onClick={() => setStack((prev) => prev.slice(0, index))}
                >
                  <h2 className="toolbar-title">{item.title}</h2>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className="toolbar-bottom-section">
        <button className="terrance-button" onClick={AICommands}>Ask Terrance</button>
        <h2 className="toolbar-title">Profile</h2>
        <h2 className="toolbar-title">Settings</h2>
      </div>
    </div>
  );
}
