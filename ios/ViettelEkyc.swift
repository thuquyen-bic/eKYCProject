//
//  ViettelEkyc.swift
//  eKYCProject
//
//  Created by Quyen Quyen on 14/05/2024.
//

import Foundation
import eKYC
import UIKit
// import NFC

enum ViettelEkycError: Error {
    case invalidSdkType
}

@objc(ViettelEkyc)
class ViettelEkyc: NSObject {
    
    var delegate: eKYCDelegate?
    
    @objc(resolve:withRejecter:)
    func getVersion(resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(eKYCModule.version())
    }
    
    @objc(startEkyc:withResolver:withRejecter:)
    func startEkyc(config: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        let clientCode = config.string(key: "clientCode")
        let token = config.string(key: "token")
        let userIdTypeString = config.string(key: "userIdType")
        let proxyUrl = config.string(key: "proxyUrl")
        
        let userIdType: eKYC.UserIdType? = {
            switch userIdTypeString {
            case "PHONE_NUM_TYPE":
                return .phoneNum
            case "IDCARD_ID_TYPE":
                return .idCardID
            default:
                return nil
            }
        }()
        
        let userId = config.string(key: "userId")
        let requestId = config.string(key: "requestId")
        let xRequestId = config.string(key: "xRequestId")
        
        var authConfigurationBuilder = AuthConfigurationBuilder()
            .proxyURL(proxyUrl)
            .clientCode(clientCode)
            .token(token)
            .userID(userId)
            .requestID(requestId)
            .xRequestID(xRequestId)
        
        if let userIdType = userIdType {
            authConfigurationBuilder = authConfigurationBuilder.userIDType(userIdType)
        }
        let authConfig = authConfigurationBuilder.build()
        
        var configBuilder = ConfigurationBuilder()
        
        let cardTypes: [IdCardType] = ((config["idCardTypes"] as? [String]) ?? []).compactMap { type in
            switch type {
            case "CMND": return .cmnd
            case "CCCD": return .cccd
            case "PASSPORT": return .passport
            case "BLX": return .blx
            case "CMQD": return .cmqd
            default:
                return nil
            }
        }
        
        let flowType: Flow? = {
            switch config.string(key: "flowType") {
            case "EKYC_FULL":
                return .ekycFull
            case "FACE_FULL":
                return .faceFull
            case "ID_CARD_FULL":
                return .idCardFull
            case "ID_CARD_FRONT":
                return .idCardFront
            case "ID_CARD_BACK":
                return .idCardBack
            case "FACE_SEARCH":
                return .faceSearch
            default:
                return nil
            }
        }()
        
        let uiFlow: UIFlowType? = {
            switch config.string(key: "uiFlowType") {
            case "ID_CARD_FRONT":
                return .idCardFront
            case "ID_CARD_BACK":
                return .idCardBack
            case "FACE_BASIC":
                return .faceBasic
            case "FACE_ADVANCED":
                return .faceAdvance
            case "UI_NFC":
                return .nfc
            default:
                return nil
            }
        }()
        
        let sdkType: SDKType? = {
            switch config.string(key: "sdkType") {
            case "UI_ONLY":
                return .uiOnly
            case "NORMAL":
                return .normal
            default:
                return nil
            }
        }()
                
        guard let sdkType = sdkType else {
            reject("", "", ViettelEkycError.invalidSdkType)
            return
        }
        
        configBuilder = configBuilder
            .sdkType(sdkType)
            .idCardTypes(cardTypes)
        
        if let flowType = flowType {
            configBuilder = configBuilder.flow(flowType)
        }
        if let uiFlow = uiFlow {
            configBuilder = configBuilder.uiFlowType(uiFlow)
            
            //            if sdkType == .uiOnly && uiFlow == .nfc {
            //                eKYCModule.setNFCReader(NFCReader())
            //            }
        }
        if let frontIdCardId = config["frontIdCardId"] as? String {
            configBuilder = configBuilder.frontIdCardId(frontIdCardId)
        }
        if let isImageId = config["isImageId"] as? Bool {
            configBuilder = configBuilder.isImageID(isImageId)
        }
        if let isCacheImage = config["isCacheImage"] as? Bool {
            configBuilder = configBuilder.isCacheImage(isCacheImage)
        }
        if let isSaveVideo = config["isSaveVideo"] as? Bool {
            configBuilder = configBuilder.isSaveVideo(isSaveVideo)
        }
        if let isAdvancedMatching = config["isAdvancedMatching"] as? Bool {
            configBuilder = configBuilder.isAdvanceFaceMatching(isAdvancedMatching)
        }
        if let isAdvanceLiveness = config["isAdvancedLiveness"] as? Bool {
            configBuilder = configBuilder.advancedLiveness(isAdvanceLiveness)
        }
        if let isFaceSearch = config["isFaceSearch"] as? Bool {
            configBuilder = configBuilder.isFaceSearch(isFaceSearch)
        }
        if let isFaceSave = config["isFaceSave"] as? Bool {
            configBuilder = configBuilder.isFaceSave(isFaceSave)
        }
        if let isFaceUpdate = config["isFaceUpdate"] as? Bool {
            configBuilder = configBuilder.isFaceUpdate(isFaceUpdate)
        }
        if let isFaceSave = config["isFaceSave"] as? Bool {
            configBuilder = configBuilder.isFaceSave(isFaceSave)
        }
        if let isFaceQuality = config["isFaceQuality"] as? Bool {
            configBuilder = configBuilder.isFaceQuality(isFaceQuality)
        }
        if let isFaceLiveness = config["isFaceLiveness"] as? Bool {
            configBuilder = configBuilder.isLiveness(isFaceLiveness)
        }
        if let showHelp = config["showHelp"] as? Bool {
            configBuilder = configBuilder.showHelp(showHelp)
        }
        if let enableVoiceHelp = config["enableVoiceHelp"] as? Bool {
            configBuilder = configBuilder.enableVoiceHelp(enableVoiceHelp)
        }
        if let showAutoCaptureButton = config["showAutoCaptureButton"] as? Bool {
            configBuilder = configBuilder.showAutoCaptureButton(showAutoCaptureButton)
        }
        if let autoCaptureMode = config["autoCaptureMode"] as? Bool {
            configBuilder = configBuilder.autoCaptureModeOn(autoCaptureMode)
        }
        if let showAutoCaptureButton = config["showAutoCaptureButton"] as? Bool {
            configBuilder = configBuilder.showAutoCaptureButton(showAutoCaptureButton)
        }
        if let flash = config["flash"] as? Bool {
            configBuilder = configBuilder.showFlashButton(flash)
        }
        if let zoom = config["zoom"] as? Double {
            configBuilder = configBuilder.cameraZoom(zoom)
        }
        if let selfieCameraMode = config["selfieCameraMode"] as? String {
            if selfieCameraMode == "FRONT" {
                configBuilder = configBuilder.selfieCameraMode(.front)
            } else if selfieCameraMode == "BACK" {
                configBuilder = configBuilder.selfieCameraMode(.back)
            }
        }
        if let idCardCameraMode = config["idCardCameraMode"] as? String {
            if idCardCameraMode == "FRONT" {
                configBuilder = configBuilder.cardCameraMode(.front)
            } else if idCardCameraMode == "BACK" {
                configBuilder = configBuilder.cardCameraMode(.back)
            }
        }
        if let isDebug = config["isDebug"] as? Bool {
            configBuilder = configBuilder.isDebug(isDebug)
        }
        if let skipConfirmScreen = config["skipConfirmScreen"] as? Bool {
            configBuilder = configBuilder.skipConfirmScreen(skipConfirmScreen)
        }
        if let faceMinRatio = config["faceMinRatio"] as? Double {
            configBuilder = configBuilder.faceMinRatio(faceMinRatio)
        }
        if let faceMaxRatio = config["faceMaxRatio"] as? Double {
            configBuilder = configBuilder.faceMaxRatio(faceMaxRatio)
        }
        if let faceRetakeLimit = config["faceRetakeLimit"] as? Int {
            configBuilder = configBuilder.faceRetakeLimit(faceRetakeLimit)
        }
        if let idCardMinRatio = config["idCardMinRatio"] as? Double {
            configBuilder = configBuilder.idCardMinRatio(idCardMinRatio)
        }
        if let cardRetakeLimit = config["cardRetakeLimit"] as? Int {
            configBuilder = configBuilder.idCardRetakeLimit(cardRetakeLimit)
        }
        if let isCardQualityCheck = config["isCardQualityCheck"] as? Bool {
            configBuilder = configBuilder.isIdCardQuality(isCardQualityCheck)
        }
        if let isCardSpoofCheck = config["isCardSpoofCheck"] as? Bool {
            configBuilder = configBuilder.isIdCardSpoof(isCardSpoofCheck)
        }
        if let idCardAbbr = config["idCardAbbr"] as? Bool {
            if idCardAbbr {
                configBuilder = configBuilder.cardAbbr(.abbr)
            } else {
                configBuilder = configBuilder.cardAbbr(.full)
            }
        }
        if let advancedGuideVideoUrl = config["advancedGuideVideoUrl"] as? String {
            configBuilder = configBuilder.tutorialVideoURL(advancedGuideVideoUrl)
        }
        if let advancedLivenessConfig = config["advancedLivenessConfig"] as? [String: Any] {
            if let leftAngle = advancedLivenessConfig["leftAngle"] as? Int,
               let rightAngle = advancedLivenessConfig["rightAngle"] as? Int,
               let challengeRetakeLimit = advancedLivenessConfig["challengeRetakeLimit"] as? Int,
               let duration = advancedLivenessConfig["duration"] as? Int {
                let livenessConfig = AdvancedLivenessConfig(leftAngle: leftAngle, rightAngle: rightAngle, challengeRetakeLimit: challengeRetakeLimit, duration: duration)
                configBuilder = configBuilder.advancedLivenessConfig(livenessConfig)
            }
        }
        if let nfcConfig = config["nfcUiConfig"] as? [String: Any] {
            if let id = nfcConfig["idNumber"] as? String,
               let birthDate = nfcConfig["birthDate"] as? String,
               let expireDate = nfcConfig["expiredDate"] as? String {
                let nfcInput = NFCInput(identityNumber: id, dateOfBirth: birthDate, expireDate: expireDate)
                configBuilder = configBuilder.nfcInput(nfcInput)
            }
            
        }
        if let isNFC = config["isNfc"] as? Bool {
            configBuilder = configBuilder.isNFC(isNFC)
        }
        if let font = config["fontConfig"] as? [String: Any] {
            if let regularFontName = font["regularFontName"] as? String, let regularFontSize = font["regularFontSize"] as? CGFloat, let boldFontName = font["boldFontName"] as? String, let boldFontSize = font["boldFontSize"] as? CGFloat, let regularFont = UIFont(name: regularFontName, size: regularFontSize), let boldFont = UIFont(name: boldFontName, size: boldFontSize) {
                configBuilder = configBuilder.font(FontConfig(regular: regularFont, bold: boldFont))
            }
        }
        if let buttonColor = config["buttonColor"] as? String {
            configBuilder = configBuilder.buttonColor(Utils.hexStringToUIColor(hex: buttonColor))
        }
        if let buttonCornerRadius = config["buttonCornerRadius"] as? CGFloat {
            configBuilder = configBuilder.buttonCornerRadius(buttonCornerRadius)
        }
        if let faceChallengeMode = config["faceChallengeMode"] as? String {
            configBuilder = configBuilder.faceChallengeMode(faceChallengeMode == "unrestricted" ? .unrestricted : .restricted)
        }
        
        let config = configBuilder.build()
        let delegate = eKYCDelegator(config: config, resolve: resolve)
        self.delegate = delegate
        eKYCModule.registerTracker(EkycTrackerImplement())
        
        if #available(iOS 13, *) {
//            eKYCModule.setNFCReader(NFCReader())
        }
        
