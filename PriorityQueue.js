//Implements a PriorityQueue using an array.
//COULD BE OPTIMIZED USING BINARY HEAP.

class QueueElement { 
    constructor(element, priority) 
    { 
        this.element = element; 
        this.priority = priority; 
    } 
} 

class PriorityQueue { 
    constructor() 
    { 
        this.items = []; 
    }

    enqueue(element, priority) 
    { 
        var queueElement = new QueueElement(element, priority); 
        var added = false; 
      
        for (var index = 0; index < this.items.length; index++) 
        { 
            if (this.items[index].priority > queueElement.priority) 
            {
                this.items.splice(index, 0, queueElement); 
                added = true; 
                break; 
            } 
        } 
      
        if (!added) 
        {
            this.items.push(queueElement); 
        }
    }

    dequeue()
    {
        return !this.isEmpty() ? this.items.shift() : null;
    }

    isEmpty()
    {
        return this.items.length === 0 ? true : false;
    }

    updatePriority(targetInnerElement, priority)
    {
        for (let index = 0; index < this.items.length; index++)
        {
            if (this.items[index].element === targetInnerElement)
            {
                this.items.splice(index, 1);
                break;
            }
        }
        this.enqueue(targetInnerElement, priority);
    }

    containsInnerElement(targetInnerElement)
    {
        for (let queueElement of this.items)
        {
            if (queueElement.element === targetInnerElement) 
            {
                return true;
            }
        }
        return false;
    }
}