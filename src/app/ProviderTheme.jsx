// src/providers/Providers.jsx
"use client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1180, // artıq 1168-dən başlayır
      xl: 1536,
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg", // default olaraq 1168-lik ölçü
        style: {
          padding: 0,
        },
      },
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      },
    },
  },
});

export default function ProviderTheme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
