require("dotenv").config();
const { ethers } = require("ethers");

// ================= CONFIG =================
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Tokens (Polygon)
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

// DEX Routers
const ROUTER_A = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"; // QuickSwap
const ROUTER_B = "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506"; // SushiSwap

// Loan Range (your request)
const MIN_LOAN = 5000;
const MAX_LOAN = 25000;

// Profit settings
const MIN_PROFIT_USD = 30;

// ABI
const routerABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory)"
];

// ================= HELPERS =================
async function getPrice(routerAddr, amountIn) {
  const router = new ethers.Contract(routerAddr, routerABI, provider);
  const path = [USDC, WETH];

  try {
    const out = await router.getAmountsOut(amountIn, path);
    return out[1];
  } catch (e) {
    return null;
  }
}

// ================= BOT LOOP =================
setInterval(async () => {

  // choose test loan (start safe)
  const loanAmount = ethers.parseUnits(MIN_LOAN.toString(), 6);

  const priceA = await getPrice(ROUTER_A, loanAmount);
  const priceB = await getPrice(ROUTER_B, loanAmount);

  if (!priceA || !priceB) {
    console.log("❌ Price fetch failed");
    return;
  }

  const diff = Number(priceA - priceB) / 1e18;

  // fees estimation
  const gasFee = 5;
  const swapFee = 0.3;

  const netProfit = diff - gasFee - swapFee;

  console.log("==================================");
  console.log("Loan:", MIN_LOAN, "-", MAX_LOAN);
  console.log("QuickSwap:", priceA.toString());
  console.log("SushiSwap:", priceB.toString());
  console.log("Net Profit Est:", netProfit);

  // ================= TRADE LOGIC =================
  if (netProfit >= MIN_PROFIT_USD) {

    console.log("🚀 PROFITABLE OPPORTUNITY FOUND!");

    // choose loan size dynamically
    let loanToUse;

    if (netProfit > 100) {
      loanToUse = MAX_LOAN;
    } else {
      loanToUse = MIN_LOAN;
    }

    console.log("💰 Loan Selected:", loanToUse);

    // HERE: smart contract call will go later
    console.log("👉 CALL SMART CONTRACT EXECUTION");

  } else {
    console.log("❌ NO PROFIT - SKIPPING");
  }

}, 3000);
