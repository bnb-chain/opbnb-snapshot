# opbnb-snapshot

## Endpoint

Snapshots are created and preserved every week,
and each snapshot is kept for 30 days.
NodeReal, a community developer, is responsible for regularly creating and updating the snapshots.

At present, we offer snapshots for both the mainnet and testnet networks in path-based state scheme and archived formats.
It is advisable to utilize the path-based state scheme snapshot for quicker synchronization, improved performance, and reduced storage needs.

For more details about different node type and database scheme, please refer to the [official documentation](https://docs.bnbchain.org/opbnb-docs/docs/tutorials/run-nodes-best-practices/).

### *Mainnet*
- Path-Base-State-Scheme(recommand):
    - url: https://opbnb-snapshot-mainnet.bnbchain.org/geth-pbss-20240705.tar.gz 
    - sha256 checksum: 7b3ea471f93f488a7312fbc13460df7bf264f256242ba92437968c3449295681
- Archived:  
    - The full archived node status is too large(over 5.6 TB at the end of May, 2024). There is no available archive snapshot at the moment.
    If you do need a full archived node, you have to sync the node from scratch.
- Pruned Archived: (Note that the pruned snapshot has erased state data before block height: 19598373)
    - url:  https://opbnb-snapshot-mainnet.bnbchain.org/geth-prune-20240705.tar.gz
    - sha256 checksum: b7ba09238214e97e8d4e4cfcd27648ed3c5cf5bdabc1cd0897c7586506fc1d5c

### *Testnet*
- Path-Base-State-Scheme(recommand):  
    - url: https://opbnb-snapshot-testnet.bnbchain.org/geth-pbss-20240705.tar.gz
    - sha256 checksum: 054d6817614a175534eaf67172edb7f311f656b013cdeee4331a97f3732b5902
- Archived:
    - There is no available archive snapshot at the moment.

Additionally, you can get the latest snapshot url and sha256 checksum as below:

```
$ curl https://opbnb-snapshot-mainnet.bnbchain.org/geth-pbss-latest
geth-pbss-20240525.tar.gz

$ curl https://opbnb-snapshot-mainnet.bnbchain.org/geth-pbss-20240525.tar.gz.sha256
d361af99362f3e6c55984e4aff127fffe9939e5c28274450f4b168b04d87370a  geth-pbss-20240525.tar.gz
```

## Usage

### Step 1: Download the snapshot and decompress it.

```bash
wget -q -O - https://opbnb-snapshot-mainnet.bnbchain.org/geth-pbss-20240525.tar.gz | tar -xvf -
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
