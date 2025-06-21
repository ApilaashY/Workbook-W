import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App/App.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Project } from "./Project/Project.tsx";
import { Task } from "./Subtask/Task.tsx";
import { Login } from "./Intro/Login.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<App />}
          />
          <Route
            path="/project"
            element={<Project />}
          />
          <Route
            path="/project/task/:id"
            element={<Task />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
