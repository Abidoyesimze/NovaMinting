const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Deploying NovaMint ecosystem to Somnia Shannon Testnet...");
  console.log("🆔 Deploying with account:", deployer.address);

  // ✅ ethers v6: get balance via provider
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    console.log("❌ Insufficient balance for deployment. Please fund your account.");
    return;
  }

  // Deploy NovaMint contract
  console.log("📦 Deploying NovaMint contract...");
  const NovaMint = await hre.ethers.deployContract("NovaMint", ["NovaMint", "NMNT"]);
  await NovaMint.waitForDeployment();

  const contractAddress = await NovaMint.getAddress();
  console.log("✅ NovaMint Contract Deployed at:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    network: "somniaTestnet",
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    transactionHash: NovaMint.deploymentTransaction().hash
  };

  console.log("📋 Deployment Details:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🔍 To verify the contract, run:");
  console.log(`npx hardhat verify --network somniaTestnet ${contractAddress} "NovaMint" "NMNT"`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
