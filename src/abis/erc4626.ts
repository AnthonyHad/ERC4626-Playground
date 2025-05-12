export const vaultMinimalAbi = [
  // 📛 Metadata
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },

  // 📦 Vault Stats
  {
    name: "totalAssets",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "isShutdown",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },

  // 🔁 Conversion functions
  {
    name: "convertToShares",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "assets", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "convertToAssets",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "shares", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },

  // 🧠 Strategy info
  {
    name: "strategies",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "strategy", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "activation", type: "uint256" },
          { name: "last_report", type: "uint256" },
          { name: "current_debt", type: "uint256" },
          { name: "max_debt", type: "uint256" },
        ],
      },
    ],
  },
];
