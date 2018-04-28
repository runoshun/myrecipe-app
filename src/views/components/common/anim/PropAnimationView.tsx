import * as React from "react";
import { ViewProperties, Animated } from "react-native";
import Animation, { AnimationPromise } from "./Animation";

export interface PropAnimationComponentProperties<TAnim> extends ViewProperties {
    animationType: TAnim,
}

interface State {
    propsImpl: ViewProperties | undefined,
}

export interface AnimationState {
    animate: (p: AnimationPromise) => AnimationPromise,
    expressNextProps?: "after" | "before",
}

export default abstract class PropAnimationComponent<Props extends PropAnimationComponentProperties<TAnim>, TAnim> extends React.Component<Props, State> {

    private prevType: TAnim | undefined = undefined;
    private animation: Animation<{view: {}}> | undefined = undefined;

    constructor(props: Props) {
        super(props);
        this.state = {
            propsImpl: undefined,
        }
    }

    abstract animate(currentProps: Props, nextProps: Props): AnimationState | undefined;
    abstract getAnimation(type: TAnim): Animation<{view: {}}>

    private getAnimationMemoized(): Animation<{view: {}}> {
        let type = this.props.animationType;
        // FIXME: improve equality check
        if ((JSON.stringify(this.prevType) !== JSON.stringify(type)) && type) {
            this.animation = this.getAnimation(type);
            this.prevType = type;
        } 
        return this.animation as Animation<{view: {}}>;
    }

    componentWillUpdate(nextProps: Props) {
        let state = this.animate(this.props, nextProps);
        if (state) {
            let animation = this.getAnimationMemoized();
            let p = state.animate(animation.newPromise());

            if (state.expressNextProps === "after") {
                p.setStateAfter(this, { propsImpl: nextProps })
            } else if (state.expressNextProps === "before") {
                p.setStateBefore(this, { propsImpl: nextProps })
            }

            p.start();
        }
        else if (this.props.children !== (nextProps as any).children) {
            this.setState({ propsImpl: nextProps })
        }
    }

    appendAnimationStyles(style: any[]) {
        if (this.props.animationType) {
            let anim = this.getAnimationMemoized();
            style.push(anim.getStyle("view"))
        }
        return style;
    }

    protected renderView(props: PropAnimationComponentProperties<TAnim>) {
        let { animationType, style: _style, ...viewProps_ } = props;
        let viewProps = this.state.propsImpl || viewProps_;
        let style = this.appendAnimationStyles([_style]);
        return (
            <Animated.View {...viewProps} style={style} /> 
        );
    }
}

export type ExpandableAnimationType = 
    | { type: "width", max?: number }
    | { type: "height", max?: number }
    ;

export interface ExpandableProperties extends PropAnimationComponentProperties<ExpandableAnimationType> {
    expanded: boolean,
}

export class Expandable extends PropAnimationComponent<ExpandableProperties, ExpandableAnimationType> {

    animate(currentProps: ExpandableProperties, nextProps: ExpandableProperties): AnimationState | undefined {
        if (!currentProps.expanded && nextProps.expanded) {
            return {
                animate: (p) => p.timing(() => ({ toValue: 1 })),
                expressNextProps: "after",
            }
        } else if (currentProps.expanded && !nextProps.expanded) {
            return {
                animate: (p) => p.timing(() => ({ toValue: 0 })),
                expressNextProps: "before"
            }
        } else {
            return undefined;
        }
    }

    getAnimation(type: ExpandableAnimationType): Animation<{ view: {}; }> {
        switch(type.type) {
            case "width":
                return new Animation([0, 1], {
                    view: {
                        maxWidth: [0, type.max || 300],
                        opacity: [0, 1],
                    }
                })
            case "height":
                return new Animation([0, 1], {
                    view: { 
                        maxHeight: [0, type.max || 600],
                        opacity: [0, 1],
                    }
                })
        }
    }

    render() {
        let { expanded, ...props } = this.props;
        return this.renderView(props);
    }
}