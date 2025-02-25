import { useEffect, useRef } from "react";
import { createMazeSvg } from "@/maze";

export default function Maze() {
  const parentRef = useRef<HTMLDivElement>(null);

  const renderMaze = () => {
    if (parentRef.current) {
      createMazeSvg(parentRef.current);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", renderMaze);

    return () => {
      window.removeEventListener("resize", renderMaze);
    };
  }, []);

  useEffect(() => {
    renderMaze();
  }, [parentRef.current]);

  return <div ref={parentRef}></div>;
}
