import bencode from 'bencode';
import dgram from 'node:dgram';
import crypto from 'node:crypto';

export default class Tracker {
  private torrent: Buffer;
  private url: URL;
  private socket: dgram.Socket

  constructor(torrent: Buffer) {
    this.torrent = torrent;

    this.url = bencode.decode(torrent, 'utf-8').announce.toString();
    this.socket = dgram.createSocket('udp4');
  }

  public async getPeers(torrent: Buffer, callback: any) {
    // 1. send connect request
    this.udpSend(this.socket, this.buildConnReq(), this.url);

    this.socket.on('message', response => {
      console.log(response);

      if (this.respType(response) === 'connect') {
        // 2. receive and parse connect response
        const connResp = this.parseConnResp(response);

        // 3. send announce request
        const announceReq = this.buildAnnounceReq(connResp.connectionId);

        this.udpSend(this.socket, announceReq, this.url);
      } else if (this.respType(response) === 'announce') {
        // 4. parse announce response
        const announceResp = this.parseAnnounceResp(response);

        // 5. pass peers to callback
        callback(announceResp.peers);
      }
    });
  }

  udpSend(socket: dgram.Socket, message: any, rawUrl: URL, callback = () => {}) {
    // Parse rawUrl
    const url: URL = new URL(rawUrl);
    console.log("URL PORT: ", url.port)
    console.log("URL HOST: ", url.host)
    console.log("URL PATH: ", url.pathname)
    
    socket.send(message, 0, message.length, parseInt(url.port), url.host, callback);
  }

  respType(resp: any): string {
    // ...
    console.log(resp)

    return resp;
  }
  
  buildConnReq() {
    const buf: Buffer = Buffer.alloc(16);
  
    // connection id
    buf.writeUInt32BE(0x417, 0);
    buf.writeUInt32BE(0x27101980, 4);

    // action
    buf.writeUInt32BE(0, 8);

    // transaction id
    crypto.randomBytes(4).copy(buf, 12);
  
    return buf;
  }
  
  parseConnResp(resp: any) {
    return {
      action: resp.readUInt32BE(0),
      transactionId: resp.readUInt32BE(4),
      connectionId: resp.slice(8)
    }
  }
  
  buildAnnounceReq(connId: any): any {

    console.log(connId);
    // ...
  }
  
  parseAnnounceResp(resp: any): any {
    console.log(resp);
    // ...
  }
}