import * as React from "react";
import { ViewStyle, TextStyle, ImageStyle, RegisteredStyle, StyleSheet } from "react-native";

type ReactNativeStyle = ViewStyle | ImageStyle | TextStyle;
type NamedStyles<T> = {[P in keyof T]: ReactNativeStyle };

export type __ThemableViewStyle<V> = {[P in keyof ViewStyle]: ViewStyle[P] | ((vars: V) => ViewStyle[P]) };
export type __ThemableTextStyle<V> = {[P in keyof TextStyle]: TextStyle[P] | ((vars: V) => TextStyle[P]) };
export type __ThemableImageStyle<V> = {[P in keyof ImageStyle]: ImageStyle[P] | ((vars: V) => ImageStyle[P]) };
export interface ThemableViewStyle<V> extends __ThemableViewStyle<V> { }
export interface ThemableTextStyle<V> extends __ThemableTextStyle<V> { }
export interface ThemableImageStyle<V> extends __ThemableImageStyle<V> { }

export type ThemableStyle<V> = ThemableViewStyle<V> | ThemableTextStyle<V> | ThemableImageStyle<V>;
export type NamedThemableStyles<T, V> = {[P in keyof T]: ThemableStyle<V> }

export type StylesValues<T> = {
    [P in keyof T]: RegisteredStyle<T[P]>;
}

export interface StylableProperties<T extends NamedThemableStyles<T, V>, V> {
    styles?: Stylable<T, V>
}

export interface StylableComponentClass<P, T extends NamedThemableStyles<T, V>, V> extends React.ComponentClass<P> {
    defaultStyles: Stylable<T, V>
}

export default class Stylable<T extends NamedThemableStyles<T, V>, V> {

    private _rawStyles: NamedThemableStyles<T, V>;
    private _rawVars: V;

    public readonly values: StylesValues<T>;

    constructor(styles: T, vars?: V) {
        this._rawStyles = styles;
        this._rawVars = (vars || {} as any);
        this.values = StyleSheet.create(this.expandStyles(styles, (vars || {} as any)));
    }

    private static cache: StylesCache = new Map();
    private static create<T extends NamedThemableStyles<T, V>, V>(styles: T, vars?: V) {
        let cache = getStylesCache(Stylable.cache, styles, vars);
        if (!cache) {
            cache = new Stylable(styles, vars);
            setStylesCache(Stylable.cache, styles, vars, cache);
        }
        return cache;
    }

    private expandStyles(styles: T, vars: V) {
        let expandedStyles: NamedStyles<T> = ({} as any);
        Object.keys(styles).forEach((styleName: keyof NamedThemableStyles<T, V>) => {
            let style = styles[styleName];
            expandedStyles[styleName] = {};
            Object.keys(style).forEach((propName: string) => {
                // *** UNSAFE ***
                let prop = (style as any)[propName];
                if (typeof prop === "function") {
                    (expandedStyles[styleName] as any)[propName] = prop(vars);
                } else {
                    (expandedStyles[styleName] as any)[propName] = prop;
                }
                // *** UNSAFE ***
            });
        })
        return expandedStyles;
    }

    public get rawStyles(): T {
        return Object.assign({}, this._rawStyles);
    }

    public get rawVars(): V {
        return Object.assign({}, this._rawVars);
    }

    public applyVars(vars: Partial<V>): Stylable<T, V> {
        return Stylable.create(this.rawStyles, Object.assign(this.rawVars, vars));
    };

    public merge<T2 extends NamedThemableStyles<T2, V2>, V2>(other: Stylable<T2, V2>): Stylable<T & T2, V & V2> {
        return Stylable.create(
            Object.assign(this.rawStyles, other.rawStyles),
            Object.assign(this.rawVars, other.rawVars)
        );
    }

    public extend<T2 extends NamedThemableStyles<T2, V2>, V2>(stylesToExtend: T2, vars?: V2): Stylable<T & T2, V & V2> {
        let newVars: typeof vars = vars || ({} as any);
        let newStyle = Object.assign(this.rawStyles, stylesToExtend);
        return Stylable.create(newStyle, Object.assign({}, this._rawVars, newVars));
    }

    public override<V2>(stylesToOverride: Partial<NamedThemableStyles<T, V & V2>>, vars?: V2): Stylable<T, V & V2> {
        let newVars: V2 = vars || ({} as any);
        let newStyle = this.rawStyles;
        Object.keys(stylesToOverride).forEach((styleName: keyof T) => {
            newStyle[styleName] = Object.assign({}, newStyle[styleName], stylesToOverride[styleName]);
        });
        return Stylable.create(newStyle, Object.assign(this.rawVars, newVars));
    }

    public replace<V2>(stylesToReplace: Partial<NamedThemableStyles<T, V & V2>>, vars?: V2): Stylable<T, V & V2> {
        let newVars: V2 = vars || ({} as any);
        let newStyle = Object.assign(this.rawStyles, stylesToReplace);
        return Stylable.create(newStyle, Object.assign(this.rawVars, newVars))
    };
}

type StylesCache = Map<any, Map<any, Stylable<any, any>>>;
const getStylesCache = (cache: StylesCache, var1: any, var2: any): Stylable<any, any> | undefined => {
    let stylesMap = cache.get(var1);
    if (!stylesMap) {
        cache.set(var1, new Map());
        return undefined;
    } else if (stylesMap.has(var2)) {
        return stylesMap.get(var2)
    } else {
        return undefined;
    }
}
const setStylesCache = (cache: StylesCache, var1: any, var2: any, value: Stylable<any, any>) => {
    let stylesMap = cache.get(var1);
    if (!stylesMap) {
        stylesMap = new Map();
        cache.set(var1, stylesMap);
    }
    stylesMap.set(var2, value);
}