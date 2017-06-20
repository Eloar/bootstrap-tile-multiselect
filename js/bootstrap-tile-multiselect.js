(function( $ ) {
    function TileMultiselect(select, options) {
        if (select.tagName != 'SELECT') {
            console.error('This control is ment to be used with select element');
            return;
        }
        this.$select = $(select);
        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));
        this.options.onChange = $.proxy(this.options.onChange, this);
        this.options.multiple = this.$select.attr('multiple') === 'multiple';

        this.setupCallbackOptions();
        this.buildContainer();
        this.initButtons();
        this.initErrors();

        this.$select.hide().after(this.$container);
    }

    TileMultiselect.prototype = {
        defaults: {
            "columns": 3,
            "tileActiveClass": function() { return "btn-primary"; },
            "tileInactiveClass": function() { return "btn-default"; },
            "checkIcon": function() { return "glyphicon glyphicon-check"; },
            "uncheckIcon": function() { return "glyphicon glyphicon-unchecked"; },
            "limit": false,
            "description": null,
            "label": function(e, v, t) { return t; }
        },
        callbacks: [
            'description',
            'tileActiveClass',
            'tileInactiveClass',
            'checkIcon',
            'uncheckIcon',
            'label'
        ],
        constructor: TileMultiselect,
        buildContainer: function() {
            this.$container = $('<div class="container-fluid"></div>');
            var tileMS = this;
            var num = 0;
            var tileCol = 12 / tileMS.options.columns;
            var row = null;
            $('option', this.$select).each(function() {
                if (num++ % tileMS.options.columns == 0) {
                    row = $('<div class="row btm-row"></div>');
                    tileMS.$container.append(row);
                }
                var tileCode = '<div class="col-sm-'
                    + tileCol
                    + '"><a href="#" class="btn btn-default btm-tile" data-value="'
                    + this.value
                    + '"><div class="icon-wrap"><span class="icon '
                    + tileMS.options.uncheckIcon($(this), this.value, this.text)
                    + ' uncheck"></span><span class="icon '
                    + tileMS.options.checkIcon($(this), this.value, this.text)
                    + ' check"></span></div><div class="content-wrapper"><span class="title">'
                    + tileMS.options.label($(this), this.value, this.text)
                    + '</span>';
                var description = $(this).data('description') || tileMS.options.description($(this), this.value, this.text);
                if (description != null) {
                    tileCode += '<br /><span class="description">'+description+'</span>';
                }
                tileCode += '</div></a>';
                var tile=$(tileCode);
                // init selection
                if (this.getAttribute('selected') !== null) {
                    $('a', tile).addClass('active').addClass('on').addClass(tileMS.options.tileActiveClass($(this), this.value, this.text));
                }
                row.append(tile);
            });
            this.checkLimit();

            this.$select.on('change', $.proxy(this.handleSelectChange, this));
            this.$select.on('invalid', $.proxy(this.checkErrors, this));
        },
        initButtons: function() {
            $('a.btm-tile', this.$container).on('click', $.proxy(function(event) {
                event.preventDefault();
                var $target = $(event.currentTarget);
                var active = $target.hasClass('active');

                if($target.hasClass('disabled')) {
                    return;
                }

                if (!this.options.multiple) {
                    this.clearSelection();
                    if (active) {
                        return;
                    }
                }
                this.selectElem($target);
                // check for errors
                this.checkErrors();

            }, this));
        },
        initErrors: function() {
            this.$error = $('<div class="col-sm-12 alert alert-danger"></div>');
            this.$container.prepend(this.$error);
            this.$error.hide();
        },
        checkErrors: function() {
            this.$error.text(this.$select[0].validationMessage);
            this.$error.toggle(!this.$select[0].checkValidity());
        },
        checkLimit: function() {
            if (typeof this.options.limit != 'number') {
                return;
            }
            var $inactive = $('.btm-tile:not(.active)', this.$container);
            if ($('.active', this.$container).length >= this.options.limit) {
                $inactive.addClass('disabled');
            } else {
                $inactive.removeClass('disabled');
            }
        },
        handleSelectChange: function(event) {
            // 1. odepnij handler
            this.$select.off('change', this.handleSelectChange);
            // 2. wyczysc kontrolke
            this.clearSelection();
            // 3. ustaw nowe wartosci
            var value = $(event.target).val();
            if (!Array.isArray(value)) {
                value = [value];
            }
            value.forEach($.proxy(function(val) {
                this.selectValue(val);
            }, this));
            // 4. podepnij handler
            this.$select.on('change', $.proxy(this.handleSelectChange, this));
        },
        selectValue: function(value) {
            this.selectElem($('.btm-tile[data-value="'+value+'"]', this.$container));
        },
        selectElem: function(elem, condition) {
            elem.toggleClass('active', condition)
                .toggleClass('on', 'off')
                .toggleClass(this.options.tileActiveClass(elem, elem.value, elem.text), this.options.tileInactiveClass(elem, elem.value, elem.text));
            $('option[value=' + elem.data('value') +']', this.$select).attr('selected', elem.hasClass('active')? 'selected' : false);
            this.checkLimit();
        },
        /**
         * Merges the given options with the default options.
         *
         * @param {Array} options
         * @returns {Array}
         */
        mergeOptions: function(options) {
            return $.extend(true, {}, this.defaults, this.options, options);
        },
        setupCallbackOptions: function() {
            this.callbacks.forEach($.proxy(function(elem) {
                if(typeof this.options[elem] !== 'function') {
                    var tileMS = this;
                    this.options['_'+elem] = this.options[elem];
                    this.options[elem] = function () { return tileMS.options['_'+elem]; };
                }
            }, this));
        },
        clearSelection: function() {
            return $('.btm-tile.active', this.$container).each($.proxy(function(key, elem) {
                $(elem).addClass(this.options.tileInactiveClass(elem, elem.value, elem.text))
                    .removeClass(this.options.tileActiveClass(elem, elem.value, elem.text))
                    .removeClass('active');
                $('option[value=' + $(elem).data('value') +']', this.$select).removeAttr('selected');
            }, this));
        },
        disable: function() {
            this.$container.addClass('disabled');
            $('.btm-tile', this.$container).addClass('disabled');
        },
        enable: function() {
            this.$container.removeClass('disabled');
            $('.btm-tile', this.$container).removeClass('disabled');
        },
        toggle: function(condition) {
            if (typeof condition == 'boolean') {
                return condition? this.enable() : this.disable();
            }

            if (this.$container.hasClass('disabled')) {
                this.enable();
            } else {
                this.disable();
            }
        },
        /**
         * Unbind plugin from element
         */
        destroy: function() {
            this.$container.remove();
            this.$select.show();
            this.$select.data('tile-multiselect', null);
        }
    };

    $.fn.tileMultiselect = function(option, parameter, extraOption) {
        return this.each(function() {
            var data =$(this).data('tile-multiselect');
            var options = typeof option == "object" && option;

            // initialize tile-multiselect
            if (!data) {
                data = new TileMultiselect(this, options);
                $(this).data('tile-multiselect', data);
            }

            // call tile-multiselect method
            if (typeof option == 'string') {
                data[option](parameter, extraOption);
            }
        });
    };

    $.fn.tileMultiselect.constructor = TileMultiselect;

    $(function() {
        $('select[data-role=tile-multiselect]').tileMultiselect();
    })
}(window.jQuery));