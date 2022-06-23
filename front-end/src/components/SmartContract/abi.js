export const RealEstateAbi = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "PropertyID",
          type: "uint256",
        },
      ],
      name: "_Accepted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "PropertyID",
          type: "uint256",
        },
      ],
      name: "_Declined",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "PropertyID",
          type: "uint256",
        },
      ],
      name: "_Pending",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "PropertyID",
          type: "uint256",
        },
      ],
      name: "_Sold",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "_Owner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "Price",
          type: "uint256",
        },
      ],
      name: "_addProperty",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "PropertyID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "Owner",
          type: "address",
        },
      ],
      name: "_ownershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "PropertyID",
          type: "uint256",
        },
      ],
      name: "_request",
      type: "event",
    },
    {
      stateMutability: "payable",
      type: "fallback",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_PropertyID",
          type: "uint256",
        },
      ],
      name: "AcceptBuyerRequest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_PropertyID",
          type: "uint256",
        },
      ],
      name: "AcceptSellerRequest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "AcceptedForSell",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "AcceptedforBuy",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_PropertyID",
          type: "uint256",
        },
      ],
      name: "BuyProperty",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_Owner",
          type: "address",
        },
      ],
      name: "ChangeOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_PropertyID",
          type: "uint256",
        },
      ],
      name: "DeclineBuyerRequest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_PropertyID",
          type: "uint256",
        },
      ],
      name: "DeclineSellerRequest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "DeclinedForSell",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "DeclinedforBuy",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "GreaterThanTotalRegistryAuthorityApprovals",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "Owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "OwnerFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "PendingForSell",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "PendingforBuy",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PropertyID",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "PurchasedDate",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "Sold",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_Price",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_FullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "_Address",
          type: "string",
        },
        {
          internalType: "string",
          name: "_Phone",
          type: "string",
        },
        {
          internalType: "string",
          name: "_PropertyName",
          type: "string",
        },
        {
          internalType: "string",
          name: "_PropertyType",
          type: "string",
        },
        {
          internalType: "string",
          name: "_PropertyAddress",
          type: "string",
        },
        {
          internalType: "string",
          name: "_AdditionalInformation",
          type: "string",
        },
      ],
      name: "addProperty",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
      ],
      name: "addRegistryAuthority",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "buyerRequestInformation",
      outputs: [
        {
          internalType: "uint256",
          name: "propertyID",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "FullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "Address",
          type: "string",
        },
        {
          internalType: "string",
          name: "Phone",
          type: "string",
        },
        {
          internalType: "address",
          name: "CurrentOwner",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "getUserAllPurchasedPropertiesIDs",
      outputs: [
        {
          internalType: "uint256[]",
          name: "_IDs",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "getUserAllpropertiesIDs",
      outputs: [
        {
          internalType: "uint256[]",
          name: "_IDs",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_PropertyID",
          type: "uint256",
        },
      ],
      name: "isAcceptedForSell",
      outputs: [
        {
          internalType: "bool[]",
          name: "_AcceptedForSell",
          type: "bool[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_PropertyID",
          type: "uint256",
        },
      ],
      name: "isAcceptedforBuy",
      outputs: [
        {
          internalType: "bool[]",
          name: "_AcceptedForSell",
          type: "bool[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "isRegistryAuthority",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "isRegistryAuthorityAcceptedForSell",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "isRegistryAuthorityAcceptedforBuy",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "isRegistryAuthorityDeclinedForSell",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "isRegistryAuthorityDeclinedforBuy",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "previousOwner",
      outputs: [
        {
          internalType: "uint256",
          name: "propertyID",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "FullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "Address",
          type: "string",
        },
        {
          internalType: "string",
          name: "Phone",
          type: "string",
        },
        {
          internalType: "address",
          name: "CurrentOwner",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "properties",
      outputs: [
        {
          internalType: "uint256",
          name: "propertyID",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "Price",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "FullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "Address",
          type: "string",
        },
        {
          internalType: "string",
          name: "Phone",
          type: "string",
        },
        {
          internalType: "address",
          name: "CurrentOwner",
          type: "address",
        },
        {
          internalType: "string",
          name: "PropertyName",
          type: "string",
        },
        {
          internalType: "string",
          name: "PropertyType",
          type: "string",
        },
        {
          internalType: "string",
          name: "PropertyAddress",
          type: "string",
        },
        {
          internalType: "string",
          name: "AdditionalInformation",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "registryAuthority",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "requestForBuyDate",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "requestForBuyDateIFAccepted",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_PropertyID",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_FullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "_Address",
          type: "string",
        },
        {
          internalType: "string",
          name: "_Phone",
          type: "string",
        },
        {
          internalType: "string",
          name: "_Date",
          type: "string",
        },
        {
          internalType: "string",
          name: "_DateIFAccepted",
          type: "string",
        },
      ],
      name: "requestForBuyProperty",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "totalRegistryAuthorityapprovals",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_OwnerFee",
          type: "uint256",
        },
      ],
      name: "updateOwnerFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "userAllPropertiesIDs",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "userAllPurchasedPropertiesIDs",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "yourRequestIsAccepted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ];