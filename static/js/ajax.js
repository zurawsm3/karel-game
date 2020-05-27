var req = new XMLHttpRequest();
req.open('GET', url, true)
req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
        if (req.status == 200)
            console.log(req.responseText);
        else
            console.log(("Błąd podczas ładowania strony\n"));
    }
}
req.send(null)