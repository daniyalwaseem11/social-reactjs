import React, { useState, useEffect } from "react";
import Auction from "./Auction";
import Web3 from "web3";
import contractABI from "./contractABI";
import "./styles.css";
import ArialFont from "./Arialn.ttf";
import LaziImage from "./lazi.jpeg";

import { AuthContext } from "src/context/Auth";
import { MdPhoto, MdAddToPhotos } from "react-icons/md";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ApiConfig from "src/ApiConfig/ApiConfig";
import { toast } from "react-toastify";
import axios from "axios";
// import { createCanvas, registerFont } from "canvas";
import { createCanvas, loadImage, registerFont } from "canvas";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Paper, InputAdornment } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  snackbarMessage: {
    backgroundColor: "#e70c9b",
    color: "#dfff4e",
    fontWeight: "bold",
    borderRadius: "20px",
    padding: "10px 20px",
    boxShadow: theme.shadows[5],
    fontSize: "1.5rem",
    "& .MuiSnackbarContent-message": {
      fontSize: "4rem",
      textAlign: "center",
    },
    "& .MuiSnackbarContent-action": {
      marginRight: 0,
    },
    "& svg": {
      color: "#dfff4e",
      fontSize: "2.5rem",
      marginRight: "10px",
    },
  },

  alertIcon: {
    marginRight: "8px",
  },
  warningContainer: {
    backgroundColor: "E70C9B",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  warningMessage: {
    backgroundColor: "E70C9B",
    padding: 0,
    margin: 0,
    color: "#E70C9B",
    fontSize: "1.2rem",
    fontWeight: 400,
    textAlign: "center",
    maxWidth: "90%",
  },
}));

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
// mainnet
const contractAddress = "0x427C689E1d2eB7df41a14e0199609DA49e610A75"; // Replace with your contract address
//testnet
// const contractAddress = "0x775ceD56009D79460e092581Ec2DD1c75631025a"; // Replace with your contract address
// const contractAddress = "0xB4EF36f15F225A0c4244CA5Abd5C5c2c03321092"; // Replace with your contract address
// const contract = new web3.eth.Contract(contractABI, contractAddress);

const generateNftImage = async (domainName) => {
  // Load the background image
  const bgImage = await loadImage(LaziImage);

  // Create a canvas
  const canvas = createCanvas(bgImage.width, bgImage.height);
  const ctx = canvas.getContext("2d");

  // Draw the background image on the canvas
  ctx.drawImage(bgImage, 0, 0);

  // Register the font that you want to use
  // registerFont(ArialFont, { family: "Arial" });
  ctx.font = "60px Arial";

  const textWidth = ctx.measureText(domainName).width;
  const x = (canvas.width - textWidth) / 2;
  const y = canvas.height - 80;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(domainName, x, y);

  // Convert the canvas to a data URL
  const dataUrl = canvas.toDataURL();

  return dataUrl;
};

