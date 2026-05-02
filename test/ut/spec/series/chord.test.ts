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

    it('converts numeric label rotation from degrees to radians', function () {
        chart.setOption({
            series: {
                type: 'chord',
                label: {
                    show: true,
                    rotate: 45
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
        const textContent = seriesModel.getData().getItemGraphicEl(0).getTextContent();

        expect(textContent.rotation).toBeCloseTo(Math.PI / 4);
    });

    it('applies state label rotation', function () {
        chart.setOption({
            series: {
                type: 'chord',
                startAngle: 0,
                padAngle: 0,
                label: {
                    show: true,
                    rotate: 0
                },
                emphasis: {
                    label: {
                        rotate: 'radial'
                    }
                },
                blur: {
                    label: {
                        rotate: 30
                    }
                },
                select: {
                    label: {
                        rotate: 45
                    }
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

        expect(textContent.rotation).toBeCloseTo(0);
        expect(textContent.states.emphasis.rotation).toBeCloseTo(expectedRotation);
        expect(textContent.states.blur.rotation).toBeCloseTo(Math.PI / 6);
        expect(textContent.states.select.rotation).toBeCloseTo(Math.PI / 4);
    });

    it('clears stale state label rotation on option update', function () {
        const option = {
            series: {
                type: 'chord',
                label: {
                    show: true,
                    rotate: 0
                },
                emphasis: {
                    label: {
                        rotate: 45
                    }
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
        };
        chart.setOption(option);

        let seriesModel = getECModel(chart).getSeriesByType('chord')[0] as ChordSeriesModel;
        let textContent = seriesModel.getData().getItemGraphicEl(0).getTextContent();
        const oldTextContent = textContent;

        expect(textContent.states.emphasis.rotation).toBeCloseTo(Math.PI / 4);

        chart.setOption({
            series: {
                ...option.series,
                emphasis: {
                    label: {
                        rotate: null
                    }
                }
            }
        });

        seriesModel = getECModel(chart).getSeriesByType('chord')[0] as ChordSeriesModel;
        textContent = seriesModel.getData().getItemGraphicEl(0).getTextContent();

        expect(textContent).toBe(oldTextContent);
        expect(textContent.rotation).toBeCloseTo(0);
        expect(textContent.states.emphasis.rotation).toBeNull();

        textContent.useState('emphasis', false, true);
        expect(textContent.rotation).toBeCloseTo(0);
    });

});
