//
//  EkycTracker.h
//  eKYCProject
//
//  Created by Quyen Quyen on 14/05/2024.
//

#ifndef EkycTracker_h
#define EkycTracker_h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface EkycTracker : RCTEventEmitter <RCTBridgeModule>

- (void)sendEventName:(NSString *)eventName body:(id)body;
- (bool)hasListeners;

@end
#endif /* EkycTracker_h */
