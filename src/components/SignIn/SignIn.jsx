import React from 'react'

function SignIn(props) {
  const signInWithGoogle = () => {
    const provider = new props.firebase.auth.GoogleAuthProvider();
    props.auth.signInWithPopup(provider);
  }
  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Gooogle</button>
    </>
  )
}

export default SignIn