        DispatchQueue.main.async {
            guard let vc = UIApplication.shared.topMostViewController() else {
                return
            }
            eKYCModule.start(viewController: vc, authConfiguration: authConfig, configuration: config, delegate: delegate)
        }
    }
    
}

//@objc(EkycTracker)
public class EkycTrackerImplement: EkycTracking {
    
    var tracker = EkycTracker()
    
    public func track(objectName: String, eventSrc: EventSrc, objectType: ObjectType, action: EventAction, eventValue: [String : Any]?) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "dd/MM/yyyy hh:mm:ss"
        let json: [String: Any] = [
            "objectName": objectName,
            "eventSrc": eventSrc.rawValue,
            "objectType": objectType.rawValue,
            "action": action.rawValue,
            "eventValue": eventValue ?? [:],
            "timestamp": dateFormatter.string(from: Date())
        ]
        tracker.sendEvent(withName: "trackEvent", body: json)
    }
}

class eKYCDelegator: eKYCDelegate {
    
    let resolve: RCTPromiseResolveBlock
    let config: Configuration
    
    init(config: Configuration, resolve: @escaping RCTPromiseResolveBlock) {
        self.config = config
        self.resolve = resolve
    }
    
    func onError(error: eKYC.eKYCError) {
        let resultState: ResultState = {
            switch error {
            case .userCancelled:
                return .userCancelled
            case .exceedMaxRetry:
                return .exceedMaxRetry
            case .invalidInputConfiguration:
                return .invalidConfig
            default:
                return .userCancelled
            }
        }()
        switch config.sdkType {
        case .uiOnly:
            resolve(KycUIFlowResult(resultState: resultState).dictionary)
        case .normal:
            resolve(KycNormalFlowResult(resultState: resultState).dictionary)
        default:
            resolve(KycNormalFlowResult(resultState: .userCancelled).dictionary)
        }
    }
    
