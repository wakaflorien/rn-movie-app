import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";

import MovieCard from "@/components/MovieCard";
import { Loading } from "@/components/common/Loading";
import { ScreenWrapper } from "@/components/common/ScreenWrapper";
import { icons } from "@/constants/icons";
import { getSavedMovies } from "@/services/storage";

const Save = () => {
    const router = useRouter();
    const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            fetchSavedMovies();
        }, [])
    );

    const fetchSavedMovies = async () => {
        setLoading(true);
        const movies = await getSavedMovies();
        setSavedMovies(movies);
        setLoading(false);
    };

    if (loading) {
        return (
            <ScreenWrapper>
                <Loading />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper className="px-0">
            <View className="px-5 mb-5 mt-5">
                <Text className="text-white text-2xl font-bold">Saved Movies</Text>
            </View>

            {savedMovies.length === 0 ? (
                <View className="flex justify-center items-center flex-1 flex-col gap-5">
                    <Image source={icons.save} className="size-10" tintColor="#fff" />
                    <Text className="text-light-200 text-base">No saved movies yet</Text>
                </View>
            ) : (
                <FlatList
                    data={savedMovies}
                    renderItem={({ item }) => <MovieCard {...item} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: "flex-start",
                        gap: 20,
                        marginBottom: 20,
                    }}
                    contentContainerStyle={{
                        paddingBottom: 20,
                        paddingHorizontal: 20,
                    }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </ScreenWrapper>
    );
};

export default Save;