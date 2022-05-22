

$(document).ready(function() {
    $("#sbt").click(async function(){
        let fVal = $("#login-email").val();
        let sVal = $("#login-password").val();
        let res = await axios.post('/login',{email:fVal,password:sVal});
        if(res.data.status == 200){
            
            window.location.href = "./userpage.html";
            
        }else{

        }
    })
 

});


    

   
  

  //   //let res = await axios.post('/login',{email:fVal,password:sVal});
    
  //   console.log(res.data);
  // //   .then(function (response) {
  // //     console.log("rea");
  // //       console.log(response); 
  // //   })
  // // .catch(function(error) {
  // //   console.log(err);
  // // })
    
  //   //document.getElementById("ab").innerHTML = "samir";
    
  // })
  
 
