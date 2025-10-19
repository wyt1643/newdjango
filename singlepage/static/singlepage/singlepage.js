// 作者: 吴永婷
// 创建时间: 2025.10.19；

/**
 * 显示指定页面并隐藏其他页面
 * @param {string} page - 要显示的页面ID
 * @param {boolean} addToHistory - 是否添加到历史记录，默认为true
 */
function showPage(page, addToHistory = true) {
    // 隐藏所有div元素
    document.querySelectorAll('div[id^="page"]').forEach(div => {
        div.style.display = 'none';
    });

    // 显示指定的页面
    document.querySelector(`#${page}`).style.display = 'block';
    
    // 添加到历史记录
    if (addToHistory) {
        window.history.pushState({page: page}, page, `?page=${page}`);
    }
}

// 处理浏览器前进/后退按钮
function handlePopState(event) {
    if (event.state && event.state.page) {
        showPage(event.state.page, false); // 不添加到历史记录，避免重复添加
    }
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 监听popstate事件，用于处理浏览器前进/后退
    window.addEventListener('popstate', handlePopState);
    
    // 检查URL参数，决定显示哪个页面
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || 'page1';
    
    // 显示初始页面
    showPage(initialPage);

    // 为所有按钮添加点击事件
    document.querySelectorAll('button').forEach(button => {
        button.onclick = function() {
            showPage(this.dataset.page);
        }
    });
});