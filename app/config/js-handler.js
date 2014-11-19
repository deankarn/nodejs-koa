module.exports = function (options)
{
	var fs = require('fs');

	options = options ||
	{};

	var basedir = options.basedir || __dirname;
	var bundledDir = options.bundledDir || basedir;

	// filename and module name must be equal
	var watchForChanges = options.watchForChanges || false;

    handleJs();

	if (watchForChanges)
	{
		setupFileWatcher();
	}

	function handleJs()
	{
		fs.readdir(basedir, function (err, files)
		{
			files.forEach(function (file)
			{
				handleJsFile(file);
			});
		});
	}

	function handleJsFile(file)
	{
		if (!/\.js$/.test(file)) return;

		var readFile = basedir + '/' + file;
		var outputFile = bundledDir + '/' + file;

		fs.createReadStream(readFile).pipe(fs.createWriteStream(outputFile));
		console.log('Copied:' + outputFile);
	}

	function setupFileWatcher()
	{
		fs.watch(basedir, function (event, filename)
		{
			// event change||rename - this was fired on add
			if (filename)
			{
				console.log(filename + ' event: ' + event);

				handleJsFile(filename);
			}
			else
			{
				console.log('unknown requirejs javascript file changed: ' + event);
			}
		});
	}
}
