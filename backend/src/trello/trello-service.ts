import Trello from 'trello';

class TrelloService {
  private trello: Trello;

  constructor() {
    this.trello = new Trello(
      process.env.TRELLO_API_KEY,
      process.env.TRELLO_API_TOKEN
    );
  }

  async getBoards() {
    return await this.trello.getBoards('me', (err, data) => {
      if (err) {
        throw new Error('Error getting boards');
      }
      return data;
    });
  }
}
