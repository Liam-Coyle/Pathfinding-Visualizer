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

/**
 * Opens the 'More info' modal with correct information
 * @param {String} algorithm The algorithm which is being explained
 */
function openMoreInfo(algorithm)
{
    let name = document.getElementById('algorithm-name');
    let info = document.getElementById('algorithm-info');
    switch (algorithm)
    {
        case 'dijkstras':
            name.innerHTML = 'Dijkstra\'s Algorithm';
            info.innerHTML = '<img src = dijkstras.gif></img>' + 
            '<h3>Description</h3>' + 
            '<p>This algorithm begins with a start node and an "open set" of candidate nodes. At each step, <b>the node in the open set with the lowest distance from the start</b> is examined. The node is marked "closed", and all nodes adjacent to it are added to the open set if they have not already been examined. This process repeats until a path to the destination has been found. Since the lowest distance nodes are examined first, the first time the destination is found, the path to it will be the shortest path.' +  
            '<h3 id = "advHeader">+ Advantages</h3>' + 
            '<ul id = "advantages"><li>Guarentees the shortest path</li><li>Can be used on weighted graphs</li><li>Only needs to run 1 time to calculate the shortest path from start node to every node on a graph</li><li>Can be made parallel <sup>[1]</sup></li></ul>' +
            '<h3 id = "disHeader">- Disadvantages</h3>' +
            '<ul id = "disadvantages"><li>Cannot handle negative edges</li><li>Time and memory consuming as it does a blind search</li></ul>' +
            '<h3>Applications</h3>' +
            '<ul><li>Geographical maps</li><li>Traffic information systems</li><li>Widely used in network routing protocols, e.g.Open Shortest Path First(OSPF) protocol <sup>[2]</sup></li><li>Telephone networks</li></ul>' + 
            '<h3>Read more</h3>' + 
            '<ul><li><a href = "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm">Wikipedia</a></li><li><a href = "http://www-m3.ma.tum.de/foswiki/pub/MN0506/WebHome/dijkstra.pdf">A Note on Two Problems in Connexion with Graphs - E.W. Dijkstra</a></li><li><a href = "https://www.researchgate.net/publication/47842024_A_Parallelization_of_Dijkstra\'s_Shortest_Path_Algorithm">A Parallelization of Dijkstra\'s Shortest Path Algorithm</a><sup>[1]</sup></li><li><a href = "https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/15-sy/iro-15-sy-book/iro-incre-spf.pdf">OSPF Incremental SPF</a><sup>[2]</sup></li></ul>';
            break;
        case 'aStar':
            name.innerHTML = 'A* Algorithm';
            info.innerHTML = '<img src = aStar.gif></img>' + 
            '<h3>Description</h3>' + 
            '<p>A* is a variant of Dijkstra\'s algorithm commonly used in games. <b>A* assigns a weight to each open node equal to the weight of the edge to that node plus the approximate distance between that node and the finish.</b> This approximate distance is found by the heuristic <sup>[3]</sup>, and represents a minimum possible distance between that node and the end. This allows it to eliminate longer paths once an initial path is found. If there is a path of length x between the start and finish, and the minimum distance between a node and the finish is greater than x, that node need not be examined.</p>' +  
            '<h3 id = "advHeader">+ Advantages</h3>' + 
            '<ul id = "advantages"><li>Guarentees the shortest path</li><li>Can be used on weighted graphs</li><li>It is optimally efficient, ie. there is no other optimal algorithm guarenteed to expand fewer nodes than A*</li></ul>' +
            '<h3 id = "disHeader">- Disadvantages</h3>' +
            '<ul id = "disadvantages"><li>The speed of execution is highly dependant on the accuracy of the heuristic <sup>[3]</sup> algorithm used</li></ul>' +
            '<h3>Applications</h3>' +
            '<ul><li>Pathfinding in video games</li><li>Parsing using stochastic grammars in NLP <sup>[1]</sup></li><li>Informational search with online learning <sup>[2]</sup></li></ul>' + 
            '<h3>Read more</h3>' + 
            '<ul><li><a href = "https://en.wikipedia.org/wiki/A*_search_algorithm">Wikipedia</a></li><li><a href = "https://ieeexplore.ieee.org/document/4082128">A Formal Basis for the Heuristic Determination of Minimum Cost Paths</a></li><li><a href = "https://www.aclweb.org/anthology/N03-1016.pdf">A* Parsing: Fast Exact Viterbi Parse Selection <sup>[1]</sup></a></li><li><a href = "http://www.eng.tau.ac.il/~bengal/GTA.pdf">A group testing algorithm with online informational learning <sup>[2]</sup></a></li><li><a href = "https://en.wikipedia.org/wiki/Heuristic_(computer_science)">Heuristic (computer science) - Wikipedia</a><sup>[3]</sup></li><li><a href = "http://theory.stanford.edu/~amitp/GameProgramming/">Amit’s A* Pages</a></li></ul>';
            break;
            case 'breadthFirstSearch':
                name.innerHTML = 'Breadth-First Search (BFS) Algorithm';
                info.innerHTML = '<img src = breadthFirstSearch.gif></img>' + 
                '<h3>Description</h3>' + 
                '<p>Breadth-first search (BFS) is an algorithm for traversing or searching tree or graph data structures. <b>It starts at the tree root (or in this case, the graph start node), and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.</b> It uses the opposite strategy as depth-first search, which instead explores the node branch as far as possible before being forced to backtrack and expand other nodes.</p>' +  
                '<h3 id = "advHeader">+ Advantages</h3>' + 
                '<ul id = "advantages"><li>Guarentees the shortest path</li><li>Performs well if the search space is small</li></ul>' +
                '<h3 id = "disHeader">- Disadvantages</h3>' +
                '<ul id = "disadvantages"><li>Cannot be used on a weighted graph</li><li>Time and memory consuming as it does a blind search</li><li>If solution is far away then it consumes time</li></ul>' +
                '<h3>Applications</h3>' +
                '<ul><li>Social networking websites to suggest people within a given distance</li><li>Copying garbage collection using Cheney\'s algorithm<sup>[1]</sup></li><li>Ford–Fulkerson method for computing the maximum flow in a flow network<sup>[2]</sup></li><li>Crawlers in search engines<sup>[3]</sup></li></ul>' + 
                '<h3>Read more</h3>' + 
                '<ul><li><a href = "https://en.wikipedia.org/wiki/Breadth-first_search">Wikipedia</a></li><li><a href = "https://en.wikipedia.org/wiki/Cheney%27s_algorithm">Cheney\'s algorithm</a><sup>[1]</sup></li><li><a href = "https://en.wikipedia.org/wiki/Ford%E2%80%93Fulkerson_algorithm">Ford-Fulkerson method</a><sup>[2]</sup></li><li><a href = "https://en.wikipedia.org/wiki/Web_crawler">Crawlers</a><sup>[3]</sup></li></ul>';
                break;
            case 'depthFirstSearch':
            name.innerHTML = 'Depth-First Search (DFS) Algorithm';
            info.innerHTML = '<img src = depthFirstSearch.gif></img>' + 
            '<h3>Description</h3>' + 
            '<p>Depth-first search (DFS) is an algorithm for traversing or searching tree or graph data structures. <b>The algorithm starts at the root node (or in this case, the start node) and explores as far as possible along each branch before backtracking.</b></p>' +  
            '<h3 id = "advHeader">+ Advantages</h3>' + 
            '<ul id = "advantages"><li>Faster and uses less memory than breadth-first search (BFS)<li>Potential to perform well when the solution (in this case, the target node) is very deep in the tree/graph (far away from the start node)</li></ul>' +
            '<h3 id = "disHeader">- Disadvantages</h3>' +
            '<ul id = "disadvantages"><li>Does not guarentee shortest path</li><li>May be inefficient when the target node is very close to the start node</li></ul>' +
            '<h3>Applications</h3>' +
            '<ul><li>Finding connected components<sup>[1]</sup></li><li>Topological sorting<sup>[2]</sup></li><li>Finding strongly connected components<sup>[3]</sup></li><li>Solving puzzles with only 1 solution such as mazes</li></ul>' + 
            '<h3>Read more</h3>' + 
            '<ul><li><a href = "https://en.wikipedia.org/wiki/Depth-first_search">Wikipedia</a></li><li><a href = "https://en.wikipedia.org/wiki/Component_(graph_theory)">Connected components</a><sup>[1]</sup></li><li><a href = "https://en.wikipedia.org/wiki/Topological_sorting">Topological sorting</a><sup>[2]</sup></li><li><a href= "https://www.geeksforgeeks.org/strongly-connected-components">Finding strongly connected components</a><sup>[3]</sup></li></ul>';
            break;
        case 'recursiveDivision':
            name.innerHTML = 'Recursive Division Algorithm';
            info.innerHTML = '<img src = recursiveDivision.gif></img>' + 
            '<h3>Description</h3>' + 
            '<p>Mazes can be created with recursive division, an algorithm which works as follows: Begin with the maze\'s space with no walls. Call this a chamber. <b>Divide the chamber with a randomly positioned wall</b> (or multiple walls) <b>where each wall contains a randomly positioned passage opening within it. Then recursively repeat </b>the process on the subchambers until all chambers are minimum sized. This method results in mazes with long straight walls crossing their space, making it easier to see which areas to avoid.</p>' +  
            '<h3>Read more</h3>' + 
            '<ul><li><a href = "https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method">Wikipedia</a></li><li><a href = "http://weblog.jamisbuck.org/2011/1/12/maze-generation-recursive-division-algorithm">The Buckblog - Maze Generation: Recursive Division</a></li></ul>';
            break;
    }
    document.getElementById('moreInfo').style.display = 'block';
}

/**
 * Closes the 'More info' modal
 */
function closeMoreInfo()
{
    document.getElementById('moreInfo').style.display = 'none';
}

//When the user clicks off the modal, close it.
window.onclick = (e) => {
    let modal = document.getElementById('moreInfo');
    if (e.target == modal) 
    {
        modal.style.display = "none";
    }
}
