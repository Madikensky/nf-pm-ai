const Trello = require('trello');
require('dotenv').config();

const trello = new Trello(
  process.env.TRELLO_API,
  process.env.TRELLO_AUTH_TOKEN
);

async function getBoardsInfo() {
  try {
    const boardsData = await new Promise((resolve, reject) => {
      trello.getBoards('me', (err, data) =>
        err ? reject(err) : resolve(data)
      );
    });

    const boards = boardsData.map((board) => ({
      name: board.name,
      id: board.id,
      lists: [],
    }));

    const boardsWithLists = await Promise.all(
      boards.map(async (board) => {
        try {
          const lists = await new Promise((resolve, reject) => {
            trello.getListsOnBoard(board.id, 'name', (err, lists) => {
              err ? reject(err) : resolve(lists);
            });
          });
          board.lists = lists.map((list) => ({
            name: list.name,
            id: list.id,
            cards: [],
          }));
          // board.lists = lists.map((list) => list.name);
          return board;
        } catch (err) {
          console.error(`Error fetching lists for board ${board.name}:`, err);
        }
      })
    );

    const boardsWithListsAndCards = await Promise.all(
      boardsWithLists.map(async (board) => {
        try {
          await Promise.all(
            board.lists.map(async (list) => {
              const cards = await new Promise((resolve, reject) => {
                trello.getCardsOnList(list.id, (err, cards) => {
                  err ? reject(err) : resolve(cards);
                });
              });

              list.cards = cards.map((card) => ({
                name: card.name,
                id: card.id,
              }));
            })
          );
          return board;
        } catch (err) {
          console.error(`Error fetching cards for board ${board.name}:`, err);
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
    return textData;
    // console.log(textData);
  } catch (err) {
    console.error('Main function error:', err);
  }
}

// trello.addCard(
//   'test_card2',
//   'no description',
//   '667acb0f9a6427b08e9f937f',
//   (err, data) => {
//     if (err) throw new Error('Err');
//     console.log(data);
//   }
// );

module.exports = main;
