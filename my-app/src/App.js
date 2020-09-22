import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import "./App.css";

const numRows = 50;
const numCols = 50;

const operations = [
	[0, 1],
	[0, -1],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
	[1, 0],
	[-1, 0],
];

function App() {
	const [grid, setGrid] = useState(() => {
		const rows = [];
		for (let i = 0; i < numRows; i++) {
			rows.push(Array.from(Array(numCols), () => 0));
		}
		return rows;
	});

	const [running, setRunning] = useState(false);

	const runningRef = useRef(running);
	runningRef.current = running;

	const runSimulation = useCallback(() => {
		if (!runningRef.current) {
			return;
		}

		setGrid((g) => {
			return produce(g, (gridCopy) => {
				for (let i = 0; i < numRows; i++) {
					for (let k = 0; k < numCols; k++) {
						let neigbors = 0;
						operations.forEach(([x, y]) => {
							const newI = i + x;
							const newK = k + y;
							if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
								neigbors += g[newI][newK];
							}
						});

						if (neigbors < 2 || neigbors > 3) {
							gridCopy[i][k] = 0;
						} else if (g[i][k] === 0 && neigbors === 3) {
							gridCopy[i][k] = 1;
						}
					}
				}
			});
		});

		setTimeout(runSimulation, 1000);
	}, []);

	return (
		<div className="App">
			<div className="buttons">
				<button
					onClick={() => {
						setRunning(!running);
						if (!running) {
							runningRef.current = true;
							runSimulation();
						}
					}}
				>
					{running ? "Stop" : "Start"}
				</button>
				<button>Reset</button>
				<button>Randomize</button>
			</div>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: `repeat(${numCols}, 20px)`,
				}}
			>
				{grid.map((rows, i) =>
					rows.map((col, k) => (
						<div
							key={`${i}-${k}`}
							onClick={() => {
								const newGrid = produce(grid, (gridCopy) => {
									gridCopy[i][k] = grid[i][k] ? 0 : 1;
								});
								setGrid(newGrid);
							}}
							style={{
								width: 20,
								height: 20,
								backgroundColor: grid[i][k] ? "aqua" : undefined,
								border: "solid 1px black",
							}}
						></div>
					))
				)}
			</div>
		</div>
	);
}

export default App;
