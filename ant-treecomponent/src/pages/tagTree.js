import React, { Component } from 'react';
import { Tag } from 'antd';
import TaskTagTreeList from '../components/tree/index';
import { connect } from 'react-redux';
import { tagCheckedKeys } from '../redux/actions';
const treeDatas = [
  {
    name: '顶部',
    tagId: 1,
    parentId: 0,
    children: [
      {
        name: '人物',
        tagId: 11,
        parentId: 1,
        children: [
          {
            name: '奥巴马',
            tagId: 111,
            parentId: 11,
          },
          {
            name: '特朗普',
            tagId: 112,
            parentId: 11,
          }
        ]
      },
      {
        name: '动物',
        tagId: 12,
        parentId: 1,
        children: [
          {
            name: '老虎',
            tagId: 121,
            parentId: 12,
          },
          {
            name: '狮子',
            tagId: 122,
            parentId: 12,
          }
        ]
      }
    ]
  }
];
class TagTree extends Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [],
      bfcheckedKeys: [],
      checkedKeys: [],
      expandedKeys: [],
      initKeys: false,
      transformTagData: ['老虎', '狮子']
    }
  }
  /***************************页面业务逻辑 begin ******************************/
  treeCheckFn = ({ checkedKeys, relationLeaf, checkedTagList }) => { //every time check tree
    console.log('outercheckd:', checkedKeys, relationLeaf, checkedTagList)
    this.props.onTagCheckedkeys(checkedKeys)
    this.setState({
      checkedKeys
    })
  }
  deleteTag = () => { // delete tags
    this.setState({
      checkedKeys: ['1'],
      initKeys: true
    })
  }
  deleteTag2 = () => { // delete tags
    this.setState({
      checkedKeys: ['1'],
      initKeys: true
    })
  }
  eachTagClose = e => {
    e.preventDefault();
    console.log(e)
  }
  /***************************页面业务逻辑 end ******************************/
  /***********生命周期 begin **************/
  componentDidMount() {
    this.setState({
      treeData: treeDatas,
      expandedKeys: ['1'],
      checkedKeys: ['1', '11'],
    })
  }
  /***********生命周期 end **************/
  render() {
    let { expandedKeys, checkedKeys, treeData, initKeys } = this.state;
    return (
      <div >
        <TaskTagTreeList
          treeData={treeData}
          onTreeCheck={this.treeCheckFn}
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          initKeys={initKeys}
        />

        {/* {
            this.state.transformTagData.map((item,key) => {
              return <Tag closable key={key} id={key} onClose={this.eachTagClose}>{item}</Tag>
            })
          } */}
        <Tag onClick={this.deleteTag}>delete</Tag>
        <Tag onClick={this.deleteTag2}>delete2</Tag>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return ({
    tagCheckedKeys: state.tagCheckedKeys
  })
}
const mapDispatchToProps = dispatch => ({
  onTagCheckedkeys: (selectedKeys) => dispatch(tagCheckedKeys(selectedKeys)),
})

export default connect(mapStateToProps,mapDispatchToProps)(TagTree)