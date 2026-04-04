# Src File Map (Generated)

Last refresh: 2026-04-04.

This document is generated from `Src/` using AST parsing. It lists each module, its docstring (if any), classes, methods, and top-level functions with signatures and docstrings.
If behavior changed recently, regenerate this map from current code; this file is a snapshot and can lag behind active consensus/policy details.

## `Src/Accounts/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Accounts/change_default_key.py`

**Top-level functions:**

- `load_keys_from_json_or_generate(key_manager, file_path)` — Load keys from the JSON dump or generate them if no keys exist.
- `list_keys_with_defaults(keys)` — Display all keys from the JSON dump along with their current defaults.
- `change_defaults_interactively(keys, key_manager)` — Allow the user to interactively select a default key for testnet or mainnet.
- `rename_key(keys, network, old_id, new_id)` — Rename a key identifier for a given network without changing the key data.
If the key was a default for any role, update the defaults to the new name.
- `set_default_for_network(keys, network, identifier)` — Set a key as default for all roles in the specified network.
- `_extract_text_from_docx(path)` — (no docstring)
- `_extract_text_from_rtf(path)` — (no docstring)
- `_extract_text_from_pdf(path)` — (no docstring)
- `_read_key_file_raw(path)` — (no docstring)
- `_parse_key_file(path)` — Parse a key file (json or free-form text) for public_key, f, g, F, G, and optional hpk/base56.
- `find_identifier_by_key(keys, network, query)` — Resolve an identifier from id/base56/hashed_public_key input.
- `delete_key(keys, network, query)` — Delete a key (by id/base56/hpk) ensuring at least one key remains in the network.
If the key was default, move defaults to another remaining key.
- `parse_args()` — (no docstring)

## `Src/Accounts/ecript.py`

**Module docstring:**

Atho Wallet — Encrypting Keys at Rest (AES-256)

**Top-level functions:**

- `b64e(data)` — (no docstring)
- `b64d(data)` — (no docstring)
- `derive_key(password, salt, params)` — (no docstring)
- `encrypt_file(plain_path, enc_path, password)` — (no docstring)
- `decrypt_file(enc_path, out_path, password)` — (no docstring)
- `menu()` — (no docstring)

## `Src/Accounts/falconcli.py`

**Classes:**

- `SecureBuffer` — Securely stores sensitive data with automatic wiping
  - `__init__(self, data)` — (no docstring)
  - `wipe(self)` — Securely wipe the buffer contents
  - `__del__(self)` — (no docstring)
- `FalconCLI` — (no docstring)
  - `__init__(self, cli_path)` — Initialize the Falcon CLI wrapper with robust security features.
  - `__del__(self)` — Ensure all secure buffers are wiped when destroyed
  - `_find_cli_path(self, cli_path)` — Locate the CLI executable with multiple fallback locations
  - `_verify_cli_hash(self)` — Verify the falcon_cli binary using version-bound pinning (and optional legacy raw-hash fallback when configured).
  - `verify_signature(self, pub_hex, msg, sig_hex)` — Calls the C CLI:
  - `_is_hex(self, s)` — Return True if s is a valid hex string.
  - `_check_hex_len(self, name, s, n)` — Ensure s is hex and exactly n characters long.
  - `_validate_cli(self)` — Thorough validation of the CLI executable with better error handling
  - `_attempt_rebuild_cli(self)` — Try to rebuild falcon_cli for the current OS/arch.
  - `_create_secure_temp(self)` — Context manager for secure temporary operations
  - `_run_cli_command(self, command, *args)` — Run a CLI command with proper encoding handling
  - `keygen(self)` — Generate keys with robust parsing and validation
  - `_save_keys_to_json(self, keys, filename)` — Save keys to JSON file with secure handling
  - `_validate_private_key(self, private_key)` — Thorough validation of private key structure and format
  - `sign(self, private_key, message)` — Secure signing with additional validation and debugging
  - `verify_transaction_hash(self, public_key, message_hash, signature)` — ULTIMATE FIX: Specialized verification for transaction hashes (SHA3-384 hex digests)
This matches EXACTLY what the manual verification does
  - `verify_tx_hash(self, pub_hex, msg_hex, sig_hex, msg_mode)` — Enhanced verification with proper SHA3-384 hex digest handling for transaction hashes
  - `_verify_sha3_digest(self, pub_hex, msg_hex, sig_hex)` — STRICT: For SHA3-384 hex digests we verify the ASCII hex *as-is*.
No conversions, no temp files, no alternate orders.
  - `_verify_manual_sha3(self, pub_hex, msg_hex, sig_hex)` — Manual verification by constructing the exact byte sequence
  - `_verify_alternative_orders(self, pub_hex, msg_hex, sig_hex)` — Try different command line argument orders
  - `verify(self, public_key, message, signature, *, mode, allow_hex48_fallback)` — Verify a Falcon-512 signature using the CLI (optionally with FFI fallback).
  - `_verify_with_cli(self, pub, msg, sig)` — Call the Falcon C CLI `verify` command and return True only when the CLI
  - `_verify_as_raw_bytes(self, pub, msg_hex, sig)` — Verify by treating hex message as raw bytes
  - `_verify_as_hex_message(self, pub, msg_hex, sig)` — Verify using hex message directly
  - `_verify_manual_cli(self, pub, msg_hex, sig)` — Manual CLI construction as last resort
  - `b64sig_to_hex(sig_b64)` — (no docstring)
  - `keygen_to_file(self, pubkey_path, privkey_path)` — Generate keys and securely save to files
  - `sign_to_file(self, privkey_path, message, signature_path)` — Sign a message using private key from file
  - `verify_ascii(pub_hex, msg_ascii, sig_hex)` — (no docstring)
  - `verify_raw(pub_hex, msg_hex, sig_hex)` — (no docstring)
  - `verify_from_file(self, pubkey_path, message, signature_path)` — Verify a signature from files

## `Src/Accounts/helper.py`

**Top-level functions:**

- `serialize_complex(obj)` — Custom serializer for complex numbers.

## `Src/Accounts/key_manager.py`

**Classes:**

- `KeyManager` — (no docstring)
  - `__init__(self, key_file, cli_path)` — (no docstring)
  - `_extract_cli_key_materials(self, rec)` — Extract CLI key materials with better error handling
  - `_ensure_keys_directory_exists(self)` — Create keys directory if it doesn't exist
  - `get_cli_private_key(self, network, identifier)` — Returns the CLI private key dict {f,g,F,G} for the given key.
Raises with a clear message if the key was created by the old Python path.
  - `get_default_cli_keys(self, role, network)` — Return (private_key_dict, public_key_hex) for the default key of `role` on `network`,
strictly in CLI format.
  - `ensure_default_cli_key(self, role, network)` — Ensure the default key for (network, role) is a CLI-format key.
  - `_validate_all_keys(self)` — Validate CLI keys without forcing Python deserialization.
  - `validate_key_pair(self, network, identifier)` — Validate key consistency using CLI verification
  - `_auto_set_network_defaults(self)` — Tight defaults: only miner keys, capped to two identifiers (miner_1, miner_2).
No auto-generation for validator/channel.
  - `public_key(self, network, identifier)` — Return the network-prefixed hashed address for the given key.
Works for CLI format keys.
  - `load_or_initialize_keys(self)` — Load keys or initialize new structure with atomic safety
  - `initialize_keys_structure(self)` — Initialize with empty validated structure
  - `get_default_public_key(self, network, role)` — Retrieve the default public key for the given network and role.
  - `add_key_batch(self, network)` — Compatibility helper: now only ensures miner_1 and miner_2 exist.
  - `set_default_key(self, network, identifier)` — Set a key as default for all roles in the specified network.
:param network: Either 'testnet' or 'mainnet'.
:param identifier: The unique identifier of the key to set as default.
- `add_key(self, network, role, identifier, seed_hex, use_mnemonic, word_count, mnemonic_passphrase, account, index, iterations)` — Generate a new key (mnemonic-first by default; CLI seeded/raw path supported).
  - `import_cli_key(self, network, role, identifier, public_key_hex, private_parts, hashed_public_key)` — Import an existing Falcon key (CLI format). Validates components, computes HPK/Base56,
signs a test message for verification, and stores alongside existing keys.
Does NOT change defaults.
  - `validate_import_materials(self, network, public_key_hex, private_parts, hashed_public_key)` — Validate import materials without persisting:
  - `_generate_hashed_pubkey(self, h_hex, network)` — Generate hashed public key from CLI hex public key.
  - `_compute_base56(self, hashed_pubkey, network)` — Compute Base56 address from hashed public key (with internal prefix).
  - `_ensure_base56_addresses(self)` — Ensure every key record has an address_base56 field derived from hashed_public_key.
  - `save_keys(self)` — Save keys with atomic write pattern to prevent corruption
  - `interactive_menu(self)` — Interactive menu to manage keys, sign messages, and verify transactions.
- `import_export_file(self, path)` — Import keys from wallet export `.txt`.
Supports current structured text export format plus legacy warning-header format.
  - `verify_transaction_signature(self, public_key, message_hash, signature, network)` — ULTIMATE FIX: Verify transaction signature using EXACTLY the same method as manual verification
This ensures consistency between manual and transaction verification
  - `remove_key(self, network, identifier)` — Remove a key from the key store and clear defaults referencing it.
Returns (removed, new_default_identifier or None).
  - `set_default_key(self, network, identifier, role)` — Set default key for a role; persists to key file. Returns the identifier set, or None if not found.
  - `recompute_hashed_public_key(self, network, identifier)` — Recompute the hashed public key from the stored record.
Works for CLI keys.
  - `get_raw_public_key(self, script_pub_key, network)` — Retrieve the raw public key associated with the given script public key and network.
- `list_default_keys(self)` — List the current default keys for available networks (mainnet/testnet/regnet).
  - `sign_message_interactive(self)` — (no docstring)
  - `get_private_key_for_channel(self, network, role)` — Retrieve the private key for a specific role in a payment channel.
If no default key exists, generate one.
  - `list_keys(self, network)` — (no docstring)
  - `sign_transaction(self, message, network, identifier)` — Falcon-512 deterministic signing (via CLI) with comprehensive logging
  - `verify_transaction(self, message, signature, network, identifier)` — ULTIMATE FIX: Verification with comprehensive SHA3-384 handling
  - `debug_keys(self)` — Debug method to see what keys are loaded
  - `enforce_cli_only(self)` — Remove non-CLI records and ensure each role has a valid CLI default.
ONLY generates new keys if they don't exist.
  - `verify_with_pubkey(self, message, signature, network, pub_hex, expected_hpk)` — Verify using explicit Falcon public key (2048-hex).
IMPORTANT: If `message` is a 96-char hex string, we pass that ASCII hex to the CLI unchanged.
  - `verify_raw(self, public_key, message, signature)` — Direct verification without going through CLI.
This is a fallback method for in-process verification.
  - `_resolve_pub_from_identifier(self, network, identifier)` — Resolve a usable Falcon pubkey hex and its hashed form from any identifier:
  - `get_address(self, network, identifier)` — Get the hashed public key address for the default or specified key
  - `export_keys(self)` — Export a specific key set (miner, validator, channel) based on user selection.
Saves the exported keys in a .txt file with a box-like structure using UTF-8 encoding.
Offers an option to generate QR codes for each key.
  - `verify_and_update_hashed_public_key(self, network, identifier)` — Verify and update the stored hashed public key by recomputing it from the raw public key.
  - `get_identifier_by_hashed_pubkey(self, hashed_pubkey, network)` — Find the key identifier for a given hashed public key (address) in the specified network.
  - `generate_qr_code(self, private_key, public_key, hashed_public_key, identifier)` — Generates QR codes for:

## `Src/Accounts/wordlistm.py`

*(No classes, functions, or module docstring found.)*

## `Src/Api/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Api/apikey.py`

**Top-level functions:**

- `generate_secure_token()` — (no docstring)
- `generate_api_key_entry(name, permissions)` — (no docstring)
- `save_api_key(name, entry)` — (no docstring)
- `onboard_new_key(name)` — (no docstring)

## `Src/Api/apis.py`

**Classes:**

- `API` — Centralized API for blockchain operations.
Provides unified access to wallet, transactions, mining, and blockchain functions.
  - `__init__(self, network, auto_init)` — Initialize the API with optional network specification.
  - `initialize_components(self)` — Initialize all core components.
  - `_get_block_manager(self)` — (no docstring)
  - `get_wallet_addresses(self, network)` — Get wallet addresses for the specified network (miner only).
  - `get_balance(self, address, network)` — Get balance for an address or default address, including pending/available breakdown.
  - `_safe_base56(hpk, network)` — (no docstring)
  - `create_new_address(self, role, network)` — Create a new address (miner role supported).
  - `_resolve_identifier(self, network, query)` — Resolve a key identifier from id/base56/HPK input.
  - `rename_wallet_address(self, network, key, new_identifier)` — Rename a key identifier without altering key material. Defaults pointing to the old id are updated.
  - `delete_wallet_address(self, network, key)` — Delete a key (by id/base56/HPK). Requires at least one key to remain in the network.
Defaults pointing to the deleted key are reassigned to another existing key.
  - `_restart_miner_if_running(self)` — Restart miner loop so it picks up new default address.
  - `set_default_wallet_address(self, network, key)` — Set a key as default for all roles in the network.
  - `_resolve_identifier(self, network, query)` — Resolve a key identifier from id/base56/HPK input.
  - `rename_wallet_address(self, network, key, new_identifier)` — Rename a key identifier without altering key material. Defaults pointing to the old id are updated.
  - `delete_wallet_address(self, network, key)` — Delete a key (by id/base56/HPK). Requires at least one key to remain in the network.
Defaults pointing to the deleted key are reassigned to another existing key.
  - `send_transaction(self, recipient, amount, sender_address, network)` — Send transaction to recipient.
  - `get_transaction(self, txid)` — Get transaction by ID from mempool or blockchain.
  - `estimate_fee(self, recipient, amount, network)` — Estimate transaction fee.
  - `validate_transaction(self, tx_data)` — Stateless transaction validation via TransactionManager.
  - `get_address_history(self, address, limit)` — Return transactions touching an address with debit/credit direction.
Scans mempool + recent blocks (up to `limit` entries returned).
  - `start_mining(self, background)` — Start mining. If background=True, runs in separate thread.
  - `stop_mining(self)` — Stop background mining.
  - `_mining_loop(self)` — Background mining loop.
  - `get_mining_status(self)` — Get current mining status.
  - `get_blockchain_info(self)` — Get blockchain information.
  - `get_tip(self)` — Return tip height/hash.
  - `get_block(self, height, hash)` — Get block by height or hash.
  - `validate_block(self, block)` — Validate a block structure/merkle/pow via BlockManager.
  - `validate_chain(self)` — Validate the entire loaded chain.
  - `consensus_status(self)` — Lightweight consensus snapshot: tip height/hash, mempool count, network.
  - `storage_block_by_height(self, height)` — (no docstring)
  - `storage_block_by_hash(self, blk_hash)` — (no docstring)
  - `storage_latest_height(self)` — (no docstring)
  - `storage_utxo_get(self, txid, vout)` — (no docstring)
  - `storage_utxo_by_address(self, address, include_spent)` — (no docstring)
  - `storage_mempool_get(self, txid)` — (no docstring)
  - `storage_mempool_list(self, limit)` — (no docstring)
  - `get_mempool_info(self)` — Get mempool information.
  - `get_network_info(self)` — Get network information and constants.
  - `get_system_status(self)` — Get overall system status.
  - `sign_message(self, message, identifier, network)` — Sign a message with specified key.
  - `verify_signature(self, message, signature, identifier, network)` — Verify a signature.

