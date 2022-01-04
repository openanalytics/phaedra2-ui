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

export default {
    formatDate,
    formatTextMaxLength,
    formatJSON
}