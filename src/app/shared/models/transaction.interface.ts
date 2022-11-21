export interface Timestamp {
  epoch: number;
  unix: number;
  human: Date;
}

export interface ITransaction {
  id: string;
  blockId: string;
  version: number;
  type: number;
  typeGroup: number;
  amount: string;
  fee: string;
  sender: string;
  senderPublicKey: string;
  recipient: string;
  signature: string;
  vendorField: string;
  confirmations: number;
  timestamp: Timestamp;
  nonce: string;
}
