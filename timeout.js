const scrapingbee = require('scrapingbee')

var urls = ["url1", "url2", "url3", ...]

var myLoop = syncLoop(MAX_NUMBER, function(loop){
    setTimeout(function(){
        var i = loop.iteration();
        //console.log(i);
        loop.next();
    }, 5000);
}, function(){
    console.log('done');
});

setTimeout(myLoop.break, 1000);

function syncLoop(iterations, process, exit){
    var index = 1,
        done = false,
        shouldExit = false;
    var loop = {
        next:function(){
            if(done){
                if(shouldExit && exit){
                    return exit(); // Exit if we're done
                }
            }
            // If we're not finished
            if(index < iterations)
            {
            	var page = urls[index]
              get(page).then(function (response) {
				        index++; // Increment our index
                process(loop); // Run our process, pass in the loop
				      }).catch((err) => console.log('* A problem occurs : ' + err));

            // Otherwise we're done
            } 
            else 
            {
                done = true; // Make sure we say we're done
                if(exit) exit(); // Call the callback on exit
            }
        },
        iteration:function(){
            return index - 1; // Return the loop number we're on
        },
        break:function(end){
            done = true; // End the loop
            shouldExit = end; // Passing end as true means we still call the exit callback
        }
    };
    loop.next();
    return loop;
}

async function get(url) {
  var client = new scrapingbee.ScrapingBeeClient('YOUR_TOKEN');
  //console.log("Running... "+url)
  var response = await client.get({
              'url': url,
              'params':
              {
                'wait': '4000',
                'extract_rules': 
                  {
                    "email_addresses": {
                      "selector": "a[href^='mailto']",
                      "output": "@href",
                      "type": "list"
                    } 
                }
              }
      }).then(function (response){
        console.log('- '+response.data)
    })
    .catch((e) => console.log('A problem occurs : ' + e.response.data))
  return response
}
