import * as React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

export const CustomTabBarButton = React.memo((props: any) => (
  <TouchableWithoutFeedback {...props} android_ripple={{ borderless: true }}>
    <View style={props.style}>{props.children}</View>
  </TouchableWithoutFeedback>
));
