/**
 * Runs Recursive Backtracking algorithm on a grid.
 * @param {Grid} grid Grid object to run Recursive Backtrack algorithm on.
 * @return {Array<Node>} Array of nodes in the order they were carved
 */
function recursiveBacktracking(grid)
{
    if (grid == null || grid.startNode === null || grid.targetNode == null)
    {
        throw ('Invalid grid');
    }

    let stack = [];
    let carvedNodesInOrder = [];
    let addedNew = false;
    
    grid.fillWalls();
    stack.push(grid.startNode);

    while (stack.length != 0)
    {
        addedNew = false;
        let topOfStack = stack[stack.length - 1];

        let farNeighbours = grid.getFarNeighboursOfNode(topOfStack);
        farNeighbours = farNeighbours.sort(() => (0.5 - Math.random()));

        for (let farNeighbour of farNeighbours)
        {
            if (farNeighbour === null)
            {
                continue;
            }

            if (!carvedNodesInOrder.includes(farNeighbour))
            {
                carvedNodesInOrder.push(grid.getNodeBetween(topOfStack, farNeighbour));
                carvedNodesInOrder.push(farNeighbour);
                stack.push(farNeighbour);
                addedNew = true;
                break;
            }
        }

        if (!addedNew)
        {
            stack.pop();
        }
    }
    return carvedNodesInOrder;
}