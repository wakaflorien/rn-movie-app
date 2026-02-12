import { ScreenWrapper } from "@/components/common/ScreenWrapper";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMovies = async (query: string, pageNum: number) => {
        try {
            setLoading(true);
            setError(null);

            const results = await fetchMovies({ query, page: pageNum });

            if (results.length > 0) {
                if (pageNum === 1) {
                    setMovies(results);
                } else {
                    setMovies(prev => [...prev, ...results]);
                }

                // Update search count for the first result if it's the first page
                if (pageNum === 1 && results[0]) {
                    updateSearchCount(query, results[0]);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error("An unknown error occurred"));
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                setPage(1);
                setHasMore(true);
                loadMovies(searchQuery, 1);
            } else {
                setMovies([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleLoadMore = () => {
        if (!loading && hasMore && searchQuery.trim()) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadMovies(searchQuery, nextPage);
        }
    };

    return (
        <ScreenWrapper className="px-0">
            <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item, index) => `${item.id}-${index}`}
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
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={
                    <View className="mb-5">
                        <View className="w-full flex-row justify-center items-center mt-5 mb-5">
                            <Image source={icons.logo} className="w-12 h-10" />
                        </View>
                        <SearchBar
                            placeholder="Search movies ..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="mb-5"
                        />
                        {loading && page === 1 && <ActivityIndicator size="large" color="#AB8BFF" />}
                        {error && <Text className="text-red-500 text-center">Error: {error.message}</Text>}

                        {!loading && !error && searchQuery.trim() && movies.length > 0 && (
                            <Text className="text-xl text-white font-bold mb-3">
                                Search Results for <Text className="text-accent">{searchQuery}</Text>
                            </Text>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-light-200">
                                {searchQuery.trim() ? 'No movies found' : 'Search for movies'}
                            </Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    loading && page > 1 ? <ActivityIndicator size="small" color="#AB8BFF" className="mt-5" /> : null
                }
            />
        </ScreenWrapper>
    )
}

export default Search;