/**
 * 
 * @param {Array} treeData 
 * @param {Array} checkedKeys
 * @param {Array}  expandedKeys
 * @param {boolean} autoExpandParent 
 * @param {Function} onTreeCheck  
 * @return {component} TaskTreeList 
 * @author rainci(刘雨熙)
 */

import React from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;
/**
 * 
 * @param {Array} data 
 * @return {Array}
 * @author rainci(刘雨熙)
 */
export const generateList = (() => {//将多层级的数据处理成单层级的数据方法
    let dealData = [];
    return function dealDataFn(data = []) {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            dealData.push(node);
            if (node.children && node.children.length) {
                dealDataFn(node.children);
            }
        }
        return dealData;
    }
})();

/**
* 
* @param {Array} data 
* @param {Number} id
* @return {Array}
* @author rainci(刘雨熙)
*/
export const filterOneData = (id, data) => { //筛选符合id的一条数据
    let arr = [];
    for (let o of data) {
        if (o.tagId === id) {
            arr.push({ ...o })
            break;
        }
    }
    return arr
}

class TaskTreeList extends React.Component {
    constructor(props) {
        super(props)
        let {checkedKeys, expandedKeys, treeData} = props;
        this.state = {
            autoExpandParent: true, //是否自动展开
            checkedKeys: checkedKeys || [], //选择的keys
            expandedKeys: expandedKeys || [], //展开的keys
            treeData: treeData || [], //tree data
            sampleTreeData: generateList(treeData),//平级tree data            
        }
    }
    /***********公共方法 begin *****************/
    renderTreeNodes = data => { //渲染treeNode
        return data.map(item => {
            let { name, tagId, children, parentId } = item;
            if (children && children.length) {
                return (
                    <TreeNode title={name} key={tagId} dataRef={item} id={tagId} parentId={parentId} >
                        {this.renderTreeNodes(children)}
                    </TreeNode>
                )
            }
            return <TreeNode title={name} key={tagId} dataRef={item} id={tagId} parentId={parentId} />
        })
    }
    getParentIdAndName = ({ parentId, ids, names, sampleTreeData }) => {//获取父辈们的id和name
        if (parentId) {
            let parentItem = filterOneData(parentId, sampleTreeData);
            if (parentItem.length) {
                let { name, tagId, parentId } = parentItem[0];
                ids.unshift(tagId.toString())
                names.unshift(name)
                this.getParentIdAndName({ parentId, ids, names, sampleTreeData })
            }
        }
    }
    /***********公共方法 end *****************/
    /***********页面业务逻辑 begin *****************/
    onTreeCheck = (checkedKeys, e) => {//当checkbox被点击时
        //ids存放被选中的checkbox的id及它父辈们的id；names存放被选中的checkbox的name和它父辈们的name
        let ids = [], names = [];
        const { sampleTreeData } = this.state;
        if (e.checked) {//当为选中状态
            const { node: { props: { dataRef: { tagId, name, parentId } } } } = e;
            ids.unshift(tagId.toString());
            names.unshift(name)
            this.getParentIdAndName({ parentId, ids, names, sampleTreeData })
            this.setState({
                checkedKeys: ids
            })
        } else {
            this.setState({
                checkedKeys: []
            })
            ids.length = 0; names.length = 0;
        }
        this.props.onTreeCheck(ids, names)
    }

    onExpand = (expandedKeys) => {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    render() {
        const { autoExpandParent, checkedKeys, expandedKeys, treeData } = this.state;
        return (
            <div>
                <Tree
                    checkable={true}
                    checkStrictly={true}
                    autoExpandParent={autoExpandParent}
                    onCheck={this.onTreeCheck}
                    checkedKeys={{ 'checked': checkedKeys }}
                    expandedKeys={expandedKeys}
                    onExpand={this.onExpand}
                >
                    {this.renderTreeNodes(treeData)}
                </Tree>
            </div>
        )
    }
}
export default TaskTreeList;