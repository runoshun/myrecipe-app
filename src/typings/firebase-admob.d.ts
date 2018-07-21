import * as React from "react";
import { RNFirebase } from "react-native-firebase";

declare module "react-native-firebase" {
  interface Firebase {
    admob: FBAStatic;
  }

  interface FBAStatic {
    (): FBA;
    AdRequest: { new (): FBAAdRequestBuilder };
    Banner: FBABanner,
  }

  interface FBA {
    initialize(appId: string): void;
    interstitial(unitId: string): FBAInterstitial;
  }

  interface FBABanner extends React.ComponentClass<FBABannerProps> {}

  export interface FBABannerProps {
    unitId: string;
    size?: FBABannerSizes;
    request?: FBAAdRequest;
    onAdLoaded?: () => void;
    onAdClosed?: () => void;
    onAdOpened?: () => void;
    onAdLeftApplication?: () => void;
    onAdFailedToLoad?: (err: Error) => void;
  }

  export type FBABannerSizes =
    | "BANNER"
    | "FULL_BANNER"
    | "LARGE_BANNER"
    | "LEADERBOARD"
    | "MEDIUM_RECTANGLE"
    | "SMART_BANNER";

  export interface FBAInterstitial {
    loadAd(request: FBAAdRequest): void;
    isLoaded(): boolean;
    show(): void;
  }

  export interface FBAAdRequest {}

  interface FBAAdRequestBuilder {
    addTestDevice(deviceId: string): FBAAdRequestBuilder;
    addKeyword(keyword: string): FBAAdRequestBuilder;
    build(): FBAAdRequest;
  }
}
