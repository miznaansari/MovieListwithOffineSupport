import React, { useContext, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Card,
    useMediaQuery,
    CardContent, Snackbar, Alert,
    Chip,
    Stack,
    Fade,
    Button,
    CircularProgress,
    createTheme,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { motion } from "framer-motion";
import listContext from "../context/listContext";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
const Movielist = () => {
    const {
        movies, setSearch, search, setSelectMovie, fetchAndCacheAllPages, loading, loadAllCachedMovies, handleSearch, paginateFiltered,
        selectedGenre, page, setPage, darkMode, paginateGenre, totalPages, selectedMovie, filteredMovies, setopen, open, shownotification, setshownotification } = useContext(listContext);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
    });

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const handlePageChange = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);

            if (search.trim() !== "") {
                paginateFiltered(newPage); // paginate search results
            } else if (selectedGenre) {
                console.log(selectedGenre)

                paginateGenre(newPage); // paginate genre results
            } else {
                await loadAllCachedMovies(newPage); // fetch normal movies
            }
        }
    };



    const renderPageNumbers = () => {
        const pages = [];
        const end = totalPages;
        const middlePages = [page, page + 1].filter((p) => p <= end);

        middlePages.forEach((p) => {
            pages.push(
                <Button
                    key={p}
                    variant={page === p ? "contained" : "outlined"}
                    onClick={() => handlePageChange(p)}
                    size="small"
                    sx={{ mx: 0.5 }}
                >
                    {p}
                </Button>
            );
        });

        if (middlePages[middlePages.length - 1] < end - 1) {
            pages.push(
                <Box key="dots" mx={0.5} fontSize="1rem">
                    ...
                </Box>
            );
        }

        if (!middlePages.includes(end)) {
            pages.push(
                <Button
                    key={end}
                    variant={page === end ? "contained" : "outlined"}
                    onClick={() => handlePageChange(end)}
                    size="small"
                    sx={{ mx: 0.5 }}
                >
                    {end}
                </Button>
            );
        }

        return pages;
    };

    return (
        <Box
            height={"100vh"}
            flex={1}
            overflow={"auto"}
            sx={{
                display: selectedMovie ? "none" : "block",
                overflow: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            }}
        >
            <Box
                component={"div"}
                position="sticky"
                p={3}
                top={0}
                bgcolor="background.paper"
                zIndex={999}
            >
                <Snackbar
                    open={shownotification.status}
                    autoHideDuration={3000}
                    severity={shownotification.type}
                    onClose={() => setshownotification({ ...shownotification, status: false })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert severity={shownotification.type} variant="filled" sx={{ width: '100%' }}>
                        {shownotification.message}
                    </Alert>
                </Snackbar>
                <Box
                    component={"div"}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button onClick={() => setopen(!open)} sx={{
                        display: isSmallScreen ? "flex" : "none"
                    }} variant="contained" color="inherit">
                        <MenuIcon />
                    </Button>
                    <Typography variant={isSmallScreen ? 'h6' : 'h4'} fontWeight="bold" mb={1}>
                        Movie List
                    </Typography>
                    <Button onClick={() => fetchAndCacheAllPages(page)} variant="contained" color="inherit" disabled={loading}>
                        {loading ? <CircularProgress size={20} /> : "Get Movies"}
                    </Button>
                </Box>

                <TextField
                    sx={{ mt: 2 }}
                    fullWidth
                    label="Search by title..."
                    variant="outlined"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </Box>

            <Stack spacing={1} p={1}>
                {filteredMovies.length > 0 ? (
                    filteredMovies.map((movie, index) => (

                        <Card key={index}
                            elevation={selectedMovie?.id === movie.id ? 24 : 2}
                            onClick={() => setSelectMovie(movie)}
                        >
                            <CardContent>
                                <Typography variant="p">
                                    {movie.title} ({movie.year})
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Rating: {movie.rating}
                                </Typography>
                                <Stack direction="row" spacing={1} mb={1}>
                                    {movie.genres.map((genre, idx) => (
                                        <Chip key={idx} label={genre} variant="outlined" />
                                    ))}
                                </Stack>
                                <Typography variant="body2">{movie.plot}</Typography>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Fade in>
                        <Typography color="text.secondary" align="center">
                            No movies found
                        </Typography>
                    </Fade>
                )}
            </Stack>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" alignItems="center" my={4} flexWrap="wrap">
                <Button
                    variant="outlined"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    size="small"
                    sx={{ mx: 0.5 }}
                >
                    {isSmallScreen ? <ArrowBackIosNewIcon fontSize="small" /> : "Previous"}
                </Button>


                {renderPageNumbers()}

                <Button
                    variant="outlined"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    size="small"
                    sx={{ mx: 0.5 }}
                >
                    {isSmallScreen ? <ArrowForwardIosIcon fontSize="small" /> : "Next"}
                </Button>

            </Box>
        </Box>
    );
};

export default Movielist;
