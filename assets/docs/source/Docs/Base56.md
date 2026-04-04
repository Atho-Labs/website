# Base56 Address Encoding

Last refresh: 2026-04-04.

This note explains why Atho uses Base56 for addresses instead of Base58 or other alphabets.

## Why Base56
- **Ambiguity reduction:** Drops lookalike characters to cut down on copy/paste and transcription errors.
- **Human-friendly:** Better readability in CLI, logs, and printed/exported materials; fewer mistakes when reading aloud or over screenshares.
- **Consistent casing:** One unambiguous alphabet across all components (CLI, API responses, wallet UI) so there is one canonical representation.

## How it’s built
- HPK (hashed public key) is derived from the Falcon public key (SHA3-384).
- HPK bytes are encoded with the Base56 alphabet (digits/letters chosen to avoid lookalikes).
- Decoding reverses the process to recover the HPK for validation and address matching.

## Characters removed (6) and why
Removed from the larger Base62 set because they are visually confusing:
1. `O` (uppercase O) – looks like zero
2. `0` (zero) – looks like letter O
3. `I` (uppercase i) – looks like l/1
4. `l` (lowercase L) – looks like I/1
5. `1` (one) – looks like I/l
6. `i` (lowercase i) – too similar to I/l

## Atho Base56 alphabet (safe set)
Uppercase: `A B C D E F G H J K L M N P Q R S T U V W X Y Z`  
Lowercase: `a b c d e f g h j k m n p q r s t u v w x y z`  
Digits: `2 3 4 5 6 7 8 9`

## Benefits of removing lookalikes
- Avoids misreading addresses and wrong transfers
- Reduces fraudulent lookalike addresses
- Cuts typing errors on mobile and across fonts/screen sizes
- Mirrors the rationale of Base58 and other error-resistant encodings

## Why not Base58 or Bech32?
- Base58 still includes ambiguous glyphs for some fonts/locales; Base56 removes more of them.
- Bech32 adds checksums and HRPs, but is longer; Atho prioritizes shorter, readable strings with a controlled alphabet. A checksum can be layered separately if desired.

## Security: encoding vs. strength
- Base56 is purely an encoding choice for human readability; it does not reduce cryptographic strength. The underlying security comes from Falcon-512 signatures and SHA3-384 hashing of public keys.
- SHA3-384 offers a larger digest than SHA-256, providing stronger collision resistance and headroom against preimage/collision attacks; the Base56 text is just a view of those bytes.
- Collusion/lookalike resistance: by removing ambiguous characters and using explicit network prefixes, it’s harder to trick users with visually similar addresses, while the HPK (SHA3-384) remains the authoritative identifier internally.

## How addresses are derived internally (HPK)
- Public key → SHA3-384 → HPK (hashed public key) → Base56 address.
- The Base56 address is a user-friendly wrapper; internally the node works with the HPK bytes for lookups (UTXO, mempool, wallet).
- Network prefix: Mainnet addresses use `A` as the leading letter; Testnet uses `T` to avoid cross-network confusion.

## Examples (address ↔ HPK)
- Mainnet address (prefix `A`):  
  `A9PDGuRfXS2s6Mpq5NSrug4x5vHxRcfQer3PbWUxjyRTQ7h8NcTHMyvpXy4CxM6FMnySAwpYgs`  
  Corresponding HPK (SHA3-384, human-readable tag):  
  `ATHO685591341486bd81bbf6b705dff4e2375d17e06b04ae1f0c241b968107f17406fdedeacfa9301bc6e927118d7ae86577`

- Testnet address (prefix `T`):  
  `T84Eh9SrqHhXSffCGgTj7kRYuqJcdh2XmxPpY3Z97n42jwEU2FDNZWD8ExkYCFtaJZ8t72SaPe`  
  Corresponding HPK (SHA3-384, human-readable tag):  
  `ATHT5579ff037417a01d019e4edfaa7d3fb9b784bb0f4f5de63e89da1e403a727b2767df338a849869c8a2f27671ad5c857b`

These examples illustrate the friendly, reduced alphabet (no lookalikes), clear network prefix, and the internal HPK (SHA3-384) that the node uses for validation and storage.

## Why SHA3-384 (vs. other SHA3 variants)
- We chose SHA3-384 for extra collision resistance margin over SHA3-256 while keeping addresses manageable; it’s a conservative “overkill” choice aligned with using Falcon-512.
- Shorter digests reduce address length but also reduce collision/preimage headroom:
  - SHA3-128 (~28 chars in Base56) — not secure enough.
  - SHA3-224 (~44 chars) — tighter, but less margin.
  - SHA3-256 (~49 chars) — a good balance, but we opted for more headroom.
  - SHA3-384 (~71 chars) — our canonical choice (current Atho addresses).
  - SHA3-512 (~93 chars) — stronger but longer; not needed given Falcon-512 and our threat model.
- Encoding does not weaken the hash; Base56 just makes the bytes human-friendly. Internally, the full digest is used for HPK comparisons and UTXO/mempool lookups.

### Sample Base56 addresses by SHA3 variant (for illustration)
- SHA3-128 (~28 chars, not secure enough):  
  `APx9RkGm7TsY4WbZpQ2hNfJcD5Mv`
- SHA3-224 (~44 chars):  
  `AfxT7Pw9qGmVhzp8sETwYQkCm3NsdvJxrE2PzQ4sQJtW`
- SHA3-256 (~49 chars, balanced):  
  `AdwP5KxrVfTs8FGYkchLHt9RrS8zWpY7q9bZ2dkmwQ8J2VNxx`
- SHA3-384 (~71 chars, chosen):  
  `Akv4QGm29xWYPjvTFeqbrncHtWs2KyMa9R7fz8bHdpPx6LGrgxJt3WcPGykGsDRfpN8J`
- SHA3-512 (~93 chars, longer than needed):  
  `AhQwT7Lm9dKs3GyPVb4ZRnqSH8MtWcF2xE5JrUu9TwGmCqP7vXaLzRM8YtHfS6JpGkV3SdBtQwNnLkHcF9XsDpM`

## Where it’s used
- CLI address display, wallet exports, and transaction inputs.
- Node APIs that return or accept addresses.
- Internally, addresses map back to HPK for lookup in UTXO and mempool.

## Runtime normalization policy (performance)
- Base56 is treated as an edge-format (UI/API boundary).
- At entry points, addresses are normalized once to canonical HPK (`normalize_hpk`).
- Storage and transaction internals operate HPK-only for matching and indexing.
- Result: less repeated string conversion in hot loops (UTXO scans, send path, selection), with no consensus rule change.

