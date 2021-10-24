import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { PortalNetwork } from "portalnetwork";
import React from "react";

type NodeManagerProps = {
  portal: PortalNetwork;
};

const AddressBookManager: React.FC<NodeManagerProps> = ({ portal }) => {
  const [enr, setEnr] = React.useState<string>("");
  const [peers, setPeers] = React.useState<string[]>([]);

  const handleClick = () => {
    if (enr) {
      portal.client.addEnr(enr);
      setEnr("");
      const peerENRs = portal.client.kadValues();
      const newPeers = peerENRs.map((peer) => peer.nodeId);
      setPeers(newPeers);
    }
  };

  const handlePing = (nodeId: string) => {
    portal.sendPing(nodeId);
  };

  const handleFindNodes = (nodeId: string) => {
    console.log([0]);
    portal.sendFindNodes(nodeId, [0]);
  };

  return (
    <Box>
      <Input
        value={enr}
        placeholder={"Node ENR"}
        onChange={(evt) => setEnr(evt.target.value)}
      ></Input>
      <Button onClick={handleClick}>Add Node</Button>
      {peers.length > 0 &&
        peers.map((peer) => (
          <HStack key={Math.random().toString()}>
            <Text>{peer.slice(10)}...</Text>
            <Button onClick={() => handlePing(peer)}>Send Ping</Button>
            <Button onClick={() => handleFindNodes(peer)}>
              Request Nodes from Peer
            </Button>
          </HStack>
        ))}
    </Box>
  );
};

export default AddressBookManager;
