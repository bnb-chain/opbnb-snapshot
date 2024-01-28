# opbnb-snapshot

## Endpoint

Snapshot download link:
### *Mainnet*
https://tf-bnbchain-prod-opbnb-mainnet-snapshot-s3-ap-northeast-1.s3.ap-northeast-1.amazonaws.com/geth-20240125.tar.gz

### *Testnet*
https://tf-nodereal-prod-opbnb-testnet-snapshot-s3-ap.s3.ap-northeast-1.amazonaws.com/geth-20240125.tar.gz


> Snapshots are generated and retained on a weekly basis, with each snapshot being stored for a duration of 7 days. Community developer NodeReal is responsible for creating and updating the testnet snapshot regularly.

## Usage

### Step 1: Download the snapshot and decompress it.

```bash
wget -q -O - https://tf-bnbchain-prod-opbnb-mainnet-snapshot-s3-ap-northeast-1.s3.ap-northeast-1.amazonaws.com/geth-20231012.tar.gz | tar -xvf -
```

### Step 2: Replace the data.

1. Stop the running `op-geth` client, ensuring that it has completely shut down.
2. To back up the original data, execute the following commands:
    ```
    mv ${OPGeth_DataDir}/geth/chaindata ${OPGeth_DataDir}/geth/chaindata_backup
    mv ${OPGeth_DataDir}/geth/triecache ${OPGeth_DataDir}/geth/triecache_backup
    ```
3. Replace the data with the snapshot by running:
    ```
    mv ./geth/chaindata ${OPGeth_DataDir}/geth/chaindata
    mv ./geth/triecache ${OPGeth_DataDir}/geth/triecache
    ```
4. Restart the `op-geth` client and verify the logs.
