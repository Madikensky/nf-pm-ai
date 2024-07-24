import axios from 'axios';
import bodyParser from 'body-parser';
// import Trello from 'trello';

interface Card {
  name: string;
  cardId: string;
  cardMembers: string[];
}

interface List {
  name: string;
  listId: string;
  cards: Card[];
}

interface Board {
  name: string;
  id: string;
  lists: List[];
  members: string[];
}

class BoardsInfo {
  private trello: any;
  private apiKey: string;
  private token: string;

  constructor(apiKey: string, token: string) {
    this.apiKey = apiKey;
    this.token = token;
    // this.trello = new Trello(apiKey, token);
  }

  async getBoardsInfo() {
    try {
      const boards = await axios
        .get(
          `https://api.trello.com/1/members/me?key=${this.apiKey}&token=${this.token}`
        )
        .then((e) => e.data.idBoards);

      const boardsWithName = await Promise.all(
        boards.map(async (board: any) => {
          return await axios
            .get(
              `https://api.trello.com/1/boards/${board}?key=${this.apiKey}&token=${this.token}`
            )
            .then((e) => {
              return {
                boardName: e.data.name,
                boardId: e.data.id,
              };
            });
        })
      );

      const boardsWithMembers = await Promise.all(
        boardsWithName.map(async (board) => {
          return await axios
            .get(
              `https://api.trello.com/1/boards/${board.boardId}/memberships?key=${this.apiKey}&token=${this.token}`
            )
            .then(async (e) => {
              return {
                ...board,
                members: await Promise.all(
                  e.data.map(async (member: any) => {
                    const { idMember } = member;
                    return await axios
                      .get(
                        `https://api.trello.com/1/members/${idMember}?key=${this.apiKey}&token=${this.token}`
                      )
                      .then((e) => {
                        return {
                          memberId: e.data.id,
                          memberName: e.data.fullName,
                        };
                      });
                  })
                ),
              };
            });
        })
      );

      const boardsWithLists = await Promise.all(
        boardsWithMembers.map(async (board) => {
          return await axios
            .get(
              `https://api.trello.com/1/boards/${board.boardId}/lists?key=${this.apiKey}&token=${this.token}`
            )
            .then(async (e) => {
              return {
                ...board,
                lists: await Promise.all(
                  e.data.map(async (list: any) => {
                    return {
                      listName: list.name,
                      listId: list.id,
                      cards: await axios
                        .get(
                          `https://api.trello.com/1/lists/${list.id}/cards?key=${this.apiKey}&token=${this.token}`
                        )
                        .then((e) => {
                          return e.data.map((card: any) => {
                            // console.log(card);
                            return {
                              cardName: card.name,
                              cardId: card.id,
                              cardMembers: card.idMembers,
                            };
                          });
                        }),
                    };
                  })
                ),
              };
            });
        })
      );

      return boardsWithLists;
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
