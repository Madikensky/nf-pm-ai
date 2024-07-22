import { BoardsInfo } from './BoardsInfo';
import { containsJSON } from './Validation';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import context from './Context';
import connectDB from './db';
import { getTokens, User } from './auth';

import * as bcrypt from 'bcryptjs';
import express from 'express';
import cors from 'cors';

config();

const PORT = 5000 || process.env.PORT;

const app = express();

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.use(cors());
app.use(express.json());

app.post('/register', async (req: Request, res: Response) => {
  try {
    // const { email, password, authToken, trelloToken } = req.body;
    const { authToken, trelloToken, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: 'User already exists' });
      // console.log('User already exists');
    }
    //optional: add token trello and auth token validation using a simple if statement

    try {
      const response = await axios.get(
        `https://api.trello.com/1/members/me/boards?key=${trelloToken}&token=${authToken}`
      );

      const boards = response.data;

      if (boards) {
        // const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          email,
          // password: hashedPassword,
          authToken,
          trelloToken,
        });

        await user.save();
        res.json({ message: 'User created' });
      }
    } catch (e) {
      res.status(401).send('Неверный Trello API Token или Trello Auth Token');
    }
  } catch (e: any) {
    console.log('registration error: ', e.message);
  }
});

app.post('/get-tokens', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const tokens = await getTokens(email);
    // console.log(tokens);
    res.json(tokens).status(200);
    // res.json(boards).status(200);
  } catch (e: any) {
    console.log(e.message);
  }
});

app.post('/gemini', async (req: Request, res: Response) => {
  try {
    const { userPrompt, apiKey, token, history } = req.body;

    const boards = await new BoardsInfo(apiKey, token).main();

    if (boards) {
      history.push({
        role: 'system',

        content:
          'Тебе предоставляется JSON-файл с информацией о досках, списках и карточках Trello. Используй эти данные для ответа на вопросы и выполнения задач, связанных с Trello. Данные представлены в следующем формате:\n\n"' +
          boards,
      });

      const openai = new OpenAI({ apiKey: process.env.GPT_TOKEN });
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: context },
          ...history,
          { role: 'user', content: userPrompt },
        ],
        model: 'gpt-4o',
        temperature: 0.5,
      });

      let gptAnswer = completion.choices[0].message.content!;

      const json = containsJSON(gptAnswer);

      const handledAnswer = await openai.chat.completions.create({
        messages: [
          {
            role: 'assistant',
            content:
              'Тебе нужно обработать запрос который тебе дает пользователь, и оставить только важную часть, где описывается что было выполнено(название карточек/списков/досок которые были удалены/созданы/обновлены). Чтобы было понятно и кратко. Преобразуй текст в красивый и приятный для глаз стиль. Не предоставляй пользователю json объект, так как он не поймет что это',
          },
          { role: 'user', content: gptAnswer },
        ],
        model: 'gpt-4o-mini',
      });

      if (json) {
        const data = JSON.parse(json);

        // if (data.length === 1) {
        //   console.log('был отправлен не массив объектов');
        // }

        console.log('Parsed json', data);

        data.map((task: any) => {
          const {
            name,
            desc,
            listName,
            boardName,
            due,
            start,
            members,
            listId,
            cardId,
          } = task.params;
          const { action } = task;

          const currBoards = JSON.parse(boards);

          const queryParam = {
            name,
            desc,
            due,
            start,
            members,
            idList: listId,
            cardId,
            key: apiKey,
            token: token,
          };

          for (let key in queryParam) {
            if (!queryParam[key]) {
              delete queryParam[key];
            }
          }

          if (action === 'addCard') {
            axios
              .post('https://api.trello.com/1/cards', null, {
                params: queryParam,
              })
              .then((e) => {
                console.log(e.data);
                return e.data;
              })
              .catch((e) => {
                console.log(e.data);
              });
          } else if (action === 'updateCard') {
            axios
              .put(`https://api.trello.com/1/cards/${cardId}`, null, {
                params: queryParam,
              })
              .then((e) => {
                console.log(e);
                return e.data;
              })
              .catch((e) => console.log(e.data));
          } else if (action === 'deleteCard') {
            axios
              .delete(`https://api.trello.com/1/cards/${cardId}`, {
                params: { key: apiKey, token: token },
              })
              .then((e) => {
                console.log(e);
                return e.data;
              })
              .catch((e) => console.log(e.data));
          }

          gptAnswer = handledAnswer.choices[0].message.content!;
        });
      } else {
        console.log('no json found');
      }
      console.log(gptAnswer);
      res.send(gptAnswer);
    } else {
      console.log('no boards found');
    }
  } catch (e) {
    console.log('some err?', e);
    // console.log('request:', req.body);
    res.status(500).send({
      message: 'Возникла ошибка на сервере. Попробуйте изменить свой запрос',
    });
  }
});
