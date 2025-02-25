import "./App.css";
import { createMaze } from "@/maze/gen";
import Maze from "@/components/maze";

function App() {
  const maze = createMaze("123", 10, 10, 0.5, true);
  console.log(maze);

  return (
    <>
      <Maze />
    </>
  );
}

export default App;
