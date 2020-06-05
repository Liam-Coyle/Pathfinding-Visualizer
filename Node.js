class Node 
{
    constructor(position, isStart, isFinish)
    {
        this.state = State.UNVISITED;
        this.position = position;
        this.isStart = isStart;
        this.isFinish = isFinish;
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

    //Called when a node is clicked
    click()
    {
        //Toggle state between UNVISITED and WALL
        this.state == State.UNVISITED ? this.setState(State.WALL) : this.setState(State.UNVISITED);
    }
}