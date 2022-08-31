export interface Timestamp {
  epoch: number;
  unix: number;
  human: Date;
}

export interface Last {
  id: string;
  height: number;
  timestamp: Timestamp;
}

export interface Blocks {
  produced: number;
  last: Last;
}

export interface Production {
  approval: number;
}

export interface Forged {
  fees: string;
  rewards: string;
  total: string;
}

export interface IDelegate {
  payment?: any;
  share?: any;
  username: string;
  address: string;
  publicKey: string;
  votes: any;
  rank: number;
  isResigned: boolean;
  blocks: Blocks;
  production: Production;
  forged: Forged;
}
