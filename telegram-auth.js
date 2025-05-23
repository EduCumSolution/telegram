const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Api } = require("telegram");

const apiId = 123456; // ← अपना API ID डालें
const apiHash = "YOUR_API_HASH"; // ← अपना API Hash डालें

const sessions = {};

async function requestCode(phone) {
  const session = new StringSession("");
  const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => phone,
    password: async () => "",
    phoneCode: async () => "", // wait for user input later
    onError: (err) => console.log(err),
  });

  const sentCode = await client.sendCodeRequest(phone);
  sessions[phone] = { client, sentCode, session };

  return true;
}

async function verifyCode(phone, code) {
  const sessionData = sessions[phone];
  if (!sessionData) throw new Error("Session not found for this phone.");

  const { client, sentCode } = sessionData;

  await client.signIn({
    phoneNumber: phone,
    phoneCodeHash: sentCode.phoneCodeHash,
    phoneCode: code,
  });

  // Save session string
  const sessionStr = client.session.save();
  return sessionStr;
}

module.exports = { requestCode, verifyCode };
