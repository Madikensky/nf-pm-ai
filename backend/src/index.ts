import { BoardsInfo } from './BoardsInfo';
import { containsJSON } from './Validation';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import context from './Context';
import connectDB from './db';
import { getTokens, User } from './auth';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import express from 'express';
import cors from 'cors';

const upload = multer();

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

app.post('/audio-prompt', upload.single('audio'), async (req, res) => {
  try {
    if (req.file?.buffer === undefined) {
      return res.status(400).send('No audio file uploaded');
    }
    const fileBuffer = req.file.buffer;
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: 'audio.wav',
      contentType: 'audio/wav',
    });
    formData.append('model', 'whisper-1');

    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.GPT_TOKEN}`,
          ...formData.getHeaders(),
        },
        responseType: 'json',
      }
    );
    const userPrompt = response.data.text;
    console.log(userPrompt);
    res.json({ transcription: response.data.text });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error transcribing audio');
  }
});

app.post('/gemini', async (req: Request, res: Response) => {
  try {
    const { userPrompt, apiKey, token, history } = req.body;

    console.log(history);

    let boards = await new BoardsInfo(apiKey, token).main();

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const formattedDate = `в MM.DD.YYYY формате: ${month}.${day}.${year}`;

    if (boards) {
      history.push({
        role: 'system',

        content: `Тебе предоставляется JSON-файл с актуальной информацией о досках, списках и карточках Trello. Ты должен находить названия объектов которые предоставляет пользователь и находить по названиям их идентификаторы в этом json файле. Формат данных следующий:\n\n
        \n\n
                  ${boards}\n\n
                  Текущая дата: ${formattedDate}\n\n
                  `,
      });

      const openai = new OpenAI({ apiKey: process.env.GPT_TOKEN });
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: context },
          ...history,
          { role: 'user', content: userPrompt },
        ],
        model: 'gpt-4o',
        temperature: 0.7,
      });

      let gptAnswer = completion.choices[0].message.content!;

      const json = containsJSON(gptAnswer);

      const handledAnswer = await openai.chat.completions.create({
        messages: [
          {
            role: 'assistant',
            content:
              'Тебе нужно обработать запрос который тебе дает пользователь, и оставить только важную часть, где описывается что было выполнено - название карточек/списков/досок которые были удалены/созданы/обновлены). Чтобы было понятно и кратко, используй названия а не идентификаторы объектов. Преобразуй текст в красивый и приятный для глаз стиль. Не предоставляй пользователю json объект, так как он не поймет что это',
          },
          { role: 'user', content: gptAnswer },
        ],
        model: 'gpt-4o-mini',
      });

      if (json) {
        const data = JSON.parse(json);

        data.map((task: any) => {
          const {
            name,
            desc,
            listName,
            boardName,
            due,
            start,
            listId,
            idBoard,
            cardId,
            addMembers,
            removeMembers,
          } = task.params;
          const { action } = task;

          const queryParam = {
            name,
            desc,
            due,
            start,
            listName,
            pos: 'bottom',
            idList: listId,
            cardId,
            key: apiKey,
            token: token,
            idBoard,
            idMembers: addMembers
              ? addMembers
              : removeMembers
              ? removeMembers
              : undefined,
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
                console.log('card added');
                // console.log('dfg');
                return e.data;
              })
              .catch((e) => {
                console.log('error:', e.response.data);
              });
          } else if (action === 'updateCard') {
            axios
              .put(`https://api.trello.com/1/cards/${cardId}`, null, {
                params: queryParam,
              })
              .then((e) => {
                // console.log(e);
                return e.data;
              })
              .catch((e) => console.log(e));
          } else if (action === 'deleteCard') {
            axios
              .delete(`https://api.trello.com/1/cards/${cardId}`, {
                params: { key: apiKey, token: token },
              })
              .then((e) => {
                // console.log(e);
                return e.data;
              })
              .catch((e) => console.log(e));
          } else if (action === 'addList') {
            axios
              .post('https://api.trello.com/1/lists?', null, {
                params: { ...queryParam, pos: 'bottom' },
              })
              .then((e) => {
                // console.log(e);
                return e.data;
              })
              .catch((e) => console.log(e));
          } else if (action === 'deleteList') {
            axios
              .put(`https://api.trello.com/1/lists/${listId}/closed?`, null, {
                params: { key: apiKey, token: token, value: true },
              })
              .then((e) => {
                console.log('list deleted');
                return e.data;
              })
              .catch((e) => console.log(e));
          } else if (action === 'updateList') {
            axios
              .put(`https://api.trello.com/1/lists/${listId}`, null, {
                params: queryParam,
              })
              .then((e) => {
                console.log('list updated');
                return e.data;
              })
              .catch((e) => console.log(e));
          } else if (action === 'addBoard') {
            axios
              .post('https://api.trello.com/1/boards', null, {
                params: queryParam,
              })
              .then((e) => {
                console.log('board added');
                return e.data;
              })
              .catch((e) => console.log(e));
          } else if (action === 'deleteBoard') {
            axios
              .delete(`https://api.trello.com/1/boards/${idBoard}`, {
                params: { key: apiKey, token: token },
              })
              .then((e) => {
                console.log('board deleted');
                return e.data;
              })
              .catch((e) => console.log(e));
          } else if (action === 'updateBoard') {
            axios
              .put(`https://api.trello.com/1/boards/${idBoard}`, null, {
                params: queryParam,
              })
              .then((e) => {
                console.log('board updated');
                return e.data;
              })
              .catch((e) => console.log(e));
          }

          // boards = 'нету досок';

          // history.push({
          //   role: 'user',

          //   content: `Тебе предоставляется обновленный после запроса JSON-файл с актуальной информацией о досках, списках и карточках Trello. Ты должен находить названия объектов которые предоставляет пользователь и находить по названиям их идентификаторы в этом json файле. Формат данных следующий:\n\n
          //   \n\n
          //             ${boards}\n\n
          //             Текущая дата: ${formattedDate}\n\n
          //             `,
          // });

          console.log(history);

          gptAnswer = handledAnswer.choices[0].message.content!;
        });
      } else {
        console.log(json);
        console.log('no json found');
      }
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
