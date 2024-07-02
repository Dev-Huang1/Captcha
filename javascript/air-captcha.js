(function() {
    const captchaHtml = `
        <style>
            .captcha-container {
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
            .verify-section {
                display: flex;
                align-items: center;
            }
            .verify-checkbox {
                margin-right: 10px;
            }
            .captcha-label {
                margin-right: 20px;
            }
            .brand {
                font-weight: bold;
            }
            .success {
                color: green;
            }
            .success .verify-checkbox::after {
                content: '\\2714'; /* Unicode character for checkmark */
                display: inline-block;
                font-size: 18px;
                margin-left: 5px;
            }
        </style>
        <div class="captcha-container">
            <div class="verify-section">
                <input type="checkbox" id="verify-checkbox">
                <label for="verify-checkbox" class="captcha-label">Verify</label>
            </div>
            <div class="brand">AIR-Captcha</div>
        </div>
    `;

    function insertCaptcha(targetElement) {
        targetElement.innerHTML = captchaHtml;

        const verifyCheckbox = targetElement.querySelector('.verify-checkbox');
        const captchaContainer = targetElement.querySelector('.captcha-container');
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
                        captchaContainer.classList.add('success');
                    }, 1000);
                } else {
                    if (isValidMovement(mouseMovements)) {
                        alert('Verification Passed');
                        captchaContainer.classList.add('success');
                    } else {
                        alert('Verification Failed');
                        verifyCheckbox.checked = false;
                    }
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const captchaElements = document.querySelectorAll('.air-captcha');
        captchaElements.forEach(element => {
            insertCaptcha(element);
        });
    });
})();
