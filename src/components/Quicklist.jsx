import React, { useContext, useState } from "react";
import {
    Box, useMediaQuery,
    Stack,
    Typography,
    IconButton,
    createTheme,
    Button
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import logo from "../assets/logo.png";
import listContext from "../context/listContext";
import CloseIcon from '@mui/icons-material/Close';


const Quicklist = ({ }) => {
    const {darkMode, open,setdarkMode,genres, toggleDrawer,filterByGenre, handleGenreFilter, setopen,selectedGenre, 
        setSearch, setPage, setSelectedGenre, loadAllCachedMovies} = useContext(listContext);
   
    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
    });
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (

        <Box
            sx={{
                position: { xs: "fixed", md: "sticky" },
                top: 0,
                left: 0,
                width: { xs: open ? "100%" : 0, md: 240 },
                overflowX: "hidden",
                height: "100vh",
                bgcolor: "background.default",
                color: "text.primary",
                transition: "width 0.3s ease-in-out",
                zIndex: 1200, overflow: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            }}
>

            {/* Header */}
            <Box display="flex" position={"sticky"} top={0} sx={{ background: theme.palette.background.paper }} zIndex={999} p={2} justifyContent="space-between" alignItems="center" >
                <Box display="flex" alignItems="center" gap={1}>
                    <img src={logo} alt="Logo" width={50} />
                    <Typography variant="h6" fontWeight={700}>
                        MOVIE CLUB
                    </Typography>
                </Box>
                <Button onClick={() => setopen(!open)} variant="contained" color="inherit" sx={{
                    display: isSmallScreen ? "flex" : "none"
                }}>
                    <CloseIcon />
                </Button>
            </Box>

            {/* Toggle Theme */}
            <Box display="flex" justifyContent="space-between" alignItems={"center"} mx={2} >
                <Typography>Toggle Mode</Typography>
                <IconButton onClick={() => setdarkMode(!darkMode)}>
                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
            </Box>

            {/* Genres */}
            <Typography variant="subtitle1" mb={1} mx={2}>
                Select Genre
            </Typography>
            <Stack spacing={1} p={2}>

                {/* This button is for clearing the filter */}
                <Button

                    key={1}
                    variant={"outlined"}
                    onClick={() => {
                        setSearch("");
                        loadAllCachedMovies()
                        setSelectedGenre(null)
                        setopen(!open)
                    }}
                    sx={{
                        textTransform: "none",
                        justifyContent: "flex-start",
                    }}
                >
                    Clear All Filter
                </Button>
                
                {genres.map((genre) => (
                    <Button

                        key={genre}
                        variant={selectedGenre === genre ? "contained" : "outlined"}
                        onClick={() => {
                            handleGenreFilter(genre)
                            setopen(!open)
                        }}
                        sx={{
                            textTransform: "none",
                            justifyContent: "flex-start",
                        }}
                    >
                        {genre}
                    </Button>
                ))}
            </Stack>
        </Box>
    );
};

export default Quicklist;
