var WLTH_API_URL = "https://api.commonwealth.gg/chart/info";
var EWLTH_API_URL = "https://api.commonwealth.gg/eth/chart/info";

function getCommonwealthData() {
    $.getJSON(WLTH_API_URL, function (wlth) {
		if (wlth !== null) {
            WLTHPriceETC = wlth.PriceETC.toFixed(4) + " ETC";
			WLTHPriceUSD = "$" + wlth.PriceUSD.toFixed(4);
            WLTHSizeETC = numberWithCommas(wlth.SizeETC.toFixed(0)) + " ETC";
			WLTHSizeUSD = "$" + numberWithCommas(wlth.SizeUSD.toFixed(0));
			WLTHSupply = numberWithCommas(Number(wlth.P3CSupply).toFixed(0));
            WLTHDividends = numberWithCommas(Number(wlth.TotalDividends).toFixed(2)) + " ETC";
            
            if (wlth.TotalDividendsUSD === 'null') {
                WLTHDividendsUSD = "$" + numberWithCommas(wlth.TotalDividendsUSD.toFixed(0));
            } else {
                WLTHDividendsUSD = "$0.00";
            }
			
            ETCPriceUSD = numberWithCommas(Number(wlth.ETCPriceUSD.toFixed(2)));
			setWLTHInfo();
		}
	});
    
    $.getJSON(EWLTH_API_URL, function (ewlth) {
		if (ewlth !== null) {
            EWLTHPriceETH = ewlth.PriceETC.toFixed(4) + " ETH";
			EWLTHPriceUSD = "$" + ewlth.PriceUSD.toFixed(4);
            
            EWLTHSizeETH = numberWithCommas(ewlth.SizeETC.toFixed(0)) + " ETH";
			EWLTHSizeUSD = "$" + numberWithCommas(ewlth.SizeUSD.toFixed(0));
			EWLTHSupply = numberWithCommas(Number(ewlth.P3CSupply).toFixed(0));
            EWLTHDividends = numberWithCommas(Number(ewlth.TotalDividends).toFixed(2)) + " ETH";
            
            if (ewlth.TotalDividendsUSD === 'null') {
                EWLTHDividendsUSD = "$" + numberWithCommas(ewlth.TotalDividendsUSD.toFixed(0));
            } else {
                EWLTHDividendsUSD = "$0.00";
            }
            
            ETHPriceUSD = numberWithCommas(Number(ewlth.ETCPriceUSD.toFixed(2)));
			setEWLTHInfo();
		}
	});
}

function setWLTHInfo() {
    $("#totalWLTHSupply").replaceWith(WLTHSupply);
    $("#totalWLTHDividends").replaceWith(WLTHDividends);
    $("#WLTHpriceETC").replaceWith(WLTHPriceETC);
    $("#WLTHpriceUSD").replaceWith(WLTHPriceUSD);
    $("#WLTHsizeETC").replaceWith(WLTHSizeETC);
    $("#WLTHsizeUSD").replaceWith(WLTHSizeUSD);
    $("#etcPriceUSD").replaceWith(ETCPriceUSD);
}

function setEWLTHInfo() {
    $("#totalEWLTHSupply").replaceWith(EWLTHSupply);
    $("#totalEWLTHDividends").replaceWith(EWLTHDividends);
    $("#EWLTHpriceETH").replaceWith(EWLTHPriceETH);
    $("#EWLTHpriceUSD").replaceWith(EWLTHPriceUSD);
    $("#EWLTHsizeETH").replaceWith(EWLTHSizeETH);
    $("#EWLTHsizeUSD").replaceWith(EWLTHSizeUSD);
    $("#ethPriceUSD").replaceWith(ETHPriceUSD);
}