import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useFetch from "@/hooks/useFetch";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const Search = () => {

    const [searchQuery, setSearchQuery] = useState("");

    const { data, loading, error, refetch, reset } = useFetch(() => fetchMovies({ query: searchQuery }), false);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    useEffect(() => {
        const searchDebounce = setTimeout(async () => {
            if (searchQuery) {
                await refetch();
            } else {
                reset();
            }
        }, 500);

        return () => clearTimeout(searchDebounce);

    }, [searchQuery])

    useEffect(() => {
        if (data?.length! > 0 && data?.[0]) {
            updateSearchCount(searchQuery, data[0]);
        }

    }, [data])


    return (
        <View className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full" />

            <FlatList
                data={data}
                renderItem={({ item }) => <MovieCard {...item} />} keyExtractor={item => item.id.toString()} numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <>
                        <View className="w-full flex-row justify-center items-center mt-20">
                            <Image source={icons.logo} className="w-12 h-10" />
                        </View>

                        <View className="my-5">
                            <SearchBar
                                onPress={() => fetchMovies}
                                placeholder="Search movies ..."
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />

                            {loading && (
                                <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
                            )}

                            {error && (<Text className="text-red-500">Error: {error?.message}</Text>)}

                            {!loading &&
                                !error &&
                                searchQuery.trim() &&
                                data?.length! > 0 && (
                                    <Text className="text-xl text-white font-bold">
                                        Search Results for{" "}
                                        <Text className="text-accent">{searchQuery}</Text>
                                    </Text>
                                )}
                        </View>
                    </>
                }
                ListEmptyComponent={
                    !error && !loading ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                {searchQuery.trim() ? 'No movies found' : 'Search for movies'}
                            </Text>
                        </View>
                    ) : null
                }
            />

        </View>
    )
}

export default Search;