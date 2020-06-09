const myGrid = new Grid(75,28);
myGrid.draw();

function visualizeDijkstras()
{
    try
    {
        [costs, order, previousNodes] = runDijkstrasAlgorithm(myGrid);
    }
    catch (err)
    {
        return;
    }

    let visitedNodesAnimationDelay = 10;
    let shortestPathAnimationDelay = 10;

    let targetNodeIndex = animateVisitedNodes(order, visitedNodesAnimationDelay);
    let shortestPathOrder = getShortestPathOrder(previousNodes, myGrid.targetNode);
    setTimeout(() => animateShortestPath(shortestPathOrder, shortestPathAnimationDelay), targetNodeIndex * visitedNodesAnimationDelay); //Could use promises here?
}

function visualizeAStar()
{
    try
    {
        [costs, order, previousNodes] = runAStarAlgorithm(myGrid);
    }
    catch (err)
    {
        return;
    }

    let visitedNodesAnimationDelay = 10;
    let shortestPathAnimationDelay = 10;

    let targetNodeIndex = animateVisitedNodes(order, visitedNodesAnimationDelay);
    let shortestPathOrder = getShortestPathOrder(previousNodes, myGrid.targetNode);
    setTimeout(() => animateShortestPath(shortestPathOrder, shortestPathAnimationDelay), targetNodeIndex * visitedNodesAnimationDelay); //Could use promises here?
}

function animateVisitedNodes(order, animationDelay)
{
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

function getShortestPathOrder(previousNodesMap, endNode)
{
    let order = [];
    let prev = previousNodesMap.get(endNode);
    while(prev != null)
    {
        order.splice(0, 0, prev);
        prev = previousNodesMap.get(prev);
    }
    return order;
}

function animateShortestPath(order, animationDelay)
{
    for (let index = 1; index < order.length; index++)
    {
        setTimeout(() => order[index].setState(State.HIGHLIGHT), animationDelay * index);
    }
}