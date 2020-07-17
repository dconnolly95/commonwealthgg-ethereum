var wrappedEtherABI = [{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"unwrapEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"wrapEther","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"wrapper","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Wrapped","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"unwrapper","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Unwrapped","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"_balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalEtherUnwrapped","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalEtherWrapped","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

var wrappedEtherAddress = '0xec89f7BdF4E3f4484e7ed4A965c9923AACf726C7';
var wrappedEtherContract = web3.eth.contract(wrappedEtherABI).at(wrappedEtherAddress);
var decimals = 18;

$(function () {
    if (typeof(web3) === "undefined") {
        error("Unable to find web3. Please run MetaMask (or something else that injects web3).");
    } else {
        console.log("Found injected web3.");
        web3 = new Web3(web3.currentProvider);
      
        console.log("Connected to network.");
        if (web3.eth.defaultAccount === undefined) {
            error("No accounts found. If you're using MetaMask, please unlock it first.");
        } else {
            initialize();
        }
        var initialAccount = web3.eth.defaultAccount;
        window.setInterval(function () {
            if (web3.eth.defaultAccount !== initialAccount) {
                window.location.reload();
            }
        }, 500);
    }
});

function initialize() {
    web3.eth.getBlockNumber(function (err, lastSeenBlock) {
        loadData(lastSeenBlock);
        function changeHandler(err, data) {
            if (err) return error(err);
            if (data.blockNumber > lastSeenBlock) {
                lastSeenBlock = data.blockNumber;
                loadData(lastSeenBlock);
            }
        }
          
        wrappedEtherContract.Wrapped(changeHandler); // The Wrapped event tells us when the number of wrapped ETH changes.
        wrappedEtherContract.Unwrapped(changeHandler); // The Unrapped event tells us when the number of wrapped ETH changes.
    });
}

$('#wrapEtherForm').submit(function (e) {
    e.preventDefault();
    var _etherToWrapPlainVal = $('#etherToWrap').val();
    var _etherToWrap = web3.toWei($('#etherToWrap').val());
    wrappedEtherContract.wrapEther.sendTransaction({value: _etherToWrap,}, function () {
        alertify.success(_etherToWrapPlainVal + ' ETH wrapping...')
    });
});

$('#unwrapEtherForm').submit(function (e) {
    e.preventDefault();
    var _etherToUnwrapPlainVal = $('#etherToUnwrap').val();
    var _etherToUnwrap = web3.toWei($('#etherToUnwrap').val());
    wrappedEtherContract.unwrapEther.sendTransaction(_etherToUnwrap, {}, function () {
        alertify.success(_etherToUnwrapPlainVal + ' FWETH unwrapping...')
    });
});

$('#transferFWETHForm').submit(function (e) {
    e.preventDefault();
    var _fwetcToTransferPlainVal = $('#tokenQuantity').val();
    var _recipientAddr = $('#tokenReceiver').val();
    wrappedEtherContract.transfer.sendTransaction(_recipientAddr, _fwetcToTransferPlainVal, {}, function () {
        alertify.success(_fwetcToTransferPlainVal + ' FWETH Transferring to ' + _recipientAddr + ' - Waiting for Blockchain...')
    });
})

function log(message) {
    $('#log').append($('<p>').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
}

function error(message) {
    $('#log').append($('<p>').addClass('dark-red').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
}

function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
        if (err) {error(err);}
        if (receipt !== null) {
            if (cb) {cb(receipt);}
        } else {
            window.setTimeout(function () {
                waitForReceipt(hash, cb);
            }, 1000);
        }
    });
}

function loadData(blockNumber) {
    console.log("Loading data from contracts...")

    var currentSupply, wrappedEther, unwrappedEther;

    // Callback that waits for all three pieces of data before proceeding
    function updateWhenDone() {
        if (currentSupply !== undefined && wrappedEther !== undefined && unwrappedEther !== undefined) {
            console.log("There is " + web3.fromWei(currentSupply) + " ETH wrapped at present.");
            console.log(web3.fromWei(wrappedEther) + " ETH has been wrapped during the lifetime of this contract.");
            console.log(web3.fromWei(unwrappedEther) + " ETH has been unwrapped during the lifetime of this contract.");
            $('#totalWrapped').html('<span class="text-success">' + web3.fromWei(wrappedEther) + '</span>');
            $('#totalUnwrapped').html('<span class="text-danger">' + web3.fromWei(unwrappedEther) + '</span>');
            $('#currentWrapped').html('<span class="text-warning">' + web3.fromWei(currentSupply) + '</span>');
            $('#userWETHBalance').html('<span class="text-warning">' + web3.fromWei(etcBalance) + '</span>');
            updateUI(currentSupply.div(10**decimals), wrappedEther.div(10**decimals), unwrappedEther.div(10**decimals));
        }
    }

    wrappedEtherContract.totalSupply.call(function (err, _currentSupply) {
        if (err) return console.log(err);
        currentSupply = _currentSupply;
        updateWhenDone();
    });

    wrappedEtherContract.totalEtherWrapped.call(function (err, _wrapped) {
        if (err) return console.log(err);
        wrappedEther = _wrapped;
        updateWhenDone();
    });

    wrappedEtherContract.totalEtherUnwrapped.call(function (err, _unwrapped) {
        if (err) return console.log(err);
        unwrappedEther = _unwrapped;
        updateWhenDone();
    });
    
    wrappedEtherContract.balanceOf.call(web3.eth.defaultAccount, {}, blockNumber, function (err, _etcBalance) {
          if (err) return error(err);
          etcBalance = _etcBalance;
          updateWhenDone();
      });
}

function updateUI(currentSupply, wrappedEther, unwrappedEther) {
    // Delay first UI update until the spinner has been visible for 1 second.
    window.setTimeout(function () {
        updateUI(currentSupply, wrappedEther, unwrappedEther);
    }, 1000);
}