import { Text, TouchableOpacity, View } from "react-native";

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export const ErrorState = ({ message = "Something went wrong", onRetry }: ErrorStateProps) => {
    return (
        <View className="flex-1 justify-center items-center p-5">
            <Text className="text-red-500 text-lg font-bold text-center mb-4">{message}</Text>
            {onRetry && (
                <TouchableOpacity
                    onPress={onRetry}
                    className="bg-accent px-6 py-3 rounded-full"
                >
                    <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
