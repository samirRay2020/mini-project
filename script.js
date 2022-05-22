
    const switchers = [...document.querySelectorAll('.switcher')]

    switchers.forEach(item => {
      item.addEventListener('click', function() {
        switchers.forEach(item => item.parentElement.classList.remove('is-active'))
        this.parentElement.classList.add('is-active')
      })
    })


    console.log(document.getElementById("ab").innerHTML);
   //  let fVal = document.getElementById("login-email").value;
   //  let sVal = document.getElementById("login-password").value;
     console.log(fVal,sVal)
    document.getElementById("sbt").addEventListener("click",function(){
   
  
     console.log("hello");
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
    
    })
  
 