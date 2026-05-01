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

import { EChartsType } from '@/src/echarts';
import ChordSeriesModel from '@/src/chart/chord/ChordSeries';
import { createChart, getECModel } from '../../core/utHelper';

describe('series/chord', function () {

    let chart: EChartsType;

    beforeEach(function () {
        chart = createChart();
    });

    afterEach(function () {
        chart.dispose();
    });

    it('supports radial label rotation', function () {
        chart.setOption({
            series: {
                type: 'chord',
                startAngle: 0,
                padAngle: 0,
                label: {
                    show: true,
                    rotate: 'radial'
                },
                data: [
                    {name: 'a'},
                    {name: 'b'}
                ],
                edges: [{
                    source: 'a',
                    target: 'b',
                    value: 1
                }]
            }
        });

        const seriesModel = getECModel(chart).getSeriesByType('chord')[0] as ChordSeriesModel;
        const data = seriesModel.getData();
        const textContent = data.getItemGraphicEl(0).getTextContent();
        const layout = data.getItemLayout(0);
        const midAngle = (layout.startAngle + layout.endAngle) / 2;
        const expectedRotation = Math.cos(midAngle) < 0 ? -midAngle + Math.PI : -midAngle;

        expect(textContent.rotation).toBeCloseTo(expectedRotation);
    });

});
