async function resetDatabase(){
    try {
        const response = await fetch(`/api/admin/reset`, 
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          method: "POST",
          body: JSON.stringify({
        })
      });
        var result = await response.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}