"use client";

import "./Toolbar.css";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import Toolbar from "./Toolbar";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <AppSuspenseWrapper>{children}</AppSuspenseWrapper>
      </Suspense>
    </Provider>
  );
}

function AppSuspenseWrapper({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();

  return (
    <div className="main-window">
      <Toolbar searchParams={params} />
      {children}
    </div>
  );
}
