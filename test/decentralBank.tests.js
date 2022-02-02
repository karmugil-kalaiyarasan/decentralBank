const assert = require('assert');
const web3Utils = require('web3-utils');
const web3Eth = require('web3-eth');

const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

require('chai')
.use(require('chai-as-promised'))
.should()

contract("DecentralBank",([owner,customer])=>{

    let tether,rwd,decentralBank;

    const tokens = (number)=>{
        return web3Utils.toWei(number,"Ether");
    }

    before(async()=>{
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        await rwd.transfer(decentralBank.address,tokens("1000000"));

        await tether.transfer(customer,tokens("100"),{from: owner});
    });

    describe("Mock Tether Test",async()=>{
        it("Matches name successfully",async()=>{
            const name = await tether.name();
            assert.equal(name,"Tether");
        });

        it("Matches Tether Symbol",async()=>{
            const tetherSymbol = await tether.symbol();
            assert.equal(tetherSymbol,"USDT");
        });

        it("Matches Tether Token amount",async()=>{
            let balance = await tether.balanceOf(owner);
            assert.equal(balance,tokens("999900"));
        });

        it("Matches Customer Token amount",async()=>{
            const balance = await tether.balanceOf(customer);
            assert.equal(balance,tokens("100"));
        })
        
    });

    describe("Mock reward token",async()=>{
        it("check",async()=>{
            const check = await rwd.name();
            assert.equal(check,"Reward Token");
        });

        it("Matches Reward Token amount",async()=>{
            let balance = await rwd.balanceOf(rwd.address);
            assert.equal(balance,tokens("0"));
        })
    });

    describe("Mock DecentralBank Test",async()=>{
        it("Matches DecentralBank name",async()=>{
            const name = await decentralBank.name();
            assert.equal(name,"Decentral Bank");
        });

        it("Matches Reward token amount",async()=>{
            const rwdToken = await rwd.balanceOf(decentralBank.address);
            assert.equal(rwdToken,tokens("1000000"));
        });
    });

    describe("Yield Farming",async()=>{
        it("reward tokens for staking",async()=>{
            let result;
            
            result = await tether.balanceOf(customer);
            assert.equal(result,tokens("100"),'customer mock wallet balance');
            
            await tether.approve(decentralBank.address,tokens("100"),{from:customer});
            await decentralBank.depositTokens(tokens("100"),{from: customer});
            
            result1 = await tether.balanceOf(customer);
            assert.equal(result1,tokens("0"),'customer mock wallet balance');

            resultdb = await tether.balanceOf(decentralBank.address);
            assert.equal(resultdb,tokens("100"));

            staking = await decentralBank.isStaking(customer);
            assert.equal(staking,true);

            await decentralBank.issueTokens({from:owner});

            await decentralBank.issueTokens({from: customer}).should.be.rejected;

            await decentralBank.unstakeTokens({from: customer});

            result1 = await tether.balanceOf(customer);
            assert.equal(result1,tokens("100"),'customer mock wallet balance');

            resultdb = await tether.balanceOf(decentralBank.address);
            assert.equal(resultdb,tokens("0"));

            staking = await decentralBank.isStaking(customer);
            assert.equal(staking,false);
        })
    })
});