**Top-level functions:**

- `get_api(network, auto_init)` — Get or create the global API instance.
- `initialize_api(network)` — Initialize the API with specified network.
- `wallet_addresses(network)` — Simple function to get wallet addresses.
- `wallet_balance(address, network)` — Simple function to get wallet balance.
- `send_qbh(recipient, amount, sender, network)` — Simple function to send QBH.
- `start_mine(background)` — Simple function to start mining.
- `stop_mine()` — Simple function to stop mining.
- `blockchain_status()` — Simple function to get blockchain status.
- `system_status()` — Simple function to get system status.
- `validate_block(block)` — (no docstring)
- `validate_transaction(tx)` — (no docstring)
- `validate_chain()` — (no docstring)
- `tip()` — (no docstring)

## `Src/Api/auth.py`

**Classes:**

- `SendTxBody` — (no docstring)
- `NodeRequest` — (no docstring)
- `KeyStore` — (no docstring)
  - `__init__(self, path)` — (no docstring)
  - `reload(self)` — (no docstring)
  - `get(self, token)` — (no docstring)
- `APIServer` — (no docstring)
  - `__init__(self)` — (no docstring)
  - `_wire_routes(self)` — (no docstring)

**Top-level functions:**

- `_derive_secret_for_key(token, entry)` — (no docstring)
- `_hash_password(password, salt)` — (no docstring)
- `_verify_hmac(req, api_token, entry, x_ts, x_sig)` — (no docstring)
- `require_key(scopes)` — (no docstring)
- `_load_key_file()` — (no docstring)
- `_save_key_file(data)` — (no docstring)
- `ensure_api_key_interactive()` — Ensure there is at least one API key; if none exist, prompt the user to create one.
Returns the loaded key file dict.
- `_ensure_required_perms(data)` — Ensure all existing keys contain required permissions.
Returns True if file was modified.
- `_interactive_setup()` — (no docstring)
- `ensure_api_key_auto()` — Non-interactive helper: if no keys exist, create one automatically.

## `Src/Api/server.py`

**Classes:**

- `SendTxBody` — (no docstring)
- `NodeRequest` — (no docstring)
- `KeyStore` — Loads API keys from the engine-managed JSON.
  - `__init__(self, path)` — (no docstring)
  - `reload(self)` — (no docstring)
  - `get(self, token)` — (no docstring)
- `NodeController` — (no docstring)
  - `__init__(self)` — (no docstring)
  - `start(self, node_type)` — (no docstring)
  - `stop(self, node_type)` — (no docstring)
  - `_stop_one(self, node_type)` — (no docstring)

**Top-level functions:**

- `_derive_secret_for_key(token, entry)` — If entries store an explicit hex 'secret', prefer that.
Otherwise derive a secret from the token using SHA3-256.
- `_verify_hmac(req, api_token, entry, x_ts, x_sig)` — (no docstring)
- `require_key(scopes)` — Dependency factory enforcing:

## `Src/Blockchain/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Blockchain/base56.py`

**Module docstring:**

Atho Base-56 address encoding/decoding (display only).

**Top-level functions:**

- `_current_network()` — (no docstring)
- `_hex_to_bytes(h, network)` — Accept either bare 96-hex or prefixed HPK (ATHO/ATHT + 96-hex).
Returns (raw_bytes, internal_prefix_used).
- `_bytes_to_hex(b)` — (no docstring)
- `_b56_encode(data)` — (no docstring)
- `_b56_decode(s, expected_len)` — (no docstring)
- `_network_prefix(network)` — (no docstring)
- `_network_from_prefix(prefix)` — (no docstring)
- `_checksum_for(body)` — Return base56-encoded checksum for given body string.
- `encode_hpk_to_address(hpk_hex, network)` — Encode a 96-char HPK hex (with or without internal prefix) into Atho Base-56 address with prefix + checksum.
- `encode_current_network_address(hpk_hex)` — Convenience: encode using Constants.NETWORK.
- `decode_address_to_hpk(address, *, enforce_current_network, add_internal_prefix, expected_network)` — Decode an Atho Base-56 address back to (hpk_hex, network).
- `is_valid_address(address)` — (no docstring)
- `normalize_hpk(address, *, network)` — Normalize either a Base56 address or an internal HPK (with ATHO/ATHT prefix)
to the internal HPK string (including prefix).

## `Src/Blockchain/block.py`

**Classes:**

- `Block` — Canonical Block structure with Bitcoin-like 'witness' handling.
  - `__init__(self, index, previous_hash, transactions, nonce, difficulty, target, timestamp, miner_address, flags, coinbase_tx, block_hash, witness_commitment, network, *, witnesses)` — (no docstring)
  - `_witness_cutoff_height()` — Return the current node's witness deletion cutoff height.
  - `_is_prunable(self, tip_height)` — True if witnesses may be pruned for this block. If a tip height is
provided, apply a rolling retention window (prune when height <= tip -
cutoff). If not provided, fall back to the legacy absolute cutoff.
  - `_include_witness_for_recent_blocks()` — Whether to serialize witnesses for blocks younger than cutoff.
Defaults to True if the constant is absent.
  - `_strip_tx_to_base_view(tx, use_sig_ref)` — Return a copy of tx with ALL witness-like fields removed so the block
  - `_extract_tx_witness(tx)` — Pull out witness-like fields from a tx dict into a compact structure.
The exact shape is flexible; consumers just need to know it's aux data.
  - `_ensure_witnesses_materialized(self)` — If witnesses map is empty but transactions carry witnessy fields, build it.
This keeps producers simple and ensures to_dict() can decide what to emit.
  - `compute_merkle_root(self)` — Merkle root over tx_id hex strings (lowercased).
Witness/signature bytes are NOT included.
  - `_header_dict(self)` — Canonical header fields, standardized keys, deterministic ordering.
NOW includes witness_commitment so witness data is header-bound.
  - `_header_bytes(self)` — Deterministic JSON encoding for header hashing.
  - `compute_hash(self)` — Single SHA3-384 over the canonical header bytes.
  - `compute_witness_commitment(self)` — (no docstring)
  - `calculate_hash(self)` — (no docstring)
  - `_calc_size_from_std(self, std)` — Compute encoded size in bytes based on the COMPACT representation,
without calling to_dict() again (no recursion).
  - `_should_serialize_witnesses(self, *, force_include, tip_height)` — Decide whether witnesses should be serialized for this block,
based on node-local policy constants and current height.
  - `_base_tx_list(self)` — Build a witness-free view of transactions for the block body.
(Signatures never appear in the serialized tx_list.)
  - `purge_witnesses_if_needed(self, *, tip_height)` — Auto-purge in-memory witnesses if past pruning threshold.
Also strip witness fields from self.transactions (defensive).
  - `to_dict(self, *, include_size, force_include_witnesses, tip_height)` — Build a standardized dict for the block. index == height is enforced here.
  - `to_compact(self)` — Convert to COMPACT form from a size-free standardized dict.
  - `from_dict(data)` — Construct Block from any shape (standard/compact/near-standard), using
the centralized schema normalizer. Also tolerates 'transactions' alias.
  - `from_compact(data)` — Construct Block from COMPACT dict.
  - `size_bytes(self)` — Return encoded size in bytes (COMPACT) without recursion.
  - `_txid_set(self)` — Helper: set of tx_ids present in this block.
  - `verify(self)` — Verify block integrity:

## `Src/Blockchain/block_manager.py`

**Classes:**

- `BlockManager` — Core blockchain manager:
  - `__init__(self, blockchain, transaction_manager)` — (no docstring)
  - `validate_pow(self, header_like)` — Optional helper when you want to validate PoW on a header-only dict
(e.g., during mining). Expects the same fields used in validate_block().
  - `validate_block(self, block_std, *, merkle_mode)` — Full block validation with SegWit rules:
  - `calculate_merkle_root(self, tx_list, mode)` — SegWit-aware Merkle root.
  - `add_block(self, block_std)` — (no docstring)
  - `get_latest_block(self)` — (no docstring)

## `Src/Blockchain/blockchain.py`

**Classes:**

- `Blockchain` — New-system Blockchain orchestrator.
  - `__init__(self, *, block_store, utxo_store, mempool, tx_manager, pow_manager, miner, network)` — (no docstring)
  - `load_chain_from_storage(self)` — Hydrate in-memory chain from LMDB full-block store.
We trust validation at insert time; still check minimal structure & linkage.
  - `tip(self)` — (no docstring)
  - `tip_height(self)` — (no docstring)
  - `add_block(self, block_std_or_obj, *, is_genesis)` — Full acceptance path:
  - `_update_chain_after_new_block(self, blk, bdict)` — Update in-memory chain after adding a new block
  - `_update_chain_after_existing_block(self, blk, std)` — Update in-memory chain when block already exists in storage
  - `_validate_block_structure(self, blk, std, *, is_genesis, expected_prev)` — Minimal but strict structure & linkage checks.
  - `_validate_pow_and_hash(self, blk, std)` — Ensure header hash is deterministic and satisfies difficulty/target.
  - `_apply_block_to_utxo(self, block_std)` — Apply UTXO changes for the block - FIXED VERSION
Now properly validates UTXOs before spending and fails on errors
  - `_rollback_utxo_operations(self, operations, height)` — Rollback UTXO operations when block application fails
  - `_evict_confirmed_from_mempool(self, block_std)` — Remove txs included in the block from the mempool.
  - `validate_chain(self, chain)` — (no docstring)
  - `_difficulty_hex(self, value)` — Normalize difficulty to a 96-char hex (SHA3-384 width). Accepts int or hex-like.
  - `_build_merkle_root(self, tx_list)` — Compute merkle root over tx_id strings (single sha3). If an entry lacks tx_id,
hash its compact dict deterministically.

**Top-level functions:**

- `_is_hex(s)` — (no docstring)

## `Src/Blockchain/cgen.py`

**Module docstring:**

Optional hardcoded genesis blocks per network.

**Top-level functions:**

- `get_hardcoded_genesis(network)` — Return a precomputed genesis block dict for the given network, or None
if not provided. Network names are matched case-insensitively.
- `get_hardcoded_anchors(network)` — (no docstring)

## `Src/Blockchain/genblock.py`

**Classes:**

- `GenesisBlockManager` — Genesis manager for the standardized system:
  - `__init__(self, *, block_store, key_manager, hardcoded_genesis)` — (no docstring)
  - `ensure_genesis_block(self)` — Ensure a valid genesis block exists at height 0:
  - `build_if_needed(self)` — Ensure the genesis block exists. Returns True if we built it now,
False if it was already present.
  - `_validate_anchors(self)` — If anchor hashes are defined for this network, assert they match storage.
Skips anchors that are higher than the current tip (not synced yet).
  - `create_and_mine_genesis_block(self)` — Create + mine the genesis block:
  - `validate_genesis_block(self, block_std)` — Validate genesis:
  - `_resolve_miner_hpk_from_defaults(self)` — Load the miner HPK strictly from the KeyManager defaults in the keys JSON.
- Does NOT create or switch keys.
- Raises a clear error if default is missing/misconfigured.
  - `_calc_block_hash(self, blk)` — Robustly compute the block header hash and return lowercase hex,
regardless of whether Block provides calculate_hash() or compute_hash().
  - `_store_latest_height(self)` — Helper to probe store height without assuming exact API names.
  - `_ell(self, s, n)` — (no docstring)

## `Src/Blockchain/orphreorgs.py`

**Module docstring:**

Orphan and reorg handling (longest-chain rule).

**Classes:**

- `OrphanReorgManager` — (no docstring)
  - `__init__(self, *, block_store, utxo_store, mempool, state_tracker, consensus)` — (no docstring)
  - `_k_orphan(self, blk_hash)` — (no docstring)
  - `_k_parent(self, parent_hash, blk_hash)` — (no docstring)
  - `_store_orphan(self, blk)` — (no docstring)
  - `_pop_orphans_by_parent(self, parent_hash)` — (no docstring)
  - `_cleanup_orphans(self)` — Enforce TTL and cap. Best-effort.
  - `_walk_ancestors(self, blk_hash, limit)` — Walk back parent hashes from a given block hash up to limit or genesis.
  - `_find_common_ancestor(self, new_hash, tip_hash)` — Return (ancestor_hash, remove_hashes, add_hashes)
remove_hashes: from current tip down to ancestor (exclusive)
add_hashes: from ancestor to new tip (exclusive ancestor)
  - `_branch_height(self, tip_hash)` — (no docstring)
  - `_get_block_by_hash(self, blk_hash)` — (no docstring)
  - `_reorg(self, remove_hashes, add_hashes)` — Roll back remove_hashes (old tip to fork, reverse order) and apply add_hashes (fork+1 → new tip).
  - `_sweep_mempool(self)` — Revalidate mempool txs after reorg; evict failures.
  - `handle_block(self, blk_std)` — Main entry for a new block (already verified):
  - `attach_children(self, parent_hash)` — When a parent is committed, try to attach any waiting orphans.
Returns number of children handled.

**Top-level functions:**

- `_open_env(path)` — (no docstring)
- `_maybe_resize_env(env)` — (no docstring)

## `Src/GUI/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/GUI/addystatment.py`

**Top-level functions:**

- `_load_font(size, bold)` — (no docstring)
- `_measure(draw, text, font)` — (no docstring)
- `_fmt_amount(tx)` — (no docstring)
- `_split_rows(rows, rows_per_page)` — (no docstring)
- `build_statement_pdf(save_path, address, balance, pending, txs, filter_label, logo_path, colors)` — Build a simple, themed PDF statement for a wallet address using Pillow.

## `Src/GUI/cliui.py`

**Module docstring:**

Atho Node CLI Interface
Command-line interface for interacting with the Atho blockchain

**Classes:**

- `AthoCLI` — Interactive CLI for Atho Node Operations
  - `__init__(self)` — (no docstring)
  - `_headers(self, body, path, method)` — (no docstring)
  - `_request(self, method, path, json_body)` — (no docstring)
  - `update_status_info(self)` — Update status information
  - `do_wallet(self, arg)` — Wallet management commands
Usage: wallet [addresses|balance|new|send]
  - `do_node(self, arg)` — Node control commands
