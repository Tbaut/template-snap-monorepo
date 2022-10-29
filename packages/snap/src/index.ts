import { OnTransactionHandler } from '@metamask/snap-types';
import { getContractTransactionCountScore } from './insights';

type TransactionObject = {
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
    // insights: await getInsights(transaction),
    insights: {
      'Overall result': 'good',
      'Contract Transaction Count Score': `${getColor(
        contractTransactionCountScore.score,
      )} ${contractTransactionCountScore.description}`,
    },
  };
};
