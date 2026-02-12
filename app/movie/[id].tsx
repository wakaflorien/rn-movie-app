import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MovieDetailSkeleton } from "@/components/skeletons/MovieDetailSkeleton";
import { icons } from "@/constants/icons";
import useFetch from "@/hooks/useFetch";
import { fetchMovieCast, fetchMovieDetails, fetchMovieSimilar } from "@/services/api";
import { isMovieSaved, removeMovie, saveMovie } from "@/services/storage";

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-normal text-sm">{label}</Text>
        <Text className="text-white font-bold text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);

const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: movie, loading } = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    const { data: cast } = useFetch<Cast[]>(() => fetchMovieCast(id as string));
    const { data: similarMovies } = useFetch<Movie[]>(() => fetchMovieSimilar(id as string));

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (movie?.id) {
            checkSavedStatus();
        }
    }, [movie?.id]);

    const checkSavedStatus = async () => {
        if (movie?.id) {
            const status = await isMovieSaved(movie.id);
            setSaved(status);
        }
    };

    const toggleSave = async () => {
        if (!movie) return;

        if (saved) {
            await removeMovie(movie.id);
            setSaved(false);
            Alert.alert("Success", "Movie removed from favorites");
        } else {
            const movieToSave: Movie = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path || "",
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                adult: movie.adult,
                backdrop_path: movie.backdrop_path || "",
                genre_ids: movie.genres.map(g => g.id),
                original_language: movie.original_language,
                original_title: movie.original_title,
                overview: movie.overview || "",
                popularity: movie.popularity,
                video: movie.video,
                vote_count: movie.vote_count
            };
            await saveMovie(movieToSave);
            setSaved(true);
            Alert.alert("Success", "Movie added to favorites");
        }
    };

    if (loading)
        return (
            <SafeAreaView className="bg-primary flex-1">
                <MovieDetailSkeleton />
            </SafeAreaView>
        );

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                <View>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                        }}
                        className="w-full h-[460px]"
                        resizeMode="cover"
                    />

                    <View className="absolute top-12 flex-row justify-between w-full px-5">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-[#191D29] rounded-full p-2"
                        >
                            <Image
                                source={icons.arrow}
                                className="size-6 rotate-180"
                                tintColor="#fff"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={toggleSave}
                            className="bg-[#191D29] rounded-full p-2"
                        >
                            <Image
                                source={icons.save}
                                className="size-6"
                                tintColor={saved ? "#AB8BFF" : "#fff"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-primary to-transparent bg-[#0F0D23]/70" />
                </View>

                <View className="px-5 -mt-12">
                    <Text className="text-white text-3xl font-bold text-center">
                        {movie?.title}
                    </Text>

                    <View className="flex-row justify-center items-center mt-3 gap-x-2">
                        <Text className="text-white font-bold text-sm">
                            {movie?.vote_average.toFixed(1)}
                        </Text>
                        <Image source={icons.star} className="size-4" />
                        <Text className="text-light-200 text-sm font-medium">
                            {movie?.release_date?.split("-")[0]}
                        </Text>
                        <Text className="text-light-200 text-sm font-medium">
                            {movie?.runtime ? `${movie.runtime}m` : ""}
                        </Text>
                    </View>

                    <View className="flex-row justify-center items-center mt-3 gap-x-2 flex-wrap">
                        {movie?.genres?.map((genre) => (
                            <View
                                key={genre.id}
                                className="px-2 py-1 bg-dark-100 rounded-lg border border-dark-200"
                            >
                                <Text className="text-light-300 text-xs">{genre.name}</Text>
                            </View>
                        ))}
                    </View>

                    <Text className="text-white text-lg font-bold mt-5">Overview</Text>
                    <Text className="text-light-200 text-base mt-2 leading-6">
                        {movie?.overview}
                    </Text>

                    <Text className="text-white text-lg font-bold mt-5">Cast</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 20 }}
                        className="mt-3"
                    >
                        {cast?.map((item) => (
                            <View key={item.id} className="mr-4 items-center w-24">
                                <Image
                                    source={{
                                        uri: `https://image.tmdb.org/t/p/w200${item.profile_path}`,
                                    }}
                                    className="w-20 h-20 rounded-full"
                                    resizeMode="cover"
                                />
                                <Text
                                    className="text-white text-xs mt-2 text-center"
                                    numberOfLines={1}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    className="text-light-300 text-[10px] text-center"
                                    numberOfLines={1}
                                >
                                    {item.character}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>

                    {similarMovies && similarMovies.length > 0 && (
                        <>
                            <Text className="text-white text-lg font-bold mt-5">Similar Movies</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingRight: 20 }}
                                className="mt-3"
                            >
                                {similarMovies.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => router.push(`/movie/${item.id}`)}
                                        className="mr-4 w-32"
                                    >
                                        <Image
                                            source={{
                                                uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                                            }}
                                            className="w-32 h-48 rounded-lg"
                                            resizeMode="cover"
                                        />
                                        <Text
                                            className="text-white text-sm mt-2 font-bold"
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </>
                    )}
                </View>

            </ScrollView>
        </View>
    );
};

export default Details;