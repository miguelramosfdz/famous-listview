/*
 * Copyright (c) 2014 Gloey Apps
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define*/

define(function(require) {
    'use strict';

    // import dependencies
    var Engine = require('famous/core/Engine');
    var RenderNode = require('famous/core/RenderNode');
    var Modifier = require('famous/core/Modifier');
    var Surface = require('famous/core/Surface');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var ListView = require('famous-listview');
    var BoxLayout = require('famous-boxlayout');

    // create the main context
    var mainContext = Engine.createContext();

    // create layout
    var renderables = [];
    var layout = new FlexibleLayout({
        ratios: [true, 1]
    });
    layout.sequenceFrom(renderables);
    mainContext.add(layout);

    // Create action-panel
    var panel = new RenderNode(new Modifier({size: [200, undefined]}));
    renderables.push(panel);
    panel.add(new Surface({classes: ['panel']}));
    var panelLayout = new SequentialLayout({
        direction: 1
    });
    var panelActions = [];
    panelLayout.sequenceFrom(panelActions);
    panel.add(panelLayout);
    function _addAction(name, callback) {
        var action = new RenderNode(new Modifier({size: [undefined, 40]}));
        var surface = new Surface({
            classes: ['action'],
            content: '<div>' + name + '</div>'
        });
        surface.on('click', callback.bind(this, name));
        action.add(surface);
        panelActions.push(action);
    }
    function _createListItem(name) {
        var listItem = new RenderNode(new Modifier({size: [undefined, 40]}));
        var surface = new Surface({
            classes: ['listitem'],
            content: '<div>' + name + '</div>',
            properties: {
                backgroundColor: Please.make_color()
            }
        });
        listItem.add(surface);
        return listItem;
    }

    // Create listview
    var boxLayout = new BoxLayout({margins: [30, 20, 20, 20]});
    var listView = new ListView();
    boxLayout.middle.add(listView);
    renderables.push(boxLayout);

    // Create counter
    var counter = new Surface({
        classes: ['counter']
    });
    boxLayout.top.add(counter);
    function _updateCounter() {
        counter.setContent('<div>Count: ' + listView.getCount() + '</div>');
    }
    listView.on('insert', _updateCounter);
    listView.on('remove', _updateCounter);
    _updateCounter();

    // Set listview placeholder (is shown when list-view is empty)
    var placeholder = new Surface({
        classes: ['placeholder'],
        content: '<div>The ListView is empty</div>'
    });
    listView.placeholder.add(placeholder);

    // Add actions
    _addAction('Insert top', function(name) {
        listView.insert(0, _createListItem(name));
    });
    _addAction('Insert middle', function(name) {
        listView.insert(listView.getCount() / 2, _createListItem(name));
    });
    _addAction('Insert bottom', function(name) {
        listView.insert(-1, _createListItem(name));
    });
    _addAction('Insert batch', function(name) {
        var items = [];
        for (var i = 0; i < 10; i++) {
            items.push(_createListItem(name));
        }
        listView.insert(listView.getCount() / 2, items);
    });
    _addAction('Remove top', function() {
        listView.remove(0);
    });
    _addAction('Remove middle', function() {
        listView.remove(Math.floor(listView.getCount() / 2));
    });
    _addAction('Remove bottom', function() {
        listView.remove(-1);
    });
    _addAction('Remove All', function() {
        listView.remove(0, listView.getCount());
    });

});