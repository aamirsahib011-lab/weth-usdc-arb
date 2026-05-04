require("dotenv").config();

const PROFIT_LIMIT = 30; // minimum profit
const LOAN_AMOUNT = 50000;

// MOCK PRICES (later real DEX se aayega)
async function getPrices() {
    let buyPrice = 1.00;   // Uniswap
    let sellPrice = 1.02;  // SushiSwap
    return { buyPrice, sellPrice };
}

// PROFIT CALCULATION
function calculateProfit(buyPrice, sellPrice) {

    let grossProfit = (sellPrice - buyPrice) * LOAN_AMOUNT;

    let flashLoanFee = 25;
    let dexFees = 300;
    let slippage = 50;
    let gas = 10;

    return grossProfit - flashLoanFee - dexFees - slippage - gas;
}

// EXECUTE TRADE
async function executeTrade(profit) {
    console.log("FLASH LOAN EXECUTING...");
    console.log("Profit:", profit);
    console.log("Transaction sent...");
}

// MAIN LOOP (1 sec check)
setInterval(async () => {

    let { buyPrice, sellPrice } = await getPrices();

    let profit = calculateProfit(buyPrice, sellPrice);

    console.log("Profit Check:", profit);

    if (profit >= PROFIT_LIMIT) {
        await executeTrade(profit);
    } else {
        console.log("SKIP");
    }

}, 1000);
