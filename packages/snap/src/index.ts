import { OnTransactionHandler } from '@metamask/snap-types';
import { getContractTransactionCountScore } from './insights';
import { TransactionObject } from './types';

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

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  console.log('tx', transaction);
  console.log('chainId', chainId);
  const contractTransactionCountScore = await getContractTransactionCountScore({
    chainId,
    contractAddress: (transaction as TransactionObject).to,
  });

  return {
    insights: {
      'Overall result': 'good',
      'Contract Transaction Count Score': `${getColor(
        contractTransactionCountScore.score,
      )} ${contractTransactionCountScore.description}`,
    },
  };
};
