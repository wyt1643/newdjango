// 作者: 吴永婷
// 创建时间: 2024年

/**
 * 处理表单提交
 * @param {Event} event - 表单提交事件
 */
function handleSubmit(event) {
    // 阻止表单默认提交行为
    event.preventDefault();
    
    // 获取表单数据
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const message = document.querySelector('#message').value;
    
    // 简单的表单验证
    if (!name || !email || !message) {
        document.querySelector('#resultContent').textContent = '请填写所有必填字段';
        document.querySelector('#result').style.display = 'block';
        return;
    }
    
    // 创建表单数据对象
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    
    // 发送数据到服务器
    fetch('/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应错误');
        }
        return response.text();
    })
    .then(text => {
        // 显示成功消息
        document.querySelector('#resultContent').textContent = text || '表单提交成功！';
        document.querySelector('#result').style.display = 'block';
        
        // 重置表单
        document.querySelector('#myForm').reset();
        
        // 添加到历史记录，标记为已提交
        window.history.pushState({submitted: true}, 'Submitted', '?submitted=true');
    })
    .catch(error => {
        // 显示错误信息
        document.querySelector('#resultContent').textContent = `提交失败: ${error.message}`;
        document.querySelector('#result').style.display = 'block';
        
        // 添加到历史记录，标记为错误
        window.history.pushState({error: error.message}, 'Error', `?error=${encodeURIComponent(error.message)}`);
    });
}

// 处理浏览器前进/后退按钮
function handlePopState(event) {
    // 隐藏结果区域
    document.querySelector('#result').style.display = 'none';
    
    // 根据历史状态显示相应内容
    if (event.state) {
        if (event.state.submitted) {
            document.querySelector('#resultContent').textContent = '表单已提交！';
            document.querySelector('#result').style.display = 'block';
        } else if (event.state.error) {
            document.querySelector('#resultContent').textContent = `提交失败: ${event.state.error}`;
            document.querySelector('#result').style.display = 'block';
        }
    }
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 监听popstate事件，用于处理浏览器前进/后退
    window.addEventListener('popstate', handlePopState);
    
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    
    // 如果URL中有提交成功的参数
    if (urlParams.get('submitted') === 'true') {
        document.querySelector('#resultContent').textContent = '表单已提交！';
        document.querySelector('#result').style.display = 'block';
    }
    // 如果URL中有错误参数
    else if (urlParams.get('error')) {
        const errorMessage = decodeURIComponent(urlParams.get('error'));
        document.querySelector('#resultContent').textContent = `提交失败: ${errorMessage}`;
        document.querySelector('#result').style.display = 'block';
    }
    
    // 为表单添加提交事件监听
    document.querySelector('#myForm').onsubmit = handleSubmit;
});