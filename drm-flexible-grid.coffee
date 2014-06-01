###############################################################################
# Creates a Pinterest like sortable, draggable grid
###############################################################################
"use strict"

( ($) ->
    class window.DrmFlexibleGrid
        constructor: (@gridClass = 'drm-flexible-grid', @imagesPerRow = 4, @flex = true) ->
            @grid = $ ".#{@gridClass}"
            @images = @grid.find 'img'

            $(window).load @positionListItems

            if @flex then $(window).resize @positionListItems
            # @images.on 'load', @positionListItem

            $(window).load @resizeCurtain

            @grid.on 'mouseenter', 'li', ->
                $(@).find('.curtain').stop().fadeIn 'fast'

            @grid.on 'mouseleave', 'li', ->
                $(@).find('.curtain').stop().fadeOut 'fast'

        resizeCurtain: =>
            curtain = @grid.find '.curtain'

            $.each curtain, (key, value) ->
                that = $ value
                holder = that.parent 'li'
                imageHeight = holder.find('img').height()

                that.height(imageHeight).hide()

        positionListItems: =>
            self = @
            items = self.grid.find 'li'

            $.each items, (key, value) ->
                that = $ value
                index = key + 1
                columnNum = if index % self.imagesPerRow is 0 then self.imagesPerRow - 1 else (index % self.imagesPerRow) - 1
                that.attr 'data-column', columnNum
                prevImage = if index > self.imagesPerRow then self.grid.find('li').eq(index - (self.imagesPerRow + 1)) else null
                
                if prevImage
                    margin = prevImage.outerWidth(true) - prevImage.outerWidth(false)
                    top = if index < ((self.imagesPerRow * 2) + 1) then prevImage.outerHeight(false) + margin else prevImage.outerHeight(false) + margin + prevImage.position().top
                    left = (prevImage.outerWidth(false) * columnNum) + (margin * columnNum)

                    that.css
                        'top': top
                        'left': left
                        'position': 'absolute'

                that.fadeIn 1000

            @grid.css 'height': (items.last().outerHeight(true) + items.last().position().top) + 500

        positionListItem: ->
            that = $ @
            item = that.closest 'li'
            grid = item.closest 'ul'
            index = item.index()

            console.log index
    
    new DrmFlexibleGrid()

) jQuery