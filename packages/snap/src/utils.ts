/* eslint-disable jsdoc/match-description */
/**
 * Returns a EIP155 chain id number from a CAIP2 chain id string
 * https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-2.md
 *
 *@param chainId - the CAIP2 chainid, e.g eip155:5
 * @returns the EIP155 chain id
 */
export const getEIP155ChainId = (chainId: string) => {
  const chainIdNumber = Number(chainId.split(':')[1]);
  return chainIdNumber || 0;
};
