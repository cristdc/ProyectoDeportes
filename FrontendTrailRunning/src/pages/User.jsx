import { useEffect, useState } from "react"
import { profile } from "../helpers/fetch";

const User = () => {
    const [user, setUser] = useState({});
    const fetchProfile = async () => {
        const prof = await profile(); 
        setUser(prof);  
      };
    useEffect(() => {
        fetchProfile()
    }, [])
  return (
    <div>{user.name}</div>
  )
}

export default User