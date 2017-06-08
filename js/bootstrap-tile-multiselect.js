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

        this.buildContainer();
        this.initButtons();

        this.$select.hide().after(this.$container);
    }

    TileMultiselect.prototype = {
        defaults: {
            "columns": 3,
            "tileActiveClass": "btn-primary",
            "tileInactiveClass": "btn-default",
            "checkIcon": " glyphicon glyphicon-check",
            "uncheckIcon": "glyphicon glyphicon-unchecked",
            "limit": false,
            "description": null
        },
        constructor: TileMultiselect,
        buildContainer: function() {
            this.$container = $('<div class="container"></div>');
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
                    + tileMS.options.uncheckIcon
                    + ' uncheck"></span><span class="icon '
                    + tileMS.options.checkIcon
                    + ' check"></span></div><div class="content-wrapper"><span class="title">'
                    + this.text
                    + '</span>';
                var description = $(this).data('description') || ((typeof tileMS.options.description == 'function')? tileMS.options.description($(this), this.value, this.text) : null);
                if (description != null) {
                    tileCode += '<br /><span class="description">'+description+'</span>';
                }
                tileCode += '</div></a>';
                var tile=$(tileCode);
                // init selection
                if (this.getAttribute('selected') !== null) {
                    $('a', tile).addClass('active').addClass('on').addClass(tileMS.options.tileActiveClass);
                }
                row.append(tile);
            });
            this.checkLimit();

            this.$select.on('change', $.proxy(this.handleSelectChange, this));
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
            }, this));
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
                .toggleClass(this.options.tileActiveClass, this.options.tileInactiveClass);
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
        clearSelection: function() {
            return $('.btm-tile.active', this.$container).each($.proxy(function(key, elem) {
                $(elem).addClass(this.options.tileInactiveClass)
                    .removeClass(this.options.tileActiveClass)
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