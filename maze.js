const maze = [
  ["a", "b", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a"],
  ["a", "c", "a", "d", "d", "e", "a", "c", "c", "c", "d", "a"],
  ["a", "c", "c", "d", "a", "e", "a", "d", "a", "d", "a", "a"],
  ["a", "a", "a", "a", "a", "e", "d", "d", "a", "d", "e", "a"],
  ["a", "c", "c", "d", "d", "d", "a", "a", "a", "a", "e", "a"],
  ["a", "c", "a", "a", "a", "a", "a", "d", "d", "d", "e", "a"],
  ["a", "d", "d", "d", "e", "e", "a", "c", "a", "a", "a", "a"],
  ["a", "a", "a", "e", "a", "e", "a", "c", "c", "d", "d", "a"],
  ["a", "d", "e", "e", "a", "d", "a", "a", "a", "a", "a", "a"],
  ["a", "a", "d", "a", "a", "d", "a", "c", "d", "d", "a", "a"],
  ["a", "d", "d", "d", "a", "d", "c", "c", "a", "d", "e", "b"],
  ["a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a"],
];

function findPath(path) {
  const { row, col } = path[path.length - 1];

  // Stop condition
  if (maze[row][col] === "b" && path.length > 1) {
    printPath(path);
    return true;
  }

  move({ row: row - 1, col }, path);
  move({ row: row + 1, col }, path);
  move({ row, col: col - 1 }, path);
  move({ row, col: col + 1 }, path);
}

function move({ row: nextRow, col: nextCol }, path) {
  if (nextRow < 0 || nextCol < 0) return false;

  if (pathAlreadyExists({ nextRow, nextCol }, path)) return false;

  if (!isThreeLetterRuleValid({ nextRow, nextCol }, path)) return false;

  if (
    !isSiblingOrEqualLetter({ nextRow, nextCol }, path) &&
    maze[nextRow][nextCol] !== "b"
  )
    return false;

  const newPath = [...path];
  newPath.push({ row: nextRow, col: nextCol });
  findPath(newPath);
  return true;
}

/*
  Check if the movement that you are trying to do is already in the path.
  Nodes that are already visited, can not be visited again.
*/
function pathAlreadyExists({ nextRow, nextCol }, path) {
  if (path.some((tuple) => tuple.row === nextRow && tuple.col === nextCol)) {
    return true;
  } else {
    return false;
  }
}

/*
  Returns true if the movement is a sibling compared to the last movement in the path.
  Only movements through siblings letters or equal letters are valid within the maze.
  Example: Leter D can only move to letters C, D or E
*/
function isSiblingOrEqualLetter({ nextRow, nextCol }, path) {
  const letterOrder = ["a", "b", "c", "d", "e"];
  const currentRow = path[path.length - 1].row;
  const currentCol = path[path.length - 1].col;
  const currentLetter = maze[currentRow][currentCol];
  const nextLetter = maze[nextRow][nextCol];

  const currentLetterIndex = letterOrder.indexOf(currentLetter);
  const nextLetterIndex = letterOrder.indexOf(nextLetter);

  if (letterOrder[currentLetterIndex] === letterOrder[nextLetterIndex]) {
    return true;
  }

  if (
    currentLetterIndex > 0 &&
    letterOrder[currentLetterIndex - 1] === letterOrder[nextLetterIndex]
  ) {
    return true;
  }

  if (
    currentLetterIndex < letterOrder.length - 1 &&
    letterOrder[currentLetterIndex + 1] === letterOrder[nextLetterIndex]
  ) {
    return true;
  }

  return false;
}

/*
  You can only walk in three letters at once, unless it's the letter B
*/
function isThreeLetterRuleValid({ nextRow, nextCol }, path) {
  if (maze[nextRow][nextCol] === "b") {
    return true;
  }

  if (nextRow === 0 && nextCol === 5) {
    const test = 1;
  }

  if (path.length == 1) {
    return true;
  }

  // Fails if there are 4 equal consecutive letters
  if (
    path.length > 3 &&
    maze[nextRow][nextCol] ===
      maze[path[path.length - 1].row][path[path.length - 1].col] &&
    maze[path[path.length - 1].row][path[path.length - 1].col] ===
      maze[path[path.length - 2].row][path[path.length - 2].col] &&
    maze[path[path.length - 2].row][path[path.length - 2].col] ===
      maze[path[path.length - 3].row][path[path.length - 3].col]
  ) {
    return false;
  }

  // A path letter must be different then the privious 3 path letters
  if (
    path.length > 3 &&
    maze[nextRow][nextCol] !==
      maze[path[path.length - 1].row][path[path.length - 1].col] &&
    maze[path[path.length - 1].row][path[path.length - 1].col] ===
      maze[path[path.length - 2].row][path[path.length - 2].col] &&
    maze[path[path.length - 2].row][path[path.length - 2].col] ===
      maze[path[path.length - 3].row][path[path.length - 3].col]
  ) {
    return true;
  }

  // The letter you will move must be equal to the previous letter
  if (
    maze[nextRow][nextCol] ===
    maze[path[path.length - 1].row][path[path.length - 1].col]
  ) {
    return true;
  }

  return false;
}

/*
  Returns true if the last three movements in the path have the same letter in the maze.
  A letter cannot be repeated more than 3 times.
*/
function isLastThreeLettersEqual({ nextRow, nextCol }, path) {
  if (path.length < 3) {
    return false;
  }

  if (
    maze[nextRow][nextCol] ===
      maze[path[path.length - 1].row][path[path.length - 1].col] &&
    maze[nextRow][nextCol] ===
      maze[path[path.length - 2].row][path[path.length - 2].col] &&
    maze[nextRow][nextCol] ===
      maze[path[path.length - 3].row][path[path.length - 3].col]
  ) {
    return true;
  }

  return false;
}

function printPath(path) {
  console.log("FOUND PATH: ");
  console.log(path);
  let pathStr = "";

  path.forEach((node, index) => {
    const letter = maze[node.row][node.col];
    if (letter === "b" && index != 0) {
      pathStr = pathStr + "-";
    } else if (pathStr.length % 4 === 1 && pathStr !== "") {
      pathStr = pathStr + "-";
    }
    pathStr = pathStr + letter;
  });

  console.log(pathStr);
  return pathStr;
}

findPath([{ row: 0, col: 1 }]);
