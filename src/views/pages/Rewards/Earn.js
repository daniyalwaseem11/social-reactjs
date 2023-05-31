import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Checkbox,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  LinearProgress,
  withStyles,
  Tooltip,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ApiConfig from "src/ApiConfig/ApiConfig";
import { toast } from "react-toastify";
import initMetamask from "src/blockchain/metamaskConnection";
import initEngagementContract from "src/blockchain/engagementContract";
import initlaziTokenContract from "src/blockchain/laziTokenContract";
import initUserNameContract from "src/blockchain/laziUserNameContract";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { CgSpaceBetween } from "react-icons/cg";


const CustomBar = withStyles({
  root: {
    backgroundColor: "#E9E9E9",
    borderRadius: 4,
    height: 6,
  },
  bar: {
    backgroundColor: "#E71486",
    borderRadius: 4,
  },
})(LinearProgress);

const useStyles = makeStyles((theme) => ({
  checkbox: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  tooltipIconHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  tooltip: {
    backgroundColor: "secondary",
    textAlign: "center",
    fontSize: "14px",
  },
  sliderThumb: {
    transition: "transform 0.2s ease-out",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
  // checkboxContainer: {
  //   display: "grid",
  //   gridTemplateColumns: "repeat(2, 1fr)", // Two columns
  //   gap: theme.spacing(2), // Gap between items
  // },
  heading: {
    display: "flex",
  },
  head: {
    fontSize: 20,
    fontWeight: 600,
    whiteSpace: "nowrap",
    fontFamily: "Montserrat",
  },
  header: {
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "nowrap",
    fontFamily: "Montserrat",
  },

  bannerBox: {
    padding: "10px 0px 150px 0px",
    [theme.breakpoints.down("xs")]: {
      padding: "90px 0",
    },
    "& label": {
      color: "#e8aa3e",
      fontSize: "14px",
    },
  },
  root: {
    padding: "15px",
    [theme.breakpoints.down("xs")]: {
      padding: "10px",
    },
  },

  Buttonbox: {
    "& Button": {
      // padding: "11px 16px",
      borderRadius: "4px",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "bold",
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#EC167F",
      border: "none",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "0",
        // left: "-50%",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        transform: "translateX(-150%) skewX(-45deg)",
        animation: "$shining 1.5s ease-in-out infinite",
      },
    },
  },
  "@keyframes shining": {
    "0%": {
      transform: "translateX(-150%) skewX(-45deg)",
    },
    "100%": {
      transform: "translateX(150%) skewX(-45deg)",
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textFieldWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    // marginBottom: 24,
    width: "100%",
  },
  checboxText: {
    fontSize: 14,
    whiteSpace: "nowrap",
  },
  input: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      color: "white",
      borderRadius: 10,
      height: "40px",
      border: "1px solid #fff",
      fontSize: 12,
    },
  },
  inputLabel: {
    color: "#fff",
    fontWeight: 500,
    fontSize: 14,
    marginLeft: 12,
  },
  containerProgress: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // minHeight: "100vh",
  },
  progressBar: {
    width: 400,
    height: "10px",
    padding: theme.spacing(2),
  },
  progressValue: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(1),
    fontWeight: "bold",
  },
}));
const Earn = () => {
  const classes = useStyles();
  const [selectedOptions, setSelectedOptions] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedContribution, setSelectedContribution] = useState("");
  const [selectedContribution2, setSelectedContribution2] = useState("");
  const [selectedStakeScore, setSelectedStakeScore] = useState("");
  const [selectedMiningReward, setSelectedMiningReward] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [valueOfT, setValueOfT] = useState("");
  const [valueOfU, setValueOfU] = useState("");
  const [valueOfS, setValueOfS] = useState("");
  const [valueOfFinalMultiplier, setValueOfFinalMultiplier] = useState("");
  const [userRank, setUserRank] = useState("");
  const [userScore, setUserScore] = useState("");
  const [winReward, setWinReward] = useState("");
  const [remainingDays, setRemainingDays] = useState(2);
  const [engagementContract, setEngagementContract] = useState(null);
  const [userNameContract, setUserNameContract] = useState(null);
  const [laziTokenContract, setLaziTokenContract] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [selectedUserNames, setSelectedUserNames] = useState([]);
  const [mintedUserNames, setMintedUserNames] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [tokenStakeValue, setTokenStakeValue] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  // const [totalContribution, setTotalContribution] = useState(0);
  const [userContributionScore, setUserContributionScore] = useState(0);
  const [userStakedDuration, setUserStakedDuration] = useState(0);
  const [userStakedTokens, setUserStakedTokens] = useState(0);
  const [totalStakedLazi, setTotalStakedLazi] = useState(0);
  const [totalStakedDuration, setTotalStakedDuration] = useState(0);
  const [userStakedScore, setUserStakedScore] = useState(0);
  const [userDurationScore, setUserDurationScore] = useState(0);
  const [totalStakers, setTotalStakers] = useState(0);
  const [avgStakedLazi, setAvgStakedLazi] = useState(0);
  const [avgStakedDuration, setAvgStakedDuration] = useState(0);
  const[flexible,setFlexible]=useState(false)
