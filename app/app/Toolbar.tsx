import "./Toolbar.css";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { GoogleGenAI } from "@google/genai";
import Link from "next/link";
import { ProjectClass } from "@/lib/DataClasses/ProjectClass";
import { TaskClass } from "@/lib/DataClasses/TaskClass";
import { allCommands, executeCommands } from "@/lib/executeCommands";
import { findTaskById, ProjectStore, store } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

async function getSpeechInput(): Promise<string> {
  return new Promise((resolve) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      resolve("");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      resolve(event.results[0][0].transcript);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      alert("Speech recognition error: " + event.error);
      resolve("");
    };
    recognition.onend = () => {};
    recognition.start();
  });
}

export default function Toolbar() {
  const params = useParams<{ projectId?: string; taskId?: string }>();
  const id = params.projectId || params.taskId || "";
  const dispatch = useDispatch();
  const router = useRouter();
  const projectData: ProjectClass[] = useSelector(
    (state: ProjectStore) => state.projects
  );
  const [stack, setStack] = useState<(ProjectClass | TaskClass)[]>([]);
  const [hideMenu, setHideMenu] = useState<boolean>(true);

  async function AICommands() {
    const ai = new GoogleGenAI({
      apiKey: "AIzaSyBdJwUyanHls9Cw05xGm8JfK64UGwUoc4Q",
    });

    const systemInstruction =
      "Your name is Terrance, an agentic AI for a project management software. I will tell you to do something to the project, you do not have the capabilities to do that, instead, turn my request into a list of instructions, each instruction on a new line. Return the list of instructions to me, your list of instructions will be given to a function in this program that will execute them. " +
      "All possible instructions are as follows " +
      Object.entries(allCommands).map(
        ([command, description]) =>
          `${command} ${description[0]} (${description[1]})`
      ) +
      ". When I reference projects or tasks, I may make spelling mistakes, please correct them according to the project database given " +
      ". The structure of the project database is either a list of projects, a project, or a task. You can tell if the current directory is a project or task by looking at the id. If the id contains a dash, it is a task, if not, it is a project. Here is the typescript interface for a project and task:" +
      "interface ProjectObject {title: string;id: string;tasks?: TaskObject[];taskCount?: number;}" +
      ". interface TaskObject {title: string;description?: string;id: string;progress?: TaskProgress;tasks?: TaskObject[];taskCount?: number;}" +
      ". As a note, remember that if you are updating multiple tasks or projects, you have to use OPENPROJECT/OPENTASK and GOTOPARENT to go through every task or project." +
      "If you return an error, please explain why it is an error." +
      "Unless otherwise specified, assume the instructions are taking place in the current project or task directory. " +
      "If you have no instructions, leave the [List of Instructions] empty. ";
    // + "The [Your General Response] section should be things you want to say to me that is not instructions. For example, if I tell you to add a task, you may want the general response to be, Okay I have added a new tasked named whatever. "
    // + "In the general response, speak as if you did the things the instructions are supposed to do, do not mention how you created or wrote a list of instructions. "

    const spoken = await getSpeechInput();
    const userInput = spoken || prompt("Enter your command") || "";

    console.log(userInput);

    ai.models
      .generateContent({
        model: "gemini-2.5-flash",
        contents:
          "Turn this request into a formal list of instruction: " +
          userInput +
          ". If you don't understand what to do and want to throw an error, instead of the error, please explain why or what you understand and what you need to understand the request. Here is the current project or task directory: " +
          JSON.stringify(findTaskById(projectData, id)),
        config: {
          thinkingConfig: {
            thinkingBudget: 0,
          },
          systemInstruction: systemInstruction,
        },
      })
      .then((response) => {
        console.log(response.text);
        if (prompt("Enter anything to execute commands: ") != null) {
          executeCommands(id, response.text || "", dispatch);
        }
      });
  }

  useEffect(() => {
    if (!id || !id.includes("-")) {
      setStack([]);
      return;
    }

    const newStack = new Array<ProjectClass | TaskClass>(
      id.split("-").length - 1
    );

    const idParts = id.split("-");
    idParts.pop(); // Remove the current page from the list of ids
    let currentId: string = idParts[0];
    let currentData: ProjectClass | TaskClass | undefined = (
      projectData as ProjectClass[]
    ).find((project) => project.id === currentId);
    if (!currentData) {
      router.push("/app");
    } else {
      newStack[0] = currentData;
    }

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

      if (!currentData) {
        router.push("/app");
      } else {
        newStack[i] = currentData;
      }
    }

    setStack(newStack);
  }, [id, projectData, router]);

  return (
    <Provider store={store}>
      <div className="mobile-menu-toggle">
        <h1
          onClick={() => setHideMenu((prev) => !prev)}
          style={!hideMenu ? { marginRight: "50vw" } : {}}
        >
          ☰
        </h1>
      </div>
      {hideMenu ? null : (
        <div
          className={`close-mobile-menu ${hideMenu ? "" : "show-toolbar-menu"}`}
          onClick={() => setHideMenu(true)}
        ></div>
      )}
      <div className={`toolbar ${hideMenu ? "" : "show-toolbar-menu"}`}>
        <div className="toolbar-top-section">
          <Link href="/app" onClick={() => setStack([])}>
            <h2 className="toolbar-title">Projects</h2>
          </Link>
          <div className="toolbar-breadcrumbs">
            {stack.map((item, index) => {
              return (
                <div key={item.id}>
                  <h2
                    style={{
                      textAlign: "center",
                      color: "white",
                      margin: "0.25em",
                    }}
                  >
                    V
                  </h2>
                  <Link
                    href={
                      !item.id.includes("-")
                        ? `/app/project/${item.id}`
                        : `/app/project/task/${item.id}`
                    }
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
          <button className="terrance-button" onClick={AICommands}>
            Ask Terrance
          </button>
          <h2 className="toolbar-title">Profile</h2>
          <Link href="/app/settings">
            <h2 className="toolbar-title">Settings</h2>
          </Link>
        </div>
      </div>
    </Provider>
  );
}
