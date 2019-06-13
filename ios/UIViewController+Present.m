//
//  UIViewController+Present.m
//  TestChangeAppIcon
//
//  Created by Sangxiedong on 2018/12/3.
//  Copyright © 2018年 ZB. All rights reserved.
//

#import "UIViewController+Present.h"
#import <objc/runtime.h>

@implementation UIViewController (Present)
+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Method presentM = class_getInstanceMethod(self.class, @selector(presentViewController:animated:completion:));
        Method presentSwizzlingM = class_getInstanceMethod(self.class, @selector(ZB_presentViewController:animated:completion:));
        // 交换方法
        method_exchangeImplementations(presentM, presentSwizzlingM);
    });
}

- (void)ZB_presentViewController:(UIViewController *)viewControllerToPresent animated:(BOOL)animation completion:(void (^)(void))completion {
  
     // 查看无弹框的打开这个注释
    if ([viewControllerToPresent isKindOfClass:[UIAlertController class]]) {
        UIAlertController *alertController = (UIAlertController *)viewControllerToPresent;
        NSLog(@"==== title == %@", alertController.title);
        NSLog(@"==== message == %@", alertController.message);
        if (alertController.title == nil && alertController.message == nil) {
            return;
        }else {
            [self ZB_presentViewController:viewControllerToPresent animated:animation completion:completion];
        }
    }
  
}


@end
