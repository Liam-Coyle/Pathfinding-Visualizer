const HORIZONTAL = 0;
const VERTICAL = 1;

function recursiveDivision(grid, col, row, width, height, orientation, wallOrder)
{
    if (width < 2 || height < 2)
    {
        return wallOrder;
    }

    //Decide where to draw the wall
    let wCol = orientation === HORIZONTAL ? col : getRandomEvenNumber(col, col + width - 1);
    let wRow = orientation === HORIZONTAL ? getRandomEvenNumber(row, row + height - 1) : row;

    //Decide where to put the gap
    let hCol = orientation === HORIZONTAL ? getRandomOddNumber(col, col + width - 1) : wCol;
    let hRow = orientation === HORIZONTAL ? wRow : getRandomOddNumber(row, row + height - 1);

    drawWall(grid, width, height, wCol, wRow, hCol, hRow, orientation, wallOrder);

    //Divide above/left section
    let [nCol, nRow]      = [col, row];
    let [nWidth, nHeight] = orientation === HORIZONTAL ? [width, wRow - row] : [wCol - col, height]; 
    wallOrder = recursiveDivision(grid, nCol, nRow, nWidth, nHeight, getSplitOrientation(nWidth, nHeight), wallOrder);

    //Divide bottom/right section
    [nCol, nRow]      = orientation == HORIZONTAL ? [col, wRow + 1]               : [wCol + 1, row];
    [nWidth, nHeight] = orientation == HORIZONTAL ? [width, height - nHeight - 1] : [width - nWidth - 1, height];
    wallOrder = recursiveDivision(grid, nCol, nRow, nWidth, nHeight, getSplitOrientation(nWidth, nHeight), wallOrder);

    return wallOrder;
}

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

function getSplitOrientation(width, height)
{
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
        getRandomNumber(0, 1) === 0 ? HORIZONTAL : VERTICAL;
    }
}

function getRandomEvenNumber(min, max)
{
    min = min % 2 != 0 ? (min + 1)/2 : min / 2;
    max = max % 2 != 0 ? (max - 1)/2 : max / 2;
    return 2 * getRandomNumber(min, max);
}

function getRandomOddNumber(min, max)
{
    return getRandomEvenNumber(min, max - 1) + 1; 
}

function getRandomNumber(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}


    
