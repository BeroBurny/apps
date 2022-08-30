// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initPolkadotSnap } from "@chainsafe/metamask-polkadot-adapter/build/extension";

// it would have been really good to import this from detect-browser, however... not exported
type Browser = 'chrome' | 'firefox';

interface Extension {
  desc: string;
  link: string;
  name: string;
}

// The list of known extensions including the links to tem on the store. This is used when
// no extensions are actually available, promoting the user to install one or more

export const availableExtensions: Record<Browser, Extension[]> = [
  {
    browsers: {
      chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
    },
    desc: 'Basic account injection and signer',
    name: 'polkadot-js extension'
  }
].reduce((available: Record<Browser, Extension[]>, { browsers, desc, name }): Record<Browser, Extension[]> => {
  Object.entries(browsers).forEach(([browser, link]): void => {
    available[browser as 'chrome'].push({ desc, link, name });
  });

  return available;
}, { chrome: [], firefox: [] });

// Some extensions do not use `@polkadot/extension-inject` and need to be manually inject into a window context

export function injectExtensions (): Promise<boolean[]> {
  return Promise.all([
    initPolkadotSnap,
  ].map((method) => {
    // Timeout injecting extension
    return Promise.race([
      method(),
      new Promise<false>((resolve) => {
        setTimeout((): void => { resolve(false); }, 1000 /* 1 sec */);
      }),
    ]);
  }));
}
