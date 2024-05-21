//
//  EkycTracker.m
//  eKYCProject
//
//  Created by Quyen Quyen on 14/05/2024.
//

#import <Foundation/Foundation.h>
#import "EkycTracker.h"

@implementation EkycTracker
{
  bool hasListeners;
}

RCT_EXPORT_MODULE(EkycTracker);

+ (id)allocWithZone:(NSZone *)zone {
  static EkycTracker *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}


- (NSArray<NSString *> *)supportedEvents {
  return @[@"trackEvent"];
}

// Will be called when this module's first listener is added.
-(void)startObserving {
  hasListeners = YES;
  // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
  hasListeners = NO;
  // Remove upstream listeners, stop unnecessary background tasks
}

-(bool)hasListeners {
  return hasListeners;
}


- (void)sendEventName:(NSString *)eventName body:(id)body {
  if (hasListeners) {
    NSLog(@"EkycTracker sendEventName emitting event: %@", eventName);
    [self sendEventName:eventName body:body];
  } else {
    NSLog(@"EkycTracker sendEventName called without listeners: %@", eventName);
  }
}

@end
