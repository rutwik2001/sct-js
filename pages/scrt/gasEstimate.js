import React,{Component} from 'react';
import { Card, Button,Form,Message, Icon, Container } from 'semantic-ui-react';
import {Link, Router} from '../../routes';
import Layout from '../../components/Layout'
import web3 from '../../ethereum/web3'
import scrt from '../../ethereum/scrt'
import { ethers } from "ethers";
import scrtABI from '../../ethereum/build/scrtabi.json';

class SCRT extends Component{
    static async getInitialProps({query}) {
        const name = query.name
        const prn = query.prn
        const tokensCount = query.tokensCount
        const account = query.account
        const trnnum = query.trnnum
        const accounts = web3.eth.getAccounts();
        const latestBlock = await web3.eth.getBlock('latest');
        const blockGas = latestBlock.gasLimit;
        let result = await scrt.methods.sendTokens("0xee1da50aA7C2E781E5fC85368CAf4B2b4C5ccfcB", 20).estimateGas({from: accounts[0]});
        const finalGas = (blockGas * result);
        let resultineth = web3.utils.fromWei(web3.utils.toBN(finalGas), "ether")
        
        
            
        


        return {name, prn, tokensCount, account, trnnum, result, resultineth}
    }
    state = {
        
        loading: false,
        errorMessage: '',
        successMessage: '',
        hidden: true, 
        ethValue: "",
        hidden1: true, 
        Message: ""
    }

    onSubmit = async (event) => {
        event.preventDefault();

        

        this.setState({loading: true, errorMessage: ''});

        try{

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner()
            const account = await signer.getAddress()

            const contract_address = "0x750EbBfBD277d43929aA2D7a8d737F4a8EEBe817"
            const contract = new ethers.Contract(contract_address, scrtABI, signer);
            
            await contract.sendTokens(this.props.account, this.props.tokensCount)
            
            
            this.setState({hidden1: false})
            this.setState({Message: "Your transaction is being processed"});
            setTimeout(async () => { 
                const balance = (await contract.balanceOf(account)).toString();
                const ethValue = ethers.utils.formatEther(balance);
                this.setState({ethValue})
         }, 5000);


            
            setTimeout(() => {  let details = navigator.userAgent;
  
        /* Creating a regular expression 
        containing some mobile devices keywords 
        to search it in details string*/
        let regexp = /android|iphone|kindle|ipad/i;
  
        /* Using test() method to search regexp in details
        it returns boolean value*/
        let isMobileDevice = regexp.test(details);
  
        if (isMobileDevice) {
             
    console.log("mobile")
            window.location = 'smartstudent://metamask';
        setTimeout("window.location = 'https://play.google.com/store/apps/details?id=com.bpsi.smartstudentmodified';", 1500);
    
        } else {
            Router.pushRoute(`https://dev.smartcookie.in/main/rewards_log`)
        }
                             this.setState({hidden1: true})
        this.setState({hidden: false})
         

            this.setState({successMessage: "Your transaction is completed successfully"});
                             }, 10000);
            

        //
        } catch (err) {
            this.setState({errorMessage: err.message});
        }

        this.setState({loading: false});

    }
    

    render() {
        return(
                <Layout>
                    
                    <h1>Name: {this.props.name}</h1>
                    <h1>Student PRN: {this.props.prn}</h1>
                    <h1>Reward Coins: {this.props.tokensCount}</h1>
                    <h1>Account funds are transferred to: {this.props.account}</h1>
                    <h1>Transaction ID: {this.props.trnnum}</h1>
                    <h1>Gas: {this.props.resultineth}eth</h1>
                    <h1>Balance: {this.state.ethValue}</h1>
            
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
    <Message
    error
    header='There was some error with your submission.'
    content = {this.state.errorMessage}
  />

  <Message
    hidden = {this.state.hidden}
    header={this.state.successMessage}
    
  />
        <Message
    hidden = {this.state.hidden1}
    header={this.state.Message}
    
  />
    
    <Button loading={this.state.loading} primary type='submit'>Sign the Transaction</Button>
  </Form>

            </Layout>
            
            )
    }
}

export default SCRT;
