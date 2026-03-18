import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const PaymentResponse = () => {
  const { search } = useLocation();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const state = params.get("transactionState");
  const reference = params.get("referenceCode");
  const amount = params.get("TX_VALUE");
  const currency = params.get("currency");
  const message =
    state === "4"
      ? "Pago aprobado"
      : state === "6"
      ? "Pago rechazado"
      : state === "7"
      ? "Pago pendiente"
      : "Estado de pago recibido";

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto max-w-xl px-4">
          <div className="glass-panel rounded-2xl p-8 space-y-4">
            <h1 className="font-display text-3xl font-bold">{message}</h1>
            <p className="text-muted-foreground">Referencia: {reference || "-"}</p>
            <p className="text-muted-foreground">
              Monto: {currency || "PEN"} {amount || "-"}
            </p>
            <div className="pt-4">
              <Link to="/">
                <Button variant="hero">Volver al inicio</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentResponse;