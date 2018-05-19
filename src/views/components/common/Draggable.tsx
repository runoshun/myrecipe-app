import * as React from "react";
import { Animated, ViewProperties, PanResponder, PanResponderInstance } from "react-native";

export interface DraggableProperties extends ViewProperties {
    animatedValue?: Animated.ValueXY,
    dragDisabled?: boolean,
    xInterpolation?: Animated.InterpolationConfigType,
    yInterpolation?: Animated.InterpolationConfigType,
}

interface State {
}

export default class Draggable extends React.Component<DraggableProperties, State> {

    private animValue: Animated.ValueXY = new Animated.ValueXY({ x: 0, y: 0 });
    private panResponder: PanResponderInstance;

    private static defaultInterpolation: Animated.InterpolationConfigType = {
        inputRange: [-1, 1],
        outputRange: [-1, 1],
        extrapolate: "identity"
    }

    constructor(props: DraggableProperties) {
        super(props);
        this.initAnimation(undefined, props);
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_evt, gs) => {
                this.animValue.setValue({
                    x: gs.dx,
                    y: gs.dy
                });
                console.log("Draggble", gs.dx, gs.dy)
            },
            onPanResponderEnd: (_evt, gs) => {
                this.animValue.setValue({
                    x: gs.dx,
                    y: gs.dy
                })
            }
        })
    }

    componentWillReceiveProps(nextProps: DraggableProperties) {
        this.initAnimation(this.props, nextProps);
    }

    private initAnimation = (props: DraggableProperties | undefined, next: DraggableProperties) => {
        if (this.animValue !== next.animatedValue && next.animatedValue !== undefined) {
            this.animValue = next.animatedValue;
        } else if (props && props.animatedValue !== undefined && next.animatedValue === undefined){
            this.animValue = new Animated.ValueXY({ x: 0, y: 0 });
        }
    }

    render() {
        let { style: s, animatedValue, xInterpolation, yInterpolation, dragDisabled, ...rest } = this.props;
        let style = {
            transform: [
                { translateX: this.animValue.x.interpolate(xInterpolation || Draggable.defaultInterpolation) },
                { translateY: this.animValue.y.interpolate(yInterpolation || Draggable.defaultInterpolation) },
            ]
        }
        console.log("Draggable", style)
        return (
            <Animated.View style={[style, s]} {...rest} {...this.panResponder.panHandlers} />
        );
    }
}