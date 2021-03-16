import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Table } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import { Checkbox, Divider, Button } from 'antd';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const columns = [
  {
    title: 'Sort',
    dataIndex: 'sort',
    width: 57,
    className: 'drag-visible',
    render: () => <DragHandle />,
  },
  {
    title: 'Разделы',
    dataIndex: 'name',
    //width: 80,
    className: 'drag-visible',
  },
 //{
   // title: 'Action',
    //dataIndex: 'Action',
  //},

];

function callback(key) {
  console.log(key);
}

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

function onChange(value) {
  console.log(value);
}

const data = [
  {
    key: '1',
    name: <Checkbox defaultChecked disabled>Ведомости</Checkbox>,
    index: 0,
  },
  {
    key: '2',
    name: <Checkbox defaultChecked disabled>Настройки</Checkbox>,
    index: 1,
  },
  {
    key: '3',
    name: <Checkbox onChange={onChange}>Графики</Checkbox>,
    index: 2,
  },
  {
    key: '4',
    name: <Checkbox onChange={onChange}>Кадр</Checkbox>,
    index: 3,
  },
  {
    key: '5',
    name: <Checkbox onChange={onChange}>Мнемосхемы</Checkbox>,
    index: 4,
  },
];

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record) => ({
    disabled: record.key == 2,
    // Column configuration not to be checked
    key: record.key,
  }),
   
};

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class SortableTable extends React.Component {
  state = {
    dataSource: data,
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      console.log('Sorted items: ', newData);
      this.setState({ dataSource: newData });
    }
  };

  DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  render() {
    const { dataSource } = this.state;

    return (
      <Table
              
        dataSource={dataSource}
        columns={columns}
        rowKey="index"
        components={{
          body: {
            wrapper: this.DraggableContainer,
            row: this.DraggableBodyRow,
          },
        }}
         rowSelection={{
          type: Checkbox,
          ...rowSelection,
        }}
        scroll={{ y: 240 }}
      />
    );
  }
}



ReactDOM.render(
  <>
    <SortableTable />
    <Button type="primary">Применить</Button>
    <Button type="primary">Отмена</Button>
  </>,
document.getElementById('container'));
