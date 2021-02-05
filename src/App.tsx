import { useState, useEffect  } from 'react';
import { useQuery } from 'react-query';

import { Wrapper, Head, Select  } from './styles/App.styles';
type BitCoinObj= {
  '15m': number,
  'last': number,
  'buy': number,
  'sell': number,
  'symbol': string
}

type Currencies = {
  [key: string]: BitCoinObj
} 
const getBitCoinsInfo = async (): Promise<Currencies> => {
  const x = await (await fetch('https://blockchain.info/ticker')).json()
  return x;
}

const intervalTime = 30000; // 30s

const App = () => {
  const { data, isLoading, error, refetch } = useQuery<Currencies>('bcList', getBitCoinsInfo)
  const [currency, setCurrency] = useState('USD')

  console.log('bcList', data)
  console.log('Re-fetching data ...')
  const handleCurrencySelection = (e: any) => {
    setCurrency(e.currentTarget.value)
  }

  useEffect(() => {
    const fetchInterval = setInterval(refetch, intervalTime)
    return () => clearInterval(fetchInterval)
    
  }, [refetch])
  
  if (isLoading) return <div>Loading ...</div>
  if (error) return <div>Something went wrong ...</div>
  return (
    <Wrapper>
      <Head>Bitcoin Prices</Head>
      {
        data && (
          <>
            <Select value={currency} onChange={handleCurrencySelection}>
              {
                Object.keys(data).map(currency => (<option key={currency} value={currency}>{currency}</option>))
              }
            </Select>
            <div>
              <h2>
                {data[currency].symbol}
                {data[currency].last}
              </h2>
            </div>
          </>
        )
      }
      
    </Wrapper>
  );
}

export default App;
