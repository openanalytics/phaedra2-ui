function createGradients(start, end, steps) {
    let red = (start.red - end.red) / steps
    let green = (start.green - end.green) / steps
    let blue = (start.blue - end.blue) / steps

    let colors = []
    for (let i=0; i <= steps; i++) {
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
    for (let i=0; i<colorBlocks; i++) {
        let subset = createGradients(colorSteps[i], colorSteps[i+1], colorsPerBlock - 1)
        for (let j=0; j<subset.length; j++) {
            colors.push(subset[j])
        }
    }

    // Can happen if steps / colorBlocks rounds down.
    if (colorsPerBlock * colorBlocks < steps) {
        colors[steps-1] = colors[steps-2]
    }

    return colors;
}

function createLUT(values, gradients) {
    const min = Math.min(...values.filter(v => !isNaN(v)));
    const max = Math.max(...values.filter(v => !isNaN(v)));
    const range = max - min;
    const scale = ((gradients.length - 1) / range);

    return {
        getColor: (v) => {
            let index = Math.floor((v-min) * scale);
            return gradients[index];
        }
    };
}

function findGradientIndex(value, values, gradients) {
    if (isNaN(value)) return -1

    let min = Math.min(...values.filter(v => !isNaN(v)))
    let max = Math.max(...values.filter(v => !isNaN(v)))
    let valueRange = max - min

    let scale = ((gradients.length - 1) / valueRange)
    return Math.floor((value - min) * scale);
}

function calculateTextColor(backgroundColor) {
    if (!backgroundColor) return "#000000"
    let bg = asRGBColor(backgroundColor)
    let avg = (bg.red + bg.green + bg.blue) / 3
    if (avg > 127) return "#000000"
    else return "#DDDDDD"
}

function asCSSColor(color) {
    // return "#" + colorRGB.red.toString(16) + colorRGB.green.toString(16) + colorRGB.blue.toString(16)
    let colorRGB = asRGBColor(color);
    return `rgb(${colorRGB.red},${colorRGB.green},${colorRGB.blue})`;
}

function asRGBColor(color) {
    if (color.red && color.green && color.blue) {
        return color
    }
    else if (typeof color === "string") {
        if (color.charAt(0) === "#") {
            return {
                red: parseInt(color.substring(1, 3), 16),
                green: parseInt(color.substring(3, 5), 16),
                blue: parseInt(color.substring(5, 7), 16)
            }
        } else if (color.startsWith("rgb(")) {
            let parts = color.substring(4, color.length - 1).split(",");
            return {
                red: parseInt(parts[0]),
                green: parseInt(parts[1]),
                blue: parseInt(parts[2])
            }
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

function asColorInteger(color) {
    let colorObj = asRGBColor(color);
    return (colorObj.red << 16) + (colorObj.green << 8) + colorObj.blue;
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

function getCaptureJobEventTypeColor(eventType) {
    switch (eventType) {
        case 'Info': return 'blue'
        case 'Warning': return 'orange'
        case 'Error': return 'red'
        default: return 'grey'
    }
}

function generateRGBColor(index) {
    const r = index ? index % 256 : Math.floor(Math.random() * 256);
    const g = index ? index % 256 : Math.floor(Math.random() * 256);
    const b = index ? index % 256 : Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
}

function getColorList(size) {
    const colorList = [];

    for (let i = 0; i < size; i++) {
        const red = (i * 17) % 256;
        const green = (i * 31) % 256;
        const blue = (i * 53) % 256;

        colorList.push(`rgb(${red}, ${green}, ${blue})`);
    }

    return colorList;
}

export default {
    createGradients,
    createMultiGradients,
    createLUT,
    findGradientIndex,
    calculateTextColor,
    asCSSColor,
    asRGBColor,
    asColorInteger,
    defaultHeatmapGradients,
    getCaptureJobStatusColor,
    getCaptureJobEventTypeColor,
    generateRGBColor,
    getColorList
}