Usage: node start <full|miner|wallet|all>
  - `help_node(self)` — Show node control help
  - `_start_node(self, node_type)` — Start a node via runnode.py with the given type.
  - `help_wallet(self)` — Show wallet help
  - `show_wallet_addresses(self)` — Display wallet addresses
  - `show_balances(self)` — Display wallet balances
  - `show_balance_for_address(self, address)` — Display balance for a specific address (Base56 or HPK).
  - `create_new_address(self)` — Create a new wallet address
  - `send_transaction_interactive(self)` — Interactive transaction sending
  - `do_mining(self, arg)` — Mining control commands
Usage: mining [start|stop|single|status]
  - `help_mining(self)` — Show mining help
  - `start_mining(self)` — Start mining
  - `stop_mining(self)` — Stop mining
  - `mine_single_block(self)` — Mine a single block
  - `show_mining_status(self)` — Show mining status
  - `do_blockchain(self, arg)` — Blockchain information commands
Usage: blockchain [info|mempool|export]
  - `help_blockchain(self)` — Show blockchain help
  - `show_blockchain_info(self)` — Show blockchain information
  - `show_mempool(self)` — Show mempool information
  - `export_blockchain_data(self)` — Export blockchain data
  - `do_blocks(self, arg)` — Block explorer commands
Usage: blocks [recent|height <n>|hash <hash>|latest|prev|next|tx <txid>|export500]
  - `help_blocks(self)` — Show blocks help
  - `show_recent_blocks(self)` — Show recent blocks
  - `show_block_by_height(self, height_str)` — Show block by height
  - `show_block_by_hash(self, block_hash)` — Show block by hash
  - `show_latest_block(self)` — Show latest block
  - `show_previous_block(self)` — Show previous block
  - `show_next_block(self)` — Show next block
  - `show_transaction_by_id(self, tx_id)` — Show transaction by ID
  - `show_block_details(self, height, block_hash)` — Show block details with exact structure as stored
  - `export_last_500_blocks(self)` — Export last 500 blocks to JSON with exact storage structure
  - `do_system(self, arg)` — System information commands
Usage: system [status|network]
  - `help_system(self)` — Show system help
  - `show_peers(self)` — Show peers from the node API.
  - `show_system_status(self)` — Show system status
  - `show_network_info(self)` — Show network information
  - `do_tools(self, arg)` — Tools and utilities commands
Usage: tools [sign|verify|export_keys|validate|compact|clear_mempool]
  - `help_tools(self)` — Show tools help
  - `sign_message_interactive(self)` — Interactive message signing
  - `verify_signature_interactive(self)` — Interactive signature verification
  - `export_public_keys(self)` — Export public keys
  - `validate_key_pairs(self)` — Validate key pairs
  - `compact_databases(self)` — Compact databases
  - `clear_mempool(self)` — Clear mempool
  - `do_status(self, arg)` — Show current node status
  - `do_refresh(self, arg)` — Refresh all data
  - `format_timestamp(self, timestamp)` — Format timestamp to readable string
  - `_spawn_terminal_for_miner(self)` — Spawn a separate process for minernode.py.
  - `do_quit(self, arg)` — Exit the CLI
  - `do_exit(self, arg)` — Exit the CLI
  - `do_help(self, arg)` — Show help information

**Top-level functions:**

- `main()` — Main entry point for the CLI

## `Src/GUI/exportw.py`

**Top-level functions:**

- `load_keys_file(path)` — (no docstring)
- `find_key_by_address(keys_data, address, network)` — (no docstring)
- `write_wallet_export_text(save_path, key_rec)` — Write a text export that mirrors the key file structure for the selected key.

## `Src/GUI/gui.py`

**Classes:**

- `AthoAPIClient` — API client for Atho blockchain
  - `__init__(self)` — (no docstring)
  - `_load_api_keys(self)` — (no docstring)
  - `_load_gui_settings(self)` — (no docstring)
  - `save_gui_settings(self)` — (no docstring)
  - `_headers(self, body, path, method)` — (no docstring)
  - `_ensure_local_api(self)` — (no docstring)
  - `_request(self, method, path, json_body)` — (no docstring)
  - `get_wallet_addresses(self)` — (no docstring)
  - `get_balance(self, address)` — (no docstring)
  - `create_address(self)` — (no docstring)
  - `rename_address(self, network, key, new_identifier)` — (no docstring)
  - `delete_address(self, network, key)` — (no docstring)
  - `set_default_address(self, network, key)` — (no docstring)
  - `send_transaction(self, sender, recipient, amount)` — (no docstring)
  - `get_chain_info(self)` — (no docstring)
  - `get_mining_status(self)` — (no docstring)
  - `start_mining(self, background)` — (no docstring)
  - `stop_mining(self)` — (no docstring)
  - `get_block(self, height, block_hash)` — (no docstring)
  - `get_mempool_info(self)` — (no docstring)
  - `get_system_status(self)` — (no docstring)
  - `get_network_info(self)` — (no docstring)
  - `get_peers(self)` — (no docstring)
  - `node_start(self, node_type)` — (no docstring)
  - `node_stop(self, node_type)` — (no docstring)
  - `get_recent_transactions(self, limit)` — (no docstring)
  - `get_address_history(self, address, limit)` — (no docstring)
- `StyledButton` — (no docstring)
  - `__init__(self, **kwargs)` — (no docstring)
  - `_update_rect(self, *args)` — (no docstring)
  - `_update_state(self, *_)` — (no docstring)
  - `_anim_press(self, *_)` — (no docstring)
  - `_anim_release(self, *_)` — (no docstring)
- `StyledTextInput` — (no docstring)
  - `__init__(self, **kwargs)` — (no docstring)
- `HoverIconButton` — Icon button with simple hover hint routed to the status bar.
  - `__init__(self, hint_text, **kwargs)` — (no docstring)
  - `_on_mouse_move(self, _window, pos)` — (no docstring)
- `CopyIconButton` — Icon-only copy button with hover hint and a quick bounce on click.
  - `__init__(self, get_value, hint_text, icon_size, **kwargs)` — (no docstring)
  - `_do_copy(self)` — (no docstring)
- `CloseIconButton` — Small close (X) icon button for modals/popups.
  - `__init__(self, on_close, hint_text, icon_size, **kwargs)` — (no docstring)
- `LoadingSpinner` — (no docstring)
  - `__init__(self, icon_path, size, **kwargs)` — (no docstring)
  - `_update_rect(self, *_)` — (no docstring)
  - `start(self)` — (no docstring)
  - `stop(self)` — (no docstring)
  - `on_parent(self, instance, parent)` — (no docstring)
- `MenuDropdown` — Lightweight dropdown menu for top-left menu icon.
  - `__init__(self, on_settings, **kwargs)` — (no docstring)
- `SaveStatementDialog` — (no docstring)
  - `__init__(self, default_name, on_save, default_ext, filters, **kwargs)` — (no docstring)
  - `_do_save(self)` — (no docstring)
- `WalletImportModal` — (no docstring)
  - `__init__(self, on_import, **kwargs)` — (no docstring)
  - `_do_import(self)` — (no docstring)
- `FlatScrollView` — (no docstring)
  - `__init__(self, **kwargs)` — (no docstring)
- `NestedScrollView` — ScrollView that temporarily disables parent scroll to allow inner scrolling.
  - `_parent_scroll(self)` — (no docstring)
  - `on_touch_down(self, touch)` — (no docstring)
  - `on_touch_up(self, touch)` — (no docstring)
- `Card` — (no docstring)
  - `__init__(self, **kwargs)` — (no docstring)
  - `_update_rect(self, *args)` — (no docstring)
- `BalanceCard` — (no docstring)
  - `__init__(self, on_receive, on_toggle_visibility, on_send, **kwargs)` — (no docstring)
  - `on_balance(self, *_)` — (no docstring)
  - `on_address(self, *_)` — (no docstring)
  - `on_pending(self, *_)` — (no docstring)
  - `set_hide_balances(self, hide)` — (no docstring)
  - `_refresh_balance_labels(self)` — (no docstring)
- `TransactionHistory` — (no docstring)
  - `__init__(self, **kwargs)` — (no docstring)
  - `set_hide_balances(self, hide)` — (no docstring)
  - `set_transactions(self, txs)` — (no docstring)
  - `_on_scroll(self, *_)` — (no docstring)
  - `_show_spinner(self)` — (no docstring)
  - `_remove_spinner(self)` — (no docstring)
  - `_load_next_batch(self, initial)` — (no docstring)
  - `all_transactions(self)` — (no docstring)
- `TransactionItem` — (no docstring)
  - `__init__(self, tx, hide_balances, **kwargs)` — (no docstring)
  - `_human_time(ts)` — (no docstring)
  - `set_hide_balances(self, hide)` — (no docstring)
- `CommandRunner` — (no docstring)
  - `__init__(self, on_command, **kwargs)` — (no docstring)
  - `run_command(self, instance)` — (no docstring)
  - `_populate(self, cmd)` — (no docstring)
- `SendTransactionModal` — (no docstring)
  - `__init__(self, on_send, addresses, contacts, default_sender, api_client, **kwargs)` — (no docstring)
  - `_addr_to_str(self, item)` — (no docstring)
  - `_abbrev(self, text, left, right)` — (no docstring)
  - `_build_sender_options(self)` — (no docstring)
  - `_build_contact_options(self)` — (no docstring)
  - `_open_sender_dropdown(self)` — (no docstring)
  - `_open_recipient_dropdown(self)` — (no docstring)
  - `_open_dropdown(self, options, anchor_widget, on_select, empty_hint)` — (no docstring)
  - `_on_sender_selected(self, addr)` — (no docstring)
  - `_on_recipient_selected(self, addr)` — (no docstring)
  - `send_transaction(self, instance)` — (no docstring)
  - `_sanitize_amount(self, instance, value)` — (no docstring)
  - `_update_sender_balance(self, addr)` — (no docstring)
  - `_update_send_enabled(self)` — (no docstring)
  - `_show_send_spinner(self)` — (no docstring)
  - `_hide_send_spinner(self)` — (no docstring)
  - `_clear_fields(self)` — (no docstring)
  - `set_hide_balances(self, hide)` — (no docstring)
  - `_render_sender_note(self)` — (no docstring)
- `DashboardTab` — (no docstring)
  - `__init__(self, api_client, **kwargs)` — (no docstring)
  - `_toggle_hide_balances(self, hide)` — (no docstring)
  - `set_hide_balances(self, hide)` — (no docstring)
  - `show_receive(self, instance)` — (no docstring)
  - `_open_statement_save_dialog(self)` — (no docstring)
  - `_generate_statement(self, save_path, txs)` — (no docstring)
  - `show_send(self, instance)` — (no docstring)
  - `send_transaction(self, sender, recipient, amount)` — (no docstring)
  - `_payload_key(sender, recipient, amount)` — (no docstring)
  - `_prune_send_cooldowns(self, now_ts)` — (no docstring)
  - `_show_tx_spinner(self)` — (no docstring)
  - `_hide_tx_spinner(self)` — (no docstring)
  - `_show_success_toast(self, msg)` — (no docstring)
  - `refresh_data(self, instance)` — (no docstring)
  - `_get_local_addresses(self)` — (no docstring)
  - `_set_history_address(self, addr)` — (no docstring)
  - `_set_history_filter(self, value)` — (no docstring)
  - `_classify_tx(tx)` — (no docstring)
  - `_apply_history_filter(self, txs)` — (no docstring)
  - `_open_history_dropdown(self)` — (no docstring)
  - `_open_history_filter_dropdown(self)` — (no docstring)
  - `load_transactions(self, address)` — (no docstring)
  - `update_sync(self)` — (no docstring)
  - `show_settings(self, instance)` — (no docstring)
  - `run_cli_command(self, command, output_display)` — (no docstring)
  - `_execute_command(self, command)` — (no docstring)
- `APISettingsPopup` — (no docstring)
  - `__init__(self, api_client, on_save, **kwargs)` — (no docstring)
  - `save(self, instance)` — (no docstring)
- `SettingsModal` — Settings modal with tabs; currently only API Settings.
  - `__init__(self, api_client, on_save, **kwargs)` — (no docstring)
  - `_save_api(self, *_)` — (no docstring)
- `WalletTab` — (no docstring)
  - `__init__(self, api_client, **kwargs)` — (no docstring)
  - `load_addresses(self)` — (no docstring)
  - `_load_local_keys(self)` — Read keys directly from the local key file so the GUI reflects actual on-disk state.
  - `_get_local_addresses(self)` — (no docstring)
  - `create_address_action(self)` — (no docstring)
  - `rename_address_prompt(self, network, identifier)` — (no docstring)
  - `_do_rename(self, modal, network, identifier, new_name)` — (no docstring)
  - `delete_address(self, network, identifier)` — (no docstring)
  - `set_default_address(self, network, identifier)` — (no docstring)
  - `display_addresses(self, addresses, default_id)` — (no docstring)
  - `set_hide_balances(self, hide)` — (no docstring)
  - `_export_wallet_key(self, address, identifier)` — (no docstring)
  - `_generate_wallet_export(self, save_path, rec)` — (no docstring)
  - `_open_wallet_import(self)` — (no docstring)
  - `_run_wallet_import(self, path)` — (no docstring)
  - `_show_readonly_notice(self)` — (no docstring)
- `NodesTab` — (no docstring)
  - `__init__(self, api_client, **kwargs)` — (no docstring)
  - `start_node(self, name)` — (no docstring)
  - `stop_node(self, name)` — (no docstring)
- `ContactsTab` — (no docstring)
  - `__init__(self, **kwargs)` — (no docstring)
  - `_build_ui(self)` — (no docstring)
  - `save_contact(self, _instance)` — (no docstring)
  - `delete_contact(self, contact)` — (no docstring)
  - `toggle_favorite(self, contact)` — (no docstring)
- `BlockchainTab` — (no docstring)
  - `__init__(self, api_client, **kwargs)` — (no docstring)
  - `search_block(self, instance)` — (no docstring)
  - `get_latest_block(self, instance)` — (no docstring)
  - `next_block(self, instance)` — (no docstring)
  - `prev_block(self, instance)` — (no docstring)
  - `get_mempool(self, instance)` — (no docstring)
  - `get_chain_info(self, instance)` — (no docstring)
  - `_add_summary_row(self, label, value, monospace, copy_value)` — (no docstring)
  - `_add_meta_row(self, parent, label, value, monospace)` — (no docstring)
  - `_render_transactions(self, txs)` — (no docstring)
  - `_render_meta(self, block_data, witnesses)` — (no docstring)
  - `_reset_scroll(self, *_)` — (no docstring)
  - `display_block(self, result)` — (no docstring)
  - `refresh_info(self)` — (no docstring)
- `CommandsTab` — (no docstring)
  - `__init__(self, **kwargs)` — (no docstring)
  - `run_quick(self, cmd)` — (no docstring)
  - `run_command(self, _instance)` — (no docstring)
- `AthoGUI` — (no docstring)
  - `__init__(self, status_label, **kwargs)` — (no docstring)
  - `_update_rect(self, *args)` — (no docstring)
  - `_prompt_api_settings(self)` — (no docstring)
  - `refresh_all(self, *_)` — (no docstring)
  - `set_status(self, msg, success)` — (no docstring)
  - `apply_balance_visibility(self, hide)` — (no docstring)
