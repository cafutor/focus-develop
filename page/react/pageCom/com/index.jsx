import React from 'react';
import { Link } from 'react-router-dom';
import focus from 'focus-center';
import ReactMarkDown from 'react-markdown';
import marked from 'marked';
import hljs from 'highlight.js';
import 'whatwg-fetch';
import ComsMap from '../../../../comsMap';
import './index.scss';

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    },
});


@focus
class Com extends React.Component {
    static displayName = 'Com';
    constructor(props) {
        super(props);
        this.state = {
            mdString: '',
        };
    };
    componentDidMount() {
        const { computedMatch } = this.props;
        fetch(`/fetchReadme?componentName=${computedMatch.params.comName}`, {
            method: 'GET',
        }).then((res) => {
            if (res.status >= 200 && res.status < 300) {
                return res.json();
            }
        }).then((result) => {
            this.setState({
                mdString: result.data,
            });
        });
    };
    render() {
        const { computedMatch } = this.props;
        const Com = ComsMap[computedMatch.params.comName].com;
        const modckData = ComsMap[computedMatch.params.comName].mockData;
        const { mdString } = this.state;
        return (<div className="com-container">
            <div className="com-scope">
                {typeof Com === 'function' ? (modckData ? <Com {...modckData} /> : <Com />) : <span className="un-fullfilled-text">组件不符合规范</span>}
            </div>
            {mdString ? (<div className="markdown-scope">
                <div className="markdown-main-scope" dangerouslySetInnerHTML={{ __html: marked(this.state.mdString) }}>
                    {/* <ReactMarkDown source={this.state.mdString} /> */}
                </div>
            </div>) : null}
            <div className="action-scope">
                <div className="link-button">
                    <Link to="/">返回</Link>
                </div>
            </div>
        </div>);
    }
};
export default Com;

