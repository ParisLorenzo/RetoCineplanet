import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  MapPin,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { collection, getDocs, addDoc } from "firebase/firestore"; /* Conectar a Firebase jalar y agregar datos o productos*/
import { db } from "@/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SnackCard from "@/components/SnackCard";
import { Button } from "@/components/ui/button";
import canchitaImg from "@/assets/canchita.png";


type CandyItem = {
  id: string;
  name: string;
  priceNum: number;
  price: string;
  image: string;
  description: string;
  details: string;
  category: string;
  calories: string;
};

const CINES_PICKUP = [
  "Cineplanet San Miguel",
  "Cineplanet Salaverry",
  "Cineplanet Primavera",
  "Cineplanet Centro Cívico",
  "Cineplanet Mall del Sur",
  "Cineplanet Alcázar",
];

const Dulceria = () => {
  const [snacksData, setSnacksData] = useState<CandyItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [selectedCine, setSelectedCine] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cineError, setCineError] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchCandyStore = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "candystore"));

        const data: CandyItem[] = querySnapshot.docs.map((doc) => {
          const raw = doc.data();
          const parsedPrice = Number(raw.price || 0);

          return {
            id: doc.id,
            name: raw.name || "Producto",
            priceNum: parsedPrice,
            price: `S/ ${parsedPrice.toFixed(2)}`,
            image: raw.image || "",
            description: raw.description || "Snack para tu función",
            details:
              raw.details ||
              raw.description ||
              "Producto disponible en dulcería.",
            category: raw.category || "Snacks",
            calories: raw.calories || "Consultar en tienda",
          };
        });

        setSnacksData(data);
      } catch (error) {
        console.error("Error cargando dulcería:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandyStore();
  }, []);

  const currentRec = useMemo(() => {
    if (!snacksData.length) return null;
    return snacksData[Math.floor(Math.random() * snacksData.length)];
  }, [snacksData]);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const val = (next[id] || 0) + delta;

      if (val <= 0) delete next[id];
      else next[id] = val;

      return next;
    });
  };

  const totalItems = Object.values(cart).reduce((s, v) => s + v, 0);

  const totalPrice = Object.entries(cart).reduce((s, [id, qty]) => {
    const item = snacksData.find((sn) => sn.id === id);
    return s + (item ? item.priceNum * qty : 0);
  }, 0);

  const handleOrder = () => {
    if (!selectedCine) {
      setCineError(true);
      return;
    }

    setCineError(false);
    setOrderPlaced(true);
  };

  const resetOrder = () => {
    setCart({});
    setSelectedCine("");
    setOrderPlaced(false);
    setShowCart(false);
    setCineError(false);
  };

  const handleCandyPayment = async () => {
  if (!selectedCine) {
    setCineError(true);
    return;
  }

  setCineError(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const referenceCode = `CANDY-${Date.now()}`;

  const items = Object.entries(cart)
    .map(([id, qty]) => {
      const item = snacksData.find((s) => s.id === id);
      if (!item) return null;

      return {
        id: item.id,
        name: item.name,
        qty,
        unitPrice: item.priceNum,
        subtotal: item.priceNum * qty,
      };
    })
    .filter(Boolean);

  const description = items
    .map((item: any) => `${item.name} x${item.qty}`)
    .join(", ");

  const payload = {
    referenceCode,
    description: `Compra dulcería Cineplanet - ${description}`,
    value: totalPrice.toFixed(2),
    cine: selectedCine,
    items,
    buyerEmail: user?.email || "invitado@cineplanet.com",
    name: user?.name || "Invitado Cineplanet",
    documentType: user?.documentType || "DNI",
    documentNumber: user?.documentNumber || "00000000",
  };

  try {
    await addDoc(collection(db, "complete"), {
      type: "dulceria",
      referenceCode,
      cine: selectedCine,
      items,
      total: Number(totalPrice.toFixed(2)),
      email: payload.buyerEmail,
      name: payload.name,
      dni: payload.documentNumber,
      operationDate: new Date().toLocaleString("es-PE"),
      status: "PENDING",
    });

    console.log("Pedido guardado en Firebase:", payload);
  } catch (error) {
    console.error("Error guardando pedido en Firebase:", error);
    return;
  }
};

 
  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
                Dulcería
              </h1>
              <p className="text-muted-foreground font-body">
                Snacks y bebidas para tu función estelar
              </p>
            </div>

            {totalItems > 0 && (
              <Button
                variant="default"
                className="relative"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart size={18} />
                <span className="ml-2 hidden sm:inline">Carrito</span>
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              </Button>
            )}
          </div>

          {isLoggedIn && currentRec && (
            <div className="relative mb-10 flex items-center gap-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, x: -30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                className="shrink-0 relative"
              >
                <motion.img
                  src={canchitaImg}
                  alt="Canchita"
                  className="h-20 w-20 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative bg-card/80 backdrop-blur-sm rounded-2xl rounded-bl-sm px-5 py-3 shadow-lg border border-border/30 flex items-center gap-4 flex-1"
              >
                <div className="absolute -left-2 top-4 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-card/80 border-b-[6px] border-b-transparent" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Sparkles size={14} className="text-neon-yellow" />
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-neon-yellow">
                      Canchita te recomienda
                    </span>
                  </div>

                  <p className="font-body text-sm text-foreground">
                    ¿Viste que tenemos {currentRec.name}?{" "}
                    {currentRec.description || "Es una gran opción para tu función."}
                  </p>
                </div>

                <button
                  onClick={() => updateQty(currentRec.id, 1)}
                  className="shrink-0 px-4 py-2 rounded-full bg-primary text-primary-foreground font-display text-xs font-semibold hover:scale-105 hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)] active:scale-95 transition-all"
                >
                  Agregar
                </button>
              </motion.div>
            </div>
          )}

          {!isLoggedIn && (
            <div className="relative mb-10 flex items-center gap-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                className="shrink-0"
              >
                <motion.img
                  src={canchitaImg}
                  alt="Canchita"
                  className="h-18 w-18 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative bg-card/80 backdrop-blur-sm rounded-2xl rounded-bl-sm px-5 py-3 shadow-lg border border-border/30 flex-1"
              >
                <div className="absolute -left-2 top-4 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-card/80 border-b-[6px] border-b-transparent" />
                <p className="font-body text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">¡Hola!</span>{" "}
                  Inicia sesión para que te recomiende los mejores combos según
                  tus gustos.
                </p>
              </motion.div>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground font-body">
                Cargando productos...
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } },
              }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5"
            >
              {snacksData.map((snack) => (
                <motion.div
                  key={snack.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="h-[340px] sm:h-[360px]"
                >
                  <SnackCard
                    name={snack.name}
                    image={snack.image}
                    description={snack.description}
                    details={snack.details}
                    calories={snack.calories}
                    price={snack.price}
                    priceNum={snack.priceNum}
                    qty={cart[snack.id] || 0}
                    onChangeQty={(delta: number) => updateQty(snack.id, delta)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
              onClick={() => !orderPlaced && setShowCart(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-xl font-bold">
                  {orderPlaced ? "Pedido Confirmado" : "Tu Pedido"}
                </h2>

                <button
                  onClick={() =>
                    orderPlaced ? resetOrder() : setShowCart(false)
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              {orderPlaced ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <img
                    src={canchitaImg}
                    alt="Canchita"
                    className="h-20 w-20 object-contain animate-bounce"
                  />
                  <h3 className="font-display text-2xl font-bold">Gracias</h3>
                  <p className="text-muted-foreground font-body">
                    Tu pedido está listo para recoger en:
                  </p>
                  <div className="flex items-center gap-2 text-primary font-display font-semibold">
                    <MapPin size={18} /> {selectedCine}
                  </div>
                  <p className="text-price font-display text-xl font-bold">
                    Total: S/ {totalPrice.toFixed(2)}
                  </p>
                  <Button className="mt-4" onClick={resetOrder}>
                    Nuevo Pedido
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {Object.entries(cart).length === 0 ? (
                      <div className="text-center py-10 space-y-3">
                        <img
                          src={canchitaImg}
                          alt="Canchita"
                          className="h-16 w-16 mx-auto opacity-50"
                        />
                        <p className="text-muted-foreground font-body">
                          Tu carrito está vacío
                        </p>
                      </div>
                    ) : (
                      Object.entries(cart).map(([id, qty]) => {
                        const item = snacksData.find((s) => s.id === id);
                        if (!item) return null;

                        return (
                          <div
                            key={id}
                            className="flex items-center gap-3 glass-panel rounded-xl p-3"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-14 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-display text-sm font-semibold truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                x{qty}
                              </p>
                            </div>
                            <span className="text-price font-display font-bold text-sm whitespace-nowrap">
                              S/ {(item.priceNum * qty).toFixed(2)}
                            </span>
                          </div>
                        );
                      })
                    )}

                    {Object.keys(cart).length > 0 && (
                      <div className="pt-4 border-t border-border/40 space-y-3">
                        <h4 className="font-display font-semibold text-sm">
                          Retira en:
                        </h4>

                        {cineError && (
                          <p className="text-sm text-destructive font-body">
                            Selecciona un cine para continuar
                          </p>
                        )}

                        <div className="grid grid-cols-1 gap-2">
                          {CINES_PICKUP.map((cine) => (
                            <button
                              key={cine}
                              onClick={() => {
                                setSelectedCine(cine);
                                setCineError(false);
                              }}
                              className={`text-left px-4 py-3 rounded-xl border text-sm font-body transition-all ${
                                selectedCine === cine
                                  ? "border-primary bg-primary/10 text-foreground"
                                  : `border-border/50 text-muted-foreground hover:border-primary/30 ${
                                      cineError ? "border-destructive/50" : ""
                                    }`
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <MapPin size={14} /> {cine}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {Object.keys(cart).length > 0 && (
                    <div className="p-6 border-t border-border space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-muted-foreground">
                          Total
                        </span>
                        <span className="font-display text-xl font-bold text-price">
                          S/ {totalPrice.toFixed(2)}
                        </span>
                      </div>

                      <Button className="w-full" size="lg" onClick={handleCandyPayment}>
                        Pagar pedido <ChevronRight size={16} />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};
export default Dulceria;
