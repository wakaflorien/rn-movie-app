import { ActivityIndicator, View } from "react-native";

export const Loading = ({ size = "large" }: { size?: "small" | "large" }) => {
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size={size} color="#AB8BFF" />
        </View>
    );
};
