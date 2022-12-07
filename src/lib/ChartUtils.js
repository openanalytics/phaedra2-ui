//Filter
function excludeGroupFromTemplate(template, grouper, value) {
    //If transforms is not defined, create it
    if (!template.transforms) {
        template.transforms = []
    }
    //Add transformation to exclude the group from the template
    template.transforms.push({
        type: "filter",
        target: grouper,
        operation: "!=", //Exclude
        value: value
    })
    return template
}

//Map well data to data usable by the chart
function mapWellsToData(wells, x, y, grouper, notSelected) {
    //Create a data object for each well, filter out wells that are not selected if grouper value is in notSelected array
    return wells.filter(well => !notSelected.some(s => String(s.value) === String(well[grouper]))).map(well => {
        return {
            x: well[x],
            y: well[y],
            grouper: well[grouper],
        }
    })
}

//Colouring the grouper values
function getGrouperColor(well) {
    //Count amount of unique well.grouper values
    let uniqueGrouperValues = [...new Set(well.grouper)]
    let uniqueGrouperValuesCount = uniqueGrouperValues.length
    console.log(uniqueGrouperValuesCount)
    //Create a color gradient for each unique well.grouper value
    let colorGradient = createColorGradient(uniqueGrouperValuesCount)
    console.log(colorGradient)
    //Find the index of the current well.grouper value in the uniqueGrouperValues array
    let grouperIndex = uniqueGrouperValues.indexOf(well.grouper)
    //Return the color from the color gradient at the index of the current well.grouper value
    return colorGradient[grouperIndex]
}

function getGrouperColors(wells) {
    //Count amount of unique well.grouper values
    let uniqueGrouperValues = [...new Set(wells.map(well => well.grouper))]
    let uniqueGrouperValuesCount = uniqueGrouperValues.length
    //Create a color gradient for each unique well.grouper value
    let colorGradient = createColorGradient(uniqueGrouperValuesCount)
    //Map each grouper value to a color from the color gradient
    let grouperColors = {}
    uniqueGrouperValues.forEach((grouperValue, index) => {
        grouperColors[grouperValue] = colorGradient[index]
    })
    return grouperColors
}

function createColorGradient(count) {
    //Create a color gradient for each unique well.grouper value
    //Colors are uniformly distributed on the color wheel
    let colorGradient = []
    let colorStep = 360 / count
    for (let i = 0; i < count; i++) {
        colorGradient.push(hslToHex(i * colorStep / 360, 1, 0.5))
    }
    return colorGradient
}

function hslToHex(h, s, l) {
    //Convert HSL to RGB
    let r, g, b
    if (s == 0) {
        r = g = b = l // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
    }
    //Convert RGB to HEX
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}


export default {
    getGrouperColors,
    excludeGroupFromTemplate,
    mapWellsToData,
}