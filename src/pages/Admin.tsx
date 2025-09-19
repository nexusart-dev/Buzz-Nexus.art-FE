import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Button, Box, Typography, Paper } from "@mui/material";

export default function Admin() {
  const [winners, setWinners] = useState<string[]>([]);

  useEffect(() => {
    socket.on("buzzed", (name: string) => {
      setWinners((prev) => {
        if (prev.includes(name)) return prev;
        return [...prev, name];
      });
    });

    socket.on("reset", () => {
      setWinners([]);
    });

    return () => {
      socket.off("buzzed");
      socket.off("reset");
    };
  }, []);

  const handleReset = () => {
    socket.emit("reset");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Who buzzed first:
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            minHeight: 120,
            width: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {winners.length > 0 ? (
            <Typography variant="h5">
              {winners.map((w, i) => (
                <span key={i} style={{ color: "red" }}>
                  {i + 1}. {w}
                  <br />
                </span>
              ))}
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ color: "grey" }}>
              waiting...
            </Typography>
          )}
        </Paper>

        <Button variant="contained" color="secondary" onClick={handleReset}>
          Reset
        </Button>
      </Box>
    </Box>
  );
}
