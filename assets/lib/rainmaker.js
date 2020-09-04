var rainMaker = web3.eth.contract(contracts.rainMaker.abi).at(contracts.rainMaker.address);
var divies = web3.eth.contract(contracts.divies.abi).at(contracts.divies.address);

function getRainMakerInfo() {
    rainMaker.myDividends.call(function (err, result) {
        divs = parseFloat(web3.fromWei(result.toNumber()))
        $("#rainMakerDividends").html(divs.toFixed(3));
    });
    
    rainMaker.myTokens.call(function (err, result) {
        tokens = parseFloat(web3.fromWei(result.toNumber())).toFixed(1)
        $("#rainMakerTokens").html(numberWithCommas(tokens));
    });

    divies.balances.call(function (err, result) {
        balance = parseFloat(web3.fromWei(result.toNumber()))
        $("#diviesBalance").html(balance.toFixed(3));
    });
}

$("#rainMaker").click(function () {
    rainMaker.makeItRain.sendTransaction(
        {
            from: web3.eth.accounts[0]
        },
        function (error, result) {
            if (!error) {
                console.log(result);
                alertify.success("Activating Rainmaker.")
            } else {
                console.log(error);
            }
        })
})

$("#distribute").click(function () {
    divies.distribute.sendTransaction({
        from: web3.eth.accounts[0]
    }, function (error, result) {
        if (!error) {
            alertify.success("Distributing Divies.")
            console.log(result);
        } else {
            console.log(error);
        }
    })
})