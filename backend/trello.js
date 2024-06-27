const Trello = require('trello');
const config = require('dotenv').config();

const apiKey = process.env.TRELLO_API;
const token = process.env.TRELLO_AUTH_TOKEN;

const trello = new Trello(apiKey, token);

const main = async () => {
  const getBoards = async () => {
    return new Promise((resolve, reject) => {
      trello.getBoards('me', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const boards = data.map((board) => ({
            name: board.name,
            id: board.id,
          }));
          resolve(boards);
        }
      });
    });
  };

  const boards = await getBoards();
  console.log(boards);

  boards.map((board) => {
    if (board.name === 'N!') {
      trello.getListsOnBoard(board.id, 'name', (err, data) => {
        if (err) {
          console.error(err);
        }
        data.forEach((list) => console.log(list.name));
      });
    }
  });
};

main();

// trello.getListsOnBoard('', 'name', (err, data) => {
//   if (err) {
//     console.error(err);
//   }
//   data.forEach((list) => console.log(list));
// });
