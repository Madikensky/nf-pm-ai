import { BoardsInfo } from './BoardsInfo';
import { containsJSON } from './Validation';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import context from './Context';

const fs = require('fs');
const path = require('path');

const PORT = 5000 || process.env.PORT;

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

config();

app.post('/token_login', (req: Request, res: Response) => {
  const { trelloToken, authToken } = req.body;

  if (trelloToken && authToken) {
    res.send('Tokens have been saved');
  } else {
    res.send('Please enter valid tokens');
  }
});

app.post('/gemini', async (req: Request, res: Response) => {
  try {
    const { userPrompt, apiKey, token, history } = req.body;

    const boards = await new BoardsInfo(apiKey, token).main();

    history.push({
      role: 'user',

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
      model: 'gpt-4o-mini',
    });

    completion.choices.forEach((choice) => console.log(choice.message));

    // console.log(history);

    let gptAnswer = completion.choices[0].message.content!;

    const json = containsJSON(gptAnswer);

    const handledAnswer = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Тебе нужно обработать запрос который тебе дает пользователь, и оставить только ту часть, где описывается что было выполнено. Чтобы было понятно и кратко',
        },
        { role: 'user', content: gptAnswer },
      ],
      model: 'gpt-4o-mini',
    });

    if (json) {
      console.log(json);
      const data = JSON.parse(json);

      data.map((task: any) => {
        if (task.action === 'addCard') {
          const { name, desc, listName, boardName, due, start, members } =
            task.params;

          const currBoards = JSON.parse(boards!); // Additional check to handle undefined

          // console.log('currBoards:', currBoards);

          currBoards.map((board: any) => {
            if (board.name === boardName) {
              const list = board.lists.find(
                (list: any) => list.name === listName
              );

              const listId = list.id;

              const queryParam = {
                name,
                desc,
                due,
                start,
                members,
                idList: listId,
                key: apiKey,
                token: token,
              };

              for (let key in queryParam) {
                if (!queryParam[key]) {
                  delete queryParam[key];
                }
              }
              console.log('query:', queryParam);

              axios
                .post('https://api.trello.com/1/cards', null, {
                  params: queryParam,
                })
                .then((e) => {
                  console.log('Final data:', e.data);
                  return e.data;
                })
                .catch((e) => console.log(e));
            }
          });
        }

        console.log(gptAnswer);
        // console.log(json);
        gptAnswer = handledAnswer.choices[0].message.content!;

        // gptAnswer =
        //   'Операция была выполнена успешно! Хотите сделать что-то еще?';
      });
    } else {
      console.log('no');
    }

    res.send(gptAnswer);
  } catch (e) {
    console.log(e);
    console.log('request:', req.body);
    res.status(500).send({
      message: 'Возникла ошибка на сервере. Попробуйте изменить свой запрос',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
