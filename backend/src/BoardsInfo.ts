import Trello from 'trello';

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

class BoardsInfo {
  private trello: any;

  constructor(apiKey: string, token: string) {
    this.trello = new Trello(apiKey, token);
  }

  async getBoardsInfo(): Promise<Board[]> {
    try {
      const boardsData = await new Promise<any[]>((resolve, reject) => {
        this.trello.getBoards('me', (err, data) =>
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
              this.trello.getListsOnBoard(board.id, 'name', (err, lists) =>
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
            console.error(`Error fetching lists for board ${board.name}:`, err);
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
                  this.trello.getCardsOnList(list.id, (err, cards) =>
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
            console.error(`Error fetching cards for board ${board.name}:`, err);
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

  async main() {
    try {
      const boardsInfo = await this.getBoardsInfo();
      const textData = JSON.stringify(boardsInfo, null, 2);
      return textData;
    } catch (err) {
      console.error('Main function error:', err);
    }
  }
}

export { BoardsInfo };
