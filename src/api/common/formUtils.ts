export const notEmpty = (error: string) => (value: string) => value ? undefined : error;
export const isNumber = (error: string) => (value: string) => (!value || !isNaN(Number(value))) ? undefined : error;
export const isDate = (error: string) => (value: string) => { console.log(value); (!value || !isNaN(Date.parse(value))) ? undefined : error};

export const formatDate = (time?: number) => {
    if (time) {
        let date = new Date(time);
        return `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
    } else {
        return "";
    }
}

export const parseDate = (date?: string) => {
    if (date) {
        return Date.parse(date);
    } else {
        return undefined;
    }
}

export const formatNumber = (num: number) => {
    return (num != undefined) ? num.toString() : "";
}

export default {
    formatDate,
    parseDate,
    notEmpty,
    isNumber,
    isDate,
}