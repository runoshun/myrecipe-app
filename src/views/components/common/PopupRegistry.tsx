import * as React from "react";
import { View, StyleSheet } from "react-native";
import { PopupProperties } from "@root/views/components/common/Popup";

export interface PopupRegistryProperties {
}

interface State {
    [key: string]: PopupComponentState<any, any> | undefined
}

export type RegisteredPopupID<T = {}, U = {}> = string & { __popupIdBlandShow: T, __popupIdBlandHide: U };
export type RegisteredPopup<T = {}, U = {}> = {
    id: RegisteredPopupID<T, U>,
    show: (arg: T) => void,
    hide: (arg?: U) => void,
    bindHide: (arg?: U) => () => void,
    isVisible: () => boolean,
}

interface PopupDict {
    [key: string]: {
        Component: React.ComponentType<any>,
        onDissmiss?: (arg: any) => void,
    }
}

export interface PopupComponentState<Props, Result> {
    visible: boolean,
    onDissmissArg: Result,
    extendProps: Props,
}

export type RegisteredPopupProperties = {
    popupProps: Pick<PopupProperties, "visible" | "onRequestClose" | "onDissmiss">;
}

export default class PopupRegistry extends React.Component<PopupRegistryProperties, State> {

    private static instance: PopupRegistry;
    private static popups: PopupDict = {};

    private static registerId<Props, Result>(
        comp: React.ComponentType<RegisteredPopupProperties & Partial<Props>>,
        onDissmiss?: (arg?: Result) => void
    ): RegisteredPopupID<Props, Result> {
        const id = require("uuid/v4")();
        if (PopupRegistry.popups === undefined) {
            PopupRegistry.popups = {}
        }
        PopupRegistry.popups[id] = {
            Component: comp,
            onDissmiss: onDissmiss
        };
        return id as RegisteredPopupID<Props, Result>;
    }

    public static register<Props, Result>(
        comp: React.ComponentType<RegisteredPopupProperties & Partial<Props>>,
        onDissmiss?: (arg?: Result) => void
    ): RegisteredPopup<Props, Result> {
        let id = PopupRegistry.registerId(comp, onDissmiss);
        return {
            id: id,
            show: (arg: Props) => PopupRegistry.show(id, arg),
            hide: (arg?: Result) => PopupRegistry.hide(id, arg),
            bindHide: (arg?: Result) => () => PopupRegistry.hide(id, arg),
            isVisible: () => PopupRegistry.isVisible(id)
        }
    }

    public static show<Props, Result>(id: RegisteredPopupID<Props, Result>, arg: Props) {
        PopupRegistry.instance.setState({
            [id]: { visible: true, onDissmissArg: undefined, extendProps: arg }
        })
    }

    public static hide<Props, Result>(id: RegisteredPopupID<Props, Result>, arg?: Result) {
        PopupRegistry.instance.setState({
            [id]: { visible: false, onDissmissArg: arg, extendProps: undefined }
        })
    }

    public static isVisible<Props, Result>(id: RegisteredPopupID<Props, Result>): boolean {
        let state = PopupRegistry.instance.state[id];
        return !!(state && state.visible);
    }

    constructor(props: any) {
        super(props);
        if (PopupRegistry.instance) {
            this.state = Object.assign({}, PopupRegistry.instance.state);
        } else {
            this.state = {};
        }
        PopupRegistry.instance = this;
    }

    render() {
        return (
            <View style={styles.container} pointerEvents="box-none">
                {this.props.children}
                {Object.keys(PopupRegistry.popups).map(key => {
                    let popup = PopupRegistry.popups[key];
                    let state = this.state[key];
                    let visible = state === undefined ? false : state.visible;
                    let extendProps = state === undefined ? {} : state.extendProps;
                    let props: RegisteredPopupProperties & { key: any } = {
                        popupProps: {
                            visible: visible,
                            onRequestClose: () => PopupRegistry.hide(key as any, undefined),
                            onDissmiss: () => popup.onDissmiss && popup.onDissmiss(state && state.onDissmissArg),
                        },
                        key: key,
                        ...extendProps,
                    }
                    return React.createElement(popup.Component, props);
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
})