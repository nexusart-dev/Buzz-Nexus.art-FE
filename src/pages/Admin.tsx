import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Button, Box, Typography, Paper } from "@mui/material";

export default function Admin() {
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    socket.on("buzzed", (name: string) => {
      setWinner(name);
    });

    socket.on("reset", () => {
      setWinner(null);
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
          Who the first :
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            height: 100,
            width: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {winner ? (
            <Typography variant="h4">
              First Buzz: <span style={{color: 'red'}}>{winner}</span>
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
