
export const formatDate = (time?: number) => {
    if (time) {
        let date = new Date(time);
        return `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
    } else {
        return undefined;
    }
}

export const parseDate = (date?: string) => {
    if (date) {
        return Date.parse(date);
    } else {
        return undefined;
    }
}

export default {
    formatDate,
    parseDate,
}