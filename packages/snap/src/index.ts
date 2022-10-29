import { OnTransactionHandler } from '@metamask/snap-types';
import {
  getContractInteractionScore,
  getContractTransactionCountScore,
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
};

const calculateOverallScoreWithWeight = ({
  contractTransactionCountScore,
  contractUserTransactionScore,
}: CalculateOverallScoreWithWeightArgs) => {
  const totalWeitght = Object.values(Weights).reduce(
    (acc: number, curr: number) => acc + curr,
    0,
  );

  console.log('total weight', totalWeitght);

  const overallScoreWithWeight =
    (contractUserTransactionScore.score * Weights.contractUserTransactionScore +
      contractTransactionCountScore.score *
        Weights.contractTransactionCountScore) /
    totalWeitght;

  console.log('overallScoreWithWeight', overallScoreWithWeight);
  console.log(
    'Math.floor(overallScoreWithWeight)',
    Math.floor(overallScoreWithWeight),
  );
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

  const overallScore = calculateOverallScoreWithWeight({
    contractTransactionCountScore,
    contractUserTransactionScore,
  });

  return {
    insights: {
      '': `Trust score: ${getColor(overallScore)}`,
      ' ': '-----------------------------',
      'Contract popularity': `${getColor(
        contractTransactionCountScore.score,
      )} ${contractTransactionCountScore.description}`,
      'Previous interractions': `${getColor(
        contractUserTransactionScore.score,
      )} ${contractUserTransactionScore.description}`,
    },
  };
};
