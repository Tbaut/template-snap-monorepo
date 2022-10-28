// import { OnRpcRequestHandler } from '@metamask/snap-types';
import { OnTransactionHandler } from '@metamask/snap-types';
import { getInsights } from './insights';

// type TransactionObject = {
//   from: string;
//   to: string;
//   nonce: string;
//   value: string;
//   data: string;
//   gas: string;
//   maxFeePerGas: string;
//   maxPriorityFeePerGas: string;
//   type: string;
//   estimateSuggested: string;
//   estimateUsed: string;
// };

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */

export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

// /**
//  * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
//  *
//  * @param args - The request handler args as object.
//  * @param args.origin - The origin of the request, e.g., the website that
//  * invoked the snap.
//  * @param args.request - A validated JSON-RPC request object.
//  * @returns `null` if the request succeeded.
//  * @throws If the request method is not valid for this snap.
//  * @throws If the `snap_confirm` call failed.
//  */
// export const onTransaction: OnRpcRequestHandler = ({ origin, request }) => {
//   switch (request.method) {
//     case 'hello':
//       return wallet.request({
//         method: 'snap_confirm',
//         params: [
//           {
//             prompt: getMessage(origin),
//             description:
//               'This custom confirmation is just for display purposes.',
//             textAreaContent:
//               'But you can edit the snap source code to make it do something, if you want to!',
//           },
//         ],
//       });
//     default:
//       throw new Error('Method not found.');
//   }
// };

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  console.log('tx', transaction);
  console.log('chainId', chainId);

  return {
    // insights: await getInsights(transaction),
    insights: {
      '🟩 Overall result': 'good',
      details: '',
      '🟧 How often you interracted with this contract': 'good (2 times)',
      '🟥 Contract age': '(> 30 days)',
    },
  };
};
