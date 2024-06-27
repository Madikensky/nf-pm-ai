import { GoogleGenerativeAI } from '@google/generative-ai';
import Trello from 'trello';
import { config } from 'dotenv';
import { Request, Response } from 'express';

const PORT = 5000 || process.env.PORT;

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

app.post('/gemini', async (req: Request, res: Response) => {
  const model = genAi.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const { userPrompt, history } = req.body;

  const apiKey = process.env.TRELLO_API;
  const token = process.env.TRELLO_AUTH_TOKEN;

  const trello = new Trello(apiKey, token);
});
