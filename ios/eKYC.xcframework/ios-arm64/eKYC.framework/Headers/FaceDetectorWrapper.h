//
//  FaceDetectorWrapper.h
//  eKYC
//
//  Created by Tung Nguyen on 06/07/2022.
//

#ifndef FaceDetectorWrapper_h
#define FaceDetectorWrapper_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "FaceObject.h"

@interface FaceDetectorWrapper : NSObject
+ (void)loadModel:(NSString *) cfgPath weightPath:(NSString *) weightPath;
- (NSArray<FaceObject *> *) detect:(NSString *) imagePath destPath:(NSString *) destPath;
- (NSString *) getBlur:(NSString *) imagePath;
- (NSArray<NSNumber *> *) detectFacePose:(NSString *) imagePath configPath:(NSString *) configPath paramPath:(NSString *) paramPath binPath:(NSString *) binPath weightParamPath:(NSString *) weightParamPath weightBinPath:(NSString *) weightBinPath;
@end

#endif /* FaceDetectorWrapper_h */
