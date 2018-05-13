import * as React from 'react';
import { Provider } from "react-redux";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { PersistGate } from 'redux-persist/integration/react';
import { View, ActivityIndicator, StatusBar } from "react-native";

import store from "./store";
import navigators from "@root/navigators";
import PopupRegistry from "@root/views/components/common/PopupRegistry";
import rn from "@root/utils/rn";

const { store: _store, persistor } = store.configure();

export default class App extends React.Component {
    render() {
        return (
            <Provider store={_store}>
                <PersistGate persistor={persistor} loading={<ActivityIndicator />}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <PopupRegistry>
                                <navigators.Main />
                            </PopupRegistry>
                        </View>
                        {rn.isRunningOnExpo() && rn.os() === "ios" && <KeyboardSpacer />}
                        {rn.isRunningOnExpo() && rn.os() === "ios" && <StatusBar barStyle="light-content" />}
                    </View>
                </PersistGate>
            </Provider>
        );
    }
}
