/**
 * Runs A* algorithm on a grid.
 * @param {Object} grid Grid object to run A* algorithm on.
 * @return {array} Array containing:
 * 1. gCosts: Map(node, gCost) (gCost = Cost of reaching a node from the start node).
 * 2. visitedNodesInOrder: Array of visited nodes in order they were visited.
 * 3. previousNodes: Map(node, previousNode) mapping each node to the node they came from.
 */
function runAStarAlgorithm(grid)
{
    if (grid == null || grid.startNode === null || grid.targetNode == null)
    {
        throw ('Invalid grid');
    }

    let gCosts = new Map();
    let hCosts = new Map();
    let previousNodes = new Map();
    let underConsideration = new MinPriorityQueue();
    let visitedNodesInOrder = [];

    setInitialCosts();
    considerIfNotAlreadyBeingConsidered(grid.startNode);

    while (!underConsideration.isEmpty())
    {
        let mostRecentlyVisitedNode = underConsideration.dequeue().element;
        visitedNodesInOrder.push(mostRecentlyVisitedNode);

        for (let neighbour of grid.getNeighboursOfNode(mostRecentlyVisitedNode))
        {
            if (neighbour == null || neighbour.state == State.WALL) 
            {
                continue;
            }

            if (!visitedNodesInOrder.includes(neighbour)) //TODO: Optimize this
            {
                considerIfNotAlreadyBeingConsidered(neighbour);
                tryToFindBetterPath(mostRecentlyVisitedNode, neighbour);
            }
        }
    }

    return [gCosts, visitedNodesInOrder, previousNodes];

    /**
     * Adds a node to the 'underConsideration' PriorityQueue if it is not already there.
     * @param {Object} node 
     */
    function considerIfNotAlreadyBeingConsidered(node) 
    {
        if (!(underConsideration.containsInnerElement(node))) 
        {
            underConsideration.enqueue(node, gCosts.get(node) + hCosts.get(node));
        }
    }

    /**
     * Tries to find a path to nodeB via nodeA, with a lower gCost than the currently known path.
     * If successful, the new gCost of nodeB is updated.
     * @param {Object} nodeA The node from which the possible new path is via.
     * @param {Object} nodeB The node which is trying to improve it's gCost.
     */
    function tryToFindBetterPath(nodeA, nodeB) 
    {
        let costOfPathFromCurrentNode = gCosts.get(nodeA) + grid.getManhattanDistance(nodeA, nodeB);
        if (costOfPathFromCurrentNode < gCosts.get(nodeB)) 
        {
            gCosts.set(nodeB, costOfPathFromCurrentNode);
            previousNodes.set(nodeB, nodeA);
            underConsideration.updatePriority(nodeB, gCosts.get(nodeB) + hCosts.get(nodeB));
        }
    }

    /**
     * Sets the initial gCost of every node to Infinity.
     * Sets the inital gCost of the starting node to 0.
     * Sets the correct hCost for every node.
     */
    function setInitialCosts() 
    {
        for (let row = 0; row < grid.height; row++) 
        {
            for (let column = 0; column < grid.width; column++) 
            {
                let thisNode = grid.nodes[row][column];
                if (thisNode != grid.startNode) 
                {
                    gCosts.set(thisNode, Infinity);
                    hCosts.set(thisNode, grid.getManhattanDistance(grid.targetNode, thisNode));
                }
            }
        }
        gCosts.set(grid.startNode, 0);
        hCosts.set(grid.startNode, grid.getManhattanDistance(grid.targetNode, grid.startNode));
    }
}