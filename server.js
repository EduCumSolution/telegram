const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { requestCode, verifyCode } = require("./telegram-auth");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/send-code", async (req, res) => {
  try {
    const success = await requestCode(req.body.phone);
    res.json({ success });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post("/verify-code", async (req, res) => {
  try {
    const session = await verifyCode(req.body.phone, req.body.code);
    res.json({ success: true, session });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
