import { useEffect, useRef } from "react";

import { useMazeStore } from "@/store/maze-store";
import { MazeOverlay } from "./maze-overlay";

export default function Maze() {
  const parentRef = useRef<HTMLDivElement>(null);
  const initializeMaze = useMazeStore((state) => state.initializeMaze);
  const resetMaze = useMazeStore((state) => state.resetMaze);

  const createMaze = () => {
    if (!parentRef.current) return;

    const size = 6;
    const startX = Math.ceil(size / 2);
    const startY = Math.ceil(size / 2);

    initializeMaze(
      {
        startX,
        startY,
        width: size,
        height: size,
        seed: "123",
        density: 50,
        loops: true,
        curved: false,
        maxWidth: 540,
        maxHeight: 540,
        minWidth: 240,
        minHeight: 240,
      },
      parentRef.current
    );
  };

  useEffect(() => {
    window.addEventListener("resize", createMaze);

    return () => {
      window.removeEventListener("resize", createMaze);
      resetMaze();
    };
  }, []);

  useEffect(() => {
    createMaze();
  }, [parentRef.current]);

  return (
    <div className="relative">
      <div ref={parentRef}></div>
      <MazeOverlay />
    </div>
  );
}
