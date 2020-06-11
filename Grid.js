class Grid
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.mouseDown = false;
        this.startNode = null;
        this.targetNode = null;
        this.draggingStart = false;
        this.draggingTarget = false;
        this.locked = false;
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
        grid.innerHTML = '';

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

        this.setStart(myGrid.nodes[15][19]); //TODO: Make dynamic
        this.setTarget(myGrid.nodes[15][57]);

        //Single mouseup event added to document rather than every cell
        document.addEventListener('mouseup', () => 
        {
            this.mouseDown = false
            this.draggingStart = false;
            this.draggingTarget = false;
        });
    }

    //Adds event listeners to a given cell
    //@param cell HTML <td> cell which event listeners should be added to
    //@param node The Node object which corresponds to the given cell
    addListeners(cell, node)
    {
        cell.addEventListener('mousedown', e => {
            if (node.state === State.START)
            {
                this.draggingStart = true;
            }
            else if (node.state === State.TARGET)
            {
                this.draggingTarget = true;
            }
            else if (node.state === State.WALL || node.state === State.UNVISITED)
            {
                if (!this.locked)
                {
                    this.mouseDown = true;
                    node.toggleWall();
                }
            }
        });

        cell.addEventListener('mouseover', () => {
            if (this.draggingStart)
            {
                this.setStart(node);
            }
            else if (this.draggingTarget)
            {
                this.setTarget(node);
            }
            else if (this.mouseDown && (node.state === State.WALL || node.state === State.UNVISITED))
            {
                node.toggleWall();
            }
        });
    }

    setStart(node)
    {
        if (!this.locked)
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
    }

    setTarget(node)
    {
        if (!this.locked)
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

    reset(removeStartAndTarget)
    {
        this.unlock();
        for (let row = 0; row < this.height; row++)
        {
            for (let column = 0; column < this.width; column++)
            {
                let thisNode = this.nodes[row][column];
                if (thisNode === this.startNode || thisNode === this.targetNode)
                {
                    if (removeStartAndTarget)
                    {
                        thisNode.setState(State.UNVISITED);
                        this.startNode = null;
                        this.targetNode = null;
                    }
                }
                else
                {
                    thisNode.setState(State.UNVISITED);
                }
            }
        }
    }

    clearPath()
    {
        this.unlock();
        for (let row = 0; row < this.height; row++)
        {
            for (let column = 0; column < this.width; column++)
            {
                let thisNode = this.nodes[row][column];
                if (thisNode.state === State.HIGHLIGHT || thisNode.state === State.VISITED)
                {
                    thisNode.setState(State.UNVISITED);
                }
            }
        }
    }

    lock()
    {
        this.locked = true;
    }

    unlock()
    {
        this.locked = false;
    }

    drawBorder()
    {
        let order = [];
        for (let row = 0; row < this.height; row++)
        {
            order.push(this.nodes[row][0]);
            order.push(this.nodes[row][this.width - 1]);
        }
        for (let column = 1; column < this.width - 1; column++)
        {
            order.push(this.nodes[0][column]);
            order.push(this.nodes[this.height - 1][column]);
        }
        return order;
    }
}