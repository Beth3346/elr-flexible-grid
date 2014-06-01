###############################################################################
# Creates a Pinterest like sortable, draggable grid
###############################################################################
"use strict"

# adds case insensitive contains to jQuery

$.extend $.expr[":"], {
    "containsNC": (elem, i, match, array) ->
        (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0
}

( ($) ->
    class window.DrmFlexibleGrid
        constructor: (@gridClass = 'drm-flexible-grid', @imagesPerRow = 4, @flex = true) ->
            self = @
            self.grid = $ ".#{self.gridClass}"
            self.gridNav = $ '.drm-grid-nav'
            self.items = self.grid.find '.drm-grid-item'

            $(window).load self.positionListItems

            if self.flex then $(window).resize self.positionListItems

            $(window).load self.resizeCurtain

            self.grid.on 'mouseenter', '.drm-grid-item', ->
                $(@).find('.curtain').stop().fadeIn 'fast'

            self.grid.on 'mouseleave', '.drm-grid-item', ->
                $(@).find('.curtain').stop().fadeOut 'fast'

            self.gridNav.on 'click', 'button.drm-grid-filter', ->
                filter = $(@).data('filter').toLowerCase()
                self.filterListItems filter

        resizeCurtain: =>
            curtain = @grid.find '.curtain'

            $.each curtain, (key, value) ->
                that = $ value
                holder = that.parent '.drm-grid-item'
                imageHeight = holder.find('img').height()

                that.height(imageHeight).hide()

        positionListItems: =>
            self = @
            items = self.grid.find '.drm-grid-item'

            $.each items, (key, value) ->
                that = $ value
                index = key + 1
                columnNum = if index % self.imagesPerRow is 0 then self.imagesPerRow - 1 else (index % self.imagesPerRow) - 1
                that.attr 'data-column', columnNum
                that.attr 'data-num', index
                prevImage = if index > self.imagesPerRow then self.grid.find('.drm-grid-item').eq(index - (self.imagesPerRow + 1)) else null
                # captionTitle = that.find '.caption h1'
                # subTitle = that.find('.caption-sub-title').remove()
                # subTitle = $('<h2></h2>',
                #     class: 'caption-sub-title'
                #     text: "Image: #{index}").insertAfter captionTitle
                
                if prevImage?
                    margin = prevImage.outerWidth(true) - prevImage.outerWidth(false)
                    top = if index < ((self.imagesPerRow * 2) + 1) then prevImage.outerHeight(false) + margin else prevImage.outerHeight(false) + margin + prevImage.position().top
                    left = (prevImage.outerWidth(false) * columnNum) + (margin * columnNum)

                    that.css
                        'top': top
                        'left': left
                        'position': 'absolute'
                else
                    that.css
                        'top': 0
                        'left': 0
                        'position': 'relative'                    

                that.fadeIn 1000

            @grid.css 'height': (items.last().outerHeight(true) + items.last().position().top) + 500

        filterListItems: (filter) =>
            self = @
            self.grid.empty()

            if filter is 'all'
                $.each self.items, (key, value) ->
                    that = $ value
                    that.appendTo(self.grid).hide()
            else
                $.each self.items, (key, value) ->
                    that = $ value
                    tagList = that.find 'ul.caption-tags'

                    hasTag = if tagList.has("li:containsNC(#{filter})").length isnt 0 then true else false

                    if hasTag then that.appendTo(self.grid).hide()

            self.positionListItems()
    
    new DrmFlexibleGrid()

) jQuery