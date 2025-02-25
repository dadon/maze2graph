import "./App.css";
import { Button } from "@/components/ui/button";
import { createMaze } from "@/maze/gen";

function App() {
  const maze = createMaze("123", 10, 10, 0.5, true);
  console.log(maze);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button>Click me</Button>
    </>
  );
}

export default App;
