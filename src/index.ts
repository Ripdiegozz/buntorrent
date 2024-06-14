import bencode from 'bencode';
import type { BunFile } from 'bun';
const dgram = require('node:dgram')

const torrent: BunFile = Bun.file('puppy.torrent');

const torrentBuffer: Buffer = Buffer.from(await torrent.arrayBuffer());

const torrentText = bencode.decode(torrentBuffer, 'utf-8');

const url: URL = new URL(torrentText['announce']);

console.log("UDP-URL: " + url);

// 3
const socket = dgram.createSocket('udp4');
// 4
const myMsg = Buffer.from('hello?', 'utf8');
// 5
socket.send(myMsg, 0, myMsg.length, url.port, url.host, () => {});
// 6
socket.on('message', (msg: any) => {
  console.log('message is', msg);
});