- `AthoApp` — (no docstring)
  - `set_status(self, msg, success)` — (no docstring)
  - `set_hide_balances(self, hide, source)` — (no docstring)
  - `toggle_hide_balances(self)` — (no docstring)
  - `_log_window_state(self, *_)` — (no docstring)
  - `_clear_stale_modals(self, *_)` — Occasionally a hidden Popup/ModalView can leave a dim overlay.
Sweep and dismiss any that linger right after startup so the UI stays clickable.
Never touch an active ModalView/Popup to avoid closing legitimate dialogs.
  - `_enable_all(self, *_)` — Ensure no widget stays disabled (disabled widgets in Kivy block input and gray-out children).
  - `_open_settings(self)` — (no docstring)
  - `toggle_menu(self, opening)` — (no docstring)
  - `_update_layout_positions(self)` — (no docstring)
  - `build(self)` — (no docstring)
  - `on_start(self)` — (no docstring)
  - `on_stop(self)` — (no docstring)
  - `_prepare_icon(self)` — (no docstring)

**Top-level functions:**

- `show_message(title, message, success)` — Route status to the bottom bezel if available; fallback to popup.
- `load_history()` — (no docstring)
- `save_history(data)` — (no docstring)
- `load_contacts()` — (no docstring)
- `save_contacts(contacts)` — (no docstring)
- `style_dropdown(dropdown, width, max_height)` — Apply consistent sizing and a subtle vertical gradient to dropdowns.
- `main()` — (no docstring)

## `Src/Main/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Main/blockveri.py`

**Classes:**

- `BlockVerifier` — Lightweight block integrity verifier.
  - `__init__(self, block_store, network)` — (no docstring)
  - `_is_hex(s, length)` — (no docstring)
  - `_median_time_past(self, height)` — Median of last MTP_WINDOW block timestamps (exclusive of `height`).
  - `verify_full_chain_once(self)` — Verify the entire chain exactly once per process run.
  - `verify_latest_chain_tip(self)` — Verify the chain tip and the two preceding blocks (if present).
  - `verify_block(self, block_std, *, allow_orphan)` — Verify a single block standard dict. Returns True on success.
  - `run_continuous(self, interval_seconds)` — Continuously verify the latest tip (and two predecessors) on a timer.
  - `_log_chain_link(self, height, blk_hash, prev_hash, expected_prev, status, reason, genesis_hash, source)` — Append a structured log entry for chain linkage checks.
  - `_log_result(self, block, status, error, height, recomputed_merkle, witness_recomputed, witness_expected)` — Append a structured log entry for a verification attempt.

**Top-level functions:**

- `main()` — (no docstring)

## `Src/Main/consensus.py`

**Module docstring:**

Consensus gateway and supervisor.

**Classes:**

- `ConsensusSupervisor` — (no docstring)
  - `__init__(self, *, block_store, utxo_store, mempool, blockchain)` — (no docstring)
  - `accept_tx(self, tx_std)` — (no docstring)
  - `accept_block(self, blk_std, apply_state)` — (no docstring)
  - `verify_chain_tip(self)` — (no docstring)
  - `verify_full_chain_once(self)` — (no docstring)
  - `sweep_mempool(self, limit)` — (no docstring)
  - `run_once(self, sweep_limit, recent_block_span)` — (no docstring)
  - `run_loop(self, interval_seconds, sweep_limit)` — (no docstring)

**Top-level functions:**

- `_log(entry)` — (no docstring)
- `block_version_ok(version)` — (no docstring)
- `tx_version_ok(version)` — (no docstring)
- `required_fee_full(size_bytes)` — (no docstring)
- `amount_aligned(val)` — (no docstring)
- `quantize_amount(val)` — (no docstring)
- `validate_address(hpk)` — (no docstring)
- `full_tx_size_bytes(tx)` — (no docstring)
- `fee_and_size(tx)` — (no docstring)

## `Src/Main/emission.py`

**Classes:**

- `EmissionMonitor` — Periodically scans blocks to track cumulative supply, rewards, and fees.
Writes rolling updates to logs/<network>/emissions.log.
  - `__init__(self, interval_sec)` — (no docstring)
  - `_log(self, msg)` — (no docstring)
  - `_persist_state(self)` — (no docstring)
  - `_load_state(self)` — (no docstring)
  - `_process_block(self, blk)` — (no docstring)
  - `run_once(self)` — (no docstring)
  - `loop(self)` — (no docstring)

**Top-level functions:**

- `_ensure_log_dir()` — (no docstring)
- `_safe_dec(v)` — (no docstring)
- `_block_fees(block)` — (no docstring)
- `_block_volume(block)` — Sum outputs of non-coinbase txs (simple volume metric).
- `_block_reward_paid(block)` — Total coinbase outputs paid in the block.

## `Src/Main/rungui.py`

**Module docstring:**

Atho GUI Launcher
Runs both the Kivy GUI and the CLI interface

**Top-level functions:**

- `run_cli()` — Run the CLI interface in a separate thread
- `run_gui()` — Run the Kivy GUI
- `main()` — Main launcher

## `Src/Main/runminer.py`

**Top-level functions:**

- `ensure_dirs()` — Make sure database and logs folders exist for the selected network.
- `_enforce_network(obj, network, name)` — Best-effort network enforcement for security hardening.
Tries common attribute/method patterns; logs if constructor-only.
- `main()` — (no docstring)

## `Src/Main/runnode.py`

**Top-level functions:**

- `_find_free_port(start_port)` — (no docstring)
- `_pick_port(env_val, fallback_start, label)` — If env_val provided, insist on it and fail if occupied.
Otherwise, find the next free port starting at fallback_start.
- `_launch_node(python, label, path, base_env, env_overrides, background)` — Launch a node process with overrides applied.
- `main()` — (no docstring)

## `Src/Main/send.py`

**Classes:**

- `Send` — Unified, network-aware sender with comprehensive transaction construction logging
  - `__init__(self, *, key_manager, utxo_store, mempool, fee_model, block_store, network)` — (no docstring)
  - `send(self, recipient_hpk, amount, *, change_hpk, metadata)` — Build, sign, and broadcast a transaction using PROPER hashing consistency.
  - `_verify_utxo_ownership(self, txid, vout, expected_owner)` — Verify that a UTXO actually belongs to the expected owner
  - `_mempool_index(self, owner_hpk)` — Build a quick view of mempool activity touching owner_hpk.
  - `show_current_balance(self, sender_hpk)` — Show current balance with explicit pending credits/debits:
  - `log_balance(self, sender_hpk, log_path)` — Compute balance breakdown and append to a structured log (JSONL).
No stdout noise; returns the balance dict.
  - `estimate_fee(self, n_in, n_out, *, metadata)` — Fee estimator using canonical transaction vsize.
Returns (fee, size_bytes_estimate).
  - `_estimate_tx_size(self, n_in, n_out, metadata)` — Estimate transaction size without signatures for initial fee calculation.
This is used before the transaction is built and signed.
  - `_unlock(self, locked_pairs)` — Best-effort unlock of any UTXOs we locked during selection.
locked_pairs is a list of (txid, vout).
  - `dry_run(self, recipient_hpk, amount, *, change_hpk, metadata)` — Build a preview (unsigned) standardized dict (no locking, no broadcast).
  - `_resolve_sender_hpk(self)` — Pull a default hashed public key (HPK) from KeyManager for the active network.
  - `_normalize_address(self, addr)` — Accept either internal HPK (ATHO/ATHT...) or Base56; return internal HPK with prefix.
  - `unlock_all_utxos_for_address(self, sender_hpk)` — Manually unlock all UTXOs for an address that might be stuck in locked state.
Returns the number of UTXOs unlocked.
  - `_select_minimal_and_lock(self, sender_hpk, amount, *, base_outputs, metadata, current_height)` — IMPROVED:
  - `_sign_and_update_inputs(self, tx, sender_hpk)` — SegWit-style signing:
  - `_build_outputs(self, recipient_hpk, amount, change_hpk, change)` — Create recipient (+ optional change) outputs using HPK only. Drop dust change.
  - `_calculate_tx_size(self, tx)` — Compute canonical policy transaction size (vsize).
  - `_validate_complete_transaction(self, tx_std)` — Validate COMPLETE signed transaction under SegWit-style rules:
  - `_calculate_fee_per_byte(self, tx)` — Calculate fee per byte for transaction sorting.
  - `_find_key_identifier(self, hpk)` — Find the key identifier for a given hashed public key
  - `_route_to_mempool(self, tx)` — Convert to standardized dict and submit to mempool.
Returns: (ok, reason)
  - `_log_transaction(self, *, tx, mempool_status, recipient_hpk, change_hpk, updated_balance)` — Append a JSON line to logs/transactions/YYYY-MM-DD.log with full tx record.
  - `_calculate_actual_fee(self, tx)` — Calculate fee based on actual transaction size including signatures
  - `_get_current_block_height(self)` — Get current block height for confirmation calculations
  - `_parse_tx_out_id(self, tx_out_id)` — Parse tx_out_id into (txid, vout)
  - `_ell(s, n)` — (no docstring)

**Top-level functions:**

- `_to_dec(v)` — (no docstring)
- `_sanitize_amount(value)` — Clamp and quantize to the smallest atomic unit (1 / ATOMS_PER_COIN). Rejects sub-atom values.
- `main()` — Command-line interface for sending ATHO transactions
Usage: python send.py <recipient_address> <amount>
Example: python send.py ATHO9eea5df8a5f8e2b922a69661b728da1435433a7f4266185216602150adca1ad6756317e2d978077bd9fea40e3a063181 2.5
- `check_utxo_state()` — Check current UTXO state for debugging

## `Src/Main/state.py`

**Module docstring:**

State checkpoint tracker

**Classes:**

- `StateTracker` — (no docstring)
  - `__init__(self, block_store)` — (no docstring)
  - `_log(self, entry)` — (no docstring)
  - `_max_recorded_height(self)` — (no docstring)
  - `_append_leaf(self, height, block_hash, leaf_hex, state_root, chain_hash, status, error)` — (no docstring)
  - `_load_all_leaves(self)` — (no docstring)
  - `_recompute_root(self)` — (no docstring)
  - `_max_verified_height(self)` — (no docstring)
  - `latest_checkpoint(self)` — Return latest recorded checkpoint (height/hash/state_root), recomputing root for safety.
  - `_get_record(self, height)` — (no docstring)
  - `_get_chain_hash(self, height)` — (no docstring)
  - `_signal_fork(self, reason, height, extra)` — (no docstring)
  - `detect_fork(self, peer_height, peer_chain_hash)` — Given a peer's (height, chain_hash), find the highest matching height and first mismatch.
Logs a fork_detected entry when divergence is found.
  - `_derive_chain_hash(self, prev_chain_hash, blk_hash)` — (no docstring)
  - `run_once(self)` — Process any new blocks since last recorded height, append leaves, and return latest checkpoint.
  - `loop(self, interval_sec)` — (no docstring)

**Top-level functions:**

- `_sha3_hex(data)` — (no docstring)
- `_merkle_root(leaves)` — Bitcoin-style pairing with duplication on odd counts.
Returns hex string; ZERO_HASH if no leaves.
- `_open_env(path)` — (no docstring)
- `_maybe_resize_env(env)` — (no docstring)
- `_k_leaf(height)` — (no docstring)

## `Src/Main/txveri.py`

**Classes:**

- `TransactionVerifier` — Comprehensive transaction verification system that handles:
  - `__init__(self, key_manager, block_store, mempool_store, utxo_store, network)` — Initialize the transaction verifier with all necessary components
  - `_normalize_hpk(self, addr)` — Normalize Base56 or internal HPK to internal HPK (with prefix).
  - `verify_all_blocks(self, start_height, end_height)` — Verify all transactions in all blocks from start_height to end_height
Returns comprehensive verification report
  - `verify_block_at_height(self, height)` — Verify all transactions in a specific block
  - `verify_transactions_in_block(self, block)` — Verify all transactions within a block
  - `verify_transaction(self, transaction)` — Comprehensive transaction verification including:
  - `_log_tx_verification(self, transaction, result)` — Persist verification results to logs/<network>/verified_tx/verified_tx.log
  - `_validate_transaction_structure(self, transaction)` — Validate basic transaction structure
  - `_validate_tx_size(self, transaction)` — Enforce transaction byte/weight limits to avoid DoS via oversized payloads.
  - `_is_test_tx(self, transaction)` — Treat transactions with placeholder/test addresses as test traffic to relax certain policies.
  - `_validate_amounts(self, transaction, inputs_total)` — Enforce amount/fee correctness (non-negative, precision, and no inflation).
  - `_validate_utxos(self, transaction)` — Validate that all input UTXOs exist and are spendable
  - `_verify_transaction_signature_ultimate(self, public_key_hex, message_hash, signature_hex, tx_id)` — Thin wrapper that always does the strict CLI verify with ASCII hex as-is.
  - `_verify_transaction_signatures(self, transaction)` — STRICT: verify using the *exact* message bytes that were signed.
For Athos we sign the ASCII of the 96-char SHA3-384 hex digest.
  - `_check_double_spend(self, transaction)` — Check for double spends in the mempool
  - `start_mempool_monitoring(self, interval_seconds)` — Start monitoring the mempool for new transactions and verify them in real-time
  - `stop_mempool_monitoring(self)` — Stop the mempool monitoring
  - `_mempool_monitor_worker(self, interval_seconds)` — Worker thread that continuously monitors the mempool for new transactions
  - `verify_transaction_manual(self, tx_data)` — Manual verification of a transaction - useful for testing and CLI
  - `verify_signature_manual(self, public_key, message, signature, message_mode)` — Manual signature verification - useful for testing and debugging
  - `get_statistics(self)` — Get current verification statistics
  - `print_statistics(self)` — Print current statistics to console
  - `clear_statistics(self)` — Clear all statistics (except start time)
  - `get_transaction_by_id(self, tx_id)` — Find a transaction by ID across blocks and mempool
  - `health_check(self)` — Perform health check of all components

**Top-level functions:**

- `main()` — Command-line interface for TransactionVerifier
- `interactive_menu(verifier)` — Interactive mode disabled; run with no flags for auto-verify or use CLI flags.

## `Src/Miner/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Miner/miner.py`

**Classes:**

- `Miner` — (no docstring)
  - `__init__(self, *, block_store, utxo_store, mempool, unified_mempool, standard_mempool, key_manager, pow_manager, network, **kwargs)` — (no docstring)
  - `start(self)` — (no docstring)
  - `stop(self)` — (no docstring)
  - `_mining_loop(self)` — Event-driven loop: waits for mempool signals and mines immediately.
