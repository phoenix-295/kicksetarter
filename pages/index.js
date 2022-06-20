import React, { Component } from "react";
import factory from "../etherium/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/layout";

class campaignIndex extends Component {
  static async getInitialProps() {
    const camp = await factory.methods.getDeployedCampaigns().call();
    return { camp };
  }

  renderCamp() {
    const items = this.props.camp.map((address) => {
      return {
        header: address,
        description: <a>View camp</a>,
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open campaign</h3>
          <Button floated="right" content="Create" icon="add circle" primary />
          {this.renderCamp()}
        </div>
      </Layout>
    );
  }
}

export default campaignIndex;
