import React, { useState, useEffect } from 'react';
import Post from './components/Post'
import './App.css';
import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './components/ImageUpload'
import InstagramEmbed from 'react-instagram-embed'



function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));




function App() {

  const classes = useStyles();
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [modalStyle] = React.useState(getModalStyle);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userName, setUserName] = useState("")
  const [user, setUser] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false)


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //  user logged in
        console.log(authUser)
        setUser(authUser)
        // if(authUser.displayName)
        // {  //dont update username

        // }
        // else{
        //   // if a user has just been created
        //      return authUser.updateProfile({
        //        displayName:userName
        //      })
        // }

      }
      else {
        //  user logged out
        setUser(null)

      }
    })
    return () => {
      // clean up before its fired again
      unsubscribe()
    }
  }, [user, userName])

  // useeffect runs based on condition

  useEffect(() => {

    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post is added it takes a snapshot
      setPosts(snapshot.docs.map(doc => (
        {
          id: doc.id,
          post: doc.data()
        })));
    })

  }, [])


  const SignUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName
        })
      })
      .catch((error) => alert(error.message))

  }
  const SignIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }


  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">

            <center>
              <img className="app__headerImage" src="http://pngimg.com/uploads/instagram/instagram_PNG5.png" alt="" />
            </center>
            <Input placeholder="username" type="text" value={userName} onChange={(e) => { setUserName(e.target.value) }} />
            <Input placeholder="email" type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <Input placeholder="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />

            <Button type="submit" onClick={SignUp}>SignUp</Button>


          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">

            <center>
              <img className="app__headerImage" src="http://pngimg.com/uploads/instagram/instagram_PNG5.png" alt="" />
            </center>
            <Input placeholder="email" type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <Input placeholder="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />

            <Button type="submit" onClick={SignIn}>SignIn</Button>


          </form>
        </div>
      </Modal>


      <div className="app__header">
        <img className="app__headerImage" src="http://pngimg.com/uploads/instagram/instagram_PNG5.png" alt="" />
        {user ? (<Button onClick={() => auth.signOut()}>Logout</Button>) :
          (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
              <Button onClick={() => setOpen(true)}>SignUp</Button>
            </div>
          )
        }
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} imageUrl={post.imageUrl} user={user} caption={post.caption} userName={post.userName} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />

        </div>
      </div>






      {user ? user.displayName ? (<ImageUpload username={user.displayName} />) : "" : (<h3><center>Login to upload</center></h3>)}


    </div>
  );
}


export default App;
