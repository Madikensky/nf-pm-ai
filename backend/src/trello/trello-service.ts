import Trello from 'trello';
import { TrelloBoard, TrelloCard, TrelloList } from './trello-model';

class TrelloService {
  private trello: Trello;

  constructor() {
    this.trello = new Trello(
      process.env.TRELLO_API_KEY,
      process.env.TRELLO_API_TOKEN
    );
  }

  async getBoards(): Promise<TrelloBoard[]> {
    return await this.trello.getBoards('me', (err: Error, data: any) => {
      if (err) {
        throw new Error('Error getting boards');
      }
      return data;
    });
  }

  // other functions...
}

export default TrelloService;
