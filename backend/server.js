const express = require('express');
const app = express();
const apiRoutes = require('./routes/index'); 
const sequelize = require('./config/db');

app.use(express.json());
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Kết nối database thành công');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server đang chạy trên cổng ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Không thể kết nối database:', err);
  });