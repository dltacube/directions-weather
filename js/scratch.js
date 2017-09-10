// var foo = function () {
//     console.log("This is food");
// }
//
// var someFunc = (function (myFunc) {
//     return function () {
//         console.log("myFunc will be exec in 2 sec");
//         setTimeout(myFunc, 2000);
//     }
// })(myFunc);
//
// someFunc();

(function(window) {
    var foo = 'hello';
    var bar = 'world';

    function baz() {
        console.log('hello world');
    };
    window.baz = baz;
})(window);

baz()