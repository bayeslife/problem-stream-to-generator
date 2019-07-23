var debug= require('debug')('app')

var delay = function(period){
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve()
    },period)
  })
}

async function makeStream(handler) {
    while(true){
      await delay(5000)
      debug("New stream event")
      await handler("content")      
    }
}

module.exports = makeStream
