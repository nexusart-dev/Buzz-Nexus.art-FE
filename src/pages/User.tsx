import { useState } from "react";
import { socket } from "../socket";
import { Button, TextField, Box, Typography } from "@mui/material";

export default function User() {
  const [name, setName] = useState("");
  const [buzzed, setBuzzed] = useState(false);

  const handleBuzz = () => {
    if (name.trim() && !buzzed) {
      socket.emit("buzz", name);
      setBuzzed(true);
    }
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
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Type Your Name
        </Typography>
        <TextField
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={buzzed}
          sx={{ mt: 2 }}
        />
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBuzz}
            disabled={buzzed || !name}
          >
            Buzz!
          </Button>
        </Box>
        {buzzed && <Typography color="success.main">You buzzed!</Typography>}
      </Box>
    </Box>
  );
}
