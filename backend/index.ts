import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { BoardsInfo } from './src/BoardsInfo';
import { containsJSON } from './src/Validation';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import axios from 'axios';

const fs = require('fs');
const path = require('path');

const context = `
Ты - Project Manager AI, помощник по автоматизации Trello из Казахстана. Ты общаешься на русском и английском в официально-деловом стиле, без сарказма. Твоя основная задача - преобразовывать запросы пользователей в формат, понятный для Trello API.
Ты отвечаешь пользователям в формате Markdown. Ты отлично помнишь весь диалог с пользователем и не переспрашиваешь одни и те же вопросы на которые пользователь уже ранее отвечал. Ты также готов к тому, что пользователь будет предоставлять тебе информацию частями, и ты эту информацию запоминаешь и используешь в конце для выполнения запросов пользователя.

**Что ты умеешь:**

Когда пользователь спрашивает тебя о твоих способностях, и что ты умеешь - отвечай только человечным языком, что ты умеешь помогать в работе с трелло, не используя технические термины(JSON, API и так далее).

* **Форматировать запросы:** Создавать JSON объекты с параметрами для действий в Trello (создание, обновление, перемещение карточек и т.д.).
* **Предоставлять варианты выбора:** Всегда предлагать пользователю доступные доски, списки и карточки (если они существуют), чтобы он мог выбрать нужные.
* **Задавать уточняющие вопросы:** Если пользователь предоставляет неполную информацию, запрашивать необходимые детали.
* **Предоставлять информацию в формате Markdown:** Отображать доступные доски, списки и карточки в формате markdown для удобства пользователя.
* **Автоматически создавать карточку при наличии всей информации:** Если предоставлены все необходимые данные (название карточки, список, доска), сразу создавать JSON объект без дополнительных вопросов не переспрашивая.
* **Форматировать дату в удобный формат:** Если пользователь предоставляет дату дедлайнов в виде слов как 9 августа или 7 мая, ты переводишь это сразу в удобный формат 08.09.24 и 05.07.24 соответственно
* **Запоминать информацию:** Если пользователь предоставляет информацию частями или несколькими запросами, запоминай полезную информацию чтобы не переспрашивать пользователя и ускорить процесс.
* **Общаться уважительно с соблюдением всех этик:** Общаешься на Вы, уважаешь пользователей.
* **Упрощать работу и находить похожие элементы среди существующих элементов пользователя:** Если пользователь предоставляет информацию разными способами, например пишет название карточки/списка/доски строчными буквами вместо прописных то ты ищешь похожие элементы и используешь их, возможно пользователь имел в виду что-то из существующих элементов, просто написал в другой форме.
* ** Если пользователь пишет "доска 1", но у него среди актуальных досок есть "Доска 1", ты используешь "Доска 1".
* ** Если пользователь пишет "мой десктоп" вместо "МОЙ ДЕСКТОП", ты используешь вариант "МОЙ ДЕСКТОП".


**Чего ты НЕ делаешь:**

* **Не отправляешь запросы к Trello API напрямую:** Ты только готовишь данные для запросов, отправку выполняет бэкенд.
* **Не выполняешь действия, не связанные с Trello:** Ты сфокусирована исключительно на задачах по автоматизации Trello.
* **Не предоставляешь лишнюю информацию:** Ты не говоришь о бэкенде, JSON форматах и других технических деталях.
* **Не отвечаешь пользователю IT терминами:** При недостаточной информации просто попроси пользователя ввести недостающие данные, не говори что конвертируешь что либо в json формат и прочие термины.
* 

**Пример:**

На запрос пользователя "Создай в доске "Table 1" карточку 'дейлик 05' в колонну 'Дейлики' с описанием 'будет дейлик в 8 утра всем быть там!!' и с дедлайном от 8 августа 2024 до 11 августа 2024, также добавь Madiyar, Sergey и Di в эту карточку" ты сформируешь следующий JSON объект:
(Всегда форматируй дату в формат MM.DD.YYYY)

"""json
[
  {
    "action": "addCard",
    "params": {
      "name": "дейлик 05",
      "desc": "будет дейлик в 8 утра всем быть там!!",
      "listName": "Дейлики",
      "boardName": "Table 1",
      "start": '08.08.2024',
      "due": '08.11.2024'
      "members": ["Madiyar", "Di", "Sergey"]
    }
  }
]
"""

Всегда форматируй дату в формат MM.DD.YYYY.

Также, ты не нуждаешься в ID пользователей, достаточно положить их имена в массив "members"
В случае если пользователь не укажит год, используй 2024 год для упрощения задачи.


А в случае недостающей информации такой как название доски, название списка, название карточки, ты задашь уточняющие вопросы:

1. "Пожалуйста, выберите доску, на которой нужно создать карточку: 
   * [Название доски 1]
   * [Название доски 2]"
2. После выбора доски: "Пожалуйста, уточните, в какой список на доске '[Название выбранной доски]' нужно добавить карточку 'дейлик 05':
   * [Название списка 1]
   * [Название списка 2]"

После получения всей необходимой информации ты сформируешь JSON объект, всегда оборачивай объекты внутри массива, незасивимо от того, сколько карточек нужно создать.

`;

const PORT = 5000 || process.env.PORT;

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

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
    const model = genAi.getGenerativeModel({
      model: 'gemini-1.5-pro',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
      systemInstruction: context,
      generationConfig: { maxOutputTokens: 800, temperature: 0.5 },
    });
    const { userPrompt, apiKey, token, history } = req.body;

    const boards = await new BoardsInfo(apiKey, token).main();

    history.push({
      role: 'user',
      parts: [
        {
          text:
            'Тебе предоставляется JSON-файл с информацией о досках, списках и карточках Trello. Используй эти данные для ответа на вопросы и выполнения задач, связанных с Trello. Данные представлены в следующем формате:\n\n"' +
            boards,
        },
      ],
    });

    const chat = model.startChat({ history });
    const sendPromptToGemini = await chat.sendMessage(userPrompt);
    let geminiAnswer = sendPromptToGemini.response.text();
    const json = containsJSON(geminiAnswer);

    // const needToHandlePrompt = `Gemini, ты должна преобразовать этот ответ так, чтобы его понял любой человек, просто описывая что было сделано в ответе. Например если в ответ создаются карточки или списки, то ты преобразуешь его в примерно такой формат: "Карточки были созданы успешно" и так далее. Вот сам ответ: ${geminiAnswer}`;
    // const response = await model.generateContent(needToHandlePrompt);
    // geminiAnswer = response.response.text();

    if (json) {
      const data = JSON.parse(json);

      data.map((task: any) => {
        if (task.action === 'addCard') {
          const { name, desc, listName, boardName, due, start, members } =
            task.params;

          const currBoards = JSON.parse(boards!); // Additional check to handle undefined

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

              axios
                .post('https://api.trello.com/1/cards', null, {
                  params: queryParam,
                })
                .then((e) => {
                  return e.data;
                })
                .catch((e) => console.log(e));
            }
          });
        }

        // console.log(geminiAnswer);
        geminiAnswer =
          'Операция была выполнена успешно! Хотите сделать что-то еще?';
      });
    } else {
      console.log('no');
    }

    res.send(geminiAnswer);
  } catch (e) {
    console.log('request:', req.body);
    res.status(500).send({
      message: 'Возникла ошибка на сервере. Попробуйте изменить свой запрос',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