Falls back to a short sleep tick if no signals are available.
  - `_get_mempool_count(self)` — Get current mempool transaction count
  - `_ell(self, s, n)` — (no docstring)
  - `_format_diff_hex(self, diff_int)` — (no docstring)
  - `_tx_already_in_chain(self, txid)` — (no docstring)
  - `_are_inputs_spent(self, tx)` — (no docstring)
  - `_are_inputs_spent_ignore_locking(self, tx)` — Check if inputs are spent, but IGNORE locking status.
Only check if UTXOs exist and aren't already spent in blockchain.
  - `create_coinbase(self, miner_hpk, fees, height)` — Create a coinbase with reward + fees to hashed public key (HPK).
  - `validate_coinbase(self, coinbase, miner_hpk, fees, height)` — Validate coinbase structure and value:
  - `calculate_block_size(self, block)` — Calculate a block's on-wire size using compact schema JSON length.
  - `validate_new_block(self, block, parent_hash)` — Validate a freshly mined block:
  - `mine_block(self)` — Mine a single block with REAL-TIME mempool monitoring.
Uses proper threading and non-blocking checks for immediate transaction inclusion.

## `Src/Miner/pow.py`

**Classes:**

- `PowManager` — Enhanced Proof-of-Work manager with improved difficulty adjustment algorithms.
  - `__init__(self, block_storage)` — :param block_storage: storage that at least implements:
    - latest_height() -> Optional[int]
    - get_by_height(h: int) -> Optional[dict]
  - `_to_int_target(x)` — (no docstring)
  - `_to_hex(x)` — (no docstring)
  - `_bounds(self)` — Return (min_target, max_target) from Constants, as ints.
  - `_clamp_target(self, t)` — (no docstring)
  - `_iter_blocks_up_to(self, height_inclusive, count)` — Fetch up to `count` blocks ending at height_inclusive (oldest→newest).
  - `_iter_last_blocks(self, count)` — Fetch the last `count` blocks as dicts (oldest→newest).
  - `_tip_info(self)` — (no docstring)
  - `_log_adjustment(self, *, height, interval, old_target, new_target, ratio, span_seconds, expected_seconds, method, stability)` — Append a JSON line to `logs/<network>/pow/adjustments.log` describing this retarget.
  - `_get_weighted_block_times(self, blocks, window_size)` — Calculate block times with weights for more recent blocks.
Uses exponential weighting where recent blocks have more influence.
  - `_calculate_network_stability(self, blocks)` — Calculate network stability factor based on block time variance.
Returns a factor between 0.5 (unstable) and 1.5 (very stable).
  - `_remove_time_outliers(self, block_times, max_deviation)` — Remove outlier block times that deviate too much from the median.
  - `_calculate_ema_timespan(self, blocks, alpha)` — Calculate Exponential Moving Average of block times.
Gives more weight to recent blocks.
  - `_bitcoin_style_adjustment(self, blocks, last_target, n, T)` — Standard Bitcoin-style adjustment with outlier filtering.
  - `_digishield_style_adjustment(self, blocks, last_target, n, T)` — DigiShield-style adjustment with faster response and damping.
  - `_ema_adjustment(self, blocks, last_target, n, T)` — Exponential Moving Average adjustment for smoother transitions.
  - `_adaptive_adjustment(self, blocks, last_target, n, T)` — Adaptive adjustment that chooses method based on network conditions.
  - `difficulty_to_human_float(self, target)` — Convert absolute target to a continuous human-friendly difficulty in [1.000 .. 100.000].
Interpretation: 100.000 = hardest (smallest target), 1.000 = easiest (largest target).
  - `difficulty_to_human_str(self, target)` — String helper for logging.
  - `validate_proof_of_work(self, block)` — Check block.hash < block.difficulty (or block.target).
Difficulty/target may be int or hex-like string.
  - `perform_pow(self, block, *, max_nonce, timeout_sec, progress_every, should_abort)` — Increment nonce until hash(header) < difficulty or limits reached.
  - `adjust_difficulty(self)` — Enhanced difficulty adjustment with multiple algorithms and adaptive selection.
Uses Bitcoin-style, DigiShield-style, EMA, and adaptive methods based on network conditions.
  - `expected_target_for_height(self, height)` — Pure, side-effect-free deterministic target for `height`.
Used by miner template creation and by validation to reject mismatched targets.
  - `_simple_block_adjustment(self, tip_h, last_target, T)` — Simple adjustment for single-block or first few blocks.
  - `get_average_block_time(self)` — Enhanced rolling average with outlier rejection and weighted recent blocks.
  - `get_network_health_metrics(self)` — Returns comprehensive network health metrics for monitoring.

## `Src/Network/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Network/bootstrap.py`

**Classes:**

- `SeedEntry` — (no docstring)
  - `key(self)` — (no docstring)
- `BootstrapSeedList` — (no docstring)
  - `__init__(self, path, max_seeds, ttl_days, max_per_bucket, allow_private)` — (no docstring)
  - `add_pinned(self, host, port)` — (no docstring)
  - `load(self)` — (no docstring)
  - `seeds(self)` — (no docstring)
  - `sync_from_peers(self, peer_entries)` — (no docstring)
  - `save(self)` — (no docstring)
  - `_cap_by_bucket(self, seeds)` — (no docstring)
  - `_save(self)` — (no docstring)

**Top-level functions:**

- `_now()` — (no docstring)
- `_is_loopback_host(host)` — (no docstring)
- `is_routable_host(host, allow_private)` — (no docstring)
- `_bucket_key(host)` — (no docstring)

## `Src/Network/connection.py`

**Classes:**

- `OutboundConnection` — Lightweight outbound keepalive with short-lived request/response.
Opens a socket per ping to match the server's request-per-connection model.
  - `__init__(self, host, port, hello_fn, on_fail)` — (no docstring)
  - `start(self)` — (no docstring)
  - `stop(self)` — (no docstring)
  - `_recv_all(self, sock, n)` — (no docstring)
  - `_send_request(self, payload)` — (no docstring)
  - `_loop(self)` — (no docstring)

## `Src/Network/netlog.py`

**Top-level functions:**

- `get_net_logger(name)` — Network logger with optional DEBUG level and console streaming controlled by env:
  ATHO_NETLOG_LEVEL=DEBUG|INFO (default INFO)
  ATHO_NETLOG_CONSOLE=1 to mirror logs to stdout

## `Src/Network/node.py`

**Top-level functions:**

- `main()` — (no docstring)

## `Src/Network/p2pconst.py`

**Classes:**

- `PeerConstants` — P2P protocol knobs. Keep this tight and only expose values the server uses.
  - `validate_network(cls)` — (no docstring)

## `Src/Network/p2pserver.py`

**Classes:**

- `P2PServer` — Minimal public P2P server:
  - `__init__(self, mempool, blockstore, tx_manager, blockchain, consensus)` — (no docstring)
  - `start(self)` — (no docstring)
  - `stop(self)` — (no docstring)
  - `_accept_loop(self)` — (no docstring)
  - `_recv_all(self, conn, n)` — (no docstring)
  - `_rate_limited(self, peer_ip)` — (no docstring)
  - `_read_json(self, conn)` — Length-prefixed JSON: 4-byte big-endian length + payload.
  - `_send_json(self, conn, payload)` — (no docstring)
  - `_handshake_ok(self, msg)` — Expect hello dict:
  - `_version_at_least(self, current, minimum)` — (no docstring)
  - `_tip(self)` — (no docstring)
  - `_state_hash(self)` — (no docstring)
  - `_build_hello(self)` — (no docstring)
  - `_send_rpc(self, host, port, payload)` — (no docstring)
  - `_log_tx_event(self, tx, status, reason, peer, source)` — (no docstring)
  - `_accept_block(self, blk)` — (no docstring)
  - `_fetch_inventory(self, host, port, want_tx, want_blocks)` — (no docstring)
  - `_handle_getheight(self)` — (no docstring)
  - `_handle_getblock(self, msg)` — (no docstring)
  - `_handle_getheaders(self, msg)` — (no docstring)
  - `_handle_tx(self, msg, peer, source)` — (no docstring)
  - `_handle_inv(self, msg, peer_host, peer_port)` — (no docstring)
  - `_handle_getdata(self, msg)` — (no docstring)
  - `_handle_getmempool(self, msg)` — (no docstring)
  - `_dispatch(self, msg, peer_host, peer_port)` — (no docstring)
  - `_handle_client(self, conn, addr)` — (no docstring)

**Top-level functions:**

- `_is_loopback_host(host)` — (no docstring)

## `Src/Network/peers.py`

**Classes:**

- `PeerRecord` — (no docstring)
  - `key(self)` — (no docstring)
- `PeerBook` — (no docstring)
  - `__init__(self, path)` — (no docstring)
  - `reset(self)` — Clear all peers and persist an empty book.
  - `_load(self)` — (no docstring)
  - `_save(self)` — (no docstring)
  - `add(self, host, port, allow_loopback)` — (no docstring)
  - `remove(self, host, port)` — (no docstring)
  - `prune_failed(self, max_fails)` — Drop peers that have exceeded failure threshold.
  - `update(self, rec)` — (no docstring)
  - `list(self)` — (no docstring)
  - `seeds(self, limit)` — (no docstring)
  - `_prune_and_save(self)` — (no docstring)
- `PeerManager` — Outbound peer manager:
  - `__init__(self, blockstore, blockchain, mempool, tx_validator, consensus, probe_interval, target_outbound)` — (no docstring)
  - `_tip(self)` — (no docstring)
  - `_log_peer_event(self, event, rec, **fields)` — (no docstring)
  - `_log_tx_event(self, tx, status, reason, peer, source)` — (no docstring)
  - `_accept_tx_payload(self, tx, peer, source)` — (no docstring)
  - `_state_hash(self)` — (no docstring)
  - `_build_hello(self)` — (no docstring)
  - `_send_rpc(self, host, port, payload)` — (no docstring)
  - `_is_banned(self, host)` — (no docstring)
  - `_is_bootstrap_host(self, host)` — (no docstring)
  - `_ban(self, host, reason, score)` — (no docstring)
  - `_probe_peer(self, rec)` — (no docstring)
  - `_probe_loop(self)` — (no docstring)
  - `_maybe_log_peer_summary(self, peers)` — (no docstring)
  - `_sync_mempool(self)` — (no docstring)
  - `_refresh_seeds(self)` — (no docstring)
  - `_sync_bootstrap_list(self)` — (no docstring)
  - `start(self)` — (no docstring)
  - `stop(self)` — (no docstring)
  - `add_peer(self, host, port)` — (no docstring)
  - `snapshot(self)` — (no docstring)
  - `stats(self)` — (no docstring)
  - `network_tip(self)` — (no docstring)
  - `network_tip_height(self)` — (no docstring)
  - `_maintain_outbound(self)` — (no docstring)
  - `_on_outbound_fail(self, host, port)` — (no docstring)
  - `_on_mempool_tx(self, tx_id)` — (no docstring)
  - `_queue_tx_inv(self, tx_id)` — (no docstring)
  - `_drain_pending_tx_inv(self, max_items)` — (no docstring)
  - `_broadcast_inventory(self)` — (no docstring)
  - `_verify_block(self, blk)` — (no docstring)
  - `_apply_block(self, blk)` — (no docstring)

**Top-level functions:**

- `_now()` — (no docstring)
- `_recv_all(sock, n)` — (no docstring)
- `_is_loopback_host(host)` — (no docstring)

## `Src/Network/sendtx.py`

**Top-level functions:**

- `send_tx(ip, port, tx_payload)` — (no docstring)

## `Src/Network/sync.py`

**Classes:**

- `SyncWorker` — Header-first sync loop (lightweight validation):
  - `__init__(self, blockstore, peer_list_fn, hello_fn, block_validator, apply_block_fn)` — (no docstring)
  - `_term_event(self, key, msg)` — (no docstring)
  - `_peer_candidates(self, prefer)` — (no docstring)
  - `_queue_missing_parent(self, parent_hash, peer)` — (no docstring)
  - `_drain_missing_parents(self)` — (no docstring)
  - `_fetch_blocks_multi(self, hashes, prefer_peer)` — (no docstring)
  - `_log_sync_event(self, blk, status, reason, peer)` — (no docstring)
  - `start(self)` — (no docstring)
  - `stop(self)` — (no docstring)
  - `_tip(self)` — (no docstring)
  - `_fetch_headers(self, host, port, from_height)` — (no docstring)
  - `_fetch_blocks(self, host, port, hashes)` — (no docstring)
  - `_valid_header_chain(self, headers, start_height, prev_hash)` — (no docstring)
  - `_build_locator(self)` — (no docstring)
  - `_store_blocks(self, blocks, peer, peer_sources)` — Apply blocks in height order, ensuring parents are present before commit.
  - `_sync_with_peer(self, host, port)` — Loop fetching headers/blocks from a peer until no new headers are returned.
  - `_notice(self, peer, reason, fields)` — (no docstring)
  - `_loop(self)` — (no docstring)

**Top-level functions:**

- `_recv_all(sock, n)` — (no docstring)
- `_send_request(host, port, payload)` — (no docstring)

## `Src/Network/tools.py`

**Top-level functions:**

- `_send(ip, port, payload)` — (no docstring)
- `_hello()` — (no docstring)
- `interactive(ip, port)` — (no docstring)

## `Src/Node/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Node/fullnode.py`

**Top-level functions:**

- `_ensure_dirs()` — (no docstring)
- `main()` — (no docstring)

## `Src/Node/minernode.py`

**Top-level functions:**

- `_ensure_dirs()` — (no docstring)
- `main()` — (no docstring)

## `Src/Node/walletnode.py`

**Top-level functions:**

- `main()` — (no docstring)

## `Src/SigWit/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/SigWit/sigwit.py`

**Classes:**

- `SegWit` — SegWit adapter for your Falcon chain.
  - `_canon_len(obj)` — (no docstring)
  - `base_copy_no_witness(tx)` — Return a copy of the transaction with all witness removed:
  - `sizes_bytes(tx)` — Returns (base_bytes, total_bytes) using canonical JSON length.
  - `weight_vsize(tx)` — Returns (base_bytes, total_bytes, weight, vsize).
weight = base*3 + total; vsize = ceil(weight/4)
  - `txid(tx)` — Deterministic txid over NO-WITNESS version of the tx.
Uses your canonical signing_message_hex_digest (SHA3-384 → 96 hex).
  - `wtxid(tx)` — Deterministic wtxid over FULL tx (with witness).
  - `extract_witness(tx)` — Extract witness-only fields from a tx (non-mutating):
  - `strip_witness(tx)` — Return a base-only tx (no witness). Non-mutating.
  - `attach_witness(base_tx, witness)` — Merge a base-only tx with witness fields (non-mutating).
- Adds top-level signature/pubkey/witness if provided.
- Copies inputs[i].script_sig if provided.
  - `is_segwit_tx(tx)` — True if the tx contains any witness components.
  - `tx_limits_ok(tx)` — Enforce per-tx limits:
  - `block_weight(block)` — Sum tx weights + small header overhead (base only).
  - `wtxid_merkle_root(tx_list, witnesses)` — Compute merkle root of wtxids (full transactions with witness).
  - `block_weight_ok(block)` — Validate block-wide weight against MAX_BLOCK_WEIGHT.
  - `_merkle_level(hashes)` — Compute one merkle level (double-up last if odd). SHA3-384 is already your canonical digest,
