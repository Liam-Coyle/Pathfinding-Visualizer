const myGrid = new Grid('grid', 75, 27);
myGrid.draw();

/**
 * Visualizes the selected pathfinding algorithm
 */
function visualizeAlgorithm(algorithm)
{
    clearPath();
    myGrid.lock();
    try
    {   
        algorithm = window[algorithm];
        [costs, order, previousNodes] = algorithm(myGrid);
    }
    catch (err)
    {
        return;
    }

    let visitedNodesAnimationDelay = 10;
    let shortestPathAnimationDelay = 20;

    let targetNodeIndex = animateVisitedNodes(order, visitedNodesAnimationDelay);
    let shortestPathOrder = getShortestPathOrder(previousNodes, myGrid.targetNode);
    setTimeout(() => animateShortestPath(shortestPathOrder, shortestPathAnimationDelay), targetNodeIndex * visitedNodesAnimationDelay); //Could use promises here?
}

/**
 * Visualizes the selected maze generation algorithm
 */
function visualizeMazeAlgorithm(algorithm)
{
    resetGrid();
    myGrid.lock();
    let wallOrder;

    try
    {
        algorithm = window[algorithm];
        wallOrder = algorithm(myGrid, 1, 1, myGrid.width - 2, myGrid.height - 2, getSplitOrientation(myGrid.width, myGrid.height), myGrid.drawBorder());
    }
    catch (err)
    {
        return;
    }

    let animationDelay = 10;
    animateMaze(wallOrder, animationDelay);
}

/**
 * Arranges an array with the order of nodes which together make up the shortest path
 * @param {Map<Node, Node>} previousNodesMap Map(node, previousNode) mapping each node to the node they came from
 * @param {Node} targetNode The target node
 * @return {Array<Node>} Array of nodes from startNode to targetNode which make up the shortest path
 */
function getShortestPathOrder(previousNodesMap, targetNode)
{
    if (previousNodesMap === null)
    {
        throw ('previousNodesMap cannot be null');
    }

    if (targetNode === null)
    {
        throw ('targetNode cannot be null');
    }

    let order = [];
    let prev = previousNodesMap.get(targetNode);
    while(prev != null)
    {
        order.splice(0, 0, prev);
        prev = previousNodesMap.get(prev);
    }
    return order;
}

/**
 * Updates the state of each node to visited in the given order
 * @param {Array<Node>} order An array of nodes in the order of the desired animation
 * @param {Number} animationDelay The delay in ms between each animation
 */
function animateVisitedNodes(order, animationDelay)
{
    if (order === null)
    {
        throw ('order cannot be null');
    }

    if (animationDelay < 0)
    {
        throw ('animationDelay must be >= 0');
    }

    let targetNodeIndex = null;
    for (let index = 1; index < order.length; index++)
    {
        if (order[index].state == State.TARGET)
        {
            targetNodeIndex = index;
            break;
        }
        setTimeout(() => order[index].setState(State.VISITED), animationDelay * index);
    }
    return targetNodeIndex;
}

/**
 * Updates the state of each node to highlight in the given order
 * @param {Array<Node>} order An array of nodes in the order of the desired animation
 * @param {Number} animationDelay The delay in ms between each animation
 */
function animateShortestPath(order, animationDelay)
{
    if (order === null)
    {
        throw ('order cannot be null');
    }

    if (animationDelay < 0)
    {
        throw ('animationDelay must be >= 0');
    }

    setTimeout(() => myGrid.unlock(), animationDelay * order.length);
    for (let index = 1; index < order.length; index++)
    {
        setTimeout(() => order[index].setState(State.HIGHLIGHT), animationDelay * index);
    }
}

/**
 * Updates the state of each node to wall in the given order
 * @param {Array<Node>} order An array of nodes in the order of the desired animation
 * @param {Number} animationDelay The delay in ms between each animation
 */
function animateMaze(order, animationDelay)
{
    if (order === null)
    {
        throw ('order cannot be null');
    }

    if (animationDelay < 0)
    {
        throw ('animationDelay must be >= 0');
    }

    setTimeout(() => myGrid.unlock(), animationDelay * order.length);
    for (let index = 0; index < order.length; index++)
    {
        setTimeout(() => order[index].setState(State.WALL), animationDelay * index);
    }
}

/**
 * Resets the grid to it's inital state
 */
function resetGrid()
{
    stopAllAnimations();
    clearWalls();
    myGrid.draw();
}

/**
 * Sets all wall nodes to state of unvisited
 */
function clearWalls()
{
    stopAllAnimations();
    myGrid.reset(false);
}

/**
 * Sets all highlight/visited nodes to state of unvisited
 */
function clearPath() 
{
    stopAllAnimations();
    myGrid.clearPath();
}

/**
 * Stops all currently running animations
 */
function stopAllAnimations()
{
    var id = window.setTimeout(function() {}, 0);
    while (id--) 
    {
        window.clearTimeout(id);
    }
}