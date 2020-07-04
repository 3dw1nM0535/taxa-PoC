import React, { useEffect } from 'react';
import './App.scss';
import Ipfs from 'ipfs';
import OrbitDB from 'orbit-db';
import { initDB } from './actions';
import { store } from './store';

let ipfs = null;
let orbitdbInstance = null;
let db = null;

const App = () => {
  useEffect(() => {
    const startIpfs = async() => {
      if (ipfs) {
        console.info('IPFS already started');
        orbitdbInstance = await OrbitDB.createInstance(ipfs);
        db = await orbitdbInstance.keyvalue('first-db');
        store.dispatch(initDB({ ...db, loaded: true }));
      } else if (window.ipfs && window.ipfs.enable) {
        console.info('Found window.ipfs');
        ipfs = await window.ipfs.enable({ commands: ['id'] });
        orbitdbInstance = await OrbitDB.createInstance(ipfs);
        db = await orbitdbInstance.keyvalue('first-db');
        store.dispatch(initDB({ ...db, loaded: true }));
      } else {
        try {
          console.time('IPFS started');
          ipfs = await Ipfs.create();
          orbitdbInstance = await OrbitDB.createInstance(ipfs);
          db = await orbitdbInstance.keyvalue('first-db');
          store.dispatch(initDB({ ...db, loaded: true }));
          console.timeEnd('IPFS started');
        } catch(err) {
          console.error('IPFS init error:', err);
          ipfs = null;
        }
      }
    }

    startIpfs();
    return function cleaup() {
      if (ipfs && ipfs.stop) {
        console.info('Stopping IPFS');
        ipfs.stop().catch(err => console.error(err));
        ipfs = null;
      }
    }
  })
  return (
    <div>
      <h1>Welcome to Foo marketplace</h1>
    </div>
  );
}

export default App;
