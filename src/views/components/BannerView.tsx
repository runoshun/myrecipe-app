import * as React from "react";
import { View, ViewProperties } from "react-native";

import admob from "@root/admob";
import { FBABannerSizes } from "react-native-firebase";

export interface BannerViewProperties extends ViewProperties {
  hide?: boolean;
  size?: FBABannerSizes,
  unitId: string,
}

export const BannerView: React.StatelessComponent<BannerViewProperties> = props => {
  let { hide, children, unitId, size, ...viewProps } = props;
  if (hide) {
      return null;
  }

  return (
    <View {...viewProps}>
      <admob.Banner size={size} unitId={unitId} />
    </View>
  );
};

export default BannerView;
