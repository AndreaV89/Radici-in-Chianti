import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button, // <--- Importiamo il Button
} from "@mui/material";
import { Link } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import { Post } from "../types";
import { getPosts } from "../api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Icona per il tasto

export default function News() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Stati per la paginazione
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // C'è altro da caricare?
  const [loadingMore, setLoadingMore] = useState(false); // Spinner del bottone

  const POSTS_PER_PAGE = 12;

  // Caricamento iniziale
  useEffect(() => {
    const fetchInitialPosts = async () => {
      const data = await getPosts(
        "posts",
        `per_page=${POSTS_PER_PAGE}&page=1&_embed=true`
      );
      if (data) {
        setPosts(data);
        // Se riceviamo meno post del richiesto, significa che sono finiti
        if (data.length < POSTS_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
      setLoading(false);
    };
    fetchInitialPosts();
  }, []);

  // Funzione per caricare la pagina successiva
  const handleLoadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;

    const data = await getPosts(
      "posts",
      `per_page=${POSTS_PER_PAGE}&page=${nextPage}&_embed=true`
    );

    if (data && data.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...data]); // Aggiungiamo i nuovi ai vecchi
      setPage(nextPage);

      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false); // Non c'è altro da caricare
      }
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* SEZIONE HERO */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "300px", md: "400px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: 'url("/images/news.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          mb: 6,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontSize: { xs: "2.5rem", md: "4rem" },
            }}
          >
            Dal Nostro Blog
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 300, maxWidth: "700px", mx: "auto" }}
          >
            Rimani sempre aggiornato con le ultime novità, storie e
            approfondimenti dal territorio del Chianti.
          </Typography>
        </Container>
      </Box>

      {/* GRIGLIA NEWS */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Grid container spacing={4}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                <Link
                  to={`/news/${post.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <ArticleCard post={post} />
                </Link>
              </Grid>
            ))
          ) : (
            <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Nessuna notizia da mostrare al momento.
              </Typography>
            </Box>
          )}
        </Grid>

        {/* PULSANTE CARICA ALTRI */}
        {hasMore && posts.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleLoadMore}
              disabled={loadingMore}
              startIcon={
                loadingMore ? (
                  <CircularProgress size={20} />
                ) : (
                  <ExpandMoreIcon />
                )
              }
              sx={{
                borderRadius: "30px",
                px: 4,
                py: 1.5,
                borderWidth: 2,
                fontWeight: "bold",
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              {loadingMore ? "Caricamento..." : "Carica altri articoli"}
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}