but your 'hash' helper returns 96-hex only when fed a dict. Here we combine hex as strings
and digest with signing_message_hex_digest over a small dict to keep consistency.
  - `merkle_root_txs(txs, mode)` — Compute merkle root over:
  - `update_block_merkle(block, mode)` — Return a copy of block with merkle_root recomputed in requested mode ("txid" or "wtxid").
Does not touch other header fields.
  - `fee_per_vbyte_atoms(tx_fee_atoms, tx)` — Integer fee rate in atoms per vbyte (floor).
  - `fee_per_vbyte_decimal(tx_fee_dec, tx)` — Decimal fee rate per vbyte (for UI/analysis).

## `Src/Storage/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Storage/blockstorage.py`

**Classes:**

- `BlockStore` — Full blocks only (compact JSON), written under:
  - `__init__(self)` — (no docstring)
  - `_reader_check(self, force)` — (no docstring)
  - `_begin_read(self)` — (no docstring)
  - `put_block(self, block_std)` — (no docstring)
  - `get_by_height(self, height, tip_height)` — (no docstring)
  - `get_by_hash(self, blk_hash_hex, tip_height)` — (no docstring)
  - `latest_height(self)` — (no docstring)
  - `_prune_cutoff(self)` — Retention window in blocks; None if not set.
  - `_maybe_prune_in_memory(self, std, tip_height)` — Return a pruned copy if the block is older than the retention window
relative to current tip; otherwise return the original dict.
  - `_load_chain_log_state(self)` — Return (last_height, cumulative_hash) from the state hash log.
  - `_append_chain_hash(self, height, blk_hash)` — Append cumulative header hash for monotonic heights.
  - `_augment_with_full_txs(self, std)` — Add a tx_list_full that merges witness data (if available) for display/export,
without altering the base tx_list used for consensus.
  - `iter_range(self, start_height, limit)` — (no docstring)
  - `delete_by_height(self, height)` — (no docstring)

**Top-level functions:**

- `consensus_write_context()` — Allow BlockStore writes within this context when guard is enabled.
- `_assert_consensus_write()` — (no docstring)
- `_merge_witness_from_full(std)` — (no docstring)
- `_json_dumps(obj)` — (no docstring)
- `_json_loads(b)` — (no docstring)
- `_k_by_height(height)` — (no docstring)
- `_k_by_hash(blk_hash_hex)` — (no docstring)
- `_open_env(path)` — (no docstring)
- `_maybe_resize_env(env)` — Attempt to grow the LMDB map size and return True if resized.

## `Src/Storage/mempool.py`

**Classes:**

- `MempoolStore` — Single mempool subsystem (unifies 'StandardMempool' + 'MempoolStorage'):
  - `__init__(self)` — (no docstring)
  - `_scan_tx_entries(self)` — Yield (txid, raw_json_bytes) for all mempool tx records in LMDB.
  - `get_tx_ids(self, limit)` — Return up to `limit` tx ids from the mempool (no payloads).
  - `_parse_tx_bytes(self, raw)` — Parse a mempool TX JSON blob into standardized dict (lenient).
  - `_size_bytes_of_raw(self, raw)` — Compute size without re-encoding (raw is already JSON bytes).
  - `_size_bytes_of_std(self, std_tx)` — Canonical policy tx size (vsize) for fee checks.
Falls back to compact JSON length if SegWit helper is unavailable.
  - `_fee_of_std(self, std_tx)` — (no docstring)
  - `_fee_per_byte_of(self, fee, size)` — (no docstring)
  - `_background_cleanup(self)` — Background thread to periodically clean up mempool
  - `add_listener(self, listener_id, callback)` — (no docstring)
  - `remove_listener(self, listener_id)` — (no docstring)
  - `notify_new_transaction(self, tx_id)` — (no docstring)
  - `wait_for_new_transactions(self, timeout)` — (no docstring)
  - `remove_confirmed(self, txids)` — Batch-remove confirmed mempool txs from LMDB and clean utxo_index.
  - `notify_new_transaction(self, tx_id)` — Notify all listeners about new transaction with threading
  - `get_realtime_pending_transactions(self, timeout)` — Get pending transactions with real-time updates
  - `force_cleanup_mempool(self)` — Force cleanup of mempool by removing all transactions with invalid inputs.
This should resolve double-spend issues.
  - `get_mempool_size(self)` — Count mempool transactions by scanning LMDB keys.
  - `get_immediate_pending_transactions(self, max_transactions)` — Get pending transactions immediately without waiting, optimized for real-time inclusion.
  - `has_new_transactions_since(self, last_check_time)` — Check if new transactions have arrived since the given timestamp.
  - `get_new_transactions_since(self, last_check_time, known_tx_ids)` — Get only new transactions that arrived since last check.
  - `add_transaction(self, tx)` — Thread-safe transaction addition with proper LMDB coordination.
  - `_load_existing_transactions(self)` — Rebuild the in-memory utxo_index by scanning LMDB (mempool source).
  - `_lmdb_put(self, key, payload)` — (no docstring)
  - `_lmdb_get(self, key)` — (no docstring)
  - `_lmdb_delete(self, key)` — (no docstring)
  - `_scan_entries(self)` — (no docstring)
  - `_size_of_tx(self, std_tx)` — (no docstring)
  - `_fee_of_tx(self, std_tx)` — (no docstring)
  - `_fee_per_byte(self, fee, size)` — (no docstring)
  - `_accept_key(self, key_b)` — (no docstring)
  - `_canonical_key_for_txid(self, txid)` — (no docstring)
  - `_validate_network(self, std_tx)` — (no docstring)
  - `_is_coinbase(self, std_tx)` — (no docstring)
  - `_warm_load(self)` — (no docstring)
  - `_get_current_block_height(self)` — Get current block height for confirmation calculations
  - `mark_confirmed(self, tx_id, *, block_hash, block_height)` — Mark TX as confirmed (tombstone) and purge from pending.
  - `get_all_transactions(self)` — (no docstring)
  - `get_pending_transactions_for_block(self, *, block_size_mb)` — Choose a set of mempool TXs that fit in the canonical budget,
ordered by fee-per-vB (desc). All reads are from LMDB.
  - `length(self)` — Count pending TXs quickly via RAM index.
  - `clear(self)` — Drop entire LMDB and RAM contents for mempool keys.
  - `_ensure_capacity(self, incoming_size)` — Ensure we have room; evict lowest fee-per-vB first if needed.
  - `_current_ram_bytes(self)` — (no docstring)
  - `_evict_low_fee(self, bytes_needed)` — Evict lowest fee-per-vB transactions until we free 'bytes_needed'.
  - `dump_state(self)` — Return a diagnostic snapshot (safe to print/log).
  - `get_transaction(self, tx_id)` — Get transaction by ID
  - `get_transaction_with_confirmations(self, tx_id, current_height)` — Get transaction with confirmation information
  - `get_pending_transactions_with_info(self, limit)` — (no docstring)
  - `has_double_spend(self, tx)` — Check if transaction has any double-spend conflicts in mempool.
Returns (has_conflict, conflicting_tx_id)
  - `_get_current_block_height(self)` — Get current block height for confirmation calculations
  - `get_mempool_size(self)` — Get current number of transactions in mempool.
  - `_calculate_fee_per_byte(self, tx)` — Calculate fee per byte for transaction sorting.
  - `get_pending_transactions(self, limit)` — Read mempool straight from LMDB, sort by fee/byte (desc), return top N.
  - `_save_transaction_to_lmdb(self, tx_std)` — Save transaction to LMDB
  - `_remove_transaction_from_lmdb(self, tx_id)` — Remove transaction from LMDB
  - `remove_transaction(self, tx_id)` — Remove a tx from LMDB mempool; also clean in-memory utxo_index mappings.
  - `_rollback_transaction_addition(self, tx_id, inputs)` — Rollback transaction addition in case of LMDB save failure
  - `_log_transaction_addition(self, tx_std, inputs)` — Log detailed information about transaction addition
  - `cleanup_mempool(self)` — Clean up mempool by removing invalid transactions (double spends, etc.)
Returns cleanup statistics

**Top-level functions:**

- `consensus_write_context()` — (no docstring)
- `_assert_consensus_write()` — (no docstring)
- `_log_mempool(entry)` — (no docstring)
- `_json_dumps(obj)` — (no docstring)
- `_json_loads(b)` — (no docstring)
- `_open_env(path, *, map_size, max_dbs, max_readers)` — (no docstring)
- `_maybe_resize_env(env)` — (no docstring)

## `Src/Storage/utxostorage.py`

**Classes:**

- `UTXOStore` — Stores UTXOs by (txid, vout) with pure ids (no human prefixes).
Keys:
  - utxo:<txid-bytes>:<vout> → standardized UTXO record (JSON)
  - `__init__(self)` — (no docstring)
  - `_utxo_record(*, txid_hex, vout, amount, hashed_public_key, block_height, locked, spent_status)` — (no docstring)
  - `force_unlock_all(self)` — Forcefully unlock all UTXOs in the database.
Returns statistics about unlocked UTXOs.
  - `put(self, txid_hex, vout, amount, hashed_public_key, block_height, *, locked, overwrite)` — (no docstring)
  - `spend(self, txid_hex, vout, spend_height)` — Mark a UTXO as spent at given height - FIXED VERSION
Returns True if successful, False if UTXO doesn't exist or already spent
  - `unspend(self, txid_hex, vout)` — Mark a UTXO as unspent (for rollback operations)
  - `delete(self, txid_hex, vout)` — Delete a UTXO (for rollback operations)
  - `unlock(self, txid_hex, vout)` — (no docstring)
  - `lock(self, txid_hex, vout)` — (no docstring)
  - `get(self, txid_hex, vout)` — (no docstring)
  - `exists_unspent(self, txid_hex, vout)` — (no docstring)
  - `list_by_txid(self, txid_hex, *, include_spent, limit)` — (no docstring)
  - `list_by_address(self, hashed_public_key, *, include_spent, limit)` — Fixed version that handles multiple field names and empty strings.
Caller should normalize Base56 to internal HPK before calling.
  - `apply_block(self, block_std)` — (no docstring)
  - `parse_tx_out_id(tx_out_id)` — (no docstring)
  - `revert_block(self, block_std)` — Reverse the effects of a block: unspend inputs, remove outputs.
Assumes the block was previously applied.

**Top-level functions:**

- `_maybe_resize_env(env)` — (no docstring)
- `consensus_write_context()` — (no docstring)
- `_assert_consensus_write()` — (no docstring)
- `_json_dumps(obj)` — (no docstring)
- `_json_loads(b)` — (no docstring)
- `_open_env(path, *, map_size, max_dbs, max_readers)` — (no docstring)

## `Src/Test/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Test/base56test.py`

**Module docstring:**

Interactive helper to exercise Base-56 address encoding/decoding.

**Top-level functions:**

- `_prompt(msg)` — (no docstring)
- `do_encode()` — (no docstring)
- `do_decode()` — (no docstring)
- `do_validate()` — (no docstring)
- `main()` — (no docstring)

## `Src/Test/bktest.py`

**Classes:**

- `BlockchainSecurityTest` — Comprehensive security test suite for the blockchain
  - `__init__(self)` — (no docstring)
  - `setup_components(self)` — Initialize all blockchain components for testing
  - `run_all_tests(self)` — Run all security tests
  - `test_utxo_integrity(self)` — Test UTXO set integrity and prevent double spending
  - `test_double_spending_attack(self)` — Test various double spending attack vectors
  - `test_fake_transaction_attack(self)` — Test fake transaction creation and validation
  - `test_block_validation(self)` — Test block validation security
  - `test_transaction_validation(self)` — Test transaction validation security
  - `test_mempool_security(self)` — Test mempool security and anti-spam measures
  - `test_pow_security(self)` — Test Proof of Work security
  - `test_chain_reorganization(self)` — Test chain reorganization security
  - `test_orphan_blocks(self)` — Test orphan block handling
  - `test_network_security(self)` — Test network-level security
  - `test_consensus_attacks(self)` — Test consensus-level attacks
  - `test_economic_attacks(self)` — Test economic attacks
  - `test_storage_integrity(self)` — Test storage layer integrity
  - `test_key_management(self)` — Test key management security
  - `test_fee_manipulation(self)` — Test fee calculation and manipulation attacks
  - `create_test_transaction(self, sender_hpk, recipient_hpk, amount)` — Create a test transaction
  - `create_fake_transaction(self)` — Create a fake transaction with invalid signature
  - `create_transaction_with_fake_inputs(self)` — Create transaction referencing non-existent UTXOs
  - `create_transaction_with_negative_amount(self)` — Create transaction with negative amount
  - `create_transaction_exceeding_balance(self)` — Create transaction that spends more than available
  - `create_test_block(self, previous_hash)` — Create a test block
  - `create_test_block_with_valid_hash(self)` — Create a test block with valid 96-char hex hash
  - `create_block_with_invalid_previous_hash(self)` — Create block with invalid previous hash
  - `create_block_with_invalid_pow(self)` — Create block with invalid proof of work
  - `create_block_with_invalid_merkle(self)` — Create block with invalid Merkle root
  - `create_block_with_future_timestamp(self)` — Create block with future timestamp
  - `create_transaction_with_low_fee(self)` — Create transaction with fee below minimum
  - `create_oversized_transaction(self)` — Create transaction that exceeds size limits
  - `create_transaction_with_invalid_outputs(self)` — Create transaction with invalid outputs
  - `create_transaction_with_custom_fee(self, sender, recipient, amount, fee)` — Create transaction with custom fee
  - `create_fake_chain(self, length)` — Create a fake blockchain
  - `create_orphan_block(self)` — Create an orphan block
  - `create_transaction_for_network(self, network)` — Create transaction for specific network
  - `print_summary(self)` — Print test summary
  - `calculate_production_readiness(self)` — Calculate production readiness score 1-10

**Top-level functions:**

- `main()` — Main function to run security tests

## `Src/Test/condebugger.py`

**Classes:**

- `ClassConsensusDebug` — DEBUG Consensus Engine - Shows EXACTLY what's different between signing and verification
  - `__init__(self, blockchain, key_manager, block_store, utxo_store, mempool, network)` — (no docstring)
  - `_init_debug_logging(self)` — Initialize debug logging
  - `debug_transaction_verification(self, tx_data, block_height)` — DEBUG: Compare EXACTLY what was signed vs what we're verifying
  - `_extract_tx_details(self, tx_data)` — Extract detailed transaction information for comparison
  - `_extract_signature_debug(self, tx_data)` — Extract signature with detailed debugging
  - `_get_sender_hpk(self, tx_data)` — Get sender's hashed public key from first input
  - `_reconstruct_method1_empty_scriptsig(self, tx_data)` — Method 1: Empty script_sig in inputs
  - `_reconstruct_method2_original_scriptsig(self, tx_data)` — Method 2: Original script_sig in inputs
  - `_reconstruct_method3_minimal(self, tx_data)` — Method 3: Minimal reconstruction - only essential fields
  - `_reconstruct_method4_exact_copy(self, tx_data)` — Method 4: Exact copy - recreate exactly as stored
  - `_reconstruct_transaction_basic(self, tx_data, script_sig)` — Basic transaction reconstruction with configurable script_sig
  - `_log_detailed_comparison(self, debug_info)` — Log detailed comparison to file
  - `debug_specific_transaction(self, tx_id, block_height)` — Debug a specific transaction by ID

