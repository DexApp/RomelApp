const base58 = require("bs58");

let slot_133102600 = '2apmAoEXndGaShcBFsNEHkmDt87DmXHBYwecQ11HUWEL'

let blockHash = base58.decode(slot_133102600)

let [lotteryNums, lastNums] = CalcNum(blockHash, 9, 10)

console.log("红包", lotteryNums.map(n => (n / 100).toFixed(2)).join(','));

let sumCheck = 0;
lotteryNums.forEach(n => {
    sumCheck += n;
})
console.log("红包合计", sumCheck / 100)

console.log("尾数", lastNums.join(','));


function CalcNum(blockHash, packs, amount) {

    amount = amount * 100;//保留两位小数

    let uint16Nums = new Array(packs);
    let lotteryNums = new Array(packs);
    let lastNums = new Array(packs);

    let sum = 0;
    for (let i = 0; i < packs * 2; i += 2) {
        uint16Nums[i / 2] = blockHash[i] + (blockHash[i + 1] << 8) + 1;
        sum += uint16Nums[i / 2];
    }

    let amountCheck = 0;

    for (let i = 0; i < packs; i++) {
        if (i + 1 < packs) {
            lotteryNums[i] = Math.floor((amount * uint16Nums[i]) / sum);
            if (lotteryNums[i] === 0) {//确保不为0,极特殊情况
                lotteryNums[i] = 1;
            }
        } else {
            if (amountCheck >= amount) {//最后一个数为之前之和差,确保之前数之和不大于总数,此情况极不可能出现
                for (let j = 0; j < packs - 1; j++) {//极不可能出现情况的预设处理
                    if (lotteryNums[j] > (amountCheck + 1) - amount) {
                        lotteryNums[j] = lotteryNums[j] - ((amountCheck + 1) - amount);
                        lotteryNums[i] = 1;
                        break;
                    }
                }
            } else {
                lotteryNums[i] = amount - amountCheck;
            }
        }
        amountCheck += lotteryNums[i];
        lastNums[i] = lotteryNums[i] % 10;
    }


    return [lotteryNums, lastNums]
}