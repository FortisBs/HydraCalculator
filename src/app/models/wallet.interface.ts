export interface IWallet {
  address: string;
  publicKey: string;
  nonce: string;
  balance: string;
  attributes: {
    vote: string;
  };
  isDelegate: boolean;
  isResigned: boolean;
  vote: string;
}
