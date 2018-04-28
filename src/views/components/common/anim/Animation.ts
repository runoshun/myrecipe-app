import { Animated, PanResponder, PanResponderInstance, PanResponderGestureState, NativeScrollEvent } from "react-native";

type InterpolationConfigShorthand = string | number | number[] | string[] | Partial<Animated.InterpolationConfigType>;

export interface AnimationStyleDefinition {
    [key: string]: {
        [style: string]: InterpolationConfigShorthand
                       | { [style: string]: InterpolationConfigShorthand }
                       | { [style: string]: InterpolationConfigShorthand } []
    }
}

export interface PresetAnimation {
    [key: string]: (promise: AnimationPromise) => AnimationPromise
}

export interface DefaultAnimationConfigs {
    timing: Animated.TimingAnimationConfig;
    spring: Animated.SpringAnimationConfig;
    decay: Animated.DecayAnimationConfig;
    interpolate: Animated.InterpolationConfigType;
}

export type PanEvent = { type: "start" | "move" | "end", gs: PanResponderGestureState }
export type PanHandler = (value: Animated.Value, evt: PanEvent) => void;

export type ScrollEvent = { type: "scroll", evt: NativeScrollEvent } | { type: "stop" }
export type ScrollHandler = (value: Animated.Value, evt: ScrollEvent) => void;

export default class Animation<T extends AnimationStyleDefinition> {

    private _defaultConfigs: DefaultAnimationConfigs;

    private _value: Animated.Value;

    private _inputRange: number[];
    private _styleDefs: T | (() => T);
    private _presetAnims: PresetAnimation;
    private _styles?: { [P in keyof T]: any };

    private _panResponder?: PanResponderInstance;
    private _panHandler?: PanHandler;

    private _scrollHandlers?: { onScroll : any };
    private _scrollHandler?: ScrollHandler;

    private _runningCount: number = 0;

    constructor(inputRange: number[], styleDefs: T | (() => T), defaultConfigs?: Partial<DefaultAnimationConfigs>) {
        this._value = new Animated.Value(inputRange[0]);
        this._inputRange = inputRange;
        this._defaultConfigs = Object.assign({
            timing: {
                duration: 300,
                toValue: 0,
            },
            spring: {
                toValue: 0,
            },
            decay: {
                velocity: 1,
            },
            interpolate: {
                inputRange,
                outputRange: inputRange,
                extrapolate: "clamp",
            }
        }, defaultConfigs);
        this._styleDefs = styleDefs;
        this._presetAnims = {};
    }

    public isRunning(): boolean {
        return this._runningCount > 0;
    }

    public setValue(value: number): void {
        this._value.setValue(value);
    }

    public registerAnimations(animations: PresetAnimation): void {
        Object.assign(this._presetAnims, animations);
    }

    public setDefaultConfigs(configs: Partial<DefaultAnimationConfigs>): void {
        Object.assign(this._defaultConfigs, configs);
    }

    public start(name: string): void {
        this._presetAnims[name](this.newPromise()).start();
    }

    public newPromise(): AnimationPromise {
        return new AnimationPromise(this._value, this._defaultConfigs,
            () => { this._runningCount++ },
            () => { this._runningCount-- }
        );
    }

    private _expandStyles() {
        let defs: T;
        if (typeof this._styleDefs === "function") {
            defs = this._styleDefs();
        } else {
            defs = this._styleDefs;
        }

        let styles: any = {};
        Object.keys(defs).forEach((styleName: keyof T) => {
            let styleDef = defs[styleName];
            styles[styleName] = {};
            Object.keys(styleDef).forEach((styleProp: keyof T[keyof T]) => {
                let styleValue = styleDef[styleProp];
                if (styleProp === "transform") {
                    let transforms: any[] = [];
                    if (Array.isArray(styleValue)) {
                        styleValue = styleValue.reduce((merged, obj) => Object.assign(merged, obj), {});
                    }

                    Object.keys(styleValue).forEach(transfromProp => {
                        transforms.push({ [transfromProp]: this._interplateValue((styleValue as any)[transfromProp]) })
                    });
                    styles[styleName][styleProp] = transforms;
                } else {
                    styles[styleName][styleProp] = this._interplateValue(styleValue);
                }
            });
        });
        this._styles = styles;
    }

