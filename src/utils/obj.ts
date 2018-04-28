export function alter<T>(source: T, patch: Partial<T>): T {
    return Object.assign({}, source, patch);
}

export function alterArray<T>(source: T[], pred: (x: T, i: number) => boolean, patch: Partial<T>): T[] {
    return source.map((item, index) => {
        if(pred(item, index)) {
            return alter(item, patch);
        }
        return item;
    });
}

export function map<T extends { [s: string]: V | undefined }, V, U>(source: T, mapf: (x: V) => U): {[P in keyof T]: U | undefined} {
    let result: {[P in keyof T]: U | undefined} = {} as any;
    Object.keys(source).forEach(key => {
        let val = source[key];
        result[key] = val === undefined ? undefined : mapf(val);
    })
    return result;
}

export type ObjGetIn2<TR> = { [s: string]: { [s: string]: TR | undefined } | undefined };
export function getIn2<TR>(obj: ObjGetIn2<TR>, k1: string, k2: string): TR|undefined {
    let v1 = obj[k1];
    return v1 && v1[k2];
}

export type ObjGetIn3<TR> = { [s: string]: { [s: string]: { [s: string]: TR | undefined } | undefined } | undefined };
export function getIn3<TR>(obj: ObjGetIn3<TR>, k1: string, k2: string, k3: string): TR|undefined {
    let v1 = obj[k1];
    let v2 = v1 && v1[k2];
    return v2 && v2[k3];
}

export type ObjSetIn1<TR> = { [s: string]: TR | undefined };
export function set<TR>(obj: ObjSetIn1<TR>, k1: string, value: TR): ObjSetIn1<TR> {
    return {
        ...obj,
        [k1]: value
    }
}

export type ObjSetIn2<TR> = { [s: string]: { [s: string]: TR | undefined } | undefined };
export function setIn2<TR>(obj: ObjSetIn2<TR>, k1: string, k2: string, value: TR): ObjSetIn2<TR> {
    let o1 = obj[k1] || {}
    return {
        ...obj,
        [k1]: {
            ...o1,
            [k2]: value
        }
    }
}

export type ObjSetIn3<TR> = { [s: string]: { [s: string]: { [s: string]: TR | undefined } | undefined } | undefined };
export function setIn3<TR>(obj: ObjSetIn3<TR>, k1: string, k2: string, k3: string, value: TR): ObjSetIn3<TR> {
    let o1 = obj[k1] || {}
    let o2 = o1[k2] || {}

    return {
        ...obj,
        [k1]: {
            ...o1,
            [k2]: {
                ...o2,
                [k3]: value
            }
        }
    };
}

export function asArray<T, V = T>(
    obj: { [index: string]: T | undefined },
    mapf: (value: T, key: string) => V = (v, _k) => (v as any),
    filterf: (value: T | undefined, key: string) => T | false = (v, _k) => !!v && (v as T)): V[]
{
    let filtered: [string, T][] = []
    Object.entries(obj).forEach(([k, v]) => {
        let newValue = filterf(v, k); 
        if (newValue !== false) {
            filtered.push([k, newValue]);
        }
    });
    return filtered.map(([k, v]) => mapf(v, k));
}

export function update<T, U>(
    source: { [key: string]: T },
    values: U[],
    getKey: (value: U) => string,
    convert: (key: string, value: U) => T
): { [key: string]: T} {
    let newSource = { ...source };
    values.forEach(value => {
        let key = getKey(value);
        let newValue = convert(key, value);
        newSource[key] = newValue
    });
    return newSource;
}

export function remove<T>(
    source: { [key: string]: T },
    keys: string[]
) {
    let newSource = { ...source };
    keys.forEach(id => delete newSource[id]);
    return newSource;
}

export function equals(o1: object | undefined, o2: object | undefined, depth: number | undefined = undefined): boolean {
    let a1: any = o1;
    let a2: any = o2;
    if(typeof a1 !== typeof a2) {
        return false;
    }

    if (typeof a1 !== "object" || a1 === null || a2 == null) {
        return a1 === a2;
    }

    let keys = Object.keys(a1);
    let keys2 = Object.keys(a2);

    if(keys.length !== keys2.length) {
        return false;
    }

    for(let i = 0; i < keys.length; ++i) {
        let key = keys[i];
        let v1 = a1[key];
        let v2 = a2[key];
        if (depth && depth <= 1) {
            if (v1 !== v2) { return false; }
        } else {
            let t1 = typeof v1;
            let t2 = typeof v2;
            if (t1 === t2 && t1 === "object") {
                if (!equals(v1, v2, depth && (depth - 1))) { return false }
            } else {
                if (v1 !== v2) { return false; }
            }
        }
    }
    return true;
}

const obj = {
    alter,
    alterArray,
    map,
    asArray,
    equals,
    getIn2,
    getIn3,
    set,
    setIn2,
    setIn3,
    update,
    remove,
}

export default obj;