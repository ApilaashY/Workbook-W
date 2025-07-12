"use client";

import "./Toolbar.css";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import Toolbar from "./Toolbar";


export default function AppLayout({
    children,
}: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <div className="main-window">
                <Toolbar />
                {children}
            </div>
        </Provider>
    );
}