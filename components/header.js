import { resolveHref } from "next/dist/shared/lib/router/router";
import React from "react";
import { Menu } from "semantic-ui-react";

export default () => {
  return (
    <Menu style={{ marginTop: "20px" }}>
      <Menu.Item href="http://localhost:3000/">CrowdCoin</Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>Camp</Menu.Item>
        <Menu.Item href="http://localhost:3000/campaigns/new">+</Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};
