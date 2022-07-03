import { useState } from "react";

export default function Coinbase() {
  const [val, setVal] = useState("");
  const clickHandler = async () => {
    let Client = require("coinbase").Client;

    let client = new Client({ apiKey: "API KEY", apiSecret: "API SECRET" });

    client.getAccount(
      "2bbf394c-193b-5b2a-9155-3b4732659ede",
      function (err, account) {
        account.transferMoney(
          { to: "58542935-67b5-56e1-a3f9-42686e07fa40", amount: "1" },
          function (err, tx) {
            console.log(tx);
          }
        );
      }
    );
  };
  return (
    <>
      <input type="number" value={val} onChange={setVal} />
      <button onClick={clickHandler}>click</button>
    </>
  );
}
