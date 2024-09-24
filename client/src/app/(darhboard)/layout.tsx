"use client";
import Sidebar from "@/components/layout/sidebar";
import React from "react";
import Header from "@/components/header";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-5 px-5 lg:pl-0">
        <Sidebar />
        <div>
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
