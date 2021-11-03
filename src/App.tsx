import * as React from "react";
import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Heading,
  Button,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { ENR } from "@chainsafe/discv5";
import { PortalNetwork } from "portalnetwork";
import PeerId from "peer-id";
import { Multiaddr } from "multiaddr";
import ShowInfo from "./Components/ShowInfo";
import AddressBookManager from "./Components/AddressBookManager";

const debug = require("debug");

export const App = () => {
  const [portal, setDiscv5] = React.useState<PortalNetwork>();
  const [enr, setENR] = React.useState<string>();
  const [showInfo, setShowInfo] = React.useState(false);

  React.useEffect(() => {
    if (portal) {
      setENR(portal.client.enr.encodeTxt(portal.client.keypair.privateKey));
    }
  }, [portal]);
  const init = async () => {
    const id = await PeerId.create({ keyType: "secp256k1" });
    const enr = ENR.createFromPeerId(id);
    enr.setLocationMultiaddr(new Multiaddr("/ip4/127.0.0.1/udp/0"));
    const portal = new PortalNetwork({
      enr: enr,
      peerId: id,
      multiaddr: new Multiaddr("/ip4/127.0.0.1/udp/0"),
      transport: "wss",
      proxyAddress: "ws://127.0.0.1:5050",
    });
    //@ts-ignore
    window.discv5 = portal;
    //@ts-ignore
    window.Multiaddr = Multiaddr;
    //@ts-ignore
    window.ENR = ENR;
    setDiscv5(portal);

    await portal.start();

    portal.enableLog();
    setENR(portal.client.enr.encodeTxt(portal.client.keypair.privateKey));
    portal.client.on("discovered", (msg) => console.log("discovered", msg));
    portal.client.on("talkRespReceived", (src, enr, msg) =>
      console.log("Msg received", msg)
    );
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="50vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Heading>Ultralight Node Interface</Heading>
          <Button disabled={!portal} onClick={() => setShowInfo(!showInfo)}>
            Show Node Info
          </Button>
          {showInfo && <ShowInfo portal={portal!} />}
          {portal && <AddressBookManager portal={portal} />}
        </Grid>
      </Box>
    </ChakraProvider>
  );
};;
