import { format, extract } from "./extractUnit";
const mark = "@@";

describe("extract amount tests", () => {
    it("should parse simple amount correctly", () => {
        let result: any = extract("400g");
        expect(result).not.toBeUndefined();
        expect(result[0]).toBe(400);
        expect(result[1]).toBe(mark + "g");

        let result2: any = extract("小さじ1");
        expect(result2).not.toBeUndefined();
        expect(result2[0]).toBe(1);
        expect(result2[1]).toBe("小さじ" + mark);
    });

    it("should parse zenkaku amount correctly", () => {
        let result: any = extract("４００g");
        expect(result).not.toBeUndefined();
        expect(result[0]).toBe(400);
        expect(result[1]).toBe(mark + "g");
    });

    it("should parse comma formated amount correctly", () => {
        let result: any = extract("1,200g");
        expect(result).not.toBeUndefined();
        expect(result[0]).toBe(1200);
        expect(result[1]).toBe(mark + "g");
    });

    it("should parse kanji amount correctly", () => {
        let result2: any = extract("一切れ");
        expect(result2).not.toBeUndefined();
        expect(result2[0]).toBe(1);
        expect(result2[1]).toBe(mark + "切れ");
    });

    it("should not parse invalid amount", () => {
        let result: any = extract("適量");
        expect(result).toBeUndefined();

        let result2: any = extract("四百グラム");
        expect(result2).toBeUndefined();

        let result3: any = extract("十枚");
        expect(result3).toBeUndefined();
    });

    it("should format extracted amount", () => {
        let extracted = extract("3個");
        let formated = extracted && format(extracted)

        expect(formated).not.toBeUndefined();
        expect(formated).toBe("3個");

        let formated2 = extracted && format(extracted, 3)
        expect(formated2).not.toBeUndefined();
        expect(formated2).toBe("9個");
    })
});