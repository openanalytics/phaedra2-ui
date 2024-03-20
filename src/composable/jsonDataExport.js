export function useJsonDataExport() {
    function exportToJson(data, filename) {
        // Turn your data into a JSON string, and then into a Blob.
        const cleanData = removeDynamicProperties(data)
        const jsonStr = JSON.stringify(cleanData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });

        // Create an object URL from the Blob.
        const url = URL.createObjectURL(blob);

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;  // Name of the downloaded file

        // Append link to the DOM and simulate a click to download the file
        document.body.appendChild(link);
        link.click();

        // Clean up: remove the link and revoke the object URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function removeDynamicProperties(value) {
        const dynamicProperties = ['__typename', 'id', 'featureId', 'sourceFeatureId', 'versionNumber', 'createdOn', 'createdBy', 'updatedOn', 'updatedBy']

        if (value === null || value === undefined) {
            return value;
        } else if (Array.isArray(value)) {
            return value.map(v => removeDynamicProperties(v));
        } else if (typeof value === 'object') {
            const newValue = {};
            Object.entries(value).forEach(([key, value]) => {
                if (!dynamicProperties.includes(key)) {
                    newValue[key] = removeDynamicProperties(value);
                }
            });
            return newValue;
        }
        return value;
    }

    return {
        exportToJson
    }
}
