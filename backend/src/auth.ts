import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  trelloToken: { type: String, required: true },
  authToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const getTokens = async (email: string) => {
  const userData = await User.findOne({ email });
  if (userData) {
    return {
      trelloToken: userData.trelloToken,
      trelloAuth: userData.authToken,
    };
  }
  return null;
};

export { getTokens, User };
