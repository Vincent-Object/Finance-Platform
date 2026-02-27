# 主题设置功能说明

## 功能概述

本次更新为金融平台应用添加了完整的主题切换功能，支持浅色（Light）和深色（Dark）两种主题模式。

## 主要特性

### 1. 双主题支持
- **浅色主题**：默认的明亮界面，适合白天使用
- **深色主题**：护眼的暗色界面，适合夜间使用

### 2. 持久化存储
- 用户的主题偏好会自动保存到 localStorage
- 下次访问时自动应用上次选择的主题

### 3. 平滑过渡
- 主题切换时有流畅的过渡动画效果
- 所有组件都支持主题切换

### 4. 全局适配
- Naive UI 组件完全适配深色主题
- 自定义组件样式自动跟随主题变化

## 使用方式

### 在个人中心切换主题

1. 登录后进入个人中心页面
2. 在"外观设置"卡片中：
   - 点击"浅色"或"深色"按钮选择主题
   - 或使用快速切换开关（☀️/🌙）

### 在代码中使用

```javascript
import { useTheme } from '@/composables/useTheme'

export default {
  setup() {
    const { theme, isDark, setTheme, toggleTheme } = useTheme()
    
    // 切换到深色主题
    setTheme('dark')
    
    // 切换到浅色主题
    setTheme('light')
    
    // 切换主题（浅色 ↔ 深色）
    toggleTheme()
    
    // 检查当前是否为深色主题
    console.log(isDark.value)
    
    return {
      theme,
      isDark
    }
  }
}
```

## 技术实现

### 核心文件

1. **`src/composables/useTheme.js`**
   - 主题状态管理
   - 主题切换逻辑
   - localStorage 持久化

2. **`src/styles/theme.css`**
   - 全局主题样式
   - 深色主题适配
   - 过渡动画效果

3. **`src/App.vue`**
   - NConfigProvider 配置
   - 主题提供者集成

4. **`src/views/ProfilePage.vue`**
   - 主题设置界面
   - 用户交互控件

### 样式适配

所有组件都通过 `.dark-theme` 类名来适配深色主题：

```css
/* 浅色主题 */
.component {
  background: white;
  color: #333;
}

/* 深色主题 */
.dark-theme .component {
  background: #1f2937;
  color: #e0e0e0;
}
```

## 已适配的组件

- ✅ 顶部导航栏 (TopNavigation)
- ✅ 主布局 (MainLayout)
- ✅ 个人中心页面 (ProfilePage)
- ✅ 所有 Naive UI 组件
- ✅ 表单组件
- ✅ 数据表格
- ✅ 卡片组件

## 未来扩展

可以考虑添加以下功能：
- 跟随系统主题设置
- 自定义主题颜色
- 主题预览功能
- 更多主题选项（如高对比度主题）
