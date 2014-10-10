module.exports = function(options)
{
    var fs = require('fs');
    var requirejs = require('requirejs');

    options = options ||
    {};

    var basedir = options.basedir || __dirname;
    var bundledDir = options.bundledDir || basedir;

    // filename and module name must be equal
    var compileExcludeModules = options.compileExcludeModules || ['main']; // array of files not to compile into optimized content
    var recompileOnChange = options.recompileOnChange || false;

    compileRequireJS();

    if (recompileOnChange)
    {
        setupFileWatcher();
    }

    function compileRequireJS()
    {
        fs.readdir(basedir, function(err, files)
        {
            files.forEach(function(file)
            {
                compileRequireJSFile(file);
            });
        });
    }

    function compileRequireJSFile(file)
    {
        if (!/\.js$/.test(file)) return;

        var readFile = basedir + '/' + file;
        var outputFile = bundledDir + '/' + file;

        if (!recompileOnChange)
        {
            fs.readFile(readFile, 'utf8', function(err, data)
            {
                if (err)
                {
                    console.log(err);
                }

                var dataString = data.toString();

                name = file.substr(0, file.lastIndexOf("."));

                var paths = {};

                for (j = 0, jlen = compileExcludeModules.length; j < jlen; j++)
                {
                    var exclude = compileExcludeModules[j];

                    if (exclude !== name)
                    {
                        paths[exclude] = "empty:";
                    }
                }

                var config = {
                    baseUrl: basedir,
                    name: name,
                    out: outputFile,
                    paths: paths,
                };

                requirejs.optimize(config, function(buildResponse)
                {
                    //buildResponse is just a text output of the modules
                    //included. Load the built file for the contents.
                    //Use config.out to get the optimized file contents.
                    // var contents = fs.readFileSync(config.out, 'utf8');

                    console.log('Optimized:' + outputFile);

                }, function(err)
                {
                    console.log('Error optimizing: ' + err);
                    //optimization err callback
                });
            });
        }
        else
        {
            fs.createReadStream(readFile).pipe(fs.createWriteStream(outputFile));
            console.log('Copied:' + outputFile);
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

                compileRequireJSFile(filename);
            }
            else
            {
                console.log('unknown requirejs javascript file changed: ' + event);
            }
        });
    }
}
