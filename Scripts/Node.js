/**
 * Represents a Node on a grid (vertex)
 * @author Liam Coyle <lcoyle21@qub.ac.uk>
 */
class Node 
{
    /**
     * The constructor for Node object
     * @param {String} position The position of the node in a grid in format 'row-column'
     */
    constructor(position)
    {
        if (typeof(position) !== 'string' || !position.includes('-'))
        {
            throw ('position must be a string in format \'row-column\'');
        }

        this.state = State.UNVISITED;
        this.position = position;
    }

    /**
     * Sets the state of a node and updates it's CSS styling
     * @param {*} state The state to set 
     */
    setState(state)
    {
        if (state === null)
        {
            throw ('state cannot be null');
        }

        this.state = state;
        this.updateStyle();
    }

    /**
     * Updates a Node's CSS styling based on it's current state
     */
    updateStyle()
    {
        document.getElementById(this.position).className = this.state;
    }

    /**
     * Toggles node state between WALL and UNVISITED
     */
    toggleWall()
    {
        if (this.state == State.UNVISITED) 
        {
            this.setState(State.WALL);
        }
        else
        {
            this.setState(State.UNVISITED);  
        } 
    }

    /**
     * Sets the state of a node to START
     */
    makeStart()
    {
        this.setState(State.START);
    }

    /**
     * Sets the state of a node to TARGET
     */
    makeTarget()
    {
        this.setState(State.TARGET);
    }
}