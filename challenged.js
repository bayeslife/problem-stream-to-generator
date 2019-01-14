var debug = require('debug')('app')

const fp = require('funprog')

function makeCallbackGenerator() {
    var handler
    var generator = async function* () {
        while(true){
            await new Promise((resolve)=>{
                handler = function(payload){
                    resolve(payload)
                }
            })
        }
    }
}

var g = makeCallbackGenerator()

var streamFactory = require('./src/stream.js')

var stream = streamFactory(g.handler)

async function run(){

    var transformation = fp.mapping(fp.identity)
    
    var gen = g.start()
    var generator = fp.transduceGenerator(transformation, fp.latest, null, gen );
        
    for await (const d of gen){
        console.log(d)
    }
}

run()