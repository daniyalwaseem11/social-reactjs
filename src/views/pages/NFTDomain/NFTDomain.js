import React, { useState } from "react";
import Auction from "./Auction";
import Web3 from "web3";
import contractABI from "./contractABI";

const data = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "Auction",
  "Bidding",
];
const fruits = [
  { name: "Apple", url: "https://via.placeholder.com/100x100" },
  { name: "Banana", url: "https://via.placeholder.com/100x100" },
  { name: "Cherry", url: "https://via.placeholder.com/100x100" },
  { name: "Date", url: "https://via.placeholder.com/100x100" },
  { name: "Elderberry", url: "https://via.placeholder.com/100x100" },
];

// Create a new Web3 instance
const web3 = new Web3(window.ethereum);

// Get the account address of the current user
// web3.eth.getAccounts()
//   .then(accounts => {
//     const account = accounts[0];
//     console.log(`Current user account: ${account}`);
//   });

// Instantiate the contract object with your ABI and contract address
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138"; // Replace with your contract address
// const contract = new web3.eth.Contract(contractABI, contractAddress);

const NFTDomain = () => {
  const [laziNames, setLaziNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkboxColor, setCheckboxColor] = useState("red");

  const [exist, setExist] = useState(false);

  const [len, setLen] = useState(false);

  const [url, setUrl] = useState("https://images.app.goo.gl/RwQ4YFT2CCENspHp8");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (data.includes(e.target.value)) {
      setCheckboxColor("green");
      setExist(true);
      setLen(e.target.value.length);
    } else {
      setCheckboxColor("red");
      setExist(false);
    }
  };

  const initContract = async () => {
    try {
      await window.ethereum.enable(); // prompt user to connect their wallet
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      return { web3, accounts, contract };
    } catch (error) {
      console.error(error);
    }
  };

  // call the function before interacting with the smart contract
  const handleBuyLaziName = async () => {
    try {
      const { web3, accounts, contract } = await initContract();
      const result = await contract.methods.buyLaziName(searchTerm).send({
        from: accounts[0],
        value: web3.utils.toWei("0.01", "ether"), // specify the amount of ether to send
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  // function to fetch minted lazi domains on wallet address
  const getMintedLaziDomains = async () => {
    try {
      const { accounts, contract } = await initContract();
      const domains = await contract.methods.getMintedLaziDomains().call({
        from: accounts[0],
      });
      console.log(domains);
      // update state or render domains on the webpage
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          placeholder="Enter a Domain"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            display: "flex",
            width: "400px",
            background: "black",
            color: "wheat",
            height: 40,
            fontSize: 18,
            borderColor: "white",
            borderWidth: 1,
            borderRadius: 10,
            paddingInline: 10,
          }}
        />
        <div
          style={{
            backgroundColor: checkboxColor,
            width: 30,
            height: 30,
            marginLeft: "20px",
            borderRadius: 15,
            marginTop: 5,
          }}
        />
        <button onClick={handleBuyLaziName}>Buy</button>
      </div>
      <div>
        <p>Your Minted LaziNames:</p>
        <ul>
          {laziNames.map((laziName) => (
            <li key={laziName}>{laziName}</li>
          ))}
        </ul>
      </div>
      {exist && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 15, color: "white" }}>Domain......Name</p>
          <div style={{ marginTop: 20, display: "flex" }}>
            <img
              src="https://www.shutterstock.com/image-illustration/domain-names-internet-web-telecommunication-260nw-1708219261.jpg"
              style={{ height: 200, width: 200 }}
              alt="img"
            />
            <img
              src="https://www.shutterstock.com/image-illustration/domain-names-internet-web-telecommunication-260nw-1708219261.jpg"
              style={{ height: 200, width: 200, marginLeft: 30 }}
              alt="img"
            />
            <img
              src="https://www.shutterstock.com/image-illustration/domain-names-internet-web-telecommunication-260nw-1708219261.jpg"
              style={{ height: 200, width: 200, marginLeft: 30 }}
              alt="img"
            />
          </div>
        </div>
      )}
      {!exist && len > 3 && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 15, color: "red" }}>Domain Name Found Found</p>
        </div>
      )}
    </div>
  );
};

export default NFTDomain;
