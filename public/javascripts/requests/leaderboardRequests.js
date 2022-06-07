async function requestAllMatchesWin(){
    try{
        const response = await fetch(`/api/leaderboard/matches`);
        if (response.status == 200){
            var c = await response.json();
            console.log(c)
            return c;
        }else{
            console.log(response);
        }
    }catch(err){
        console.log(err);
    }
}