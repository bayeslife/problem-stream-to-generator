var debug = require('debug')('app')

const fp = require('funprog')

function makeCallbackGenerator() {
    var buffer = []
    var handler = function(payload){
        buffer.push(payload)
        return 1//consumed
    }
    var start = async function* () {
        while(true){
            if(buffer.length>0){
                var next = buffer.pop()
                debug("Generator yield")
                yield next
            }else {
                await new Promise((resolve)=>{
                    setTimeout(()=>resolve(),1000)
                })
            }
        }
    }
    return {
        handler, start
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