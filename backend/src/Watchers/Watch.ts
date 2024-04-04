import { N, ethers } from 'ethers';
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

  proxyEvents: IEvent[];

  constructor() {
    this.proxyEvents = Object.values(events).filter((event) => !event.contract);
  }

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
      const origin = event.address;

      await this.handleEvents(name, origin, decoded);
    });

    log('🟢', name);
  }

  async removeWatcher(contract: string, signature: string, name: string) {
    const filter = this.buildFilter(contract, signature);

    const listeners = await provider.listenerCount(filter);
    if (listeners > 0) {
      provider.off(filter);
    }
  
    log("🔴", name);
  }

  async removeAllWatchers() {
    log('Removing all watchers:');
    provider.removeAllListeners();
  }

  async manageProxyWatcher(proxy: string, addWatcher: boolean) {
    log("🎯", proxy);
    
  
    for (const event of this.proxyEvents) {
      if (addWatcher) {
        await this.addWatcher(proxy, event.signature, event.name);
      } else {
        await this.removeWatcher(proxy, event.signature, event.name);
      }
    }
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
    log('🚀 Watchers started');
  }

  async handleProxyCreated(args: any[], event: IEvent) {
    const [proxy, owner] = args;

    await this.manageProxyWatcher(proxy, true);

    const dream = await DreamModel.updateOne(
      { owner: owner, proxyAddress: null },
      { proxyAddress: proxy },
    );
    if (!dream || dream.matchedCount === 0) {
      logErr('Dream not found: ', owner);
    }
  }

  async handleReceivedFees(args: any[], event: IEvent) {
    const [proxy, amount] = args;

    await this.manageProxyWatcher(proxy, false);

    // call the give earns contract

    const dream = await DreamModel.updateOne(
      { proxyAddress: proxy },
      {
        status: "reached",
      }
    );
    if (!dream || dream.matchedCount === 0) {
      logErr('Dream not found: ', proxy);
    }

    
  }

  async handleDreamFunded(origin: string, args: any[], event: IEvent) {
    const [funder, amount] = args;

    const dream = await DreamModel.findOne({ proxyAddress: origin });
    if (!dream) {
      logErr('Dream not found: ', origin);
      return;
    }

    const funderIndex = dream.funders.findIndex((f) => f.address === funder);
    if (funderIndex !== -1) {
      dream.funders[funderIndex].amount += amount;
    } else {
      dream.funders.push({ address: funder, amount });
    }

    await dream.save();
  }

  async handleDreamRefunded(origin: string, args: any[], event: IEvent) {
    // DO the mongo thing
  }

  async handleMinFundingAmountChanged(origin: string, args: any[], event: IEvent) {

    const [amount] = args;

    const dream = await DreamModel.updateOne(
      { proxyAddress: origin },
      { minFundingAmount: amount },
    );
    console.log(dream);
    if (!dream || dream.matchedCount === 0) {
      logErr('Dream not found: ', origin);
    }
  }

  handleUnknownEvent(name: string) {
    logErr('Unknown event: ', name);
  }

  async handleEvents(name: string, origin: string, args: any[]) {
    const event = events[name];

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
        await this.handleDreamFunded(origin, args, event);
        break;
      case 'DreamRefunded':
        await this.handleDreamRefunded(origin, args, event);
        break;
      case 'MinFundingAmountChanged':
        await this.handleMinFundingAmountChanged(origin, args, event);
        break;
      default:
        this.handleUnknownEvent(name);
    }
    log('Event handled: ', name);
  }
}

export const Watcher = new EventWatcher();
