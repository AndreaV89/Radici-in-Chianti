import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        overflow: "hidden",
        textAlign: "center", // Centra il testo all'interno del contenitore
      }}
    >
      {/* Video di sfondo (rimane invariato) */}
      <Box
        component="video"
        src="/hero-prova.mp4"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          objectFit: "cover",
          zIndex: -1,
          filter: "brightness(0.6)",
        }}
      />
      <motion.div style={{ y, opacity }}>
        {/* Contenitore per il testo e il pulsante */}
        <Box>
          <Typography
            variant="h1" // Usiamo h1 per il titolo principale, più grande
            component="h1"
            fontWeight="bold"
            sx={{ textShadow: "2px 2px 8px rgba(0,0,0,0.8)", my: 2 }} // my: 2 aggiunge margine sopra e sotto
          >
            Radici in Chianti
          </Typography>
          <Typography
            variant="h5" // Aumentiamo la dimensione da h6 a h5
            component="p"
            sx={{
              textShadow: "1px 1px 6px rgba(0,0,0,0.9)", // Ombra più definita
              textTransform: "uppercase", // Tutto maiuscolo per più impatto
              letterSpacing: "1.5px", // Leggera spaziatura tra le lettere
              fontWeight: 400, // Aumentiamo leggermente il peso del font
            }}
          >
            passato e presente, radici del futuro
          </Typography>

          <Button
            variant="outlined"
            color="inherit" // Usa il colore del testo (bianco)
            component={Link}
            to="/chi-siamo"
            size="large"
            sx={{
              mt: 3, // Margine superiore
              borderColor: "white",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "white",
              },
            }}
          >
            Scopri chi siamo
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Hero;
