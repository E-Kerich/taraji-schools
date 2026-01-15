import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/admin/Login';

import Home from '../pages/public/Home';
import About from '../pages/public/About';
import PublicLayout from '../components/layout/PublicLayout';
import FloatingContactModal from '../components/layout/FloatingModal';
import Admissions from '../pages/public/Admission';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Dashboard from '../pages/admin/Dashboard';
import AdminLayout from '../components/admin/AdminLayout';
import UpdateList from '../pages/admin/CampusUpdates/UpdateList';
import CreateUpdate from '../pages/admin/CampusUpdates/CreateUpdate';
import EditUpdate from '../pages/admin/CampusUpdates/EditUpdate';
import PaymentList from '../pages/admin/Payments/PaymentList';
import InquiryList from '../pages/admin/Inquiries/InquiryList';
import ContactList from '../pages/admin/contact/ContactList';
import EmailList from '../pages/admin/Emails/EmailList';
import BlogList from '../pages/admin/Blogs/BlogList';
import CreateBlog from '../pages/admin/Blogs/CreateBlog';
import EditBlog from '../pages/admin/Blogs/EditBlog';
import BlogPage from '../pages/public/blogs/Blog';
import BlogDetails from '../pages/public/blogs/BlogDetails';
import Academics from '../pages/public/Academics';
import ContactPage from '../pages/public/Contact';


// Public


export default function Router() {
  return (
    <BrowserRouter>

      <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/academics" element={<Academics/>}/>
        <Route path="/contact" element={<ContactPage/>}/>

        
        
        

      
      </Route>
     
          
    
        

        {/* Admin Auth */}
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          
            <Route path="campus-updates" element={<UpdateList />} />
            <Route path="campus-updates/create" element={<CreateUpdate />} />
            <Route path="campus-updates/edit/:id" element={<EditUpdate />} />
            <Route path="inquiries" element={<InquiryList />} />
            <Route path="contacts" element={<ContactList />} />

            <Route path="payments" element={<PaymentList />} />
            <Route path="emails" element={<EmailList />} />

            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/create" element={<CreateBlog />} />
            <Route path="blogs/edit/:id" element={<EditBlog />} />


            
          
        </Route>

        
      </Routes>
      <FloatingContactModal/>
    </BrowserRouter>
  );
}