## `Src/Test/encodingtest.py`

**Module docstring:**

Falcon Encoding Size Test (No SegWit)

**Top-level functions:**

- `b58encode(data)` — Encode bytes into Base58 (no checksum). Returns ASCII bytes.
- `b58decode(s)` — Decode Base58 ASCII bytes into raw bytes (no checksum).
- `base64_len(n)` — Exact Base64 length: ceil(n/3)*4.
- `base85_len(n)` — Ascii85/Base85 length: ceil(n/4)*5 (approx, padding ignored).
- `base58_len(data)` — Return exact Base58 length by actually encoding.
- `hex_len(n)` — Hex length for n raw bytes (2 ASCII chars per byte).
- `fmt_bytes(n)` — (no docstring)
- `parse_block_caps(caps)` — (no docstring)
- `compute_report(base_bytes, pubkey_bytes, sig_bytes, keys, raw_block_caps)` — (no docstring)
- `print_report(report)` — (no docstring)
- `emit_csv(report, path)` — (no docstring)
- `emit_md(report, path)` — (no docstring)
- `main()` — (no docstring)

## `Src/Test/forktest.py`

**Top-level functions:**

- `_log(entry)` — (no docstring)
- `_clean_test_dbs(test_root)` — (no docstring)
- `_make_block(height, prev_hash)` — (no docstring)
- `main()` — (no docstring)

## `Src/Test/healthcheck.py`

**Module docstring:**

Health check for nodes: queries API endpoints for tip, peers, mempool, and status.

**Top-level functions:**

- `load_ports()` — (no docstring)
- `check_node(base_url, headers)` — (no docstring)
- `main()` — (no docstring)

## `Src/Test/p2ptest.py`

**Module docstring:**

Minimal P2P test harness (1 full node + 1 miner) to reduce noise.

**Top-level functions:**

- `node_env(idx, base_p2p, seed_host, seed_port, role)` — (no docstring)
- `spawn_node(idx, role, env)` — (no docstring)
- `main()` — (no docstring)

## `Src/Test/test.py`

**Top-level functions:**

- `find_imports_in_file(filepath)` — Find all imports in a Python file

## `Src/Test/txhashing.py`

**Module docstring:**

tx_signature_audit.py

**Top-level functions:**

- `nowts()` — (no docstring)
- `fingerprint(hexstr, head, tail)` — (no docstring)
- `normalize_hex(h)` — (no docstring)
- `extract_sig_from_script(script_sig_blob)` — Attempt to find a 2048-hex signature in the blob.
Returns the first match or None.
- `extract_signing_hash(tx_dict)` — If the transaction dictionary contains a 'signing_hash' or similar field, return normalized hex.
- `run_falcon_verify(falcon_path, pub_hex, msg_hex, sig_hex, timeout)` — Run: falcon_cli verify <pub_hex> <msg_hex> <sig_hex>
Returns (rc, stdout, stderr)
- `sha3_384_hex(b)` — (no docstring)
- `build_message_variants(tx_dict)` — Build a list of (variant_name, msg_hex) to try with falcon_cli.
- `inspect_tx(tx_dict, falcon_path, do_verify, logger)` — Inspect tx dict and optionally call falcon CLI on candidate combos.
Returns a dict of findings.
- `configure_logger(out_path, level)` — (no docstring)
- `save_snapshot(path, data)` — (no docstring)
- `load_snapshot(path)` — (no docstring)
- `main()` — (no docstring)

## `Src/Test/utxotest.py`

**Top-level functions:**

- `main()` — (no docstring)
- `rebuild_utxos()` — (no docstring)
- `check_consistency()` — (no docstring)
- `debug_utxo_issue()` — (no docstring)
- `fix_utxo_field_names()` — Fix UTXO field name inconsistencies
- `test_miner_utxo_flow()` — (no docstring)

## `Src/Transactions/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Transactions/coinbase.py`

**Classes:**

- `CoinbaseTx` — Deterministic coinbase transaction (no inputs, one output to miner HPK).
  - `__init__(self, *, block_height, miner_hpk, reward, timestamp, metadata, tx_id, network)` — (no docstring)
  - `_to_id_dict(self)` — Build a canonical dict for txid hashing that does NOT depend on self.tx_id or tx_out_id.
This avoids bootstrap recursion during construction.
  - `_generate_tx_id(self)` — Deterministic coinbase TX_ID using the same canonical hashing as all other transactions.
Uses a txid-safe body that excludes tx_id/tx_out_id to avoid bootstrap loops.
  - `_estimate_size(self)` — Byte-length of canonical JSON from to_dict().
  - `to_dict(self)` — Standardized transaction dict aligned with the general Transaction schema.
  - `from_dict(cls, data)` — Rebuild a CoinbaseTx from a standardized dict. Tolerant of minor shape differences.
  - `_extract_miner_hpk(data)` — Try several places to find the miner's HPK in arbitrary input dicts.
  - `_ell(s, n)` — (no docstring)
  - `get_confirmation_info(self, current_block_height)` — Get confirmation information for coinbase transaction

**Top-level functions:**

- `_json_dumps(obj)` — (no docstring)

## `Src/Transactions/fee.py`

**Classes:**

- `FeeModel` — Flat per-vB fee model with minimum fee enforcement.
Uses Constants for base parameters (`FEE_PER_BYTE_ATOMS`, `MIN_TRANSACTION_FEE_ATOMS`).
  - `__init__(self, base_supply)` — (no docstring)
  - `calculate_fee(self, block_size, amount, tx_size, payment_type)` — Calculate fee for a transaction:
- fee_per_byte × tx_size
- enforce minimum fee

## `Src/Transactions/tx.py`

**Classes:**

- `Transaction` — UTXO-only transaction model with comprehensive logging
  - `__init__(self, inputs, outputs, tx_id, *, coinbase, utxo_store, fee_model, block_height, metadata, network, pubkey)` — (no docstring)
  - `_generate_tx_id(self)` — Deterministic TXID over the **no-witness** (base) form of the transaction.
Uses canonical_tx_id on the base dict (witness stripped).
  - `calculate_hash(self)` — Deterministic signing message hash with consistent encoding
  - `_get_signature_commitment(self)` — Malleability-resistant commitment (optional: useful for logs/audits).
  - `_calc_size(self, *, include_fee)` — SegWit-aware size: returns **virtual size (vsize)** in bytes.
  - `_estimate_transaction_size(self)` — Lightweight early **vsize** estimate used during fee pre-calculation.
Uses the signing (no-witness) dict as a stable baseline, then approximates total by
adding current witness if present. If no witness yet, base≈total ⇒ conservative vsize.
  - `to_dict(self)` — Canonical full transaction dictionary (what you persist/propagate).
  - `to_compact(self)` — (no docstring)
  - `from_dict(cls, data)` — Deserializer that preserves pubkey + embedded signing hash.
  - `from_compact(cls, data)` — (no docstring)
  - `sign(self, sender_priv_key, sender_pub_hash)` — Deterministic signing using the precomputed signing hash.
Attaches signature to owned inputs WITHOUT mutating hashed fields.
  - `store_utxos(self, utxo_store)` — Insert outputs as UTXOs.
  - `mark_utxos_spent(self, utxo_store)` — Mark referenced inputs as spent.
  - `get_confirmation_info(self, current_block_height)` — Confirmation snapshot.
  - `__repr__(self)` — (no docstring)
  - `_freeze_transaction_data(self)` — Freeze all fields that participate in hashing. Must be called once in __init__.
Computes a deterministic fee floor when absent, then sets tx_id.
  - `to_dict_for_signing(self)` — EXACT dict hashed for signatures — **no witness included**.
  - `_inputs_to_dict_for_signing(self)` — (no docstring)
  - `_outputs_to_dict_for_signing(self)` — (no docstring)
  - `validate_consistency(self)` — Ensure current derived hash equals the frozen/embedded signing_hash.
Raises if any hashed field changed (fee, IO, metadata, timestamp, etc.).

## `Src/Transactions/txin.py`

**Classes:**

- `TransactionIn` — Minimal input referencing a previous UTXO via tx_out_id = "<txid>:<vout>".
  - `__post_init__(self)` — (no docstring)
  - `tx_id(self)` — (no docstring)
  - `output_index(self)` — (no docstring)
  - `validate(self, utxo_store)` — SegWit-aware input validation.
  - `cleared_for_txid(self)` — Emit a base (no-witness) view of this input for TXID/signing-hash computation.
script_sig is intentionally blank.
  - `as_witness_dict(self)` — Emit the witness-only portion of this input (SegWit).
Useful for storing/transmitting witness separately.
  - `to_dict(self)` — Emit a standardized dict.
We include BOTH the standardized keys and 'tx_out_id' for maximum compatibility.
  - `from_dict(cls, data)` — Accept either compact/standardized keys, and optionally 'tx_out_id'.
If 'tx_out_id' is missing, we build it from (tx_id, index).
  - `copy(self)` — Shallow copy preserving fields.
  - `__repr__(self)` — (no docstring)

**Top-level functions:**

- `_is_hex(s)` — (no docstring)

## `Src/Transactions/txmanager.py`

**Classes:**

- `TransactionManager` — New-architecture Transaction Manager.
  - `__init__(self, block_store, utxo_store, mempool, *, key_manager, fee_model)` — (no docstring)
  - `create_transaction(self, *, sender_hpk, recipient_hpk, amount, metadata, change_hpk, tx_type)` — Build a SegWit-aware STANDARD transaction from sender to recipient.
Fee and size now use virtual size (vsize).
  - `validate_transaction(self, tx)` — SegWit-aware stateless validation.
Checks structure, vsize limits, UTXO coverage, fee >= min, and signatures.
  - `_build_transaction(self, *, selected_utxos, total_input, sender_hpk, recipient_hpk, amount, change_hpk, metadata)` — Build a transaction with SegWit-aware fee calculation (vsize).
  - `create_and_validate_transaction(self, *, sender_hpk, recipient_hpk, amount, metadata, change_hpk)` — Create and comprehensively validate a transaction.
Returns (transaction, error_message)
  - `store_transaction_in_mempool(self, tx)` — (no docstring)
  - `select_transactions_for_block(self, max_block_bytes)` — Pick best transactions by fee-per-vB up to `max_block_bytes`.
  - `apply_mined_block(self, block_std)` — After a block is mined:
  - `_collect_unspent_for_address(self, hashed_pubkey)` — Get unspent UTXOs for address (hashed_pubkey) from UTXOStore.
  - `_select_utxos_to_cover(self, utxos, target)` — Greedy selection by descending amount (simple and effective for now).
  - `_calc_fee_for_size(self, size_bytes)` — SegWit-aware fee calculator: uses virtual size (vsize) instead of raw bytes.
  - `_split_tx_out_id(self, tx_out_id)` — Returns (txid_hex, vout)
  - `_sign_transaction_with_key_manager(self, tx)` — Ask the injected key_manager to sign. We pass the tx hash as message.
Inputs carry compact canonical `SIG_REF` markers; full signatures remain in tx witness fields.
  - `_estimate_fee(self, input_count, output_count)` — Estimate fee based on transaction size
  - `_collect_unspent_for_address(self, hashed_pubkey)` — Get unspent UTXOs for address
  - `_select_utxos(self, utxos, target)` — Select UTXOs to cover target amount

## `Src/Transactions/txout.py`

**Classes:**

- `TransactionOut` — Represents a transaction output (UTXO) in the new system.
  - `__post_init__(self)` — (no docstring)
  - `_fallback_tx_out_id(self)` — Generate a salted SHA3-384 id from (hashed_pubkey, amount, locked, flag, salt).
This is only used if (tx_id, output_index) aren't provided.
  - `to_dict(self)` — Emit a standardized dict using canonical long keys ONLY.
This must match the key names used in _generate_tx_id.
  - `to_compact(self)` — Compact representation for wire/storage.
  - `from_dict(cls, data)` — Accepts standardized, compact, or legacy dictionaries.
  - `from_compact(cls, data)` — (no docstring)
  - `copy(self)` — (no docstring)
  - `__repr__(self)` — (no docstring)

**Top-level functions:**

- `_to_decimal(v)` — (no docstring)

## `Src/Transactions/txvalidation.py`

**Classes:**

- `TXValidation` — Unified transaction validator/normalizer/fee-checker/constructor for the new system.
  - `__init__(self, *, utxo_store, mempool_store, fee_model, network)` — Initialize the transaction validator.
Includes UTXO access, mempool linkage, fee model, and KeyManager setup.
  - `_verify_single_owner_transaction(self, tx_data)` — Verify all inputs belong to the same owner (same QXB address)
  - `_validate_utxos_and_double_spend(self, tx)` — Validate UTXOs and prevent double spends with enhanced checks.
  - `_check_mempool_conflicts(self, tx)` — Check for conflicts with transactions in mempool.
  - `_validate_dust_outputs(self, tx)` — Prevent dust attacks by enforcing minimum output amounts.
  - `_validate_fee(self, tx)` — Validate fee for non-coinbase transactions.
  - `validate_transaction_comprehensive(self, tx)` — Comprehensive transaction validation with SegWit and Falcon signature verification.
  - `normalize_tx_dict(self, tx)` — Bring an incoming transaction dict into the canonical standardized shape:
  - `validate_coinbase_dict(self, tx, *, block_height)` — Coinbase dict validation (no inputs, one output w/ hashed_public_key, fee=0).
Reward cross-check is light here (consensus reward schedule is checked at block assembly).
  - `validate_tx_dict(self, tx)` — Regular tx dict validation (no types, HPK-only outputs).
  - `check_utxos(self, tx)` — Verify that every referenced input UTXO exists & is unspent.
Returns (ok, input_sum, output_sum).
  - `_parse_tx_out_id(tx_out_id)` — (no docstring)
  - `estimate_size_bytes(self, tx)` — Estimate canonical tx vsize.
  - `required_fee(self, *, tx_size_bytes)` — Fee: `FEE_PER_BYTE_ATOMS * vsize`, subject to `MIN_TRANSACTION_FEE_ATOMS`.
  - `check_fee_sufficiency(self, tx)` — Validate fee sufficiency using canonical vsize.
Returns (ok, actual_fee, required_fee, size_bytes).
  - `build_transaction(self, *, inputs, outputs, metadata, network)` — Create a Transaction object (no types), HPK-only outputs.
  - `apply_to_utxo(self, tx)` — Apply a confirmed transaction to UTXO set:
  - `enforce_fee_requirements(self, tx)` — Helper method to enforce fee requirements on transactions.
