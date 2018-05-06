
const arabic = "[\\d\\.,]+";
const frac = (base: string) => `${base}/${base}`;
const frac2 = (base: string) => `${base}分の${base}`;
const numberClass = `${frac(arabic)}|${frac2(arabic)}|${arabic}`;
const extractRegex = new RegExp(`${numberClass}`, "g")

const replaceMap: { [c: string]: string | undefined } = {
    "１": "1", "２": "2", "３": "3", "４": "4", "５": "5", "６": "6", "７": "7", "８": "8", "９": "9", "０": "0",
    "一": "1", "二": "2", "三": "3", "四": "4", "五": "5", "六": "6", "七": "7", "八": "8", "九": "9", "零": "0",
}

const nonSupportedChars = ["十", "百", "千", "万"];

const mark = "@@";

const normalizeNumber = (orig: string): string => {
    let result = "";
    for(let i = 0; i < orig.length; ++i) {
        let c = orig[i];
        let r = replaceMap[c];
        if (r !== undefined) {
            result += r;
        } else {
            result += c;
        }
    }
    return result;
}

export const extract = (amount: string): [number, string] | undefined => {
    if (nonSupportedChars.every(c => !amount.includes(c))) {
        let normalized = normalizeNumber(amount);
        let m = normalized.match(extractRegex);
        if (m && m.length === 1) {
            let num = parseFloat(m[0].replace(/,/, ""));
            return [num, normalized.replace(m[0], mark)];
        }
    }
    return undefined;
}

export const format = (extracted: [number, string], multiply = 1): string => {
    let num = extracted[0] * multiply;
    return extracted[1].replace(mark, num.toString())
}

export const mayBeMultiplyAmount = (amount: string, multiply = 1): string => {
    let extracted = extract(amount);
    if (extracted) {
        return format(extracted, multiply)
    } else {
        return amount;
    }
}

export const mayBeAddAmount = (amount1: string, amount2: string): string | undefined => {
    let ex1 = extract(amount1);
    let ex2 = extract(amount2);
    if (ex1 && ex2 && ex1[1] == ex2[1]) {
        return format([ex1[0] + ex2[0], ex1[1]])
    } else {
        return undefined;
    }
}

export default mayBeMultiplyAmount;