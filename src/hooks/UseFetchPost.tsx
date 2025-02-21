export const UseFetchPost =  async(url : string, data : object) => {

    return fetch(url,{
        method : "POST",
        headers : {
            "content-type" : "application/json"
        },
        body : JSON.stringify(data)
    })

}