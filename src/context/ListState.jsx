import React, { useEffect, useState } from "react";
import listContext from "./listContext";
import axios from "axios";
import db from "../db";
const ListState = ({ children }) => {
    const [darkMode, setdarkMode] = useState(() => {
        const storedMode = localStorage.getItem("darkMode");
        return storedMode === null ? true : storedMode === "true";
      });
    const [shownotification, setshownotification] = useState({ type: "", message: "", status: false })
    const [genres, setGenres] = useState([]);
    const [pageMoviess, setpageMoviess] = useState(null)
    const [filteredPage, setFilteredPage] = useState(1); 
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovie, setSelectMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toggleDrawer, settoggleDrawer] = useState(false)
    const [search, setSearch] = useState("");
    const [open, setopen] = useState(false)
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
      }, [darkMode]);
    const PAGE_LIMIT = 10;

    const API_HEADERS = {
        "x-rapidapi-key": "aa39f7e6b8msh4107bbd7af87009p14fd3bjsn37dd02ea21ed",
        "x-rapidapi-host": "movie-database-api1.p.rapidapi.com",
    };

    const fetchAndCacheAllPages = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "https://movie-database-api1.p.rapidapi.com/list_movies.json",
                {
                    params: { limit: "20", page: 1, sort_by: "date_added" },
                    headers: API_HEADERS,
                }
            );

            const totalMovieCount = response.data?.data?.movie_count || 0;
            const pages = Math.ceil(totalMovieCount / 20);

            for (let i = 1; i <= 5; i++) {
                console.log(`Checking cache for page ${i}...`);
                const reversedCachedMovies = await db.movies.where("page").equals(i).toArray();
                let cachedMovies = reversedCachedMovies.reverse();

                console.log(reversedCachedMovies)

                const apiRes = await axios.get(
                    "https://movie-database-api1.p.rapidapi.com/list_movies.json",
                    {
                        params: { limit: "20", page: i, sort_by: "date_added" },
                        headers: API_HEADERS,
                    }
                );
                console.log(apiRes.data?.data?.movies)
                const moviesPage = apiRes.data?.data?.movies || [];
                const isSameLength = cachedMovies.length === moviesPage.length;
                const isSameContent = isSameLength && cachedMovies.every((cachedMovie, index) => {
                    const apiMovie = moviesPage[index];
                    return (

                        cachedMovie.id === apiMovie.id
                    );
                });

                if (isSameContent) {
                    console.log(`Page ${i} already cached and up to date.`);
                    continue;
                }

                console.log(`Page ${i} has new/changed data. Updating...`);

                // Remove old
                await db.movies.where("page").equals(i).delete();

                // Add updated
                const moviesWithPage = moviesPage.map((movie) => ({
                    ...movie,
                    page: i,
                }));

                await db.movies.bulkPut(moviesWithPage);
            }

            loadAllCachedMovies();
            fetchMoviesgenres();

            setshownotification({
                type: "success",
                message: "Movies fetched and cached successfully.",
                status: true,
            });
        } catch (err) {

            setshownotification({
                type: "error",
                message: "Failed to fetch movies.",
                status: true,
            });
        } finally {
            setLoading(false);
            console.log('object')

        }
    };

    //this section for Serach Filter 

    const handleSearch = async (query) => {
        setSearch(query);
        setSelectedGenre(null);
        setFilteredPage(1);

        const filtered = pageMoviess.filter((movie) =>
            movie.title?.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredMovies(filtered.slice(0, PAGE_LIMIT));
        setTotalPages(Math.ceil(filtered.length / PAGE_LIMIT));
    };
    //this section for Search Filter Pagination
    const paginateFiltered = (pageNum) => {
        setFilteredPage(pageNum);
        const start = (pageNum - 1) * PAGE_LIMIT;
        const end = start + PAGE_LIMIT;
        const filtered = pageMoviess.filter((movie) =>
            movie.title?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredMovies(filtered.slice(start, end));
    };


    //this section for Genres Filter 
    const handleGenreFilter = (genre) => {
        setSelectedGenre(genre);
        setFilteredPage(1);

        const filtered = pageMoviess.filter(movie =>
            movie.genres?.includes(genre)
        );

        setFilteredMovies(filtered.slice(0, PAGE_LIMIT));
        setTotalPages(Math.ceil(filtered.length / PAGE_LIMIT));
    };
//this section for Genres Filter Pagination
    const paginateGenre = (pageNum) => {
        console.log('asdfasdf' + pageNum + selectedGenre)
        setFilteredPage(pageNum);
        const start = (pageNum - 1) * 10;
        const end = start + PAGE_LIMIT;

        const filtered = pageMoviess.filter(movie =>
            movie.genres?.includes(selectedGenre)
        );
        setTotalPages(Math.ceil(filtered.length / PAGE_LIMIT));

        setFilteredMovies(filtered.slice(start, end));

    };




    // Load data from IndexedDB with pagination
    const loadAllCachedMovies = async (pageNum = 1) => {
        fetchMoviesgenres();

        try {
            const totalMovieCount = await db.movies.count();
            const pages = Math.ceil(totalMovieCount / PAGE_LIMIT);
            setTotalPages(pages);

            const offset = (pageNum - 1) * PAGE_LIMIT;
            const pageMovies = await db.movies
                .orderBy("id")
                .offset(offset)
                .limit(PAGE_LIMIT)
                .toArray();

            setFilteredMovies(pageMovies);

        } catch (err) {
            console.error("Error loading cached movies:", err);
        } finally {
            setLoading(false);
        }
    };

    // Refetch movies when page or search changes
    useEffect(() => {
        if (search.trim() === "") {
            loadAllCachedMovies(page); 
        }
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            const allMovies = await db.movies.toArray();
            setpageMoviess(allMovies);
            setFilteredMovies(allMovies); 
        };
        fetchMovies();
    }, [])


        // This function is use for Extract unique genres

    const fetchMoviesgenres = async () => {
        const allMovies = await db.movies.toArray();
        setpageMoviess(allMovies);
        setFilteredMovies(allMovies);

        const genreSet = new Set();
        allMovies.forEach((movie) => {
            movie.genres?.forEach((genre) => genreSet.add(genre));
        });

        setGenres([...genreSet].sort());
    };



    return (
        <listContext.Provider
            value={{
                shownotification, setshownotification,
               handleSearch, paginateFiltered,
                filteredMovies,
                selectedMovie,
                setSelectMovie,
                fetchAndCacheAllPages,
                loadAllCachedMovies,
                loading, paginateGenre,
                page,
                setPage,
                totalPages, handleGenreFilter,
                darkMode,
                setdarkMode,
                search,
                setSearch, genres,
                selectedGenre, toggleDrawer, open, setopen, setSelectedGenre
            }}
        >
            {children}
        </listContext.Provider>
    );
};

export default ListState;
