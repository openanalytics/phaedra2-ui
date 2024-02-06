export default {
    parseLocaleDateString(localeDataString) {
        const separator = localeDataString.includes("/") ? "/" : "-";
        const dateParts = localeDataString.split(separator);
        const day = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Month is zero-based
        const year = parseInt(dateParts[2]);

        const parsedDate = new Date(year, month, day);
        return parsedDate.getTime();
    }
}


