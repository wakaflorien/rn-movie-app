import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3; // 60 = paddingHorizontal (20) + gap (20) * 2

const SkeletonItem = ({ style }: { style: any }) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 1000 }),
                withTiming(0.3, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return <Animated.View style={[style, animatedStyle, { backgroundColor: '#221F3D' }]} />;
};

export const MovieCardSkeleton = () => {
    return (
        <View style={{ width: cardWidth, marginBottom: 20 }}>
            <SkeletonItem style={{ width: '100%', height: 208, borderRadius: 8, marginBottom: 8 }} />
            <SkeletonItem style={{ width: '80%', height: 16, borderRadius: 4 }} />
        </View>
    );
};
