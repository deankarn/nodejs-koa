module.exports = function (options)
{
	var fs = require('fs');
	var less = require('less');
	var chokidar = require('chokidar');

	options = options ||
	{};

	var basedir = options.basedir || __dirname;
	var bundledDir = options.bundledDir || basedir;
	var paths = options.paths || [basedir]; // @import base search path(s)
	var files = options.files || ['style.less']; // files to compile/recompile when watching
	var recompileOnChange = options.recompileOnChange || false;
	var compress = options.compress || false;

	var lessOptions = {
		paths: paths, // Specify search paths for @import directives
		filename: 'style.less', // Specify a filename, for better error messages
		compress: compress // Minify CSS output
	};

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

			fs.readFile(basedir + '/' + file, 'utf8', function (err, data)
			{
				if (err)
				{
					return console.log(err);
				}

				var dataString = data.toString();

				less.render(dataString, lessOptions, function (error, output)
				{
					if (error)
					{
						console.log(error);
					}

					var res = output.css;
					var name = file.substr(0, file.lastIndexOf("."));
					var output = bundledDir + '/' + name + '.css';

					fs.writeFile(output, res, function (err)
					{
						if (err) throw err;
						console.log('Compiled/Recompiled ' + file + ' to:' + output);
					});
				});
			});
		}
	}

	function compileLessFile(event, filename)
	{
		if (filename)
		{
			console.log(filename + ' event: ' + event);
		}
		else
		{
			console.log('.less file changed: ' + event);
		}

		compileLess();
	}

	function setupFileWatcher()
	{
		var watcher = chokidar.watch(basedir,
		{
			// ignored: /[\/\\]\./,
			persistent: true
		});

		watcher
			.on('add', function (path)
			{
				compileLessFile("added", path);
			})
			.on('change', function (path)
			{
				compileLessFile("changed", path);
			})
	}
}
