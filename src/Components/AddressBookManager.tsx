import { Box, Button, Input, Text } from "@chakra-ui/react";
import { PortalNetwork } from "portalnetwork";
import React from "react";

type NodeManagerProps = {
  portal: PortalNetwork;
};

const AddressBookManager: React.FC<NodeManagerProps> = ({ portal }) => {
  const [enr, setEnr] = React.useState<string>();
  const handleClick = () => {
    if (enr) {
      portal.client.addEnr(enr);
      setEnr("");
    }
  };

  const handlePing = () => {
    portal.sendPing();
  };

  return (
    <Box>
      <Input
        value={enr}
        placeholder={"Node ENR"}
        onChange={(evt) => setEnr(evt.target.value)}
      ></Input>
      <Button onClick={handleClick}>Add Node</Button>
      <Button onClick={handlePing}>Send Ping</Button>
    </Box>
  );
};

export default AddressBookManager;
