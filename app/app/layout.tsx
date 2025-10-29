"use client";

import "./Toolbar.css";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import Toolbar from "./Toolbar";
import { useSearchParams } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();

  return (
    <Provider store={store}>
      <div className="main-window">
        <Toolbar searchParams={params} />
        {children}
      </div>
    </Provider>
  );
}
