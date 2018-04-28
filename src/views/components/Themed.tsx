import * as React from "react";
export * from "./common";

import res from "@root/resources";
import PopupRegistry, { RegisteredPopup } from "./common/PopupRegistry";
import { PopupMenuProperties } from "./common/PopupMenu";
import { PopupMenu, Dialog, HBox, Popup, Stylable, Typography, Button, bindDefaultProps, ScreenHeader, ScreenHeaderButton, TextField } from "./common";

import * as colors from "@root/resources/colors";

export const Texts = Typography.createText({
    H1: {
        color: colors.accent,
        fontSize: 28,
        fontWeight: "bold",
    },
    H2: {
        color: colors.text,
        fontSize: 24,
        fontWeight: "bold",
    },
    H3: {
        color: colors.text,
        fontSize: 20,
        fontWeight: "bold",
    },
    Body: {
        color: colors.text,
        fontSize: 16
    },
    AccentBody: {
        color: colors.accent,
        fontSize: 16,
    },
    InputLabel: {
        color: colors.text,
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 4,
    }
});

export const FormField = bindDefaultProps(TextField, ({
    styles: TextField.defaultStyles.applyVars({
        errorColor: res.colors.accentError,
    }).override({
        TUI_VInput_Input: {
            color: colors.text,
            fontSize: 18,
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: res.colors.accentVeryThin,
            backgroundColor: res.colors.accentVeryThin
        }
    }),
    placeholderTextColor: res.colors.accentThin,
}));

export const NormalButton = bindDefaultProps(Button, {
    styles: Button.defaultStyles.applyVars({
        colorBackground: colors.lightGray,
        colorForeground: colors.darkGray,
    })
});

export const TransparentButton = bindDefaultProps(Button, {
    styles: Button.defaultStyles.applyVars({
        colorBackground: "transparent",
        colorForeground: colors.text,
    })
});

export const AccentButton = bindDefaultProps(Button, {
    styles: Button.defaultStyles.applyVars({
        colorBackground: colors.accent,
        colorForeground: colors.white,
    })
});

export const TransparentAccentButton = bindDefaultProps(Button, {
    styles: Button.defaultStyles.applyVars({
        colorBackground: "transparent",
        colorForeground: colors.accent,
    })
});

export const TransparentOnAccentButton = bindDefaultProps(Button, {
    styles: Button.defaultStyles.applyVars({
        colorBackground: "transparent",
        colorForeground: colors.white,
    })
})

export const AppScreenHeader = bindDefaultProps(ScreenHeader, {
    styles: ScreenHeader.defaultStyles.applyVars({
    })
})

export const AppScreenHeaderButton = bindDefaultProps(ScreenHeaderButton, {
    tintColor: colors.accent,
})

export const MenuItem = bindDefaultProps(Button, {
    styles: PopupMenu.defaultItemStyles.applyVars({
        colorBackground: "transparent",
        labelSize: 20,
        iconSize: 24,
        marginUnit: 8,
        colorForeground: colors.accent,
    })
})

export const PopupMenuTop = bindDefaultProps(PopupMenu, {
    styles: PopupMenu.defaultStyles.applyVars({
        contentPosition: "top",
    }).override({
        TUI_PopupContent: {
            paddingTop: 20,
        }
    }),
    itemComponent: MenuItem
});

export const PopupMenuBottom = bindDefaultProps(PopupMenu, {
    itemComponent: MenuItem
});

export type AppMenuResult = () => void;
interface AppMenuProps {
    items: PopupMenuProperties["items"]
};
export const AppMenu: RegisteredPopup<AppMenuProps, AppMenuResult> = PopupRegistry.register((props) => (
    <PopupMenuTop items={props.items || []} {...props.popupProps} />
), 
    (result) => result && result());

export const AppActionSheet: RegisteredPopup<AppMenuProps, AppMenuResult> = PopupRegistry.register((props) => (
    <PopupMenuBottom items={props.items || []} {...props.popupProps} />
), 
    (result) => result && result());

export const BottomSnack = bindDefaultProps(Popup, {
    styles: Popup.defaultStyles.applyVars({
        contentPosition: "bottom",
        animation: "hight",
        showBackdrop: false,
    }).override({
        TUI_PopupContent: {
            backgroundColor: colors.accent,
        }
    }),
    autoCloseTimeout: 5000
});

export type UndoSnackBarResult = () => void;
interface UndoSnackbarProps {
    message: string,
    onOk?: () => void,
    onUndo?: () => void
};

export const UndoSnackbar: RegisteredPopup<UndoSnackbarProps, AppMenuResult> = PopupRegistry.register((props) =>
    <BottomSnack {...props.popupProps}>
        <HBox alignItems="center" style={styles.values.undoSnackContainer}>
            <Texts.Body style={styles.values.undoSnackMessage}>{props.message}</Texts.Body>
            <TransparentOnAccentButton
                onPress={() => UndoSnackbar.hide(props.onUndo)}
                style={styles.values.actionButton}
                label={res.strings.commonUndo()} />
            <TransparentOnAccentButton
                onPress={() => UndoSnackbar.hide(props.onOk)}
                style={styles.values.actionButton}
                label={res.strings.commonOk()} />
        </HBox>
    </BottomSnack>,
    (result) => result && result()
);

export type ConfimationDialogResult = () => void;
interface ConfimationDialogProps {
    title?: string,
    message: string,
    onOk?: () => void,
    onCancel?: () => void,
}
export const ConfimationDialog: RegisteredPopup<ConfimationDialogProps, ConfimationDialogResult> = PopupRegistry.register((props) =>
    <Dialog
        title={props.title || res.strings.commonConfirmationTitle()}
        message={props.message || ""}
        {...props.popupProps}>
        <HBox>
            <TransparentAccentButton
                onPress={() => ConfimationDialog.hide(props.onCancel)}
                label={res.strings.commonCancel()}
                style={{ flex: 1 }} />
            <TransparentAccentButton
                onPress={() => ConfimationDialog.hide(props.onOk)}
                label={res.strings.commonOk()}
                style={{ flex: 1 }} />
        </HBox>
    </Dialog>,
    (result) => result && result()
);

export const styles = new Stylable({
    bottomBar: {
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    actionButton: {
        margin: 8,
    },
    undoSnackContainer: {
        height: 48,
        paddingHorizontal: 8,
    },
    undoSnackMessage: {
        flex: 1,
        padding: 8,
        color: "#fff"
    }
});