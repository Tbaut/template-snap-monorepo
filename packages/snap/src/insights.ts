/* eslint-disable jsdoc/match-description */
/* eslint-disable jsdoc/require-param-description */
import { apiKey, etherscanUrls } from './constants';
import {
  EtherScanResponse,
  IContractAgeScore,
  IContractTransactionCountScore,
  IContractUserTxScore,
  IgetEtherscanContractTxs,
  ScoreResult,
} from './types';

const getResults = async (url: string) => {
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Unable to fetch url": ${response.status} ${response.statusText}.`,
    );
  }

  // The response is an array of objects, each with a "text_signature" property.
  const { result } = (await response.json()) as EtherScanResponse;

  return result;
};

// getEtherscanVerificationStatus = https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=0x0a2C2c75BbF27B45C92E3eF7F7ddFcC0720FDf66
// .status

//
const getEtherscanContractAgeUrl = ({
  chainId,
  contractAddress,
}: IContractAgeScore) => {
  return `${etherscanUrls[chainId]}api?module=account&action=txlist&address=${contractAddress}&apikey=${apiKey}&page=1&offset=1`;
};

const getEtherscanContractTxsUrl = ({
  txNumber,
  chainId,
  contractAddress,
}: IgetEtherscanContractTxs) => {
  return `${etherscanUrls[chainId]}api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}&page=${txNumber}&offset=1`;
};

const getEtherscanUserTxsUrl = ({
  userAddress,
  chainId,
}: IContractUserTxScore) => {
  return `${etherscanUrls[chainId]}api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
};

// const getEtherscanContractInfoUrl = ({
//   userAddress,
//   chainId,
// }: IContractUserTxScore) => {
//   return `${etherscanUrls[chainId]}api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
// };

/**
 * Gets a trust score for a contract based on previous user interactions
 * 3 -> 5 txs or more
 * 2 -> 1 < tx < 5
 * 1 -> tx < 1
 *
 *@param options0
 * @param options0.chainId - the chainid to call etherscan with
 * @param options0.contractAddress - the contract address to check
 * @param options0.userAddress - the user address
 * @returns the score and a description
 */
export async function getContractInteractionScore({
  chainId,
  contractAddress,
  userAddress,
}: IContractUserTxScore): Promise<ScoreResult> {
  const url = getEtherscanUserTxsUrl({
    userAddress,
    chainId,
    contractAddress,
  });
  const result = await getResults(url);

  const interactionCount: number = result.reduce(
    (acc: number, curr: Record<string, string>) => {
      return acc + (curr.to === contractAddress ? 1 : 0);
    },
    0,
  );

  if (interactionCount > 5) {
    return {
      score: 3,
      description: 'more than 5 interactions',
    };
  }

  if (interactionCount > 1) {
    return {
      score: 2,
      description: 'more than 1 interaction',
    };
  }

  return {
    score: 1,
    description: 'less than 2 txs',
  };
}

/**
 * Gets a trust score for a contract
 * 3 -> 100 txs or more
 * 2 -> 50 < tx < 99
 * 1 -> tx < 49
 *
 *@param options0
 * @param options0.chainId - the chainid to call etherscan with
 * @param options0.contractAddress - the contract address to check
 * @returns the score and a description
 */
export async function getContractTransactionCountScore({
  chainId,
  contractAddress,
}: IContractTransactionCountScore): Promise<ScoreResult> {
  const url100 = getEtherscanContractTxsUrl({
    txNumber: 100,
    chainId,
    contractAddress,
  });
  const result100 = await getResults(url100);

  // if there is a 100th tx
  if (result100.length === 1) {
    return {
      score: 3,
      description: 'more than 100 txs',
    };
  }

  const url50 = getEtherscanContractTxsUrl({
    txNumber: 50,
    chainId,
    contractAddress,
  });
  const result50 = await getResults(url50);

  // if there is a 50th tx
  if (result50.length === 1) {
    return {
      score: 2,
      description: 'more than 50 txs',
    };
  }

  return {
    score: 1,
    description: 'less than 49 txs',
  };
}

/**
 * Gets a trust score for a contract age
 * 3 -> more than 2 month old
 * 2 -> more than 1 month old but less than 2 months old
 * 1 -> less than 1 month old
 *
 *@param options0
 * @param options0.chainId - the chainid to call etherscan with
 * @param options0.contractAddress - the contract address to check
 * @returns the score and a description
 */
export async function getContractAgeScore({
  chainId,
  contractAddress,
}: IContractAgeScore): Promise<ScoreResult> {
  const url = getEtherscanContractAgeUrl({
    chainId,
    contractAddress,
  });
  const result = await getResults(url);

  const timeSinceCreation = new Date().getTime() / 1000 - result[0].timeStamp;

  console.log(' result[0].timeStamp', result[0].timeStamp);
  console.log('timeSinceCreation', timeSinceCreation);

  const oneMonth = 3600 * 24 * 30;
  const twoMonths = oneMonth * 2;

  if (timeSinceCreation > twoMonths) {
    return {
      score: 3,
      description: 'more than 2 months old',
    };
  }

  if (timeSinceCreation > oneMonth) {
    return {
      score: 2,
      description: 'more than 1 month old',
    };
  }

  return {
    score: 1,
    description: 'less than 1 month old',
  };
}
