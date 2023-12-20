const cancelTx = async () => {
    require("dotenv").config();
    const { API_KEY, PRIVATE_KEY } = process.env;
    const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");

    const settings = {
        apiKey: API_KEY,
        network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);

    const walletInst = new Wallet(PRIVATE_KEY);
    const nonce = await alchemy.core.getTransactionCount(walletInst.address);

    const transaction = {
        gasLimit: "53000",
        maxPriorityFeePerGas: Utils.parseUnits("1", "gwei"),
        nonce: nonce,
        type: 2,
        chainId: 5,
    };

    const replacementTx = {
        gasLimit: "53000",
        maxPriorityFeePerGas: Utils.parseUnits("1.55", "gwei"),
        maxFeePerGas: Utils.parseUnits("1.8", "gwei"),
        nonce: nonce,
        type: 2,
        chainId: 5,
    };

    try {
        const signedTx = await walletInst.signTransaction(transaction);
        const signedReplacementTx =
            await walletInst.signTransaction(replacementTx);

        const txResult = await alchemy.core.sendTransaction(signedTx);
        const replacementTxResult =
            await alchemy.core.sendTransaction(replacementTx);

        console.log(
            "The hash of the transaction we are going to cancel is:",
            txResult.hash
        );
        console.log(
            "The hash of your replacement transaction is:",
            replacementTxResult.hash,
            "\n Check Alchemy's Mempool to view the status of your transactions!"
        );
    } catch (error) {
        console.log(
            "Something went wrong while submitting your transactions:",
            error
        );
    }
};

cancelTx();
