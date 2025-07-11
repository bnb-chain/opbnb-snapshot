import Template from "https://deno.land/x/template@v0.1.0/mod.ts";

const baseURL = "https://pub-2ea2209b4ee74f4398c5ac50c3b2efeb.r2.dev";

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
    return `${baseURL}/geth-mainnet-${dateString}.tar.gz`;
  } else if (network === "mainnet_prune") {
    return `${baseURL}/geth-mainnet-prune-${dateString}.tar.gz`;
  } else if (network === "mainnet_pbss") {
    return `${baseURL}/geth-mainnet-pbss-${dateString}.tar.gz`;
  } else if (network === "testnet_pbss") {
    return `${baseURL}/geth-testnet-pbss-${dateString}.tar.gz`;
  } else if (network === "testnet") {
    return `${baseURL}/geth-testnet-${dateString}.tar.gz`;
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
  const days = 7;
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
    return `${baseURL}/geth-mainnet-latest`;
  } else if (network === "mainnet_prune") {
    return `${baseURL}/geth-mainnet-prune-latest`;
  } else if (network === "mainnet_pbss") {
    return `${baseURL}/geth-mainnet-pbss-latest`;
  } else if (network === "testnet_pbss") {
    return `${baseURL}/geth-testnet-pbss-latest`;
  } else if (network === "testnet") {
    return `${baseURL}/geth-testnet-latest`;
  } else {
    throw new Error("invalid network");
  }
}

async function main() {
  let testnetPbssLatestSnapshotURL, mainnetPbssLatestSnapshotURL, mainnetPruneLatestSnapshotURL;
  
  try {
    testnetPbssLatestSnapshotURL = await getLatestSnapshot("testnet_pbss");
  } catch (e) {
    console.error("Failed to get testnet_pbss snapshot:", e);
    testnetPbssLatestSnapshotURL = null; // or some fallback value
  }
  
  try {
    mainnetPbssLatestSnapshotURL = await getLatestSnapshot("mainnet_pbss");
  } catch (e) {
    console.error("Failed to get mainnet_pbss snapshot:", e);
    mainnetPbssLatestSnapshotURL = null;
  }
  
  try {
    mainnetPruneLatestSnapshotURL = await getLatestSnapshot("mainnet_prune");
  } catch (e) {
    console.error("Failed to get mainnet_prune snapshot:", e);
    mainnetPruneLatestSnapshotURL = null;
  }
  const data = {
    mainnetPrune: mainnetPruneLatestSnapshotURL,
    mainnetPbss: mainnetPbssLatestSnapshotURL,
    // testnet: testnetLatestSnapshotURL,
    testnetPbss: testnetPbssLatestSnapshotURL,
    baseURL,
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
