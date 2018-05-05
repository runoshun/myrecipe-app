
let disabledByDefault = !__DEV__;
let enabledTags: { [tag: string]: boolean } = {
};

export const create = (tag: string, logFn = console.log) => {
    return (...args: any[]) => {
        if (enabledTags[tag] !== disabledByDefault) {
            let _args = [`[${tag}]`, ...args];
            logFn.apply(undefined, _args);
        }
    }
}

export const enable = (...tags: string[]) => {
    tags.forEach(tag => enabledTags[tag] = true);
}

export const disable = (...tags: string[]) => {
    tags.forEach(tag => enabledTags[tag] = false);
}

export const setDisabledByDefault = (value: boolean) => {
    disabledByDefault = value;
}

export default {
    enable,
    disable,
    create,
    setDisabledByDefault,
}