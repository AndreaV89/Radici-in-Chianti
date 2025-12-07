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
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Assicurati che sia importato

// --- ICONE SOCIAL ---
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";

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

  // --- LOGICA PER IL TASTO INDIETRO (NUOVO) ---
  const getBackLink = () => {
    switch (postType) {
      case "posts":
        return "/news";
      case "evento":
        return "/eventi";
      case "progetto":
        return "/progetti";
      case "escursione":
        return "/escursioni";
      case "attivita":
        return "/attivita";
      case "alloggio":
        return "/alloggi";
      default:
        return "/";
    }
  };

  // --- LOGICA DI CONDIVISIONE ---
  const handleShare = (platform: string) => {
    const currentUrl = window.location.href;
    const rawTitle =
      post?.title.rendered.replace(/<[^>]*>?/gm, "") || "Radici in Chianti";
    const text = `Guarda questo articolo: "${rawTitle}"`;

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          text + " " + currentUrl
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
        )}&text=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }

    const width = 600;
    const height = 400;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    window.open(
      shareUrl,
      "share",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const handleNativeShare = async () => {
    const currentUrl = window.location.href;
    // Rimuoviamo i tag HTML dal titolo per la condivisione
    const rawTitle =
      post?.title.rendered.replace(/<[^>]*>?/gm, "") || "Radici in Chianti";

    // CORREZIONE QUI: Usiamo 'share' in navigator invece di navigator.share
    if ("share" in navigator) {
      try {
        await navigator.share({
          title: rawTitle,
          text: "Guarda questo contenuto su Radici in Chianti!",
          url: currentUrl,
        });
      } catch (error) {
        console.log("Condivisione annullata o fallita", error);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
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
        <Typography variant="h5">Contenuto non trovato.</Typography>
        <Button component={RouterLink} to="/" sx={{ mt: 2 }}>
          Torna alla Home
        </Button>
      </Container>
    );
  }

  const imageUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name;

  const date = post.date
    ? new Date(post.date).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const wordCount = post.content.rendered
    .replace(/<[^>]*>/g, "")
    .split(" ").length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <>
      {/* HERO SECTION */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "40vh", md: "60vh" },
          display: "flex",
          alignItems: "flex-end",
          backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
          backgroundColor: imageUrl ? "transparent" : "#242424",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          pb: 6,
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
          {/* TASTO INDIETRO DINAMICO */}
          <Button
            component={RouterLink}
            to={getBackLink()} // <--- Usiamo la funzione qui
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "white",
              mb: 4,
              position: "absolute",
              top: -150,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(4px)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.4)" },
            }}
          >
            Torna indietro
          </Button>

          {categoryName && (
            <Chip
              label={categoryName}
              color="primary"
              sx={{ mb: 2, fontWeight: "bold" }}
            />
          )}

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

          <Box
            sx={{
              display: "flex",
              gap: 3,
              opacity: 0.9,
              fontSize: "0.9rem",
              flexWrap: "wrap",
            }}
          >
            {/* SE È UN EVENTO: Mostra Data Evento e Luogo */}
            {postType === "evento" ? (
              <>
                {post.acf?.data_evento && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "rgba(255,255,255,0.2)",
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                    }}
                  >
                    <CalendarTodayIcon sx={{ fontSize: 20, mr: 1 }} />
                    <Typography fontWeight="bold" sx={{ ml: 1 }}>
                      {(() => {
                        const raw = post.acf.data_evento;
                        if (raw.includes("/")) {
                          const [d, m, y] = raw.split("/");
                          const dateObj = new Date(`${y}-${m}-${d}`);
                          return dateObj.toLocaleDateString("it-IT", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          });
                        }
                        // Fallback per formato standard
                        const dateObj = new Date(raw);
                        return !isNaN(dateObj.getTime())
                          ? dateObj.toLocaleDateString("it-IT", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : raw;
                      })()}
                    </Typography>
                  </Box>
                )}
                {post.acf?.luogo && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "rgba(255,255,255,0.2)",
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 20, mr: 1 }} />
                    <Typography fontWeight="bold" sx={{ ml: 1 }}>
                      {post.acf.luogo}
                    </Typography>
                  </Box>
                )}
                {post.acf?.orario && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "rgba(255,255,255,0.2)",
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 20, mr: 1 }} />
                    <Typography fontWeight="bold" sx={{ ml: 1 }}>
                      {post.acf.orario}
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              /* ALTRIMENTI (ARTICOLI, NEWS ECC) */
              <>
                {date && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, mr: 1 }} />
                    Pubblicato il: {date}
                  </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTimeIcon sx={{ fontSize: 18, mr: 1 }} />
                  {readTime} min lettura
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* CONTENUTO ARTICOLO */}
      <Container maxWidth="md" sx={{ py: 8 }}>
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
            "& ul, & ol": { mb: 3, pl: 4 },
            "& li": { mb: 1 },
            "& a": {
              color: "primary.main",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        <Divider sx={{ my: 6 }} />

        {/* SEZIONE CONDIVISIONE */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Condividi questo contenuto
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 4, flexWrap: "wrap", gap: 1 }}
          >
            {"share" in navigator && (
              <Tooltip title="Condividi">
                <IconButton
                  onClick={handleNativeShare}
                  sx={{ bgcolor: "action.hover", color: "text.primary" }}
                >
                  <ShareIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="WhatsApp">
              <IconButton
                onClick={() => handleShare("whatsapp")}
                color="success"
              >
                <WhatsAppIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Facebook">
              <IconButton
                onClick={() => handleShare("facebook")}
                color="primary"
              >
                <FacebookIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="LinkedIn">
              <IconButton onClick={() => handleShare("linkedin")} color="info">
                <LinkedInIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="X (Twitter)">
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

          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to={getBackLink()} // Rimanda alla lista corretta anche da qui
            sx={{ borderRadius: "30px", mt: 1 }}
          >
            Torna alla lista
          </Button>
        </Box>
      </Container>

      {/* SNACKBAR */}
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
