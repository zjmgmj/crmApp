//
//  RNDatePicker.m
//  crmobile
//
//  Created by 严骏 on 2018/10/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNDatePicker, NSObject)
RCT_EXTERN_METHOD(isPickExist: (RCTResponseSenderBlock) callback)
RCT_EXTERN_METHOD(show: (NSString) title defaultVal: (NSString) defaultVal callback: (RCTResponseSenderBlock) callback)
RCT_EXTERN_METHOD(hide)
+ (BOOL)requiresMainQueueSetup
{
  return YES;
}
@end
