###############################################################################
# Creates a Pinterest like sortable, draggable grid
###############################################################################
"use strict"

# adds case insensitive contains to jQuery

$.extend $.expr[":"], {
    "containsNC": (elem, i, match, array) ->
        (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0
}

class @DrmFlexibleGrid
    constructor: (@gridClass = 'drm-flexible-grid', @imagesPerRow = 4, @flex = true) ->
        self = @
        self.grid = $ ".#{self.gridClass}"
        self.gridNav = $ '.drm-grid-nav'
        self.items = self.grid.find '.drm-grid-item'

        $(window).load ->
            self.positionListItems()
            self.addFilterButtons()

        if self.flex 
            $(window).resize ->
                self.positionListItems()
                self.resizeCurtain()

        $(window).load self.resizeCurtain

        self.grid.on 'mouseenter', '.drm-grid-item', ->
            $(@).find('.curtain').stop().fadeIn 'fast'

        self.grid.on 'mouseleave', '.drm-grid-item', ->
            $(@).find('.curtain').stop().fadeOut 'fast'

        self.gridNav.on 'click', 'button.drm-grid-filter', ->
            that = $ @
            filter = that.data('filter').toLowerCase()
            self.filterListItems filter
            that.siblings('button').removeClass 'active'
            that.addClass 'active'

    capitalize: (str) ->
        str.toLowerCase().replace /^.|\s\S/g, (a) ->
            a.toUpperCase()

    addFilterButtons: =>
        self = @
        tags = []
        tagListItems = self.grid.find 'ul.caption-tags li'

        $.each tagListItems, (key, value) ->
            tag = $(value).text()
            tags.push self.capitalize tag
            $.unique tags

        $.each tags, (key, value) ->
            tagButton = $ '<button></button>',
                class: 'drm-grid-filter'
                text: value
                'data-filter': value.toLowerCase()
            tagButton.appendTo self.gridNav

        self.gridNav.find('.drm-grid-filter').first().addClass 'active'

    resizeCurtain: =>
        curtain = @grid.find '.curtain'

        $.each curtain, (key, value) ->
            that = $ value
            holder = that.parent '.drm-grid-item'
            imageHeight = holder.find('img').height()

            that.height(imageHeight).hide()

    resizeGrid: (items) =>
        self = @
        tallestColumn = 0
        columnHeights = []

        i = 0
        until i is self.imagesPerRow 
            columnHeights.push 0
            i = i + 1
        
        $.each items, (key, value) ->
            that = $ value
            columnNum = that.data 'column'
            height = that.outerHeight true

            columnHeights[columnNum] += height

        $.each columnHeights, (key, value) ->
            if value > tallestColumn
                tallestColumn = value
                tallestColumn

        self.grid.css 'height': tallestColumn + 40

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

        self.resizeGrid items

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