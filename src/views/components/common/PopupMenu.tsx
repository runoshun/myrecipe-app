import * as React from "react";
import Button, { ButtonProperties } from "./Button";
import Popup, { PopupProperties } from "./Popup";

const menuStyles = Popup.defaultStyles.applyVars({
    contentPosition: "bottom",
    animation: "hight",
    contentBackgroundColor: "#ffffff"
});

const menuButtonStyles = Button.defaultStyles.applyVars({
    colorBackground: "transparent",
    labelSize: 20,
    iconSize: 24,
    marginUnit: 8,
})

export interface MenuItem {
    label?: string,
    icon?: string,
    styles?: typeof menuButtonStyles,
    onPress?: ButtonProperties["onPress"]
    hide?: boolean,
}

export interface PopupMenuProperties extends PopupProperties {
    itemComponent?: React.ComponentType<MenuItem>,
    items: MenuItem[],
}

interface State {
}

export default class PopupMenu extends React.Component<PopupMenuProperties, State> {

    public static defaultStyles = menuStyles;
    public static defaultItemStyles = menuButtonStyles;

    render() {
        let { items, itemComponent, styles: _styles, ...popupProps } = this.props;
        let styles = _styles || menuStyles;
        return (
            <Popup styles={styles} {...popupProps}>
                {this.renderItems()}
            </Popup>
        );
    }

    private renderItems() {
        const ItemComp = this.props.itemComponent || Button;
        const items = this.props.items.filter(i => !i.hide);
        return items.map(item => {
            let { styles: _styles, ...props } = item;
            if (ItemComp !== undefined && _styles === undefined) {
                return <ItemComp key={item.label || item.icon} {...props} />
            } else {
                let styles = _styles || menuButtonStyles;
                return <ItemComp key={item.label || item.icon} styles={styles} {...props} />
            }
        })
    }
}