var groupBy = function(array, key) {
    return array.reduce(function(acc, val) {
        (acc[val[key]] = acc[val[key]] || []).push(val);
        return acc;
    }, {});
};

var mergeBy = function(a1, a2, key) {
    let newArray = [...a1];
    a2.forEach(o => {
        let index = newArray.findIndex(oo => oo[key] === o[key]);
        if (index >= 0) newArray.splice(index, 1);
        newArray.push(o);
    });
    return newArray;
}

var distinctBy = function(array, key) {
    return [...new Set(array.map(o => o[key]))];
}

export default {
    groupBy,
    mergeBy,
    distinctBy
}
