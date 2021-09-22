function createGradient(start, end, values) {
    let steps = values - 1
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

function createGradients(colorSteps, steps) {
    let colorBlocks = colorSteps.length - 1
    let colorsPerBlock = steps / colorBlocks;
    
    let colors = []
    for (var i=0; i<colorBlocks; i++) {
        let subset = createGradient(colorSteps[i], colorSteps[i+1], colorsPerBlock)
        for (var j=0; j<colorsPerBlock; j++) {
            colors.push(subset[j])
        }
    }
    
    // Can happen if values / colorBlocks rounds down.
    if (colorsPerBlock * colorBlocks < steps) {
        colors[steps-1] = colors[steps-2]
    }
    return colors;
}

export default {
    createGradient,
    createGradients
}