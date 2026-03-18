import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index.tsx";
import Cartelera from "./pages/Cartelera.tsx";
import MovieDetail from "./pages/MovieDetail.tsx";
import SeatSelection from "./pages/SeatSelection.tsx";
import Dulceria from "./pages/Dulceria.tsx";
import Checkout from "./pages/Checkout.tsx";
import Cines from "./pages/Cines.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import PaymentResponse from "./pages/PaymentResponse.tsx";

const queryClient = new QueryClient();

/*Agregar nueva ruta de pages*/
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cartelera" element={<Cartelera />} />
            <Route path="/pelicula/:movieId" element={<MovieDetail />} />
            <Route path="/seats/:movieId" element={<SeatSelection />} />
            <Route path="/dulceria" element={<Dulceria />} />
            <Route path="/checkout/:movieId" element={<Checkout />} />
            <Route path="/cines" element={<Cines />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment-response" element={<PaymentResponse />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
