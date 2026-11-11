export interface Bear {
  id: string;
  name: string;
  binomial: string;
  range: string;
  imageUrl: string | null;
}

export type BearState =
  | { status: 'loading' }
  | { status: 'success'; bears: Bear[] }
  | { status: 'empty' }
  | { status: 'error'; message: string };
