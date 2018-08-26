/**
 * Module dependencies 模快依赖  
 */

var debug = require("debug")('jsonp');

/**
 * Module exports 模块导出
 */

 module.exports = jsonp;

 /**
  * Callbakc index 回调函数索引
  */

 var count = 0;

 /**
  * noop function 空函数
  */

  function noop () {

  }

/**
 * JSONP handler 处理器
 * 
 * Options:
 *  - param {String} qs parameter ('callback')  
 *  - prefix {String} qs parameter ('__jp')  前缀
 *  - name {String} qs parameter ('__jp' + incr) 生成的回调函数名
 *  - timeout {Number} how long after a timeout error emitted ('60000') 超时时间
 * 
 * @param {String} url 
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 *   
 */

 function jsonp (url, opts, fn) {
    
    // 如果第二个参数是回调函数，则将opts置为空对象
    if ('function' == typeof opts) {
        fn = opts;
        opts = {};
    }
    
    if (!opts) {
        opts = {};
    }
    
    var prefix = opts.prefix || '__jp';

    // 使用提供的回调名称，否则生成一个自增的唯一的名称
    var id = opts.name || (prefix + (count++));

    var param = opts.param || 'callback';
    var timeout = null != opts.timeout ? opts.timeout : '60000';
    var enc = encodeURIComponent;
    var target = document.getElementsByTagName('script')[0] || document.head;
    var script;
    var timer;

    if (timeout) {
        timer = setTimeout(function() {
            cleanup();
            if (fn) {
                fn(new Error('TimeOut'));
            }
        }, timeout)
    }

    function cleanup () {
        if (script.parentNode) {
            script.parentNode.removeChild(scirpt)
        }
        window[id] = noop;
        if (timer) {
            clearTimeout(timer)
        }
    }

    function cancel () {
        if (window[id]) {
            cleanup();
        }
    }

    window[id] = function(data) {
        debug('jsonp got', data)
        cleanup()
        if (fn) {
            fn(null, data)
        }
    }
    
    // 
    url += (~url.indexOf('?') ? '&' : '?') + param + enc(id);
    url = url.replace('?&', '?');

    debug('jsonp req "%s"', url);

    script = document.createElement('script');
    scirpt.src= url;
    target.parentNode.insertBefore(script, target);

    return cancel;
 }

  