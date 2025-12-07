import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import { Post } from "../types";
import { motion } from "framer-motion";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

interface EventCardProps {
  event: Post;
}

// Stessa funzione di aiuto (si potrebbe spostare in un file utils.ts in futuro)
const parseAcfDate = (dateStr: string | undefined): Date | null => {
  if (!dateStr) return null;
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }
  return new Date(dateStr);
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const imageUrl = event._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  // USIAMO LA NUOVA FUNZIONE
  const dateObj = parseAcfDate(event.acf?.data_evento);

  let day = "--";
  let month = "---";
  let fullDate = "";

  if (dateObj && !isNaN(dateObj.getTime())) {
    day = dateObj.getDate().toString().padStart(2, "0");
    month = dateObj.toLocaleString("it-IT", { month: "short" }).toUpperCase();
    fullDate = dateObj.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ height: "100%" }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.3s ease",
          "&:hover": { boxShadow: "0 8px 20px rgba(0,0,0,0.12)" },
        }}
      >
        <Box sx={{ position: "relative", height: 200 }}>
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={event.title.rendered}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box sx={{ width: "100%", height: "100%", bgcolor: "grey.300" }} />
          )}

          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              width: 60,
              height: 60,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{ bgcolor: "primary.main", width: "100%", height: "20px" }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                lineHeight: 1,
                mt: 0.5,
              }}
            >
              {month}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", lineHeight: 1 }}>
              {day}
            </Typography>
          </Paper>

          {event._embedded?.["wp:term"]?.[0]?.[0] && (
            <Chip
              label={event._embedded["wp:term"][0][0].name}
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(255,255,255,0.9)",
                fontWeight: "bold",
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography
            variant="caption"
            color="primary"
            sx={{
              display: "block",
              mb: 0.5,
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {fullDate}
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", lineHeight: 1.2, minHeight: "3em" }}
            dangerouslySetInnerHTML={{ __html: event.title.rendered }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              color: "text.secondary",
            }}
          >
            <LocationOnIcon
              fontSize="small"
              sx={{ mr: 0.5, color: "primary.main" }}
            />
            <Typography variant="body2" noWrap>
              {event.acf?.luogo || "Luogo da definire"}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="outlined"
            endIcon={<EventAvailableIcon />}
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Scopri Evento
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default EventCard;
