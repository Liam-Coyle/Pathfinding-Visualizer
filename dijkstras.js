/**
 * Runs Dijkstras algorithm on a grid.
 * @param {Object} grid Grid object to run Dijkstras algorithm on.
 * @return {array} Array containing:
 * 1. totalCosts: Map(node, cost) containing the cost of reaching each node from the start node. 
 * 2. visitedNodesInOrder: Array of visited nodes in order they were visited.
 * 3. previousNodes: Map(node, previous) mapping each node to the node they came from.
 */
function runDijkstrasAlgorithm(grid)
{
    if (grid == null || grid.startNode === null || grid.targetNode == null)
    {
        return;
    }

    let totalCosts = new Map();
    let previousNodes = new Map();
    let underConsideration = new PriorityQueue();
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

    return [totalCosts, visitedNodesInOrder, previousNodes];

    /**
     * Adds a node to the 'underConsideration' PriorityQueue if it is not already there.
     * @param {Object} neighbour 
     */
    function considerIfNotAlreadyBeingConsidered(neighbour) 
    {
        if (!(underConsideration.containsInnerElement(neighbour))) 
        {
            underConsideration.enqueue(neighbour, totalCosts.get(neighbour));
            //TODO: Add animation for nodes under consideration
        }
    }

    /**
     * Tries to find a path faster than the currently known path from the start node to neighbour.
     * If successful, the new cost of the neighbour node is updated in totalCosts map.
     * @param {Object} currentNode The node which has most recently been visited.
     * @param {Object} neighbour A neighbour node to currentNode.
     */
    function tryToFindBetterPath(currentNode, neighbour) 
    {
        let costOfPathFromCurrentNode = totalCosts.get(currentNode) + 1; //FIXME: Distance hard coded as 1 for now.
        if (costOfPathFromCurrentNode < totalCosts.get(neighbour)) 
        {
            totalCosts.set(neighbour, costOfPathFromCurrentNode);
            previousNodes.set(neighbour, currentNode);
            underConsideration.updatePriority(neighbour, costOfPathFromCurrentNode);
        }
    }

    /**
     * Sets the initial cost of every node to Infinity.
     * Sets the inital cost of the starting node to 0.
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
                    totalCosts.set(thisNode, Infinity);
                }
            }
        }
        totalCosts.set(grid.startNode, 0);
    }
}