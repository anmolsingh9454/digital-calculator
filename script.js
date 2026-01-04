
(() => {
  const exprEl = document.getElementById('expr')
  const resultEl = document.getElementById('result')
  const historyEl = document.getElementById('history')
  const aiInput = document.getElementById('aiInput')

  let expression = ''

  function updateDisplay() {
    exprEl.textContent = expression || '0'
  }

  function append(value) {
    if (expression === '0' && /\d/.test(value)) expression = value
    else expression += value
    updateDisplay()
  }

  function clearAll() {
    expression = ''
    resultEl.textContent = '0'
    updateDisplay()
  }

  function backspace() {
    expression = expression.slice(0, -1)
    updateDisplay()
  }

  function safeEval(expr) {
  
    let s = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
    
    s = s.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
    
    if (/[^0-9+\-*/().,%\s^eEpiPIsqrtpiPI]/.test(s)) {
      
    }

    
    s = s.replace(/\^/g, '**')
    
    s = s.replace(/sqrt\(/gi, 'Math.sqrt(')
  
    s = s.replace(/\bpi\b/gi, 'Math.PI')
    
    s = s.replace(/\bsin\(/gi, 'Math.sin(')
    s = s.replace(/\bcos\(/gi, 'Math.cos(')
    s = s.replace(/\btan\(/gi, 'Math.tan(')
    
    if (/[^0-9+\-*/().,\s*MathPIenptgkrxSbctaiudl]/i.test(s)) {
    
    }

    try {

      const val = eval(s)
      return val
    } catch (e) {
      return null
    }
  }

  function calculate() {
    if (!expression) return
    const val = safeEval(expression)
    if (val === null || typeof val === 'undefined' || Number.isNaN(val)) {
      resultEl.textContent = 'Error'
      return
    }
    resultEl.textContent = String(val)
    pushHistory(expression, val)
    expression = String(val)
    updateDisplay()
  }

  function pushHistory(expr, val) {
    const item = document.createElement('div')
    item.className = 'hist-item'
    item.textContent = `${expr} = ${val}`
    historyEl.prepend(item)
  }

  
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = btn.dataset.action
      const v = btn.dataset.value
      if (a === 'clear') return clearAll()
      if (a === 'back') return backspace()
      if (a === 'calculate') return calculate()
      if (v) {
        if (v === 'sqrt') append('sqrt(')
        else if (v === 'pi') append('pi')
        else append(v)
      }
    })
  })

  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { calculate(); e.preventDefault(); return }
    if (e.key === 'Backspace') { backspace(); return }
    if (/^[0-9()+\-*/.%^]$/.test(e.key)) {
      append(e.key)
      return
    }
  })

  
  function parseNaturalLanguage(input) {
    let s = input.toLowerCase().trim()
    
    s = s.replace(/what is |calculate |evaluate |compute |=|please /g, '')
    s = s.replace(/plus|add|and/g, '+')
    s = s.replace(/minus|subtract/g, '-')
    s = s.replace(/times|x|multiplied by|multiply by/g, '*')
    s = s.replace(/divided by|over/g, '/')
    s = s.replace(/square root of |sqrt of |sqrt /g, 'sqrt(')
    s = s.replace(/to the power of |power of |\^/g, '^')
    s = s.replace(/percent of |% of /g, '%*')
    s = s.replace(/percent|percentage/g, '%')
    s = s.replace(/pi/g, 'pi')

    
    const smallNums = {zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16, seventeen:17, eighteen:18, nineteen:19, twenty:20}
    s = s.replace(new RegExp('\\b(' + Object.keys(smallNums).join('|') + ')\\b','g'), m=> smallNums[m])

    
    s = s.replace(/sqrt\(([^)]+)\)/g, 'sqrt($1)')

    
    if (/[0-9()+\-*/^%.]/.test(s)) return s
    return null
  }

  document.getElementById('aiBtn').addEventListener('click', () => {
    const val = aiInput.value.trim()
    if (!val) return
    const parsed = parseNaturalLanguage(val)
    if (!parsed) {
      resultEl.textContent = 'Could not parse'
      return
    }
    expression = parsed
    updateDisplay()
    calculate()
  })

  document.getElementById('clearHistory').addEventListener('click', () => {
    historyEl.innerHTML = ''
  })

  
  clearAll()
})();