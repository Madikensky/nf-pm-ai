interface TrelloBoard {
  id: string;
  name: string;
}

interface TrelloList {
  id: string;
  name: string;
  boardId: string;
}

interface TrelloCard {
  id: string;
  name: string;
  desc?: string;
  idList: string;
}
