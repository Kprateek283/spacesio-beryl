"use client";

import { AnimatePresence } from "framer-motion";

export default function ProjectsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AnimatePresence>{modal}</AnimatePresence>
    </>
  );
}
