import Tracker from './tracker';

const torrent: Buffer = Buffer.from(await Bun.file('puppy.torrent').arrayBuffer());

const tracker = new Tracker(torrent);

tracker.getPeers(torrent, (peers: any) => {
  console.log('list of peers: ', peers);
});