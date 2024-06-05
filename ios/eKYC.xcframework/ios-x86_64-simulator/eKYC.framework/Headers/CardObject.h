//
//  CardObject.h
//  eKYC
//
//  Created by Tung Nguyen on 22/08/2022.
//

#ifndef CardObject_h
#define CardObject_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface CardObject : NSObject

@property (assign) CGRect rect;
@property (assign) float confidence;
@property (nonatomic, assign) NSString *cardType;

- (id) initWithRect:(CGRect) rect andConfidence:(float) confidence andCardType:(NSString *) cardType;

@end

#endif /* CardObject_h */
