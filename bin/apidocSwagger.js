#!/usr/bin/env node

'use strict';

/*
 * apidoc-swagger
 *
 * Copyright (c) 2015 Exact
 * Author Bahman Fakhr Sabahi <bahman.sabahi@exact.com>
 * Licensed under the MIT license.
 */

var path   = require('path');
var cmd    = require('commander');
var apidocSwagger = require('../lib/index');

var argv = cmd
    .option('-f --file-filters <file-filters>', 'RegEx-Filter to select files that should be parsed (multiple -f can be used).', collect, [])

    .option('-e, --exclude-filters <exclude-filters>', 'RegEx-Filter to select files / dirs that should not be parsed (many -e can be used).', collect, [])

    .option('-i, --input <input>',  'Input/source dirname.', collect, [])

    .option('-o, --output <output>', 'Output dirname.', './doc/')

    .option('-c, --config <config>', 'Path to directory containing config file (apidoc.json).', './')

    .option('-p, --private', 'Include private APIs in output.', false)

    .option('-v, --verbose', 'Verbose debug output.', false)

    .option('--debug', 'Show debug messages.', false)

    .option('--color', 'Turn off log color.', true)

    .option('--parse', 'Parse only the files and return the data, no file creation.', false)

    .option('--parse-filters <parse-filters>', 'Optional user defined filters. Format name=filename', collect, [])
    .option('--parse-languages <parse-languages>', 'Optional user defined languages. Format name=filename', collect, [])
    .option('--parse-parsers <parse-parsers>', 'Optional user defined parsers. Format name=filename', collect, [])
    .option('--parse-workers <parse-workers>', 'Optional user defined workers. Format name=filename', collect, [])

    .option('--silent', 'Turn all output off.', false)

    .option('--simulate', 'Execute but not write any file.', false)

    .option('--markdown [markdown]', 'Turn off default markdown parser or set a file to a custom parser.', true)

    .option('--line-ending <line-ending>', 'Turn off autodetect line-ending. Allowed values: LF, CR, CRLF.')

    .option('--encoding <encoding>', 'Set the encoding of the source code. [utf8].', 'utf8')

    .parse(process.argv)
;

/**
 * Collect options into an array
 * @param {String} value
 * @param {String[]} acc
 * @returns {String[]}
 */
function collect(value, acc) {
    acc.push(value);
    return acc;
}

/**
 * Transform parameters to object
 *
 * @param {String|String[]} filters
 * @returns {Object}
 */
function transformToObject(filters) {
    if ( ! filters)
        return;

    if (typeof(filters) === 'string')
        filters = [ filters ];

    var result = {};
    filters.forEach(function(filter) {
        var splits = filter.split('=');
        if (splits.length === 2) {
            var obj = {};
            result[splits[0]] = path.resolve(splits[1], '');
        }
    });
    return result;
}

var options = {
    excludeFilters: argv.excludeFilters.length ? argv.excludeFilters : [''],
    includeFilters: argv.fileFilters.length ? argv.fileFilters : ['.*\\.(clj|cls|coffee|cpp|cs|dart|erl|exs?|go|groovy|ino?|java|js|jsx|kt|litcoffee|lua|p|php?|pl|pm|py|rb|scala|ts|vue)$'],
    src           : argv.input.length ? argv.input : ['./'],
    dest          : argv.output,
    config        : argv.config,
    apiprivate    : argv.private,
    verbose       : argv.verbose,
    debug         : argv.debug,
    parse         : argv.parse,
    colorize      : argv.color,
    filters       : transformToObject(argv.parseFilters),
    languages     : transformToObject(argv.parseLanguages),
    parsers       : transformToObject(argv.parseParsers),
    workers       : transformToObject(argv.parseWorkers),
    silent        : argv.silent,
    simulate      : argv.simulate,
    markdown      : argv.markdown,
    lineEnding    : argv.lineEnding,
    encoding      : argv.encoding
};

if (apidocSwagger.createApidocSwagger(options) === false) {
    process.exit(1);
}
