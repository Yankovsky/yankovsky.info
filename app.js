var http = require('http'),
    fs = require('fs'),
    port = process.env.PORT || 3000

var textCss = 'text/css',
    textHtml = 'text/html',
    applicationJson = 'application/json',
    templates = {'header.html': null, 'footer.html': null},
    titlePlaceholder = '{{{REPLACE-ME-WITH-TITLE-PLEASE}}}'

function allFilesRead() {
    var flag = true
    Object.keys(templates).forEach(function(fileName) {
        flag = flag && templates[fileName]
    })
    return flag
}

Object.keys(templates).forEach(function(fileName) {
    fs.readFile(fileName, 'utf8', function(err, data) {
        if (err)
            throw err
        templates[fileName] = data
        if (allFilesRead()) {
            startServer()
        }
    })
})

function prepareHeader(reqUrl) {
    var title = reqUrl === '/' ? 'index' : reqUrl.substr(1).replace(/(.*\/)?(.*)\.html/, '$2').replace(/\-/g, ' ')
    return templates['header.html'].replace(titlePlaceholder, title)
}

function startServer() {
    http.createServer(function(req, res) {
        var reqUrl = req.url;
        var url = './' + (reqUrl === '/' ? 'index.html' : reqUrl)
        fs.readFile(url, function(err, data) {
            if (err) {
                res.writeHead(404)
                res.write("Oh shi! Page not found")
            } else {
                var contentType = /css$/.test(reqUrl) ? textCss : ( /json$/.test(reqUrl) ? applicationJson : textHtml)
                if (contentType === textHtml) {
                    data = prepareHeader(reqUrl)
                        + data
//                        + reqUrl === '/' ?
                        + templates['footer.html']
                }
                res.writeHead(200, {'Content-Type': contentType, 'Content-Length': data.length })
                res.write(data)
            }
            res.end()
        })
    }).listen(port)
}