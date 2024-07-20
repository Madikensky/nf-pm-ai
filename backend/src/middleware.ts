import { getTokens } from './auth';

const checkAuth = async (req, res, next) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const tokens = await getTokens(userId);
  if (!tokens) {
    return res.status(403).json({ message: 'Access not allowed' });
  }

  req.tokens = tokens;
  next();
};

export default checkAuth;
