//
//  PhoneUtils.m
//  WebView
//
//  Created by Leandro on 08/08/16.
//  Copyright © 2016 Chris Serra. All rights reserved.
//

#import "PhoneUtils.h"

#import <AddressBook/ABAddressBook.h>
#import <AddressBookUI/AddressBookUI.h>

#import <MessageUI/MessageUI.h>
#import <MessageUI/MFMessageComposeViewController.h>

#import <Contacts/Contacts.h>



@implementation PhoneUtils


// STATIC VARS

static NSString *s_contactName=@"";
static NSString *s_contactNumber=@"";
static NSString *s_message=@"";

// =============

// PUBLIC ====


+(void)Alert : (NSString*) title : (NSString*) message
{
    /*
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title
                                                    message:message
                                                   delegate:nil
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil];
    [alert show];
     */
    
    dispatch_async(dispatch_get_main_queue(), ^{
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title message:message delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [alert show];
    });
}

+(void)ShareText:(NSString *)text
{
/*
    //UIWindow *windows = [[UIApplication sharedApplication].delegate window];
    UIViewController *vc = [[UIApplication sharedApplication] keyWindow].rootViewController;
    
    NSArray *itemsToShare = @[text];
    UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:itemsToShare applicationActivities:nil];
    
    [vc presentViewController:activityVC animated:YES completion:nil];
    */
    
    
    NSArray *postItems  = @[text];
    
    UIWindow *windows = [[UIApplication sharedApplication].delegate window];
    
    UIActivityViewController *activityVc = [[UIActivityViewController alloc] initWithActivityItems:postItems applicationActivities:nil];
    
    
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad &&  [activityVc respondsToSelector:@selector(popoverPresentationController)] ) {
        
        UIPopoverController *popup = [[UIPopoverController alloc] initWithContentViewController:activityVc];
        
        [popup presentPopoverFromRect:CGRectMake(windows.rootViewController.view.frame.size.width/2, windows.rootViewController.view.frame.size.height, 0, 0)
                               inView:[UIApplication sharedApplication].keyWindow.rootViewController.view permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
    }
    else
        [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:activityVc animated:YES completion:nil];
    
}


+(void)ShareImage:(NSString *)text : (UIImage*) img
{
/*
    //UIWindow *windows = [[UIApplication sharedApplication].delegate window];
    UIViewController *vc = [[UIApplication sharedApplication] keyWindow].rootViewController;
    
    NSArray *itemsToShare = @[text, img];
    UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:itemsToShare applicationActivities:nil];
    
    [vc presentViewController:activityVC animated:YES completion:nil];
    */
    
    NSArray *postItems  = @[text, img];
    
    UIWindow *windows = [[UIApplication sharedApplication].delegate window];
    
    UIActivityViewController *activityVc = [[UIActivityViewController alloc] initWithActivityItems:postItems applicationActivities:nil];
    
    
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad &&  [activityVc respondsToSelector:@selector(popoverPresentationController)] ) {
        
        UIPopoverController *popup = [[UIPopoverController alloc] initWithContentViewController:activityVc];
        
        [popup presentPopoverFromRect:CGRectMake(windows.rootViewController.view.frame.size.width/2, windows.rootViewController.view.frame.size.height, 0, 0)
                               inView:[UIApplication sharedApplication].keyWindow.rootViewController.view permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
    }
    else
        [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:activityVc animated:YES completion:nil];
    
}

+(void)MakePhoneCall : (NSString*)number
{
    NSLog(@"call to %@", number);

    NSURL *nsurl = [NSURL URLWithString:[NSString stringWithFormat:@"tel://%@", number]];
    if ([[UIApplication sharedApplication] canOpenURL: nsurl]) {
        [[UIApplication sharedApplication] openURL: nsurl];
    }
    else
    {
        [self Alert: @"FreeHelp" : @"Não é possivel realizar chamadas telefônicas."];
    }
}

+(void)SendSMS: (NSString *)message : (NSString*) toNumber
{
    
    //[self ShowAddConfirmation];
    
    NSString* strToSend = [NSString stringWithFormat:@"sms:%@", toNumber];
    [[UIApplication sharedApplication] openURL: [NSURL URLWithString: strToSend]];
}



// ====================


