import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { ProjectClass, ProjectObject } from "./DataClasses/ProjectClass";
import { TaskClass, TaskObject } from "./DataClasses/TaskClass";

const firebaseConfig = {
  apiKey: "AIzaSyAF723ZDsQ8QoiDDSQS6F44sJMtJY98NBo",
  authDomain: "workbook-b27a1.firebaseapp.com",
  databaseURL: "https://workbook-b27a1-default-rtdb.firebaseio.com",
  projectId: "workbook-b27a1",
  storageBucket: "workbook-b27a1.appspot.com",
  messagingSenderId: "456143205277",
  appId: "1:456143205277:web:9a142df8e17814c4d47574",
  measurementId: "G-1758MD6DX9",
};

// Initialize Firebase and needed services
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const fdb = getFirestore(app);
export const auth = getAuth(app);

// Global functions for data manipulation
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

export function popLastTask(id: string): string {
  const pieces: string[] = id.split("-");
  if (pieces.length > 0) {
    pieces.pop();
  }
  return pieces.join("-");
}

export function createIdTrail(id: string, data: ProjectObject[]): string {
  const parts = id.split("-");
  let total = parts[0];
  let current = parts[0];
  let currentData: ProjectObject | TaskObject | undefined = data.find(
    (proj) => proj.id === parts[0]
  );

  for (let i = 1; i < parts.length; i++) {
    if (!currentData) {
      return total;
    }

    current += "-" + parts[i];

    total +=
      "/tasks/" + currentData.tasks?.findIndex((task) => task.id === current);
    currentData = currentData.tasks?.find((task) => task.id === current);
  }

  return total;
}
