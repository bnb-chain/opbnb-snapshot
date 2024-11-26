# opbnb-snapshot

## Endpoint

Snapshots are created and preserved every week,
and each snapshot is kept for 30 days.
NodeReal, a community developer, is responsible for regularly creating and updating the snapshots.

At present, we offer snapshots for both the mainnet and testnet networks in path-based state scheme and archived formats.
It is advisable to utilize the path-based state scheme snapshot for quicker synchronization, improved performance, and reduced storage needs.

For more details about different node type and database scheme, please refer to the [official documentation](https://docs.bnbchain.org/opbnb-docs/docs/tutorials/run-nodes-best-practices/).

**Note**

In the current version of the pbss snapshot,
if the op-node is started with EL (Execution Layer) sync enabled,
there may be an issue where the initialization state becomes inconsistent,
causing block synchronization to fail. To work around this,
disable EL sync by removing the `syncmode = execution-layer` configuration in op-node config.
This issue will be fixed in the next release.


### *Mainnet*
- Path-Base-State-Scheme(recommand):
    - url: https://pub-2ea2209b4ee74f4398c5ac50c3b2efeb.r2.dev/geth-mainnet-pbss-20241125.tar.gz 
    - sha256 checksum: 7276de8eca62a3de0421f13271584ef632983d2af1f407e9995daa9a9692d107
- Archived:  
    - The full archived node status is too large(over 5.6 TB at the end of May, 2024). There is no available archive snapshot at the moment.
    If you do need a full archived node, you have to sync the node from scratch.
- Pruned Archived: (Note that the pruned snapshot has erased state data before block height: 19598373)
    - url:  https://pub-2ea2209b4ee74f4398c5ac50c3b2efeb.r2.dev/geth-mainnet-prune-20241121.tar.gz
    - sha256 checksum: 915e3a5faa4e9093010a13059c033d0f8e55a13fa470ac026eb2b4772685b08f

### *Testnet*
- Path-Base-State-Scheme(recommand):  
    - url: https://pub-2ea2209b4ee74f4398c5ac50c3b2efeb.r2.dev/geth-testnet-pbss-20241122.tar.gz
    - sha256 checksum: effdf44bcb0e0d565c2a3bfd249d9677e23e2a49a6052f6c3b2a6eeeaac378eb
- Archived:
    - There is no available archive snapshot at the moment.

Additionally, you can get the latest snapshot url and sha256 checksum as below:

```
$ curl https://pub-2ea2209b4ee74f4398c5ac50c3b2efeb.r2.dev/geth-pbss-latest
geth-pbss-20240525.tar.gz

$ curl https://pub-2ea2209b4ee74f4398c5ac50c3b2efeb.r2.dev/geth-pbss-20240525.tar.gz.sha256
d361af99362f3e6c55984e4aff127fffe9939e5c28274450f4b168b04d87370a  geth-pbss-20240525.tar.gz
```

## Usage

### Step 1: Download the snapshot and decompress it.

```bash
wget -q -O - https://pub-2ea2209b4ee74f4398c5ac50c3b2efeb.r2.dev/geth-mainnet-pbss-20241125.tar.gz | tar -xvf -
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

## Build Your Own Snapshot

If you would like to build your own snapshot, you can follow the steps below:

```
tar -zcvf geth.tar.gz geth/chaindata geth/triecache
```

The process may take considerable time, depending on the size of the data.

**Reminder:** The `geth/nodekey` file is specific to each node. If you plan to create your own snapshot, make sure not to include this file, as it may lead to peer-to-peer (P2P) connectivity problems when using the snapshot.
