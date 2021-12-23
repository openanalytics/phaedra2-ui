function addSelectionBoxSupport(rootElement, wellSlots, selectionHandler) {
    let selectionBoxSupport = {

        rootElement: rootElement,
        rootOffset: null,
        wellSlots: wellSlots,
        selectionHandler: selectionHandler,
        dragInProgress: false,
        dragStartPosition: null,
        selectionRectangle: null,
        scrollError: null,

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

            let box = document.createElement('div')
            box.className = 'selectionBox'
            box.style.position = 'absolute'
            box.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
            box.style.border = '1px solid black'
            box.style.left = (event.pageX - this.rootOffset.left) + 'px'
            box.style.top = (event.pageY - this.rootOffset.top) + 'px'
            this.rootElement.value.appendChild(box)
            this.selectionRectangle = box
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
            this.rootElement.value.removeChild(this.selectionRectangle)
            let selectedBox = calcRectangleBounds({x: this.dragStartPosition.x - this.scrollError.left, y: this.dragStartPosition.y-this.scrollError.top}, { x: event.pageX- this.scrollError.left, y: event.pageY-this.scrollError.top })
            if (selectedBox.width > 5 && selectedBox.height > 5) {
                let selectedWells = []
                wellSlots.value.forEach(slot => {
                    let bounds = slot.$el.getBoundingClientRect()
                    if (boxesOverlap(bounds, selectedBox)) {
                        selectedWells.push(slot.well)
                    }
                })
                this.selectionHandler(selectedWells)
            }
        }
    }
    return selectionBoxSupport
}

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

export default {
    addSelectionBoxSupport
}