import { useState } from "react";
import { useEffect } from "react";
import { ethers } from "ethers";

const DEFAULT_ADDRESS = "0xeC98b0c026EFDC1e88574dD2f72254B307C5315F";
// const URL =
//   "";
//   const GET_BAL = "https://api.etherscan.io/api?module=account&action=balance&address=0xeC98b0c026EFDC1e88574dD2f72254B307C5315F&tag=latest&apikey=95J8648BFGH495YZE2DXUMB54MSJGZFJMZ"
// const ACC_URL = "https://api.etherscan.io/api?module=account&action=txlist&address=0xeC98b0c026EFDC1e88574dD2f72254B307C5315F&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=95J8648BFGH495YZE2DXUMB54MSJGZFJMZ"
export default function Payments() {
  const [amount, setAmount] = useState(0);
  const [destinationAddress, setDestinationAddress] = useState(DEFAULT_ADDRESS);
  const [error, setError] = useState(""); //newline

  const [transaction, setTransaction] = useState(
    ethers.providers.TransactionResponse
  ); // new line


  const sendData = async(transaction_response) =>{
    const credentials = JSON.stringify({
      title: 'payment',
      crypto: transaction_response
      }
    );

    const response = await fetch('http://localhost:8000/crypto/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: credentials,
    })
    const data = await response.json();
    console.log(response.ok);
    console.log(data);
  }

  const startPayment = async (event) => {
    console.log({ amount, destinationAddress });

    event.preventDefault();

    try {
      if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
      }

      await window.ethereum.send("eth_requestAccounts");

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();
      const test_address = await signer.getAddress();
      console.log(test_address)

      ethers.utils.getAddress(destinationAddress);

      const transactionResponse = await signer.sendTransaction({
        to: destinationAddress,

        value: ethers.utils.parseEther(amount.toString()),
      });
      console.log({transactionResponse})
      console.log(transactionResponse.hash);
      setTransaction(transactionResponse);

      sendData(transactionResponse)
      // const reciept = await fetch(
      //   `https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${transactionResponse.hash}&apikey=95J8648BFGH495YZE2DXUMB54MSJGZFJMZ`
      // );
      // const data = await reciept.json();
      // console.log(data);
      //   const accHistory = await fetch(ACC_URL)
      //   const accData = await accHistory.json()
      //   console.log(accData)


      // const balance = await fetch(GET_BAL)
      // const bal_data = await balance.json()
      // console.log(bal_data)


    } catch (error) {
      console.log({ error });
      setError(error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="amount"
        value={amount}
        onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
      />
      <input
        type="text"
        placeholder="destination address"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value)}
      />
      <button onClick={startPayment}>Send Payment</button>
      {transaction && <div role="alert">{JSON.stringify(transaction)}</div>}

      {error && <div role="alert">{JSON.stringify(error)}</div>}
    </div>
  );
}
