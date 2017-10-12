// 1. give the user the ability to send a stock symbol
// 2. get the symbol
// 3. once submitted, make an ajax request to yahoo
// 4. get the response from yahoo and update the DOM

$(document).ready(()=>{
	// set item takes 2 arg, one name of the var, two the value to set
	var watchList = [
		"goog",
		"msft",
		"tsla",
		"tata",
		"race"
	]
	var firstView = true;
	var watchList = getItemJSON("watchList");
	if(watchList != null){
		updateWatchList();
	}
	// // enter JSON.stringify becomes a string
	// var watchListAsString = JSON.stringify(watchList);

	// // enter JSON.parse becomes back to an object

	// var watchListAsObject = JSON.parse(watchListAsString);


	// localStorage.setItem("watchList", "race");
	// var watchList = localStorage.getItem("watchList")
	// console.log(watchList);
	function buildRow(stockInfo){
		if(stockInfo.Change != null){
			if(stockInfo.Change.indexOf("+") > -1){
				var classChange = "success";
			}else{
				var classChange = "danger";
			}
		}else{
			stockInfo.Change = "Market Closed";
		}
		var newRow = "";
		newRow += "<tr>";
			newRow += `<td>${stockInfo.Symbol}</td>`;
			newRow += `<td>${stockInfo.Name}</td>`;
			newRow += `<td>${stockInfo.Ask}</td>`;
			newRow += `<td>${stockInfo.Bid}</td>`;
			newRow += `<td class="bg-${classChange}">${stockInfo.Change}</td>`;
			newRow +=`<td><button symbol=${stockInfo.Symbol} class="btn btn-success">Save</button></td>`
			newRow +=`<td><button symbol=${stockInfo.Symbol} class="btn btn-danger">Delete</button></td>`
		newRow += "</tr>";
		return newRow;
	}
	function updateWatchList(){
		// get the watchList
		$("#stock-table-body-saved").html("");
		var watchList = getItemJSON("watchList");
		var watchListAsJSON = JSON.parse(watchList);
		watchListAsJSON.map((symbol, index)=>{
			// console.log(symbol);
			var url = `http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22${symbol}%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json`;
			$.getJSON(url, (stockData)=>{
				var stockInfo = stockData.query.results.quote;
				var newRow = buildRow(stockInfo);
				$("#stock-table-body-saved").append(newRow);
			});
		});
	}

	function getItemJSON(item){
		var items = localStorage.getItem(item);
		console.log(items);
		return items;
	}

	$(".yahoo-finance-form").submit((event)=>{
		event.preventDefault();
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
			// $("#stock-table-body").html(newRow);
			if(firstView){
				$('#stock-table-body').html(newRow);	
				firstView = false;
			}else{
				$('#stock-table-body').append(newRow);
			}
			$("td button").click(function(){
				// add a click listenr to all the buttons in the tables
				// when clicked on, save the symbol to localStorage
				var stockToSave = $(this).attr("symbol");
				var oldWatchList = getItemJSON("watchList");
				// oldwatchlist just came back of localc storage as 
				var oldAsJSON = JSON.parse(oldWatchList);
				// now we would have an object/array
				// if the user never saved anything, there will be nothing to parese, this will return null in jason.parse
				if(oldAsJSON == null){
					oldAsJSON = [];
				}
				if(oldAsJSON.indexOf(stockToSave) > -1){
					// the stock is already in the list, we don't know where but it's there because it didnt return -1
				}else{
					oldAsJSON.push(stockToSave);
					var newWatchListAsString = JSON.stringify(oldAsJSON);
					localStorage.setItem("watchList", newWatchListAsString);
					updateWatchList();
				}
			})
		})
	})
});