    private _interplateValue(styleValue: any) {
        if (Array.isArray(styleValue)) {
            return this._value.interpolate({
                inputRange: this._inputRange,
                outputRange: styleValue,
                extrapolate: "clamp",
            });
        } else if (typeof styleValue === "object") {
            return this._value.interpolate(Object.assign({},
                this._defaultConfigs.interpolate,
                styleValue,
            ));
        } else {
            //console.warn("unexpected style definition. it is skipped, style value = '" + styleValue + "'");
            return styleValue;
        }

    }

    public getStyle(name: keyof T): any {
        if (this._styles === undefined) {
            this._expandStyles();
        }
        return this._styles && this._styles[name];
    }

    private _callPanHandler(type: "start" | "move" | "end", gs: PanResponderGestureState) {
        if (this._panHandler) {
            this._panHandler(this._value, { type, gs });
        } else {
            console.warn("pan handler is not registered. please call onPan method of Animation instance.");
        }
    }

    public getPanHandlers() {
        if (this._panResponder === undefined) {
            this._panResponder = PanResponder.create({
                onMoveShouldSetPanResponder: () => true,
                onStartShouldSetPanResponder: () => true,
                onPanResponderGrant: (_, gs) => { this._callPanHandler("start", gs) },
                onPanResponderMove: (_, gs) => { this._callPanHandler("move", gs) },
                onPanResponderRelease: (_, gs) => { this._callPanHandler("end", gs) },
                onPanResponderTerminate: (_, gs) => { this._callPanHandler("end", gs) },
            });
        }
        return this._panResponder.panHandlers;
    }

    private _callScrollHandler(evt: ScrollEvent) {
        if (this._scrollHandler) {
            this._scrollHandler(this._value, evt);
        } else {
            console.warn("scroll handler is not registered, missing calling of onScroll method.");
        }
    }

    public getScrollHandlers(stopTimerTimeout = 200) {
        if (!this._scrollHandlers) {
            this._scrollHandlers = {
                onScroll: (evt: { nativeEvent: NativeScrollEvent }) => {
                    this._callScrollHandler({ type: "scroll", evt: evt.nativeEvent });

                    let timerId;
                    if (timerId !== undefined) {
                        clearTimeout(timerId)
                    }
                    timerId = setTimeout(() => {
                        this._callScrollHandler({ type: "stop" });
                    }, stopTimerTimeout);
                }
            }
        }
        return this._scrollHandlers;
    }

    public onPan(handler: PanHandler, autoStartOnEnd = true): AnimationPromise {
        let promise = this.newPromise();
        this._panHandler = (value, evt) => {
            handler(value, evt);
            if (autoStartOnEnd && evt.type === "end") {
                promise.start();
            }
        };
        return promise;
    }

    public onScroll(handler: ScrollHandler, autoStartOnStop = true): AnimationPromise {
        let promise = this.newPromise();
        this._scrollHandler = (value, evt) => {
            handler(value, evt);
            if (autoStartOnStop && evt.type === "stop") {
                promise.start();
            }
        }
        return promise;
    }
}

export type CompositeAnimationOrFunction = 
    {
        type: "createAnimation"
        create: (v: number) => Animated.CompositeAnimation
    } | 
    ((v: number) => number | void | Promise<number>);

export class AnimationPromise {

    private _animations: CompositeAnimationOrFunction[];
    private _befores: ((v: number) => Promise<void> | void)[];
    private _afters: ((v: number) => Promise<void> | void)[];
    private _defaultConfigs: DefaultAnimationConfigs;
    private _value: Animated.Value;
    private _incrementCount: () => void;
    private _decrementCount: () => void;

