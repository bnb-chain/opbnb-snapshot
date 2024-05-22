# opbnb-snapshot

## Endpoint

Snapshot download link:
### *Mainnet*
- Archived:  
https://opbnb-snapshot-testnet.bnbchain.org/geth-20240418.tar.gz
- Pruned:  
https://opbnb-snapshot-mainnet.bnbchain.org/geth-prune-20240521.tar.gz 
（Note that the pruned snapshot has erased state data before block height: 19598373)
### *Testnet*
- Archived:  
https://opbnb-snapshot-testnet.bnbchain.org/geth-20240516.tar.gz


> Snapshots are generated and retained on a weekly basis, with each snapshot being stored for a duration of 7 days. Community developer NodeReal is responsible for creating and updating the testnet snapshot regularly.

## Usage

### Step 1: Download the snapshot and decompress it.

```bash
wget -q -O - https://opbnb-snapshot-testnet.bnbchain.org/geth-20240418.tar.gz | tar -xvf -
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
