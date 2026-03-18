const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const crypto = require("crypto");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Backend PayU funcionando" });
});

app.post("/api/pay", async (req, res) => {
  try {
    const {
      cardNumber,
      expiryYear,
      expiryMonth,
      cvv,
      name,
      email,
      documentType,
      documentNumber,
      value,
      description,
      referenceCode,
    } = req.body;

    if (
      !cardNumber ||
      !expiryYear ||
      !expiryMonth ||
      !cvv ||
      !name ||
      !email ||
      !documentType ||
      !documentNumber ||
      !value ||
      !description ||
      !referenceCode
    ) {
      return res.status(400).json({
        code: "1",
        message: "Faltan datos obligatorios",
      });
    }
    const signatureRaw = `${process.env.PAYU_API_KEY}~${process.env.PAYU_MERCHANT_ID}~${referenceCode}~${Number(value).toFixed(2)}~${process.env.PAYU_CURRENCY}`;

    const signature = crypto
    .createHash("md5")
    .update(signatureRaw)
    .digest("hex");

    console.log("signatureRaw:", signatureRaw);
    console.log("signature:", signature);

    const payload = {
      language: "es",
      command: "SUBMIT_TRANSACTION",
      merchant: {
        apiLogin: process.env.PAYU_API_LOGIN,
        apiKey: process.env.PAYU_API_KEY,
      },
      transaction: {
        order: {
          accountId: process.env.PAYU_ACCOUNT_ID,
          referenceCode,
          description,
          language: "es",
          signature,
          notifyUrl: "",
          buyer: {
            merchantBuyerId: documentNumber,
            fullName: name,
            emailAddress: email,
            contactPhone: "999999999",
            dniNumber: documentNumber,
          },
          shippingAddress: {
            street1: "Lima",
            city: "Lima",
            state: "Lima",
            country: "PE",
            postalCode: "15001",
            phone: "999999999",
          },
          additionalValues: {
            TX_VALUE: {
              value: Number(value),
              currency: process.env.PAYU_CURRENCY,
            },
          },
        },
        payer: {
          fullName: name,
          emailAddress: email,
          dniNumber: documentNumber,
          billingAddress: {
            street1: "Lima",
            city: "Lima",
            state: "Lima",
            country: "PE",
            postalCode: "15001",
            phone: "999999999",
          },
        },
        debitCard: {
          number: cardNumber,
          securityCode: cvv,
          expirationDate: `${expiryYear}/${expiryMonth}`,
          name,
        },
        extraParameters: {
          INSTALLMENTS_NUMBER: 1,
        },
        type: "AUTHORIZATION_AND_CAPTURE",
        paymentMethod: "VISA_DEBIT",
        paymentCountry: process.env.PAYU_COUNTRY,
        deviceSessionId: "session123456",
        ipAddress: "127.0.0.1",
        cookie: "cookie123456",
        userAgent: "Mozilla/5.0",
      },
      test: process.env.PAYU_TEST === "true",
    };

    const payuResponse = await axios.post(process.env.PAYU_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const state = payuResponse.data?.transactionResponse?.state || "";
    const transactionId =
      payuResponse.data?.transactionResponse?.transactionId || "";

    if (state === "APPROVED") {
      const completeData = {
        dni: documentNumber,
        email,
        name,
        operationDate: new Date().toLocaleString("es-PE"),
        transactionId,
      };

      const docRef = await db.collection("complete").add(completeData);

      return res.json({
        code: "0",
        message: "Compra exitosa",
        transactionId,
        completeId: docRef.id,
      });
    }

    return res.status(400).json({
      code: "2",
      message: 
        payuResponse.data?.transactionResponse?.responseMessage ||
        payuResponse.data?.transactionResponse?.state ||
        "Pago no aprobado",
      payu: payuResponse.data,
    });
  } catch (error) {
    console.error("Error en /api/pay:", error.response?.data || error.message);
    console.error(JSON.stringify(error.response?.data || error.message, null, 2));
    
    return res.status(500).json({
      code: "3",
      message: "Error procesando pago",
      error: error.response?.data || error.message,
    });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server corriendo en http://localhost:${process.env.PORT || 4000}`);
});