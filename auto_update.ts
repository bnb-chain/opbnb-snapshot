import Template from "https://deno.land/x/template@v0.1.0/mod.ts";

// date format: YYYYMMDD, e.g. 20231102
function getSnapshotURL(network: "mainnet" | "testnet", date: Date): string {
  const dateString = date.toISOString().substr(0, 10).replace(/-/g, "");
  if (network === "mainnet") {
    return `https://tf-bnbchain-prod-opbnb-mainnet-snapshot-s3-ap-northeast-1.s3.ap-northeast-1.amazonaws.com/geth-${dateString}.tar.gz`;
  } else {
    return `https://tf-nodereal-prod-opbnb-testnet-snapshot-s3-ap.s3.ap-northeast-1.amazonaws.com/geth-${dateString}.tar.gz`;
  }
}

async function getLatestSnapshotURL(network: "mainnet" | "testnet") {
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
  throw new Error("no snapshot found in latest 10 days");
}

async function main() {
  const mainnetLatestSnapshotURL = await getLatestSnapshotURL("mainnet");
  const testnetLatestSnapshotURL = await getLatestSnapshotURL("testnet");
  const data = {
    mainnet: mainnetLatestSnapshotURL,
    testnet: testnetLatestSnapshotURL,
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
