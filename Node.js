class Node 
{
    constructor(position)
    {
        this.state = State.UNVISITED;
        this.position = position;
    }

    setState(state)
    {
        this.state = state;
        this.updateStyle();
    }

    //Updates a Node's CSS styling based on it's current state
    updateStyle()
    {
        document.getElementById(this.position).className = this.state;
    }

    toggleWall()
    {
        this.state == State.UNVISITED ? this.setState(State.WALL) : this.setState(State.UNVISITED);
    }

    makeStart()
    {
        this.setState(State.START);
    }

    makeTarget()
    {
        this.setState(State.TARGET);
    }
}