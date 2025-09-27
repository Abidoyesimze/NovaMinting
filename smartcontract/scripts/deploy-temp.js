const hre = require("hardhat");

async function main() {
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();

    console.log("🚀 Deploying NovaMint to Somnia Shannon Testnet...");
    console.log("🆔 Deploying with account:", deployer.address);

    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

    if (balance === 0n) {
        console.log("❌ Insufficient balance for deployment.");
        console.log("💡 Please fund your account with SOM tokens from: https://faucet.somnia.network/");
        return;
    }

    // Deploy NovaMint contract
    console.log("📦 Deploying NovaMint contract...");
    const NovaMint = await hre.ethers.deployContract("NovaMint", ["NovaMint", "NMNT"]);
    await NovaMint.waitForDeployment();

    const contractAddress = await NovaMint.getAddress();
    console.log("✅ NovaMint Contract Deployed at:", contractAddress);

    // Get deployment transaction details
    const deploymentTx = NovaMint.deploymentTransaction();
    console.log("📋 Transaction Hash:", deploymentTx.hash);

    console.log("\n🔍 To verify the contract, run:");
    console.log(`npx hardhat verify --network somniaTestnet ${contractAddress} "NovaMint" "NMNT"`);

    console.log("\n📄 Contract Details:");
    console.log("- Name: NovaMint");
    console.log("- Symbol: NMNT");
    console.log("- Platform Treasury: 0x8a371e00cd51E2BE005B86EF73C5Ee9Ef6d23FeB");
    console.log("- Royalty: 10% total (9% creator, 1% platform)");
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});
