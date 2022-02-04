function addSelectionBoxSupport(rootElement, wellSlots, selectionHandler) {

    let selectionBoxSupport = {

        rootElement: rootElement,
        wellSlots: wellSlots,
        selectionHandler: selectionHandler,
        
        rootOffset: null,
        dragInProgress: false,
        dragStartPosition: {x:0,y:0},
        selectionRectangle: null,
        scrollError: {left: 0,right: 0},

        dragStart: function(event) {
            if (this.dragInProgress) return
            event.preventDefault()

            //Calculate pixels moved by scrolling
            this.scrollError = {
                left: document.querySelector('.q-panel').scrollLeft,
                top: document.documentElement.scrollTop
            }

            this.dragInProgress = true
            this.dragStartPosition = { x: event.pageX, y: event.pageY }

            let parentBounds = rootElement.value.parentNode.getBoundingClientRect()
            let rootStyle = window.getComputedStyle(rootElement.value)
            this.rootOffset = {
                left: parentBounds.left + parseInt(rootStyle.marginLeft) + this.scrollError.left,
                top: parentBounds.top + parseInt(rootStyle.marginTop) + this.scrollError.top
            }

            this.selectionRectangle = createSelectionBoxDiv(document, event, this.rootOffset);
            this.rootElement.value.appendChild(this.selectionRectangle);
        },

        dragMove: function(event) {
            if (!this.dragInProgress) return
            let bounds = calcRectangleBounds(this.dragStartPosition, { x: event.pageX, y: event.pageY })
            this.selectionRectangle.style.left = (bounds.left - this.rootOffset.left) + 'px'
            this.selectionRectangle.style.top = (bounds.top - this.rootOffset.top) + 'px'
            this.selectionRectangle.style.width = bounds.width + 'px'
            this.selectionRectangle.style.height = bounds.height + 'px'
        },

        dragEnd: function(event) {
            event.preventDefault()
            this.dragInProgress = false
            if (this.rootElement.value && this.rootElement.value.contains(this.selectionRectangle)) {
                this.rootElement.value.removeChild(this.selectionRectangle)
            }

            // Check if it is on grid
            var gridContainerCoords = document.querySelector('.gridContainer').getBoundingClientRect()
            if (gridContainerCoords.left - this.scrollError.left > event.pageX
                || gridContainerCoords.right - this.scrollError.left < event.pageX
                || gridContainerCoords.top - this.scrollError.right > event.pageY
                || gridContainerCoords.bottom - this.scrollError.right < event.pageY) {
                return
            }

            // Calculate wells in selection
            let selectedArea = calcRectangleBounds(
                { x: this.dragStartPosition.x - this.scrollError.left, y: this.dragStartPosition.y - this.scrollError.top},
                { x: event.pageX- this.scrollError.left, y: event.pageY-this.scrollError.top }
            );
            let selectedWells = []
            wellSlots.value.forEach(slot => {
                if (slot) {
                    let bounds = slot.$el.getBoundingClientRect()
                    if (boxesOverlap(bounds, selectedArea)) {
                        selectedWells.push(slot.well)
                    }
                }
            })
            this.selectionHandler(selectedWells);
        }
    }
    return selectionBoxSupport
}

/******************** 
 * Helper functions
 ********************/

function calcRectangleBounds(startPos, currentPos) {
    let bounds = {
        left: Math.min(currentPos.x, startPos.x),
        top: Math.min(currentPos.y, startPos.y),
        width: Math.abs(currentPos.x - startPos.x),
        height: Math.abs(currentPos.y - startPos.y)
    }
    bounds.right = bounds.left + bounds.width
    bounds.bottom = bounds.top + bounds.height
    return bounds
}

function boxesOverlap(box1, box2) {
    return (box1.top <= box2.bottom
        && box1.bottom >= box2.top
        && box1.left <= box2.right
        && box1.right >= box2.left)
}

function createSelectionBoxDiv(doc, event, rootOffset) {
    let box = doc.createElement('div');
    box.className = 'selectionBox';
    box.style.position = 'absolute';
    box.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    box.style.border = '1px solid black';
    box.style.left = (event.pageX - rootOffset.left) + 'px';
    box.style.top = (event.pageY - rootOffset.top) + 'px';
    return box;
}

export default {
    addSelectionBoxSupport
}