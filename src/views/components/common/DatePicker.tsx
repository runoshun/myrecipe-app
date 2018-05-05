import * as React from "react";
import { Platform, DatePickerAndroid, DatePickerIOS, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Popup from "./Popup";
import PopupRegistry, { RegisteredPopup } from "./PopupRegistry";

export type DatePickerResult =
    | { type: "dissmissed" }
    | { type: "selected", year: number, month: number, day: number } 
    ;
export type DatePickerOptions = {
    date: Date ,
    minDate?: Date,
    maxDate?: Date,
    buttonBarIOS?: (handlers: { onOk: () => void, onCancel: () => void }) => JSX.Element,
    localeIOS?: string,
}

export type DatePickerOpen = (options: DatePickerOptions) => Promise<DatePickerResult>;

let openImpl: DatePickerOpen; 
if (Platform.OS === "ios") {

    const styles = StyleSheet.create({
        buttonbar: {
            flexDirection: "row",
            alignItems: "center",
        },
        button: {
        },
        buttonText: {
            paddingHorizontal: 20,
            paddingTop: 12,
            fontSize: 18
        },
        spacer: {
            flex: 1
        }
    })

    const DefaultButtonBar = (props: { onOk: () => void, onCancel: () => void }) =>
        <View style={styles.buttonbar}>
            <TouchableOpacity onPress={props.onCancel} style={styles.button}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
            <View style={styles.spacer} />
            <TouchableOpacity onPress={props.onOk} style={styles.button}><Text style={styles.buttonText}>OK</Text></TouchableOpacity>
        </View>

    class DatePickerCompIOS extends React.Component<DatePickerOptions, { date: Date }> {
        constructor(props: any) {
            super(props);
            this.state = { date: this.props.date }
        }

        getSelectedResult = (): DatePickerResult => {
            return {
                type: "selected",
                year: this.state.date.getFullYear(),
                month: this.state.date.getMonth(),
                day: this.state.date.getDate(),
            }
        }

        render() {
            let props = this.props;
            let buttonBarProps = {
                onCancel: () => popupId.hide(),
                onOk: () => popupId.hide(this.getSelectedResult()),
            };
            return (
                <View>
                    {
                        props.buttonBarIOS ? props.buttonBarIOS(buttonBarProps) : <DefaultButtonBar {...buttonBarProps} />
                    }
                    <DatePickerIOS
                        date={this.state.date}
                        mode={"date"}
                        locale={props.localeIOS}
                        onDateChange={(date) => this.setState({ date })}
                        minimumDate={props.minDate}
                        maximumDate={props.maxDate} />
                </View>
            );
        }
    }

    let popupStyles = Popup.defaultStyles.applyVars({
        contentPosition: "bottom",
        contentBackgroundColor: "#ffffff",
        showBackdrop: true,
        animation: "hight",
    })

    let resolve: (res: DatePickerResult) => void;

    let popupId: RegisteredPopup<DatePickerOptions, DatePickerResult> = PopupRegistry.register((props) => {
        let { popupProps, date, ...rest } = props;
        return (
            <Popup {...popupProps} styles={popupStyles}>
                <DatePickerCompIOS date={date || new Date(Date.now())} {...rest} />
            </Popup>
        )
    },
    (res) => res ? resolve(res) : resolve({ type: "dissmissed" }));

    openImpl = async (options) => {
        let promise = new Promise<DatePickerResult>((res, _rej) => {
            resolve = res;
        });
        popupId.show(options);
        return promise;
    }

} else if (Platform.OS === "android") {
    openImpl = async (options) => {
        let result = await DatePickerAndroid.open({
            date: options.date,
            minDate: options.minDate,
            maxDate: options.maxDate
        });

        if (result.action === DatePickerAndroid.dismissedAction) {
            return { type: "dissmissed" };
        } else {
            return {
                type: "selected",
                year: result.year as number,
                month: result.month as number,
                day: result.day as number
            }
        }
    }
} else {
    throw new Error("DatePicker only support ios or android");
}

export const open = openImpl;
export default {
    open
}