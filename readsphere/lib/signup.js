const signup=async(name,email,password)=>{
    
    const response=await fetch("http://localhost:3000/api/signup",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name:name,
            email:email,
            password:password
        })
    });
    const data= await response.json();
    console.log(data);
    return data;
}

export default signup;