import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  CardActions,
  Button,
} from "@mui/material";
import { Post } from "../types";
import { motion } from "framer-motion";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ArticleCardProps {
  post: Post;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ post }) => {
  const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  // Formattiamo la data
  const date = post.date
    ? new Date(post.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // Puliamo l'excerpt dai tag HTML per l'anteprima
  const cleanExcerpt = post.excerpt?.rendered.replace(/<[^>]+>/g, "") || "";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ height: "100%" }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4, // Bordi più arrotondati
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)", // Ombra soffice
          overflow: "hidden",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          {imageUrl ? (
            <CardMedia
              component="img"
              image={imageUrl}
              alt={post.title.rendered}
              sx={{
                height: 240,
                objectFit: "cover",
              }}
            />
          ) : (
            <Box
              sx={{
                height: 240,
                bgcolor: "grey.200",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">No Image</Typography>
            </Box>
          )}

          {/* Badge Categoria (se presente) */}
          {post._embedded?.["wp:term"]?.[0]?.[0] && (
            <Chip
              label={post._embedded["wp:term"][0][0].name}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                bgcolor: "white",
                fontWeight: "bold",
                boxShadow: 1,
              }}
              size="small"
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Data */}
          {date && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                color: "text.secondary",
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} />
              <Typography
                variant="caption"
                sx={{ textTransform: "uppercase", fontWeight: 600 }}
              >
                {date}
              </Typography>
            </Box>
          )}

          {/* Titolo */}
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", lineHeight: 1.3 }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Estratto */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mt: 2,
            }}
          >
            {cleanExcerpt}
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            endIcon={<ArrowForwardIcon />}
            sx={{ fontWeight: "bold", textTransform: "none" }}
          >
            Leggi l'articolo
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default ArticleCard;
