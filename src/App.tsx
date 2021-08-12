import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { ENR, Discv5 } from '@chainsafe/discv5'
import PeerId from 'peer-id'
import { Multiaddr } from "multiaddr"

export const App = () => {
  const [discv5, setDiscv5] = React.useState<Discv5>()
  const [enr, setENR] = React.useState<string>()
  const init = async () => {
    const id = await PeerId.create({ keyType: 'secp256k1' })
    const enr = ENR.createFromPeerId(id)
    //@ts-ignore
    enr.setLocationMultiaddr(new Multiaddr('/ip4/127.0.0.1/tcp/4001/wss'))
    //@ts-ignore
    const discv5 = Discv5.create({enr: enr, peerId: id, multiaddr: new Multiaddr('/ip4/127.0.0.1/tcp/4001/wss'), transport: 'wss'})
    //@ts-ignore
    window.discv5 = discv5;
    //@ts-ignore
    window.Multiaddr = Multiaddr
    setDiscv5(discv5);
    await discv5.start();
    console.log('started discv5', discv5.isStarted())
    setENR(discv5.enr.encodeTxt(discv5.keypair.privateKey))
    discv5.on('discovered', (msg) => console.log(msg))
    discv5.on('talkReqReceived', (msg) => console.log(msg))
  }


  React.useEffect(() => {
    init();
  },[])

  return (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Text>Is Discv5 here?</Text>
          {enr && <Text>{enr}</Text>}
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
)}
