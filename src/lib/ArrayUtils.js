const groupBy = (array, key) => {
    return array.reduce(function (acc, val) {
        (acc[val[key]] = acc[val[key]] || []).push(val);
        return acc;
    }, {});
}

const toMap = (array, key) => {
    let map = {};
    for (const el of array) {
        map[el[key]] = el;
    }
    return map;
}

const sortBy = (array, key) => {
    return array.sort((a,b) => {
        let va = a[key];
        let vb = b[key];
        if (typeof va === 'string') return va.localeCompare(vb);
        return va - vb;
    });
}

const mergeBy = (a1, a2, key) => {
    let newArray = [...a1];
    a2.forEach(o => {
        let index = newArray.findIndex(oo => oo[key] === o[key]);
        if (index >= 0) newArray.splice(index, 1);
        newArray.push(o);
    });
    return newArray;
}

const distinctBy = (array, key) => {
    return [...new Set(array.map(o => o[key]))];
}

const groupItems = (array, groupSize)  => {
    const result = [];
    const totalItems = array.length;

    let startIndex = 0;
    while (startIndex < totalItems) {
        const endIndex = startIndex + groupSize;
        const group = array.slice(startIndex, endIndex);
        result.push(group);
        startIndex = endIndex;
    }

    return result;
}

export default {
    groupBy,
    sortBy,
    mergeBy,
    distinctBy,
    groupItems
}
