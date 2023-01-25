
import React, { useEffect,useRef,memo } from 'react';
import {View,Text, Animated, Easing, ImageBackground,StyleSheet } from 'react-native';
import {
  INPUT_RANGE_START,
  INPUT_RANGE_END,
  OUTPUT_RANGE_START,
  OUTPUT_RANGE_END,
  ANIMATION_TO_VALUE,
  ANIMATION_DURATION, 
} from '../utils/constants';

import mono from '../assets/mono.png';

export default  memo(function Animation(props) {
  const initialValue = 0;
  const translateValue = useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    const translate = () => {
      translateValue.setValue(initialValue);
      Animated.timing(translateValue, {
        toValue: ANIMATION_TO_VALUE,
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => translate());
    };

    translate();
  }, [translateValue]);


  const translateAnimation = translateValue.interpolate({
    inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
    outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
  });
  const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);
  return (
     <AnimatedImage
     resizeMode="repeat" 
     style={[styles.background,{
         transform: [
             {
               translateX: translateAnimation,
             },
             {
               translateY: translateAnimation,
             },
           ],
     }]}
     source={mono}
     />

  )
})

const styles = StyleSheet.create({    
    
  background: {
      position: 'absolute',
      width: 1500,
      height: 1500,
      top: 0,
      opacity: 0.8,
      transform: [
        {
          translateX: 0,
        },
        {
          translateY: 0,
        },
      ],      
    }, 
});