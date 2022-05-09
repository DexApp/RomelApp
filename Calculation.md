## 本项目红包随机及不可预测性原理:
- 红包采用两步方式打开,打开第一步所在区块的哈希值做为红包的随数,区块的哈希不可预测,不可修改.
- 第二步是从链上拿到第一步所在区块的哈希值,进行计算,开出红包.算法公开可验证.

## 本项目红包计算方式
核心计算代码:js版本:
```js

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
```
> 以主链上的solt 133102600为例,其区块的哈希值为: 2apmAoEXndGaShcBFsNEHkmDt87DmXHBYwecQ11HUWEL 
>
> 以红包为10USDT,分成9个包,经计算得出
> 
> 9个红包分别为 0.91,1.04,1.42,1.53,1.37,0.49,1.75,0.12,1.37 红包合计10
> 
> 尾数分别为 1,4,2,3,7,9,5,2,7
>
> 完整代码在当前目录的[Calculation.js](Calculation.js),请使用nodejs运行
> 



