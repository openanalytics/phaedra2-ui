function createGradients(start, end, steps) {
    let red = (start.red - end.red) / steps
    let green = (start.green - end.green) / steps
    let blue = (start.blue - end.blue) / steps
    
    let colors = []
    for (var i=0; i <= steps; i++) {
        let newRed = Math.floor(start.red - (red * i))
        let newGreen = Math.floor(start.green - (green * i))
        let newBlue = Math.floor(start.blue - (blue * i))
        let newValue = "#" + newRed.toString(16) + newGreen.toString(16) + newBlue.toString(16)
        colors.push(newValue)
    }
    return colors
}

function createMultiGradients(colorSteps, steps) {
    let colorBlocks = colorSteps.length - 1
    let colorsPerBlock = steps / colorBlocks;
    
    let colors = []
    for (var i=0; i<colorBlocks; i++) {
        let subset = createGradients(colorSteps[i], colorSteps[i+1], colorsPerBlock - 1)
        for (var j=0; j<subset.length; j++) {
            colors.push(subset[j])
        }
    }
    
    // Can happen if steps / colorBlocks rounds down.
    if (colorsPerBlock * colorBlocks < steps) {
        colors[steps-1] = colors[steps-2]
    }

    return colors;
}

function findGradientIndex(value, values, gradients) {
    if (isNaN(value)) return -1

    let min = Math.min(...values)
    let max = Math.max(...values)
    let valueRange = max - min

    let scale = ((gradients.length - 1) / valueRange)
    let index = Math.floor(value * scale)
    return index;
}

export default {
    createGradients,
    createMultiGradients,
    findGradientIndex
}