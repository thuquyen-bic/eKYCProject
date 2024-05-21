//
//  ekyc+.swift
//  eKYCProject
//
//  Created by Quyen Quyen on 14/05/2024.
//

import Foundation
import eKYC

extension eKYC.QualityResult {
    
    func toRN() -> CardQualityResult {
        return .init(
            frontIdCard: self.frontIDCard?.toRN(),
            backIdCard: self.backIDCard?.toRN()
        )
    }
    
}

extension eKYC.CardCheckResult {
    
    func toRN() -> CardQuality {
        return .init(
            code: self.code,
            message: self.message
        )
    }
    
}

extension eKYC.SpoofResult {
    
    func toRN() -> CardSpoofResult {
        return .init(
            frontIdCard: self.frontIDCard?.toRNSpoof(),
            backIdCard: self.backIDCard?.toRNSpoof(),
            packSpoof: self.packSpoof?.toRNSpoof()
        )
    }
    
}

extension eKYC.CardCheckResult {
    
    func toRNSpoof() -> CardSpoof {
        return .init(
            code: self.code,
            message: self.message
        )
    }
    
}

extension eKYC.OCRResult {
    
    func toRN() -> CardOcrResult {
        return CardOcrResult(
            code: self.code,
            message: self.message,
            information: self.information?.toRN()
        )
    }
    
}

extension eKYC.CardInformation {
    
    func toRN() -> OcrInformation {
        return OcrInformation(
            id: self.id,
            name: self.name,
            birthday: self.birthday,
            birthplace: self.birthplace,
            sex: self.sex,
            address: self.address,
            province: self.province,
            district: self.district,
            ward: self.ward,
            provinceCode: self.provinceCode,
            districtCode: self.districtCode,
            wardCode: self.wardCode,
            street: self.street,
            nationality: self.nationality,
            religion: self.religion,
            ethnicity: self.ethnicity,
            expiry: self.expiry,
            feature: self.feature,
            issueDate: self.issueDate,
            issueBy: self.issueBy,
            licenceClass: self.licenseClass,
            passportId: self.passportID,
            passportType: self.passportType,
            militaryTitle: self.miltaryTitle,
            typeBlood: self.typeBlood,
            cmndId: self.cmndID,
            document: self.document.flatMap { Document(rawValue: $0) }
        )
    }
    
}
