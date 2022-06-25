import React, { Component } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import Layout from "../../components/layout";
import Campaign from "../../etherium/campaign";
import web3 from "../../etherium/web3";
import ContributionForm from "../../components/contributeform";
import { Link } from "../../routes"


class CampaignShow extends Component{
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = campaign.methods.getSummary().call();
        var res 
        await summary.then(function(result){
            res = result
        })
        return{
            address : props.query.address,
            minimiumContribution : res[0],
            balance : res[1],
            requestsCount : res[2],
            approversCount : res[3],
            manager : res[4],
        };
    }

    renderCards () {
        const {
            balance,
            manager,
            minimiumContribution,
            requestsCount,
            approversCount
        } = this.props;
        console.log("manager", manager)
        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'This campaign was created by manager',
                style : {overflowWrap: 'break-word'}
            },
            {
                header: minimiumContribution,
                meta: "Minimum Contribution in wei",
                description: "Minimum contribution to become an approver "
            },
            {
                header: requestsCount,
                meta: "Number of requests",
                description: "A request tries to withdraw money from the contract, requests must be approved by approvers "
            },
            {
                header: approversCount,
                meta: "Number of approvers ",
                description: "Number of people who have already donated to this campaign "
            },
            {
                header: web3.utils.fromWei(balance,'ether'),
                meta: "Campaign balance (ether)",
                description: "Balance is how much money this campaign has left to spend"
            },

        ]
        return <Card.Group items={items} />
    }


    render () {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Column width={10}>
                        {this.renderCards()} 
                        <Link route={`${this.props.address}/requests`}>
                            <a>
                                 <Button primary>View Requests!</Button>
                            </a>
                        </Link>
                    </Grid.Column>

                    <Grid.Column width={6}>
                        <ContributionForm address={this.props.address}/>
                    </Grid.Column>
                </Grid>
            </Layout>
        ) 
    }
}

export default CampaignShow