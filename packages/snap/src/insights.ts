/* eslint-disable jsdoc/match-description */
/* eslint-disable jsdoc/require-param-description */
import { apiKey, etherscanUrls } from './constants';
import {
  EtherScanResponse,
  IContractTransactionCountScore,
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

const getEtherscanContractTxs = ({
  txNumber,
  chainId,
  contractAddress,
}: IgetEtherscanContractTxs) => {
  return `${etherscanUrls[chainId]}api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}&page=${txNumber}&offset=1`;
};

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
  const url100 = getEtherscanContractTxs({
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

  const url50 = getEtherscanContractTxs({
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
