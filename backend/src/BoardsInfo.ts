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
    await this.delay(1000); // Delay to avoid hitting rate limits
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

      // Fetch all board details in one go
      const boardDetailsUrls = boards.map(
        (boardId) =>
          `https://api.trello.com/1/boards/${boardId}?key=${this.apiKey}&token=${this.token}`
      );
      const boardsData = await this.fetchAllData(boardDetailsUrls);

      // Fetch memberships and lists for all boards in one go
      const membershipsUrls = boards.map(
        (boardId) =>
          `https://api.trello.com/1/boards/${boardId}/memberships?key=${this.apiKey}&token=${this.token}`
      );
      const membershipsData = await this.fetchAllData(membershipsUrls);

      const listsUrls = boards.map(
        (boardId) =>
          `https://api.trello.com/1/boards/${boardId}/lists?key=${this.apiKey}&token=${this.token}`
      );
      const listsData = await this.fetchAllData(listsUrls);

      const boardsWithDetails: BoardWithDetails[] = await Promise.all(
        boardsData.map(async (boardData, index) => {
          const members = await Promise.all(
            membershipsData[index].map(async (member: any) => {
              const memberData = await this.getBoardData(
                `https://api.trello.com/1/members/${member.idMember}?key=${this.apiKey}&token=${this.token}`
              );
              return {
                memberId: memberData.id,
                memberName: memberData.fullName,
              };
            })
          );

          const lists = await Promise.all(
            listsData[index].map(async (list: any) => {
              const cards = await this.getBoardData(
                `https://api.trello.com/1/lists/${list.id}/cards?key=${this.apiKey}&token=${this.token}`
              );
              const cardDetails = cards.map((card: any) => ({
                cardName: card.name,
                cardId: card.id,
                cardMembers: card.idMembers,
              }));
              return {
                listName: list.name,
                listId: list.id,
                cards: cardDetails,
              };
            })
          );

          return {
            boardName: boardData.name,
            boardId: boardData.id,
            members,
            lists,
          };
        })
      );

      return boardsWithDetails;
    } catch (err) {
      console.error('Error fetching board info:', err);
      throw err;
    }
  }

  async main() {
    try {
      const boardsInfo = await this.getBoardsInfo();
      return JSON.stringify(boardsInfo, null, 2);
    } catch (err) {
      console.error('Main function error:', err);
    }
  }
}

export { BoardsInfo };
