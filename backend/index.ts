import { GoogleGenerativeAI } from '@google/generative-ai';
import Trello from 'trello';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import main from './trello.js';

const PORT = 5000 || process.env.PORT;

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const containsJSON = (s: string): string => {
  if (s.includes('[') && s.includes(']') && s.includes('action')) {
    const openBraceIndex = s.indexOf('[');
    const closeBraceIndex = s.indexOf(']');
    const ans = s.slice(openBraceIndex, closeBraceIndex + 1);
    return ans;
  } else if (s.includes('{') && s.includes('}') && s.includes('action')) {
    const openBraceIndex = s.indexOf('{');
    const closeBraceIndex = s.indexOf('}');
    const ans = s.slice(openBraceIndex, closeBraceIndex + 1);
    return ans;
  } else {
    return '';
  }
};

app.post('/gemini', async (req: Request, res: Response) => {
  try {
    const model = genAi.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const { userPrompt, history } = req.body;

    const apiKey = process.env.TRELLO_API as string;
    const token = process.env.TRELLO_AUTH_TOKEN as string;

    // const trello = new Trello(apiKey, token);

    const boards = await main();

    history.push({
      role: 'model',
      parts: [
        {
          text:
            'Вам предоставляется JSON-файл с информацией о досках, списках и карточках Trello. Используйте эти данные для ответа на вопросы и выполнения задач, связанных с Trello. Данные представлены в следующем формате:\n\n"' +
            boards,
        },
      ],
    });

    // console.log(boards);
    const chat = model.startChat({ history });
    const sendPromptToGemini = await chat.sendMessage(userPrompt);
    const geminiAnswer = sendPromptToGemini.response.text();

    const json = containsJSON(geminiAnswer);
    if (json) {
      console.log(json);
    } else {
      console.log('no');
    }

    res.send(geminiAnswer);
  } catch (e) {
    res.status(500).send({ message: e });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
