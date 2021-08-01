((window, ethereum) => {
  const App = {
    connect: async () => {
      await ethereum.request({ method: 'eth_requestAccounts' });
      App.toggleConnected();
    },
    sign: async (evt) => {
      evt.preventDefault();

      await ethereum.request({ method: 'eth_requestAccounts' });

      const message = document.querySelector(".sign textarea.message").value;
      
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
            
      const rawSignature = await signer.signMessage(message);      

      document.querySelectorAll("textarea.rawSignature").forEach(e => e.value = rawSignature); 
      document.querySelectorAll("input.address").forEach(e => e.value = signerAddress); 
      document.querySelector(".verify textarea.message").value = message;

      document.getElementById("signedConfirmation").innerHTML = 'Message signed on ' + dateFns.format(new Date(), "YYYY-MM-DD hh:mm:ss");;      
      document.querySelector(".container").classList.add('signed');
    },
    verify: async (evt) => {
      evt.preventDefault();

      const rawSignature = document.querySelector(".verify textarea.rawSignature").value; 
      const signerAddress = document.querySelector(".verify input.address").value; 
      const message = document.querySelector(".verify textarea.message").value;

      if(!message || !rawSignature) return;

      let verificationMessage;
      const section = document.querySelector("section");
      
      try{
        const addressReturned = ethers.utils.verifyMessage(message, rawSignature);      
        if(addressReturned === signerAddress){
          section.classList.add('success');
          section.classList.remove('fail');
          verificationMessage = 'Message signature verified.';
        }else{
          throw new Error('The address is not the same.');
        }
      }catch(e){
        console.log(e.message);
        section.classList.add('fail');
        section.classList.remove('success');
        verificationMessage = 'Message signature verification failed.';
      }

      document.getElementById("verificationMessage").innerHTML = verificationMessage;
    },
    toggleForm: () => {
      var card = document.querySelector('.card');
      var signinBtn = document.querySelector('.formBx.sign');
      var boxsigninBtn = document.querySelector('.blueBg');
      var signupBtn = document.querySelector('.verify');
      card.classList.toggle('active');
      signinBtn.classList.toggle('active');
      boxsigninBtn.classList.toggle('active');
      signupBtn.classList.toggle('active');
      const section = document.querySelector("section");
      section.classList.remove('success');            
      section.classList.remove('fail');
      document.getElementById("verificationMessage").innerHTML = '';            
    },
    toggleConnected: () => {
      var section = document.querySelector('section');
      var card = document.querySelector('.card');
      section.classList.toggle('connected');        
      card.classList.toggle('connected');            
    }
  };

  window.onload = e => {
    window.App = App;
  };  

})(window, window.ethereum);