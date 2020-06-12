/**
 * Runs Dijkstras algorithm on a grid.
 * @param {Grid} grid Grid object to run Dijkstras algorithm on.
 * @return {Array} Array containing:
 * 1. gCosts: Map(node, gCost) (gCost = Cost of reaching a node from the start node).
 * 2. visitedNodesInOrder: Array of visited nodes in order they were visited.
 * 3. previousNodes: Map(node, previousNode) mapping each node to the node they came from.
 */
function runDijkstrasAlgorithm(grid)
{
    if (grid == null || grid.startNode === null || grid.targetNode == null)
    {
        throw ('Invalid grid');
    }

    let gCosts = new Map();
    let previousNodes = new Map();
    let underConsideration = new MinPriorityQueue();
    let visitedNodesInOrder = [];

    setInitialGCosts();
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
     * @param {Node} node The node to add.
     */
    function considerIfNotAlreadyBeingConsidered(node) 
    {
        if (node === null)
        {
            throw ('node cannot be null');
        }

        if (!(underConsideration.containsInnerElement(node))) 
        {
            underConsideration.enqueue(node, gCosts.get(node));
        }
    }

    /**
     * Tries to find a path to nodeB via nodeA, with a lower gCost than the currently known path.
     * If successful, the new gCost of nodeB is updated.
     * @param {Node} nodeA The node from which the possible new path is via.
     * @param {Node} nodeB The node which is trying to improve it's gCost.
     */
    function tryToFindBetterPath(nodeA, nodeB) 
    {
        if (nodeA === null || nodeB === null)
        {
            throw ('node cannot be null');
        }
        
        let costOfPathFromCurrentNode = gCosts.get(nodeA) + grid.getManhattanDistance(nodeA, nodeB);
        if (costOfPathFromCurrentNode < gCosts.get(nodeB)) 
        {
            gCosts.set(nodeB, costOfPathFromCurrentNode);
            previousNodes.set(nodeB, nodeA);
            underConsideration.updatePriority(nodeB, costOfPathFromCurrentNode);
        }
    }

    /**
     * Sets the initial gCost of every node to Infinity.
     * Sets the inital gCost of the starting node to 0.
     */
    function setInitialGCosts() 
    {
        for (let row = 0; row < grid.height; row++) 
        {
            for (let column = 0; column < grid.width; column++) 
            {
                let thisNode = grid.nodes[row][column];
                if (thisNode != grid.startNode) 
                {
                    gCosts.set(thisNode, Infinity);
                }
            }
        }
        gCosts.set(grid.startNode, 0);
    }
}