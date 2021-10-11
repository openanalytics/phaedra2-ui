function addSelectionBoxSupport(rootElement, wellSlots, selectionHandler) {
    let selectionBoxSupport = {

        rootElement: rootElement,
        wellSlots: wellSlots,
        selectionHandler: selectionHandler,
        dragInProgress: false,
        dragStartPosition: null,
        selectionRectangle: null,

        dragStart: function(event) {
            if (this.dragInProgress) return
            event.preventDefault()
            this.dragInProgress = true
            this.dragStartPosition = { x: event.pageX, y: event.pageY }
            
            let offset = this.rootElement.value.parentNode.getBoundingClientRect()
            let box = document.createElement('div')
            box.className = 'selectionBox'
            box.style.position = 'absolute'
            box.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
            box.style.border = '1px solid black'
            box.style.left = (event.pageX - offset.left) + 'px'
            box.style.top = (event.pageY - offset.top) + 'px'
            this.rootElement.value.appendChild(box)

            this.selectionRectangle = box
        },
        dragMove: function(event) {
            if (!this.dragInProgress) return
            this.selectionRectangle.style.width = Math.abs(event.pageX - this.dragStartPosition.x) + 'px'
            this.selectionRectangle.style.height = Math.abs(event.pageY - this.dragStartPosition.y) + 'px'
        },
        dragEnd: function(event) {
            event.preventDefault()
            this.dragInProgress = false
            this.rootElement.value.removeChild(this.selectionRectangle)

            let dragEndPosition = { x: event.pageX, y: event.pageY }
            let selectedBox = {
                left: this.dragStartPosition.x,
                top: this.dragStartPosition.y,
                right: dragEndPosition.x,
                bottom: dragEndPosition.y,
                width: dragEndPosition.x - this.dragStartPosition.x,
                height: dragEndPosition.y - this.dragStartPosition.y,
            }
            if (selectedBox.width > 5 && selectedBox.height > 5) {
                let selectedWells = []
                wellSlots.value.forEach(slot => {
                    let bounds = slot.$el.getBoundingClientRect()
                    let overlap = (bounds.top <= selectedBox.bottom && bounds.bottom >= selectedBox.top && bounds.left <= selectedBox.right && bounds.right >= selectedBox.left)
                    if (overlap) {
                        selectedWells.push(slot.well)
                    }
                })
                this.selectionHandler(selectedWells)
            }
        }
    }
    return selectionBoxSupport
}

export default {
    addSelectionBoxSupport
}