const isDev = process.env.NODE_ENV !== 'production';

function format(level,message,meta){
    return {
        level,
        message,
        meta,
        timestamp:new Date().toISOString()
    };
}

const logger = {
    info(message,meta ={}){
        if(isDev) console.info(format('INFO', message, meta));
    },
    warn(message,meta={}){
        if(isDev) console.warn(format('WARN', message, meta));
    },
    error(message, meta = {}){
        console.error(format('ERROR', message, meta))
    }
}
export default logger;