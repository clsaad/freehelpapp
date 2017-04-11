//
//  PhoneUtils.h
//  WebView
//
//  Created by Leandro on 08/08/16.
//  Copyright © 2016 Chris Serra. All rights reserved.
//

#import <Foundation/Foundation.h>



@interface PhoneUtils : NSObject

// STATIC
+(void)MakePhoneCall : (NSString*)number;
+(void)SendSMS: (NSString *)message : (NSString*) toNumber;
+(void)SendWhatsappMessage : (NSString*) message : (NSString*) toNumber;
+(void)Alert : (NSString*) title : (NSString*) message;
+(void)ShareText:(NSString *)text;

@end
