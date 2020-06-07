//Runs dijkstras algorithm on a grid.
//@returns Array containing: 0. Map(node, cost) containing the cost of reaching each node from the start node. 
//                           1. Array of visited nodes in order they were visited.
//                           2. Map(node, previous) mapping each node to the node they came from. 
function runDijkstrasAlgorithm(grid)
{
    let totalCosts = new Map(); //Maps node => shortest path to that node from start node
    let previousNodes = new Map(); //Maps node => node it came from
    let underConsideration = new PriorityQueue();
    let visitedNodesInOrder = []; //Stores visited nodes in order

    //Set the cost of every node apart from our start node to infinity
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

    totalCosts.set(grid.startNode, 0); //Set the start node to a cost of 1
    underConsideration.enqueue(grid.startNode, 0); //Add it to the list of nodes currently under consideration

    //While underConsideration is not empty
    while (!underConsideration.isEmpty())
    {
        let currentNode = underConsideration.dequeue().element; //Remove node of highest priority from min PQ
        visitedNodesInOrder.push(currentNode); //Visit it

        //For every neighbouring node
        for (let neighbour of grid.getNeighboursOfNode(currentNode))
        {
            if (neighbour == null || neighbour.state == State.WALL) 
            {
                continue;
            }

            //If it has not been visited already
            if (!visitedNodesInOrder.includes(neighbour)) //TODO: COULD OPTIMIZE THIS
            {
                //Add it to queue if it's not there already
                if (!(underConsideration.containsInnerElement(neighbour)))
                {
                    underConsideration.enqueue(neighbour, totalCosts.get(neighbour));
                }

                //Calculate the cost of visiting it from current node
                let costOfPathFromCurrentNode = totalCosts.get(currentNode) + 1; //NOTE: DIST HARD CODED AS 1 FOR NOW

                //If the cost is a new record for that node
                if (costOfPathFromCurrentNode < totalCosts.get(neighbour))
                {
                    //Update it
                    totalCosts.set(neighbour, costOfPathFromCurrentNode);

                    //Link it to the node we came from
                    previousNodes.set(neighbour, currentNode);

                    //Update it's priority in the queue
                    underConsideration.updatePriority(neighbour, costOfPathFromCurrentNode);
                }
            }
        }
    }

    let results = [];
    results.push(totalCosts);
    results.push(visitedNodesInOrder);
    results.push(previousNodes);
    return results;
}