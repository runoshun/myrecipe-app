import * as React from "react";
import { ViewProperties, ImageProperties, TextProperties } from "react-native";

export type ReactComponentClass<P> =
    | React.ComponentClass<P>
    | React.StatelessComponent<P>
    | React.ClassicComponentClass<P>;

export function bindDefaultProps<P>(
    Component: ReactComponentClass<P>,
    defaultProps: Partial<P>
): React.StatelessComponent<P> {
    return (props) => {
        let mergedProps = Object.assign({}, defaultProps, props);
        return <Component {...mergedProps} />;
    }
}

export interface StylableComponentProperties {
    style?: ViewProperties["style"] | TextProperties["style"] | ImageProperties["style"]
}

export function bindDefaultStyle<P extends StylableComponentProperties>(
    Component: React.ComponentType<P>,
    defaultStyle: P["style"]
): React.ComponentClass<P> {
    return class extends React.Component<P, {}> {
        render() {
            let props = this.props;
            let mergedStyles = props.style ? [defaultStyle, props.style] : defaultStyle;
            return <Component {...props} style={mergedStyles} />
        }
    }
}