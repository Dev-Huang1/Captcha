// 检测系统主题模式
        function detectColorScheme() {
            const darkSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (darkSchemeMediaQuery.matches) {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
            } else {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
            }
        }

        // 监听主题模式变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectColorScheme);

        // 初始化检测主题模式
        detectColorScheme();
