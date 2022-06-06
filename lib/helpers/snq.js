export default function snq(callback, defaultValue) {
    try {
        const result = callback();
        return typeof result === 'undefined' ? defaultValue : result;
    } catch (err) {
        if (err instanceof TypeError) {
            return defaultValue;
        }

        throw err;
    }
}
