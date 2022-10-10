import { NextApiRequest, NextApiResponse } from 'next';
import { format, startOfYesterday, add } from 'date-fns';
const axios = require('axios');

export const getHotWallets = async () => {
  const bitQueryAPI = process.env.BITQUERY_API_KEY;
  const startYesterday = startOfYesterday();
  const yesterdayMore = add(startYesterday,{days:1});
  const formated = format(yesterdayMore,'yyyy-MM-dd');
    
  var data = JSON.stringify({
    "query": "query ($network: EthereumNetwork!, $token: String!, $limit: Int!, $offset: Int!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    transfers(\n      options: {desc: \"amount\", limit: $limit, offset: $offset}\n      date: {since: $from, till: $till}\n      amount: {gt: 0}\n      currency: {is: $token}\n    ) {\n      block {\n        timestamp {\n          time(format: \"%Y-%m-%d %H:%M:%S\")\n        }\n        height\n      }\n      sender {\n        address\n      }\n      receiver {\n        address\n      }\n      transaction {\n        hash\n      }\n      amount\n    }\n  }\n}\n",
    "variables": `{\n  \"limit\": 60,\n  \"offset\": 0,\n  \"network\": \"bsc\",\n  \"token\": \"0x6dd60afb2586d31bf390450adf5e6a9659d48c4a\",\n  \"from\": \"${formated}\",\n  \"till\": \"${formated}T23:59:59\",\n  \"dateFormat\": \"%Y-%m-%d\"\n}`
  });

  var config = {
    method: 'post',
    url: 'https://graphql.bitquery.io',
    headers: { 
      'Content-Type': 'application/json', 
      'X-API-KEY': `${bitQueryAPI}`
    },
    data : data
  };

  const listHot = await axios(config)
  .then(function (response: any) {
    const list = response.data.data.ethereum.transfers.map( (wallet: any) =>({
      sender: wallet.sender.address,
      receiver: wallet.receiver.address,
      amount: wallet.amount,
  }))
    return list
  })
  .catch(function (error: any) {
    console.log(error);
  });
  return listHot
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (res: NextApiResponse) => {

  const listHot = await getHotWallets();
  return res.end(listHot)

};