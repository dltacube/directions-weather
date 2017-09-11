var logEvents = function (obj) {
    if (obj) {
        var observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                console.log('mutation type: ' + mutations[i].type);
            }
        });
        var config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        };
        observer.observe(obj, config);
    }
};

// $(document).ready(function () {
//         logEvents(document.getElementById('right-panel'));
//     }
// );