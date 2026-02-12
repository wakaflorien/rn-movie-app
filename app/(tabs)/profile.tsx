import { icons } from "@/constants/icons";
import { getSavedMovies } from "@/services/storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItemProps {
    icon: any;
    title: string;
    onPress?: () => void;
    isDestructive?: boolean;
}

const SettingsItem = ({ icon, title, onPress, isDestructive = false }: SettingsItemProps) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center p-4 bg-[#191D29] rounded-xl border border-dark-200"
    >
        <View className="p-2 bg-dark-100 rounded-full mr-4">
            <Image source={icon} className="size-5" tintColor={isDestructive ? "#FF4B4B" : "#AB8BFF"} />
        </View>
        <Text className={`text-base font-semibold flex-1 ${isDestructive ? "text-[#FF4B4B]" : "text-white"}`}>
            {title}
        </Text>
        <Image source={icons.arrow} className="size-5" tintColor="#A8B5DB" />
    </TouchableOpacity>
);

const Profile = () => {
    const [savedCount, setSavedCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const fetchCount = async () => {
                const movies = await getSavedMovies();
                setSavedCount(movies.length);
            };
            fetchCount();
        }, [])
    );

    return (
        <SafeAreaView className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 20 }}>
                <Text className="text-white text-2xl font-bold mt-5 mb-8">Profile</Text>

                <View className="items-center">
                    <View className="size-24 rounded-full bg-dark-100 justify-center items-center border border-dark-200 mb-4">
                        <Image source={icons.person} className="size-12" tintColor="#AB8BFF" />
                    </View>
                    <Text className="text-white text-xl font-bold">John Doe</Text>
                    <Text className="text-light-200 text-sm">@johndoe</Text>
                </View>

                <View className="flex-row justify-between mt-8 bg-[#191D29] rounded-2xl p-5 border border-dark-200">
                    <View className="items-center flex-1">
                        <Text className="text-white text-lg font-bold">{savedCount}</Text>
                        <Text className="text-light-300 text-xs">Saved</Text>
                    </View>
                    <View className="w-[1px] bg-dark-200 h-full" />
                    <View className="items-center flex-1">
                        <Text className="text-white text-lg font-bold">124</Text>
                        <Text className="text-light-300 text-xs">Watched</Text>
                    </View>
                    <View className="w-[1px] bg-dark-200 h-full" />
                    <View className="items-center flex-1">
                        <Text className="text-white text-lg font-bold">4.8</Text>
                        <Text className="text-light-300 text-xs">Rating</Text>
                    </View>
                </View>

                <View className="mt-8 gap-y-4">
                    <SettingsItem icon={icons.person} title="Account Info" />
                    <SettingsItem icon={icons.save} title="Saved Movies" />
                    <SettingsItem icon={icons.play} title="Watch History" />
                    <SettingsItem icon={icons.star} title="My Reviews" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;