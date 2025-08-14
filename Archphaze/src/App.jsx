  import React, { lazy, Suspense } from 'react';
  import Navbar from './components/Navbar';
  import { Route, BrowserRouter as Router, Routes  } from "react-router-dom";
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
import Privateroute from './components/Privateroute';
import Userinfo from './admin/Userinfo';
import Dashboard from './admin/Dashboard';
import Careerinfo from './admin/career/Careerinfo';
import Addcareerinfo from './admin/career/Addcareerinfo';
import Servicesinfo from './admin/services/Servicesinfo';
import Addservicesinfo from './admin/services/Addservicesinfo';
import Partnersinfo from './admin/partners/Partnersinfo';
import Addpartnersinfo from './admin/partners/Addpartnersinfo';
import Category from './shop/Category';
import Updatecareerinfo from './admin/career/Updatecareerinfo';
import Viewcareerinfo from './admin/career/Viewcareerinfo';
import Updatepartnersinfo from './admin/partners/Updatepartnersinfo';
import Updateservicesinfo from './admin/services/Updateservicesinfo';
import Clienttestimonial from './components/Clienttestimonial';
import Clientinfo from './admin/client/Clientinfo';
import Addclientinfo from './admin/client/Addclientinfo';
import Updateclientinfo from './admin/client/Updateclientinfo';
import Queriesinfo from './admin/userqueries/Queriesinfo';
import Viewqueriesinfo from './admin/userqueries/Viewqueriesinfo';
import Teamsinfo from './admin/teams/Teamsinfo';
import Updateteamsinfo from './admin/teams/Updateteamsinfo';
import Addteamsinfo from './admin/teams/Addteamsinfo';
import Updatespeakerinfo from './admin/shop/earphone/speaker/Updatespeakerinfo';
import Addspeakerinfo from './admin/shop/earphone/speaker/Addspeakerinfo';
import Speakerinfo from './admin/shop/earphone/speaker/Speakerinfo';
import Profile from './components/Profile';
import Suppliersignup from './supplier/Suppliersignup';
import Supplierlogin from './supplier/Supplierlogin';
import Supplierinfo from './admin/Supplierinfo';
import Supplierdashboard from './supplier/Supplierdashboard';
import Checkout from './shop/Checkout';
import Addproduct from './supplier/Addproduct';
import Suppliersidebar from './supplier/Suppliersidebar';
import Manageproduct from './supplier/Manageproduct';
import Mediacenter from './supplier/Mediacenter';
import Profilesettings from './supplier/Profilesettings';
import Supplierprofile from './supplier/Supplierprofile';
import Businessinfo from './supplier/Businessinfo';
import Accountinfo from './supplier/Accountinfo';
import Order from './supplier/Order';
import Store from './supplier/store/Storesetting';
import Security from './supplier/Security';
import Usermanagement from './supplier/Usermanagement';
import AddUserForm from './supplier/Adduserform';
import Supplierproduct from './shop/Supplierproduct';
import SupplierProfile from './supplier/Supplierprofile';
import ProductShowcase from './shop/Productshowcase';
import Supplierprofileshop from './shop/Supplierprofileshop';
import Updateproduct from './supplier/Updateproduct';
import Updateuserform from './supplier/Updateuserform';
import Storeprofile from './supplier/store/Storeprofile';
import Updatestoresetting from './supplier/store/Updatestoresetting';
import Shopindex from './usershop/Shopindex';
import Categories from './usershop/Categories';
import Product from './usershop/Product';
import Maincategories from './usershop/Maincategories';
import CartInitializer from './components/CartInitializer';
import Userproductshowcase from './usershop/Userproductshowcase';
import Orderhistory from './components/Orderhistory';
import Accountsecurity from './components/Accountsecurity';
import Companies from './admin/shop/earphone/Companies';
import Products from './admin/shop/earphone/Products';
import Success from './components/Success';
import Cancel from './components/Cancel';
import Adminorder from './admin/shop/earphone/Adminorder';
import SuccessEsewa from './components/SuccessEsewa';
import FailureEsewa from './components/FailureEsewa';
   
   
   
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
               <Route path="/productdetail/:id" element={<Productdetail/>}/>
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
               <Route path="/clienttestimonial" element={<Clienttestimonial/>}/>
               <Route path="/profile" element={<Profile/>}/>
               <Route path="/suppliersignup" element={<Suppliersignup/>}/> 
               <Route path="/supplierlogin" element={<Supplierlogin/>}/>
               <Route path="/checkout" element={<Checkout/>}/>
               <Route path="/success" element={<Success/>}/>
               <Route path="/cancel" element={<Cancel/>}/>
               <Route path="/esewa-success" element={<SuccessEsewa/>}/>
               <Route path="/esewa-failure" element={<FailureEsewa/>}/>
               <Route path="/supplierproduct" element={<Supplierproduct/>}/>
               <Route path="/supplierprofile" element={<SupplierProfile/>}/>
               <Route path="/productshowcase" element={<ProductShowcase/>}/>
               <Route path="/supplierprofileshop" element={<Supplierprofileshop/>}/>
               <Route path="/store/:userId" element={<Supplierprofileshop/>}/>
               <Route path="/shopindex" element={<Shopindex/>}/>
               <Route path="/categories" element={<Categories/>}/>
               <Route path="/product" element={<Product/>}/>
               <Route path="/allcategories" element={<Maincategories/>}/>
               <Route path="/cartinitializer" element={<CartInitializer/>}/>
               <Route path="/category/:slug" element={<Userproductshowcase/>}/>            
               <Route path="/orderhistory" element={<Orderhistory/>}/>
               <Route path="/settings" element={<Accountsecurity/>}/>
               
   
   
               <Route path="/sidebar" element={<Sidebar/>}/>
               <Route path="/userinfo" element={<Userinfo/>}/>
               <Route path="/dashboard" element={<Dashboard/>}/>
               <Route path="/careerinfo" element={<Careerinfo/>}/>
               <Route path="/addcareerinfo" element={<Addcareerinfo/>}/>
               <Route path="/updatecareerinfo" element={<Updatecareerinfo/>}/>
               <Route path="/viewcareerinfo" element={<Viewcareerinfo/>}/>
               <Route path="/servicesinfo" element={<Servicesinfo/>}/>
               <Route path="/updateservicesinfo/:id" element={<Updateservicesinfo/>}/>
               <Route path="/addservicesinfo" element={<Addservicesinfo/>}/>
               <Route path="/partnersinfo" element={<Partnersinfo/>}/>
               <Route path="/addpartnersinfo" element={<Addpartnersinfo/>}/>
               <Route path="/updatepartnersinfo" element={<Updatepartnersinfo/>}/>
               <Route path="/updatecareerinfo/:id" element={<Updatecareerinfo />} />
               <Route path="/clientinfo" element={<Clientinfo />} />
               <Route path="/addclientinfo" element={<Addclientinfo />} />
               <Route path="/updateclientinfo/:id" element={<Updateclientinfo />} />
               <Route path="/queriesinfo" element={<Queriesinfo />} />
               <Route path="/viewqueriesinfo/:id" element={<Viewqueriesinfo />} />
               <Route path="/teamsinfo" element={<Teamsinfo />} />
               <Route path="/addteamsinfo" element={<Addteamsinfo />} />
               <Route path="/updateteamsinfo/:id" element={<Updateteamsinfo />} />
               <Route path="/speakerinfo" element={<Speakerinfo />} />
               <Route path="/updatespeakerinfo/:id" element={<Updatespeakerinfo/>} />
               <Route path="/addspeakerinfo" element={<Addspeakerinfo />} />
               <Route path="/supplierinfo" element={<Supplierinfo />} />
               <Route path="/admin/companies" element={<Companies />} />
               <Route path="/admin/products" element={<Products />} />
               <Route path="/adminorder" element={<Adminorder />} />


              <Route path="/supplierdashboard" element={<Supplierdashboard />} />
              <Route path="/addproduct" element={<Addproduct/>} />
              <Route path="/suppliersidebar" element={<Suppliersidebar/>} />
              <Route path="/manageproduct" element={<Manageproduct/>} />
              <Route path="/mediacenter" element={<Mediacenter/>} />
              <Route path="/profilesettings" element={<Profilesettings/>} />
              <Route path="/supplierprofile" element={<Supplierprofile/>} />
              <Route path="/businessinfo" element={<Businessinfo/>} />
              <Route path="/accountinfo" element={<Accountinfo/>} />
              <Route path="/order" element={<Order/>} />
              <Route path="/storesettings" element={<Store/>} />
              <Route path="/storeprofile" element={<Storeprofile/>} />
              <Route path="/security" element={<Security/>} />
              <Route path="/usermanagement" element={<Usermanagement/>} />
              <Route path="/adduserform" element={<AddUserForm/>} />
              <Route path="/updateproduct/:id" element={<Updateproduct/>} />
              <Route path="/updateuserform/:id" element={<Updateuserform/>} />
              <Route path="/updatestoresetting/:id" element={<Updatestoresetting/>} />
              
              {/* private route */}
              <Route element={<Privateroute />} >
              </Route>
              {/* private route */}
            </Routes>
            </Suspense>
            <SecondaryFooter/>
           </Router>
         </div>
       );
     }
