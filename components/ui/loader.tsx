"use client";
import { SyncLoader } from "react-spinners";
export const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SyncLoader color="hsl(262.1 83.3% 57.8%)" size={30} />
    </div>
  );
};
