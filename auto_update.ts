import { Logger } from "ethers/lib/utils";
import Template from "https://deno.land/x/template@v0.1.0/mod.ts";

// date format: YYYYMMDD, e.g. 20231102
function getSnapshotURL(network: "mainnet" | "mainnet_prune" | "mainnet_pbss" | "testnet" | "testnet_pbss", date: Date): string {
  const dateString = date.toISOString().substr(0, 10).replace(/-/g, "");
  if (network === "mainnet") {
    return `https://opbnb-snapshot-mainnet.bnbchain.org/geth-${dateString}.tar.gz`;
  } else if ((network === "mainnet_prune"))  {
    return `https://opbnb-snapshot-mainnet.bnbchain.org/geth-prune-${dateString}.tar.gz`;
  } else if ((network === "mainnet_pbss"))  {
    return `https://opbnb-snapshot-mainnet.bnbchain.org/geth-pbss-${dateString}.tar.gz`;
  } else if ((network === "testnet_pbss"))  {
    return `https://opbnb-snapshot-testnet.bnbchain.org/geth-pbss-${dateString}.tar.gz`;
  } else {
    return `https://opbnb-snapshot-testnet.bnbchain.org/geth-${dateString}.tar.gz`;
  }
}

async function getLatestSnapshotURL(network: "mainnet" | "mainnet_prune" | "mainnet_pbss" | "testnet" | "testnet_pbss") {
  const date = new Date();
  for (let i = 0; i < 10; i++) {
    const url = getSnapshotURL(network, date);
    const resp = await fetch(url);
    console.log(url, resp.status);
    if (resp.status === 200) {
      return url;
    }
    date.setDate(date.getDate() - 1);
  }
  throw new Logger("no snapshot found in latest 10 days");
}

async function main() {
  // const mainnetLatestSnapshotURL = await getLatestSnapshotURL("mainnet");
  const mainnetPruneLatestSnapshotURL = await getLatestSnapshotURL("mainnet_prune");
  const mainnetPbssLatestSnapshotURL = await getLatestSnapshotURL("mainnet_pbss");
  const testnetLatestSnapshotURL = await getLatestSnapshotURL("testnet");
  const testnetPbssLatestSnapshotURL = await getLatestSnapshotURL("testnet_pbss");
  const data = {
    mainnet: "https://opbnb-snapshot-mainnet.bnbchain.org/geth-20240418.tar.gz",
    mainnetPrune: mainnetPruneLatestSnapshotURL,
    mainnetPbss: mainnetPbssLatestSnapshotURL,
    testnet: testnetLatestSnapshotURL,
    testnetPbss: testnetPbssLatestSnapshotURL,
    updatedAt: new Date().toISOString(),
  };
  console.log(data);
  // Render a template
  const tpl = new Template();
  const result = await tpl.renderFile("./README.md.template", data);
  console.log(result);
  await Deno.writeTextFile("./README.md", result);
}

await main();
