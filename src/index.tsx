import * as React from "react";
import { Provider } from "react-redux";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { PersistGate } from "redux-persist/integration/react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import firebase from "react-native-firebase";

import store from "./store";
import navigators from "@root/navigators";
import PopupRegistry from "@root/views/components/common/PopupRegistry";
import rn from "@root/utils/rn";
import Banner from "@root/views/containers/Banner";


export default class App extends React.Component {

  private store: any;
  private persistor: any;

  componentWillMount() {
    (firebase as any)
      .admob()
      .initialize("ca-app-pub-5911972503110852~3179445304");

    const { store: _store, persistor } = store.configure();
    this.store = _store;
    this.persistor = persistor;
  }

  render() {
    return (
      <Provider store={this.store}>
        <PersistGate persistor={this.persistor} loading={<ActivityIndicator />}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <PopupRegistry>
                <navigators.Main />
                <Banner style={{ paddingVertical: 6, backgroundColor: "#999" }} />
              </PopupRegistry>
            </View>
            {rn.os() === "ios" && <KeyboardSpacer />}
            {rn.os() === "ios" && <StatusBar barStyle="light-content" />}
          </View>
        </PersistGate>
      </Provider>
    );
  }

}
