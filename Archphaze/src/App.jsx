  import React, { lazy, Suspense } from 'react';
  import Navbar from './components/Navbar';
  import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
  // import Index from './components/Index';
  import Services from './components/Services';
  import Whyus from './components/Whyus';
  import Testimonial from './components/Testimonial';
  // import Aboutus from './components/Aboutus';
  import Contactus from './components/Contactus';
  import SecondaryFooter from './components/SecondaryFooter';
  import Career from './components/Career';
  import ScrollToTop from './components/Scrolltotop';
  import Modal from './components/Modal';
  import Support from './components/Support';
  import Privacynotice from './components/Privacynotice';
  import Termsofuse from './components/Termsofuse';
  import Developmentcenter from './components/Developmentcenter';
  import Privacyrights from './components/privacyrights';
  import Preloader from './components/Preloader';
  import Productmodal from './shop/Productmodal';
  import Collection from './shop/Collection';
  import Productdetail from './shop/Productdetail';
  import Cart from './shop/Cart';
  import Forgetpassword from './components/Forgetpassword';
  import Careers from './components/Careers';
  import Scrollingcards from './shop/Scrollingcards';
  import Techintro from './shop/Techintro';
  import Partners from './components/Partners';
  import Trustedpartners from './components/Trustedpartners';
  import Closingpage from './components/Closingpage';
import  Sidebar  from './admin/Sidebar';
import Signup from './components/Signup';
import Login from './components/Login';
import Privateroute from './components/privateroute';
import Userinfo from './admin/Userinfo';
import Dashboard from './admin/Dashboard';
import Careerinfo from './admin/Careerinfo';
import Addcareerinfo from './admin/Addcareerinfo';
import Servicesinfo from './admin/Servicesinfo';
import Addservicesinfo from './admin/Addservicesinfo';
import Partnersinfo from './admin/Partnersinfo';
import Addpartnersinfo from './admin/Addpartnersinfo';
import Category from './shop/Category';



  const Index = lazy(() => import('./components/Index'));
  const Aboutus = lazy(() => import('./components/Aboutus'));
  


  export default function App() {
    return (
      <div>
        <Router>
          <ScrollToTop/>
          <Navbar />
          <Suspense fallback={<Preloader/>}>
          <Routes>
            <Route path="/" element={<Index/>}/>
            <Route path="/Aboutus" element={<Aboutus/>}/>
            <Route path="/Contactus" element={<Contactus/>}/>
            <Route path="/Testimonial" element={<Testimonial/>}/>
            <Route path="/Services" element={<Services/>}/>
            <Route path="/Whyus" element={<Whyus/>}/>
            <Route path="/career" element={<Career/>}/>
            <Route path="/modal" element={<Modal/>}/>
            <Route path="/productmodal" element={<Productmodal/>}/>
            <Route path="/support" element={<Support/>}/>
            <Route path="/privacynotice" element={<Privacynotice/>}/>
            <Route path="/termsofuse" element={<Termsofuse/>}/>
            <Route path="/developmentcenter" element={<Developmentcenter/>}/>
            <Route path="/privacyrights" element={<Privacyrights/>}/>
            <Route path="/collection" element={<Collection/>}/>
            <Route path="/productdetail" element={<Productdetail/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/forgetpassword" element={<Forgetpassword/>}/>
            <Route path="/careers" element={<Careers/>}/>
            <Route path="/scrollingcards" element={<Scrollingcards/>}/>
            <Route path="/techintro" element={<Techintro/>}/>
            <Route path="/partners" element={<Partners/>}/>
            <Route path="/category" element={<Category/>}/>
            <Route path="/trustedpartners" element={<Trustedpartners/>}/>
            <Route path="/closingpage" element={<Closingpage/>}/>


            <Route path="/sidebar" element={<Sidebar/>}/>
            <Route path="/userinfo" element={<Userinfo/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/careerinfo" element={<Careerinfo/>}/>
            <Route path="/addcareerinfo" element={<Addcareerinfo/>}/>
            <Route path="/servicesinfo" element={<Servicesinfo/>}/>
            <Route path="/addservicesinfo" element={<Addservicesinfo/>}/>
            <Route path="/partnersinfo" element={<Partnersinfo/>}/>
            <Route path="/addpartnersinfo" element={<Addpartnersinfo/>}/>
            {/* private route */}
            <Route element={<Privateroute />} >
            </Route>
            {/* private route */}

          </Routes>
          
          <SecondaryFooter/>
          {/* <Footer/> */}
          </Suspense>
        </Router>
      </div>
    )
  }
