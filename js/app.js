(function ($) {
    var input = $('[input]'),
        output = {
            info: {
                src: $('[output=info]')
            }
        },
        pattern = {
            'Counts': {
                'Words': /[A-Za-zА-Яа-я]+/g,
                'Spaces': /[\s\t]/g,
                'Line breaks': /[\n]/g,
                'Letters': /[A-Za-zА-Яа-я]/g,
                'Capital Letters': /[A-ZА-Я]/g,
                'Numbers': /[0-9]/g,
                'Special symbols': /[^A-Za-zА-Яа-я0-9]/g
            },
            'Length': function (value) {
                return value.length || 0;
            }
        };

    input.blur(function () {
        var val = input.val() || input.text();

        output.info.data = fill(pattern, val);
        output.info.src.html(build(output.info.data));
    });

    function fill(pattern, value, obj) {
        var param;

        if (!obj) {
            obj = {};
        }

        for (param in pattern) {
            switch (pattern[param].constructor) {
                case Object:
                    obj[param] = fill(pattern[param], value);
                    break;
                case RegExp:
                    obj[param] = (value.match(pattern[param]) || []).length;
                    break;
                case Function:
                    obj[param] = pattern[param](value);
                    break;
            }
        }

        return obj;
    }

    function build(obj) {
        var result = $('<ul class="list-group"></ul>'),
            param;

        for (param in obj) {
            if (obj[param].constructor !== Object) {
                result.append(template(param, obj[param]));
            } else {
                result.append(template(param));
                result.append(build(obj[param]));
            }
        }

        return result;
    }

    function template(title, value) {
        var header = value !== undefined ? '' : 'list-group-item-success head';
        return [
            '<li class="list-group-item ' + header + '">',
                '<span class="badge">',
                    value,
                '</span>',
                title,
            '</li>'
        ].join("");
    }

})(jQuery);
