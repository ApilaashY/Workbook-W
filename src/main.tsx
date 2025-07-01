import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App/App.tsx";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Project } from "./Project/Project.tsx";
import { Task } from "./Task/Task.tsx";
import { Login } from "./Login/Login.tsx";
import { Signup } from "./Signup/Signup.tsx";
import { ForgotPassword } from "./ForgotPassword/ForgotPassword.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/project/task/:id" element={<Task />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
