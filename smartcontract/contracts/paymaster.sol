// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

interface INFTContract {
    function buy(uint256 tokenId) external payable;

    function ownerOf(uint256 tokenId) external view returns (address);

    function tokenPrices(uint256 tokenId) external view returns (uint256);
}



/**
 * @title UniversalPaymaster
 * @dev Standalone paymaster contract that can sponsor gas fees for any compatible NFT contract
`  */
contract UniversalPaymaster is Ownable, ReentrancyGuard, EIP712 {
    using ECDSA for bytes32;

    // Paymaster settings
    uint256 public paymasterBalance;
    mapping(address => uint256) public userNonces;
    mapping(address => bool) public authorizedContracts;
    mapping(address => bool) public authorizedExecutors;

    // Gas fee settings
    uint256 public maxGasPrice = 50 gwei;
    uint256 public maxGasLimit = 500000;
    uint256 public minTransactionValue = 0.001 ether; // Minimum transaction value to sponsor
    uint256 public maxTransactionValue = 10 ether; // Maximum transaction value to sponsor

    // Rate limiting
    mapping(address => uint256) public lastTransactionTime;
    uint256 public minTimeBetweenTransactions = 60; // seconds
    mapping(address => uint256) public dailyTransactionCount;
    mapping(address => uint256) public lastResetDay;
    uint256 public maxDailyTransactions = 10;

    // Events
    event PaymasterFunded(address indexed funder, uint256 amount);
    event PaymasterWithdrawal(address indexed recipient, uint256 amount);
    event GaslessTransactionExecuted(
        address indexed user,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 gasUsed,
        uint256 gasCost,
        bytes32 txHash
    );
    event ContractAuthorized(address indexed nftContract, bool authorized);
    event ExecutorAuthorized(address indexed executor, bool authorized);
    event ConfigUpdated(string parameter, uint256 oldValue, uint256 newValue);

    // Struct for gasless NFT purchases
    struct GaslessNFTPurchase {
        address user;
        address nftContract;
        uint256 tokenId;
        uint256 expectedPrice;
        uint256 nonce;
        uint256 gasPrice;
        uint256 gasLimit;
        uint256 deadline;
    }

    // EIP-712 type hash
    bytes32 private constant GASLESS_NFT_PURCHASE_TYPEHASH =
        keccak256(
            "GaslessNFTPurchase(address user,address nftContract,uint256 tokenId,uint256 expectedPrice,uint256 nonce,uint256 gasPrice,uint256 gasLimit,uint256 deadline)"
        );

    constructor() EIP712("UniversalPaymaster", "1") Ownable(msg.sender) {
        authorizedExecutors[msg.sender] = true;
    }

    modifier onlyAuthorizedExecutor() {
        require(authorizedExecutors[msg.sender], "Not authorized executor");
        _;
    }

    modifier rateLimited(address user) {
        // Check time-based rate limiting
        require(
            block.timestamp >=
                lastTransactionTime[user] + minTimeBetweenTransactions,
            "Transaction too frequent"
        );

        // Check daily transaction limit
        uint256 currentDay = block.timestamp / 86400; // seconds in a day
        if (lastResetDay[user] != currentDay) {
            dailyTransactionCount[user] = 0;
            lastResetDay[user] = currentDay;
        }
        require(
            dailyTransactionCount[user] < maxDailyTransactions,
            "Daily transaction limit exceeded"
        );

        // Update tracking
        lastTransactionTime[user] = block.timestamp;
        dailyTransactionCount[user]++;
        _;
    }

    /**
     * @dev Execute gasless NFT purchase
     * @param purchase The gasless purchase struct
     * @param signature The user's signature
     */
    function executeGaslessNFTPurchase(
        GaslessNFTPurchase calldata purchase,
        bytes calldata signature
    )
        external
        payable
        onlyAuthorizedExecutor
        rateLimited(purchase.user)
        nonReentrant
    {
        // Validate transaction
        require(block.timestamp <= purchase.deadline, "Transaction expired");
        require(purchase.gasPrice <= maxGasPrice, "Gas price too high");
        require(purchase.gasLimit <= maxGasLimit, "Gas limit too high");
        require(purchase.nonce == userNonces[purchase.user], "Invalid nonce");
        require(
            authorizedContracts[purchase.nftContract],
            "Contract not authorized"
        );
        require(
            purchase.expectedPrice >= minTransactionValue &&
                purchase.expectedPrice <= maxTransactionValue,
            "Transaction value out of range"
        );

        // Verify signature
        bytes32 structHash = keccak256(
            abi.encode(
                GASLESS_NFT_PURCHASE_TYPEHASH,
                purchase.user,
                purchase.nftContract,
                purchase.tokenId,
                purchase.expectedPrice,
                purchase.nonce,
                purchase.gasPrice,
                purchase.gasLimit,
                purchase.deadline
            )
        );
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = hash.recover(signature);
        require(signer == purchase.user, "Invalid signature");

        // Verify the transaction details with the NFT contract
        INFTContract nftContract = INFTContract(purchase.nftContract);
        uint256 actualPrice = nftContract.tokenPrices(purchase.tokenId);
        require(actualPrice == purchase.expectedPrice, "Price mismatch");
        require(msg.value == actualPrice, "Incorrect ETH sent");

        // Record gas at start
        uint256 gasStart = gasleft();

        // Execute the NFT purchase
        nftContract.buy{value: msg.value}(purchase.tokenId);

        // Calculate gas used and cost
        uint256 gasUsed = gasStart - gasleft() + 21000; // Add base transaction cost
        uint256 gasCost = gasUsed * purchase.gasPrice;

        // Deduct gas cost from paymaster balance
        require(paymasterBalance >= gasCost, "Insufficient paymaster balance");
        paymasterBalance -= gasCost;

        // Increment user nonce
        userNonces[purchase.user]++;

        emit GaslessTransactionExecuted(
            purchase.user,
            purchase.nftContract,
            purchase.tokenId,
            gasUsed,
            gasCost,
            hash
        );
    }

    /**
     * @dev Execute a batch of gasless transactions
     */
    function executeBatchGaslessNFTPurchases(
        GaslessNFTPurchase[] calldata purchases,
        bytes[] calldata signatures
    ) external payable onlyAuthorizedExecutor nonReentrant {
        require(purchases.length == signatures.length, "Array length mismatch");
        require(purchases.length <= 10, "Too many transactions in batch");

        uint256 totalValue = 0;
        for (uint i = 0; i < purchases.length; i++) {
            totalValue += purchases[i].expectedPrice;
        }
        require(msg.value == totalValue, "Incorrect total ETH sent");

        uint256 valueOffset = 0;
        for (uint i = 0; i < purchases.length; i++) {
            // Create a single-item call to avoid rate limiting issues in batch
            GaslessNFTPurchase memory purchase = purchases[i];
            bytes memory signature = signatures[i];

            // Forward the appropriate amount of ETH for this purchase
            uint256 purchaseValue = purchase.expectedPrice;

            // Use call to forward specific amount
            (bool success, ) = address(this).call{value: purchaseValue}(
                abi.encodeWithSignature(
                    "executeGaslessNFTPurchase((address,address,uint256,uint256,uint256,uint256,uint256,uint256),bytes)",
                    purchase,
                    signature
                )
            );
            require(success, "Batch transaction failed");

            valueOffset += purchaseValue;
        }
    }

    // PAYMASTER MANAGEMENT FUNCTIONS

    /**
     * @dev Fund the paymaster balance
     */
    function fundPaymaster() external payable {
        require(msg.value > 0, "Must send ETH to fund");
        paymasterBalance += msg.value;
        emit PaymasterFunded(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw from paymaster balance (only owner)
     */
    function withdrawPaymasterBalance(uint256 amount) external onlyOwner {
        require(amount <= paymasterBalance, "Insufficient balance");
        paymasterBalance -= amount;
        payable(owner()).transfer(amount);
        emit PaymasterWithdrawal(owner(), amount);
    }

    /**
     * @dev Emergency withdraw all funds
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        payable(owner()).transfer(contractBalance);
        paymasterBalance = 0;
        emit PaymasterWithdrawal(owner(), contractBalance);
    }

    // AUTHORIZATION FUNCTIONS

    /**
     * @dev Authorize/deauthorize NFT contracts
     */
    function setContractAuthorization(
        address nftContract,
        bool authorized
    ) external onlyOwner {
        authorizedContracts[nftContract] = authorized;
        emit ContractAuthorized(nftContract, authorized);
    }

    /**
     * @dev Authorize/deauthorize executors
     */
    function setExecutorAuthorization(
        address executor,
        bool authorized
    ) external onlyOwner {
        authorizedExecutors[executor] = authorized;
        emit ExecutorAuthorized(executor, authorized);
    }

    /**
     * @dev Batch authorize contracts
     */
    function batchSetContractAuthorization(
        address[] calldata nftContracts,
        bool[] calldata authorizations
    ) external onlyOwner {
        require(
            nftContracts.length == authorizations.length,
            "Array length mismatch"
        );
        for (uint i = 0; i < nftContracts.length; i++) {
            authorizedContracts[nftContracts[i]] = authorizations[i];
            emit ContractAuthorized(nftContracts[i], authorizations[i]);
        }
    }

    // CONFIGURATION FUNCTIONS

    /**
     * @dev Update gas limits
     */
    function updateGasLimits(
        uint256 newMaxGasPrice,
        uint256 newMaxGasLimit
    ) external onlyOwner {
        emit ConfigUpdated("maxGasPrice", maxGasPrice, newMaxGasPrice);
        emit ConfigUpdated("maxGasLimit", maxGasLimit, newMaxGasLimit);
        maxGasPrice = newMaxGasPrice;
        maxGasLimit = newMaxGasLimit;
    }

    /**
     * @dev Update transaction value limits
     */
    function updateTransactionValueLimits(
        uint256 newMinValue,
        uint256 newMaxValue
    ) external onlyOwner {
        require(newMinValue < newMaxValue, "Invalid range");
        emit ConfigUpdated(
            "minTransactionValue",
            minTransactionValue,
            newMinValue
        );
        emit ConfigUpdated(
            "maxTransactionValue",
            maxTransactionValue,
            newMaxValue
        );
        minTransactionValue = newMinValue;
        maxTransactionValue = newMaxValue;
    }

    /**
     * @dev Update rate limiting parameters
     */
    function updateRateLimits(
        uint256 newMinTimeBetween,
        uint256 newMaxDailyTransactions
    ) external onlyOwner {
        emit ConfigUpdated(
            "minTimeBetweenTransactions",
            minTimeBetweenTransactions,
            newMinTimeBetween
        );
        emit ConfigUpdated(
            "maxDailyTransactions",
            maxDailyTransactions,
            newMaxDailyTransactions
        );
        minTimeBetweenTransactions = newMinTimeBetween;
        maxDailyTransactions = newMaxDailyTransactions;
    }

    // VIEW FUNCTIONS

    /**
     * @dev Get user's current nonce
     */
    function getUserNonce(address user) external view returns (uint256) {
        return userNonces[user];
    }

    /**
     * @dev Get paymaster balance
     */
    function getPaymasterBalance() external view returns (uint256) {
        return paymasterBalance;
    }

    /**
     * @dev Estimate gas cost for a transaction
     */
    function estimateGasCost(
        uint256 gasPrice,
        uint256 gasLimit
    ) external pure returns (uint256) {
        return (gasLimit + 21000) * gasPrice;
    }

    /**
     * @dev Check if user can make a transaction (rate limiting)
     */
    function canUserTransact(
        address user
    ) external view returns (bool, string memory) {
        // Check time-based rate limiting
        if (
            block.timestamp <
            lastTransactionTime[user] + minTimeBetweenTransactions
        ) {
            return (false, "Too frequent");
        }

        // Check daily limit
        uint256 currentDay = block.timestamp / 86400;
        uint256 userLastResetDay = lastResetDay[user];
        uint256 userDailyCount = dailyTransactionCount[user];

        if (
            userLastResetDay == currentDay &&
            userDailyCount >= maxDailyTransactions
        ) {
            return (false, "Daily limit exceeded");
        }

        return (true, "");
    }

    /**
     * @dev Get user's transaction stats
     */
    function getUserStats(
        address user
    )
        external
        view
        returns (
            uint256 nonce,
            uint256 lastTxTime,
            uint256 dailyCount,
            uint256 lastReset
        )
    {
        return (
            userNonces[user],
            lastTransactionTime[user],
            dailyTransactionCount[user],
            lastResetDay[user]
        );
    }

    /**
     * @dev Generate transaction hash for signing
     */
    function getTransactionHash(
        GaslessNFTPurchase calldata purchase
    ) external view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                GASLESS_NFT_PURCHASE_TYPEHASH,
                purchase.user,
                purchase.nftContract,
                purchase.tokenId,
                purchase.expectedPrice,
                purchase.nonce,
                purchase.gasPrice,
                purchase.gasLimit,
                purchase.deadline
            )
        );
        return _hashTypedDataV4(structHash);
    }

    /**
     * @dev Check if contract and executor are authorized
     */
    function isAuthorized(
        address nftContract,
        address executor
    ) external view returns (bool, bool) {
        return (
            authorizedContracts[nftContract],
            authorizedExecutors[executor]
        );
    }

    // Receive function to accept ETH
    receive() external payable {
        paymasterBalance += msg.value;
        emit PaymasterFunded(msg.sender, msg.value);
    }
}
