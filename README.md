## focus-develop
```
a tool kit that for managing your react components
```
*****
### usage
```
npm install focus-develop --save-dev
```
### start 
* start your whole components
```
npx focusD
```
* start one component
```
npx focusD button // button must be in your src folder
```
### special
* mock.js 
```javascript
export default {
    fieldOne:'',
    fieldTwo:'',
};
```
tips:dont need to import your mock.js in your component file,focus-develop will do it for you

### notes
* your components folder must have a src folder,as we know.

### your components folder
![components-folder](https://s2.ax1x.com/2019/09/17/noefmV.png)

### detail of component
![detail-component](https://s2.ax1x.com/2019/09/19/nqrrrQ.png)

### support mock request
in your component folder 

### config file
we both know that,a config file is a chore thing,but here i have to add some config condition.
In your components folder,if you need,you can give it a config file that called focus.d.json
i will explain
* globalCss string|array
```javascript
//eg
    {
    "globalCss": [
        "antd/dist/antd.min.css" //or just "antd/dist/antd.min.css"  
    ]
}
```
*****
focus-develop use sass-loader to compile style file,but some ui framework use less,if you import some less file in you component style file,
that would cause some fatal error.but usually,a ui framework would give a global css file,that would work within focus-develop!
eg:antd/dist/antd.min.css

### support mock request 
in your component folder,you can give it a request folder,just like this.

<img src="https://s2.ax1x.com/2019/10/09/u4FnsI.png" width="260" />
<br/>

focus-develop will create some routes
eg:
```javascript
app.get('/button/request/doFetchGoodsList');
app.post('button/request/doFetchGoodsList');
```
then you can write some async request in your component file
```javascript
export default class DataChart extends React.Component{
    componentDidMount(){
        fetch('/button/request/doFetchGoodsList').then((res)=>{
            if(res.status>=200&&res.status<300){
                // you should check the mime-type
                return res.json();
            };
            throw new Error(res.statusText);
        }).then((res)=>{
            //do something
        });
    }
}
```
