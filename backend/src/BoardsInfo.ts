import axios from 'axios';

interface Member {
  memberId: string;
  memberName: string;
}

interface Card {
  cardName: string;
  cardId: string;
  cardMembers: string[];
}

interface List {
  listName: string;
  listId: string;
  cards: Card[];
}

interface BoardWithDetails {
  boardName: string;
  boardId: string;
  members: Member[];
  lists: List[];
}

class BoardsInfo {
  private apiKey: string;
  private token: string;

  constructor(apiKey: string, token: string) {
    this.apiKey = apiKey;
    this.token = token;
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async getBoardData(url: string) {
    await this.delay(0); // Reduce delay to half a second
    const response = await axios.get(url);
    return response.data;
  }

  private async fetchAllData(urls: string[]) {
    const results = await Promise.all(
      urls.map((url) => this.getBoardData(url))
    );
    return results;
  }

  async getBoardsInfo(): Promise<BoardWithDetails[]> {
    try {
      const memberData = await this.getBoardData(
        `https://api.trello.com/1/members/me?key=${this.apiKey}&token=${this.token}`
      );

      const boards = memberData.idBoards;
      // console.log(boards);

      // Fetch all board details in one go
      const boardDetailsUrls = boards.map(
        (boardId) =>
          `https://api.trello.com/1/boards/${boardId}?key=${this.apiKey}&token=${this.token}&lists=open&members=all&cards=visible`
      );
      const boardsData = await this.fetchAllData(boardDetailsUrls);

      const boardsWithDetails: BoardWithDetails[] = boardsData.map(
        (boardData: any) => {
          const members = boardData.members.map((member: any) => {
            return {
              memberId: member.id,
              memberName: member.fullName,
            };
          });

          const lists = boardData.lists.map((list: any) => {
            // console.log(boardData.id);
            return {
              listId: list.id,
              listName: list.name,
              listBoardId: list.idBoard,
              listBoardName: boardData.name,
              cards: boardData.cards
                .map((card: any) => {
                  if (card.idList === list.id) {
                    return {
                      cardId: card.id,
                      cardDescription: card.desc,
                      cardDueDate: card.due,
                      cardStartDate: card.start,
                      cardListId: card.idList,
                      cardName: card.name,
                      cardMembers: card.idMembers,
                    };
                  }
                })
                .filter((card: any) => card !== undefined),
            };
          });

          return {
            boardId: boardData.id,
            boardName: boardData.name,
            members,
            lists,
            // cards,
          };
        }
      );
      // console.log(boardsWithDetails);
      return boardsWithDetails;
    } catch (err) {
      console.error('Error fetching board info in BoardsInfo.ts file');
      throw err;
    }
  }

  async main() {
    try {
      const boardsInfo = await this.getBoardsInfo();
      // console.log(JSON.stringify(boardsInfo, null, 2));
      return JSON.stringify(boardsInfo, null, 2);
    } catch (err) {
      console.error('Main function error in BoardsInfo.ts file');
    }
  }
}

export { BoardsInfo };
