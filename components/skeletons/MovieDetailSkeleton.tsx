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

const SkeletonItem = ({ style, className }: { style?: any, className?: string }) => {
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

    return <Animated.View style={[style, animatedStyle, { backgroundColor: '#221F3D' }]} className={className} />;
};

export const MovieDetailSkeleton = () => {
    return (
        <View className="flex-1 bg-primary">
            {/* Poster */}
            <SkeletonItem style={{ width: '100%', height: 550 }} />

            <View className="px-5 mt-5">
                {/* Title */}
                <SkeletonItem style={{ width: '70%', height: 30, borderRadius: 8, marginBottom: 10 }} />

                {/* Meta info row */}
                <View className="flex-row gap-2 mb-4">
                    <SkeletonItem style={{ width: 60, height: 20, borderRadius: 4 }} />
                    <SkeletonItem style={{ width: 40, height: 20, borderRadius: 4 }} />
                </View>

                {/* Rating */}
                <SkeletonItem style={{ width: 120, height: 30, borderRadius: 8, marginBottom: 20 }} />

                {/* Info blocks */}
                <SkeletonItem style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 20 }} />
                <SkeletonItem style={{ width: '100%', height: 60, borderRadius: 8, marginBottom: 20 }} />
            </View>
        </View>
    );
};
