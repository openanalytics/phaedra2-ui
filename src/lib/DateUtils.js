export default {
    parseLocaleDateString(localeDataString) {
        const dateParts = localeDataString.split('-');
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Month is zero-based
        const year = parseInt(dateParts[2]);

        const parsedDate = new Date(year, month, day);
        return parsedDate.getTime();
    }
}