    func onCompleteKYC(result: eKYC.KYCResult) {
        let normalFlowResult = KycNormalFlowResult(
            resultState: .success,
            cardData: result.card.map {
                return IdCardFullData(
                    code: $0.code,
                    message: $0.message,
                    notice: $0.notice,
                    frontImageId: $0.frontImageID,
                    backImageId: $0.backImageID,
                    requestId: $0.requestID,
                    requestTime: $0.requestTime,
                    responseTime: $0.responseTime,
                    signature: $0.signature,
                    transId: $0.transID,
                    qualityResult: $0.qualityResult?.toRN(),
                    spoofResult: $0.spoofResult?.toRN(),
                    ocrResult: $0.ocrResult?.toRN()
                )
            },
            faceData: FaceFullData(
                code: result.face?.code,
                message: result.face?.message,
                notice: result.face?.notice,
                frontImageId: result.face?.frontImageID,
                liveImageId: result.face?.liveImageID,
                requestId: result.face?.requestID,
                requestTime: nil,
                responseTime: nil,
                transId: result.face?.transID,
                signature: result.face?.signature,
                userId: result.face?.userID,
                faceUpdateResult: result.face?.faceUpdateResult.map({ FaceUpdateResult(code: $0.code, message: $0.message, transId: nil, userId: nil)}),
                qualityResult: result.face?.qualityResult.map({ CardQualityResult(
                    frontIdCard: CardQuality(code: $0.frontIDCard?.code, message: $0.frontIDCard?.message),
                    backIdCard: CardQuality(code: $0.backIDCard?.code, message: $0.backIDCard?.message)
                )
                }),
                livenessResult: result.face?.livenessResult.map({ FaceLivenessResult(code: $0.code, message: $0.message, transId: nil, verifyResult: $0.verifyResult )}),
                faceSearchResult: result.face?.faceSearchResult.map({ FaceSearchResult(code: $0.code, message: $0.message, transId: nil, userId: $0.userID )}),
                faceSaveResult: result.face?.faceSaveResult.map({ FaceSaveResult(code: $0.code, message: $0.message, transId: nil, userId: $0.userID) }),
                advance_liveness_result: [],
                advance_fm_result: []
            ),
            videoPath: result.videoPath
        )
        resolve(normalFlowResult.dictionary)
    }
    
