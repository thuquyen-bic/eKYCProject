export interface EkycConfig {
  proxyUrl?: string;
  requestId?: string;
  xRequestId?: string;
  clientCode: string;
  userIdType?: UserIdType;
  userId?: string;
  frontIdCardId?: string;
  token: string;
  idCardTypes?: IdCardType[];
  flowType?: FlowType;
  sdkType?: SdkType;
  uiFlowType?: UiFlowType;
  isCacheImage?: boolean;
  isImageId?: boolean;
  isAdvancedMatching?: boolean;
  isAdvancedLiveness?: boolean;
  advancedLivenessConfig?: AdvancedLivenessConfig;
  isFaceSearch?: boolean;
  isFaceSave?: boolean;
  isFaceUpdate?: boolean;
  isFaceQuality?: boolean;
  isFaceLiveness?: boolean;
  isCardQualityCheck?: boolean;
  isCardSpoofCheck?: boolean;
  idCardAbbr?: boolean;
  showHelp?: boolean;
  showAutoCaptureButton?: boolean;
  autoCaptureMode?: boolean;
  backgroundColor?: string;
  textColor?: string;
  popupBackgroundColor?: string;
  buttonColor?: string;
  flash?: boolean;
  zoom?: number;
  selfieCameraMode?: CameraMode;
  idCardCameraMode?: CameraMode;
  isDebug?: boolean;
  enableVoiceHelp?: boolean;
  skipConfirmScreen?: boolean;
  faceMinRatio?: number;
  faceMaxRatio?: number;
  idCardMinRatio?: number;
  faceRetakeLimit?: number;
  cardRetakeLimit?: number;
  isSaveVideo?: boolean;
  idCardBoxPercentage?: number;
  isNfc?: boolean;
  nfcUiConfig?: NfcUiConfig;
  nfcVerifyOption?: NfcVerifyOption;
  advancedGuideVideoUrl?: string;
  iouThreshold?: number;
  iouCaptureTime?: number;
  font?: FontConfig;
  buttonCornerRadius?: number;
  faceChallengeMode: FaceChallengeMode;
}

export type FlowType =
  | 'EKYC_FULL'
  | 'FACE_FULL'
  | 'ID_CARD_FULL'
  | 'ID_CARD_FRONT'
  | 'ID_CARD_BACK'
  | 'FACE_SEARCH';

export type UiFlowType =
  | 'ID_CARD_FRONT'
  | 'ID_CARD_BACK'
  | 'FACE_BASIC'
  | 'FACE_ADVANCED'
  | 'UI_NFC';

export type SdkType = 'NORMAL' | 'UI_ONLY';

export type CameraMode = 'FRONT' | 'BACK';

export type NfcVerifyOption = 'FACE_VERIFY' | 'CHIP_DATA_VERIFY';

export type IdCardType = 'CMND' | 'CCCD' | 'PASSPORT' | 'BLX' | 'CMQD';

export type UserIdType = 'PHONE_NUM_TYPE' | 'IDCARD_ID_TYPE';

export type FaceChallengeMode = 'restricted' | 'unrestricted';

export interface AdvancedLivenessConfig {
  leftAngle: number;
  rightAngle: number;
  challengeRetakeLimit: number;
  duration: number;
}

export interface NfcUiConfig {
  idNumber: string;
  birthDate: string;
  expiredDate: string;
}

export interface FontConfig {
  regularFontName: String;
  regularFontSize: number;
  boldFontName: String;
  boldFontSize: number;
}
