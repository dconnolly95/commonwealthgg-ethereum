// if saturn isn't installed 
if (typeof web3 == 'undefined') {
    displayError(
        `
        <span>To Use, Install an <a target="_blank" href="https://www.youtube.com/watch?v=TUD-w5P_uAA&feature=youtu.be">ETH Wallet</a></span>
        `
    )
} else {
    getCropInfo()
    getRainMakerInfo()
    setInterval(function () {
        getCropInfo()
        getRainMakerInfo()
        setMarketCap()
    }, 2000);
}

masternode = localStorage.getItem("ref")
if (masternode == null) {
    masternode = "0x0000000000000000000000000000000000000000";
}

$("#buy").click(function () {
    amountToBuy = $("#buyInput").val()
    buyFromCrop(amountToBuy, masternode)
})

$("#sell").click(function () {
    amountToSell = $("#sellInput").val()
    sellFromCrop(amountToSell)
})

$("#withdraw").click(function () {
    withdrawFromCrop()
})

$("#reinvest").click(function () {
    reinvestFromCrop()
})

$("#transfer").click(function () {
    destination = $("#transferAddress").val()
    amountToTransfer = $("#transferTokenCount").val()
    if (web3.isAddress(destination) != true) {
        displayError('Invalid Address')
    }
    if (amountToTransfer > parseInt(web3.fromWei(myCropTokens))) {
        displayError('Not enough tokens.')
    } else {
        transferFromCrop(destination, amountToTransfer)
    }
})

$('#buyInput').on('input change', function () {
    var value = parseFloat($(this).val())
    if (value > 0) {
        buyAmount = numberWithCommas((value / buyPrice).toFixed(1))
        $('#buyAmount').text("Approx. " + buyAmount + " eWLTH")
    } else {
        $('#buyAmount').hide()
    }
})

$('#sellInput').on('input change', function () {
    var value = parseFloat($(this).val())
    if (value > 0) {
        sellAmount = numberWithCommas((value * sellPrice).toFixed(2))
        $('#sellAmount').text("Approx. " + sellAmount + " ETH")
    } else {
        $('#sellAmount').hide()
    }
})

$('#buyAmount').hide();
$('#sellAmount').hide();

$('#buyInput').on('keyup change', function () {
    if (this.value.length > 0) {
        $('#buyAmount').show();
    }
});

$('#sellInput').on('keyup change', function () {
    if (this.value.length > 0) {
        $('#sellAmount').show();
    }
});

var amount;
function setMarketCap(){
    p3cContract.totalEthereumBalance.call(function (err, result) {
        if (!err) {
            amount = web3.fromWei(result).toFixed(0)
            $("#etcInContract").replaceWith(numberWithCommas(amount) + " ETH")
        }
    })
}

var sellPrice;
function setSellPrice() {
    p3cContract.sellPrice(function (e, r) {
        sellPrice = web3.fromWei(r)
        $('#tokenSellGet').text(sellPrice.toFixed(4) + ' ETH')
    })
}
setSellPrice()

var buyPrice;
function setBuyPrice() {
    p3cContract.buyPrice(function (e, r) {
        buyPrice = web3.fromWei(r)
        $('#tokenBuyGet').text(buyPrice.toFixed(4) + ' ETH')
    })
}
setBuyPrice()

function copyAddress() {
    var copyText = document.getElementById("myCropAddress");
    copyText.select();
    document.execCommand("copy");
}

new ClipboardJS('.copybutton');
$('.copybutton').on('click', function (){
  alertify.success('Copied', 2)
})

new ClipboardJS('.copyAddressButton');
$('.copyAddressButton').on('click', function() {
    alertify.success('Copied Address', 2)
});

new ClipboardJS('.copyLinkButton');
$('.copyLinkButton').on('click', function() {
    alertify.success('Copied Link', 2)
});

function setPortfolio(cropAddress) {
    $.getJSON("https://api.commonwealth.gg/price/crop/" + web3.toChecksumAddress(cropAddress), function (data) {
        if (data !== null){
            // (New Number - Original Number) ÷ Original Number × 100.
            $('#portfolioButton').show();
            performance = `
            My account performance (in USD):
            <br>
            <b>Change 1 Day</b>: {usd1}
            <br>
            <b>Change 7 Days</b>: {usd7}
            <br>
            <b>Change 30 Days</b>: {usd30}
            <br>
            <span class="ui text small eleven converted">Past growth is no guarantee of future results.</span>
            `
            $.each(data, function (key, val) {
                if (key.includes('usd')) {
                    change = (((myUSDValue - val) / val) * 100).toFixed(0)
                } else {
                    change = (((myETHValue - val) / val) * 100).toFixed(1)
                    change = String(change).replace('0.', '.')
                }
                color = (change >= 0) ? "green" : "red"
                // TODO does this make sense?
                // if (key == "usd1"){
                //     $("#myDayChange").html("<span class='text small eleven'>  " + change + "%</span>")
                //     $("#myDayChange").css("color", color)
                // }
                performance = performance.replace('{' + key + '}', '<span class="' + color + '">' + change + '%</span>')
                if (color == "red" && key == 'usd7' && Math.abs(Number(change)) != 100){
                    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'BalanceDown','value': Number(change)});};
                    alertify.error('<h3>Balance: <u>' + change + '</u>% down in last 7 days.</h3>',5)
                }

                if (color == "green" && key == 'usd7' && Number(change) != 100){
                    if (typeof gtag !== 'undefined'){gtag('event', 'Wallet', {'event_label': 'Usage', 'event_category': 'BalanceUp','value': Number(change)});};
                    alertify.success('<h3>Balance: <u>' + change + '</u>% up in last 7 days.</h3>',7)
                }
            });
            $('#portfolioButton').popup({
                html: performance,
                position: 'right center'
            });
        }
    });
}