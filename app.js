var http = require('http'),
    fs = require('fs')
var port = process.env.PORT || 3000
http.createServer(function(req, res) {
    var url = './' + (req.url == '/' ? 'index.html' : req.url)
    fs.readFile(url, function(err, html) {
        if (err) {
            res.writeHead(404)
            res.write("Oh shi! Page not found")
        } else {
            res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': html.length})
            res.write(html)
        }
        res.end()
    })
}).listen(port)