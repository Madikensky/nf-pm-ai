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
  try {
    const model = genAi.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const { userPrompt, history } = req.body;

    const apiKey = process.env.TRELLO_API as string;
    const token = process.env.TRELLO_AUTH_TOKEN as string;

    const trello = new Trello(apiKey, token);

    const getAllBoards = (): Promise<string[]> =>
      new Promise((resolve, reject) => {
        trello.getBoards('me', (err: Error, data) => {
          if (err) {
            reject(err);
          }
          resolve(data.map((board) => board.name));
        });
      });

    const boards = await getAllBoards();

    history.push({
      role: 'model',
      parts: [
        {
          text: boards.join(', ') + ' ',
        },
      ],
    });

    const chat = model.startChat({ history });
    const sendPromptToGemini = await chat.sendMessage(userPrompt);
    const geminiAnswer = sendPromptToGemini.response.text();
    res.send(geminiAnswer);
  } catch (e) {
    res.status(500).send({ message: e });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
