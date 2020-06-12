const HORIZONTAL = 0;
const VERTICAL = 1;

/**
 * Runs recursive division algorithm on a section of a grid
 * @param {Grid} grid The grid object to run the algorithm on
 * @param {Number} col The leftmost column of the section 
 * @param {Number} row The highest row of the section
 * @param {Number} width The width of the section
 * @param {Number} height The height of the section
 * @param {Boolean} orientation The orientation of the cut to be made to the section (HORIZONTAL = 0, VERTICAL = 1)
 * @param {Array} wallOrder An array containing the order of the walls added thus far
 * @return {Array} wallOrder An array containing the order of the walls added thus far
 */
function recursiveDivision(grid, col, row, width, height, orientation, wallOrder)
{    
    checkIfParametersAreValid(grid, col, row, width, height, orientation, wallOrder);

    if (width < 2 || height < 2)
    {
        return wallOrder;
    }

    let horizontal = orientation == HORIZONTAL; //Sets flag for clarity in ternary operations below

    //Decide where to draw the wall
    let wCol = horizontal ? col : getRandomEvenNumber(col, col + width - 1);
    let wRow = horizontal ? getRandomEvenNumber(row, row + height - 1) : row;

    //Decide where to put the gap
    let hCol = horizontal ? getRandomOddNumber(col, col + width - 1) : wCol;
    let hRow = horizontal ? wRow : getRandomOddNumber(row, row + height - 1);

    drawWall(grid, width, height, wCol, wRow, hCol, hRow, orientation, wallOrder);

    //Divide above/left section
    let [nCol, nRow]      = [col, row];
    let [nWidth, nHeight] = horizontal ? [width, wRow - row] : [wCol - col, height]; 
    wallOrder = recursiveDivision(grid, nCol, nRow, nWidth, nHeight, getSplitOrientation(nWidth, nHeight), wallOrder);

    //Divide bottom/right section
    [nCol, nRow]      = horizontal ? [col, wRow + 1]               : [wCol + 1, row];
    [nWidth, nHeight] = horizontal ? [width, height - nHeight - 1] : [width - nWidth - 1, height];
    wallOrder = recursiveDivision(grid, nCol, nRow, nWidth, nHeight, getSplitOrientation(nWidth, nHeight), wallOrder);

    return wallOrder;
}

/**
 * Helper function which checks the validity of the input parameters of recursiveDivision() 
 * @param {Grid} grid The grid object to run the algorithm on
 * @param {Number} col The leftmost column of the section 
 * @param {Number} row The highest row of the section
 * @param {Number} width The width of the section
 * @param {Number} height The height of the section
 * @param {Boolean} orientation The orientation of the cut to be made to the section (HORIZONTAL = 0, VERTICAL = 1)
 * @param {Array} wallOrder An array containing the order of the walls added thus far
 */
function checkIfParametersAreValid(grid, col, row, width, height, orientation, wallOrder) 
{
    if (grid === null) 
    {
        throw ('grid cannot be null');
    }

    if (col < 0 || !Number.isInteger(col)) 
    {
        throw ('column must be a positive integer');
    }

    if (row < 0 || !Number.isInteger(row)) 
    {
        throw ('row must be positive integer');
    }

    if (width < 0 || !Number.isInteger(width)) 
    {
        throw ('width must be a positive integer');
    }

    if (height < 0 || !Number.isInteger(height)) 
    {
        throw ('height must be a positive integer');
    }

    if (orientation != 1 && orientation != 0) 
    {
        throw ('orientation must be HORIZONTAL or VERTICAL (0 or 1)');
    }

    if (wallOrder === null) 
    {
        throw ('wallOrder cannot be null');
    }
}

/**
 * Draws a wall from one point on a grid to another point on the same grid
 * Cuts a hole in this wall at the given column and row (hCol, hRow)
 * @param {Grid} grid The grid object to draw the wall on
 * @param {Number} width The width of the section
 * @param {Number} height The height of the section
 * @param {Number} wCol The column to start drawing the wall
 * @param {Number} wRow The row to start drawing the wall
 * @param {Number} hCol The column to carve a hole in the wall
 * @param {Number} hRow The row to carve a hole in the wall
 * @param {Boolean} orientation The orientation of the cut to be made to the section (HORIZONTAL = 0, VERTICAL = 1)
 * @param {Array} wallOrder An array containing the order of the walls added thus far
 */
function drawWall(grid, width, height, wCol, wRow, hCol, hRow, orientation, wallOrder) 
{
    if (orientation === HORIZONTAL) 
    {
        for (let column = wCol; column < wCol + width; column++) 
        {
            if (column != hCol) 
            {
                wallOrder.push(grid.nodes[wRow][column]);
            }
        }
    }
    else 
    {
        for (let row = wRow; row < wRow + height; row++) 
        {
            if (row != hRow) 
            {
                wallOrder.push(grid.nodes[row][wCol]);
            }
        }
    }
}

/**
 * Decides the optimal orientation to split a section
 * @param {Number} width The width of the section
 * @param {Number} height The height of the section
 * @return 0 if the orientation is HORIZONTAL, 1 if the orientation is VERTICAL
 */
function getSplitOrientation(width, height)
{
    if ((width < 0 || height < 0) && (Number.isInteger(width) && Number.isInteger(height)))
    {
        throw ('width and height must be positive integers');
    }

    if (width < height)
    {
        return HORIZONTAL;
    }
    else if (height < width)
    {
        return VERTICAL;
    }
    else
    {
        return getRandomNumber(0, 1) === 0 ? HORIZONTAL : VERTICAL;
    }
}

/**
 * Returns a random even integer between 2 numbers (Inclusive)
 * @param {Number} min The minimum number
 * @param {Number} max The maximum number
 * @return {Number} Even number between min and max (Inclusive)
 */
function getRandomEvenNumber(min, max)
{
    min = min % 2 != 0 ? (min + 1)/2 : min / 2;
    max = max % 2 != 0 ? (max - 1)/2 : max / 2;
    return 2 * getRandomNumber(min, max);
}

/**
 * Returns a random odd integer between 2 numbers (Inclusive)
 * @param {Number} min The minimum number
 * @param {Number} max The maximum number
 * @return {Number} Odd number between min and max (Inclusive)
 */
function getRandomOddNumber(min, max)
{
    return getRandomEvenNumber(min, max - 1) + 1; 
}

/**
 * Returns a random integer between 2 numbers (Inclusive)
 * @param {Number} min The minimum number
 * @param {Number} max The maximum number
 * @return {Number} Random number between min and max (Inclusive)
 */
function getRandomNumber(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}


    
