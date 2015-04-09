// TODO: This file should be turn into a less hacky, re-usable module!
var vm = require('vm'),
    Module = require('module'),
    fs = require('fs'),
    path = require('path');

var originalExtensionFn = Module._extensions['.js'];

function autoWireDependencies(content) {
    return content.indexOf("/* autoWireDependencies */") === 0;
}

function getDependencyArray(content) {
    return content
        .substr(
        content.indexOf('(') + 1,
        content.indexOf(')') - content.indexOf('(') - 1
    )
        .replace(/ /g, '')
        .split(',');
}

function endsWith(string, search) {
    return string.indexOf(search, string.length - search.length) !== -1;
}

function injectDependencies(content, dependencies) {
    var dependencyString = "";
    dependencies.forEach(function(dependency) {
        if (dependency === "require") dependencyString += dependency + ", ";
        else dependencyString += "require('" + dependency + "'), "
    });
    dependencyString = dependencyString.substr(0, dependencyString.length - 2);

    if (endsWith(content, ";")) {
        content = content.substr(0, content.length - 1);
    }

    var moduleParts = content.split('module.exports = ');

    content = moduleParts[0] + "module.exports = (" + moduleParts[1] + ")(" + dependencyString + ");";

    return content;
}

function getLocalCompile(originalCompileFn) {
    return function(content, filename) {
        var self = this;
        // remove shebang
        content = content.replace(/^\#\!.*/, '');

        function require(path) {
            return self.require(path);
        }

        require.resolve = function(request) {
            return Module._resolveFilename(request, self);
        };

        Object.defineProperty(require, 'paths', { get: function() {
            throw new Error('require.paths is removed. Use ' +
            'node_modules folders, or the NODE_PATH ' +
            'environment variable instead.');
        }});

        require.main = process.mainModule;

        // Enable support to add extra extension types
        require.extensions = Module._extensions;
        require.registerExtension = function() {
            throw new Error('require.registerExtension() removed. Use ' +
            'require.extensions instead.');
        };

        require.cache = Module._cache;

        var dirname = path.dirname(filename);

        if (Module._contextLoad) {
            if (self.id !== '.') {
                debug('load submodule');
                // not root module
                var sandbox = {};
                for (var k in global) {
                    sandbox[k] = global[k];
                }
                sandbox.require = require;
                sandbox.exports = self.exports;
                sandbox.__filename = filename;
                sandbox.__dirname = dirname;
                sandbox.module = self;
                sandbox.global = sandbox;
                sandbox.root = root;

                return vm.runInNewContext(content, sandbox, { filename: filename });
            }

            debug('load root module');
            // root module
            global.require = require;
            global.exports = self.exports;
            global.__filename = filename;
            global.__dirname = dirname;
            global.module = self;

            return vm.runInThisContext(content, { filename: filename });
        }

        /* BEGIN _compile overrides */
        if (autoWireDependencies(content)) {
            content = injectDependencies(content, getDependencyArray(content));
        }
        /* END _compile overrides */

        // create wrapper function
        var wrapper = Module.wrap(content);

        var compiledWrapper = vm.runInThisContext(wrapper, { filename: filename });
        if (global.v8debug) {
            if (!resolvedArgv) {
                // we enter the repl if we're not given a filename argument.
                if (process.argv[1]) {
                    resolvedArgv = Module._resolveFilename(process.argv[1], null);
                } else {
                    resolvedArgv = 'repl';
                }
            }

            // Set breakpoint on module start
            if (filename === resolvedArgv) {
                global.v8debug.Debug.setBreakPoint(compiledWrapper, 0, 0);
            }
        }
        var args = [self.exports, require, self, filename, dirname];
        return compiledWrapper.apply(self.exports, args);
    };
}

Module._extensions['.js'] = function(module, filename) {
    module._compile = getLocalCompile(module._compile);
    originalExtensionFn(module, filename);
};

var context = {
    require: require,
    console: console,
    exports: module.exports,
    module: module,
    process: process
};

function autowire(filePath) {
    vm.runInNewContext(fs.readFileSync(filePath), context);
}

autowire('./run.js');