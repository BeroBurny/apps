// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initPolkadotSnap } from '@chainsafe/metamask-polkadot-adapter/build/extension';
import { catchError, firstValueFrom, from, of, timeout, zip } from 'rxjs';

type Browser = 'chrome' | 'firefox';

interface Extension {
  desc: string;
  link: string;
  name: string;
}

interface Known {
  all: Record<Browser, string>;
  desc: string;
  name: string;
}

// The list of known extensions including the links to tem on the store. This is used when
// no extensions are actually available, promoting the user to install one or more
// (Any known extension can and should be added here)

const known: Known[] = [
  {
    all: {
      chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
    },
    desc: 'Basic account injection and signer',
    name: 'polkadot-js extension'
  }
];

export const availableExtensions = known.reduce<Record<Browser, Extension[]>>((available, { all, desc, name }) => {
  Object.entries(all).forEach(([browser, link]): void => {
    available[browser as Browser].push({ desc, link, name });
  });

  return available;
}, { chrome: [], firefox: [] });

// Some extensions do not use `@polkadot/extension-inject` and need to be manually inject into a window context
export function injectExtensions (): Promise<boolean[]> {
  return firstValueFrom(zip([
    initPolkadotSnap
  ].map((method) => firstValueFrom(from(method()).pipe(
    timeout(1000), // timeout if method() doesn't resolve after 1s
    catchError(() => of(false))
  )))));
}
