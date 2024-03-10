var iframe = document.getElementById("mainVideo");
        var firstSrc = iframe.src;
        var popupLink = document.getElementById("popup-link");
        var popupWindow = document.getElementById("popup-window");
        var closeButton = document.getElementById("close-button");
        var lang = 'uk-UA';

        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
        if ('SpeechRecognition' in window) {
            const recognition = new SpeechRecognition();
            recognition.lang = lang;
            recognition.continuous = false;
    
            let transcript = '';
    
            recognition.onresult = (event) => {
                transcript += event.results[0][0].transcript + ' ';
            };
    
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
    
            recognition.onend = () => {
                console.log('Transcript:', transcript);
                var command = transcript.trim().toLowerCase();
                    if (command.indexOf("стоп") == 0) {
                        stopVideo();
                    }
                    if (command.indexOf("старт") == 0) {
                        startVideo();
                    }
                    if (command.indexOf("питання") == 0) {  
                        questionToChat = transcript.split('питання ').join('') + "?";
                        question(questionToChat);
                        stop();
                    }
                    if (command.indexOf("допомога") == 0) {  
                        start();
                    }
                    if (command.indexOf("закрий") == 0) {  
                        stop();
                    }
                    transcript = '';
                    recognition.start();
            };
    
            recognition.start();
        } else {
            console.error('SpeechRecognition is not supported in this browser.');
        }

        function question(questionToChat) {
            const token = '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';
            console.log(questionToChat);

            $("#thinking").text("ШІ оброблює ваш запит...")
            $("#thinking").css("display", "block");

            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: JSON.stringify({
                        "model": 'gpt-3.5-turbo',
                        "messages": [{"role": "user", "content": questionToChat + ' Відповідай українською мовою.'}]
                    }),
                }).then(response => {
                    return response.json();
                }).then(data => {
                    console.log(data);
                    $(".chat").append(`
                        <p id="question">${questionToChat}</p>
                        <p id="answer">${data.choices[0].message.content}</p>
                    `);
                    $("#thinking").css("display", "none");
                });

                
                
            return;

        }

        function startVideo() {
            var iframe = document.getElementById("mainVideo");
            iframe.src = firstSrc + "&autoplay=1";
        }

        function stopVideo() {
            var iframe = document.getElementById("mainVideo");
            var iframeSrc = iframe.src;
            if (iframeSrc.indexOf('youtube.com') !== -1) {
                iframe.src = iframeSrc + "?enablejsapi=1";
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
        }


        function start(event) {
            popupWindow.style.display = "block";
        }
        function stop() {
            popupWindow.style.display = "none";
        }
