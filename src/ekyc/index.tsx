import {NativeModules, Platform} from 'react-native';
import type {EkycConfig} from './config/EkycConfig';
import type {KycUIFlowResult} from './result/KycUIFlowResult';

export type {
  EkycConfig,
  FlowType,
  NfcUiConfig,
  SdkType,
  UiFlowType,
  UserIdType,
  IdCardType,
  AdvancedLivenessConfig,
  CameraMode,
  NfcVerifyOption,
  FaceChallengeMode,
} from './config/EkycConfig';

export type {
  KycUIFlowResult,
  ResultState,
  KycNfcData,
  IdentityData,
  CacheAdvanceImageData,
} from './result/KycUIFlowResult';

const LINKING_ERROR =
  "The package 'viettel-ekyc' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ios: "- You have run 'pod install'\n", default: ''}) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ViettelEkyc = NativeModules.ViettelEkyc
  ? NativeModules.ViettelEkyc
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export function startNormalEkyc(config: EkycConfig): Promise<any> {
  config.sdkType = 'NORMAL';
  return ViettelEkyc.startEkyc(config);
}

export function startUIOnlyEkyc(config: EkycConfig): Promise<KycUIFlowResult> {
  config.sdkType = 'UI_ONLY';
  return ViettelEkyc.startEkyc(config);
}