    constructor(value: Animated.Value, defaultConfigs: DefaultAnimationConfigs, incr: () => void, decr: () => void) {
        this._value = value;
        this._defaultConfigs = defaultConfigs;
        this._animations = [];
        this._afters = [];
        this._befores = [];
        this._incrementCount = incr,
        this._decrementCount = decr;
    }

    public start(): void {
        this._value.stopAnimation((v) => {
            let promise = Promise.resolve(v);
            this._befores.forEach(before => {
                promise = promise.then(v => { before(v); return v });
            })

            promise.then((v) => { this._incrementCount(); return v });

            this._animations.forEach(anim => {
                if (typeof anim === "function") {
                    promise = promise.then((v) => anim(v) || v);
                } else {
                    promise = promise.then((v) => new Promise<number>(res => {
                        anim.create(v).start(() => this._value.stopAnimation(v => res(v)))
                    }));
                }
            }, v);

            promise.then((v) => { this._decrementCount(); return v });

            this._afters.forEach(after => {
                promise = promise.then((v) => { after(v); return v });
            });
        })
    }

    public then(callback: (v: number) => number | void | Promise<number>): AnimationPromise {
        this._animations.push(callback);
        return this;
    }

    public before(callback: (v: number) => void | Promise<void>): AnimationPromise {
        this._befores.push(callback);
        return this;
    }

    public after(callback: (v: number) => void | Promise<void>): AnimationPromise {
        this._afters.push(callback);
        return this;
    }

    public addAnimation(anim: (v: number) => Animated.CompositeAnimation): AnimationPromise {
        this._animations.push({
            type: "createAnimation",
            create: anim
        });
        return this;
    }

    public timing(createConfig: (v: number) => Partial<Animated.TimingAnimationConfig>): AnimationPromise {
        return this.addAnimation((v) => {
            let fullConfig = Object.assign({}, this._defaultConfigs.timing, createConfig(v));
            return Animated.timing(this._value, fullConfig);
        });
    }

    public spring(createConfig: (v: number) => Partial<Animated.SpringAnimationConfig>): AnimationPromise {
        return this.addAnimation((v) => {
            let fullConfig = Object.assign({}, this._defaultConfigs.spring, createConfig(v));
            return Animated.spring(this._value, fullConfig);
        });
    }

    public decay(createConfig: (v: number) => Partial<Animated.DecayAnimationConfig>): AnimationPromise {
        return this.addAnimation((v) => {
            let fullConfig = Object.assign({}, this._defaultConfigs.decay, createConfig(v));
            return Animated.decay(this._value, fullConfig);
        })
    }

    public snap(points: number[], snapAnimation?: (value: Animated.Value, dest: number) => Animated.CompositeAnimation): AnimationPromise {
        return this.then((current) => {
            if (points.length > 0) {
                let dest = points[0];
                let minDiff = Math.abs(current - dest);
                points.slice(1).forEach((point) => {
                    let diff = Math.abs(current - point);
                    if (minDiff > diff) {
                        dest = point;
                        minDiff = diff;
                    }
                });
                let anim = (snapAnimation && snapAnimation(this._value, dest))
                    || Animated.spring(this._value, { tension: 100, toValue: dest });
                return new Promise<number>(res => {
                    anim.start(() => this._value.stopAnimation(v => res(v)));
                });
            }
            return undefined;
        });
    }

    public setState<P, S, K extends keyof S>(component: React.Component<P, S>, state: Pick<S, K>): AnimationPromise {
        return this.then(() => component.setState(state));
    }

    public setStateBefore<P, S, K extends keyof S>(component: React.Component<P, S>, state: Pick<S, K>): AnimationPromise {
        return this.before(() => component.setState(state));
    }

    public setStateAfter<P, S, K extends keyof S>(component: React.Component<P, S>, state: Pick<S, K>): AnimationPromise {
        return this.after(() => component.setState(state));
    }
}