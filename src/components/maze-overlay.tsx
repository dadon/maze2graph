import { useRef } from "react";
import { useMazeStore } from "@/store/maze-store";

export function MazeOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);

  const mazeData = useMazeStore((state) => state.data);
  const hoveredCell = useMazeStore((state) => state.hoveredCell);
  const startPoint = useMazeStore((state) => state.startPoint);
  const endPoint = useMazeStore((state) => state.endPoint);
  const path = useMazeStore((state) => state.path);
  const setHoveredCell = useMazeStore((state) => state.setHoveredCell);
  const handleCellClick = useMazeStore((state) => state.handleCellClick);

  // Handle mouse movement over the overlay
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!overlayRef.current || !mazeData) return;

    const { cellSize, config } = mazeData;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    // Only update if within bounds
    if (x >= 0 && x < config.width && y >= 0 && y < config.height) {
      setHoveredCell([x, y]);
    } else {
      setHoveredCell(null);
    }
  };

  // Calculate position of a cell in pixels
  const getCellPosition = (cell: [number, number]) => {
    if (!mazeData) return { top: 0, left: 0 };

    const { cellSize } = mazeData;

    return {
      left: cell[0] * cellSize + cellSize / 2,
      top: cell[1] * cellSize + cellSize / 2,
    };
  };

  // Parse node key to extract coordinates, handling both regular and faint nodes
  const parseNodeKey = (key: string): [number, number] => {
    // Remove "-faint" suffix if present
    const cleanKey = key.replace(/-faint$/, "");
    const [x, y] = cleanKey.split(",").map(Number);
    return [x, y];
  };

  // Don't render if cell size is not yet calculated
  if (!mazeData) return null;

  return (
    <div
      ref={overlayRef}
      className="absolute top-0 left-0 w-full h-full cursor-pointer"
      onMouseMove={handleMouseMove}
      onClick={handleCellClick}
      style={{
        pointerEvents: "all",
      }}
    >
      {/* Hover indicator */}
      {hoveredCell && (
        <div
          className="absolute w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: getCellPosition(hoveredCell).left,
            top: getCellPosition(hoveredCell).top,
          }}
        />
      )}

      {/* Start point */}
      {startPoint && (
        <div
          className="absolute w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
          style={{
            left: getCellPosition(startPoint).left,
            top: getCellPosition(startPoint).top,
          }}
        >
          <span className="text-white text-xs font-bold">A</span>
        </div>
      )}

      {/* End point */}
      {endPoint && (
        <div
          className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
          style={{
            left: getCellPosition(endPoint).left,
            top: getCellPosition(endPoint).top,
          }}
        >
          <span className="text-white text-xs font-bold">B</span>
        </div>
      )}

      {/* Path visualization */}
      {path.length > 0 && startPoint && endPoint && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Generate path segments to style them differently based on faint status */}
          {path
            .filter((p) => p.includes(",")) // Filter out the weight at the end
            .map((point, index, allPoints) => {
              if (index === 0) return null; // Skip first point as it's handled in the next segment

              // Current point and previous point
              const currentKey = point;
              const prevKey = allPoints[index - 1];

              // Skip if either point is not a valid coordinate
              if (!currentKey.includes(",") || !prevKey.includes(","))
                return null;

              // Check if either point is a faint node
              const isFaintSegment =
                currentKey.includes("-faint") || prevKey.includes("-faint");

              // Parse coordinates
              const [x1, y1] = parseNodeKey(prevKey);
              const [x2, y2] = parseNodeKey(currentKey);

              // Get positions
              const pos1 = getCellPosition([x1, y1]);
              const pos2 = getCellPosition([x2, y2]);

              // Create path for this segment
              return (
                <line
                  key={`path-segment-${index}`}
                  x1={pos1.left}
                  y1={pos1.top}
                  x2={pos2.left}
                  y2={pos2.top}
                  stroke="#FF6B00"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={isFaintSegment ? "5,5" : "none"}
                  opacity={isFaintSegment ? 0.5 : 1}
                />
              );
            })}
        </svg>
      )}

      {/* Display cell coordinates */}
      {hoveredCell && (
        <div
          className="absolute bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs"
          style={{
            left: getCellPosition(hoveredCell).left + 10,
            top: getCellPosition(hoveredCell).top + 10,
          }}
        >
          {hoveredCell[0]},{hoveredCell[1]}
        </div>
      )}
    </div>
  );
}
