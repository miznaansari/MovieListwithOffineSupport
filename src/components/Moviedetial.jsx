import React, { useContext } from "react";
import listContext from "../context/listContext";
import { useNavigate } from "react-router";
import { Box, Typography, Stack, Chip, Button } from "@mui/material";

const Moviedetial = () => {
  const { selectedMovie,setSelectMovie } = useContext(listContext);
  const navigate = useNavigate();

  if (!selectedMovie) {
    return (
      <Box p={2} flex={1}  sx={{ display: { xs: "none", md: "none" } }}>
        <Typography variant="h5" color="error">
          No movie selected!
        </Typography>
        <Button onClick={() => navigate("/")}>Go back</Button>
      </Box>
    );
  }

  return (
    <Box p={3} flex={1} position={"sticky"} top={0} >
          <Button onClick={() =>setSelectMovie(!selectedMovie)} variant="contained" color="inherit" sx={{ my: 2 }}>
        Back to Movie List
      </Button>
      <Typography variant="h4" gutterBottom>
        {selectedMovie.title} ({selectedMovie.year})
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Rating: {selectedMovie.rating}
      </Typography>
      <Stack direction="row" spacing={1} mb={2}>
        {selectedMovie.genres.map((genre, index) => (
          <Chip key={index} label={genre} variant="outlined" />
        ))}
      </Stack>
      <Typography variant="body1">{selectedMovie.plot}</Typography>
    
    </Box>
  );
};

export default Moviedetial;
