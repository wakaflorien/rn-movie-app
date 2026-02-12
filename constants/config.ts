export const CONFIG = {
    API: {
        BASE_URL: 'https://api.themoviedb.org/3',
        IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
        PLACEHOLDER_IMAGE: 'https://placehold.co/600x400/1a1a1a/FFFFFF.png',
    },
    HEADERS: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_ACCESS_TOKEN}`,
    }
};
