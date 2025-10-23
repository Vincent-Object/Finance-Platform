import dayjs from 'dayjs'

// 存储键名
const STORAGE_KEY = 'finance_platform_investments'
const INVESTORS_KEY = 'finance_platform_investors'
const STOCK_PRICES_KEY = 'finance_platform_stock_prices'

/**
 * 股票投资记录管理服务
 * 提供数据的增删改查、验证、统计计算等功能
 */
class InvestmentService {
  constructor() {
    this.initializeStorage()
  }

  /**
   * 初始化存储，如果没有数据则创建默认数据
   */
  initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // 生成模拟数据
      const mockData = this.generateMockData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData))
    }
    if (!localStorage.getItem(INVESTORS_KEY)) {
      localStorage.setItem(INVESTORS_KEY, JSON.stringify(['张三', '李四', '王五', '赵六', '钱七', '孙八']))
    }
    if (!localStorage.getItem(STOCK_PRICES_KEY)) {
      // 生成模拟股票价格
      const mockPrices = this.generateMockStockPrices()
      localStorage.setItem(STOCK_PRICES_KEY, JSON.stringify(mockPrices))
    }
  }

  /**
   * 生成30条模拟股票投资数据
   */
  generateMockData() {
    const investors = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
    const holdingMethods = ['拥有', '持有']
    const investmentTypes = ['买入', '卖出']
    
    // 真实的股票数据
    const stocks = [
      { code: '000001', name: '平安银行' },
      { code: '000002', name: '万科A' },
      { code: '000858', name: '五粮液' },
      { code: '002415', name: '海康威视' },
      { code: '002594', name: '比亚迪' },
      { code: '300015', name: '爱尔眼科' },
      { code: '300059', name: '东方财富' },
      { code: '300750', name: '宁德时代' },
      { code: '600036', name: '招商银行' },
      { code: '600519', name: '贵州茅台' },
      { code: '600887', name: '伊利股份' },
      { code: '000725', name: '京东方A' },
      { code: '002230', name: '科大讯飞' },
      { code: '000568', name: '泸州老窖' },
      { code: '002027', name: '分众传媒' },
      { code: '600276', name: '恒瑞医药' },
      { code: '000963', name: '华东医药' },
      { code: '600031', name: '三一重工' },
      { code: '002304', name: '洋河股份' },
      { code: '600900', name: '长江电力' }
    ]
    
    const mockData = []
    
    for (let i = 0; i < 30; i++) {
      const stock = stocks[i % stocks.length]
      const investor = investors[i % investors.length]
      const basePrice = Math.random() * 80 + 10 // 10-90元之间
      const quantity = (Math.floor(Math.random() * 10) + 1) * 100 // 100-1000股，100的倍数
      const currentShares = quantity - Math.floor(Math.random() * quantity * 0.3) // 当前股数略少于投资数量
      const priceChange = (Math.random() - 0.5) * 0.4 // ±20%的价格变动
      const currentPrice = basePrice * (1 + priceChange)
      
      // 随机日期，在过去一年内
      const randomDays = Math.floor(Math.random() * 365)
      const investmentDate = dayjs().subtract(randomDays, 'day').format('YYYY-MM-DD')
      
      const record = {
        id: this.generateId(),
        investor: investor,
        stockCode: stock.code,
        stockName: stock.name,
        holdingMethod: holdingMethods[Math.floor(Math.random() * holdingMethods.length)],
        investmentDate: investmentDate,
        investmentType: investmentTypes[Math.floor(Math.random() * investmentTypes.length)],
        quantity: quantity,
        currentShares: currentShares,
        unitPrice: Number(basePrice.toFixed(2)),
        currentPrice: Number(currentPrice.toFixed(2)),
        totalAmount: Number((quantity * basePrice).toFixed(2)),
        remarks: Math.random() > 0.7 ? `投资备注${i + 1}` : '',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
      
      mockData.push(record)
    }
    
    return mockData
  }
  
  /**
   * 生成模拟股票价格数据
   */
  generateMockStockPrices() {
    const stocks = [
      '000001', '000002', '000858', '002415', '002594',
      '300015', '300059', '300750', '600036', '600519',
      '600887', '000725', '002230', '000568', '002027',
      '600276', '000963', '600031', '002304', '600900'
    ]
    
    const prices = {}
    stocks.forEach(code => {
      const basePrice = Math.random() * 80 + 10
      prices[code] = Number(basePrice.toFixed(2))
    })
    
    return prices
  }

  /**
   * 重置为模拟数据（用于测试）
   */
  resetToMockData() {
    try {
      const mockData = this.generateMockData()
      const mockPrices = this.generateMockStockPrices()
      const mockInvestors = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData))
      localStorage.setItem(STOCK_PRICES_KEY, JSON.stringify(mockPrices))
      localStorage.setItem(INVESTORS_KEY, JSON.stringify(mockInvestors))
      
      return { success: true, message: '数据已重置为模拟数据' }
    } catch (error) {
      console.error('重置模拟数据失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
  }

  /**
   * 获取所有投资记录
   * @param {Object} filters - 筛选条件
   * @returns {Array} 投资记录列表
   */
  getAll(filters = {}) {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      let filteredData = data

      // 按投资人筛选
      if (filters.investor) {
        filteredData = filteredData.filter(record => 
          record.investor.includes(filters.investor)
        )
      }

      // 按持有方式筛选
      if (filters.holdingMethod) {
        filteredData = filteredData.filter(record => 
          record.holdingMethod === filters.holdingMethod
        )
      }

      // 按股票代码筛选
      if (filters.stockCode) {
        filteredData = filteredData.filter(record => 
          record.stockCode.includes(filters.stockCode)
        )
      }

      // 按日期范围筛选
      if (filters.startDate && filters.endDate) {
        filteredData = filteredData.filter(record => {
          const recordDate = dayjs(record.investmentDate)
          return recordDate.isAfter(dayjs(filters.startDate).subtract(1, 'day')) &&
                 recordDate.isBefore(dayjs(filters.endDate).add(1, 'day'))
        })
      }

      // 搜索关键词
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredData = filteredData.filter(record => 
          record.stockName.toLowerCase().includes(searchTerm) ||
          record.stockCode.toLowerCase().includes(searchTerm) ||
          record.investor.toLowerCase().includes(searchTerm)
        )
      }

      return filteredData
    } catch (error) {
      console.error('获取投资记录失败:', error)
      return []
    }
  }

  /**
   * 按投资人获取记录
   */
  getByInvestor(investor) {
    return this.getAll({ investor })
  }

  /**
   * 按持有方式获取记录
   */
  getByHoldingMethod(holdingMethod) {
    return this.getAll({ holdingMethod })
  }

  /**
   * 按股票代码获取记录
   */
  getByStockCode(stockCode) {
    return this.getAll({ stockCode })
  }

  /**
   * 添加投资记录
   */
  add(record) {
    try {
      // 数据验证
      const validation = this.validateRecord(record)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const newRecord = {
        ...record,
        id: this.generateId(),
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        totalAmount: record.quantity * record.unitPrice,
        currentValue: record.currentShares * (record.currentPrice || record.unitPrice)
      }

      data.push(newRecord)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      
      // 更新投资人列表
      this.addInvestor(record.investor)
      
      return { success: true, data: newRecord }
    } catch (error) {
      console.error('添加投资记录失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 更新投资记录
   */
  update(id, record) {
    try {
      const validation = this.validateRecord(record)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const index = data.findIndex(item => item.id === id)
      
      if (index === -1) {
        throw new Error('记录不存在')
      }

      const updatedRecord = {
        ...data[index],
        ...record,
        updateTime: new Date().toISOString(),
        totalAmount: record.quantity * record.unitPrice,
        currentValue: record.currentShares * (record.currentPrice || record.unitPrice)
      }

      data[index] = updatedRecord
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      
      // 更新投资人列表
      this.addInvestor(record.investor)
      
      return { success: true, data: updatedRecord }
    } catch (error) {
      console.error('更新投资记录失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 删除投资记录
   */
  delete(id) {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const index = data.findIndex(item => item.id === id)
      
      if (index === -1) {
        throw new Error('记录不存在')
      }

      data.splice(index, 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      
      return { success: true }
    } catch (error) {
      console.error('删除投资记录失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 数据验证
   */
  validateRecord(record) {
    const errors = []

    // 投资人验证
    if (!record.investor || record.investor.trim().length < 2 || record.investor.trim().length > 20) {
      errors.push('投资人姓名必须为2-20个字符')
    }

    // 股票代码验证
    if (!record.stockCode || !/^[0-9A-Za-z]{6}$/.test(record.stockCode)) {
      errors.push('股票代码必须为6位数字或字母组合')
    }

    // 股票名称验证
    if (!record.stockName || record.stockName.trim().length < 2 || record.stockName.trim().length > 20) {
      errors.push('股票名称必须为2-20个字符')
    }

    // 持有方式验证
    if (!record.holdingMethod || !['拥有', '持有'].includes(record.holdingMethod)) {
      errors.push('持有方式必须为拥有或持有')
    }

    // 投资日期验证
    if (!record.investmentDate || dayjs(record.investmentDate).isAfter(dayjs())) {
      errors.push('投资日期不能超过当前日期')
    }

    // 投资类型验证
    if (!record.investmentType || !['买入', '卖出'].includes(record.investmentType)) {
      errors.push('投资类型必须为买入或卖出')
    }

    // 数量验证
    if (!record.quantity || record.quantity <= 0 || record.quantity % 100 !== 0) {
      errors.push('投资数量必须为正整数且为100的整数倍')
    }

    // 当前股数验证
    if (record.currentShares < 0 || record.currentShares > record.quantity) {
      errors.push('当前股数不能为负数且不能超过投资数量')
    }

    // 单价验证
    if (!record.unitPrice || record.unitPrice <= 0) {
      errors.push('买入单价必须为正数')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * 获取投资人列表
   */
  getInvestors() {
    try {
      return JSON.parse(localStorage.getItem(INVESTORS_KEY) || '[]')
    } catch (error) {
      console.error('获取投资人列表失败:', error)
      return []
    }
  }

  /**
   * 添加投资人
   */
  addInvestor(investor) {
    try {
      const investors = this.getInvestors()
      if (!investors.includes(investor)) {
        investors.push(investor)
        localStorage.setItem(INVESTORS_KEY, JSON.stringify(investors))
      }
    } catch (error) {
      console.error('添加投资人失败:', error)
    }
  }

  /**
   * 计算统计数据
   */
  calculateSummary(investor = null) {
    try {
      const records = investor ? this.getByInvestor(investor) : this.getAll()
      
      if (records.length === 0) {
        return {
          totalInvestment: 0,
          totalCurrentValue: 0,
          totalUnrealizedGain: 0,
          totalProfitRate: 0,
          holdingStocks: 0,
          totalShares: 0,
          totalTransactions: 0,
          activeInvestors: 0
        }
      }

      const totalInvestment = records.reduce((sum, record) => sum + record.totalAmount, 0)
      const totalCurrentValue = records.reduce((sum, record) => {
        const currentPrice = record.currentPrice || record.unitPrice
        return sum + (record.currentShares * currentPrice)
      }, 0)
      
      const totalUnrealizedGain = totalCurrentValue - totalInvestment
      const totalProfitRate = totalInvestment > 0 ? (totalUnrealizedGain / totalInvestment) * 100 : 0
      
      const uniqueStocks = new Set(records.map(record => record.stockCode))
      const uniqueInvestors = new Set(records.map(record => record.investor))
      const totalShares = records.reduce((sum, record) => sum + record.currentShares, 0)

      return {
        totalInvestment,
        totalCurrentValue,
        totalUnrealizedGain,
        totalProfitRate,
        holdingStocks: uniqueStocks.size,
        totalShares,
        totalTransactions: records.length,
        activeInvestors: uniqueInvestors.size
      }
    } catch (error) {
      console.error('计算统计数据失败:', error)
      return {
        totalInvestment: 0,
        totalCurrentValue: 0,
        totalUnrealizedGain: 0,
        totalProfitRate: 0,
        holdingStocks: 0,
        totalShares: 0,
        totalTransactions: 0,
        activeInvestors: 0
      }
    }
  }

  /**
   * 更新股票价格
   */
  updateStockPrice(stockCode, price) {
    try {
      const prices = JSON.parse(localStorage.getItem(STOCK_PRICES_KEY) || '{}')
      prices[stockCode] = price
      localStorage.setItem(STOCK_PRICES_KEY, JSON.stringify(prices))
      return { success: true }
    } catch (error) {
      console.error('更新股票价格失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 获取股票价格
   */
  getStockPrice(stockCode) {
    try {
      const prices = JSON.parse(localStorage.getItem(STOCK_PRICES_KEY) || '{}')
      return prices[stockCode] || null
    } catch (error) {
      console.error('获取股票价格失败:', error)
      return null
    }
  }

  /**
   * 导出数据
   */
  export(format = 'json') {
    try {
      const data = this.getAll()
      
      if (format === 'json') {
        return JSON.stringify(data, null, 2)
      } else if (format === 'csv') {
        if (data.length === 0) return ''
        
        const headers = Object.keys(data[0]).join(',')
        const rows = data.map(record => 
          Object.values(record).map(value => 
            typeof value === 'string' && value.includes(',') ? `"${value}"` : value
          ).join(',')
        )
        
        return [headers, ...rows].join('\n')
      }
      
      return ''
    } catch (error) {
      console.error('导出数据失败:', error)
      return ''
    }
  }

  /**
   * 批量导入数据
   */
  import(records) {
    try {
      const validRecords = []
      const errors = []
      
      records.forEach((record, index) => {
        const validation = this.validateRecord(record)
        if (validation.isValid) {
          validRecords.push({
            ...record,
            id: this.generateId(),
            createTime: new Date().toISOString(),
            updateTime: new Date().toISOString(),
            totalAmount: record.quantity * record.unitPrice,
            currentValue: record.currentShares * (record.currentPrice || record.unitPrice)
          })
        } else {
          errors.push(`第${index + 1}条记录: ${validation.errors.join(', ')}`)
        }
      })
      
      if (validRecords.length > 0) {
        const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        const newData = [...existingData, ...validRecords]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      }
      
      return {
        success: true,
        imported: validRecords.length,
        errors: errors
      }
    } catch (error) {
      console.error('导入数据失败:', error)
      return {
        success: false,
        imported: 0,
        errors: [error.message]
      }
    }
  }
}

// 创建单例实例
const investmentService = new InvestmentService()

export default investmentService