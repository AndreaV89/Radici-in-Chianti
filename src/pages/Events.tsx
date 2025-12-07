import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import { Post } from "../types";
import { getPosts } from "../api";

import ViewListIcon from "@mui/icons-material/ViewList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// --- FUNZIONE DI AIUTO PER LE DATE ACF ---
// Questa funzione trasforma "20241225" in un oggetto Date valido
const parseAcfDate = (dateStr: string | undefined): Date | null => {
  if (!dateStr) return null;

  // Se c'è lo slash /, assumiamo sia gg/mm/aaaa
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/");
    // Ricostruiamo in formato ISO: aaaa-mm-gg
    return new Date(`${year}-${month}-${day}`);
  }

  // Fallback per altri formati (es. standard di WordPress)
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

export default function Events() {
  const [events, setEvents] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getPosts("evento", "per_page=50&_embed=true");
      if (data) {
        // Debug: vediamo cosa arriva in console
        console.log("Eventi caricati:", data);
        setEvents(data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // FILTRO: Solo eventi futuri o di oggi
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignoriamo l'ora per il confronto

    return events
      .filter((event) => {
        const eventDate = parseAcfDate(event.acf?.data_evento);

        // Se la data non è valida, per sicurezza mostriamo l'evento (o nascondilo con false)
        if (!eventDate) return false;

        return eventDate >= today;
      })
      .sort((a, b) => {
        const dateA = parseAcfDate(a.acf?.data_evento)?.getTime() || 0;
        const dateB = parseAcfDate(b.acf?.data_evento)?.getTime() || 0;
        return dateA - dateB;
      });
  }, [events]);

  useEffect(() => {
    console.log(upcomingEvents);
  }, [upcomingEvents]);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let startingDay = firstDay.getDay() - 1;
    if (startingDay === -1) startingDay = 6;

    const monthName = currentDate.toLocaleString("it-IT", {
      month: "long",
      year: "numeric",
    });
    const blanks = Array(startingDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalSlots = [...blanks, ...days];

    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <IconButton
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{ textTransform: "capitalize", fontWeight: "bold" }}
          >
            {monthName}
          </Typography>
          <IconButton
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        <Grid container spacing={1} sx={{ mb: 1 }}>
          {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((day) => (
            <Grid
              size={{ xs: 1.7 }}
              key={day}
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              {day}
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1}>
          {totalSlots.map((day, index) => {
            if (!day) return <Grid size={{ xs: 1.7 }} key={`blank-${index}`} />;

            // Filtra eventi per questo giorno specifico usando la nostra funzione parse
            const daysEvents = events.filter((e) => {
              const d = parseAcfDate(e.acf?.data_evento);
              return (
                d &&
                d.getDate() === day &&
                d.getMonth() === month &&
                d.getFullYear() === year
              );
            });

            const hasEvent = daysEvents.length > 0;

            return (
              <Grid size={{ xs: 1.7 }} key={day}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    minHeight: "80px",
                    p: 0.5,
                    bgcolor: hasEvent ? "primary.light" : "background.paper",
                    color: hasEvent ? "white" : "text.primary",
                    overflow: "hidden",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {day}
                  </Typography>
                  {daysEvents.map((ev) => (
                    <Link
                      to={`/eventi/${ev.slug}`}
                      key={ev.id}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: "-webkit-box", // Per gestire il taglio su più righe
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2, // Mostra massimo 2 righe
                          fontSize: "0.65rem",
                          lineHeight: 1.1,
                          mt: 0.5,
                          color: "white",
                          bgcolor: "primary.main",
                          p: 0.5,
                          borderRadius: 1,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                        // Questa proprietà fa la magia: interpreta i caratteri HTML (come &#8211;)
                        dangerouslySetInnerHTML={{ __html: ev.title.rendered }}
                      />
                    </Link>
                  ))}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    );
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: "list" | "calendar"
  ) => {
    if (nextView !== null) {
      setViewMode(nextView);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h3" component="h1">
          Prossimi Eventi
        </Typography>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="modalità visualizzazione"
        >
          <ToggleButton value="list" aria-label="lista">
            <ViewListIcon sx={{ mr: 1 }} /> Lista
          </ToggleButton>
          <ToggleButton value="calendar" aria-label="calendario">
            <CalendarMonthIcon sx={{ mr: 1 }} /> Calendario
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <hr />

      {viewMode === "calendar" && renderCalendar()}

      {viewMode === "list" && (
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Link
                  to={`/eventi/${event.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <EventCard event={event} />
                </Link>
              </Grid>
            ))
          ) : (
            <Typography sx={{ p: 4, width: "100%", textAlign: "center" }}>
              Non ci sono eventi futuri in programma.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
}
