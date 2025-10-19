// 作者: 吴永婷
// 创建时间: 2024年

/**
 * 无限滚动加载功能实现
 * 监听页面滚动，当接近底部时自动加载更多内容
 */

// 全局变量
let page = 1; // 当前页码
let isLoading = false; // 是否正在加载中
let hasMoreContent = true; // 是否还有更多内容

/**
 * 加载更多内容的函数
 */
function loadMoreContent() {
    // 如果正在加载中或者没有更多内容，则不执行任何操作
    if (isLoading || !hasMoreContent) {
        return;
    }
    
    // 设置为正在加载状态
    isLoading = true;
    document.getElementById('loading').style.display = 'block';
    
    // 从服务器获取更多内容
    fetch(`/infinite-load?page=${page}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应错误');
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('posts-container');
        
        // 如果没有更多内容了
        if (data.posts.length === 0) {
            hasMoreContent = false;
            document.getElementById('end-message').style.display = 'block';
            document.getElementById('loading').style.display = 'none';
            isLoading = false;
            return;
        }
        
        // 动态创建并添加新的文章元素
        data.posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <p><small>发布时间: ${post.date}</small></p>
            `;
            container.appendChild(postElement);
        });
        
        // 增加页码，为下次加载做准备
        page++;
        
        // 隐藏加载状态
        document.getElementById('loading').style.display = 'none';
        isLoading = false;
        
        // 如果没有更多内容了
        if (!data.has_more) {
            hasMoreContent = false;
            document.getElementById('end-message').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('加载失败:', error);
        document.getElementById('loading').style.display = 'none';
        isLoading = false;
    });
}

/**
 * 监听滚动事件的函数
 */
function handleScroll() {
    // 当页面滚动到距离底部100px时加载更多内容
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMoreContent();
    }
}

/**
 * 页面加载完成后的初始化函数
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始加载第一页内容
    loadMoreContent();
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
});