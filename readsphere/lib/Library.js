const getLibrary = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/library/getlibrary", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if(!response){
         return "No Books added to library";

    
    }
    const data = await response.json();
    console.log(data);
    return data;
}

const addtolibrary = async (bookid, status) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/library/addtolibrary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ bookid: bookid, status: status })
    });
    const data = await response.json();
    console.log(data);
    return data;
}

const removelibrary = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/library/removefromlibrary", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: id })
    })
    const data = await response.json();
    console.log(data);
    return data;

}

const updatelibrary = async (id, status) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/library/updatelibrary", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id: id, status: status })
    })
    const data = await response.json();
    console.log(data);
    return data;
}


export {getLibrary, addtolibrary, removelibrary, updatelibrary};