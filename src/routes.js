import express from 'express';
import multer from 'multer';

import AvatarController from './app/controllers/AvatarController';
import CommentController from './app/controllers/CommentController';

import CustomerSessionController from './app/controllers/customer/CustomerSessionController';
import CustomerController from './app/controllers/customer/CustomerController';
import PetController from './app/controllers/customer/PetController';
import AppointmentController from './app/controllers/customer/AppointmentController';
import AvailableController from './app/controllers/customer/AvailableController';
import DescountController from './app/controllers/customer/DescountController';
import LikeController from './app/controllers/customer/LikeController';
import ForgotPassController from './app/controllers/customer/ForgotPassController';
import CustomerPostController from './app/controllers/customer/PostController';

import PurchaseController from './app/controllers/company/PurchaseController';
import CompanyCustomerController from './app/controllers/company/CustomerController';
import CompanyAppointmentController from './app/controllers/company/AppointmentController';
import EmployeeController from './app/controllers/company/EmployeeController';
import CompanyPetController from './app/controllers/company/PetController';
import CompanySessionController from './app/controllers/company/SessionController';
import PostController from './app/controllers/company/PostController';
import NotificationController from './app/controllers/company/NotificationController';

import auth from './app/middlewares/auth';
import access from './app/middlewares/access';
import employee from './app/middlewares/employee';
import multerConfig from './config/multer';
import AppointmentByMonth from './app/controllers/company/AppointmentByMonth';

const routes = express.Router();
const upload = multer(multerConfig);

routes.get('/connection/verify', (request, response) =>
  response.json({ connection: true })
);

routes.post('/customer/session', CustomerSessionController.create);
routes.post('/company/session', CompanySessionController.create);
routes.get('/appointment/available', AvailableController.show);

routes.post('/customer', upload.single('avatar'), CustomerController.create);

routes.get('/customer/forgotpass', ForgotPassController.get);
routes.post('/customer/forgotpass', ForgotPassController.create);

routes.use(auth);

routes.get('/customer/me', CustomerController.show);
routes.put('/customer', CustomerController.update);
routes.patch(
  '/avatar/:target_id',
  upload.single('avatar'),
  AvatarController.update
);

routes.post('/customer/pet', upload.single('avatar'), PetController.create);
routes.get('/customer/pet', PetController.index);
routes.put('/customer/pet/:id', PetController.update);
routes.delete('/customer/pet/:id', PetController.delete);

routes.post('/customer/appointment', AppointmentController.create);
routes.get('/customer/appointment', AppointmentController.index);
routes.delete('/customer/appointment/:id', AppointmentController.delete);

routes.post('/customer/post/like', LikeController.create);
routes.delete('/customer/post/like', LikeController.delete);

routes.get('/descount', DescountController.show);

routes.get('/posts', CustomerPostController.index);
routes.post('/posts/comment', CommentController.create);
routes.get('/posts/comment', CommentController.index);
routes.delete('/posts/comment/:comment_id', CommentController.delete);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications', NotificationController.updateMany);
routes.get('/company/post', PostController.index);

routes.use(employee);

routes.get('/employee/me', EmployeeController.show);

routes.get('/company/customer', CompanyCustomerController.index);
routes.get('/company/customer/:id', CompanyCustomerController.show);
routes.put('/company/customer/:customer_id', CompanyCustomerController.update);
routes.delete(
  '/company/customer/:customer_id',
  CompanyCustomerController.delete
);

routes.post(
  '/company/pet',
  upload.single('avatar'),
  CompanyPetController.create
);
routes.get('/company/pet', CompanyPetController.index);
routes.put('/company/pet/:id', CompanyPetController.update);
routes.delete('/company/pet/:id', CompanyPetController.delete);

routes.post('/company/appointment', CompanyAppointmentController.create);
routes.get('/company/appointment', CompanyAppointmentController.index);
routes.put('/company/appointment/:id', CompanyAppointmentController.update);
routes.delete('/company/appointment/:id', CompanyAppointmentController.delete);
routes.get('/company/appointment/month', AppointmentByMonth.index);

routes.post('/company/purchase', PurchaseController.create);
routes.get('/company/purchase', PurchaseController.index);
routes.put('/company/purchase/:purchase_id', PurchaseController.update);
routes.delete('/company/purchase/:purchase_id', PurchaseController.delete);

routes.post('/company/post', upload.single('midia'), PostController.create);
routes.delete('/company/post/:post_id', PostController.delete);
routes.put(
  '/company/post/:post_id',
  upload.single('midia'),
  PostController.update
);

routes.use(access);

routes.post('/company/notifications', NotificationController.create);

routes.put('/employee/:id', EmployeeController.update);
routes.get('/employee', EmployeeController.index);
routes.delete('/employee/:employee_id', EmployeeController.delete);
routes.post('/employee', upload.single('avatar'), EmployeeController.create);

export default routes;
