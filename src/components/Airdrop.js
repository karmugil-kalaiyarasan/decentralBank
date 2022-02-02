import React, { useEffect,useState } from 'react';

const Airdrop = (props) => {
    console.log(props)
    const [timer,setTimer] = useState(0);
    const [time,setTime] = useState({});
    const [seconds,setSeconds] = useState(20);

//     useEffect(() => {
//     // const startTimer = ()=>{
//         if(timer === 0 && seconds > 0){
//             setInterval(()=>{
//                 let secondsValue = seconds - 1;
//                 let timeValue = secondsToTime(secondsValue);
//                 setTime(timeValue);
//                 setSeconds(secondsValue);
//             },1000);
//             console.log(time.s);
//         }else{
//             clearInterval(timer);

//         }
//     // }
// },[seconds])

    const startTimer = () =>{
        if(timer === 0 && seconds > 0){
            setInterval(countDown,1000);
        }
    }

    const countDown = ()=>{
        let secondsValue = seconds - 1;
        let timeValue = secondsToTime(secondsValue);
        setTime(timeValue);
        setSeconds(secondsValue);
        if(secondsValue === 0){
            clearInterval(timer);
        }
    }

    const secondsToTime = (secs)=>{
        let hours,minutes,seconds;
        hours = Math.floor(secs/(60*60));
        let devisor_for_minutes = secs % (60*60);
        minutes = Math.floor(devisor_for_minutes/60);
        let devisor_for_seconds = devisor_for_minutes % 60;
        seconds = Math.ceil(devisor_for_seconds);
        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        }
        return obj;
    }

    useEffect(() => {
        let timeLeftVar = secondsToTime(seconds);
        setTime(timeLeftVar);
    }, []);

    const airdropReleaseTokens=()=>{
        let stakingB = props.stakingBalance.stakingBalanceAvailable;
        if(stakingB >= "50000000000000000000"){
            startTimer();
        }
    }

    // useEffect(() => {
    //     startTimer();
    // },[seconds]);

    return (
        <div style={{color:"black"}}>
            {time.m}:{time.s}
            
        </div>
    )
}

export default Airdrop
