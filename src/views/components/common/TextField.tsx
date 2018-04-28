import * as React from "react";
import { TextInput, TextInputProperties, View, Text } from "react-native";

import Stylable from "./stylable";

export interface TextFieldProperties extends TextInputProperties {
    name: string,
    nextField?: string,
    label?: string,
    error?: string,
    focus?: boolean,
    styles?: typeof defaultStyles;
    onUpdate?: (data: { [key: string]: string }) => void,
    onFocusNext?: (next?: string) => void,
    submitOnBlur?: boolean,
    mask?: (text: string, prev?: string) => string,
}

interface State {
    text: string
    cursor: number;
}

const defaultVars = {
    labelColor: "#000000",
    labelSize: 12,
    inputColor: "#000000",
    inputSize: 16,
    errorColor: "#ff0000",
    errorSize: 14,
}

type Vars = typeof defaultVars;

const defaultStyles = new Stylable({
    TUI_VInput_Label: {
        color: (vars: Vars) => vars.labelColor,
        fontSize: (vars: Vars) => vars.labelSize,
        fontWeight: "bold",
        marginTop: 4,
    },
    TUI_VInput_Input: {
        color: (vars: Vars) => vars.inputColor,
        fontSize: (vars: Vars) => vars.inputSize,
        marginVertical: 4,
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    TUI_VInput_InputError: {
        borderWidth: 1,
        borderColor: (vars: Vars) => vars.errorColor,
    },
    TUI_VInput_Error: {
        fontSize:  (vars: Vars) => vars.errorSize,
        color:  (vars: Vars) => vars.errorColor,
        alignSelf: "flex-end",
    },
}, defaultVars);

export default class TextField extends React.Component<TextFieldProperties, State> {

    public static defaultStyles = defaultStyles;

    public static maskByDigits = (format: string) => {
        let formatDigits = format.split("").map(d => parseInt(d));
        return (next: string, prev?: string) => {
            let isDelete = prev && next.length < prev.length;
            let result = "";
            for (let i = 0; i < format.length; ++i) {
                let f = format[i];
                let fd = formatDigits[i];
                let n = next[i];
                let nd = parseInt(n);
                let isLast = next[i + 1] === undefined && n !== undefined;

                if (n === undefined) {
                    break;
                }

                if (isNaN(fd) && isLast) {
                    if (!isDelete && formatDigits[i + 1] >= nd) {
                        result += f + n;
                    } else if (!isDelete) {
                        result += f;
                    } else if (isDelete && f === n) {
                        result += f;
                    }
                } else if (isNaN(fd) && !isLast) {
                    result += f;
                } else if (!isNaN(fd) && fd >= nd) {
                    result += n;
                }

                if (!isNaN(nd) && isLast && isNaN(formatDigits[i + 1]) && !isDelete && i + 1 < format.length) {
                    result += format[i + 1];
                }
            }
            return result;
        }
    }

    private input?: TextInput;

    constructor(props: TextFieldProperties) {
        super(props);
        let value = props.value || "";
        this.state = { text: value, cursor: value.length }
    }

    private onSubmit = (evt: { nativeEvent: { text: string } }, focusNext = true) => {
        this.props.onSubmitEditing && this.props.onSubmitEditing(evt);
        focusNext && this.props.onFocusNext && this.props.onFocusNext(this.props.nextField);
    }

    private onBlur = () => {
        (this.props.submitOnBlur !== false) && this.onSubmit({ nativeEvent: { text: this.state.text } }, false);
        this.props.onBlur && this.props.onBlur();
    }

    private onChangeText = (raw: string) => { 
        let text = this.props.mask ? this.props.mask(raw, this.state.text) : raw;
        this.setState({text: text});
        this.props.onUpdate && this.props.onUpdate({ [this.props.name]: text });
        this.props.onChangeText && this.props.onChangeText(text);
    }

    render() {
        let { label, error, style, focus, submitOnBlur, styles: _styles,
              onSubmitEditing, onBlur, onChangeText, value, ...inputProps } = this.props
        let styles = _styles || defaultStyles;

        let inputStyle: any[] = [styles.values.TUI_VInput_Input];
        if (error) {
            inputStyle.push(styles.values.TUI_VInput_InputError);
        }

        return (
            <View style={style}>
                { label ? <Text style={styles.values.TUI_VInput_Label}>{label}</Text> : null }
                <TextInput
                    ref={view => this.input = view as any}
                    onSubmitEditing={this.onSubmit}
                    onBlur={this.onBlur}
                    onChangeText={this.onChangeText}
                    blurOnSubmit={true}
                    value={this.state.text}
                    {...inputProps}
                    style={inputStyle} />
                <Text style={styles.values.TUI_VInput_Error}>{error || " "}</Text>
            </View>
        );
    }

    componentWillMount() {
        // initialize by 'value' prop
        if (this.props.value !== undefined) {
            this.onChangeText(this.props.value);
        }
    }

    componentDidMount() {
        this.updateFocus()
    }

    componentDidUpdate(prevProps: TextFieldProperties) {
        this.updateFocus(prevProps)
    }

    private updateFocus(prevProps?: TextFieldProperties) {
        if (this.props.focus && (!prevProps || !prevProps.focus)) {
            this.input && this.input.focus();
        }
    }
}