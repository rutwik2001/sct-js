import React,{Component} from 'react';
import { Card, Button, Icon, Container, Form, Message } from 'semantic-ui-react';
import {Link} from '../../routes';
import Layout from '../../components/Layout'
import { ethers } from "ethers";
import scrtABI from '../../ethereum/build/scrtabi.json';

class SCRT extends Component{
    static async getInitialProps({query}) {
        const name = query.name
        const prn = query.prn
        const tokensCount = query.tokensCount
        const account = query.account
        const trnnum = query.trnnum

        
        
        
        

        return {name, prn, tokensCount, account, trnnum}
    }

    

    state = {
        
        loading: false,
        errorMessage: '',
        account: "",
        ethValue: ""
    }

    async componentDidMount () {
     const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner()
            const account = await signer.getAddress()
            console.log(account)
            

            const contract_address = "0x750EbBfBD277d43929aA2D7a8d737F4a8EEBe817"
            const contract = new ethers.Contract(contract_address, scrtABI, signer);
            const balance = (await contract.balanceOf(account)).toString();
            const ethValue = ethers.utils.formatEther(balance);
            console.log(ethValue);
            this.setState({ethValue});
  }

    

    

    render() {
        return(
                <Layout>
                    <h1>{this.state.account}</h1>
                    <h1>Name: {this.props.name}</h1>
                    <h1>Student PRN: {this.props.prn}</h1>
                    <h1>RewardCoins: {this.props.tokensCount}</h1>
                    <h1>Account funds are transferred to: {this.props.account}</h1>
                    <h1>Transaction ID: {this.props.trnnum}</h1>
                    <h1>Balance: {this.state.ethValue}</h1>
            <Link route={`/scrt/gasEstimate?name=${this.props.name}&prn=${this.props.prn}&tokensCount=${this.props.tokensCount}&account=${this.props.account}&trnnum=${this.props.trnnum}`}><a><Button primary>Get Gas Estimate</Button></a></Link>
            
            
            </Layout>
            
            )
    }
}

export default SCRT;
