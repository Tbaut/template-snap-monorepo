/* eslint-disable jsdoc/match-description */
/* eslint-disable jsdoc/require-param-description */
import { apiKey, etherscanUrls, sourcifyBaseUrl } from './constants';
import {
  EtherscanResponse,
  IContractAgeScore,
  IContractTransactionCountScore,
  IContractUserTxScore,
  IContractVerifiedScore,
  IgetEtherscanContractTxs,
  ScoreResult,
  SourcifyResponse,
} from './types';
import { getEIP155ChainId } from './utils';

const fetchUrl = async <T>(url: string): Promise<T> => {
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

  const res = (await response.json()) as T;

  return res;
};

const getEtherscanVerificationUrl = ({
  chainId,
  contractAddress,
}: IContractVerifiedScore) => {
  return `${etherscanUrls[chainId]}api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
};

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

const getSourcifyVerificationUrl = ({
  chainId,
  contractAddress,
}: IContractVerifiedScore) => {
  const chainIdEIP155 = getEIP155ChainId(chainId);
  return `${sourcifyBaseUrl}check-by-addresses?addresses=${contractAddress}&chainIds=${chainIdEIP155}`;
};

/**
 * Gets a trust score for a contract based on previous user interactions
 * 3 -> 5 txs or more
 * 2 -> 1 < tx < 5
 * 1 -> tx < 2
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
  const { result } = await fetchUrl<EtherscanResponse>(url);

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
    description: 'fewer than 2 txs',
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
  const { result: result100 } = await fetchUrl<EtherscanResponse>(url100);

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
  const { result: result50 } = await fetchUrl<EtherscanResponse>(url50);

  // if there is a 50th tx
  if (result50.length === 1) {
    return {
      score: 2,
      description: 'more than 50 txs',
    };
  }

  return {
    score: 1,
    description: 'fewer than 49 txs',
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
  const { result } = await fetchUrl<EtherscanResponse>(url);

  const timeSinceCreation = new Date().getTime() / 1000 - result[0].timeStamp;

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

/**
 * Gets a trust score for a contract verification
 * 3 -> contract is verified
 * 1 -> contract is not verified
 *
 *@param options0
 * @param options0.chainId - the chainid to call etherscan with
 * @param options0.contractAddress - the contract address to check
 * @returns the score and a description
 */
export async function getContractVerificationScore({
  chainId,
  contractAddress,
}: IContractAgeScore): Promise<ScoreResult> {
  const etherscanUrl = getEtherscanVerificationUrl({
    chainId,
    contractAddress,
  });
  const { status: etherscanStatus } = await fetchUrl<EtherscanResponse>(
    etherscanUrl,
  );

  const isEtherscanVerified = Number(etherscanStatus) === 1;
  const sourcifyUrl = getSourcifyVerificationUrl({
    chainId,
    contractAddress,
  });

  const sourcifyRes = await fetchUrl<SourcifyResponse>(sourcifyUrl);
  const isSourcifyVerified = sourcifyRes[0].status === 'perfect';

  if (isSourcifyVerified && isEtherscanVerified) {
    return {
      score: 3,
      description: 'verified',
    };
  }

  if (!isEtherscanVerified) {
    return {
      score: 2,
      description: 'not verified on Etherscan',
    };
  }

  if (!isSourcifyVerified) {
    return {
      score: 2,
      description: 'not verified on Sourcify',
    };
  }

  return {
    score: 1,
    description: 'not verified',
  };
}
