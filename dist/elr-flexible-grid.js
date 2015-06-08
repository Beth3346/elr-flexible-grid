(function($) {

    window.elrFlexibleGrid = function(params) {
        var self = {};
        var spec = params || {};
        var gridClass = spec.gridClass || 'elr-flexible-grid';
        var imagesPerRow = spec.imagesPerRow || 4;
        var flex = spec.flex || true;
        var $grid = $('.' + gridClass);
        var tags;

        var addFilterButtons = function(tags) {

            $.each(tags, function(k, v) {
                var $tagButton = $('<button></button>', {
                    'class': 'elr-grid-filter',
                    text: elr.capitalize(v),
                    'data-filter': v
                });

                $tagButton.appendTo($gridNav);
            });

            $gridNav.find('.elr-grid-filter').first().addClass('active');
        };

        var resizeOverlay = function() {
            var overlay = $grid.find('.overlay');

            $.each(overlay, function(k, v) {
                var $that = $(v),
                    imageHeight = $that.parent('.elr-grid-item').find('img').outerHeight(true);

                $that.height(imageHeight).hide();
            });
        };

        var addListItems = function($items) {
            $grid.empty();
            $items.appendTo($grid).hide(0, function() {
                positionListItems($items);
            });
        };

        var positionListItems = function($items) {
            var resizeHolder = function($items) {
                var tallestColumn = 0;
                var columnHeights = [];

                for (var i = 0; i < imagesPerRow; i++) {
                    columnHeights.push(0);
                }

                $.each($items, function(k, v) {
                    var $that = $(v);
                    var columnNum = $that.data('column');
                    var height = $that.outerHeight(true);

                    return columnHeights[columnNum] += height;
                });

                $.each(columnHeights, function(k, v) {
                    if (v > tallestColumn) {
                        tallestColumn = v;

                        return tallestColumn;
                    }
                });

                $grid.css({'height': tallestColumn + 40});
            };

            $.each($items, function(k, v) {
                var $that = $(v);
                var index = k + 1;
                var columnNum = ((index % imagesPerRow) === 0) ? imagesPerRow - 1 : ((index % imagesPerRow) - 1);
                var $prevImage = (index > imagesPerRow) ? $grid.find('.elr-grid-item').eq(index - (imagesPerRow + 1)) : null;

                $that.attr('data-column', columnNum);
                $that.attr('data_num', index);

                if ((typeof $prevImage !== 'undefined') && ($prevImage !== null)) {
                    var margin = $prevImage.outerWidth(true) - $prevImage.outerWidth(false),
                        top = (index < ((self.imagesPerRow * 2) + 1)) ? $prevImage.outerHeight(false) + margin : $prevImage.outerHeight(false) + margin + $prevImage.position().top;
                        left = ($prevImage.outerWidth(false) * columnNum) + (margin * columnNum);

                    $that.css({'top' : top, 'left' : left, 'position': 'absolute'});
                } else {
                    $that.css({'top' : 0, 'left' : 0, 'position': 'relative'});
                }

                $that.show();
            });

            resizeHolder($items);
        };

        var filterListItems = function(filter, $items) {
            // filter list items by tag
            var $filteredItems;
                
            filter = (window.location.hash) ? filter : 'all';

            window.location.hash = filter;

            if ( ( $.inArray( filter, tags ) !== -1 ) || filter === 'all' ) {
                if ( filter === 'all' ) {
                    $filteredItems = $items;
                } else {
                    $filteredItems = $items.has('ul.caption-tags li:containsNC(' + filter + ')');
                }
                
                addListItems($filteredItems);
            } else {
                $('<p></p>', {
                    text: 'no items match'
                }).appendTo($grid);
            }
        };

        if ( $grid.length ) {
            var hash = window.location.hash;

            $gridNav = $('.elr-grid-nav');
            $items = $grid.find('.elr-grid-item').hide();

            $(window).load(function() {
                var filter = hash ? hash.replace(/^#/, '') : null;

                tags = elr.toArray($grid.find('ul.caption-tags li'), true);

                addFilterButtons(tags);
                filterListItems(filter, $items);

                if ( typeof filter !== 'undefined' ) {
                    var $activeButton = $('button.elr-grid-filter[data-filter=' + filter + ']');

                    $activeButton.siblings('button').removeClass('active');
                    $activeButton.addClass('active');
                }
            });

            if ( flex === true ) {
                $(window).resize(function() {
                    positionListItems($items);
                    resizeOverlay();
                });
            }

            $(window).load(resizeOverlay);

            $grid.on('mouseenter', '.elr-grid-item', function() {
                $(this).find('.overlay').stop().fadeIn('fast');
            });

            $grid.on('mouseleave', '.elr-grid-item', function() {
                $(this).find('.overlay').stop().fadeOut('fast');
            });

            $gridNav.on('click', 'button.elr-grid-filter', function(e) {
                var $that = $(this);
                var filter = $that.data('filter').toLowerCase();
                
                filterListItems(filter, $items);
                $that.siblings('button').removeClass('active');
                $that.addClass('active');
                e.preventDefault();
            });

            $grid.on('click', '.caption-tags li', function(e) {
                var filter = $(this).data('filter').toLowerCase();
                
                filterListItems(filter, $items);
                $button = $gridNav.find('button[data-filter=' + filter + ']');
                $button.siblings('button').removeClass('active');
                $button.addClass('active');
                e.preventDefault();
            });
        }

        return self;
    };
})(jQuery);