/**
 * Runs breadth first search algorithm on a grid.
 * @param {Grid} grid Grid object to run breadth first search algorithm on.
 * @return {null, Array<Node>, Map<Node, Node>} Array containing:
 * 1. null
 * 2. visitedNodesInOrder: Array of visited nodes in order they were visited.
 * 3. previousNodes: Map(node, previousNode) mapping each node to the node they came from.
 */
function runBreadthFirstSearchAlgorithm(grid)
{
    if (grid == null || grid.startNode === null || grid.targetNode == null)
    {
        throw ('Invalid grid');
    }

    let previousNodes = new Map();
    let queue = [];
    let visitedNodesInOrder = [];
    let addedNew = false;
    
    queue.push(grid.startNode);
    visitedNodesInOrder.push(grid.startNode);
    previousNodes.set(grid.startNode, null);
    
    while (queue.length !== 0)
    {
        addedNew = false;
        let nextInQueue = queue[0];

        for (let neighbour of grid.getNeighboursOfNode(nextInQueue))
        {
            if (neighbour == null || neighbour.state == State.WALL)
            {
                continue;
            }

            if (!visitedNodesInOrder.includes(neighbour))
            {
                queue.push(neighbour);
                visitedNodesInOrder.push(neighbour);
                previousNodes.set(neighbour, nextInQueue);
                addedNew = true;
            }
        }

        if (!addedNew)
        {
            queue.shift();
        }
    }
    return [null, visitedNodesInOrder, previousNodes];
}