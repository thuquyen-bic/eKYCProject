export interface KycUIFlowResult {
  resultState?: ResultState;
  imageId?: string;
  localCroppedImage?: string;
  localFullImage?: string;
  advanceImageDataList?: CacheAdvanceImageData[];
  videoPath?: string;
  nfcData?: KycNfcData;
}

export interface CacheAdvanceImageData {
  imageId?: string;
  localImage?: string;
  labelPose?: string;
}

export interface KycNfcData {
  dataVerifyObject?: string;
  nfcPortrait?: string;
  identityData?: IdentityData;
}

export interface IdentityData {
  mrz?: string;
  cardNumber?: string;
  dateOfBirth?: string;
  issueDate?: string;
  previousNumber?: string;
  name?: string;
  sex?: string;
  nationality?: string;
  nation?: string;
  religion?: string;
  hometown?: string;
  address?: string;
  expiredDate?: string;
  fatherName?: string;
  motherName?: string;
  partnerName?: string;
}

export type ResultState = 'Success' | 'UserCancelled';
