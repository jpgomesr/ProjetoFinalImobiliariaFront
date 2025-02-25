export const UseFetchPostFormData =  async(url : string, data : object,nomeObjeto : string, file : File | null) => {

    const formData = new FormData()

    formData.append(nomeObjeto, new Blob([JSON.stringify(data)], { type: "application/json" }))

    if(file){
        formData.append("file", file)
    }

    return await fetch(url,{
        method : "POST",
        body : formData

})
}