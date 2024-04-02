import { ethers } from 'ethers';
import { DREAM_PROXY_FACTORY_ADDRESS } from '../utils/config';
import { provider } from '../utils/EProviders';
import { IEvent } from './interfaces';
import { logger, logError } from '../utils/logger';

import { DreamModel } from '../models/dreamModel';

const log = logger.extend('ws');
const logErr = logError.extend('ws');

const events: { [index: string]: IEvent } = {
  ProxyCreated: {
    name: 'ProxyCreated',
    signature: 'ProxyCreated(address,address)',
    contract: DREAM_PROXY_FACTORY_ADDRESS,
  },
  ReceivedFees: {
    name: 'ReceivedFees',
    signature: 'ReceivedFees(address,uint256)',
    contract: DREAM_PROXY_FACTORY_ADDRESS,
  },
  DreamFunded: {
    name: 'DreamFunded',
    signature: 'DreamFunded(address,uint256)',
    contract: '',
  },
  DreamRefunded: {
    name: 'DreamRefunded',
    signature: 'DreamRefunded(address,uint256)',
    contract: '',
  },
  MinFundingAmountChanged: {
    name: 'MinFundingAmountChanged',
    signature: 'MinFundingAmountChanged(uint256)',
    contract: '',
  },
};

class EventWatcher {
  buildFilter(contractAddress: string, eventName: string) {
    return {
      address: contractAddress,
      topics: [ethers.id(eventName)],
    };
  }

  parseLogs(event: string, data: string) {
    const Interface = new ethers.Interface([`event ${event}`]);
    const decoded = Interface.decodeEventLog(event, data);
    return decoded;
  }

  async addWatcher(contract: string, signature: string, name: string) {
    const filter = this.buildFilter(contract, signature);

    const listeners = await provider.listenerCount(filter);
    if (listeners != 0) {
      return;
    }

    provider.on(filter, async (event) => {
      const decoded = this.parseLogs(signature, event.data);
      await this.handleEvents(name, decoded);
    });
    log('Watcher added for:', name);
  }

  async removeWatcher(contract: string, signature: string) {
    const filter = this.buildFilter(contract, signature);

    const listeners = await provider.listenerCount(filter);
    if (listeners > 0) {
      provider.off(filter);
    }
    log('Watcher removed for:', contract);
  }

  async removeAllWatchers() {
    provider.removeAllListeners();
    log('All watchers removed');
  }

  async watch() {
    for (const event of Object.values(events)) {
      if (event.contract) {
        await this.addWatcher(
          event.contract,
          event.signature,
          event.name,
        );
      }
    }
    log('Watchers started');
  }

  async handleProxyCreated(args: any[], event: IEvent) {
    const [proxy, owner] = args;
    const proxyEachEvents = [];

    for (const event of Object.values(events)) {
      if (!event.contract) {
        proxyEachEvents.push(event);
      }
    }
    for (const event of proxyEachEvents) {
      await this.addWatcher(proxy, event.signature, event.name);
    }

    // Now save the informations to the database
    const dream = await DreamModel.updateOne(
      { owner: owner, proxyAddress: null },
      { proxyAddress: proxy },
    );
    if (!dream) {
      logErr('Dream not found: ', owner);
    }
  }

  async handleReceivedFees(args: any[], event: IEvent) {
    const [proxy, amount] = args;
    await this.removeWatcher(proxy, event.signature);
  }

  async handleDreamFunded(args: any[], event: IEvent) {
    console.log('Dream funded: ', args);
  }

  async handleDreamRefunded(args: any[], event: IEvent) {
    // DO the mongo thing
  }

  async handleMinFundingAmountChanged(args: any[], event: IEvent) {
    // DO the mongo thing
  }

  handleUnknownEvent(name: string) {
    logErr('Unknown event: ', name);
  }

  async handleEvents(name: string, args: any[]) {
    const event = events[name];
    console.log('Event: ', name);
    console.log(event);
    if (!event) {
      logErr('Event not found: ', name);
      return;
    }

    switch (name) {
      case 'ProxyCreated':
        await this.handleProxyCreated(args, event);
        break;
      case 'ReceivedFees':
        await this.handleReceivedFees(args, event);
        break;
      case 'DreamFunded':
        await this.handleDreamFunded(args, event);
        break;
      case 'DreamRefunded':
        await this.handleDreamRefunded(args, event);
        break;
      case 'MinFundingAmountChanged':
        await this.handleMinFundingAmountChanged(args, event);
        break;
      default:
        this.handleUnknownEvent(name);
    }
    log('Event handled: ', name);
  }
}

export const Watcher = new EventWatcher();
