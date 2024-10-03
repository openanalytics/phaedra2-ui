function parseVersion(v) {
    const parsedVersion = {
        major: NaN,
        minor: NaN,
        revision: NaN,
        qualifier: null
    };

    if (v) {
        const dashIndex = v.indexOf("-");
        if (dashIndex > 0) {
            parsedVersion.qualifier = v.substring(dashIndex + 1);
            v = v.substring(0, dashIndex);
        }

        const digits = v.split(".");
        if (digits.length > 0) parsedVersion.major = parseInt(digits[0]);
        if (digits.length > 1) parsedVersion.minor = parseInt(digits[1]);
        if (digits.length > 2) parsedVersion.revision = parseInt(digits[2]);
    }

    return parsedVersion;
}

function compareVersions (a,b) {
    if (!a && !b) return 0;
    if (!a && b) return -1;
    if (a && !b) return 1;

    const v1 = (typeof a === "string") ? parseVersion(a) : a;
    const v2 = (typeof b === "string") ? parseVersion(b) : b;

    if (v1.major < v2.major) return -1;
    if (v1.major > v2.major) return 1;
    if (v1.minor < v2.minor) return -1;
    if (v1.minor > v2.minor) return 1;
    if (v1.revision < v2.revision) return -1;
    if (v1.revision > v2.revision) return 1;
    if (!v1.qualifier && !v2.qualifier) return 0;
    if (!v1.qualifier && v2.qualifier) return -1;
    if (v1.qualifier && !v2.qualifier) return 1;
    return 0;
}

export default {
    parseVersion,
    compareVersions
}
