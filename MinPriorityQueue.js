/**
 * Represents an element in a priority queue
 * NOTE: Cannot store null values
 * @author Liam Coyle <lcoyle21@qub.ac.uk>
 */
class QueueElement 
{ 
    /**
     * The constructor for a QueueElement object
     * @param {*} element The data which will be stored
     * @param {Number} priority The priority of this element in a priority queue
     */
    constructor(element, priority) 
    { 
        if (element === null)
        {
            throw ('element cannot be null');
        }

        if (typeof(priority) !== 'number')
        {
            throw ('priority must be a number');
        }

        this.element = element; 
        this.priority = priority; 
    } 
} 

/**
 * Represents a minimum priority queue
 * NOTE: Cannot store null values
 * @author Liam Coyle <lcoyle21@qub.ac.uk>
 */
class MinPriorityQueue 
{ 
    /**
     * Constructor for a MinPriorityQueue object
     */
    constructor() 
    { 
        this.items = []; 
    }

    /**
     * Inserts an element into the queue at the corresponding index based on it's priority
     * @param {*} element The element to add to the queue
     * @param {Number} priority The priority of the element
     */
    enqueue(element, priority) 
    { 
        if (element === null)
        {
            throw ('element cannot be null');
        }

        if (typeof(priority) !== 'number')
        {
            throw ('priority must be a number');
        }

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

    /**
     * @return The QueueElement with the highest priority if the queue is not empty, else returns null
     */
    dequeue()
    {
        return !this.isEmpty() ? this.items.shift() : null;
    }

    /**
     * @return Boolean true if the queue is empty, else returns false
     */
    isEmpty()
    {
        return this.items.length === 0 ? true : false;
    }

    /**
     * Updates the priority of an element in a queue
     * If it is not already in the queue, it is added.
     * @param {*} targetInnerElement The inner element you want to update priority of
     * @param {Number} priority The new priority
     */
    updatePriority(targetInnerElement, priority)
    {
        if (targetInnerElement === null)
        {
            throw ('targetInnerElement cannot be null');
        }

        if (typeof(priority) != 'number')
        {
            throw ('priority must be a number');
        }

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

    /**
     * Checks if an element is in a queue
     * @param {*} targetInnerElement The inner element which is being checked
     * @return Boolean true if the queue contains the element, else returns false
     */
    containsInnerElement(targetInnerElement)
    {
        if (targetInnerElement === null)
        {
            throw ('targetInnerElement cannot be null');
        }

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