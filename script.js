document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('sudoku-grid');
    for (let i = 0; i < 81; i++) {
        let input = document.createElement('input');
        input.type = 'number';
        input.maxLength = 1;
        input.min = '1';
        input.max = '9';
        input.oninput = validateInput;
        grid.appendChild(input);
    }
});

function validateInput(event) {
    event.target.value = event.target.value.replace(/[^1-9]/g, '');
}

function getInputData() {
    const gridSize = 9;
    let sudokuData = new Array(gridSize).fill(null).map(() => new Array(gridSize).fill(0));
    const inputs = document.querySelectorAll('#sudoku-grid input');

    inputs.forEach((input, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const value = parseInt(input.value) || 0;

        if (input.value) {
            input.classList.add('original-input'); // Add class to original input cells
        }

        sudokuData[row][col] = value;
    });

    return sudokuData;
}

function solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) { // Find an empty cell
                for (let num = 1; num <= 9; num++) {
                    if (isValidPlacement(grid, row, col, num)) {
                        grid[row][col] = num;

                        if (solveSudoku(grid)) {
                            return true; // Found solution
                        }

                        grid[row][col] = 0; // Backtrack
                    }
                }
                return false; // Trigger backtrack
            }
        }
    }
    return true; // Puzzle solved
}

function isValidPlacement(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) {
            return false;
        }
    }

    // Check column
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) {
            return false;
        }
    }

    // Check 3x3 subgrid
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (grid[i][j] === num) {
                return false;
            }
        }
    }

    return true;
}

function solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) { // Find an empty cell
                for (let num = 1; num <= 9; num++) {
                    if (isValidPlacement(grid, row, col, num)) {
                        grid[row][col] = num;

                        if (solveSudoku(grid)) {
                            return true; // Found solution
                        }

                        grid[row][col] = 0; // Backtrack
                    }
                }
                return false; // Trigger backtrack
            }
        }
    }
    return true; // Puzzle solved
}

document.getElementById('solve-btn').addEventListener('click', function() {
    const grid = getInputData(); // Get current state of the grid

    if (!isValidSudoku(grid)) {
        alert('Invalid Sudoku puzzle. Please correct the inputs.');
        return;
    }

    const isSolvable = solveSudoku(grid);
    if (isSolvable) {
        updateGridUI(grid);
    } else {
        alert('No solution exists for this Sudoku puzzle.');
    }
});

function updateGridUI(grid) {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    inputs.forEach((input, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;

        if (!input.classList.contains('original-input')) { // Check if the cell is not original input
            input.value = grid[row][col] !== 0 ? grid[row][col] : '';
            input.classList.add('solved-input'); // Add class to solved cells
        }
    });
}

function isValidSudoku(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const num = grid[row][col];
            if (num !== 0) {
                // Temporarily empty the current cell to avoid false conflict
                grid[row][col] = 0; 
                if (!isValidPlacement(grid, row, col, num)) {
                    grid[row][col] = num; // Restore original number
                    return false;
                }
                grid[row][col] = num; // Restore original number
            }
        }
    }
    return true;
}

document.getElementById('reset-btn').addEventListener('click', resetGrid);

function resetGrid() {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    inputs.forEach(input => {
        input.value = ''; // Clear the value
        input.classList.remove('solved-input', 'original-input'); // Remove any specific styling
    });
}

document.getElementById('hint-btn').addEventListener('click', function() {
    giveHint();
});

function giveHint() {
    const grid = getInputData(); // Get current grid state
    const solutionGrid = JSON.parse(JSON.stringify(grid)); // Create a copy for the solution

    if (solveSudoku(solutionGrid)) { // Solve the puzzle in the background
        const emptyCells = [];
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 0) {
                    emptyCells.push({ rowIndex, colIndex });
                }
            });
        });

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const hintValue = solutionGrid[randomCell.rowIndex][randomCell.colIndex];
            updateCellUI(randomCell.rowIndex, randomCell.colIndex, hintValue);
        } else {
            alert('No more hints available.');
        }
    } else {
        alert('Puzzle cannot be solved.');
    }
}

function updateCellUI(row, col, num) {
    const cellIndex = row * 9 + col;
    const cell = document.querySelector(`#sudoku-grid input:nth-child(${cellIndex + 1})`);
    cell.value = num;
    cell.classList.add('hint-input'); // Highlight the cell with a hint
}
