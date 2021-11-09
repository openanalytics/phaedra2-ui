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

function calculateTextColor(backgroundColor) {
    if (!backgroundColor) return "#000000"
    let bg = asRGBColor(backgroundColor)
    let avg = (bg.red + bg.green + bg.blue) / 3
    if (avg > 127) return "#000000"
    else return "#DDDDDD"
}

function asCSSColor(colorRGB) {
    return "#" + colorRGB.red.toString(16) + colorRGB.green.toString(16) + colorRGB.blue.toString(16)
}

function asRGBColor(color) {
    if (color.red && color.green && color.blue) {
        return color
    }
    else if (typeof color === "string" && color.charAt(0) == "#") {
        return {
            red: parseInt(color.substring(1, 3), 16),
            green: parseInt(color.substring(3, 5), 16),
            blue: parseInt(color.substring(5, 7), 16)
        }
    }
    else if (typeof color === "number") {
        return {
            red: (color >> 16) & 0xFF,
            green: (color >> 8) & 0xFF,
            blue: color & 0xFF
        }
    }
    return color
}

const defaultHeatmapGradients = createMultiGradients([
    { red: 50, green: 50, blue: 150},
    { red: 255, green: 255, blue: 255},
    { red: 150, green: 50, blue: 50}
], 200)

function getCaptureJobStatusColor(statusCode) {
    switch (statusCode) {
        case 'Completed': return 'green'
        case 'Cancelled': return 'blue'
        case 'Error': return 'red'
        default: return 'grey'
    }
}

export default {
    createGradients,
    createMultiGradients,
    findGradientIndex,
    calculateTextColor,
    asCSSColor,
    asRGBColor,
    defaultHeatmapGradients,
    getCaptureJobStatusColor
}