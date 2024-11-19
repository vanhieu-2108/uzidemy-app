"use client";
import Header from "@/components/header";
import Sidebar from "@/components/layout/sidebar";
import React from "react";
import NextTopLoader from "nextjs-toploader";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-5 px-5 lg:pl-0">
        <Sidebar />
        <div>
          <div className="z-10 py-1">
            <NextTopLoader color="#78B3CE" showSpinner={false} />
          </div>
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