    func onCompleteUIFlow(result: eKYC.KYCUIResult) {
        let uiFlowResult = KycUIFlowResult(
            resultState: .success,
            imageId: result.imageID,
            localCroppedImage: result.image,
            localFullImage: result.cacheImage,
            advanceImageDataList: result.advanceImageDataList?.map { item in
                return CacheAdvanceImageData(
                    imageId: item.id,
                    localImage: item.image,
                    labelPose: item.pose?.rawValue
                )
            },
            videoPath: result.videoPath
        )
        resolve(uiFlowResult.dictionary)
    }
    
    func onCompleteUINFCFlow(result: eKYC.NFCResult) {
        let nfcResult = KycUIFlowResult(nfcData: KycNfcData(
            dataVerifyObject: result.dataVerifyObject,
            nfcPortrait: result.nfcPortrait,
            identityData: result.identityData == nil ? nil : IdentityData(
                mrz: result.identityData!.mrz,
                cardNumber: result.identityData!.cardNumber,
                dateOfBirth: result.identityData!.dateOfBirth,
                issueDate: result.identityData!.issueDate,
                previousNumber: result.identityData!.previousNumber,
                name: result.identityData!.name,
                sex: result.identityData!.sex,
                nationality: result.identityData!.nationality,
                nation: result.identityData!.nation,
                religion: result.identityData!.religion,
                hometown: result.identityData!.hometown,
                address: result.identityData!.address,
                expiredDate: result.identityData!.expireDate,
                fatherName: result.identityData!.fatherName,
                motherName: result.identityData!.motherName,
                partnerName: result.identityData!.partnerName
            )
        ))
        resolve(nfcResult.dictionary)
    }
    
}