const NFTDomain = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("xs"));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [laziNames, setLaziNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkboxColor, setCheckboxColor] = useState("red");
  const [mintedDomain, setMintedDomain] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMint, setIsLoadingMint] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [isMinted, setIsMinted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  // Define a state variable to store the list of minted domain names
  const [mintedDomainNames, setMintedDomainNames] = useState([]);
  // When the component mounts, convert the minted domain names to images and store them in state
  const [images, setImages] = useState([]);
  const [domains, setDomains] = useState([
    "steve.lazi",
    "jhons.lazi",
    "thomsan.lazi",
    "adam.lazi",
    "smith.lazi",
  ]);
  const [imageUrls, setImageUrls] = useState([]);
  const [cimages, setImagesc] = useState([]);

  const [exist, setExist] = useState(false);

  const [len, setLen] = useState(false);

  const [url, setUrl] = useState("https://images.app.goo.gl/RwQ4YFT2CCENspHp8");

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    setLoading(true);
    if (data.includes(e.target.value)) {
      setCheckboxColor("green");
      setExist(true);
      setLen(e.target.value.length);
    } else {
      setCheckboxColor("red");
      setExist(false);
    }

    try {
      const domain = await getMintedLaziDomain(searchTerm);
      if (domain) {
        setMintedDomain(domain);
        setSuccess(true);
        setMessage("Domain found!");
      } else {
        setMintedDomain(null);
        setSuccess(false);
        setMessage("Domain not found.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const domainName = e.target.value;
    if (domainName.trim().length === 0) {
      // The input field is empty, disable the "mint" button
      setIsDisabled(true);
      setIsMinted(false);
      setSearchTerm(""); // Reset the search term to empty string
      return;
    }
    setSearchTerm(domainName);

    try {
      const { accounts, contract } = await initContract();
      setIsLoading(true);
      const isMinted = await contract.methods.isMinted(domainName).call();

      if (isMinted) {
        setIsMinted(true);
        setIsDisabled(true);
        setIsLoading(false);
      } else {
        setIsMinted(false);
        setIsDisabled(false);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  let accounts = [];

  const initContract = async () => {
    try {
      // await window.ethereum.enable(); // prompt user to connect their wallet
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      return { web3, accounts, contract };
    } catch (error) {
      console.error(error);
    }
  };

  // call the function before interacting with the smart contract
  const handleBuyLaziName = async (e) => {
    e.preventDefault();
    try {
      setIsLoadingMint(true);
      const { web3, accounts, contract } = await initContract();
      const isMinted = await contract.methods.isMinted(searchTerm).call();
      if (isMinted) {
        setIsMinted(true);
        setIsDisabled(true);
        setIsLoadingMint(false);
        return;
      }

      console.log({ accounts });
      console.log({ contract });

      try {
        try {
          const _qty = 1; // Replace with your desired quantity

          const nftPrice = await contract.methods
            .getPrice(_qty)
            .call({ from: accounts[0] });
          // const nftPrice = 1;
          console.log("Token Price : ", nftPrice);

          const gasEstimate = await contract.methods
            .buyLaziNames([searchTerm])
            .estimateGas({
              from: accounts[0],
              value: nftPrice,
            });

          const result = await contract.methods
            .buyLaziNames([searchTerm])
            .send({
              from: accounts[0],
              gas: gasEstimate,
              maxPriorityFeePerGas: web3.utils.toWei("32","gwei"),
              value: nftPrice,
            });

          // Handle the result of the transaction
          console.log("Transaction successful:", result);
          toast.success("UserName Minted Success. Now Saving!");
        } catch (error) {
          setIsMinted(false);
          setIsLoadingMint(false);
          setSearchTerm("");
          console.log(error);
          let errorMessage = "An error occurred during the transaction.";

          if (error.message) {
            const startIndex = error.message.indexOf(" reverted: ") + 10;
            const endIndex = error.message.indexOf('",', startIndex);
            const Message = error.message.substring(startIndex, endIndex);
            toast.error(Message); // Display toast error message
            return; // Break the flow after displaying the specific error message
          }

          toast.error(errorMessage); // Display toast error message
          throw new Error(errorMessage); // Rethrow the error with custom message
        }
        const response = await axios({
          method: "POST",
          url: ApiConfig.createNftDomainName,
          headers: {
            token: localStorage.getItem("token"),
          },
          data: {
            domainName: searchTerm,
            ownerName: "Lazi",
            ownerAddress: accounts[0],
            // image: image,
          },
        });

        if (response.status === 200) {
          setIsMinted(true);
          setIsDisabled(true);
          setIsLoadingMint(false);
          setSearchTerm("");
          console.log("NFT domain created successfully");
          toast.success(` UserName Minted Success!`);
          getOwnerMintedLaziDomains();
        } else {
          console.log("Failed to create NFT domain");
          setIsLoadingMint(false);
          setSearchTerm("");
          toast.error(` Failed to mint UserName!`);
        }
      } catch (error) {
        console.log(error);
        setIsMinted(false);
        setIsLoadingMint(false);
        setSearchTerm("");
        toast.error(` Failed to mint UserName!`);
      }
    } catch (error) {
      console.error(error);
      setIsLoadingMint(false);
      setSearchTerm("");
      toast.error(` Failed to mint UserName!`);
    }
  };

  // function to fetch all minted lazi domains on owner wallet address
  const getOwnerMintedLaziDomains = async () => {
    try {
      const { accounts, contract } = await initContract();
      const mintedDomains = [];
      // Get the token IDs owned by the connected account
      const tokenIds = await contract.methods.tokensOfOwner(accounts[0]).call();
      console.log("tokenIDs: ", tokenIds);
      for (const tokenId of tokenIds) {
        const mintedDomain = await contract.methods
          .domainNameOf(tokenId)
          .call();
        mintedDomains.push(mintedDomain + ".lazi");
      }

      setLaziNames(mintedDomains);
      setMintedDomainNames(mintedDomains);
    } catch (error) {
      console.error(error);
    }
  };

  // function to search a specific minted lazi domainname:
  const getMintedLaziDomain = async (domainName) => {
    try {
      const { accounts, contract } = await initContract();
      const totalMinted = await contract.methods.totalSupply().call();

      for (let i = 0; i <= totalMinted; i++) {
        const mintedDomain = await contract.methods.domainNameOf(i).call();

        if (mintedDomain === domainName) {
          return mintedDomain;
        }
      }

      // Domain name not found
      return null;
    } catch (error) {
      console.error(error);
    }
  };

  // Define a function to convert the domain names to images
  const convertToImages = async () => {
    const images = [];

    for (const domainName of mintedDomainNames) {
      const imageUrl = await generateNftImage(domainName);
      images.push(imageUrl);
    }

    return images;
  };

  useEffect(() => {
    async function fetchMintedDomainNames() {
      await getOwnerMintedLaziDomains();
    }
    fetchMintedDomainNames();
    if (mintedDomainNames.length === 0) {
      displaySnackbar("Mint Your Web3 UserName!.");
    }
  }, []);
  useEffect(() => {
    async function convertMintedDomainNamesToImages() {
      const images = await convertToImages();
      setImages(images);
    }

    convertMintedDomainNamesToImages();
  }, [mintedDomainNames]);

  const convertToImagesCommunity = async () => {
    const imagesc = [];

    for (const img of domains) {
      const imageUrl = await generateNftImage(img);
      imagesc.push(imageUrl);
    }

    return imagesc;
  };

  useEffect(() => {
    async function convertMintedDomainNamesToImages() {
      const cimages = await convertToImagesCommunity();
      setImagesc(cimages);
    }

    convertMintedDomainNamesToImages();
  }, [domains]);

  //warning message function settings
  const displaySnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity="warning"
          className={classes.snackbarMessage}
        >
          <span className={classes.alertIcon}>
            <i className="fas fa-exclamation-triangle"></i>
          </span>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <div className="domain-body">
        <div className="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-6 MuiGrid-grid-md-6 MuiGrid-grid-lg-6">
          <h3 className="MuiTypography-root MuiTypography-h3">
            NFT Collection / User
          </h3>
        </div>
        <div className={classes.warningContainer}>
          <Paper className={classes.warningMessage}>
            <p>200 $LAZI Airdropped within 24 hrs After Minting</p>
          </Paper>
        </div>
        {/*  */}
        <div className="input-bg">
          {/* input + button flex - section */}
          <div className="input-flex">
            {isMinted ? (
              <div className={isDisabled ? "unavailable" : "available"}>
                {message}
              </div>
            ) : null}
            <TextField
              type="text"
              className="input"
              placeholder="Enter a UserName"
              value={searchTerm}
              onChange={(e) => {
                handleInputChange(e);
                setIsMinted(false);
                setIsDisabled(false);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <div style={{ display: "inline-block" }}>
                      {searchTerm.length > 0 && (
                        <span
                          style={{
                            position: "relative",
                            top: 0,
                            left: searchTerm.length * 8 + 40,
                            right: "1.75rem",
                            color: "#aaa",
                          }}
                        >
                          .lazi
                        </span>
                      )}
                    </div>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchTerm.length > 0 && (
                      <>
                        {isLoading ? (
                          <CircularProgress size={24} />
                        ) : isMinted ? (
                          <ErrorIcon style={{ color: "red" }} />
                        ) : (
                          <CheckCircleIcon style={{ color: "green" }} />
                        )}
                      </>
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <button
              className="button btx"
              onClick={handleBuyLaziName}
              disabled={isDisabled || searchTerm.length === 0}
              style={{ backgroundcolor: "#E31A89" }}
            >
              {isLoadingMint ? <CircularProgress size={24} /> : "Mint"}
            </button>
          </div>
          {/* input + button flex - section end */}

          {/* domains button url section */}
          {/* <div className="btn-domain-section">
            <button
              style={{ backgroundcolor: "#E31A89" }}
              className="button btn-1 btn-12 btn-y"
              onClick={getMintedLaziDomains}
            >
              Get Lazi Domains
            </button>
            {laziNames.length > 0 && (
              <ul className="domain-list">
                {laziNames.map((domain) => (
                  <li key={domain} className="domain-item">
                    <span className="domain-item-name">{domain}</span>
                    <span className="domain-item-owner">
                      Owner: {accounts[0]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div> */}
          {/* domains button url section end  */}

          {/* input b-g div end here  */}
        </div>

        {/* user detail section including name | domain | url */}
        <div className="user_domains">
          <h1>User Minted UserNames</h1>
        </div>
        <div>
          {mintedDomainNames.length > 0 ? (
            <div className="image-grid">
              {images.map((imageUrl, index) => (
                <div key={index} className="book">
                  <div className="cover">
                    <img
                      src={imageUrl}
                      alt={`Minted domain name ${index}`}
                      className="image"
                    />
                  </div>
                  {mintedDomainNames.map((index) => (
                    <p key={index}></p>
                  ))}

                  <p>{mintedDomainNames[index]}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={classes.warningContainer}>
              <Paper className={classes.warningMessage}>
                <p>
                  You don't have any minted UserNames. Please buy some UserNames
                  to display.
                </p>
              </Paper>
            </div>
          )}
        </div>

        <div className="user_domains">
          <h1>Community UserNames</h1>
        </div>
        <div className="image-grid">
          {cimages.map((imageUrls, index) => (
            <div key={index} className="book">
              <div className="cover">
                <img
                  src={imageUrls}
                  alt={`Minted domain name ${index}`}
                  className="image"
                />
              </div>
              {domains.map((index) => (
                <p key={index}></p>
              ))}

              <p>{domains[index]}</p>
            </div>
          ))}
        </div>

        <div className="card-body">
          <div className="card-img"></div>

          <div className="card-text"></div>
        </div>

        {/* user detail section including name | domain | url   ends here*/}

        {/* <div>
        <input
          type="text"
          placeholder="Enter a Domain"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>
          {loading ? "Loading..." : "Search"}
        </button>
        {success && <p className="success-message">{message}</p>}
        {!success && message && <p className="error-message">{message}</p>}
        {mintedDomain && (
          <p className="minted-message">{`The domain name ${mintedDomain} is already minted.`}</p>
        )}
      </div>  */}

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
            <p style={{ fontSize: 15, color: "red" }}>
              Domain Name Found Found
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default NFTDomain;
