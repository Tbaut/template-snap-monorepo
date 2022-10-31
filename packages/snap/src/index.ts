import { OnTransactionHandler } from '@metamask/snap-types';
import {
  getContractAgeScore,
  getContractInteractionScore,
  getContractTransactionCountScore,
  getContractVerificationScore,
} from './insights';
import {
  CalculateOverallScoreWithWeightArgs,
  TransactionObject,
} from './types';

const getColor = (result: number) => {
  switch (result) {
    case 3:
      return '🟩';
    case 2:
      return '🟧';
    default:
      return '🟥';
  }
};

const Weights = {
  contractUserTransactionScore: 1,
  contractTransactionCountScore: 3,
  contractAgeScore: 2,
  contractVerificationScore: 1,
};

const calculateOverallScoreWithWeight = ({
  contractTransactionCountScore,
  contractUserTransactionScore,
  contractAgeScore,
  contractVerificationScore,
}: CalculateOverallScoreWithWeightArgs) => {
  const totalWeitght = Object.values(Weights).reduce(
    (acc: number, curr: number) => acc + curr,
    0,
  );

  const overallScoreWithWeight =
    (contractUserTransactionScore.score * Weights.contractUserTransactionScore +
      contractTransactionCountScore.score *
        Weights.contractTransactionCountScore +
      contractAgeScore.score * Weights.contractAgeScore +
      contractVerificationScore.score * Weights.contractVerificationScore) /
    totalWeitght;

  return Math.floor(overallScoreWithWeight);
};

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const contractTransactionCountScore = await getContractTransactionCountScore({
    chainId,
    contractAddress: (transaction as TransactionObject).to,
  });

  const contractUserTransactionScore = await getContractInteractionScore({
    chainId,
    contractAddress: (transaction as TransactionObject).to,
    userAddress: (transaction as TransactionObject).from,
  });

  const contractAgeScore = await getContractAgeScore({
    chainId,
    contractAddress: (transaction as TransactionObject).to,
  });

  const contractVerificationScore = await getContractVerificationScore({
    chainId,
    contractAddress: (transaction as TransactionObject).to,
  });

  const overallScore = calculateOverallScoreWithWeight({
    contractTransactionCountScore,
    contractUserTransactionScore,
    contractAgeScore,
    contractVerificationScore,
  });

  return {
    insights: {
      '': `Trust score: ${getColor(overallScore)}`,
      ' ': '-----------------------------',
      'Contract popularity': `${getColor(
        contractTransactionCountScore.score,
      )} ${contractTransactionCountScore.description}`,
      'Previous interactions': `${getColor(
        contractUserTransactionScore.score,
      )} ${contractUserTransactionScore.description}`,
      'Contract age': `${getColor(contractAgeScore.score)} ${
        contractAgeScore.description
      }`,
      'Contract verification': `${getColor(contractVerificationScore.score)} ${
        contractVerificationScore.description
      }`,
    },
  };
};
