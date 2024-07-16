const formatDate = function(date) {
    if (!date) return '';
    if (typeof date === 'string') return new Date(date).toLocaleString()
    return date.toLocaleString();
}

const formatTextMaxLength = function(text, maxLen) {
    if (text && text.length > maxLen) {
        return text.substring(0, maxLen - 3) + '...';
    }
    return text;
}

const formatJSON = function(json) {
    if (!json) return '';
    let jsonObject = json;
    if (typeof json === 'string') jsonObject = JSON.parse(json)
    return JSON.stringify(jsonObject, null, 4)
}

const formatToScientificNotation = function (value, decimals = 2) {
    if (value === undefined) return "";
    const num = (typeof value === "number") ? value : Number.parseFloat(value);
    if (num == 0) return "0";
    return num.toExponential(decimals);
}

export default {
    formatDate,
    formatTextMaxLength,
    formatJSON,
    formatToScientificNotation
}
