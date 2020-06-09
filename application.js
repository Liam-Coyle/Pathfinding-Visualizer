const myGrid = new Grid(76,28);
myGrid.draw();

function visualizeAlgorithm()
{
    clearPath();

    try
    {
        let menu = document.getElementById('algorithmDropdown');
        let algorithm = window[menu.options[menu.selectedIndex].value];
        [costs, order, previousNodes] = algorithm(myGrid);
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

function resetGrid()
{
    stopAllAnimations();
    clearWalls();
    myGrid.draw();
}

function clearWalls()
{
    stopAllAnimations();
    myGrid.reset(false);
}

function clearPath() 
{
    stopAllAnimations();
    myGrid.clearPath();
}

function stopAllAnimations()
{
    var id = window.setTimeout(function() {}, 0);
    while (id--) 
    {
        window.clearTimeout(id);
    }
}