const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { requestCode, verifyCode } = require('./telegram-auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/send-code', async (req, res) => {
  const { phone } = req.body;
  try {
    await requestCode(phone);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/verify-code', async (req, res) => {
  const { phone, code } = req.body;
  try {
    const session = await verifyCode(phone, code);
    res.json({ success: true, session });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});