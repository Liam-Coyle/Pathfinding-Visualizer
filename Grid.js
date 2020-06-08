class Grid
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.mouseDown = false;
        this.startNode = null;
        this.targetNode = null;
        this.nodes = Grid.buildBlankGrid(this.width, this.height);
    }

    static buildBlankGrid(width, height)
    {
        //Create 2d array
        let nodes = new Array(height);
        for (let row = 0; row < height; row++)
        {
            nodes[row] = new Array(width);
        }

        //Fill it with empty nodes
        for (let row = 0; row < height; row++)
        {
            for (let column = 0; column < width; column++)
            {
                nodes[row][column] = new Node(`${row}-${column}`, false, false);
            }
        }

        //Return grid
        return nodes;
    }

    //Draws the grid on the screen
    draw()
    {
        let grid = document.getElementById('grid');

        //Constructs table
        for (let currentRow = 0; currentRow < this.height; currentRow++)
        {
            let row = grid.insertRow(currentRow);

            for (let currentColumn = 0; currentColumn < this.width; currentColumn++)
            {
                let cell = row.insertCell(currentColumn);
                let thisNode = this.nodes[currentRow][currentColumn];

                //Adds corresponding id and class to each cell in table
                cell.id = thisNode.position;
                cell.classList.add(thisNode.state);

                //Adds event listeners to each node which listen for mouse clicks etc
                this.addListeners(cell, thisNode);
            }
        }

        //Single mouseup event added to document rather than every cell
        document.addEventListener('mouseup', () => this.mouseDown = false);
    }

    //Adds event listeners to a given cell
    //@param cell HTML <td> cell which event listeners should be added to
    //@param node The Node object which corresponds to the given cell
    addListeners(cell, node)
    {
        cell.addEventListener('mousedown', e => {
            
            if (e.shiftKey) 
            {
                this.setStart(node);
            }
            else if (e.ctrlKey) 
            {
                this.setTarget(node);
            }
            else if (node.state === State.WALL || node.state === State.UNVISITED)
            {
                this.mouseDown = true;
                node.toggleWall();
            }
        });

        cell.addEventListener('mouseover', () => {
            if (this.mouseDown && (node.state === State.WALL || node.state === State.UNVISITED))
            {
                node.toggleWall();
            }
        });
    }

    setStart(node)
    {
        if (this.startNode === null)
        {
            node.makeStart();
            this.startNode = node;
        }
        else
        {
            this.startNode.setState(State.UNVISITED);
            node.makeStart();
            this.startNode = node;
        }
    }

    setTarget(node)
    {
        if (this.targetNode === null)
        {
            node.makeTarget();
            this.targetNode = node;
        }
        else
        {
            this.targetNode.setState(State.UNVISITED);
            node.makeTarget();
            this.targetNode = node;
        }
    }

    getNodePositionAsInt(node)
    {
        if (node === null)
        {
            return [null, null];
        }
        let nodePositionArrayStr = node.position.split("-"); //Get x,y position as array of strings
        let nodeRow = parseInt(nodePositionArrayStr[0]); //Convert x to int
        let nodeColumn = parseInt(nodePositionArrayStr[1]); //Convert y to int
        return [nodeRow, nodeColumn];
    }

    getNeighboursOfNode(node)
    {
        //Prepare array
        let neighbouringNodes = new Array(4);

        //Get node position
        let [nodeRow, nodeColumn] = this.getNodePositionAsInt(node);
        if (nodeRow === null)
        {
            return null;
        }
        
        //Get neighbouring nodes
        neighbouringNodes[0] = (nodeRow - 1 >= 0) ? this.nodes[nodeRow - 1][nodeColumn] : null; //Above
        neighbouringNodes[1] = (nodeColumn + 1 < this.width) ? this.nodes[nodeRow][nodeColumn + 1] : null; //Right
        neighbouringNodes[2] = (nodeRow + 1 < this.height) ? this.nodes[nodeRow + 1][nodeColumn] : null; //Below
        neighbouringNodes[3] = (nodeColumn - 1 >= 0) ? this.nodes[nodeRow][nodeColumn - 1] : null; //Left
        return neighbouringNodes;
    }

    getDistance(nodeA, nodeB)
    {
        let [nodeARow, nodeAColumn] = this.getNodePositionAsInt(nodeA);
        let [nodeBRow, nodeBColumn] = this.getNodePositionAsInt(nodeB);

        let diffColumn = Math.abs(nodeBColumn - nodeAColumn);
        let diffRow = Math.abs(nodeBRow - nodeARow);

        return (diffColumn + diffRow);
    }
}