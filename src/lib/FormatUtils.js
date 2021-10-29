const formatDate = function(date) {
    if (!date) return '';
    if (typeof date === 'string') return new Date(date).toLocaleString()
    return date.toLocaleString();
}

export default {
    formatDate
}