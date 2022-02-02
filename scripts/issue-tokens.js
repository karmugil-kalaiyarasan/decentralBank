const { callbackify } = require("util");

const DecentralBank = artifacts.require("DecentralBank");


module.exports = async function issueRewards(callback){
    let decentralBank = await DecentralBank.deployed();
    decentralBank.issueTokens();
    console.log('Tokens have been issue successfully');
    callback();
}