extension Encodable {
    var dictionary: [String: Any] {
        guard let data = try? JSONEncoder().encode(self) else { return [:] }
        return (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)).flatMap { $0 as? [String: Any] } ?? [:]
    }
}

extension NSDictionary {
    
    func string(key: String) -> String {
        return (self[key] as? String) ?? ""
    }
    
    func bool(key: String) -> Bool? {
        return self[key] as? Bool
    }
    
}

extension UIApplication {
    
    func topMostViewController(base: UIViewController? = UIApplication.shared.keyWindow?.rootViewController) -> UIViewController? {
        if let nav = base as? UINavigationController {
            return topMostViewController(base: nav.visibleViewController)
            
        } else if let tab = base as? UITabBarController, let selected = tab.selectedViewController {
            return topMostViewController(base: selected)
            
        } else if let presented = base?.presentedViewController {
            return topMostViewController(base: presented)
        }
        return base
    }
    
}

class Utils {
    static func hexStringToUIColor(hex:String) -> UIColor {
        var cString:String = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        
        if (cString.hasPrefix("#")) {
            cString.remove(at: cString.startIndex)
        }
        
        if ((cString.count) != 6) {
            return UIColor.gray
        }
        
        var rgbValue:UInt32 = 0
        Scanner(string: cString).scanHexInt32(&rgbValue)
        
        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(1.0)
        )
    }
    
}
