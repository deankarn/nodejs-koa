module.exports = function(options)
{
    var fs = require('fs');
    var less = require('less');

    options = options ||
    {};

    var basedir = options.basedir || __dirname;
    var bundledDir = options.bundledDir || basedir;
    var paths = options.paths || [basedir]; // @import base search path(s)
    var files = options.files || ['style.less']; // files to compile/recompile when watching
    var recompileOnChange = options.recompileOnChange || false;
    var compress = options.compress || false;

    var lessc = new(less.Parser)(
    {
        paths: paths, // Specify search paths for @import directives
        filename: 'style.less' // Specify a filename, for better error messages
    });

    compileLess();

    if (recompileOnChange)
    {
        setupFileWatcher();
    }

    function compileLess()
    {
        for (i = 0, len = files.length; i < len; i++)
        {
            var file = files[i];

            fs.readFile(basedir + '/' + file, 'utf8', function(err, data)
            {
                if (err)
                {
                    return console.log(err);
                }

                var dataString = data.toString();

                lessc.parse(dataString, function(e, tree)
                {

                    var res = tree.toCSS(
                    {
                        compress: compress // Minify CSS output
                    });

                    var output = bundledDir + '/' + file;

                    fs.writeFile(output, res, function(err)
                    {
                        if (err) throw err;
                        console.log('Compiled/Recompiled ' + file + ' to:' + output);
                    });
                });
            });
        }
    }

    function setupFileWatcher()
    {
        fs.watch(basedir, function(event, filename)
        {
            // event change||rename - this was fired on add

            if (filename)
            {
                console.log(filename + ' event: ' + event);
            }
            else
            {
                console.log('.less file changed: ' + event);
            }

            compileLess();
        });
    }
}
