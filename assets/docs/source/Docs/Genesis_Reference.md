# Atho Genesis and Network Constants Reference

Date: 2026-03-27

This reference captures the current hardcoded genesis state and key consensus constants used by the running code path.

## Source of Truth
- `Docs/Genesis/mainnet_hardcoded_genesis.json`
- `Docs/Genesis/testnet_hardcoded_genesis.json`
- `Docs/Genesis/network_hardcoded_genesis.json`
- `Src/Utility/const.py`

## Hardcoded Genesis Blocks
### Mainnet Genesis (Hardcoded)
- version: `1.00`
- height: `0`
- timestamp: `1773360488`
- nonce: `8542`
- tx_count: `1`
- genesis hash: `00001d78b119b6e1f25bc7977ea231df94c28c2967d4e113cd3a7120a4e7f37847813ec1a4177d95e123e096ab9554a9`
- merkle root: `a05dad58e23b18bbeae048d8b40d1dcf4ae83eb413c11de639a9a5dba5209bad39463fc7e66f4c6463918ea5ab00b81a`
- witness commitment: `07598f33a836639376e9be5a138bd1238674ca496fa4c889000bfe70846722e9933c1ba27fffa5e8214a43878d193d40`
- miner address: `ATHOfe89ad1b663bd8b316247b5b19368326184d2af14108577e562f3359ce84074ba900ca5616e0bfa9c3feb390681838a5`
- coinbase txid: `a05dad58e23b18bbeae048d8b40d1dcf4ae83eb413c11de639a9a5dba5209bad39463fc7e66f4c6463918ea5ab00b81a`
- coinbase amount: `10 ATHO`
- serialized size: `3022 bytes`

### Testnet Genesis (Hardcoded)
- version: `1.00`
- height: `0`
- timestamp: `1773360489`
- nonce: `2212`
- tx_count: `1`
- genesis hash: `0000163818b36c4be830e6dec9c84a180f552f903c653bdb371bfcb742a39a603ef637c2a048c9453b6f39124cc41e60`
- merkle root: `6fe38992074617b98f4d966a5d1df22968205ab41fe8d9e41f6d1790ac6a46b6791f536a3392b86d0f6644bd685f9d74`
- witness commitment: `b55bc2eb30aa612d3647d5053e13e94f986e08abea9e7820cefccbc88ba80d50d72d36dd4078172a513743be412c545c`
- miner address: `ATHTfe89ad1b663bd8b316247b5b19368326184d2af14108577e562f3359ce84074ba900ca5616e0bfa9c3feb390681838a5`
- coinbase txid: `6fe38992074617b98f4d966a5d1df22968205ab41fe8d9e41f6d1790ac6a46b6791f536a3392b86d0f6644bd685f9d74`
- coinbase amount: `10 ATHO`
- serialized size: `3022 bytes`


## Consensus Pool Addresses (Deterministic)
Derived from SHA3-384 network domain tags in `const.py`:
- mainnet: `P6C5KUr8cdwJqASn7Fb9N2wPvFJXrG2RbYBVFBDmdY4d7dbTS65aH2GguEtFdZ48jPUE`
- testnet: `LAdyCWxVYEkGFWr5Mdkr4gWYfStvtx7DQkVbqh3dff8avwre2yT69JVjYNBVhtEQ3WGQ`
- regnet: `LC9Z3kx9zw6NUa7sBUVZ5Zb9G9wvTMpXHd96pxKAYzkxgvVDmuXNU6RHw2hJeRcWBnBG`

## Core Runtime Constants (Current)
- block target: `120` seconds
- retarget interval: `180` blocks
- confirmations required: `10`
- coinbase maturity: `150`
- max block size: `2,500,000` bytes
- max transaction policy size: `250,000 vB`
- fee floor: `225 atoms/vB`
- BPoW enforcement height: `250`
- bond requirement: `25 ATHO`
- bond activation confirmations: `25`
- unbond delay: `10,080` blocks
- slash penalty: `2.5 ATHO`
- bootstrap allocation: `50,000 ATHO` at block `1`
- total pre-tail base path: `30,000,000 ATHO` (`29,950,000` subsidy + `50,000` bootstrap)

## Notes
- Genesis entries above are read from hardcoded JSON artifacts and are consensus-critical references.
- If any genesis field changes, the network history anchoring changes and clients must coordinate a new chain context.
