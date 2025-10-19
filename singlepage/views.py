from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from datetime import datetime, timedelta

# 作者: 吴永婷
# 创建时间: 2024年

# 主页面视图
def index(request):
    return render(request, 'singlepage/index.html')

# AJAX页面视图
def ajax_page(request):
    return render(request, 'singlepage/ajax_page.html')

# 表单页面视图
def forms_page(request):
    return render(request, 'singlepage/forms_page.html')

# 无限滚动页面视图
def infinite_scroll(request):
    return render(request, 'singlepage/infinite_scroll.html')

# AJAX数据获取视图
def section(request, num):
    # 根据请求的部分返回不同内容
    content = {
        '1': '<h2>部分 1</h2><p>这是通过AJAX加载的第一部分内容。单页应用可以在不刷新页面的情况下获取数据。</p>',
        '2': '<h2>部分 2</h2><p>这是通过AJAX加载的第二部分内容。这种方式可以提高用户体验，减少加载时间。</p>',
        '3': '<h2>部分 3</h2><p>这是通过AJAX加载的第三部分内容。服务器只需要返回必要的数据，而不是整个页面。</p>'
    }
    return HttpResponse(content.get(num, '<p>内容不存在</p>'))

# 表单提交处理视图
def submit(request):
    if request.method == 'POST':
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        message = request.POST.get('message', '')
        
        # 这里可以添加数据处理逻辑，如保存到数据库等
        
        return HttpResponse(f'感谢您的提交，{name}！我们已收到您的留言。')
    
    return HttpResponse('无效的请求方法', status=405)

# 无限滚动内容加载视图
def infinite_load(request):
    # 获取页码参数，默认为1
    page = int(request.GET.get('page', 1))
    # 每页显示的文章数量
    posts_per_page = 5
    # 模拟数据库中的总文章数
    total_posts = 20
    
    # 计算当前页的文章起始索引
    start_index = (page - 1) * posts_per_page
    end_index = min(start_index + posts_per_page, total_posts)
    
    # 如果起始索引已经超过总文章数，返回空数据
    if start_index >= total_posts:
        return JsonResponse({'posts': [], 'has_more': False})
    
    # 生成模拟文章数据
    posts = []
    for i in range(start_index + 1, end_index + 1):
        # 生成一个过去的日期
        post_date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        posts.append({
            'id': i,
            'title': f'文章 #{i}',
            'content': f'这是第 {i} 篇文章的内容。这是用于演示无限滚动加载功能的模拟数据。当用户向下滚动页面时，更多的文章将被动态加载出来。',
            'date': post_date
        })
    
    # 检查是否还有更多文章
    has_more = end_index < total_posts
    
    # 返回JSON格式的数据
    return JsonResponse({'posts': posts, 'has_more': has_more})
