class Grid
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
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
        for (let i = 0; i < this.height; i++)
        {
            let row = grid.insertRow(i);

            for (let j = 0; j < this.width; j++)
            {
                let cell = row.insertCell(j);
                let thisNode = this.nodes[i][j];

                //Adds corresponding id and class to each cell in table
                cell.id = thisNode.position;
                cell.classList.add(thisNode.state);

                //Adds event listeners which listen for mouse clicks etc
                this.addListeners(cell, thisNode);
            }
        }
    }

    //Adds event listeners to a given cell
    //@param cell HTML <td> cell which event listeners should be added to
    //@param node The Node object which corresponds to the given cell
    addListeners(cell, node)
    {
        var mouseDown = false;

        cell.addEventListener('mousedown', () => {
            this.mouseDown = true;
            node.click();
        });

        cell.addEventListener('mouseover', () => {
            if (this.mouseDown)
            {
                node.click();
            }
        });

        cell.addEventListener('mouseup', () => {
            this.mouseDown = false
        });
    }
}