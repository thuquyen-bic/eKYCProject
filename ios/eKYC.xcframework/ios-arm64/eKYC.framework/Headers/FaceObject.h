//
//  FaceObject.h
//  eKYC
//
//  Created by Tung Nguyen on 07/07/2022.
//

#ifndef FaceObject_h
#define FaceObject_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface FaceObject : NSObject

@property (assign) CGRect rect;

@property (assign) float prob;

- (id) initWithRect:(CGRect) rect andProb:(float) prob;

@end


#endif /* FaceObject_h */
