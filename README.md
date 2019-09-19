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
