import * as React from 'react';
import * as ReactDOM from 'react-dom';
import VPlayer from './../src/VPlayer';

const props = {
    source: [
        {url:'', type:'', quality:''},
    ]
};

ReactDOM.render(<VPlayer {...props} />, document.getElementById('root'));