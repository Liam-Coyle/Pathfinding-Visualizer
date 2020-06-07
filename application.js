const myGrid = new Grid(75,28);
myGrid.draw();

function visualizeDijkstras()
{
    [costs, order, previousNodes] = runDijkstrasAlgorithm(myGrid);

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
    order.push(prev);
    do
    {
        prev = previousNodesMap.get(prev);
        order.push(prev);
    }
    while(prev != null);
    return order;
}

function animateShortestPath(order, animationDelay)
{
    for (let index = 0; index < order.length - 2; index++)
    {
        setTimeout(() => order[index].setState(State.HIGHLIGHT), animationDelay * index);
    }
}