import elrUtlities from 'elr-utility-lib';
import elrUI from 'elr-ui';
const $ = require('jquery');

let elr = elrUtlities();
let ui = elrUI();

$.extend($.expr[':'], {
    containsNC: function(elem, i, match) {
        return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0;
    }
});

const elrFilterGrid = function({
    gridClass = 'elr-flexible-grid'
} = {}) {
    const self = {
        $grid: $(`.${gridClass}`),
        addListItems($items) {
            this.$grid.empty();
            $items.appendTo(this.$grid);
        },
        filterListItems(filter, $items, tags) {
            // filter list items by tag
            let $filteredItems;

            window.location.hash = filter;

            if (($.inArray(filter, tags) !== -1) || filter === 'all') {
                if (filter === 'all') {
                    $filteredItems = $items;
                } else {
                    $filteredItems = $items.has(`ul.caption-tags li:containsNC(${filter})`);
                }

                this.addListItems($filteredItems);
            } else {
                ui.createElement('p', {
                    text: 'no items match'
                }).appendTo(this.$grid);
            }
        },
        addFilterButtons(tags, $nav) {

            $.each(tags, function(k, v) {
                const $tagButton = ui.createElement('button', {
                    'class': 'elr-button elr-button-primary elr-grid-filter',
                    'text': elr.capitalize(v),
                    'data-filter': v
                });

                $tagButton.appendTo($nav);
            });

            $nav.find('.elr-grid-filter').first().addClass('active');
        },
        setActiveButton(button, $buttons) {
            const $button = $buttons.find(`button[data-filter=${button}]`);

            $button.siblings('button').removeClass('active');
            $button.addClass('active');
        }
    };

    if (self.$grid.length) {
        const hash = window.location.hash;
        const $gridNav = $('.elr-grid-nav');
        const $items = self.$grid.find('.elr-grid-item');
        const tags = elr.unique(elr.toArray(self.$grid.find('ul.caption-tags li')));
        let filter;

        filter = (window.location.hash) ? filter : 'all';

        $(window).on('load', function() {
            self.addFilterButtons(tags, $gridNav);

            if (hash) {
                self.filterListItems(hash.slice(1), $items, tags);
                self.setActiveButton(hash.slice(1), $gridNav);
            }

            if (typeof filter !== 'undefined') {
                self.setActiveButton('all', $gridNav);
            }
        });

        $gridNav.on('click', 'button.elr-grid-filter', function(e) {
            e.preventDefault();
            const $that = $(this);
            const filter = $that.data('filter').toLowerCase();

            self.filterListItems(filter, $items, tags);
            self.setActiveButton(filter, $gridNav);
        });

        self.$grid.on('click', '.caption-tags li', function(e) {
            e.preventDefault();
            const filter = $(this).data('filter').toLowerCase();

            self.filterListItems(filter, $items, tags);
            self.setActiveButton(filter, $gridNav);
        });
    }

    return self;
};

export default elrFilterGrid;