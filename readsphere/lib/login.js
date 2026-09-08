const login=async(email,password)=>{
    
    const response=await fetch("http://localhost:3000/api/login",{method: "POST",
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