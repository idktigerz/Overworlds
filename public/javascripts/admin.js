async function reset(){
    let res = await resetDatabase();
    if (res.status == 200){
        alert(res.msg);
        
    }else{
        alert(res.msg);
    }
    //window.location = "index.html";
}