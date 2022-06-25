import React, { Component } from "react";
import Layout from "../../components/layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../etherium/factory";
import web3 from "../../etherium/web3";
import { Router} from "../../routes";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage : "",
    errorCode : "",
    loading : false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({loading:true, errorMessage: ''});

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(this.state.minimumContribution).send({
        from: accounts[0],
      });

      Router.pushRoute('/')
    } catch (error) {
      this.setState({errorMessage: error.message})
      this.setState({errorCode: error.code})
    }

    this.setState({loading:false});
  };

  render() {
    return (
      <Layout>
        <h3>Create campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <lable>Minimum contribution</lable>
            <Input
              label="wei"
              labelPosition="right"
              placeholder="Minimum wei"
              size="big"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage}/>
          <Button loading={this.state.loading} primary>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
