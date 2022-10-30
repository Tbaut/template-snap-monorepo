import { useContext } from 'react';
import styled from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { sendContractTransaction } from '../utils';
import { SendTxButton, Card } from '../components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

export enum TransactionConstants {
  // The address of an arbitrary contract that will reject any transactions it receives
  Address = '0x08A8fDBddc160A7d5b957256b903dCAb1aE512C5',
  // Some example encoded contract transaction data
  UpdateWithdrawalAccount = '0x83ade3dc00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000047170ceae335a9db7e96b72de630389669b334710000000000000000000000006b175474e89094c44da98b954eedeac495271d0f',
  UpdateMigrationMode = '0x2e26065e0000000000000000000000000000000000000000000000000000000000000000',
  UpdateCap = '0x85b2c14a00000000000000000000000047170ceae335a9db7e96b72de630389669b334710000000000000000000000000000000000000000000000000de0b6b3a7640000',
}

export enum ContractAddresses {
  Uniswap = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  Storage = '0x0a2C2c75BbF27B45C92E3eF7F7ddFcC0720FDf66',
}

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleSendTxClick = async (address: string, data: string) => {
    try {
      await sendContractTransaction(address, data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };
  console.log('state', state);

  return (
    <Container>
      <Heading>
        Welcome to <Span>Trust score snap demo</Span>
      </Heading>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        <Card
          content={{
            title: 'Send Uniswap contract Tx',
            description: 'Display some insight data in Metamask.',
            button: (
              <SendTxButton
                onClick={() =>
                  handleSendTxClick(
                    ContractAddresses.Uniswap,
                    TransactionConstants.UpdateWithdrawalAccount,
                  )
                }
                disabled={false}
              />
            ),
          }}
          disabled={false}
          fullWidth={false}
        />

        <Card
          content={{
            title: 'Send Storage contract Tx',
            description: 'Display some insight data in Metamask.',
            button: (
              <SendTxButton
                onClick={() =>
                  handleSendTxClick(
                    ContractAddresses.Storage,
                    TransactionConstants.UpdateWithdrawalAccount,
                  )
                }
                disabled={false}
              />
            ),
          }}
          disabled={false}
          fullWidth={false}
        />
      </CardContainer>
    </Container>
  );
};

export default Index;
