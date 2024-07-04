import { GoogleGenerativeAI } from '@google/generative-ai';
import Trello from 'trello';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import axios from 'axios';

interface Card {
  name: string;
  id: string;
}

interface List {
  name: string;
  id: string;
  cards: Card[];
}

interface Board {
  name: string;
  id: string;
  lists: List[];
}

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
    const closeBraceIndex = s.lastIndexOf(']');
    const ans = s.slice(openBraceIndex, closeBraceIndex + 1);
    return ans;
  } else if (s.includes('{') && s.includes('}') && s.includes('action')) {
    const openBraceIndex = s.indexOf('{');
    const closeBraceIndex = s.lastIndexOf('}');
    const ans = s.slice(openBraceIndex, closeBraceIndex + 1);
    return ans;
  } else {
    return '';
  }
};

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
    const model = genAi.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const { userPrompt, apiKey, token, history } = req.body;

    console.log(apiKey, '\n', token);

    const trello = new Trello(apiKey, token);

    async function getBoardsInfo(): Promise<Board[]> {
      try {
        const boardsData = await new Promise<any[]>((resolve, reject) => {
          trello.getBoards('me', (err, data) =>
            err ? reject(err) : resolve(data)
          );
        });

        const boards: Board[] = boardsData.map((board) => ({
          name: board.name,
          id: board.id,
          lists: [],
        }));

        const boardsWithLists = await Promise.all(
          boards.map(async (board) => {
            try {
              const lists = await new Promise<any[]>((resolve, reject) => {
                trello.getListsOnBoard(board.id, 'name', (err, lists) =>
                  err ? reject(err) : resolve(lists)
                );
              });
              board.lists = lists.map((list) => ({
                name: list.name,
                id: list.id,
                cards: [],
              }));
              return board;
            } catch (err) {
              console.error(
                `Error fetching lists for board ${board.name}:`,
                err
              );
              return board;
            }
          })
        );

        const boardsWithListsAndCards = await Promise.all(
          boardsWithLists.map(async (board) => {
            try {
              await Promise.all(
                board.lists.map(async (list) => {
                  const cards = await new Promise<any[]>((resolve, reject) => {
                    trello.getCardsOnList(list.id, (err, cards) =>
                      err ? reject(err) : resolve(cards)
                    );
                  });

                  list.cards = cards.map((card) => ({
                    name: card.name,
                    id: card.id,
                  }));
                })
              );
              return board;
            } catch (err) {
              console.error(
                `Error fetching cards for board ${board.name}:`,
                err
              );
              return board;
            }
          })
        );

        return boardsWithListsAndCards;
      } catch (err) {
        console.error('Error fetching board info:', err);
        throw err;
      }
    }

    async function main() {
      try {
        const boardsInfo = await getBoardsInfo();
        const textData = JSON.stringify(boardsInfo, null, 2);

        // Additional check to handle undefined
        // const currBoards = textData ? JSON.parse(textData) : null;

        return textData;
      } catch (err) {
        console.error('Main function error:', err);
      }
    }

    const boards: string | undefined = await main();

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
    let geminiAnswer = sendPromptToGemini.response.text();

    const json = containsJSON(geminiAnswer);

    if (json) {
      const data = JSON.parse(json);

      data.map((task: any) => {
        // console.log(task, '\n');

        if (task.action === 'addCard') {
          const { name, desc, listName, boardName, due, start, members } =
            task.params;

          const currBoards = JSON.parse(boards!); // Additional check to handle undefined

          currBoards.map((board: any) => {
            if (board.name === boardName) {
              const list = board.lists.find(
                (list: any) => list.name === listName
              );

              console.log(board);

              const listId = list.id;
              // console.log(listId, '\n');

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

              // console.log(queryParam);

              axios
                .post('https://api.trello.com/1/cards', null, {
                  params: queryParam,
                })
                .then((e) => {
                  // console.log(e.data);
                  return e.data;
                })
                .catch((e) => console.log(e));
            }
          });
        }
        geminiAnswer =
          'Запрос был обработан успешно. Хотите сделать что-то еще?';
      });
    } else {
      console.log('no');
    }

    console.log(json);
    // console.log(geminiAnswer);

    res.send(geminiAnswer);
  } catch (e) {
    res.status(500).send({ message: e });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
