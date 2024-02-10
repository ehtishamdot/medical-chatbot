"use client";
import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Chart = props => {
    const {
        data1,
        data3,
        colors: {
            backgroundColor = 'white',
            lineColor = '#5E63CA',
            textColor = 'black',
            areaTopColor = 'rgba(204, 212, 253, 1)',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(
        () => {
            const handleResize = () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            };

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                width: chartContainerRef.current.clientWidth,
                height: 300,
            });
            chart.timeScale().fitContent();


            const newSeries3 = chart.addAreaSeries({ lineColor, topColor: '#f5d0fe', bottomColor: '#f5d0fe' });
            newSeries3.setData(data3);
            const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
            newSeries.setData(data1);

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        },
        [data1,data3, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
    );
    return (
        <>
            <div className={'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center mb-2 gap-4 text-sm'}>
                <div className={'flex items-center gap-2'}>
                    <div className="w-4 h-4 bg-[#f5d0fe] rounded-full"></div>
                    <p>Overall Utilization</p>
                </div>
                <div className={'flex items-center gap-2'}>
                    <div className="w-4 h-4 bg-[#ccd4fd] rounded-full"></div>
                    <p>Bot Usage</p>
                </div>
            </div>
            <div
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                // @ts-ignore
                ref={chartContainerRef}
            />
        </>

    );
};