const[locked,setLocked]=useState(false)
const[afterFlexible,setAfterFlexible]=useState(false)
const[afterLocked,setAfterLocked]=useState(false)



const handleGoBack = () => {
  setFlexible(false)
  setLocked(false)
};

const handleLockedButton=()=>{
  setLocked(!locked)
  setFlexible(false)
}

const handleFlexibleButton=()=>{
  setFlexible(!flexible)
  setLocked(false)
}



  const handleDayStake = (e) => {
    setSelectedTime(e.target.value);
  };
  const handleDayStakeButton = (weeks) => {
    setSelectedTime(weeks * 7);
  };

  const monthOptions = [
    { label: "90 Days (1.25x)", value: 90 },
    { label: "180 Days (1.5x)", value: 180 },
    { label: "365 Days (2x)", value: 365 },
    { label: "547 Days (1.75x)", value: 547 },
    { label: "730 Days (3.5x)", value: 730 },
  ];
  const calculateTotalMultiplier = () => {
    let multiplier = 1;

    if (selectedTime) {
      if (selectedTime >= 0 && selectedTime < 90) {
        multiplier += 0;
      } else if (selectedTime >= 90 && selectedTime < 180) {
        multiplier += 0.25;
      } else if (selectedTime >= 180 && selectedTime < 270) {
        multiplier += 0.5;
      } else if (selectedTime >= 270 && selectedTime < 360) {
        multiplier += 1;
      } else if (selectedTime >= 360 && selectedTime < 450) {
        multiplier += 1.5;
      } else if (selectedTime >= 450) {
        multiplier += 2;
      }
    }

    multiplier += 0.25 * selectedUserNames.length;
    return multiplier;
  };

  const totalMultiplier = calculateTotalMultiplier();

  useEffect(() => {
    const initialize = async () => {
      try {
        const { address } = await initMetamask();
        const engagementStaking = await initEngagementContract();
        const tokenContract = await initlaziTokenContract();
        const contractUserName = await initUserNameContract();
        setLaziTokenContract(tokenContract);
        setEngagementContract(engagementStaking);
        setUserNameContract(contractUserName);
        setUserAddress(address);
      } catch (error) {
        console.error("Contract initialization failed:", error);
      }
    };

    initialize();
    fetchScore();
  }, []);

  const handleStakeTokenChange = (event) => {
    setTokenStakeValue(event.target.value);
  };

  const handleCheckboxChange = (event, userName, tokenId) => {
    const selectedTokenId = event.target.value;
    console.log("Selected Token ID:", selectedTokenId);

    if (event.target.checked) {
      setSelectedUserNames((prevSelectedUserNames) => [
        ...prevSelectedUserNames,
        tokenId,
      ]);
    } else {
      setSelectedUserNames((prevSelectedUserNames) =>
        prevSelectedUserNames.filter((id) => id !== tokenId)
      );
    }
  };
  const handleDurationScoreChange = (event, newValue) => {
    setUserDurationScore(newValue);
  };
  const handleStakedScoreChange = (event, newValue) => {
    setUserStakedScore(newValue);
  };

  const isMobile = useMediaQuery("(max-width:600px)");
  // https://meet.google.com/tdr-grfk-vzg

  const fetchScore = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: ApiConfig.contributionScore,
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      const userScore = response.data.userScore;
      // setTotalContribution(totalContribution);
      setUserContributionScore(userScore);
      console.log(userScore);
      toast.success("Contribution score fetched successfully!");
    } catch (error) {
      console.error("Error fetching contribution score:", error.response);

      // Display error toast message
      toast.error("Error fetching contribution score. Please try again.");

      // Handle specific error scenarios
      if (error.response && error.response.status === 401) {
        console.log("Error 401");
      } else {
        console.log("Error Fetching Scores!!!");
      }
    }
  };

  //function to fetch UserNames
  const getOwnerMintedUserNames = useCallback(async () => {
    try {
      const mintedDomains = [];
      // Get the token IDs owned by the connected account
      const tokenIds = await userNameContract.methods
        .tokensOfOwner(userAddress)
        .call();
      console.log("tokenIDs: ", tokenIds);
      for (const tokenId of tokenIds) {
        const mintedDomain = await userNameContract.methods
          .domainNameOf(tokenId)
          .call();
        mintedDomains.push({ domainName: mintedDomain + ".lazi", tokenId });
      }

      setMintedUserNames(mintedDomains);
    } catch (error) {
      console.error(error);
    }
  }, [userAddress, userNameContract]);

  const handleStake = async () => {
    const erc20Amount = tokenStakeValue; // Use sliderValue state variable
    console.log("selected Amount:", erc20Amount);

    // const daysToStake = selectedTime; // Example: 30 days
    console.log("selected UserName:", selectedUserNames);
    console.log("selected TimePeriod:", selectedTime);
    console.log("user Duration:", userStakedDuration);
    console.log("user Tokens:", userStakedTokens);
    console.log("Total Duration:", totalStakedDuration);
    console.log("Total StakedTokens:", totalStakedLazi);
    if (erc20Amount === 0) {
      toast.error("Select a valid Amount to stake!");
      return; // Break the flow if erc20Amount is 0
    }

    if (!selectedTime) {
      toast.error("Select the Time Period to stake!");
      return; // Break the flow if time period is not selected
    }

    // const erc721Ids = selectedUserNames; // Example: ERC721 token IDs    if (web3 && lpRewardContract) {
    if (engagementContract) {
      try {
        const gasEstimate = await engagementContract.methods
          .stake(erc20Amount, selectedTime, selectedUserNames)
          .estimateGas({ from: userAddress });

        engagementContract.methods
          .stake(erc20Amount, selectedTime, selectedUserNames)
          .send({ from: userAddress, gas: gasEstimate })
          .on("transactionHash", (hash) => {
            console.log(hash);
          })
          .on("receipt", (receipt) => {
            console.log(receipt);
            toast.success("Stake successful!", {
              position: toast.POSITION.TOP_RIGHT,
            });
          })
          .on("error", (error) => {
            console.log(error);
            const errorMessage = error.message.split("message: ")[2];
            toast.error(errorMessage, { position: toast.POSITION.TOP_RIGHT });
          });
      } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred during the transaction.";

        if (error.message) {
          const startIndex = error.message.indexOf(" reverted: ") + 10;
          const endIndex = error.message.indexOf(",", startIndex);
          errorMessage = error.message.substring(startIndex, endIndex);
        }

        toast.error(errorMessage); // Display toast error message
        throw new Error(errorMessage); // Rethrow the error with custom message
      }
    }
  };

  const fetchInformation = useCallback(async () => {
    try {
      // Call the balanceOf() function to get the user's balance
      const balance = await laziTokenContract.methods
        .balanceOf(userAddress)
        .call();
      setUserBalance(balance);
      const totalStakedLazi = await engagementContract.methods
        .totalStakedLazi()
        .call();
      setTotalStakedLazi(totalStakedLazi);
      const totalStakers = await engagementContract.methods.totalUsers().call();
      setTotalStakers(totalStakers);

      const totalStakedDuration = await engagementContract.methods
        .totalStakedDuration()
        .call();
      setTotalStakedDuration(totalStakedDuration);

      const userInfo = await engagementContract.methods
        .users(userAddress)
        .call();
      setUserStakedDuration(userInfo.stakeDuration);
      setUserStakedTokens(userInfo.stakedLazi);
      const userDurationScore =
        (userInfo.stakeDuration / totalStakedDuration) * 100;
      const userStakedScore = (userInfo.stakedLazi / totalStakedLazi) * 100;
      const averageStakedLazi = totalStakedLazi / totalStakers;
      const averageStakedDuration = totalStakedDuration / totalStakers;
      setAvgStakedDuration(averageStakedDuration);
      setAvgStakedLazi(averageStakedLazi);
      setUserStakedScore(userStakedScore);
      setUserDurationScore(userDurationScore);
      // Update the userBalance state variable with the retrieved balance
      console.log("UserBalance", balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [userAddress, laziTokenContract, engagementContract]);

  useEffect(() => {
    if (userAddress && engagementContract && userNameContract) {
      getOwnerMintedUserNames();
      fetchInformation();
    }
  }, [
    userAddress,
    userNameContract,
    engagementContract,
    fetchInformation,
    getOwnerMintedUserNames,
  ]);
  

  return (
    <>
      <Box className={classes.bannerBox}>
        <Grid container spacing={3}>
          <Grid item md={isMobile ? 12 : 6} xs={isMobile ? 12 : 12}>
            <Paper className={classes.root} elevation={2}>
              <Box className={classes.root}>
             {(locked||flexible)?<ArrowBackIcon onClick={handleGoBack} />:''}
                <Box className={classes.tooltipIconHeader}>
                  <Typography variant="h2" className={classes.head}>
                    Start Engagement
                  </Typography>
                  <Tooltip
                    title="This is the Engagement Session."
                    style={{ cursor: "pointer" }}
                    placement={"top"}
                    classes={{ tooltip: classes.tooltip }}
                  >
                    <InfoIcon fontSize={"medium"} />
                  </Tooltip>
                </Box>

                <br></br>
              {( !(locked ||flexible) &&  <Box 
                
                  mt={2}
                  mb={2}
                  style={{
                    border: "2px solid #3C3C3C",
                    borderRadius: 8,
                    padding: 5,
                    paddingBlock: 10,
                  }}
                >
                  <Typography
                    variant="h2"
                    style={{
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      marginLeft: 10,
                    }}
                  >
                    LAZI Stake
                  </Typography>

                  <Box display="flex"  justifyContent='space-around' mt={2}>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 30,
                        fontSize: 14,
                        marginLeft:5
                      }}
                      onClick={handleFlexibleButton}
                    >
                      Flexible
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 30,
                        fontSize: 14,
                      }}
                      onClick={handleLockedButton}
                    >
                      Locked
                    </Button>
                  </Box>
                </Box>)}
{/* Content to be shown when Clicked on flexible button */}
{flexible &&( <Box style={{ height: flexible ? 'auto' : 0, overflow: 'hidden' }}>
                   <Box
                    mt={2}
                    mb={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                                   >
                    <Box>
                      <Typography
                        variant="body2"
                        className={classes.inputLabel}
                        style={{ fontSize: "13px", marginBottom: 2 }}
                      >
                        Enter Token to Stake
                      </Typography>
                      <TextField
                        className={classes.input}
                        value={tokenStakeValue}
                        onChange={handleStakeTokenChange}
                        variant="outlined"
                      />
                    </Box>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 30,
                        fontSize: 14,
                        marginTop: 25,
                        marginInline: 10,
                      }}
                      onClick={() => setTokenStakeValue(userBalance)}
                    >
                      Max
                    </Button>
                                   </Box>
                   
                                   <Box
                    mt={2}
                    mb={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                                   >
                    <Box>
                      <Typography
                        variant="body2"
                        className={classes.inputLabel}
                        style={{
                          fontSize: "13px",
                          marginBottom: 2,
                          paddingLeft: 2,
                        }}
                      >
                        Day Stake
                      </Typography>
                      <TextField
                        className={classes.input}
                        value={selectedTime}
                        onChange={handleDayStake}
                        variant="outlined"
                      />
                    </Box>
                    <div
                      variant="contained"
                      style={{
                        color: "#fff",
                        height: 30,
                        fontSize: 14,
                        marginTop: 25,
                        paddingInline: 22,
                      }}
                      onClick={() => setTokenStakeValue(userBalance)}
                    >
                      Days
                    </div>
                                   </Box>
                                   <Box
                    style={{ display: "flex", justifyContent: "space-around" }}
                                   >
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(1)}
                    >
                      1W
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(2)}
                    >
                      2W
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(3)}
                    >
                      3W
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(4)}
                    >
                      4W
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(52)}
                    >
                      Max
                    </Button>
                     </Box>
                     <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 40,
                       paddingInline:45,
                       borderRadius:5,
                        fontSize: 16,
                        marginTop: 25,
                        marginLeft: 50,
                        marginBottom:5
                      }}
                      onClick={() => setTokenStakeValue(userBalance)} 
                      // this onclick function is to be change
                    >
                      Confirm
                    </Button>



                    <br></br>
                <div style={{ display: "flex",marginTop:20 }}>
                  <div>
                    <Box className={classes.heading}>
                      <Typography variant="h2" className={classes.head}>
                        User Names Stake
                      </Typography>
                    </Box>
                    <br></br>
                    <Box>
                      {mintedUserNames.length === 0 ? (
                        <Typography variant="h5" style={{ fontSize: 14 }}>
                          No User Name minted yet.
                        </Typography>
                      ) : (
                        mintedUserNames.map(({ domainName, tokenId }) => (
                          <Box className={classes.checkbox} key={domainName}>
                            <Checkbox
                              checked={selectedUserNames.includes(tokenId)}
                              onChange={(event) =>
                                handleCheckboxChange(event, domainName, tokenId)
                              }
                              value={tokenId}
                              size="small"
                              inputProps={{
                                "aria-label": "checkbox with small size",
                              }}
                            />
                            <Typography variant="h5">{domainName}</Typography>
                          </Box>
                        ))
                      )}
                    </Box>
                  </div>
                </div>
                <Box className={classes.Buttonbox} mt={2}>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#e31a89", color: "#fff" }}
                      onClick={handleStake}
                    >
                      Start Now
                    </Button>

                    <Box>
                      <Box className={classes.tooltipIconHeader}>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#3C3C3C",
                            color: "#fff",
                            height: 40,
                            fontSize: 14,
                            marginTop: 25,
                            // marginInline: 10,
                          }}
                          onClick={() => setTokenStakeValue(userBalance)}
                        >
                          End Session Now
                        </Button>
                        <Tooltip
                          title="You might incur penalties if you end session before your selected duration"
                          style={{ cursor: "pointer", marginTop: 18 }}
                          placement={"top"}
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <InfoIcon fontSize={"medium"} />
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                 </Box>)}

          {locked &&( <Box>
                   <Box
                    mt={2}
                    mb={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                   
                     >
                    <Box>
                      <Typography
                        variant="body2"
                        className={classes.inputLabel}
                        style={{ fontSize: "13px", marginBottom: 2 }}
                      >
                        Enter Token to Stake
                      </Typography>
                      <TextField
                        className={classes.input}
                        value={tokenStakeValue}
                        onChange={handleStakeTokenChange}
                        variant="outlined"
                      />
                    </Box>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 30,
                        fontSize: 14,
                        marginTop: 25,
                        marginInline: 10,
                      }}
                      onClick={() => setTokenStakeValue(userBalance)}
                    >
                      Max
                    </Button>
                                   </Box>
                   
                                   <Box
                    mt={2}
                    mb={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                                   >
                    <Box>
                      <Typography
                        variant="body2"
                        className={classes.inputLabel}
                        style={{
                          fontSize: "13px",
                          marginBottom: 2,
                          paddingLeft: 2,
                        }}
                      >
                        Day Stake
                      </Typography>
                      <TextField
                        className={classes.input}
                        value={selectedTime}
                        onChange={handleDayStake}
                        variant="outlined"
                      />
                    </Box>
                    <div
                      variant="contained"
                      style={{
                        color: "#fff",
                        height: 30,
                        fontSize: 14,
                        marginTop: 25,
                        paddingInline: 22,
                      }}
                      onClick={() => setTokenStakeValue(userBalance)}
                    >
                      Days
                    </div>
                                   </Box>
                                   <Box
                    style={{ display: "flex", justifyContent: "space-around" }}
                                   >
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(1)}
                    >
                      1W
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(2)}
                    >
                      2W
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(3)}
                    >
                      3W
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(4)}
                    >
                      4W
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 25,
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: "bold",
                        marginTop: 17,
                      }}
                      onClick={() => handleDayStakeButton(52)}
                    >
                      Max
                    </Button>
                     </Box>
                     <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#e31a89",
                        color: "#fff",
                        height: 40,
                       paddingInline:45,
                       borderRadius:5,
                        fontSize: 16,
                        marginTop: 25,
                        marginLeft: 50,
                        marginBottom:5
                      }}
                      onClick={() => setTokenStakeValue(userBalance)} 
                      // this onclick function is to be change
                    >
                      Confirm
                    </Button>



                    <br></br>
                {/* <div style={{ display: "flex",marginTop:20 }}>
                  <div>
                    <Box className={classes.heading}>
                      <Typography variant="h2" className={classes.head}>
                        User Names Stake
                      </Typography>
                    </Box>
                    <br></br>
                    <Box>
                      {mintedUserNames.length === 0 ? (
                        <Typography variant="h5" style={{ fontSize: 14 }}>
                          No User Name minted yet.
                        </Typography>
                      ) : (
                        mintedUserNames.map(({ domainName, tokenId }) => (
                          <Box className={classes.checkbox} key={domainName}>
                            <Checkbox
                              checked={selectedUserNames.includes(tokenId)}
                              onChange={(event) =>
                                handleCheckboxChange(event, domainName, tokenId)
                              }
                              value={tokenId}
                              size="small"
                              inputProps={{
                                "aria-label": "checkbox with small size",
                              }}
                            />
                            <Typography variant="h5">{domainName}</Typography>
                          </Box>
                        ))
                      )}
                    </Box>
                  </div>
                </div>
                <Box className={classes.Buttonbox} mt={2}>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: "#e31a89", color: "#fff" }}
                      onClick={handleStake}
                    >
                      Start Now
                    </Button>

                    <Box>
                      <Box className={classes.tooltipIconHeader}>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#3C3C3C",
                            color: "#fff",
                            height: 40,
                            fontSize: 14,
                            marginTop: 25,
                            // marginInline: 10,
                          }}
                          onClick={() => setTokenStakeValue(userBalance)}
                        >
                          End Session Now
                        </Button>
                        <Tooltip
                          title="You might incur penalties if you end session before your selected duration"
                          style={{ cursor: "pointer", marginTop: 18 }}
                          placement={"top"}
                          classes={{ tooltip: classes.tooltip }}
                        >
                          <InfoIcon fontSize={"medium"} />
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Box> */}
                 </Box>)}









                {/* <Box mt={8} mb={6}>
                  <Autocomplete
                    disablePortal
                    id="tags-standard"
                    sx={{ width: 300 }}
                    options={monthOptions}
                    value={
                      monthOptions.find(
                        (option) => option.value === selectedTime
                      ) || null
                    }
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) =>
                      setSelectedTime(newValue?.value || null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Month Stake"
                        style={{ color: "white" }}
                      />
                    )}
                  />
                  <br></br>
                </Box> */}

               

                <br></br>
              </Box>
            </Paper>
          </Grid>
          <Grid item md={isMobile ? 12 : 6} xs={isMobile ? 12 : 12}>
            <Paper className={classes.root} elevation={2}>
              <Box
                className={classes.root}
                height="auto"
                width="auto"
                overflow="auto"
              >
                <div>
                  <Box
                    // bgcolor="#EC167F"
                    borderRadius={10}
                    // p={2}
                    // mb={4}
                    display="flex"
                    alignItems="center"
                  >
                    <Typography variant="h2" className={classes.head}>
                      Multiplier
                    </Typography>
                  </Box>

                  <Box
                    borderRadius={10}
                    p={2}
                    mb={1}
                    mt={3}
                    display="flex"
                    alignItems="center"
                  >
                    <Typography
                      variant="h4"
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "600",
                        // border: "2px solid  #575758 ",
                        paddingInline: 30,
                        paddingBlock: 8,
                        borderRadius: 8,
                      }}
                    >
                      Total Multiplier:{" "}
                      <span
                        style={{
                          backgroundColor: "#EC167F",
                          padding: 3,
                          borderRadius: 3,
                          paddingInline: 9,
                          textAlign: "end",
                        }}
                      >
                        {totalMultiplier}x{" "}
                      </span>
                    </Typography>
                  </Box>
                  <hr></hr>
                  <Box borderRadius={10} p={2}>
                    <Typography
                      variant="h4"
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "600",
                        marginBlock: "5",
                      }}
                    >
                      Average Stake Duration:
                      <span
                        style={{
                          backgroundColor: "#EC167F",
                          // display: "block",
                          paddingBlock: 2,
                          paddingInline: 8,
                          borderRadius: 2,
                          marginBlock: 3,
                          textAlign: "start",
                          marginLeft: 2,
                          marginBottom: 5,
                          // whiteSpace:"nowrap"
                        }}
                      >
                        {avgStakedDuration}{" "}
                      </span>
                    </Typography>
                    <Typography
                      variant="h4"
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "600",
                        marginTop: 20,
                        marginLeft: 5,
                      }}
                    >
                      Average Staked Lazi:
                      <span
                        style={{
                          backgroundColor: "#EC167F",
                          // display: "block",
                          paddingBlock: 2,
                          paddingInline: 8,
                          borderRadius: 2,
                          marginBlock: 3,
                          textAlign: "start",
                          marginLeft: 26,
                          marginBottom: 5,
                          // whiteSpace:"nowrap"
                        }}
                      >
                        {avgStakedDuration}{" "}
                      </span>
                    </Typography>
                  </Box>
                </div>
              </Box>
              <hr></hr>

              <Paper
                className={classes.root}
                elevation={2}
                style={{ marginTop: "10px" }}
              >
                <Box>
                  <Typography variant="h2" className={classes.head}>
                    Contribution Reward
                  </Typography>
                </Box>

                <div className={classes.containerProgress}>
                  <Box className={classes.progressBar}>
                    <Typography
                      variant="h6"
                      component="h2"
                      style={{ fontSize: 13 }}
                    >
                      Contribution Score
                    </Typography>
                    <CustomBar
                      variant="determinate"
                      value={userContributionScore}
                    />
                  </Box>
                  <Box
                    className={classes.progressValue}
                    style={{
                      marginTop: 35,
                      background: "#EC167F",
                      padding: 6,
                      borderRadius: "2px",
                    }}
                  >
                    <Typography variant="body1">
                      {userContributionScore.toFixed(2)}%
                    </Typography>
                  </Box>
                </div>

                <div className={classes.containerProgress}>
                  <Box className={classes.progressBar}>
                    <Typography
                      variant="h6"
                      component="h2"
                      style={{ fontSize: 13 }}
                    >
                      Duration Score
                    </Typography>
                    <CustomBar
                      variant="determinate"
                      value={userDurationScore}
                      onChange={handleDurationScoreChange}
                    />
                  </Box>
                  <Box
                    className={classes.progressValue}
                    style={{
                      marginTop: 35,
                      background: "#EC167F",
                      padding: 6,
                      paddingInline: 8,
                      borderRadius: "2px",
                    }}
                  >
                    <Typography variant="body1">
                      {userDurationScore.toFixed(2)}%
                    </Typography>
                  </Box>
                </div>
                <div className={classes.containerProgress}>
                  <Box className={classes.progressBar}>
                    <Typography
                      variant="h6"
                      component="h2"
                      style={{ fontSize: 13 }}
                    >
                      Staked Lazi Score
                    </Typography>
                    <CustomBar
                      variant="determinate"
                      value={userStakedScore}
                      onChange={handleStakedScoreChange}
                    />
                  </Box>
                  <Box
                    className={classes.progressValue}
                    style={{
                      marginTop: 35,
                      background: "#EC167F",
                      padding: 6,
                      borderRadius: "2px",
                    }}
                  >
                    <Typography variant="body1">
                      {userStakedScore.toFixed(2)}%
                    </Typography>
                  </Box>
                </div>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default Earn;
