const login=async(email,password)=>{
    
    const response=await fetch("http://localhost:5000/api/User/login",{method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email:email,
            password:password
        })
    }
    )

    const data=await response.json();
    console.log(data);

    return data;

}
export default login;