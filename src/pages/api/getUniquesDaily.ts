import { NextApiRequest, NextApiResponse } from 'next';
import { format, startOfYesterday, sub, add } from 'date-fns';
const axios = require('axios');

export const getUniquesDaily = async () => {
  const bitQueryAPI = process.env.BITQUERY_API_KEY;
  const startYesterday = startOfYesterday();
  const yesterdayMore = add(startYesterday,{days:1});
  const subDays = sub(startYesterday,{days:30});
  const formatedSub = format(subDays,'yyyy-MM-dd');
  const formated = format(yesterdayMore,'yyyy-MM-dd');
    
  var data = JSON.stringify({
    "query": "query ($network: EthereumNetwork!, $token: String!, $dateFormat: String!, $from: ISO8601DateTime, $till: ISO8601DateTime) {\n  ethereum(network: $network) {\n    transfers(\n      currency: {is: $token}\n      height: {gt: 0}\n      amount: {gt: 0}\n      date: {since: $from, till: $till}\n    ) {\n      date {\n        date(format: $dateFormat)\n      }\n      count: countBigInt(uniq: receivers)\n    }\n  }\n}\n",
    "variables": `{\"limit\":40,\"offset\":0,\"network\":\"bsc\",\"token\":\"0x6dd60afb2586d31bf390450adf5e6a9659d48c4a\",\"from\":\"${formatedSub}\",\"till\":\"${formated}T23:59:59\",\"dateFormat\":\"%Y-%m-%d\"}`
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

  const listUniques = await axios(config)
  .then(function (response: any) {
    const list = response.data.data.ethereum.transfers.map( (wallet: any) =>({
      date: format(new Date(wallet.date.date), 'MM-dd'),
      uniques: parseFloat(wallet.count),
  }))
    return list
  })
  .catch(function (error: any) {
    console.log(error);
  });
  return listUniques
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (res: NextApiResponse) => {

  const listUniques = await getUniquesDaily();
  return res.end(listUniques)

};