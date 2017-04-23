import React from 'react';
import ReactIScroll from 'react-iscroll';
import iScroll from 'iscroll';

export default ({children}) => (
    <ReactIScroll
        iScroll={iScroll}
        options={{
            mouseWheel: true,
            fadeScrollbars: true,
            scrollbars: true
        }}
    >
        {children}
    </ReactIScroll>
);
