import { images } from "@/constants/images";
import { Image, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
    children: React.ReactNode;
    bgImage?: any;
    className?: string;
}

export const ScreenWrapper = ({ children, bgImage = images.bg, className }: ScreenWrapperProps) => {
    return (
        <SafeAreaView className={`flex-1 bg-primary ${className}`} edges={['top']}>
            <StatusBar barStyle="light-content" />
            <Image source={bgImage} className="absolute w-full h-full" resizeMode="cover" />
            <View className="flex-1 px-5">
                {children}
            </View>
        </SafeAreaView>
    );
};
