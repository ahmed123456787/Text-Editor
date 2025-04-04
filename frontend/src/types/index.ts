export interface Collaborator {
  id: number;
  name: string;
  color: string;
  cursor: {
    x: number;
    y: number;
  };
}

export interface Document {
  id: number;
  name: string;
  lastEdited: string;
}

export interface Document {
  id: number;
  title: string;
  content: string;
  last_updated: string;
  version: number;
  starred: boolean | true;
}
