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
  await client.connect();
  const sentCode = await client.sendCode({
    apiId,
    apiHash,
    phoneNumber: phone,
  });
  sessions[phone] = { client, sentCode, session };
  return true;
}

async function verifyCode(phone, code) {
  const { client, sentCode } = sessions[phone];
  await client.signIn({
    phoneNumber: phone,
    phoneCode: code,
    phoneCodeHash: sentCode.phoneCodeHash,
  });
  return client.session.save();
}

module.exports = { requestCode, verifyCode };