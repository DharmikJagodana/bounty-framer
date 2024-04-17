# Bounty Framer for Warpcast Frame

This project implements a Bounty Framer for the Warpcast Frame, facilitating daily token giveaways based on user eligibility criteria.

## Features

1. **Follow and Recast Verification**:
   - Users must follow the specified project account and recast the given frame to enter the giveaway.
   - If not followed and recast, users are prompted with instructions to do so.

2. **Daily Allocation Check**:
   - Each user has a fixed daily allocation of tokens.
   - Users can only redeem tokens once every 24 hours.
   - If the user has already redeemed their allocation for the day, they are informed to return in 24 hours.

3. **Wallet Connectivity**:
   - The system verifies if the user has a connected wallet.
   - If not connected, users are prompted to set up a wallet.

4. **Token Distribution**:
   - Tokens are sent from a treasury wallet to the user's connected wallet.
   - The token contract address used in the program is [0x07Bf8Dbb8eF2d42035b99003634Bc1aA809C52D1](https://base-sepolia.blockscout.com/address/0x07Bf8Dbb8eF2d42035b99003634Bc1aA809C52D1).

## Prerequisites

Before you begin, ensure you have the following installed and set up:

- Node.js (version >= 12)
- Yarn package manager
- MongoDB (or access to a MongoDB database, such as MongoDB Atlas)
- Ethereum wallet with the private key for token distribution

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DharmikJagodana/bounty-framer.git
cd bounty-framer
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Set Environment Variables

Create a .env file in the root directory of the project and add the following environment variables:

```plaintext
NEXT_PUBLIC_HOST=example.com
PRIVATE_KEY=0x123456789abcdef...
CONTRACT_ADDRESS=0x07Bf8Dbb8eF2d42035b99003634Bc1aA809C52D1
DATABASE_URL=mongodb+srv://username:password@clustername.mongodb.net/dbname
```

### 4. Start the Server

```bash
yarn start
```

The server will start and listen for incoming connections.

### Usage

Once the server is running, users can interact with the Bounty Framer as follows

1. Access the hosted application at <http://example.com>.
2. Share the URL <http://example.com> with Farcaster or testing frame app to see it live or test it.

### Contributing

Contributions are welcome! If you encounter any issues or have suggestions, feel free to open an issue or submit a pull request.
