export type TransactionObject = {
  from: string;
  to: string;
  nonce: string;
  value: string;
  data: string;
  gas: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  type: string;
  estimateSuggested: string;
  estimateUsed: string;
};

export type ScoreResult = {
  score: number;
  description: string;
};

export type IContractTransactionCountScore = {
  chainId: string;
  contractAddress: string;
};

export type IContractAgeScore = IContractTransactionCountScore;

export type IContractVerifiedScore = IContractTransactionCountScore;

export type IContractUserTxScore = {
  chainId: string;
  contractAddress: string;
  userAddress: string;
};

export type IgetEtherscanContractTxs = {
  txNumber: number;
} & IContractTransactionCountScore;

export type EtherscanResponse = {
  status: string;
  message: string;
  result: any[];
};

export type SourcifyResponse = {
  status: string;
  chainIds: string[];
  address: string;
}[];

export type CalculateOverallScoreWithWeightArgs = {
  contractTransactionCountScore: ScoreResult;
  contractUserTransactionScore: ScoreResult;
  contractAgeScore: ScoreResult;
  contractVerificationScore: ScoreResult;
};
