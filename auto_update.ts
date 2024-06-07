import Template from "https://deno.land/x/template@v0.1.0/mod.ts";

// date format: YYYYMMDD, e.g. 20231102
function getSnapshotURL(
  network:
    | "mainnet"
    | "mainnet_prune"
    | "mainnet_pbss"
    | "testnet"
    | "testnet_pbss",
  date: Date
): string {
  const dateString = date.toISOString().substr(0, 10).replace(/-/g, "");
  if (network === "mainnet") {
    return `https://opbnb-snapshot-mainnet.bnbchain.org/geth-${dateString}.tar.gz`;
  } else if (network === "mainnet_prune") {
    return `https://opbnb-snapshot-mainnet.bnbchain.org/geth-prune-${dateString}.tar.gz`;
  } else if (network === "mainnet_pbss") {
    return `https://opbnb-snapshot-mainnet.bnbchain.org/geth-pbss-${dateString}.tar.gz`;
  } else if (network === "testnet_pbss") {
    return `https://opbnb-snapshot-testnet.bnbchain.org/geth-pbss-${dateString}.tar.gz`;
  } else if (network === "testnet") {
    return `https://opbnb-snapshot-testnet.bnbchain.org/geth-${dateString}.tar.gz`;
  } else {
    throw new Error("invalid network");
  }
}

async function getLatestSnapshot(
  network:
    | "mainnet"
    | "mainnet_prune"
    | "mainnet_pbss"
    | "testnet"
    | "testnet_pbss"
) {
  const date = new Date();
  let url = "";
  let found = false;
  const days = 15;
  for (let i = 0; i < days; i++) {
    url = getSnapshotURL(network, date);
    const resp = await fetch(url);
    console.log(url, resp.status);
    if (resp.status === 200) {
      found = true;
      break;
    }
    date.setDate(date.getDate() - 1);
  }
  if (!found) {
    throw new Error(`no snapshot found in latest ${days} days`);
  }
  // check latest url
  const latestURL = getLatestSnapshotURL(network);
  const latestURLRes = await fetch(latestURL);
  const content = (await latestURLRes.text()).trim();
  const urlPostfix = url.split("/").pop();
  if (content !== urlPostfix) {
    throw new Error(
      `latest snapshot url is not the latest, latest: ${content}, expected: ${urlPostfix}`
    );
  }
  // check sha256 checksum
  const sha256URL = `${url}.sha256`;
  const sha256Res = await fetch(sha256URL);
  const sha256Text = await sha256Res.text();
  const sha256 = sha256Text.split(" ")[0];
  const data = {
    url,
    sha256,
  };
  console.dir({ network, data });
  return data;
}

function getLatestSnapshotURL(
  network:
    | "mainnet"
    | "mainnet_prune"
    | "mainnet_pbss"
    | "testnet"
    | "testnet_pbss"
) {
  if (network === "mainnet") {
    return `https://opbnb-snapshot-mainnet.bnbchain.org/geth-latest`;
  } else if (network === "mainnet_prune") {
    return `https://opbnb-snapshot-mainnet.bnbchain.org/geth-prune-latest`;
  } else if (network === "mainnet_pbss") {
    return `https://opbnb-snapshot-mainnet.bnbchain.org/geth-pbss-latest`;
  } else if (network === "testnet_pbss") {
    return `https://opbnb-snapshot-testnet.bnbchain.org/geth-pbss-latest`;
  } else if (network === "testnet") {
    return `https://opbnb-snapshot-testnet.bnbchain.org/geth-latest`;
  } else {
    throw new Error("invalid network");
  }
}

async function main() {
  // const mainnetLatestSnapshotURL = await getLatestSnapshotURL("mainnet");
  // const testnetLatestSnapshotURL = await getLatestSnapshot("testnet");
  const testnetPbssLatestSnapshotURL = await getLatestSnapshot("testnet_pbss");
  const mainnetPbssLatestSnapshotURL = await getLatestSnapshot("mainnet_pbss");
  const mainnetPruneLatestSnapshotURL = await getLatestSnapshot(
    "mainnet_prune"
  );
  const data = {
    mainnetPrune: mainnetPruneLatestSnapshotURL,
    mainnetPbss: mainnetPbssLatestSnapshotURL,
    // testnet: testnetLatestSnapshotURL,
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