Called by other validation methods.
  - `_validate_fee(self, tx)` — Validate fee for non-coinbase transactions.
Now uses the enforce_fee_requirements helper.
  - `build_coinbase(self, *, block_height, miner_hpk, metadata)` — Construct a CoinbaseTx object aligned with your new Coinbase class.
  - `coinbase_dict(self, *, block_height, miner_hpk, metadata)` — Build & return a standardized coinbase dict.
  - `_tx_id_fallback(self, tx)` — (no docstring)
  - `_validate_signature(self, tx_std)` — Falcon signature validation for SegWit txs — signs only base (no-witness) message.
  - `_find_identifier_from_pubkey(self, pubkey, network)` — Find key identifier from public key by searching through keys

**Top-level functions:**

- `_json_dumps(obj)` — Canonical JSON (compact, utf-8), with Decimal/bytes support.
- `_ell(s, n)` — (no docstring)
- `_to_decimal(x)` — (no docstring)
- `_atom_aligned(value)` — True if the value is an exact multiple of 1 / ATOMS_PER_COIN (no sub-atom dust).

## `Src/Transactions/utxomanager.py`

**Classes:**

- `UTXOManager` — High-level manager around UTXOStore (LMDB).
  - `__init__(self, *, utxo_store, mempool_store)` — (no docstring)
  - `get(self, tx_out_id)` — Return a single UTXO record (standardized) or None.
  - `exists_unspent(self, tx_out_id)` — Fast check: does an unspent UTXO exist for this id?
  - `list_by_hpk(self, hashed_public_key, *, include_spent, limit)` — Return UTXOs owned by a given hashed public key (HPK).
Includes pending outputs from mempool (if mempool store provided).
  - `get_confirmed_balance(self, hashed_public_key)` — Sum unspent & unlocked UTXOs for HPK (confirmed only; ignores pending mempool outputs).
  - `get_pending_balance(self, hashed_public_key)` — Funds locked (but not spent) + any pending mempool outputs addressed to HPK.
  - `select_for_amount(self, hashed_public_key, amount, estimated_fee, *, max_inputs)` — Simple ascending-amount selection to cover (amount + estimated_fee).
Avoids locked/spent entries; no prefixes; all by HPK.
  - `lock_inputs(self, tx_inputs, *, locking_tx_id)` — Lock each UTXO referenced by tx_inputs (tx_out_id fields).
  - `unlock_inputs(self, tx_inputs)` — Unlock each UTXO referenced by tx_inputs (tx_out_id fields).
  - `register_outputs_from_tx(self, tx_std, *, block_height)` — Add UTXOs for each TX output (using standardized tx dict).
  - `consume_inputs_from_tx(self, tx_std, *, spend_height)` — Mark each input's referenced UTXO as spent.
  - `apply_block(self, block)` — Update UTXO set using a full standardized block dict or Block instance.
- spend all inputs
- add all outputs
  - `validate_available(self, tx_out_id, amount)` — Check that a given UTXO is present, unspent and unlocked, and covers 'amount'.
  - `delete_utxo(self, tx_out_id)` — Hard delete a UTXO (cache-less path; primarily for maintenance tools).
  - `_direct_utxo_key(self, txid_hex, vout)` — (no docstring)
  - `get_available_balance(self, hashed_public_key, current_height)` — Get both confirmed and pending balance with proper confirmation enforcement.
COINBASE: 400 confirmations required
REGULAR: 10 confirmations required
  - `get_pending_balance_with_confirmations(self, hashed_public_key, current_height)` — Calculate pending balance including confirmation rules
COINBASE: 400 confirmations required
REGULAR: 10 confirmations required
  - `get_utxos_with_confirmations(self, hashed_public_key, current_height)` — Get UTXOs with detailed confirmation information including coinbase status
  - `get_balance_with_confirmations(self, hashed_public_key, current_height)` — Get balance with proper confirmation enforcement for coinbase (400) vs regular (10) transactions.
  - `get_utxo_confirmation_status(self, utxo, current_height)` — Get detailed confirmation status for a single UTXO.
  - `add_pending_transaction(self, tx_std)` — Track a pending transaction to update balance calculations immediately.
This marks inputs as temporarily spent and outputs as pending.
  - `remove_pending_transaction(self, tx_id)` — Remove a pending transaction (when confirmed or failed).
  - `get_balance_with_pending(self, hashed_public_key, current_height)` — Get balance including pending transactions for immediate UI updates.

**Top-level functions:**

- `_now_ms()` — (no docstring)
- `_to_decimal(v)` — (no docstring)
- `_parse_tx_out_id(tx_out_id)` — (no docstring)
- `_ensure_tx_out_id(tx_id, output_index)` — (no docstring)

## `Src/Utility/__init__.py`

*(No classes, functions, or module docstring found.)*

## `Src/Utility/const.py`

**Classes:**

- `Constants` — (no docstring)
  - `__setattr__(self, key, value)` — (no docstring)
  - `_resolve_dir(path, fallback)` — (no docstring)
  - `get_address_prefix()` — Returns the address prefix for the current network (ATHO for mainnet, ATHT for testnet, ATHT for regnet).
  - `INITIAL_COINBASE_REWARD()` — Returns the initial coinbase reward at block 0,
using the hard-coded emission schedule.
  - `BASE_SUPPLY()` — Exact pre-tail base target from the hard-coded emission schedule (100,000,000 ATHO total, including 390,625 ATHO bootstrap at block 1).
  - `BASE_SUPPLY_ATOMS()` — Exact pre-tail base target in atomic units for consensus math.
  - `get_base_supply()` — Preferred accessor for the pre-tail base-supply reference.
  - `get_base_supply_atoms()` — Preferred accessor for the pre-tail base supply in atomic units.
  - `get_block_reward_atoms(height)` — Consensus block subsidy for a given height in atomic units (includes bootstrap allocation at the configured bootstrap height).
  - `get_block_reward(height)` — Consensus reward for a given height in display coins.
  - `to_atoms(value)` — Convert a display coin amount to integer atoms.
  - `is_atom_aligned(value)` — True when a display coin amount maps exactly to integer atoms.
  - `from_atoms(atoms)` — Convert integer atoms to a display Decimal amount.
  - `verify_emissions()` — Verifies boundary rewards and the exact pre-tail supply — prints results.
  - `_resolve_reward_from_mapping(height)` — Back-compat shim — mapping no longer used for consensus.
Route to the hard-coded schedule.
  - `get_current_halving_info(height)` — Returns current era info based on the hard-coded schedule.
  - `total_emitted_atoms(height)` — Total emitted supply at a height in atomic units.
  - `total_emitted(height)` — (no docstring)
  - `tx_weight(base_bytes, total_bytes)` — SegWit weight = base*3 + total.
  - `tx_vsize(base_bytes, total_bytes)` — Virtual size = ceil(weight/4).
  - `block_weight_ok(running_weight)` — True if weight <= MAX_BLOCK_WEIGHT.
  - `block_bytes_ceiling()` — Back-compat ceiling for non-witness bytes.
  - `tx_weight_from_obj(tx)` — Quick weight calculator using len(json).
  - `block_weight_from_obj(block)` — Sum tx weights + header base overhead.
  - `block_weight_ok_from_obj(block)` — Check total block weight against limit.
  - `get_db_path(db_name)` — Returns the correct database path based on the current network and db type.
  - `get_confirmations_required(tx_type)` — Minimum confirmations for a transaction type.
- COINBASE (or tx_type == 'COINBASE'): uses get_coinbase_confirmations()
- All others: regular minimum (default 2)
  - `get_coinbase_confirmations()` — Minimum confirmations before coinbase outputs become spendable
  - `is_tx_confirmed(block_height, current_height, tx_type)` — Check if transaction is confirmed based on block height
  - `get_confirmations_remaining(block_height, current_height, tx_type)` — Get remaining confirmations needed

**Top-level functions:**

- `set_miner_type(miner_type)` — (no docstring)
- `get_miner_type()` — (no docstring)
- `_era_index(height)` — (no docstring)
- `_halving_reward_atoms_at_era_index(e)` — (no docstring)
- `_halving_reward_atoms(height)` — (no docstring)
- `_base_supply_atoms()` — (no docstring)
- `_reward_atoms(height)` — (no docstring)
- `_total_emitted_atoms_up_to(height)` — (no docstring)
- `_atoms_to_decimal(atoms)` — (no docstring)

## `Src/Utility/datatypes.py`

**Top-level functions:**

- `to_bytes(x)` — Canonical: str -> utf-8 bytes; bytes pass-through.
- `to_hex(b)` — Canonical hex formatter (lowercase).
- `from_hex(h)` — Strict hex -> bytes (accepts any case, normalizes by caller).
- `to_decimal(x)` — Canonical Decimal ctor (no floating error).
- `now_timestamp()` — Epoch time in milliseconds (as per TIMESTAMP_UNIT).
- `lmdb_key(ns, *parts)` — Builds namespaced keys: b'ns:part1:part2'.
- `utxo_key(txid_hex, vout_index)` — (no docstring)
- `tx_key(txid_hex)` — (no docstring)
- `block_key(height)` — (no docstring)

## `Src/Utility/debug.py`

**Classes:**

- `MirrorConfig` — (no docstring)
- `_DedupCache` — (no docstring)
  - `__init__(self, window_s, max_cache)` — (no docstring)
  - `seen_recently(self, key)` — (no docstring)
- `_FilteredTee` — Mirrors writes to a file but only for major events to avoid I/O bottlenecks.
  - `__init__(self, primary, file_path, encoding, config, dedup_cache)` — (no docstring)
  - `_is_major_event(self, s)` — Check if this is a major event that should be logged to file.
  - `_normalize_line(self, line)` — (no docstring)
  - `_is_duplicate(self, line)` — (no docstring)
  - `_write_line(self, line)` — (no docstring)
  - `write(self, s)` — (no docstring)
  - `flush(self)` — (no docstring)
  - `isatty(self)` — (no docstring)
  - `fileno(self)` — (no docstring)
  - `close(self)` — (no docstring)
  - `encoding(self)` — (no docstring)
- `DebugMirror` — Redirects sys.stdout and sys.stderr to file(s) but only for major events
to prevent I/O bottlenecks during mining operations.
  - `start(cls, cfg)` — Start mirroring stdout/stderr to log files for major events only.
  - `stop(cls)` — Stop mirroring and restore original stdout/stderr.
  - `is_active(cls)` — Check if mirroring is currently active.

**Top-level functions:**

- `install_terminal_logger()` — Install a deduped terminal events log for any node/miner/GUI process.

## `Src/Utility/dict.py`

**Classes:**

- `UnknownSchemaKind` — (no docstring)

**Top-level functions:**

- `_require_kind(kind, table)` — (no docstring)
- `standardize(kind, data)` — Normalize 'data' to standardized keys for internal use.
Accepts either raw user keys, standardized keys, or compact keys.
- `destandardize(kind, data)` — Expand to the exact standardized long names (idempotent if already standardized).
- `to_compact(kind, data, include_only)` — Convert standardized dict to compact dict for wire/block.
If include_only is provided, only include those standardized keys.
- `from_compact(kind, data)` — Convert compact dict to standardized dict.
Ignores unknown keys gracefully.

## `Src/Utility/hash.py`

**Top-level functions:**

- `_to_bytes(data)` — Normalize input to bytes. Strings are UTF-8 encoded.
- `sha3(data)` — Single SHA3-384; ALWAYS returns raw bytes (digest).
Use this throughout the codebase so call sites can .hex() if needed.
- `sha3_hex(data)` — Single SHA3-384; returns lowercase hex string.
Prefer this only when you explicitly need hex.
- `sha3_256(data)` — Single SHA3-256; ALWAYS returns raw bytes (digest).
Useful for short checksums (e.g., address checksums).
- `sha3_256_hex(data)` — Single SHA3-256; returns lowercase hex string.
- `merkle_parent(left, right)` — Parent = SHA3-384(left || right). Inputs must be bytes (digests).
- `merkle_root_from_hex(txids_hex)` — Compute merkle root from a list of txid hex strings.
Returns a hex string (lowercase).

## `Src/Utility/trace.py`

**Top-level functions:**

- `_ts()` — (no docstring)
- `_event_key(area, msg, extra)` — (no docstring)
- `_eventlog_write(level, area, msg, extra, line, force)` — (no docstring)
- `p(area, msg, extra)` — (no docstring)
- `pjson(area, label, obj)` — (no docstring)
- `perror(area, msg, extra)` — (no docstring)
- `log_exception(area, exc, note)` — (no docstring)
- `trace_block(area, action, extra)` — (no docstring)

## `Src/Utility/txdhash.py`

**Top-level functions:**

- `_q8(x)` — (no docstring)
- `_json_default(o)` — (no docstring)
- `_canon_json(d)` — (no docstring)
- `canonical_tx_id(tx)` — Deterministic txid that is robust to hashed_pubkey/hashed_public_key aliasing.
We normalize outputs to always carry hashed_public_key for hashing and drop
the short alias so different serializers cannot change the digest.
- `signing_message_hex_digest(tx)` — Deterministic, byte-for-byte signing payload:
  sha3_384( f"{version}|{lock_time}|vin_str|vout_str|meta_json|{tx_id}" ).hexdigest().lower()
Defensive against None/str values (e.g., sequence=None).
- `is_lower_hex(s)` — (no docstring)
- `msg_to_cli_hex(msg, mode)` — Normalize 'message' into the EXACT hex string of the bytes

## `Src/Utility/txlogger.py`

**Classes:**

- `TXConstructionLogger` — (no docstring)
  - `__new__(cls)` — (no docstring)
  - `__init__(self)` — (no docstring)
  - `_log_to_file(self, message, file_path)` — Log message to specific file
  - `log_function_call(self, function_name, tx_id, data, note)` — Log a function call with transaction data
  - `log_hashing_operation(self, operation, input_data, output_hash, tx_id)` — Log hashing operations
  - `log_signature_operation(self, operation, tx_id, pubkey, message, signature, result)` — Log signature operations

## `Src/Utility/versioning.py`

**Module purpose:**

- Runtime integrity and upgrade-discipline utilities for live nodes.
- Provides release-manifest build/verify helpers and runtime drift checks.

**Top-level functions (high-impact):**

- `validate_tighten_only_schedule(...)` — Validate schedule monotonicity/tighten-only policy.
- `validate_boot_consensus_policy()` — Startup policy checks including rollback cap constraints.
- `verify_release_manifest(...)` — Verify manifest file hashes and optional signature.
- `build_release_manifest(...)` / `write_release_manifest(...)` — Build/write current release manifest.
- `bootstrap_runtime_guard(role, ...)` — Initialize runtime guard snapshot and initial validation.
- `runtime_guard_check(force=False)` — Perform periodic drift check; logs security events.
- `runtime_guard_ok()` / `runtime_guard_status()` — Query guard state for runtime and consensus paths.
