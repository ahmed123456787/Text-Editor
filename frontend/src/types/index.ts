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
