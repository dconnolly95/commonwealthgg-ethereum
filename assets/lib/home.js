setStats()
function setStats() {
    $.getJSON("https://api.commonwealth.gg/eth/chart/info", function (data) {
		if (data !== null){
            
            PriceETC = data.PriceETC.toFixed(4) + " ETH"
			PriceUSD = "$" + data.PriceUSD.toFixed(4)
            SizeETC = numberWithCommas(data.SizeETC.toFixed(0)) + " ETH"
			SizeUSD = "$" + numberWithCommas(data.SizeUSD.toFixed(0))
			P3CSupply = numberWithCommas(Number(data.P3CSupply).toFixed(0))
            Dividends = numberWithCommas(Number(data.TotalDividends).toFixed(2)) + " ETH"
            
            if (data.TotalDividendsUSD !== 'null') {
                DividendsUSD = "$" + numberWithCommas(data.TotalDividendsUSD.toFixed(0))
            } else {
                DividendsUSD = "$0.00"
            }
            
			
            ETCPriceUSD = numberWithCommas(Number(data.ETCPriceUSD.toFixed(2)))

			$("#tokenSupply").replaceWith(P3CSupply)
			$("#totalDividends").replaceWith(Dividends)
			$("#dividendsUSD").replaceWith(DividendsUSD)
			$("#priceETC").replaceWith(PriceETC)
			$("#priceUSD").replaceWith(PriceUSD)
			$("#sizeETC").replaceWith(SizeETC)
			$("#sizeUSD").replaceWith(SizeUSD)
			$("#etcPriceUSD").replaceWith(ETCPriceUSD)
		}
	});
}

function getURL(query) {
	var vars = query.split("&");
	var query_string = {};
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}


var masternode = getURL(window.location.search.substring(1)).ref;
localStorage.removeItem("ref");
if (masternode){
	 localStorage.setItem("ref", masternode)
}

if (localStorage.getItem('ref')) {
	$(".dashboard-link").attr("href", "/dashboard.html?ref=" + localStorage.getItem('ref'))
}