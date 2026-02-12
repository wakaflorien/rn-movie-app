import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { ErrorState } from "@/components/common/ErrorState";
import { ScreenWrapper } from "@/components/common/ScreenWrapper";

import { MovieCardSkeleton } from "@/components/skeletons/MovieCardSkeleton";
import { icons } from "@/constants/icons";
import useFetch from "@/hooks/useFetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

export default function Index() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const {
        data: trendingMovies,
        loading: trendingLoading,
        error: trendingError,
        refetch: refetchTrending
    } = useFetch(getTrendingMovies);

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
        refetch: refetchMovies
    } = useFetch(() => fetchMovies({ query: '' }));

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([refetchTrending(), refetchMovies()]);
        setRefreshing(false);
    }, [refetchTrending, refetchMovies]);

    const isLoading = trendingLoading || moviesLoading;
    const isError = trendingError || moviesError;

    // ... inside component
    if (isLoading && !refreshing) {
        return (
            <ScreenWrapper>
                <View className="flex-row flex-wrap justify-between mt-20">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <MovieCardSkeleton key={index} />
                    ))}
                </View>
            </ScreenWrapper>
        );
    }

    if (isError) {
        return (
            <ScreenWrapper>
                <ErrorState
                    message={moviesError?.message || trendingError?.message}
                    onRetry={onRefresh}
                />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper className="px-0">
            {/* added px-0 to override default padding because FlatList needs full width for column spacing logic if needed, 
            but kept standard padding in header/footer if preferred. 
            Actually, let's keep consistent padding. ScreenWrapper has px-5. 
            If I want FlatList to handle padding, I should remove it from ScreenWrapper or override.
            Let's override className="px-0" and add padding to FlatList contentContainer. */}

            <Image source={icons.logo} className="w-12 h-10 mt-5 mb-5 mx-auto self-center" />

            <FlatList
                data={movies}
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#AB8BFF" />
                }
                ListHeaderComponent={() => (
                    <View className="mb-5">
                        <SearchBar
                            onPress={() => router.push('/search')}
                            placeholder="Search for a movie"
                            className="mb-8"
                        />

                        {trendingMovies && trendingMovies.length > 0 && (
                            <View className="mb-8">
                                <Text className="text-lg text-white font-bold mb-3">
                                    Popular Movies
                                </Text>

                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={trendingMovies}
                                    renderItem={({ item, index }) => (
                                        <TrendingCard movie={item} index={index} />
                                    )}
                                    keyExtractor={(item) => item.movie_id.toString()}
                                    ItemSeparatorComponent={() => <View className="w-6" />}
                                    contentContainerStyle={{ paddingRight: 20 }}
                                />
                            </View>
                        )}

                        <Text className="text-lg text-white font-bold mb-3">
                            Latest Movies
                        </Text>
                    </View>
                )}
            />
        </ScreenWrapper>
    );
}
