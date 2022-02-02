import React, { useEffect,useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main';
import ParticleSettings from './ParticleSettings';

const App = () => {

    useEffect(() => {
        loadWeb3();

        updateBlockchainData();
        loadBlockchainData();
    }, [])

    const loadWeb3 = async()=>{
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider);
        }else{
            window.alert("No ethereum browser detected! You can check out MetaMask!");
        }
    }

    const loadBlockchainData=async()=>{
        const web3 = window.web3;
        const account = await web3.eth.getAccounts();
        setAccount(account[0]);
        const networkId = await web3.eth.net.getId();
        const tetherData = Tether.networks[networkId];
        const rwdData = RWD.networks[networkId];
        const decentralBankData = DecentralBank.networks[networkId];
        // console.log(tetherData);
        if(tetherData){
            const tether = new web3.eth.Contract(Tether.abi,tetherData.address);
            setTether(tether);
            console.log(account);
            let tetherBalance = await tether.methods.balanceOf(account[0]).call();
             setTetherBalance({tetherBalance:tetherBalance.toString()});
             console.log(tetherBalance);
        }else{
            window.alert("Error! Tether Contract not deployed - No network detected!");
        }

        if(rwdData){
            const rwd = new web3.eth.Contract(RWD.abi,rwdData.address);
            setRwd(rwd);
            let rwdBalance = await rwd.methods.balanceOf(account[0]).call();
            setRwdBalance({rwdBalance:rwdBalance.toString()});
            // console.log(rwdBalance);
        }else{
            window.alert("Error! RWD Contract not deployed - No network detected!");
        }

        if(decentralBankData){
            const decentralBank = new web3.eth.Contract(DecentralBank.abi,decentralBankData.address);
            setDecentralBank(decentralBank);
            let stakingBalanceAvailable = await decentralBank.methods.stakingBalance(account[0]).call();
            setStakingBalance({stakingBalanceAvailable:stakingBalanceAvailable.toString()});
            // console.log(stakingBalance);
        }else{
            window.alert("Error! DecentralBank Contract not deployed - No network detected!");
        }
        setLoading(false);
        console.log(networkId);
        console.log(account);
    }

    const updateBlockchainData = async()=>{
        const web3 = window.web3;
        // window.addEventListener("load",async function(){
        //     let account = await web3.eth.getAccounts();
        //     console.log(account);
        // })
        window.ethereum.on("accountsChanged",async function(){
            let account = await web3.eth.getAccounts();
            // console.log(account);
        })
    }

    // const stakeTokens = async(amount)=>{
    //     setLoading(true);
    //     console.log("1");
    //     await tether.methods.approve(decentralBank._address,amount).send({from: account}).on("confirmation",(confirmation)=>{
    //         console.log("2");
    //      decentralBank.methods.depositTokens(amount).send({from: account}).on("transactionHash",(hash)=>{
    //          console.log("3");
    //     setLoading(false);
    // })      
    // })
    // }

    const stakeTokens = async(amount)=>{
        setLoading(true);
        // console.log("1");
        await tether.methods.approve(decentralBank._address,amount).send({from: account});
        // console.log("2");
        await decentralBank.methods.depositTokens(amount).send({from: account});
        // console.log("3");
        setLoading(false);
    }


    const unstakeTokens=async()=>{
        setLoading(true);
        await decentralBank.methods.unstakeTokens().send({from: account});
            setLoading(false);
        
    }

    const [account,setAccount] = useState("0x0454656");
    const [tether,setTether] = useState({});
    const [rwd,setRwd] = useState({});
    const [decentralBank,setDecentralBank] = useState({});
    const [tetherBalance,setTetherBalance] = useState("0");
    const [rwdBalance,setRwdBalance] = useState("0");
    const [stakingBalance,setStakingBalance] = useState("0");
    const [loading,setLoading] = useState(true); 

    let content;
    {
        loading ? content = <p id="loader" className="text-center" style={{margin:"30px",color:"white"}}>LOADING PLEASE...</p>
        : content = <Main tetherBalance={tetherBalance} rwdBalance={rwdBalance} stakingBalance={stakingBalance} stakeTokens={stakeTokens} unstakeTokens={unstakeTokens} />
    }

    return (
        <div className="App" style={{position:"relative"}}>
            <div style={{position:"absolute"}}>
                <ParticleSettings />
            </div>
            <Navbar account={account} />
            <div className="container-fluid mt-5">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'600px',minHeight:'100vm'}}>
                        <div>
                            {content}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default App
