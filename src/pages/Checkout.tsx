import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CheckoutSnacks, { SnackOrder } from "@/components/CheckoutSnacks";
import canchitaImg from "@/assets/canchita.png";

const STEPS = ["Asientos", "Snacks", "Pago", "Confirmación"];

interface PaymentErrors {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  email?: string;
  name?: string;
  documentType?: string;
  documentNumber?: string;
  general?: string;
}

const Checkout = () => {
  const { movieId } = useParams();
  const [step, setStep] = useState(0);
  const [snacks, setSnacks] = useState<Record<string, SnackOrder>>({});
  const [isPaying, setIsPaying] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [operationDate, setOperationDate] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name && user.name !== "Invitado" ? user.name : "");
  const [documentType, setDocumentType] = useState("DNI");
  const [documentNumber, setDocumentNumber] = useState("");
  const [paymentErrors, setPaymentErrors] = useState<PaymentErrors>({});

  const seatsTotal = 37.8;
  const snacksTotal = Object.values(snacks).reduce(
    (s, item) => s + item.qty * item.priceNum,
    0
  );
  const grandTotal = seatsTotal + snacksTotal;

  const referenceCode = useMemo(() => {
    const random = Math.floor(Math.random() * 1000000);
    return `CP${movieId || "MOV"}${Date.now()}${random}`;
  }, [movieId]);

  const description = useMemo(() => {
    const snackText =
      snacksTotal > 0
        ? ` + Snacks: ${Object.values(snacks)
            .map((s) => `${s.name} x${s.qty}`)
            .join(", ")}`
        : "";
    return `Compra Cineplanet - Asientos D5,D6${snackText}`;
  }, [snacks, snacksTotal]);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.name && user.name !== "Invitado") setName(user.name);
  }, [user]);

  const validatePayment = (): PaymentErrors => {
    const e: PaymentErrors = {};
    const cleanCard = cardNumber.replace(/\s/g, "");

    if (!cardNumber.trim()) e.cardNumber = "Ingresa el número de tarjeta";
    else if (!/^\d{16}$/.test(cleanCard)) e.cardNumber = "La tarjeta debe tener 16 dígitos";

    if (!expiry.trim()) e.expiry = "Ingresa la fecha de expiración";
    else if (!/^\d{2}\/\d{2}$/.test(expiry)) e.expiry = "Usa el formato MM/AA";
    else {
      const [mm] = expiry.split("/");
      const month = Number(mm);
      if (month < 1 || month > 12) e.expiry = "Mes inválido";
    }

    if (!cvv.trim()) e.cvv = "Ingresa el CVV";
    else if (!/^\d{3,4}$/.test(cvv)) e.cvv = "CVV inválido";

    if (!email.trim()) e.email = "Ingresa el correo";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Correo inválido";

    if (!name.trim()) e.name = "Ingresa el nombre completo";

    if (!documentType.trim()) e.documentType = "Selecciona un tipo de documento";

    if (!documentNumber.trim()) e.documentNumber = "Ingresa el número de documento";
    else if (!/^\d{8,12}$/.test(documentNumber)) e.documentNumber = "Documento inválido";

    return e;
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePay = async () => {
    const errs = validatePayment();
    setPaymentErrors(errs);

    if (Object.keys(errs).length > 0) return;

    try {
      setIsPaying(true);
      setPaymentErrors({});

      const [expiryMonth, expiryYearShort] = expiry.split("/");
      const expiryYear = `20${expiryYearShort}`;
      const cleanCardNumber = cardNumber.replace(/\s/g, "");

      const response = await fetch("http://localhost:4000/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cardNumber: cleanCardNumber,
          expiryYear,
          expiryMonth,
          cvv,
          name: name.trim(),
          email: email.trim(),
          documentType,
          documentNumber: documentNumber.trim(),
          value: Number(grandTotal.toFixed(2)),
          description,
          referenceCode
        })
      });

      const data = await response.json();

      if (!response.ok || data.code !== "0") {
  console.error("Respuesta backend:", data);

  const payuMessage =
    data?.payu?.transactionResponse?.responseMessage ||
    data?.payu?.transactionResponse?.state ||
    data?.message ||
    "No fue posible procesar el pago";

  setPaymentErrors({
    general: payuMessage
  });
  return;
}

      setTransactionId(data.transactionId || "");
      setOperationDate(new Date().toLocaleString("es-PE"));
      setStep(3);
    } catch (error) {
      console.error("Error en pago:", error);
      setPaymentErrors({
        general: "No se pudo conectar con el servicio de pago"
      });
    } finally {
      setIsPaying(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full h-11 rounded-lg bg-input px-4 font-body text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:outline-none transition-shadow ${
      hasError
        ? "shadow-[0_0_0_2px_hsl(var(--destructive)/0.8)]"
        : "focus:shadow-[0_0_0_2px_hsl(var(--primary)/0.8)]"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
            Checkout
          </h1>

          <div className="flex items-center gap-1 mb-12">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center font-display text-sm font-bold transition-all duration-300 ${
                      i < step
                        ? "bg-primary text-primary-foreground shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
                        : i === step
                        ? "bg-secondary text-secondary-foreground shadow-[0_0_8px_hsl(var(--secondary)/0.4)]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check size={16} /> : i + 1}
                  </div>
                  <span className="mt-1 font-display text-xs uppercase tracking-wider text-muted-foreground hidden sm:block">
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 rounded-full transition-colors ${
                      i < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-xl p-6 md:p-8"
          >
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl font-semibold">
                  Confirma tus Asientos
                </h2>
                <div className="flex flex-wrap gap-2">
                  {["D-5", "D-6"].map((seat) => (
                    <span
                      key={seat}
                      className="px-3 py-1 rounded-full bg-primary/20 text-primary font-display text-sm font-semibold"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between pt-4 border-t border-border/40">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-display font-bold text-price tabular-nums">
                    S/ {seatsTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {step === 1 && (
              <CheckoutSnacks snacks={snacks} onUpdateSnacks={setSnacks} />
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-xl font-semibold">
                    Pago
                  </h2>
                  <p className="text-sm text-muted-foreground font-body">
                    Completa los datos para procesar la compra.
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Asientos (2)</span>
                    <span className="tabular-nums">
                      S/ {seatsTotal.toFixed(2)}
                    </span>
                  </div>

                  {snacksTotal > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Snacks</span>
                      <span className="tabular-nums">
                        S/ {snacksTotal.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t border-border/40 font-display font-bold">
                    <span>Total</span>
                    <span className="text-price tabular-nums">
                      S/ {grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Número de tarjeta"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 16)
                            .replace(/(.{4})/g, "$1 ")
                            .trim()
                        )
                      }
                      className={inputClass(!!paymentErrors.cardNumber)}
                    />
                    {paymentErrors.cardNumber && (
                      <p className="text-xs text-destructive mt-1 font-body">
                        {paymentErrors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (value.length > 2) {
                            value = `${value.slice(0, 2)}/${value.slice(2)}`;
                          }
                          setExpiry(value);
                        }}
                        className={inputClass(!!paymentErrors.expiry)}
                      />
                      {paymentErrors.expiry && (
                        <p className="text-xs text-destructive mt-1 font-body">
                          {paymentErrors.expiry}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        className={inputClass(!!paymentErrors.cvv)}
                      />
                      {paymentErrors.cvv && (
                        <p className="text-xs text-destructive mt-1 font-body">
                          {paymentErrors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass(!!paymentErrors.email)}
                    />
                    {paymentErrors.email && (
                      <p className="text-xs text-destructive mt-1 font-body">
                        {paymentErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass(!!paymentErrors.name)}
                    />
                    {paymentErrors.name && (
                      <p className="text-xs text-destructive mt-1 font-body">
                        {paymentErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className={inputClass(!!paymentErrors.documentType)}
                      >
                        <option value="DNI">DNI</option>
                        <option value="CE">CE</option>
                        <option value="PASSPORT">Pasaporte</option>
                      </select>
                      {paymentErrors.documentType && (
                        <p className="text-xs text-destructive mt-1 font-body">
                          {paymentErrors.documentType}
                        </p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Número de documento"
                        value={documentNumber}
                        onChange={(e) =>
                          setDocumentNumber(e.target.value.replace(/\D/g, "").slice(0, 12))
                        }
                        className={inputClass(!!paymentErrors.documentNumber)}
                      />
                      {paymentErrors.documentNumber && (
                        <p className="text-xs text-destructive mt-1 font-body">
                          {paymentErrors.documentNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {paymentErrors.general && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
                      <p className="text-sm text-destructive font-body">
                        {paymentErrors.general}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="flex justify-center mb-4">
                    <img
                      src={canchitaImg}
                      alt="Canchita"
                      className="h-24 w-24 object-contain"
                    />
                  </div>

                  <div className="mx-auto w-72 rounded-2xl bg-gradient-to-br from-primary/80 to-background border border-primary/40 overflow-hidden">
                    <div className="p-6 space-y-3">
                      <div className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                        Cineplanet
                      </div>
                      <h3 className="font-display text-lg font-bold">
                        Confirmación de compra
                      </h3>
                      <div className="text-sm text-muted-foreground font-body space-y-1">
                        <p>Asientos: D-5, D-6</p>
                        {Object.keys(snacks).length > 0 && (
                          <p>
                            {Object.values(snacks)
                              .map((s) => `${s.name} x${s.qty}`)
                              .join(", ")}
                          </p>
                        )}
                        <p>Operación: {operationDate}</p>
                      </div>
                    </div>
                    <div className="border-t border-dashed border-primary/40 mx-4" />
                    <div className="p-6 text-center space-y-2">
                      <p className="font-display text-lg font-bold text-price">
                        S/ {grandTotal.toFixed(2)}
                      </p>
                      <p className="font-display text-xs text-muted-foreground tracking-wider break-all">
                        {transactionId || referenceCode}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <p className="text-neon-yellow font-display font-semibold text-lg">
                  Compra registrada correctamente
                </p>
                <p className="text-muted-foreground font-body text-sm">
                  Puedes continuar con tu experiencia en la plataforma.
                </p>
              </div>
            )}
          </motion.div>

          <div className="flex justify-between mt-6">
            {step > 0 && step < 3 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Atrás
              </Button>
            )}

            {step < 2 ? (
              <Button variant="hero" className="ml-auto" onClick={handleNext}>
                Continuar
              </Button>
            ) : step === 2 ? (
              <Button
                variant="hero"
                className="ml-auto"
                onClick={handlePay}
                disabled={isPaying}
              >
                {isPaying ? "Procesando..." : "Pagar"}
              </Button>
            ) : (
              <Button
                variant="hero"
                className="ml-auto"
                onClick={() => (window.location.href = "/")}
              >
                Volver al Inicio
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;