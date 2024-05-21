//
//  CardDetectorWrapper.h
//  eKYC
//
//  Created by Tung Nguyen on 22/08/2022.
//

#ifndef CardDetectorWrapper_h
#define CardDetectorWrapper_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "CardObject.h"

@interface CardDetectorWrapper : NSObject
- (NSArray<CardObject *> *) detect:(NSString *) imagePath binPath:(NSString *) binPath paramPath:(NSString *) paramPath;
@end

#endif /* CardDetectorWrapper_h */
