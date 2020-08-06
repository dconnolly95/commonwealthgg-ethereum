disableUI()

var farmContract = web3.eth.contract(contracts.farm.abi).at(contracts.farm.address);
var p3cContract = web3.eth.contract(contracts.p3c.abi).at(contracts.p3c.address);
var cropAbi = web3.eth.contract(contracts.crop.abi)

var myCropAddress;
var myCropTokens;
var myCropDividends;
var myCropDisabled;


function getMyCrop() {
    setTimeout(function () {if (web3.eth.accounts[0] === undefined) {alertify.error('Not connected to Commonwealth.')} else {alertify.success('Connected to Commonwealth.')}}, 1000)
    myCropAddress = web3.toChecksumAddress(web3.eth.accounts[0])
    activateUI(myCropAddress)
    getMySupplyPercentage()
}

function activateUI(cropAddress) {
    alertify.confirm().close();

    // Address and links 
    $("#copyAddressButton").attr("data-clipboard-text", cropAddress);
    $("#myCropAddress").replaceWith("<b id='myCropAddress' class='cropAddress'>" + myCropAddress + "</b>")
    
    $("#masternodeLink").replaceWith('<a id="masternodeLink" href="/dashboard.html?ref=' + myCropAddress + '">https://eth.commonwealth.gg/dashboard.html?ref=' + myCropAddress + '</a>')
    $("#copyMNButton").attr("data-clipboard-text", 'https://eth.commonwealth.gg/dashboard.html?ref=' + myCropAddress);
    
    $("#qrImage").replaceWith('<img src="https://chart.googleapis.com/chart?chs=350x350&amp;cht=qr&amp;chl=' + myCropAddress + '&amp;choe=UTF-8" class="rcAll" />');
    
    $("#blockscoutLink").replaceWith('<a id="blockscoutLink" target="_blank" class="btn btn-block btn-md btn-secondary rcAll" href="https://etherscan.io/address/'+ myCropAddress +'">Explore</a>');
    
    $('#connectionStatusIndicator').replaceWith('<div class="col text-white text-center"><h4><img src="assets/img/eth-logo-transparent.png" width="13px" height="20px" /> Connected to <b>Ethereum (ETH)</b></h4><br /></div>');
    
    // Enable buttons
    $('#buy').prop("disabled", false);
    $('#sell').prop("disabled", false);
    $('#reinvest').prop("disabled", false);
    $('#withdraw').prop("disabled", false);
    $('#transfer').prop("disabled", false);
    $('#warning').hide();
}

function disableUI() {
    $('#buy').prop("disabled", true);
    $('#sell').prop("disabled", true);
    $('#reinvest').prop("disabled", true);
    $('#withdraw').prop("disabled", true);
    $('#transfer').prop("disabled", true);
}

var myCropDividends = 0;
function getMyCropDividends() {
    p3cContract.myDividends.call(true, function (err, result) {
        if (!err) {
            change = (String(myCropDividends) !== String(result))
            myCropDividends = result;
            if (Number(myCropDividends) == 0){$("#myCropDividends").replaceWith("<b id='myCropDividends'>" + "0" + "</b>")}
            if (change) {
                amount = web3.fromWei(myCropDividends).toFixed(3)
                $("#myCropDividends").replaceWith("<b id='myCropDividends'>" + amount  + "</b>")
                $('#myCropDividends').transition({animation: 'flash', duration: '1s',});
            }
        }
    });
}

var myETHValue = 0
function getMyCropTokens() {
    p3cContract.myTokens.call(function (err, result) {
        if (!err) {
            change = (String(myCropTokens) !== String(result))
            myCropTokens = result;
            if (change) {
                $("#myCropTokens").replaceWith("<b id='myCropTokens'>" + numberWithCommas((web3.fromWei(myCropTokens)).toFixed(2)) + "</b>")
                
                p3cContract.sellPrice(function (e, r) {
                    let sellPrice = web3.fromWei(r)
                    myETHValue = (sellPrice * web3.fromWei(myCropTokens))
                    $('#myETHValue').text(numberWithCommas(myETHValue.toFixed(1)))
                })
                
                $('#myCropTokens').transition({animation: 'flash', duration: '1s',});
            }
        }
    });
}

var myPercentage = 0
function getMySupplyPercentage() {
    p3cContract.totalSupply.call(function (err, result) {
        if (!err) {
            let myPercentage = (myCropTokens / result) * 100
            let actualPercentage = (Math.round(Number(myPercentage) * 100) / 100).toFixed(2);
            $('#myPercentage').text(Number(actualPercentage))
        }
    })
}

getMyCrop()
function getCropInfo() {
    getMyCropTokens()
    getMyCropDividends()
}

// This buys eWLTH from the crop, but with you as the referrer
function buyFromCrop(amountToBuy, referrer) {
    amount = web3.toWei(amountToBuy)
    p3cContract.buy.sendTransaction(referrer, {from: web3.eth.accounts[0], value: amount}, function (error, result) { //get callback from function which is your transaction key
        if (!error) {alertify.success(amountToBuy + " ETH spent. Waiting for Blockchain.")} else {console.log(error);}
    })
}

// This buys eWLTH from the crop, but with you as the referrer
function sellFromCrop(amountToSell) {
    amount = web3.toWei(amountToSell)
    p3cContract.sell.sendTransaction(amount, {from: web3.eth.accounts[0]}, function (error, result) {
        if (!error) {
            alertify.success(amountToSell + " eWLTH Sold. Waiting for Blockchain.")
            console.log(result);
        } else {
            console.log(error);
        }
    })
}

function reinvestFromCrop(referrer) {
    p3cContract.reinvest.sendTransaction({from: web3.eth.accounts[0]}, function (error, result) {
        if (!error) {
            alertify.success("Reinvested eWLTH. Waiting for Blockchain.")
            console.log(result);
        } else {
            console.log(error);
        }
    })
}

function withdrawFromCrop() {p3cContract.withdraw.sendTransaction({from: web3.eth.accounts[0]}, function (error, result) {
    if (!error) {
        alertify.success("Withdrawing dividends to your ETH wallet.")
        console.log(result);
    } else {
        console.log(error);
    }
    })
}

function transferFromCrop(destination, amountToTransfer) {
    amount = web3.toWei(amountToTransfer)
    p3cContract.transfer.sendTransaction(destination, amount, {from: web3.eth.accounts[0]}, function (error, result) {
        // get callback from function which is your transaction key
        if (!error) {
            alertify.success("Transferring " + amountToTransfer + " eWLTH to " + destination.substring(0, 7) + "...")
            console.log(result);
        } else {
            console.log(error);
        }
    })
}