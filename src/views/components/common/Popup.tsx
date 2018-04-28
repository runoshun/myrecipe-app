import * as React from "react";
import { Animated, TouchableWithoutFeedback } from "react-native";

import Stylable from "./stylable";
import Animation from "./anim/Animation";

export interface PopupProperties {
    visible?: boolean,
    onRequestClose?: () => void,
    onDissmiss?: () => void,
    preventCloseOnPressBackdrop?: boolean,
    autoCloseTimeout?: number,
    children?: React.ReactNode,
    styles?: typeof defaultStyles,
}

interface State {
    propsImpl?: PopupProperties;
}

type ContentPosition = ("center" | "top" | "bottom" | "topRight");

const defaultVars = {
    contentPosition: "center" as ContentPosition,
    contentBackgroundColor: "transparent",
    showBackdrop: true,
    animation: "fade" as ("hight" | "fade" | Animation<{content: {}, backdrop: {}}>),
}

type Vars = typeof defaultVars;

const getLeft = (pos: ContentPosition) => {
    switch(pos) {
        case "bottom": return 0;
        case "center": return undefined;
        case "top": return 0;
        case "topRight": return undefined;
    }
}

const getRight = (pos: ContentPosition) => {
    switch(pos) {
        case "bottom": return 0;
        case "center": return undefined;
        case "top": return 0;
        case "topRight": return 0;
    }
}

const getTop = (pos: ContentPosition) => {
    switch(pos) {
        case "bottom": return undefined;
        case "center": return undefined;
        case "top": return 0;
        case "topRight": return 0;
    }
}

const getBottom = (pos: ContentPosition) => {
    switch(pos) {
        case "bottom": return 0;
        case "center": return undefined;
        case "top": return undefined;
        case "topRight": return undefined;
    }
}

const defaultStyles = new Stylable({
    TUI_PopupBackdrop: {
        flex: 1,
        overflow: "visible",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 5000,
    },
    TUI_PopupContent: {
        backgroundColor: (vars: Vars) => vars.contentBackgroundColor,
        overflow: "hidden",
        position: (vars: Vars) => vars.contentPosition !== "center" ? "absolute" : undefined,
        left: (vars: Vars) => getLeft(vars.contentPosition),
        right: (vars: Vars) => getRight(vars.contentPosition),
        top: (vars: Vars) => getTop(vars.contentPosition),
        bottom: (vars: Vars) => getBottom(vars.contentPosition),
    },
}, defaultVars);

type PopupAnimation = Animation<{content: {}, backdrop: {}}>

const defaultHeightAnim: PopupAnimation = new Animation([0, 1], () => ({
    content: {
        maxHeight: [0, 500],
        opacity: {
            inputRange: [0, 0.3, 1],
            outputRange: [0, 1, 1]
        }
    },
    backdrop: {
        backgroundColor: ["#00000000", "#00000060"],
    }
}));

const defaultFadeAnim: PopupAnimation = new Animation([0, 1], () => ({
    content: {
        opacity: [0, 1]
    },
    backdrop: {
        backgroundColor: ["#00000000", "#00000060"],
    }
}));

const defaultNoneAnim: PopupAnimation = new Animation([0, 1], () => ({
    content: {
        opacity: [0, 1]
    },
    backdrop: {
        backgroundColor: ["#00000000", "#00000060"],
    }
}), {
    timing: {
        duration: 0,
        toValue: 1,
    }
});

export interface PopupState<T> {
    visible: boolean,
    onDissmissArg?: T,
}

export interface PopupHandlers<T> {
    show: () => void,
    hide: () => void,
    bindHide: (item: T) => () => void,
    handlers: {
        onRequestClose: () => void,
        onDissmiss: () => void,
    }
}

export default class Popup extends React.Component<PopupProperties, State> {

    public state: State = { }

    public static readonly defaultStyles = defaultStyles;

    private autoCloseTimer: number | undefined;

    private get animation() {
        let styles = this.props.styles || defaultStyles;
        let animation = styles.rawVars.animation;
        if (animation === "fade") {
            return defaultFadeAnim;
        } else if (animation === "hight") {
            return defaultHeightAnim;
        } else {
            return animation || defaultNoneAnim;
        }
    }

    componentWillMount() {
        this.setState({ propsImpl: this.props })
    }

    componentWillUpdate(nextProps: PopupProperties) {
        if (this.props.visible && !nextProps.visible) {
            this.animation.newPromise()
                .timing(() => ({ toValue: 0 }))
                .setStateAfter(this, { propsImpl: nextProps })
                .after(() => this.fireOnDissmiss())
                .start()
        } else if (!this.props.visible && nextProps.visible) {
            this.animation.newPromise()
                .setStateBefore(this, { propsImpl: nextProps })
                .timing(() => ({ toValue: 1 }))
                .start();
        }
    }

    private fireOnDissmiss() {
        const props = this.state.propsImpl || this.props;
        props.onDissmiss && props.onDissmiss();
    }

    render() {
        const props = this.state.propsImpl || this.props;
        if (props.visible) {
            let styles = props.styles || defaultStyles;
            let showBackdrop = styles.rawVars.showBackdrop;

            let backdropStyle = [styles.values.TUI_PopupBackdrop]
            if (styles.rawVars.showBackdrop) {
                backdropStyle.push(this.animation.getStyle("backdrop"));
            }

            let contentStyle = [styles.values.TUI_PopupContent, this.animation.getStyle("content")];

            if (this.autoCloseTimer === undefined && props.autoCloseTimeout && props.autoCloseTimeout > 0) {
                this.autoCloseTimer = setTimeout(() => props.onRequestClose && props.onRequestClose(), props.autoCloseTimeout);
            }

            let onPressBackdrop = (!props.preventCloseOnPressBackdrop && showBackdrop) ? props.onRequestClose : undefined;

            return (
                <TouchableWithoutFeedback onPress={onPressBackdrop}>
                    <Animated.View style={backdropStyle} pointerEvents={showBackdrop ? "auto" : "box-none"}>
                        <TouchableWithoutFeedback>
                            <Animated.View style={contentStyle}>
                                {props.children}
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </Animated.View>
                </TouchableWithoutFeedback>
            );
        } else {
            this.clearAutoCloseTimer()
            return null;
        }
    }

    componentWillUnmount() {
            this.clearAutoCloseTimer();
    }

    private clearAutoCloseTimer = () => {
        if (this.autoCloseTimer !== undefined) {
            clearTimeout(this.autoCloseTimer);
            this.autoCloseTimer = undefined;
        }
    }
}