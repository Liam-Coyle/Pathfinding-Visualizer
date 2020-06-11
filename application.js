const myGrid = new Grid(75,27);
myGrid.draw();

function visualizeAlgorithm()
{
    clearPath();
    myGrid.lock();
    try
    {
        let menu = document.getElementById('pathfindingDropdown');
        let algorithm = window[menu.options[menu.selectedIndex].value];
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

function visualizeMazeAlgorithm()
{
    clearWalls();
    myGrid.lock();
    let wallOrder;

    try
    {
        let menu = document.getElementById('mazeDropdown');
        let algorithm = window[menu.options[menu.selectedIndex].value];
        wallOrder = algorithm(myGrid, 1, 1, myGrid.width - 2, myGrid.height - 2, getSplitOrientation(myGrid.width, myGrid.height), myGrid.drawBorder());
    }
    catch (err)
    {
        return;
    }

    let animationDelay = 10;
    animateMaze(wallOrder, animationDelay);
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

function animateShortestPath(order, animationDelay)
{
    setTimeout(() => myGrid.unlock(), animationDelay * order.length);
    for (let index = 1; index < order.length; index++)
    {
        setTimeout(() => order[index].setState(State.HIGHLIGHT), animationDelay * index);
    }
}

function animateMaze(order, animationDelay)
{
    setTimeout(() => myGrid.unlock(), animationDelay * order.length);
    for (let index = 0; index < order.length; index++)
    {
        setTimeout(() => order[index].setState(State.WALL), animationDelay * index);
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