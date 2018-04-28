import * as React from 'react';
import { Provider } from "react-redux";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { View } from "react-native";

import store from "./store";
import navigators from "@root/navigators";
import PopupRegistry from "@root/views/components/common/PopupRegistry";

const _store = store.configure();

export default class App extends React.Component {
    render() {
        return (
            <Provider store={_store}>
                <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <PopupRegistry>
                            <navigators.Main />
                        </PopupRegistry>
                    </View>
                    <KeyboardSpacer />
                </View>
            </Provider>
        );
    }
}
