import mongoose from 'mongoose';
const crypto = require('crypto');
import dotenv from 'dotenv';

dotenv.config();

const tokenSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  trelloToken: { type: String, required: true, unique: true },
  authToken: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const Token = mongoose.model('Token', tokenSchema);

const encrypt = (text: any) => {
  const cipher = crypto.createCipher('aes-256-ctr', process.env.SECRET_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encryptedText: any) => {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.SECRET_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const saveTokens = async (
  userId: string,
  trelloToken: string,
  authToken: string
) => {
  const token = new Token({
    userId,
    trelloToken: encrypt(trelloToken),
    authToken: encrypt(authToken),
  });

  try {
    await token.save();
    console.log('Tokens have been saved');
  } catch (error) {
    console.error(error);
  }
};

const getTokens = async (userId: string) => {
  const tokenData = await Token.findOne({ userId });
  if (tokenData) {
    return {
      trelloToken: decrypt(tokenData.trelloToken),
      authToken: decrypt(tokenData.authToken),
    };
  }
  return null;
};

export { saveTokens, getTokens, Token };
