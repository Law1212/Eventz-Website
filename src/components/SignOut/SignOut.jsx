function SignOut(props) {
  return props.auth.currentUser && (
    <div className='signout'>
      <button onClick={() => props.auth.signOut()}><p>Sign Out</p></button>
    </div>
  )
}

export default SignOut