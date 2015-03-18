(function($) {
    // adds case insensitive contains to jQuery

    $.extend($.expr[":"], {
        "containsNC": function (elem, i, match) {
            (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });

    window.drmFlexibleGrid = function(spec) {
        var self = {};

        self.gridClass = spec.gridClass || 'drm-flexible-grid';
        self.imagesPerRow = spec.imagesPerRow || 4;
        self.flex = spec.flex || true;

        self.grid = $('.' + self.gridClass);

        self.getTags = function() {
            var tags = [],
                tagListItems = self.grid.find('ul.caption-tags li');

            $.each(tagListItems, function(k, v) {
                var tag = $(v).text();
                
                tags.push(tag);
                
                return $.unique(tags);
            });

            return tags;
        };

        self.addFilterButtons = function(tags) {
            var captitalize = function(str) {
                return str.toLowerCase().replace(/^.|\s\S/g, function(a) {
                    return a.toUpperCase();
                });
            };

            $.each(tags, function(k, v) {
                var tagButton = $('<button></button>', {
                    'class': 'drm-grid-filter',
                    text: captitalize(v),
                    'data-filter': v
                });

                tagButton.appendTo(self.gridNav);
            });

            self.gridNav.find('.drm-grid-filter').first().addClass('active');
        };

        self.resizeOverlay = function() {
            var overlay = self.grid.find('.overlay');

            $.each(overlay, function(k, v) {
                var that = $(v),
                    imageHeight = that.parent('.drm-grid-item').find('img').outerHeight(true);

                that.height(imageHeight).hide();
            });
        };

        self.addListItems = function(items) {
            self.grid.empty();
            items.appendTo(self.grid).hide(0, function() {
                self.positionListItems(items);
            });
        };

        self.positionListItems = function(items) {
            var resizeHolder = function(items) {
                var tallestColumn = 0,
                    columnHeights = [];

                for (var i = 0; i < self.imagesPerRow; i++) {
                    columnHeights.push(0);
                }

                $.each(items, function(k, v) {
                    var that = $(v),
                        columnNum = that.data('column'),
                        height = that.outerHeight(true);

                    return columnHeights[columnNum] += height;
                });

                $.each(columnHeights, function(k, v) {
                    if (v > tallestColumn) {
                        tallestColumn = v;

                        return tallestColumn;
                    }
                });

                self.grid.css({'height': tallestColumn + 40});
            };

            $.each(items, function(k, v) {
                var that = $(v),
                    index = k + 1,
                    columnNum = ((index % self.imagesPerRow) === 0) ? self.imagesPerRow - 1 : ((index % self.imagesPerRow) - 1),
                    prevImage = (index > self.imagesPerRow) ? self.grid.find('.drm-grid-item').eq(index - (self.imagesPerRow + 1)) : null;

                that.attr('data-column', columnNum);
                that.attr('data_num', index);

                if ((typeof prevImage !== 'undefined') && (prevImage !== null)) {
                    var margin = prevImage.outerWidth(true) - prevImage.outerWidth(false),
                        top = (index < ((self.imagesPerRow * 2) + 1)) ? prevImage.outerHeight(false) + margin : prevImage.outerHeight(false) + margin + prevImage.position().top;
                        left = (prevImage.outerWidth(false) * columnNum) + (margin * columnNum);

                    that.css({'top' : top, 'left' : left, 'position': 'absolute'});
                } else {
                    that.css({'top' : 0, 'left' : 0, 'position': 'relative'});
                }

                that.show();
            });

            resizeHolder(items);
        };

        self.filterListItems = function(filter) {
            // filter list items by tag
            var filteredItems,
                filter = (window.location.hash) ? filter : 'all';

            window.location.hash = filter;

            if ( ( $.inArray( filter, self.tags ) !== -1 ) || filter === 'all' ) {
                if ( filter === 'all' ) {
                    filteredItems = self.items;
                } else {
                    filteredItems = self.items.has('ul.caption-tags li:containsNC(' + filter + ')');
                }
                
                self.addListItems(filteredItems);
            } else {
                $('<p></p>', {
                    text: 'no items match'
                }).appendTo(self.grid);
            }
        };

        if ( self.grid.length > 0 ) {
            var hash = window.location.hash;

            self.gridNav = $('.drm-grid-nav');
            self.items = self.grid.find('.drm-grid-item').hide();

            $(window).load(function() {
                var filter = hash ? hash.replace(/^#/, '') : null;

                self.tags = self.getTags();

                self.addFilterButtons(self.tags);
                self.filterListItems(filter);

                if (typeof filter !== 'undefined') {
                    var activeButton = $('button.drm-grid-filter[data-filter=' + filter + ']');

                    activeButton.siblings('button').removeClass('active');
                    activeButton.addClass('active');
                }
            });

            if (self.flex === true) {
                $(window).resize(function() {
                    self.positionListItems(self.items);
                    self.resizeOverlay();
                });
            }

            $(window).load(self.resizeOverlay);

            self.grid.on('mouseenter', '.drm-grid-item', function() {
                $(this).find('.overlay').stop().fadeIn('fast');
            });

            self.grid.on('mouseleave', '.drm-grid-item', function() {
                $(this).find('.overlay').stop().fadeOut('fast');
            });

            self.gridNav.on('click', 'button.drm-grid-filter', function(e) {
                var that = $(this),
                    filter = that.data('filter').toLowerCase();
                
                self.filterListItems(filter);
                that.siblings('button').removeClass('active');
                that.addClass('active');
                e.preventDefault();
            });

            self.grid.on('click', '.caption-tags li', function(e) {
                var that = $(this),
                    filter = that.data('filter').toLowerCase();
                
                self.filterListItems(filter);
                button = self.gridNav.find('button[data-filter=' + filter + ']');
                button.siblings('button').removeClass('active');
                button.addClass('active');
                e.preventDefault();
            });
        }

        return self;
    };
})(jQuery);