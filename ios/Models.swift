//
//  Models.swift
//  viettel-ekyc
//
//  Created by Tung Nguyen on 23/05/2023.
//

import Foundation

enum ResultState: String, Encodable {
    case userCancelled = "UserCancelled"
    case exceedMaxRetry = "ExceedMaxRetry"
    case invalidConfig = "InvalidConfig"
    case success = "Success"
}

struct CacheAdvanceImageData: Encodable {
    var imageId: String?
    var localImage: String?
    var labelPose: String?
}

struct KycUIFlowResult: Encodable {
    var resultState: ResultState?
    var imageId: String?
    var localCroppedImage: String?
    var localFullImage: String?
    var advanceImageDataList: [CacheAdvanceImageData]?
    var videoPath: String?
    var nfcData: KycNfcData?
}

struct KycNfcData: Encodable {
    var dataVerifyObject: String?
    var nfcPortrait: String?
    var identityData: IdentityData?
}

struct IdentityData: Encodable {
    var mrz: String?
    var cardNumber: String?
    var dateOfBirth: String?
    var issueDate: String?
    var previousNumber: String?
    var name: String?
    var sex: String?
    var nationality: String?
    var nation: String?
    var religion: String?
    var hometown: String?
    var address: String?
    var expiredDate: String?
    var fatherName: String?
    var motherName: String?
    var partnerName: String?
}


struct KycNormalFlowResult: Encodable {
    var resultState: ResultState
    var cardData: IdCardFullData?
    var faceData: FaceFullData?
    var localFrontCardFullImage: String?
    var localBackCardFullImage: String?
    var localFaceFullImage: String?
    var localFrontIdCardUploadImage: String?
    var localBackIdCardUploadImage: String?
    var localFaceUploadImage: String?
    var requestLogs: String?
    var videoPath: String?
}

struct IdCardFullData: Encodable {
    var code: Int?
    var message: String?
    var notice: String?
    var frontImageId: String?
    var backImageId: String?
    var requestId: String?
    var requestTime: String?
    var responseTime: String?
    var signature: String?
    var transId: String?
    var qualityResult: CardQualityResult?
    var spoofResult: CardSpoofResult?
    var ocrResult: CardOcrResult?
}

struct CardQualityResult: Encodable {
    var frontIdCard: CardQuality?
    var backIdCard: CardQuality?
}

struct CardQuality: Encodable {
    var code: Int?
    var message: String?
}

struct CardSpoofResult: Encodable {
    var frontIdCard: CardSpoof?
    var backIdCard: CardSpoof?
    var packSpoof: CardSpoof?
}

struct CardSpoof: Encodable {
    var code: Int?
    var message: String?
}

struct CardOcrResult: Encodable {
    var code: Int?
    var message: String?
    var information: OcrInformation?
}

struct OcrInformation: Encodable {
    var id: String?
    var name: String?
    var birthday: String?
    var birthplace: String?
    var sex: String?
    var address: String?
    var province: String?
    var district: String?
    var ward: String?
    var provinceCode: String?
    var districtCode: String?
    var wardCode: String?
    var street: String?
    var nationality: String?
    var religion: String?
    var ethnicity: String?
    var expiry: String?
    var feature: String?
    var issueDate: String?
    var issueBy: String?
    var licenceClass: String?
    var passportId: String?
    var passportType: String?
    var militaryTitle: String?
    var typeBlood: String?
    var cmndId: String?
    var document: Document?
}

enum Document: String, Encodable {
    case CMND_FRONT
    case CMND_BACK
    case CMCC_FRONT
    case CCCD_FRONT
    case CCCD_BACK
    case PASSPORT
    case CMQD_FRONT
    case CMQD_BACK
    case BLX
}


struct FaceFullData: Encodable {
    var code: Int?
    var message: String?
    var notice: String?
    var frontImageId: String?
    var liveImageId: String?
    var requestId: String?
    var requestTime: String?
    var responseTime: String?
    var transId: String?
    var signature: String?
    var userId: String?
    var faceUpdateResult: FaceUpdateResult?
    var qualityResult: CardQualityResult?
    var livenessResult: FaceLivenessResult?
    var faceSearchResult: FaceSearchResult?
    var faceSaveResult: FaceSaveResult?
    var advance_liveness_result: [AdvancedLivenessResult]?
    var advance_fm_result: [AdvancedFaceMatchingResult]?
}

struct FaceUpdateResult: Encodable {
    var code: Int?
    var message: String?
    var transId: String?
    var userId: String?
}

struct FaceQualityResult: Encodable {
    var code: Int?
    var message: String?
    var transId: String?
}

struct FaceLivenessResult: Encodable {
    var code: Int?
    var message: String?
    var transId: String?
    var verifyResult: Bool?
}

struct FaceSearchResult: Encodable {
    var code: Int?
    var message: String?
    var transId: String?
    var userId: String?
}

struct FaceSaveResult: Encodable {
    var code: Int?
    var message: String?
    var transId: String?
    var userId: String?
}

struct AdvancedLivenessResult: Encodable {
    var code: Int
    var message: String?
    var transId: String?
    var liveImageId: String?
    var otherImageId: String?
    var verifyResult: Bool?
    var plt: Double?
}

struct AdvancedFaceMatchingResult: Encodable {
    var code: Int
    var message: String?
    var transId: String?
    var imageId: String?
    var verifyResult: Bool?
    var plt: Double?
}
