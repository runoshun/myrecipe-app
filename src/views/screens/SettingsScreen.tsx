import * as React from "react";
import { Switch, Linking } from "react-native";

import { 
    createContainer,
    createDispacherProps,
    DispatcherProps,
    ThemedViews as V,
    res,
} from "./Imports";

import { DebugScreen } from "./DebugScreen";
import { AccountType } from "@root/reducers/app";
import { Touchable } from "@root/views/components/common";

export interface SettingsScreenProperties extends DispatcherProps {
    keepAwakeWhileBrowse: boolean,
    saveImageOnDevice: boolean,
    accountType: AccountType,
    accountId?: string,
}

interface State {
}

interface PreferenceItemProps {
    label: string,
    desc?: string,
    rightElement?: JSX.Element,
}

interface SwitchPreferenceProps extends PreferenceItemProps {
    value: boolean,
    onValueChange: (value: boolean) => void,
}

const PreferenceItem: React.StatelessComponent<PreferenceItemProps> = (props) => (
    <V.HBox style={styles.values.itemContainer}>
        <V.VBox style={styles.values.itemLabelContainer}>
            <V.Texts.Label style={styles.values.itemLabel}>{props.label}</V.Texts.Label>
            {props.desc && <V.Texts.Body style={styles.values.itemDesc}>{props.desc}</V.Texts.Body>}
        </V.VBox>
        { props.rightElement }
    </V.HBox>
);

const SwitchPreference: React.StatelessComponent<SwitchPreferenceProps> = (props) => (
    <PreferenceItem
        label={props.label}
        desc={props.desc}
        rightElement={
            <Switch
                style={styles.values.itemControl}
                value={props.value}
                onValueChange={props.onValueChange} />
        } />
)

export class AddRecipeScreen extends React.Component<SettingsScreenProperties, State> {

    render() {
        return (
            <V.Screen>
                <V.AppScreenHeader title={res.strings.settingsTitle()} />
                <V.VBox style={styles.values.container}>
                    <V.Texts.H3 style={styles.values.sectionLabel}>{res.strings.settingsSectionInfo()}</V.Texts.H3>
                    <PreferenceItem
                        label={res.strings.settingsLabelAppVersion()}
                        rightElement={<V.Texts.Body>{require("@root/../../package.json").version}</V.Texts.Body>} />
                    { this.props.accountId &&
                        <PreferenceItem
                            label={res.strings.settingsLabelUserId()}
                            rightElement={<V.Texts.Body selectable={true}>{this.props.accountId}</V.Texts.Body>} />
                    }
                    { false &&
                        <PreferenceItem
                            label={res.strings.settingsLabelAccountType()}
                            rightElement={<V.Texts.Body>{this.props.accountType}</V.Texts.Body>} />
                    }
                    <Touchable onPress={this.openSupport}>
                        <PreferenceItem
                            label={res.strings.settingsLabelHelp()}
                            rightElement={<V.Icon name="arrow-forward" style={styles.values.itemArrow} />}
                        />
                    </Touchable>
                    
                    <V.Texts.H3 style={styles.values.sectionLabel}>{res.strings.settingsSectionSettings()}</V.Texts.H3>
                    <SwitchPreference
                        label={res.strings.settingsLabelKeepAwakeWhileBrowse()}
                        desc={res.strings.settingsDescKeepAwakeWhileBrowse()}
                        value={this.props.keepAwakeWhileBrowse}
                        onValueChange={this.props.app.setKeepAwakeWhileBrowse}
                    />
                    <SwitchPreference
                        label={res.strings.settingsLabelSaveImageOnDevice()}
                        desc={res.strings.settingsDescSaveImageOnDevice()}
                        value={this.props.saveImageOnDevice}
                        onValueChange={this.props.app.setSaveImageOnDevice}
                    />
                    {
                        (__DEV__ || !!require("react-native").NativeModules.DevSettings) &&
                        <V.Touchable onPress={() => this.props.router.navigate(DebugScreen.anchor, {})}>
                            <V.HBox style={styles.values.itemContainer}>
                                <V.Texts.Label style={styles.values.itemLabelContainer}>Debug Menu</V.Texts.Label>
                                <V.Icon name="arrow-forward" style={styles.values.itemArrow} />
                            </V.HBox>
                        </V.Touchable>
                    }
                </V.VBox>
            </V.Screen>
        );
    }

    openSupport = () => {
        Linking.openURL("https://myrecipe.runoshun.net/")
    }
}

export default createContainer(AddRecipeScreen)((state, dispatch) => {
    return {
        keepAwakeWhileBrowse: state.app.settings.keepAwakeWhileBrowse,
        saveImageOnDevice: state.app.settings.saveImageOnDevice,
        accountType: state.app.settings.accountType,
        accountId: state.app.settings.accountId,
        ...createDispacherProps(dispatch),
    }
});

const styles = new V.Stylable({
    container: {
        marginHorizontal: 8,
        paddingHorizontal: 8,
    },
    sectionLabel: {
        paddingTop: 12,
        paddingBottom: 8,
        color: res.colors.accent,
    },
    itemContainer: {
        alignItems: "center",
        paddingVertical: 8,
        borderTopColor: res.colors.accentVeryThin,
        borderTopWidth: 1,
        minHeight: 68,
    },
    itemControl: {
        paddingVertical: 8
    },
    itemLabelContainer: {
        flex: 1,
        marginRight: 12,
    },
    itemLabel: {
    },
    itemDesc: {
        marginTop: 4,
        color: res.colors.gray,
    },
    itemArrow: {
        fontSize: 18,
    }
})
