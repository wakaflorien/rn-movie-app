import { icons } from "@/constants/icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

export default function TabsComponent() {
    const TabsIcon = ({ focused, icon, title }: any) => {
        if (focused) {
            return (
                <View className="flex-row w-12 h-12 justify-center items-center rounded-full bg-accent">
                    <Image source={icon} tintColor="#fff" className="size-5" />
                </View>
            );
        }

        return (
            <View className="justify-center items-center">
                <Image source={icon} tintColor="#A8B5DB" className="size-5" />
            </View>
        );
    }
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "transparent",
                    elevation: 0, // invalid on iOS but good for explicit intent, border handled below
                    borderTopWidth: 0,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 84,
                },
                tabBarBackground: () => (
                    <BlurView
                        intensity={20} // Adjusted intensity for a subtle glass effect
                        tint="systemThinMaterialDark" // Uses native iOS material blur
                        className="overflow-hidden rounded-[50px] mx-[10px] mb-9 h-[84px] border border-white/10 absolute bottom-0 left-0 right-0"
                    />
                ),
            }}>
            <Tabs.Screen
                name={`index`}
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabsIcon focused={focused} icon={icons.home} title={`Home`} />
                    )
                }} />
            <Tabs.Screen
                name={`search`}
                options={{
                    title: "search",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabsIcon focused={focused} icon={icons.search} title={`Search`} />
                    )
                }} />
            <Tabs.Screen
                name={`saved`}
                options={{
                    title: "Saved",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabsIcon focused={focused} icon={icons.save} title={`Saved`} />
                    )
                }} />
            <Tabs.Screen
                name={`profile`}
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabsIcon focused={focused} icon={icons.person} title={`Profile`} />
                    )
                }} />
        </Tabs >
    );
}
