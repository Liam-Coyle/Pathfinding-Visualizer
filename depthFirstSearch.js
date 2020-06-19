/**
 * Runs depth first search algorithm on a grid.
 * @param {Grid} grid Grid object to run depth first search algorithm on.
 * @return {null, Array<Node>, Map<Node, Node>} Array containing:
 * 1. null
 * 2. visitedNodesInOrder: Array of visited nodes in order they were visited.
 * 3. previousNodes: Map(node, previousNode) mapping each node to the node they came from.
 */
function runDepthFirstSearchAlgorithm(grid)
{
    if (grid == null || grid.startNode === null || grid.targetNode == null)
    {
        throw ('Invalid grid');
    }

    let previousNodes = new Map();
    let stack = [];
    let visitedNodesInOrder = [];
    let addedNew = false;
    
    stack.push(grid.startNode);
    visitedNodesInOrder.push(grid.startNode);
    previousNodes.set(grid.startNode, null);
    
    while (stack.length !== 0)
    {
        addedNew = false;
        let topOfStack = stack[stack.length - 1];

        for (let neighbour of grid.getNeighboursOfNode(topOfStack))
        {
            if (neighbour == null || neighbour.state == State.WALL)
            {
                continue;
            }

            if (!visitedNodesInOrder.includes(neighbour))
            {
                stack.push(neighbour);
                visitedNodesInOrder.push(neighbour);
                previousNodes.set(neighbour, topOfStack);
                addedNew = true;
                break;
            }
        }

        if (!addedNew)
        {
            stack.pop();
        }
    }
    return [null, visitedNodesInOrder, previousNodes];
}











// let mostRecentlyVisitedNode = stack.pop();
// visitedNodesInOrder.push(mostRecentlyVisitedNode);

// for (let neighbour of grid.getNeighboursOfNode(mostRecentlyVisitedNode))
// {
//     if (neighbour == null || neighbour.state == State.WALL) 
//     {
//         continue;
//     }

//     if (!visitedNodesInOrder.includes(neighbour))
//     {
//         stack.push(neighbour);
//         break;
//     }

//     // if (!stack.includes(neighbour) && !visitedNodesInOrder.includes(neighbour)) //TODO: Optimize this
//     // {
//     //     stack.push(neighbour);
//     //     previousNodes.set(neighbour, mostRecentlyVisitedNode);
//     // }
// }