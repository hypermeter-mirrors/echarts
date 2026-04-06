/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

(function () {

    var _layersInfoMap = {};
    var _recordContainer;
    var CELL_MAX = 90;


    if (window.Canteen) {
        window.Canteen.globals.STACK_SIZE = 100000000;
    }
    else {
        console.log('canteen.js is not imported');
    }

    window.printIncrementalOnFrame = function (chart, frameNumber, recordContainer) {
        if (!_recordContainer) {
            _recordContainer = recordContainer;
            initContainer();
        }
        if (!chart) {
            return;
        }
        var layers = chart.getZr().painter.getLayers();
        for (var zlevel in layers) {
            if (layers.hasOwnProperty(zlevel)) {
                printIncremental(zlevel, layers[zlevel], frameNumber);
            }
        }
    }

    function initContainer() {
        _recordContainer.innerHTML = [
            '<div class="print-incremental-record-title">',
                'In "incremental layers" (layer N.01), ',
                'canvas instruction count (<span class="print-incremental-cmd-count">red number</span>) should be the same per frame;',
                '<br>In "normal layers" (layer N or layer N.2), should be no incremental canvas instructions per frame.',
            '</div>'
        ].join('');
        _recordContainer.className = 'print-incremental-record';
    }

    function printIncremental(zlevel, layer, frameNumber) {
        var layerInfo = _layersInfoMap[zlevel];
        if (!layerInfo) {
            layerInfo = _layersInfoMap[zlevel] = {
                recordLineCellCount: 0,
                recordLineTitle: document.createElement('div'),
                recordLineContainer: document.createElement('div')
            };
            var incrementalText = layer.incremental ? ' (incremental)' : '';
            layerInfo.recordLineTitle.innerHTML = 'layer ' + zlevel + incrementalText + ': <br>';
            layerInfo.recordLineTitle.className = 'print-incremental-record-line-title';
            layerInfo.recordLineContainer.className = 'print-incremental-record-line';
            _recordContainer.appendChild(layerInfo.recordLineTitle);
            _recordContainer.appendChild(layerInfo.recordLineContainer);
        }

        var canvas = layer.dom;
        var ctx = canvas.getContext('2d');
        var stackLength = getStackLength(ctx);
        var thisStackLength = stackLength;

        var cell;
        if (layerInfo.recordLineCellCount > CELL_MAX) {
            cell = layerInfo.recordLineContainer.firstChild;
        }
        else {
            cell = document.createElement('span');
            layerInfo.recordLineCellCount++;
        }
        cell.innerHTML = frameNumber + ':<span class="print-incremental-cmd-count">' + thisStackLength + '</span> ';
        layerInfo.recordLineContainer.appendChild(cell);

        clearStack(ctx);
    }

    function getStackLength(ctx) {
        return ctx.stack ? ctx.stack().length : 0;
    }

    function clearStack(ctx) {
        if (ctx.stack) {
            window.printIncrementalLastStack = ctx.stack().slice();
        }
        if (ctx.clear) {
            ctx.clear();
        }
    }

})();
