const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const apiId = 123456; // Replace with your API ID
const apiHash = "YOUR_API_HASH"; // Replace with your API Hash

const sessions = {};

async function requestCode(phone) {
  const session = new StringSession("");
  const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => phone,
    password: async () => "",
    phoneCode: async () => "",
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

  return client.session.save();
}

module.exports = { requestCode, verifyCode };