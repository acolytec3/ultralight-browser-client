import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Grid,
  theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { ENR, Discv5 } from "@chainsafe/discv5";
import PeerId from "peer-id";
import { Multiaddr } from "multiaddr";
import ShowInfo from "./Components/ShowInfo";

export const App = () => {
  const [discv5, setDiscv5] = React.useState<Discv5>();
  const [enr, setENR] = React.useState<string>();

  React.useEffect(() => {
    if (discv5) {
      setENR(discv5.enr.encodeTxt(discv5.keypair.privateKey));
    }
  }, [discv5]);
  const init = async () => {
    const id = await PeerId.create({ keyType: "secp256k1" });
    const enr = ENR.createFromPeerId(id);
    //@ts-ignore
    enr.setLocationMultiaddr(new Multiaddr("/ip4/127.0.0.1/udp/0"));
    //@ts-ignore
    const discv5 = Discv5.create({
      enr: enr,
      peerId: id,
      //@ts-ignore
      multiaddr: new Multiaddr("/ip4/127.0.0.1/udp/0"),
      transport: "wss",
      proxyAddress: "ws://127.0.0.1:5050",
    });
    //@ts-ignore
    window.discv5 = discv5;
    //@ts-ignore
    window.Multiaddr = Multiaddr;
    //@ts-ignore
    window.ENR = ENR;
    setDiscv5(discv5);
    await discv5.start();
    discv5.enableLogs();
    console.log("started discv5", discv5.isStarted());
    setENR(discv5.enr.encodeTxt(discv5.keypair.privateKey));
    discv5.on("discovered", (msg) => console.log(msg));
    discv5.on("talkReqReceived", (srcId, enr, msg) =>
      console.log("content requested", msg.request.toString())
    );
    //  discv5.on("talkRespReceived", (srcId, enr, msg) => console.log(`got back a response - ${msg.response.toString()} to request ${msg.id}`))
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      {discv5 && <ShowInfo discv5={discv5} />}
      <Box textAlign="center" fontSize="xl">
        <Grid minH="50vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Text>Is Discv5 here?</Text>
            {enr && <Text>{enr}</Text>}
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};;
