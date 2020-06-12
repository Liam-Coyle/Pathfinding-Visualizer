/**
 * Represents a Grid containing Node objects
 * @author Liam Coyle <lcoyle21@qub.ac.uk>
 */
class Grid
{
    /**
     * Constructor for Grid object
     * @param {String} htmlID The htmlID of a html table tag which the grid will be injected into
     * @param {Number} width The integer width of the grid
     * @param {Number} height The integer height of the grid
     */
    constructor(htmlID, width, height)
    {
        if (typeof(htmlID) !== 'string')
        {
            throw ('htmlID should be a string');
        }
        
        if (!Number.isInteger(width))
        {
            throw ('width must be a positive Integer');
        }

        if (!Number.isInteger(height))
        {
            throw ('height must be a positive Integer');
        }

        this.htmlID = htmlID;
        this.width = width;
        this.height = height;
        this.mouseDown = false;
        this.startNode = null;
        this.targetNode = null;
        this.draggingStart = false;
        this.draggingTarget = false;
        this.replacedCellState = State.UNVISITED; //Stores the state of a node which has been replaced by the start/target node
        this.locked = false;
        this.nodes = Grid.buildBlankGrid(this.width, this.height);
    }

    /**
     * Builds a 2d array of node objects
     * @param {Number} width The integer width of the grid to construct
     * @param {Number} height The integer height of the grid to construct
     * @return {Array} 2d array of node objects
     */
    static buildBlankGrid(width, height)
    {
        if (!Number.isInteger(width))
        {
            throw ('width must be a positive Integer');
        }

        if (!Number.isInteger(height))
        {
            throw ('height must be a positive Integer');
        }

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
                nodes[row][column] = new Node(`${row}-${column}`);
            }
        }
        return nodes;
    }

    /**
     * Injects the html of the grid into the html table tag 
     */
    draw()
    {
        let grid = document.getElementById(this.htmlID);
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
            this.replacedCellState = State.UNVISITED;
        });
    }

    /**
     * Adds event listeners to a cell
     * @param {String} cell The HTML td cell which event listeners should be added to
     * @param {Object} node The Node object which corresponds to the cell
     */
    addListeners(cell, node)
    {
        if (cell === null)
        {
            throw ('cell cannot be null');
        }

        if (node === null)
        {
            throw ('node cannot be null');
        }

        cell.addEventListener('mousedown', () => {
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
            if (this.draggingStart && node != this.targetNode && !this.locked)
            {
                this.startNode.setState(this.replacedCellState);
                this.setStart(node);
            }
            else if (this.draggingTarget && node != this.startNode && !this.locked)
            {
                this.targetNode.setState(this.replacedCellState);
                this.setTarget(node);
            }
            else if (this.mouseDown && (node.state === State.WALL || node.state === State.UNVISITED))
            {
                node.toggleWall();
            }
        });
    }

    /**
     * Sets the start node of a grid
     * @param {Object} node The node to set
     */
    setStart(node)
    {
        if (node === null)
        {
            throw ('node cannot be null');
        }

        if (!this.locked)
        {
            if (this.draggingStart)
            {
                this.replacedCellState = node.state;
            }
            else if (this.startNode != null)
            {
                this.startNode.setState(State.UNVISITED);
            }
            node.makeStart();
            this.startNode = node;
        }
    }

    /**
     * Sets the target node of a grid
     * @param {Object} node The node to set
     */
    setTarget(node)
    {
        if (node === null)
        {
            throw ('node cannot be null');
        }

        if (!this.locked)
        {
            if (this.draggingTarget)
            {
                this.replacedCellState = node.state;
            }
            else if (this.targetNode != null)
            {
                this.targetNode.setState(State.UNVISITED);
            }
            node.makeTarget();
            this.targetNode = node;
        }
    }

    /**
     * Splits the string position of a Node into 2 corresponding integers
     * @param {Object} node The node to get the position of
     * @return {Array} Array in the order [row, column]
     */
    getNodePositionAsInt(node)
    {
        if (node === null)
        {
            throw ('node cannot be null');
        }

        let nodePositionArrayStr = node.position.split("-");
        let nodeRow = parseInt(nodePositionArrayStr[0]); 
        let nodeColumn = parseInt(nodePositionArrayStr[1]); 
        return [nodeRow, nodeColumn];
    }

    /**
     * Gets the neighbours of a node (Above, right, below, left)
     * @param {Object} node The node to get the neighbours of
     * @return {Array} Array of neighbouring nodes in the order [Above, Right, Below, Left]
     */
    getNeighboursOfNode(node)
    {
        if (node === null)
        {
            throw('node cannot be null');
        }

        let [nodeRow, nodeColumn] = this.getNodePositionAsInt(node);

        let neighbouringNodes = new Array(4);
        neighbouringNodes[0] = (nodeRow - 1 >= 0) ? this.nodes[nodeRow - 1][nodeColumn] : null; //Above
        neighbouringNodes[1] = (nodeColumn + 1 < this.width) ? this.nodes[nodeRow][nodeColumn + 1] : null; //Right
        neighbouringNodes[2] = (nodeRow + 1 < this.height) ? this.nodes[nodeRow + 1][nodeColumn] : null; //Below
        neighbouringNodes[3] = (nodeColumn - 1 >= 0) ? this.nodes[nodeRow][nodeColumn - 1] : null; //Left
        return neighbouringNodes;
    }

    /**
     * Calculates the manhattan distance between 2 nodes
     * @param {Object} nodeA 
     * @param {Object} nodeB 
     */
    getManhattanDistance(nodeA, nodeB)
    {
        if (nodeA === null || nodeB === null)
        {
            throw ('node cannot be null');
        }

        let [nodeARow, nodeAColumn] = this.getNodePositionAsInt(nodeA);
        let [nodeBRow, nodeBColumn] = this.getNodePositionAsInt(nodeB);
        let diffColumn = Math.abs(nodeBColumn - nodeAColumn);
        let diffRow = Math.abs(nodeBRow - nodeARow);
        return (diffColumn + diffRow);
    }

    /**
     * Reset the state every node in the grid to UNVISITED
     * @param {Boolean} removeStartAndTarget If set to true, the start and target nodes will also be reset
     */
    reset(removeStartAndTarget)
    {
        if (typeof(removeStartAndTarget) !== 'boolean')
        {
            throw ('removeStartAndTarget must be a boolean');
        }

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

    /**
     * Resets the state of every VISITED / HIGHLIGHT node to UNVISITED
     */
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

    /**
     * Locks the state of every node in the grid
     */
    lock()
    {
        this.locked = true;
    }

    /**
     * Unlocks the state of every node in the grid
     */
    unlock()
    {
        this.locked = false;
    }

    /**
     * Draws a border around the grid
     * @return {Array} Array of nodes in the order they were turned to walls
     */
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