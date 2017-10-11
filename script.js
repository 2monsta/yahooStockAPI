// 1. give the user the ability to send a stock symbol
// 2. get the symbol
// 3. once submitted, make an ajax request to yahoo
// 4. get the response from yahoo and update the DOM

$(document).ready(()=>{


	function buildRow(stockInfo){
		if(stockInfo.Change.indexOf("+") > -1){
			var classChange = "success";
		}else{
			var classChange = "danger";
		}
		var newRow = "";
		newRow += "<tr>";
			newRow += `<td>${stockInfo.Symbol}</td>`;
			newRow += `<td>${stockInfo.Name}</td>`;
			newRow += `<td>${stockInfo.Ask}</td>`;
			newRow += `<td>${stockInfo.Bid}</td>`;
			newRow += `<td class="bg-${classChange}">${stockInfo.Change}</td>`;
		newRow += "</tr>";
		return newRow;
	}

	$(".yahoo-finance-form").submit((event)=>{
		event.preventDefault();
		var firstView = true;
		// console.log("user submitted the form");
		var stockSymbol = $("#ticker").val();
		var newRow;
		var url = `http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22${stockSymbol}%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json`;
		$.getJSON(url, (theDataJSFound)=>{
			console.log(theDataJSFound);
			var numFound = theDataJSFound.query.count;
			if(numFound > 1){
				// we have nultiple we need to loop
				theDataJSFound.query.results.quote.map((stock)=>{
					newRow +=buildRow(stock);
				})
			}else{
				var stockInfo = theDataJSFound.query.results.quote;
				newRow = buildRow(stockInfo);
			}
			$("#stock-table-body").html(newRow);
			
		})
	})
});
