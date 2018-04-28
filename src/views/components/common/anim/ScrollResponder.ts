import { NativeScrollEvent, } from "react-native";

export type ScrollDirection = "left" | "right" | "down" | "up" | "stop";
export type ScrollEventListener = (evt?: {nativeEvent: NativeScrollEvent}) => void;

export interface ScrollEventHandlers {
    onScrollDirectionChange?: (direction: ScrollDirection, speed: number) => void,
    onScroll?: ScrollEventListener,
}

export default class ScrollResponder {

    public onScroll: ScrollEventListener;
    public onMomentumScrollEnd: ScrollEventListener;

    private _handlers: ScrollEventHandlers

    private _scrollStopWatchdog?: number;
    private _currentScrollDirection?: ScrollDirection;
    private _prevEvent?: {
        contentOffset: {
            x: number,
            y: number,
        },
        occurred: number;
    }

    constructor(handlers: ScrollEventHandlers) {
        this._handlers = handlers;
        this.onScroll = this._onScroll.bind(this);
        this.onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this);
    }

    public get scrollHandlers() {
        return {
            onScroll: this.onScroll,
            onMomentumScrollEnd: this.onMomentumScrollEnd
        }
    }

    private _onScroll: ScrollEventListener = (evt) => {
        if (this._handlers.onScroll) {
            this._handlers.onScroll(evt);
        }

        if (evt) {
            const now = Date.now();
            if (this._prevEvent && this._handlers.onScrollDirectionChange) {
                const prev = this._prevEvent.contentOffset;
                const curr = evt.nativeEvent.contentOffset;
                const delta = now - this._prevEvent.occurred;

                const diffX = Math.max(0, curr.x) - Math.max(0, prev.x);
                const diffY = Math.max(0, curr.y) - Math.max(0, prev.y);
                if (diffX > 0 && this._currentScrollDirection !== "right") {
                    this._currentScrollDirection = "right";
                    this._handlers.onScrollDirectionChange("right", diffX / delta);
                }
                if (diffX < 0 && this._currentScrollDirection !== "left") {
                    this._currentScrollDirection = "left";
                    this._handlers.onScrollDirectionChange("left", -diffX / delta);
                }
                if (diffY > 0 && this._currentScrollDirection !== "down") {
                    this._currentScrollDirection = "down";
                    this._handlers.onScrollDirectionChange("down", diffY / delta);
                }
                if (diffY < 0 && this._currentScrollDirection !== "up") {
                    this._currentScrollDirection = "up";
                    this._handlers.onScrollDirectionChange("up", -diffY / delta);
                }

                if (this._scrollStopWatchdog) {
                    clearTimeout(this._scrollStopWatchdog);
                }
                this._scrollStopWatchdog = setTimeout(() => {
                    this._onMomentumScrollEnd(evt);
                }, 300);
            }

            this._prevEvent = {
                occurred: now,
                contentOffset: {
                    x: evt.nativeEvent.contentOffset.x,
                    y: evt.nativeEvent.contentOffset.y,
                }
            }
        }
    }

    private _onMomentumScrollEnd: ScrollEventListener = (_evt) => {
        if (this._handlers.onScrollDirectionChange) {
            if (this._scrollStopWatchdog) {
                clearTimeout(this._scrollStopWatchdog);
            }
            this._handlers.onScrollDirectionChange("stop", 0);
        }

        this._currentScrollDirection = undefined;
        this._prevEvent = undefined
    }
}