import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './component/Auth/SignUp';
import Login from './component/Auth/Login';
import UserDashboard from './component/dashboard/userDashBoard';
import CreatePost from './component/Post/CreatePost';
import AllPosts from './component/Post/AllPosts';
import Mypost from './component/Post/Mypost';
import MyProfile from './component/profile/MyProfile';


const App = () => {
  return(
    <Routes>
      <Route path='/signup' element = {<SignUp/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/userdashboard' element={<UserDashboard/>}/>
      <Route path='/create/post' element={<CreatePost/>}/>
      <Route path="/all/posts" element={<AllPosts/>}/>
      <Route path='/my/posts' element={<Mypost/>}/>
      <Route path='/my/profile' element={<MyProfile/>}/>
    </Routes>
  )
}

export default App;