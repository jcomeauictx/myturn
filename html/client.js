// namespace this module.
if (typeof(com) == "undefined") var com = {};
if (typeof(com.jcomeau) == "undefined") com.jcomeau = {};
com.jcomeau.myturn = {};
com.jcomeau.myturn.state = null;
com.jcomeau.myturn.pages = null;
com.jcomeau.myturn.page = null;
com.jcomeau.myturn.storedPages = [];
com.jcomeau.myturn.poller = null;
// no need to use `window.` anything; it is implied
com.jcomeau.myturn.poll = function(uri) {
    var request = new XMLHttpRequest();  // not supporting IE
    request.open("GET", uri);
    request.responseType = "document";
    request.onreadystatechange = function() {
        console.log("response code " + request.readyState + ": " +
                    request.response);
        if (request.readyState == XMLHttpRequest.DONE &&
                request.status == 200) {
            var selector = document.getElementById("group-select");
            var previous = selector.value;
            var replacement = request.response.getElementById("group-select");
            console.log("selector: " + selector);
            console.log("replacement: " + replacement);
            if (previous) {
                console.log("keeping already selected \""+ previous + "\"");
                /* setting selected value to what it was before...
                 * in the case that the previous selected group is no longer
                 * active, the Chrome browser will show a blank selection */
                replacement.value = previous;
            }
            if (replacement != selector) {
                console.log("replacing group-select with new copy from server");
                selector.replaceWith(replacement);
            } else {
                console.log("leaving group-select as it was, nothing changed");
            }
        }
    };
    request.send();
}
addEventListener("load", function() {
    console.log("onload routine started");
    var cjm = com.jcomeau.myturn;
    var path = location.pathname.replace(/\/+/, "/");
    console.log("location: " + JSON.stringify(location));
    console.log("location.pathname: " + path);
    if (path != "/noscript") {
        cjm.state = "loading";
        cjm.pages = document.querySelectorAll("div.body");
        console.log("pages: " + cjm.pages);
        for (var page of cjm.pages) {
            if (page.style.display == "none") {
                cjm.storedPages.push(page);
                page.parentNode.removeChild(page);
                // OK to set it visible now, it's no longer part of document
                page.style.display = "";
            } else {
                cjm.page = page;
            }
        }
        cjm.poller = setInterval(function() {cjm.poll("/groups")},
                                 10000); // FIXME set to 500 (1/2 s)
        // save this redirect for last, only reached if all other tests pass
        if (path == "/") location.replace(location.href + "app");
        cjm.state = "loaded";
    }
});
/*
   vim: tabstop=8 expandtab shiftwidth=4 softtabstop=4
*/
