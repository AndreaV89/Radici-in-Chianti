import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Post } from "../types";
import { getContentBySlug } from "../api";

interface SinglePostProps {
  postType:
    | "posts"
    | "progetto"
    | "evento"
    | "escursione"
    | "attivita"
    | "alloggio";
}

export default function SinglePost({ postType }: SinglePostProps) {
  const { postSlug } = useParams<{ postSlug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (!postSlug) return;

    const fetchPost = async () => {
      setLoading(true);
      const data = await getContentBySlug(postType, postSlug);
      if (data && data.length > 0) {
        setPost(data[0]);
      }
      setLoading(false);
    };

    fetchPost();
  }, [postSlug, postType]);

  // --- LOGICA DI CONDIVISIONE (NUOVO) ---
  const currentUrl = window.location.href; // L'URL della pagina attuale
  const title = post?.title.rendered || "Guarda questo articolo!";

  const handleShare = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          title + " " + currentUrl
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case "x":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          currentUrl
        )}&text=${encodeURIComponent(title)}`;
        break;
      default:
        return;
    }

    // Apre una nuova finestra popup per la condivisione
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setOpenSnackbar(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container sx={{ my: 10, textAlign: "center" }}>
        <Typography variant="h5">Articolo non trovato.</Typography>
        <Button component={RouterLink} to="/" sx={{ mt: 2 }}>
          Torna alla Home
        </Button>
      </Container>
    );
  }

  // Dati estratti
  const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name;

  // Data formattata
  const date = post.date
    ? new Date(post.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // Stima tempo di lettura (opzionale, calcolato sulle parole)
  const wordCount = post.content.rendered
    .replace(/<[^>]*>/g, "")
    .split(" ").length;
  const readTime = Math.ceil(wordCount / 200); // media di 200 parole al minuto

  return (
    <>
      {/* 1. HERO SECTION DINAMICA */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "40vh", md: "60vh" },
          display: "flex",
          alignItems: "flex-end", // Testo in basso
          backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
          backgroundColor: imageUrl ? "transparent" : "#242424",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          pb: 6,
          // Overlay sfumato per leggere il testo
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          {/* Tasto indietro */}
          <Button
            component={RouterLink}
            to={postType === "posts" ? "/news" : "/"} // Torna alla lista corretta
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "white",
              mb: 4,
              position: "absolute",
              top: -150, // Lo posizioniamo in alto a sinistra
              left: 0,
              backgroundColor: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(4px)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.4)" },
            }}
          >
            Torna indietro
          </Button>

          {/* Categoria */}
          {categoryName && (
            <Chip
              label={categoryName}
              color="primary"
              sx={{ mb: 2, fontWeight: "bold" }}
            />
          )}

          {/* Titolo */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: "bold",
              fontSize: { xs: "2rem", md: "3.5rem" },
              lineHeight: 1.2,
              mb: 2,
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Metadati (Data e Tempo lettura) */}
          <Box
            sx={{ display: "flex", gap: 3, opacity: 0.9, fontSize: "0.9rem" }}
          >
            {date && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
                {date}
              </Box>
            )}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTimeIcon sx={{ fontSize: 18, mr: 1 }} />
              {readTime} min lettura
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 2. CONTENUTO ARTICOLO */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        {/* Questo Box gestisce lo stile dell'HTML grezzo di WordPress */}
        <Box
          className="wordpress-content"
          sx={{
            typography: "body1",
            color: "text.secondary",
            lineHeight: 1.8,
            fontSize: "1.1rem",
            "& p": { mb: 3 },
            "& h2": {
              fontFamily: '"Playfair Display", serif',
              color: "text.primary",
              fontSize: "2rem",
              mt: 6,
              mb: 3,
            },
            "& h3": {
              color: "text.primary",
              fontSize: "1.5rem",
              mt: 4,
              mb: 2,
              fontWeight: "bold",
            },
            "& blockquote": {
              borderLeft: "4px solid #6D1E20",
              pl: 3,
              fontStyle: "italic",
              color: "text.primary",
              my: 4,
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              my: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            },
            "& ul, & ol": {
              mb: 3,
              pl: 4,
            },
            "& li": {
              mb: 1,
            },
            "& a": {
              color: "primary.main",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        <Divider sx={{ my: 6 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Condividi questo articolo
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <Tooltip title="Condividi su WhatsApp">
              <IconButton
                onClick={() => handleShare("whatsapp")}
                color="success"
              >
                <WhatsAppIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Condividi su Facebook">
              <IconButton
                onClick={() => handleShare("facebook")}
                color="primary"
              >
                <FacebookIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Condividi su LinkedIn">
              <IconButton onClick={() => handleShare("linkedin")} color="info">
                <LinkedInIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Condividi su X">
              <IconButton
                onClick={() => handleShare("x")}
                sx={{ color: "black" }}
              >
                <XIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Copia Link">
              <IconButton
                onClick={handleCopyLink}
                sx={{ color: "text.secondary" }}
              >
                <ContentCopyIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ti è piaciuto?
          </Typography>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/news"
            sx={{ borderRadius: "30px", mt: 1 }}
          >
            Leggi altre notizie
          </Button>
        </Box>
      </Container>

      {/* --- SNACKBAR PER NOTIFICA COPIA (NUOVO) --- */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Link copiato negli appunti!
        </Alert>
      </Snackbar>
    </>
  );
}