+ (void)ShowAddConfirmation
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"FreeHelp"
                                                    message:@"Para entrar em contato via WhatsApp, é necessário adicionar o contato. Deseja continuar?"
                                                   delegate:self
                                          cancelButtonTitle:@"NÃO"
                                          otherButtonTitles:@"SIM", nil];
    [alert show];
}

+ (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    switch(buttonIndex) {
        case 0: //"No" pressed
            //do something?
            break;
        case 1: //"Yes" pressed
            [self AddContact:s_contactName:s_contactNumber];
            //[self GetABID:s_contactNumber];
            //[self Alert:@"FreeHelp" : @"Apertei SIM!!"];
            //[self.navigationController popViewControllerAnimated:YES];
            break;
    }
}




// ====================

+(void)OnGetABIDContact : (NSString*) abid
{
    NSLog(@"Value = %@", abid);
    if ([abid isEqualToString:@""])
    {
        [self ShowAddConfirmation];
    }
    else
    {
        NSLog(@"Deu certo!");
        NSString* strToSend = [NSString stringWithFormat:@"whatsapp://send?abid=%@&text=%@", abid, s_message];
        NSURL *whatsappURL = [NSURL URLWithString:strToSend];
        
        if ([[UIApplication sharedApplication] canOpenURL: whatsappURL]) {
            
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 1 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
                // DISPATCH AFTER TIME
                [[UIApplication sharedApplication] openURL: whatsappURL];
            });
            // DISPATCH NOW
            // [[UIApplication sharedApplication] openURL: whatsappURL];
        }
        else
        {
            [self AlertWhatsappNotInstalled];
        }
    }
}

+(void)AlertWhatsappNotInstalled
{
    [self Alert: @"FreeHelp" : @"Não é possivel abrir o aplicativo WhatsApp."];
}

+(void)GetABID : (NSString*) number
{
    NSLog(@"Entrou no GetABID");
    
    CNContactStore *store = [[CNContactStore alloc] init];
    [store requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (granted == YES)
        {
        }
        }];
    
    ABAddressBookRef addressBook = ABAddressBookCreate();
    CFArrayRef all = ABAddressBookCopyArrayOfAllPeople(addressBook);
    CFIndex n = ABAddressBookGetPersonCount(addressBook);
    
    for( int i = 0 ; i < n ; i++ )
    {
        ABRecordRef ref = CFArrayGetValueAtIndex(all, i);
        //NSString *firstName = (NSString *)ABRecordCopyValue(ref, kABPersonFirstNameProperty);
        //NSLog(@"Name %@", firstName);
        
        NSNumber *nsRecordID = [NSNumber numberWithInteger:ABRecordGetRecordID(ref)];
        NSString *recordID = [nsRecordID stringValue];
        
        CFTypeRef phones = ABRecordCopyValue(ref, kABPersonPhoneProperty);
        for(CFIndex j = 0; j < ABMultiValueGetCount(phones); j++)
        {
            
            CFTypeRef phoneNumberRef = ABMultiValueCopyValueAtIndex(phones, j);
            NSString *phoneNumber = (__bridge NSString *)phoneNumberRef;
            CFRelease(phoneNumberRef);
            
            NSLog(@"%@", phoneNumber);
            
            if ([phoneNumber isEqualToString:number])
            {
                NSString* abid = [NSString stringWithFormat:@"%d", ABRecordGetRecordID(ref)];
                if ([abid isEqualToString:@""] == FALSE)
                {
                    [self OnGetABIDContact:abid];
                    return;
                }
            }
        }
    }
    
    [self OnGetABIDContact:@""];
    return;
    
    
    /* NOT WORKING
    //ios 9+
    NSLog(@"GetABID");
    
    CNContactStore *store = [[CNContactStore alloc] init];
    [store requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (granted == YES)
        {
            //keys with fetching properties
            NSArray *keys = @[CNContactFamilyNameKey, CNContactGivenNameKey, CNContactPhoneNumbersKey, CNContactImageDataKey];
            NSString *containerId = store.defaultContainerIdentifier;
            NSPredicate *predicate = [CNContact predicateForContactsInContainerWithIdentifier:containerId];
            NSError *error;
            NSArray *cnContacts = [store unifiedContactsMatchingPredicate:predicate keysToFetch:keys error:&error];
            if (error) {
                NSLog(@"error fetching contacts %@", error);
                [self OnGetABIDContact:@""];
                return;
            }
            else
            {
                for (CNContact *contact in cnContacts) {
                    
                    for (CNLabeledValue *label in contact.phoneNumbers)
                    {
                        NSString *phone = [label.value stringValue];
                        NSLog(@"- %@ -- %@ -- %@", number, phone, contact.identifier);
                        if ([phone isEqualToString:number])
                        {
                            [self OnGetABIDContact:contact.identifier];
                            return;
                        }
                    }
                }
                
                [self OnGetABIDContact:@""];
                return;
            }
        }
        else
        {
            [self OnGetABIDContact:@""];
            return;
        }
    }];
     */
}


