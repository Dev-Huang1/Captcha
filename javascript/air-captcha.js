(function() {
    const captchaHtml = `
        <style>
            #captcha-container {
                width: 300px;
                border: 1px solid #ccc;
                padding: 20px;
                margin: 50px auto;
                text-align: center;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-family: Arial, sans-serif;
            }
            #verify-section {
                display: flex;
                align-items: center;
            }
            #verify-checkbox {
                margin-right: 10px;
            }
            #captcha-label {
                margin-right: 20px;
            }
            #brand {
                font-weight: bold;
            }
        </style>
        <div id="captcha-container">
            <div id="verify-section">
                <input type="checkbox" id="verify-checkbox">
                <label for="verify-checkbox" id="captcha-label">Verify</label>
            </div>
            <div id="brand">AIR-Captcha</div>
        </div>
    `;

    function insertCaptcha(targetElement) {
        targetElement.innerHTML = captchaHtml;

        const verifyCheckbox = document.getElementById('verify-checkbox');
        let mouseMovements = [];
        let isTouchDevice = 'ontouchstart' in document.documentElement;

        function recordMouseMovement(event) {
            const position = { x: event.clientX, y: event.clientY, time: Date.now() };
            mouseMovements.push(position);
        }

        function calculateSpeed(movements) {
            let totalSpeed = 0;
            for (let i = 1; i < movements.length; i++) {
                const dx = movements[i].x - movements[i - 1].x;
                const dy = movements[i].y - movements[i - 1].y;
                const dt = movements[i].time - movements[i - 1].time;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const speed = distance / dt;
                totalSpeed += speed;
            }
            return totalSpeed / (movements.length - 1);
        }

        function isValidMovement(movements) {
            if (movements.length < 5) return false;

            const averageSpeed = calculateSpeed(movements);
            let deviations = 0;
            for (let i = 1; i < movements.length; i++) {
                const dx = movements[i].x - movements[i - 1].x;
                const dy = movements[i].y - movements[i - 1].y;
                const dt = movements[i].time - movements[i - 1].time;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const speed = distance / dt;
                if (Math.abs(speed - averageSpeed) > averageSpeed * 0.5) {
                    deviations++;
                }
            }
            return deviations > (movements.length * 0.3);
        }

        document.addEventListener('mousemove', recordMouseMovement);

        verifyCheckbox.addEventListener('change', () => {
            if (verifyCheckbox.checked) {
                if (isTouchDevice) {
                    setTimeout(() => {
                        alert('Verification Passed (Touch Device)');
                    }, 1000);
                } else {
                    if (isValidMovement(mouseMovements)) {
                        alert('Verification Passed');
                    } else {
                        alert('Verification Failed');
                        verifyCheckbox.checked = false;
                    }
                }
            }
        });
    }

    window.addEventListener('load', () => {
        const captchaElements = document.querySelectorAll('.air-captcha');
        captchaElements.forEach(element => {
            insertCaptcha(element);
        });
    });
})();
