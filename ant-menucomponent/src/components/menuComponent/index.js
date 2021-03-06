/**
 * 
 * @param {Array} menuData  整个组件的data 
 * @param {Array} sampleMenuData 整个组件的平级数据
 * @param {Number} menuSideLine menuside分割线
 * @param {Object} menuSideStyle menuSide style
 * @param {Object} menuAlertStyle menuAlert style
 * @param {Function(Object={checkedKeys,leaf,relationLeaf})} menuDataCheckedFn  把选中的数据传递出去,checkedKeys为选中的id集, leaf为叶子节点,relationLeaf为关系数据集 
 * @return {component} MenuComponent 
 * @author rainci(刘雨熙)
 * @time 2019.3.22
 */
import React,  { Component }  from 'react';
import { message } from 'antd'
import shallowEqual from 'shallowequal';
import MenuSide  from './menu'
import MenuAlert from './menuAlert'
import { relationLeafFn, filterLeafFn } from './menuAlert/tool'

const boxStyle = {'position':'relative','zIndex':20};
class MenuComponent extends Component {
    state = {
            showMenuAlertFlag: false,//是否展示弹框 
            menuLightData:this.props.menuCheckedKeys || []//高亮的id集   
        }
    /***********公共方法 begin *****************/
    setStateValueFn = (key, value) => {//为state设置新的value
        this.setState({
            [key]: value
        })
    }
    /***********公共方法 end *****************/
    /***********业务方法 begin *****************/
    subMenuItemFn = key => {//左侧menu click cb fn
        let menuAlertData =  this.props.sampleMenuData.get(key*1).children;
        if(menuAlertData && menuAlertData.length){
            this.setState({
                showMenuAlertFlag: true,
                menuAlertData: this.props.sampleMenuData.get(key*1).children
            })
        }else{
            if(this.state.showMenuAlertFlag){
                this.setStateValueFn('showMenuAlertFlag',false)
            }
            message.warn('仅有一级标签')
        }
    }
    resetCheckedKeysFn= keys => {//一级左侧menu导航点击文字时触发的函数
        this.menuLightData = keys;
        let {sampleMenuData=new Map()} = this.props;
        let leaf = filterLeafFn({data:keys,sampleMenuData})
        let relationLeaf = relationLeafFn({leaf,sampleMenuData})
        this.props.menuDataCheckedFn && this.props.menuDataCheckedFn({checkedKeys:keys,leaf,relationLeaf})
    }
    menuAlertClickFn = ({checkedKeys,leaf, relationLeaf}) => {//menualert click fn
        this.menuLightData = checkedKeys;
        // this.setStateValueFn('menuLightData',checkedKeys)//alert 弹框将选中的parent id传出来供左侧menu使用，点亮左侧menu对应的id
        this.props.menuDataCheckedFn && this.props.menuDataCheckedFn({checkedKeys,leaf,relationLeaf})
    }
    menuAlertCloseFn = () => {//关闭menu弹框 fn
        this.setStateValueFn('showMenuAlertFlag',false)
    }
    getOriginCheckedData = () => { //默认传入checkedkeys时,返回的数据
        let {sampleMenuData=new Map()} = this.props;
        let { menuLightData } = this.state;
        let leaf = filterLeafFn({data:menuLightData,sampleMenuData})
        let relationLeaf = relationLeafFn({leaf,sampleMenuData})
        this.props.menuDataCheckedFn && this.props.menuDataCheckedFn({checkedKeys:menuLightData,leaf,relationLeaf})    
    }
    mouseLeaveFn = () => {//鼠标进入
        this.mouseFlag = false
    }
    mouseEnterFn = () => {//鼠标离开
        this.mouseFlag = true  
    }
    bindBodyClickFn = () => {//为body绑定事件
        document.body.addEventListener('click', e => {
            let { showMenuAlertFlag } = this.state;
            if(showMenuAlertFlag && !this.mouseFlag) {
                this.setStateValueFn('showMenuAlertFlag',false)    
            } 
        });      
    }
    removeBodyClickFn = () => {//为body remove事件
        // document.body.removeEventListener('click');
        document.body.removeEventListener('click', e => {});
    }
    /***********业务方法 end *****************/
    /***********生命周期 begin **************/
    componentDidMount(){
        this.getOriginCheckedData()
        this.bindBodyClickFn()//为body绑定事件         
    }
    componentWillReceiveProps(nextProps) {
        // debugger
        const { menuCheckedKeys = [],sampleMenuData=new Map() } = nextProps;
        this.menuLightData = menuCheckedKeys;
        if(sampleMenuData && sampleMenuData.size){
            this.checkedWork(menuCheckedKeys,sampleMenuData)
        }
        
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !shallowEqual(this.props, nextProps)
            || !shallowEqual(this.state, nextState);

    }
    componentWillUnmount(){
        this.removeBodyClickFn()//为body remove事件
    }
    /***********生命周期 end **************/
    render(){
        console.log('i am totle render')
        let {menuLightData} = this;
        let { showMenuAlertFlag, menuAlertData } = this.state;
        let {menuData=[], sampleMenuData=new Map(),menuSideStyle, menuAlertStyle, menuSideLine=6  } = this.props;
        return (
            <div className='menuComponentBox' style={boxStyle} 
                onMouseLeave={this.mouseLeaveFn}
                onMouseEnter={this.mouseEnterFn}
            >  
                <MenuSide 
                    menuSideStyle = {menuSideStyle} //menu style
                    menuSideData = {menuData} //menu data
                    sampleMenuData = {sampleMenuData}//平级所有menu数据
                    menuLightData = {menuLightData}//高亮data
                    menuSideLine={menuSideLine} //分割线
                    subMenuFn = {this.subMenuItemFn}//menu icon点击事件 
                    subMenuCheckFn = {this.resetCheckedKeysFn}//menuitem 本身点击事件
                />
                {
                    showMenuAlertFlag ? 
                    <MenuAlert
                        menuAlertData = {menuAlertData}//当前点开弹框的数据
                        sampleMenuData = {sampleMenuData}//平级所有menu数据
                        closeFn = {this.menuAlertCloseFn}//弹框关闭回调
                        memuCheckedFn= {this.menuAlertClickFn}//点击menu item回调
                        checkedKeys = {menuLightData}//选中高亮的数据
                        menuAlertStyle = {menuAlertStyle}//alert弹框样式
                    />
                    : null
                }

            </div>
        )
    }
}
export default MenuComponent