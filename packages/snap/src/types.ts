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

export type IContractUserTxScore = {
  chainId: string;
  contractAddress: string;
  userAddress: string;
};

export type IgetEtherscanContractTxs = {
  txNumber: number;
} & IContractTransactionCountScore;

export type EtherScanResponse = {
  status: string;
  message: string;
  result: any[];
};

export type CalculateOverallScoreWithWeightArgs = {
  contractTransactionCountScore: ScoreResult;
  contractUserTransactionScore: ScoreResult;
};
