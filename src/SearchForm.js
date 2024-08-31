import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Space, message } from 'antd';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const SearchForm = () => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
    showTotal: (total) => `共 ${total} 条`,
    showLessItems: true,
  });

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    editForm.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    const row = await editForm.validateFields();
    
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.id);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setData(newData);
      setEditingKey('');
      await api.put(`/users/${key}`, row);
      message.success('用户信息更新成功');
    } else {
      newData.push(row);
      setData(newData);
      setEditingKey('');
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: 'name',
        title: '姓名',
        editing: isEditing(record),
      }),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      editable: true,
      onCell: (record) => ({
        record,
        inputType: 'number',
        dataIndex: 'age',
        title: '年龄',
        editing: isEditing(record),
      }),
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      editable: true,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: 'address',
        title: '地址',
        editing: isEditing(record),
      }),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button onClick={cancel}>取消</Button>
          </span>
        ) : (
          <Space size="middle">
            <Button onClick={() => edit(record)}>
              编辑
            </Button>
            <Button danger onClick={() => handleDelete(record.id)}>删除</Button>
          </Space>
        );
      },
    },
  ];

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <Input type="number" /> : <Input />;
    console.log(dataIndex);
    

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入 ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const fetchUsers = async (params = {}) => {
    const { data } = await api.get('/users', { params });
    setData(data.data);
    setPagination({
      ...pagination,
      total: data.total,
      current: params.page || 1,
    });
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    fetchUsers({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      ...searchForm.getFieldsValue(),
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    message.success('用户删除成功');
    fetchUsers({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...searchForm.getFieldsValue(),
    });
  };

  const onFinish = (values) => {
    fetchUsers({
      ...values,
      page: 1,
      pageSize: pagination.pageSize,
    });
  };

  useEffect(() => {
    fetchUsers({
      page: 1,
      pageSize: pagination.pageSize,
    });
  }, []);

  return (
    <div>
      <Form form={searchForm} onFinish={onFinish}>
        <Form.Item name="name" label="姓名">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item name="address" label="地址">
          <Input placeholder="请输入地址" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
      </Form>
      <Form form={editForm} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey="id"
        />
      </Form>
    </div>
  );
};

export default SearchForm;