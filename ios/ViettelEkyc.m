//
//  ViettelEkyc.m
//  eKYCProject
//
//  Created by Quyen Quyen on 14/05/2024.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ViettelEkyc, NSObject)

RCT_EXTERN_METHOD(getVersion:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startEkyc:(NSDictionary)config
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
