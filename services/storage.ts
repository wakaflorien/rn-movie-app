import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_MOVIES_KEY = 'saved_movies';

export const saveMovie = async (movie: Movie) => {
    try {
        const savedMovies = await getSavedMovies();
        if (!savedMovies.some(m => m.id === movie.id)) {
            const updatedMovies = [...savedMovies, movie];
            await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error saving movie:', error);
        return false;
    }
};

export const removeMovie = async (movieId: number) => {
    try {
        const savedMovies = await getSavedMovies();
        const updatedMovies = savedMovies.filter(m => m.id !== movieId);
        await AsyncStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(updatedMovies));
        return true;
    } catch (error) {
        console.error('Error removing movie:', error);
        return false;
    }
};

export const getSavedMovies = async (): Promise<Movie[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(SAVED_MOVIES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Error getting saved movies:', error);
        return [];
    }
};

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
    try {
        const savedMovies = await getSavedMovies();
        return savedMovies.some(m => m.id === movieId);
    } catch (error) {
        console.error('Error checking if movie is saved:', error);
        return false;
    }
};
