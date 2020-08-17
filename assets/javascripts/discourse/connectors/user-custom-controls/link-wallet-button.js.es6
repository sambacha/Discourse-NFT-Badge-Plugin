// Current Focus: use regex in a function to populate username into message params

export default {
  actions: {
      
      clickButton() {
          // get username here without defining getUsername()?
        
          const regex = /\/u\/([a-zA-Z0-9_-]*)\//gm;
          const str = window.location.href;
          let m;
          let username;

          console.log("getUsername fired!", str)
        
          while ((m = regex.exec(str)) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (m.index === regex.lastIndex) {
                  regex.lastIndex++;
              }

              console.log("m[1]", m[1])
              username = m[1]
          }
        // call getUsername here
        // getUsername();
        console.log("username", username)

        // :alembic: message params should be username & ethAddress
        window.ethereum.sendAsync(  {
          method: 'personal_sign',
          params: [
              `${username}`, window.ethereum.selectedAddress
                  ],
          from: window.ethereum.selectedAddress
      
        },
        (error, response) => {
          if (error) {
            // Handle error. Likely the user rejected the login
            console.error("error with signing message:", error);
          } else {
            // Q: What does the message look like?
            const message = `{
              username: ${username},
              address: ${window.ethereum.selectedAddress},
              signature: ${response.result}
            }`
            console.log("ajax message:", message)
            // @Aaron: pass message to lambda function
            const requestOptions = {
              method: 'GET'
            };
            fetch(
              `http://localhost:3000/discourse/${message}`,
              requestOptions
            )
            .then(res => res.json())
            .then(resolved => console.log("Fetch Response Too Yo!", resolved))

            // A: pending...
            // :alembic: username is undefined, but address is recoverable
            window.ethereum.sendAsync(  {
              method: 'personal_ecRecover',
              params: [
                `${username}`, response.result
                      ],
              from: window.ethereum.selectedAddress
          
            },
            (error, response) => {
              if (error) {
                console.error("error with recovering address:", error);
              } else {
                console.log(response.result);
              }
            });
          }
        })
      },
      connectWallet() {
        window.ethereum.enable();
      },
    }
  };