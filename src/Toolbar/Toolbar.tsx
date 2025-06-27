import { Link, useLocation } from "react-router-dom";
import "./Toolbar.css";
import { ProjectClass } from "../DataClasses/ProjectClass";
import { TaskClass } from "../DataClasses/TaskClass";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findTaskById, type ProjectStore } from "../store";
import { GoogleGenAI } from "@google/genai";
import { allCommands, executeCommands } from "../executeCommands";

async function getSpeechInput(): Promise<string> {
  return new Promise((resolve, _) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      resolve("");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      resolve(event.results[0][0].transcript);
    };
    recognition.onerror = (event: any) => {
      alert("Speech recognition error: " + event.error);
      resolve("");
    };
    recognition.onend = () => { };
    recognition.start();
  });
}

export function Toolbar() {

  const location = useLocation();
  const dispatch = useDispatch();
  const [stack, setStack] = useState<(ProjectClass | TaskClass)[]>([]);
  let projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );

  async function AICommands() {

    const ai = new GoogleGenAI({ apiKey: "AIzaSyBdJwUyanHls9Cw05xGm8JfK64UGwUoc4Q" });

    const systemInstruction = "Your name is Terrance, an agentic AI for a project management software. I will tell you to do something to the project, you do not have the capabilities to do that, instead, turn my request into a list of instructions, each instruction on new line. Return the list of instructions to me, your list of instructions will be given to a function in this program that will execute them. All possible instructions are as follows "
      + Object.entries(allCommands).map(([command, description]) => `${command} ${description[0]} (${description[1]})`)
      + ". When I reference projects or tasks, I may make spelling mistakes, please correct them according to the project database given "
      + ". The structure of the project database is either a list of projects, a project, or a task. You can tell if the current directory is a project or task by looking at the id. If the id contains a dash, it is a task, if not, it is a project. Here is the typescript interface for a project and task:"
      + "interface ProjectObject {title: string;id: string;tasks?: TaskObject[];taskCount?: number;}"
      + ". interface TaskObject {title: string;description?: string;id: string;progress?: TaskProgress;tasks?: TaskObject[];taskCount?: number;}"
      + ". As a note, remember that if you are updating multiple tasks or projects, you have to use OPENPROJECT/OPENTASK and GOTOPARENT to go through every task or project.";
    // + "For all of your messages please follow the same format. Split your text into 2 sections, the first will be your general speach, such as greetings if I greeted you, or affirmations of what you did. The second section will be the list of instructions following the outline above. Split these 2 sections with 3 new lines."
    //   + "You do not always need instructions, but always include a small message."
    + "If you return an error, please explain why it is an error."
      + "Unless otherwise specified, assume the instructions are taking place in the current project or task directory."
      + "Make sure all of the task and project ids you mention either exist already, or are ids of tasks you are making in the instructions."


    const spoken = await getSpeechInput();
    const userInput = spoken || prompt("Enter your command", "In the do something project, change the description of this task to I like Cheese") || "";

    console.log(userInput);

    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Turn this request into a formal list of instruction: " + userInput + ". If you don't understand what to do and want to throw an error, instead of the error, please explain why or what you understand and what you need to understand the request. Here is the current project or task directory: " + JSON.stringify(findTaskById(projectData, location.state as string)),
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        temperature: 0,
        systemInstruction: systemInstruction
      },
    }).then((response) => {
      console.log(response.text)
      if (prompt("Enter anything to execute commands: ") != null) {
        executeCommands(location.state, response.text || "", dispatch);
      }
    }
    );
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
