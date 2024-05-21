import {ResultState} from './KycUIFlowResult';

export interface KycNormalFlowResult {
  resultState?: ResultState;
  cardData?: IdCardFullData;
  faceData?: FaceFullData;
  localFrontCardFullImage?: string;
  localBackCardFullImage?: string;
  localFaceFullImage?: string;
  localFrontIdCardUploadImage?: string;
  localBackIdCardUploadImage?: string;
  localFaceUploadImage?: string;
  requestLogs?: string;
  videoPath?: string;
}

export interface IdCardFullData {
  code?: number;
  message?: string;
  notice?: string;
  frontImageId?: string;
  backImageId?: string;
  requestId?: string;
  requestTime?: string;
  responseTime?: string;
  signature?: string;
  transId?: string;
  qualityResult?: CardQualityResult;
  spoofResult?: CardSpoofResult;
  ocrResult?: OcrResult;
}

export interface CardQualityResult {
  frontIdCard?: CardQuality;
  backIdCard?: CardQuality;
}

export interface CardQuality {
  code?: number;
  message?: string;
}

export interface CardSpoofResult {
  frontIdCard?: CardSpoof;
  backIdCard?: CardSpoof;
  packSpoof?: CardSpoof;
}

export interface CardSpoof {
  code?: number;
  message?: string;
}

export interface OcrResult {
  code?: number;
  message?: string;
  information?: OcrInformation;
}

export interface OcrInformation {
  id?: string;
  name?: string;
  birthday?: string;
  birthplace?: string;
  sex?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
  street?: string;
  nationality?: string;
  religion?: string;
  ethnicity?: string;
  expiry?: string;
  feature?: string;
  issueDate?: string;
  issueBy?: string;
  licenceClass?: string;
  passportId?: string;
  passportType?: string;
  militaryTitle?: string;
  typeBlood?: string;
  cmndId?: string;
  document?: Document;
}

export type Document =
  | 'CMND_FRONT'
  | 'CMND_BACK'
  | 'CMCC_FRONT'
  | 'CCCD_FRONT'
  | 'CCCD_BACK'
  | 'PASSPORT'
  | 'CMQD_FRONT'
  | 'CMQD_BACK'
  | 'BLX';

export interface FaceFullData {
  code?: number;
  message?: string;
  notice?: string;
  frontImageId?: string;
  liveImageId?: string;
  requestId?: string;
  requestTime?: string;
  responseTime?: string;
  transId?: string;
  signature?: string;
  userId?: string;
  faceUpdateResult?: FaceUpdateResult;
  qualityResult?: FaceQualityResult;
  livenessResult?: FaceLivenessResult;
  faceSearchResult?: FaceSearchResult;
  faceSaveResult?: FaceSaveResult;
  advance_liveness_result?: AdvancedLivenessResult[];
  advance_fm_result?: AdvancedFaceMatchingResult[];
}

export interface FaceUpdateResult {
  code?: number;
  message?: string;
  transId?: string;
  userId?: string;
}

export interface FaceQualityResult {
  code?: number;
  message?: string;
  transId?: string;
}

export interface FaceLivenessResult {
  code?: number;
  message?: string;
  transId?: string;
  verifyResult?: boolean;
}

export interface FaceSearchResult {
  code?: number;
  message?: string;
  transId?: string;
  userId?: string;
}

export interface FaceSaveResult {
  code?: number;
  message?: string;
  transId?: string;
  userId?: string;
}

export interface AdvancedLivenessResult {
  code?: number;
  message?: string;
  transId?: string;
  liveImageId?: string;
  otherImageId?: string;
  verifyResult?: boolean;
  plt?: number;
}

export interface AdvancedFaceMatchingResult {
  code?: number;
  message?: string;
  transId?: string;
  imageId?: string;
  verifyResult?: boolean;
  plt?: number;
}
