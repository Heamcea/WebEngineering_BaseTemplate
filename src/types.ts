export interface Bear {
  name: string;
  binomial: string;
  range: string;
  fileName: string | null;
  imageUrl: string | null;
}

export type BearState =
  | { status: 'loading' }
  | { status: 'success'; bears: Bear[] }
  | { status: 'empty' }
  | { status: 'error'; message: string };
