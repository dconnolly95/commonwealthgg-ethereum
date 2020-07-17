var minimalTokenABI = [{
    "constant": true,
    "inputs": [{"name": "","type": "address"}],
    "name": "balanceOf", "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, 
                       
{
    "anonymous": false,
    "inputs": [
        {"indexed": true, "name": "from", "type": "address"}, 
        {"indexed": true, "name": "to", "type": "address"},
        {"indexed": false, "name": "value", "type": "uint256"}
    ],
    "name": "Transfer", "type": "event"
}];

  var saleABI = [{
  		"constant": true,
  		"inputs": [],
  		"name": "tokensSold",
  		"outputs": [
  			{
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"payable": false,
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"constant": true,
  		"inputs": [],
  		"name": "tokenContract",
  		"outputs": [{"name": "", "type": "address"}],
  		"payable": false,
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"constant": true,
  		"inputs": [],
  		"name": "price",
  		"outputs": [{"name": "", "type": "uint256"}],
  		"payable": false,
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"anonymous": false,
  		"inputs": [
  			{"indexed": false, "name": "buyer", "type": "address"},
  			{"indexed": false, "name": "amount", "type": "uint256"}
  		],
  		"name": "Sold",
  		"type": "event"
  	},
  	{
  		"constant": false,
  		"inputs": [{"name": "numberOfTokens", "type": "uint256"}],
  		"name": "buyTokens",
  		"outputs": [],
  		"payable": true,
  		"stateMutability": "payable",
  		"type": "function"
  	},
  	{
  		"constant": false,
  		"inputs": [],
  		"name": "endSale",
  		"outputs": [],
  		"payable": false,
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"inputs": [
  			{"name": "_tokenContract", "type": "address"},
  			{"name": "_price", "type": "uint256"}
  		],
  		"payable": false, "stateMutability": "nonpayable", "type": "constructor"
  	}
  ];
  var saleAddress = '0x1834729Ce08b226e18CB25Fb5d735454ED2d5d84';

  var saleContract = web3.eth.contract(saleABI).at(saleAddress);

  // These values could be determined dynamically at runtime, but they never
  // change, so there's no harm in hard-coding them, and it saves us network
  // round-trips.
  var tokenAddress = '0xf71c38Cb53478b2Aa7b06F1116b8b7121dF2dED4';
  var tokenContract = web3.eth.contract(minimalTokenABI).at(tokenAddress);
  var decimals = 18;
  var price = 1000000000000000;

  // "Animate" by changing the text with each animation step.
  function animateTo(el, value) {
    $({ number: parseFloat(el.text().replace(/[^\d.]/g, '')) }).animate(
      { number: value },
      {
        step: function () {
          el.text(Math.floor(this.number).toLocaleString());
        },
        complete: function () {
          el.text(this.number.toLocaleString());
        },
      });
  }

  var start = +(new Date());
  function updateUI(owned, sold, remaining) {
    // Delay first UI update until the spinner has been visible for 1 second.
    if (+(new Date()) - start < 1000) {
      return window.setTimeout(function () {
        updateUI(owned, sold, remaining);
      }, 1000 - +(new Date()) + start);
    }

    // sold and total are both BigNumbers
    var total = sold.plus(remaining);

    $('#ui').show();
    $('#spinner').hide();
    animateTo($('#owned'), owned.toNumber());
    animateTo($('#sold'), sold.toNumber());
    animateTo($('#total'), total.toNumber());
    $('#price')
    $('#progress').animate({
      // Safe BigNumber math
      width: Math.round(sold.mul(100).div(total).toNumber()).toString() + '%',
    });
  }

  $('#buyForm').submit(function (e) {
    // Prevent the browser from POSTing the form.
    e.preventDefault();

    var numberOfTokens = web3.toBigNumber($('#number').val());
    saleContract.buyTokens.sendTransaction(numberOfTokens, {
      value: numberOfTokens.mul(price),
    }, function () {
      // Nothing to do here. If the transaction is successful, it will trigger
      // events that we're already monitoring.
    });
  });

  function loadData(blockNumber) {
    console.log("Loading data from contracts...")

    var balance, sold, remaining;

    // Callback that waits for all three pieces of data before proceeding
    function updateWhenDone() {
      if (balance !== undefined && sold !== undefined &&
          remaining !== undefined) {
        console.log("Updating UI.");
        updateUI(balance.div(10**decimals), sold, remaining.div(10**decimals));
      }
    }

      // Fetch in parallel
      // User's balance
      tokenContract.balanceOf.call(web3.eth.defaultAccount, {}, blockNumber, function (err, _balance) {
          if (err) return error(err);
          balance = _balance;
          updateWhenDone();
      });
   
      // Tokens sold so far
      saleContract.tokensSold.call({}, blockNumber, function (err, _sold) {
          if (err) return error(err);
          sold = _sold;
          updateWhenDone();
      });
      
      // Remaining inventory (sale contract's balance)
      tokenContract.balanceOf.call(saleAddress, {}, blockNumber, function (err, _remaining) {
          if (err) return error(err);
          remaining = _remaining;
          updateWhenDone();
      });
  }

function initialize() {
    web3.eth.getBlockNumber(function (err, lastSeenBlock) {
          
        loadData(lastSeenBlock); // Load data for the initial block

        // Handler for events that necessitate a UI update
        function changeHandler(err, data) {
            if (err) return error(err);

            // Only if we haven't already fetched data for this block
            if (data.blockNumber > lastSeenBlock) {
                lastSeenBlock = data.blockNumber;
                loadData(lastSeenBlock);
            }
        }
          
        saleContract.Sold(changeHandler); // The Sold event tells us when the number of sold tokens changes.
        // We display the user's balance as well as the sale contract's balance, so we need to monitor transfers to both.
        // To display an accurate balance, we also need to monitor transfers out of the user's account.
        tokenContract.Transfer({to: [ saleAddress, web3.eth.defaultAccount ]}, changeHandler);
        tokenContract.Transfer({from: web3.eth.defaultAccount}, changeHandler);
    });
}

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