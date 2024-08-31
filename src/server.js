const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;
app.use(cors());

app.use(bodyParser.json());

// 模拟数据库
let users = [
    { id: 1, name: '张三', age: 25, address: '北京市海淀区' },
    { id: 2, name: '李四', age: 30, address: '上海市浦东新区' },
    { id: 3, name: '王五', age: 28, address: '广州市天河区' },
    { id: 4, name: '赵六', age: 35, address: '深圳市南山区' },
    { id: 5, name: '钱七', age: 22, address: '杭州市西湖区' },
    { id: 6, name: '孙八', age: 40, address: '成都市武侯区' },
    { id: 7, name: '周九', age: 33, address: '武汉市江汉区' },
    { id: 8, name: '吴十', age: 27, address: '南京市鼓楼区' },
    { id: 9, name: '郑十一', age: 29, address: '重庆市渝中区' },
    { id: 10, name: '王十二', age: 32, address: '苏州市姑苏区' },
    { id: 11, name: '冯十三', age: 31, address: '青岛市市南区' },
    { id: 12, name: '陈十四', age: 26, address: '天津市和平区' },
    { id: 13, name: '褚十五', age: 24, address: '无锡市滨湖区' },
    { id: 14, name: '卫十六', age: 23, address: '常州市新北区' },
    { id: 15, name: '蒋十七', age: 34, address: '石家庄市长安区' },
    { id: 16, name: '沈十八', age: 36, address: '太原市小店区' },
    { id: 17, name: '韩十九', age: 37, address: '长沙市芙蓉区' },
    { id: 18, name: '杨二十', age: 38, address: '郑州市中原区' },
    { id: 19, name: '朱二十一', age: 39, address: '合肥市庐阳区' },
    { id: 20, name: '秦二十二', age: 41, address: '南昌市东湖区' },
    { id: 21, name: '尤二十三', age: 42, address: '福州市鼓楼区' },
    { id: 22, name: '许二十四', age: 43, address: '贵阳市南明区' },
    { id: 23, name: '何二十五', age: 44, address: '昆明市盘龙区' },
    { id: 24, name: '吕二十六', age: 45, address: '兰州市城关区' },
    { id: 25, name: '施二十七', age: 46, address: '银川市兴庆区' },
    { id: 26, name: '张二十八', age: 47, address: '西宁市城中区' },
    { id: 27, name: '孔二十九', age: 48, address: '乌鲁木齐市天山区' },
    { id: 28, name: '曹三十', age: 49, address: '拉萨市城关区' },
    { id: 29, name: '严三十一', age: 50, address: '呼和浩特市新城区' },
    { id: 30, name: '华三十二', age: 51, address: "南宁市青秀区" }

  ];

// 获取所有用户
app.get('/api/users', (req, res) => {
    const { page = 1, pageSize = 5, name, address } = req.query;
    let filteredUsers = users;
  
    if (name) {
      filteredUsers = filteredUsers.filter(user => user.name.includes(name));
    }
    if (address) {
      filteredUsers = filteredUsers.filter(user => user.address.includes(address));
    }
  
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
    res.json({
      total: filteredUsers.length,
      data: paginatedUsers
    });
  });

// 获取单个用户
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: '用户不存在' });
  }
});

// 创建新用户
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 更新用户
app.put('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body };
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: '用户不存在' });
  }
});

// 删除用户
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: '用户不存在' });
  }
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});