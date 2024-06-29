// 检测系统主题模式
function detectColorScheme() {
    const darkSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkSchemeMediaQuery.matches) {
        document.html.classList.add('dark-mode');
        document.html.classList.remove('light-mode');
    } else {
        document.html.classList.add('light-mode');
        document.html.classList.remove('dark-mode');
    }
}

// 监听主题模式变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectColorScheme);

// 初始化检测主题模式
detectColorScheme();
