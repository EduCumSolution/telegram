const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { requestCode, verifyCode } = require("./telegram-auth");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post("/send-code", async (req, res) => {
  const { phone } = req.body;
  try {
    await requestCode(phone);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Send Code Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/verify-code", async (req, res) => {
  const { phone, code } = req.body;
  try {
    const session = await verifyCode(phone, code);
    res.status(200).json({ success: true, session });
  } catch (err) {
    console.error("Verify Code Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));