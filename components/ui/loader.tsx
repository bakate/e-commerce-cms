"use client";
import { SyncLoader } from "react-spinners";
export const Loader = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SyncLoader color="#36d7b7" size={30} />
    </div>
  );
};