+(void)AddContact : (NSString*) name : (NSString*) number
{
    ABAddressBookRef addressBook = ABAddressBookCreate(); // create address book record
    ABRecordRef person = ABPersonCreate(); // create a person
    
    ABMutableMultiValueRef phoneNumberMultiValue  = ABMultiValueCreateMutable(kABMultiStringPropertyType);
    ABMultiValueAddValueAndLabel(phoneNumberMultiValue, (__bridge CFTypeRef)number, kABPersonPhoneMobileLabel, NULL);
    
    ABRecordSetValue(person, kABPersonFirstNameProperty, (__bridge CFTypeRef)name , nil); // first name of the new person
    ABRecordSetValue(person, kABPersonPhoneProperty, phoneNumberMultiValue, nil); // set the phone number property
    ABAddressBookAddRecord(addressBook, person, nil); //add the new person to the record
    
    ABAddressBookSave(addressBook, nil); //save the record
    
    CFRelease(person); // relase the ABRecordRef  variable
    
    [self Alert:@"FreeHelp" : @"Contato adicionado com sucesso! Clique novamente para conversar via WhatsApp."];
}

+(void)SendWhatsappMessage : (NSString*) message : (NSString*) toNumber : (NSString*) contactName;
{
    //NSURL *whatsappURL = [NSURL URLWithString:@"whatsapp://send?abid=123&text=Hello%2C%20World!"];
    
    // CHECK WHATSAPP INSTALLED
    if ([[UIApplication sharedApplication] canOpenURL: [NSURL URLWithString:@"whatsapp://send?text=Hello%2C%20World!"]])
    {
        s_contactName = contactName;
        s_contactNumber = toNumber;
        s_message = message;
        
        [self GetABID:toNumber];
    }
    else
    {
        [self AlertWhatsappNotInstalled];
    }
}



@end


extern "C"
{
    void iOS_MakePhoneCall (const char* number)
    {
        [PhoneUtils MakePhoneCall : [NSString stringWithUTF8String:number]];
    }
    
    void iOS_SendSMS (const char* message, const char* toNumber)
    {
        [PhoneUtils SendSMS : [NSString stringWithUTF8String:message] : [NSString stringWithUTF8String:toNumber]];
    }
    
    void iOS_SendWhatsappMessage (const char* message, const char* toNumber, const char* contactName)
    {
        [PhoneUtils SendWhatsappMessage: [NSString stringWithUTF8String:message]  : [NSString stringWithUTF8String:toNumber] : [NSString stringWithUTF8String:contactName]];
    }
    
    void iOS_ShareText (const char* text)
    {
        [PhoneUtils ShareText : [NSString stringWithUTF8String:text]];
    }
    
    void iOS_ShareImage (const char* text, uint8_t *bytes, int _length)
    {
        //UIImage *yourImage = [UIImage imageWithData: [NSData dataWithBytes: imgData length : sizeof(imgData)]];
        
        /*
        NSUInteger n = (unsigned long)_length;
        NSData *_imgData =[[NSData alloc]initWithBytes:imgData length:n];
        UIImage *img = [[UIImage alloc]initWithData:_imgData];
*/
        NSData *datos = [NSData dataWithBytes:bytes length:_length];
        UIImage *image = [UIImage imageWithData:datos];
        
        [PhoneUtils ShareImage : [NSString stringWithUTF8String:text] : image];
    }
    
    
    void iOS_Alert (const char* title, const char* message)
    {
        [PhoneUtils Alert:[NSString stringWithUTF8String:title] :[NSString stringWithUTF8String:message]];
    }
}
