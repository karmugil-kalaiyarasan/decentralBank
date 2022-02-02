import React, { useRef, useState } from 'react';
import Web3 from 'web3';
import tether from '../tether.png';
import Airdrop from './Airdrop';

const Main = (props) => {
    console.log(props);

    //  const [amount,setAmount] = useState("0");

    const depostRef = useRef();
    // const withdrawRef = useRef();

    // const handleChange = (event)=>{
    //     console.log(amount);
    //     const amountValue = window.web3.utils.toWei(event.target.value,"ether");
    //     console.log(amountValue);
    //     setAmount(amountValue);
    //     console.log(amount);
    // }

    const handleSubmit = async(event)=>{
        event.preventDefault();
        let amount = await window.web3.utils.toWei(depostRef.current.value,"ether");
        await props.stakeTokens(amount);
        window.location.reload(false);
        // console.log(stakeTokens(amount));
    }

    const handleWithdraw = async(event)=>{
        event.preventDefault();
        await props.unstakeTokens()
        window.location.reload(false);
    }

    return (
        <div id="content" className="mt-3">
            <table className="table text-muted text-center">
                <thead>
                    <tr style={{color:"white"}}>
                        <th scope="col">Staking Balance</th>
                        <th scope="col">Staking Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{color:"white"}}>
                        <td>{window.web3.utils.fromWei(props.stakingBalance.stakingBalanceAvailable,"ether")} USDT</td>
                        <td>{window.web3.utils.fromWei(props.rwdBalance.rwdBalance,"ether")} RWD</td>
                    </tr>
                </tbody>
            </table>
            <div className="card mb-2" style={{opacity:"0.9"}}>
                <form onSubmit={handleSubmit} className="mb-3">
                    <div style={{borderSpacing:"0 1rem"}}>
                        <label className="float-left" style={{marginLeft:"15px"}}><strong>Stake Tokens</strong></label>
                        <span className="float-right" style={{marginRight:"8px"}}>Balance: {window.web3.utils.fromWei(props.tetherBalance.tetherBalance,"ether")}</span>
                        <div className="input-group mb-4">
                            <input 
                                type="text"
                                name="deposit"
                                // onChange={handleChange}
                                ref={depostRef}
                                placeholder="0"
                                required
                            />
                            <div className="input-group-open">
                                <div className="input-group-text">
                                    <img alt="tether" src={tether} height="32" />
                                    {"\u00A0"}{"\u00A0"}{"\u00A0"}USDT
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg btn-block">DEPOSIT</button>
                    </div>
                </form>
                <button type="submit" onClick={handleWithdraw} className="btn btn-primary btn-lg btn-block">WITHDRAW</button>
                <div className="card-body text-center" style={{color:"blue"}}>
                    Airdrop<Airdrop stakingBalance={props.stakingBalance} />
                </div>
            </div>
        </div>
    )
}

export default Main
