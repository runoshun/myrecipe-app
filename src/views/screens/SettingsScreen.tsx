import * as React from "react";
import { Switch } from "react-native";

import { 
    createContainer,
    createDispacherProps,
    DispatcherProps,
    ThemedViews as V,
    res,
} from "./Imports";

import { DebugScreen } from "./DebugScreen";

export interface SettingsScreenProperties extends DispatcherProps {
    keepAwakeWhileBrowse: boolean,

}

interface State {
}

export class AddRecipeScreen extends React.Component<SettingsScreenProperties, State> {

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.settingsTitle()} />
                <V.VBox style={styles.values.container}>
                    <V.HBox style={styles.values.itemContainer}>
                        <V.Texts.Label style={styles.values.itemLabel}>{res.strings.settingsKeepAwakeWhileBrowse()}</V.Texts.Label>
                        <Switch
                            style={styles.values.itemControl}
                            value={this.props.keepAwakeWhileBrowse}
                            onValueChange={this.props.app.setKeepAwakeWhileBrowse} />
                    </V.HBox>
                    {
                        __DEV__ &&
                        <V.Touchable onPress={() => this.props.router.navigate(DebugScreen.anchor, {})}>
                            <V.HBox style={styles.values.itemContainer}>
                                <V.Texts.Label style={styles.values.itemLabel}>Debug Menu</V.Texts.Label>
                                <V.Icon name="arrow-forward" style={styles.values.itemArrow} />
                            </V.HBox>
                        </V.Touchable>
                    }
                </V.VBox>
            </V.Screen>
        );
    }
}

export default createContainer(AddRecipeScreen)((state, dispatch) => {
    return {
        keepAwakeWhileBrowse: state.app.settings.keepAwakeWhileBrowse,
        ...createDispacherProps(dispatch),
    }
});

const styles = new V.Stylable({
    container: {
        padding: 8,
    },
    itemContainer: {
        alignItems: "center",
        padding: 8,
        borderBottomColor: res.colors.lightGray,
        borderBottomWidth: 1,
        minHeight: 48,
    },
    itemControl: {
        padding: 4
    },
    itemLabel: {
        flex: 1,
    },
    itemArrow: {
        fontSize: 18,
    },
    itemSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: res.colors.lightGray,
    }
})
