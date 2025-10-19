// 作者: 吴永婷
// 创建时间: 2024；

/**
 * 显示指定部分的内容
 * @param {string} section - 要显示的部分ID
 * @param {boolean} addToHistory - 是否添加到历史记录，默认为true
 */
function showSection(section, addToHistory = true) {
    // 显示加载状态
    document.querySelector('#content').innerHTML = '<p>正在加载内容...</p>';
    
    // 从服务器获取内容
    fetch(`/sections/${section}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应错误');
        }
        return response.text();
    })
    .then(text => {
        // 显示获取到的内容
        document.querySelector('#content').innerHTML = text;
        
        // 添加到历史记录
        if (addToHistory) {
            window.history.pushState({section: section}, section, `?section=${section}`);
        }
    })
    .catch(error => {
        // 显示错误信息
        document.querySelector('#content').innerHTML = `<p>加载失败: ${error.message}</p>`;
    });
}

// 处理浏览器前进/后退按钮
function handlePopState(event) {
    if (event.state && event.state.section) {
        showSection(event.state.section, false); // 不添加到历史记录，避免重复添加
    }
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 监听popstate事件，用于处理浏览器前进/后退
    window.addEventListener('popstate', handlePopState);
    
    // 检查URL参数，决定显示哪个部分
    const urlParams = new URLSearchParams(window.location.search);
    const initialSection = urlParams.get('section');
    
    // 如果URL中有section参数，则显示对应的内容
    if (initialSection) {
        showSection(initialSection, false);
    }
    
    // 为所有按钮添加点击事件
    document.querySelectorAll('button').forEach(button => {
        button.onclick = function() {
            showSection(this.dataset.section);
        };
    });
});