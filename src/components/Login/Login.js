import React, { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

const Login = () => {
    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSignIn: false,
        name: '',
        email: '',
        password: '',
        photo: '',
        errorMessage: '',
        successMessage: false
    });

    const googleProvider = new firebase.auth.GoogleAuthProvider();

    const handleGoogleSignIn = () => {
        firebase.auth().signInWithPopup(googleProvider)
        .then((result) => {
            var token = result.credential.accessToken;
            const {displayName, email, photoURL} = result.user;
            const signedInUser = {
                isSignIn: true,
                name: displayName,
                email: email,
                photo: photoURL
            }
            setUser(signedInUser);
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    }

    const handleGoogleSignOut = () => {
        firebase.auth().signOut()
        .then(() => {
            const signOut ={
                isSignIn: false,
                name: '',
                email: '',
                password: '',
                photo: ''
            }
            setUser(signOut);
          }).catch((error) => {
            console.log(error);
          });
    }
    const handleBlur = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        let isFieldValid = true;
        if(name === 'email'){
            isFieldValid = /\S+@\S+\.\S+/.test(value);
        }
        if(name === 'password'){
            isFieldValid = /((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{8,})/.test(value);
        }
        if(isFieldValid) {
            const newUser = {...user};
            newUser[name] = value;
            setUser(newUser);
        }
    }

    const handleSuccess = (res) => {
        const newUser = {...user};
        newUser.errorMessage = '';
        newUser.successMessage = true;
        setUser(newUser);
    }
    const handleError = (error) => {
        var errorMessage = error.message;
        const newUser = {...user};
        newUser.successMessage = false;
        newUser.errorMessage = errorMessage;
        setUser(newUser);
    }

    const handleEmailSignIn = (event) => {
        if(newUser && user.email && user.password) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then((res) => {
                handleSuccess(res);
            })
            .catch((error) => {
                handleError(error);
            });
        }
        if(!newUser && user.email && user.password){
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then((res) => {
                handleSuccess(res);
            })
            .catch((error) => {
                handleError(error);
            });
        }
        event.preventDefault();
    }
    
    return (
        <div className="container">
        <div className="row">
        <div className="col-md-6  my-2" style={{margin: "0 auto"}}>
            {
                user.isSignIn ? <button onClick={handleGoogleSignOut}>Sign Out</button> : <button onClick={handleGoogleSignIn}>Sign In with google</button>
            }
            
            {
                user.isSignIn && <div>
                <h1>Hello {user.name}, Welcome to our world!</h1>
                <h4>your email is: {user.email}</h4>
                <img src={user.photo} alt=""/>
            </div>
            }
            <br/><br/>
            <p>name: {user.name}</p>
            <p>email: {user.email}</p>
            <p>password: {user.password}</p>
            <br/><br/>
            {
                newUser ? <h1 className="text-center text-primary">Sign Up form</h1> : <h1 className="text-center text-primary">Sign In form</h1>
            }
            {
                user.successMessage ? <p className="text-success text-center">User Created Successfully</p> : <p className="text-danger text-center">{user.errorMessage}</p>
            }


            <div className="form-check form-switch">
            <div class="row justify-content-center">
                <div class="col-7">
                <label className="form-check-label ms-5" for="flexSwitchCheckChecked" >Are you new user? toggle to Sign Up</label>
                </div>
                <div class="col-5">
                    <input className="form-check-input me-3" type="checkbox" onChange={() => setNewUser(!newUser)} id="flexSwitchCheckChecked"/>
                </div>
            </div>
                
                
            </div>
            <form>
                {
                    newUser && <div className="mb-3">
                        <label for="name" className="form-label">Name </label>
                        <input type="text" className="form-control" id="name" name="name" onBlur={handleBlur}/>
                    </div>
                }
                <div className="mb-3">
                    <label for="email" className="form-label">Email </label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onBlur={handleBlur}/>
                    {
                        newUser && <div id="emailHelp" className="form-text">
                        <small>We'll never share your email with anyone else.</small>
                    </div>
                    }
                </div>
                <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" aria-describedby="passwordHelp" onBlur={handleBlur}/>
                    {
                        newUser && <div id="passwordHelp" className="form-text">
                        <small>Your password must be bigger than 8 characters, contain uppercase, lowercase, digits and special character</small>
                    </div>
                    }
                </div>
                <input type="submit" className="btn btn-primary form-control w-50 d-block mx-auto" value={newUser ? 'Sign Up' : 'Sign In'} onClick={handleEmailSignIn} />
            </form>
            
        </div>
        </div>
        </div>
    );
};

export default Login;