import React from 'react';
import focus from 'focus-center';
import { Link } from 'react-router-dom';
import ComsMap from '../../../../comsMap';
import './index.scss';

@focus
class ComList extends React.Component {
    static displayName = 'ComList';
    matchComsList(comsMap) {
        return Object.keys(comsMap).map((key) => {
            return {
                name: key,
            };
        });
    }
    render() {
        const comsList = this.matchComsList(ComsMap);
        return (<div className="page-container">
            {comsList.map((el, index) => {
                return (<div className="com-contain" key={index}>
                    <div className="com-detail">
                        <span className="com-name">
                            组件名:
                        </span>
                        {el.name}
                    </div>
                    <div className="link-contain">
                        <Link to={`/${el.name}`} >详情</Link>
                    </div>
                </div>);
            })}
        </div>);
    }
};

export default ComList;