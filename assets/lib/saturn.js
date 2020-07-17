var jsonURL = "https://ticker.saturn.network/api/v2/tokens/show/etc/0xf71c38Cb53478b2Aa7b06F1116b8b7121dF2dED4.json";

$(document).ready(function(){
    $.getJSON(jsonURL, function(result){
        $("#bestBuyOrder").text(result.best_buy_order);
        $("#bestBuyPrice").text(result.best_buy_price.substr(0,9));
        $("#bestSellOrder").text(result.best_sell_order);
        $("#bestSellPrice").text(result.best_sell_price.substr(0,9));
        $("#totalSupply").text(result.total_supply);
        $("#volume24h").text(result.volume24hr.substr(0,4));
        $("#price24h").text(result.price24hr.substr(0,9));
        $("#currentPrice").text(result.dashboard_price.substr(0,9));
        $("#changePercent").text(result.change_pct.substr(0,3));
    });
});