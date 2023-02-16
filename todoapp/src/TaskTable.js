import React, { useState } from 'react';
import { Table, Input, Button, Space, Tag, Select, Modal, Form } from 'antd';


const { Column } = Table;
const { Search } = Input;
const { Option } = Select;

const initialData = [
  {
    id: 1,
    created_at: '2022-03-16 14:30:00',
    title: 'Complete project report',
    description: 'Write the final report for the project',
    due_date: '2022-03-30',
    tags: 'project, report',
    status: 'OPEN',
  },
  {
    id: 2,
    created_at: '2022-03-17 11:00:00',
    title: 'Prepare for presentation',
    description: 'Create the slides for the presentation',
    due_date: '2022-03-25',
    tags: 'presentation, project',
    status: 'WORKING',
  },
  {
    id: 3,
    created_at: '2022-03-17 14:30:00',
    title: 'Buy groceries',
    description: 'Get milk, bread, and eggs from the store',
    due_date: '2022-03-19',
    tags: 'groceries',
    status: 'DONE',
  },
];

const TaskTable = () => {
  const [data, setData] = useState(initialData);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [editedTask, setEditedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);




  const handleAdd = (newTask) => {
    const newData = [...data, newTask];
    setData(newData);
    setIsModalVisible(false);
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (task) => {
    setEditedTask(task);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    const newData = data.filter((task) => task.id !== id);
    setData(newData);
  };

  const handleSort = (column, sortOrder) => {
    const sortedData = data.sort((a, b) => {
      if (column === 'created_at' || column === 'due_date') {
        return sortOrder === 'asc'
          ? new Date(a[column]) - new Date(b[column])
          : new Date(b[column]) - new Date(a[column]);
      } else {
        return sortOrder === 'asc'
          ? a[column].localeCompare(b[column])
          : b[column].localeCompare(a[column]);
      }
    });
    setData(sortedData);
  };

  const handleFilter = (column, value) => {
    const filteredData = data.filter((task) =>
      task[column] && task[column].includes(value)
    );
    setData(filteredData);
  };

  const handleReset = () => {
    setData(initialData);
  };

  const handleSearch = (value) => {
    const searchData = initialData.filter((task) =>
      Object.values(task)
        .join(' ')
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setData(searchData);
  };
  const handleModalOk = (values) => {
    const newTask = {
      id: data.length + 1,
      created_at: new Date().toISOString(),
      ...values,
      status: 'OPEN',
    };
    handleAdd(newTask);
  };
  const handleSave =  (values) => {
    try {
      
      const updatedTask = { ...editedTask, ...values };
      handleEdit(updatedTask);
      setModalVisible(false);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  return (
    <>
        <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Task
        </Button>
        <Button onClick={handleReset}>Reset Table</Button>
        <Search
          placeholder="Search tasks"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
      </Space>
      <Table dataSource={data} pagination={{ pageSize: 10 }}>
      <Column
          title="Timestamp created"
          dataIndex="created_at"
          key="created_at"
          sorter={(a, b) => new Date(a.created_at) - new Date(b.created_at)}
        />
        <Column title="Title" dataIndex="title" key="title"  />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Due Date" dataIndex="due_date" key="due_date" />
        <Column title="Tag" dataIndex="tags" key="tags" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <a onClick={() => handleEdit(record)}>Edit</a>
              <a onClick={() => handleDelete(record.id)}>Delete</a>
            </Space>
          )}
        />
      </Table>
      <Modal
        title="Add Task"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form onFinish={handleModalOk}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="due_date" label="Due Date">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
  title="Edit Task"
  visible={modalVisible}
  onCancel={() => setModalVisible(false)}
  onOk={handleSave}
>
  <Form initialValues={editedTask} onFinish={handleSave}>
    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="description" label="Description">
      <Input.TextArea />
    </Form.Item>
    <Form.Item name="due_date" label="Due Date">
    <Input type="date" />
    </Form.Item>
    <Form.Item name="tags" label="Tags">
      <Input />
    </Form.Item>
    <Form.Item name="status" label="Status">
      <Select>
        <Option value="OPEN">Open</Option>
        <Option value="WORKING">Working</Option>
        <Option value="DONE">Done</Option>
      </Select>
    </Form.Item>
  </Form>
</Modal>

    </>
  );
};

export default TaskTable;