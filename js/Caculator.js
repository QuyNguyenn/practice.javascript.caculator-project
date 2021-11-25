function Caculator(selector) {

    // Store value of M+, M- function
    class Registor {

        constructor() {
            this.clear();
        }

        clear() {
            this._enable = false;
            this._value = 0;
        }
    
        get value() {
            return this._value;
        }
    
        set value(val) {
            this._value = val;
        }

        get enable() {
            return this._enable;
        }
    
        set enable(value) {
            this._enable = value;
        }
    }
    
    // Remember last operation
    class Memory {
        #_firstNum;
        #_secondNum;
        #_operator;
        #_caculated;
        #_isEnteredSecondNum;
        #_isEnteringOperator;
    
        constructor() {
            this.clear();
        }
    
        clear() {
            this.#_firstNum = null;
            this.#_secondNum = null;
            this.#_operator = null;
            this.#_caculated = false;
            this.#_isEnteredSecondNum = false;
            this.#_isEnteringOperator = false;
        }
    
        get firstNum() {
            return this.#_firstNum == null ? '' : this.#_firstNum;
        }
    
        set firstNum(value) {
            this.#_firstNum = value;
        }
    
        get secondNum() {
            return this.#_secondNum == null ? '' : this.#_secondNum;
        }
    
        set secondNum(value) {
            this.#_secondNum = value;
        }
    
        get operator() {
            return this.#_operator == null ? '' : this.#_operator;
        }
    
        set operator(value) {
            this.#_operator = value;
        }
    
        get caculated() {
            return this.#_caculated;
        }
    
        set caculated(value) {
            this.#_caculated = value;
        }

        get isEnteringOperator() {
            return this.#_isEnteringOperator;
        }
    
        set isEnteringOperator(value) {
            this.#_isEnteringOperator = value;
        }

        get isEnteredSecondNum() {
            return this.#_isEnteredSecondNum;
        }

        set isEnteredSecondNum(value) {
            this.#_isEnteredSecondNum = value;
        }
    }
    
    // Store input value and process value to display
    class DisplayMemory {
        _maxChar = 16;

        constructor() {
            this.clear();
        }

        clear() {
            this._value = '0';
            this._sign = false;
            this._fPoint = false;
            this._isEntering = false;
        }
    
        changeSign() {

            if (this._value == '0') {

                this._sign = false;
                return;
            }

            this._sign = !this._sign;
        }
    
        get value() {

            let value = `${this._sign ? '-' : ''}${this._value}`;
            return Number.parseFloat(value);
        }

        get stringValue() {

            // let value = '';
            // let integerStr = Math.trunc(this._value).toString();

            // if (integerStr.indexOf('.') == -1 && integerStr.length > 3) {

            //     const section = [];
            //     while (integerStr.length > 3) {

            //         section.unshift(integerStr.substr(-3));
            //         integerStr = integerStr.substr(0, integerStr.length - 3);
            //     }
            //     section.unshift(integerStr);
                
            //     const fraction = ((value) =>  {
            //         value = value.toString();
            //         if (value.indexOf('.') != -1) {
            //             return value.substr(value.indexOf('.'));
            //         }

            //         return '';
            //     })(this._value);

            //     value =  `${section.join(',')}${fraction}`;
            // }
            // else {
            //     value = `${this._sign ? '-' : ''}${this._value}`;
            // }

            let value = '';
            if (this._value.toString().indexOf('e') == -1) {
                let reformatValue = new Intl.NumberFormat('en-US').format(this._value)
                value = `${this._sign ? '-' : ''}${reformatValue}`;;

                if (this._value.toString().substr(-1) == '.') {
                    value += '.';
                }
            }
            else {
                value = `${this._sign ? '-' : ''}${this._value}`;
            }

            return value;
        }
    
        set value(value) {
    
            if (typeof(value) == "number") {

                let stringValue = value.toString();

                if (value < 0) {
                    this._sign = true;
                    stringValue = stringValue.replace(/^./, '');
                }
                
                this._value = stringValue;
            }
        }

        finishEnter() {
            this._isEntering = false;
            this._fPoint = false;
        }

        get isEntering() {
            return this._isEntering;
        }
    
        push(value) {
            
            value = typeof(value) == 'number' ? value.toString() : value;
            let regex = /[.0-9]/;

            if (regex.test(value)) {

                if (!this._isEntering) {
                    this._value = '0';
                    this._sign = false;
                    this._isEntering = true;
                }

                if (value == '.') {

                    if (this._fPoint == false) {
                        this._value += '' + value;
                        this._fPoint = true;
                    }
                }
                else {

                    if (this._value == '0') {
                        this._value = value;
                        return;
                    }

                    let length = this._value.length;

                    if (this._fPoint) {
                        length--;
                        if (this._value.charAt(0) == '0') {
                            length--;
                        }
                    }

                    if (length < this._maxChar) {
                        this._value += '' + value;
                    }
                }
            }
        }
    
        pop() {
    
            let lastChar = this._value.charAt(this._value.length - 1);
            this._value = this._value.substring(0, this._value.length - 1);
    
            if (lastChar == '.') {
                this._fPoint = false;
            }
    
            if (this._value.length <= 0) {
                this._value = '0';
            }
        }
    }
    
    const Caculator = document.querySelector(selector);
    const registor = new Registor;
    const memory = new Memory;
    const displayMemory = new DisplayMemory;

    if (Caculator) {

        const screen = Caculator.querySelector('.screen');
        const valueContainer = screen.querySelector('.value');
        const fontSizeOffset = valueContainer.style.getPropertyValue('font-size').replace('px', '');

        // Enter number, floating point buttons
        const inputButtons = {};
        Array.from(Caculator.querySelectorAll('.btn--value')).forEach(button => {
            const buttonType = button.dataset.function;
            inputButtons[buttonType] = button;
        })

        // Enter operation buttons
        const operatorButtons = {};
        Array.from(Caculator.querySelectorAll('.btn--operator')).forEach(button => {
            const buttonType = button.dataset.function;
            operatorButtons[buttonType] = button;
        })

        // MC, M+, M-, MR buttons
        const specialFunctionButtons = {};
        Array.from(Caculator.querySelectorAll('.btn--special')).forEach(button => {
            const buttonType = button.dataset.function;
            specialFunctionButtons[buttonType] = button;
        })

        for (const index in inputButtons) {
            inputButtons[index].onclick = (e) => {

                displayMemory.push(e.target.dataset.function);

                if (memory.caculated && memory.operator) {
                    memory.caculated = false;
                }

                if (index != '.' && memory.isEnteringOperator && !memory.isEnteredSecondNum) {
                    memory.isEnteredSecondNum = true;
                }

                displayProcess(screen, valueContainer, registor, memory, displayMemory);
            }
        }

        for (const index in operatorButtons) {
            operatorButtons[index].onclick = (e) => {

                const operator = e.target.dataset.function;
                switch (operator) {
                    case 'clear':
                        displayMemory.clear();
                        memory.clear();
                        break;
                    case 'delete':
                        displayMemory.pop();
                        break;
                    case 'sign':
                        displayMemory.changeSign();
                        break;
                    case 'x':
                    case '/':
                    case '+':
                    case '-':
                    case '=':
                        displayMemory.finishEnter();
                        operatorHandler(operator, memory, displayMemory);
                        break;
                    default:
                        break;
                }
                displayProcess(screen, valueContainer, registor, memory, displayMemory);
            }
        }

        for (const index in specialFunctionButtons) {
            specialFunctionButtons[index].onclick = (e) => {

                displayMemory.finishEnter();
                const operator = e.target.dataset.function;
                specialFunctionHandler(operator, registor, memory, displayMemory);
                displayProcess(screen, valueContainer, registor, memory, displayMemory);

                if (!registor.enable) {
                    specialFunctionButtons.mc.classList.add('disable');
                    specialFunctionButtons.mr.classList.add('disable');
                }
                else {
                    specialFunctionButtons.mc.classList.remove('disable');
                    specialFunctionButtons.mr.classList.remove('disable');
                }
            }
        }

        // Handler M+, M- function
        function specialFunctionHandler(operator, registor, memory, displayMemory) {
            switch (operator) {
                case 'mc':
                    if (!registor.enable) {
                        return;
                    }
                    registor.clear();
                    break;
                case 'mr':
                    if (!registor.enable) {
                        return;
                    }
                    displayMemory.value = registor.value;
                    break;
                case 'm+':
                    registor.enable = true;
                    registor.value += displayMemory.value;
                    break;
                case 'm-':
                    registor.enable = true;
                    registor.value -= displayMemory.value;
                    break;
                default:
                    break;
            }

            if (memory.caculated && memory.operator) {
                memory.caculated = false;
            }
        }

        // Handler operator
        function operatorHandler(operator, memory, displayMemory) {

            if (operator == '=') {
                if (memory.isEnteringOperator) {
                    memory.secondNum = displayMemory.value;
                    memory.caculated = true;
                    memory.isEnteringOperator = false;

                    displayMemory.value = caculate(memory.operator, memory.firstNum, memory.secondNum);
                }
                else {
                    memory.firstNum = displayMemory.value;
                    memory.caculated = true;
                    memory.isEnteringOperator = false;

                    displayMemory.value = caculate(memory.operator, memory.firstNum, memory.secondNum);
                }
            }
            else {
                if (memory.isEnteringOperator) {
                    if (memory.isEnteredSecondNum) {
                        memory.firstNum = caculate(memory.operator, memory.firstNum, displayMemory.value);
                        memory.secondNum = '';
                        memory.operator = operator;
                        memory.caculated = false;

                        displayMemory.value = memory.firstNum;
                    }
                    else {
                        memory.operator = operator;
                        memory.caculated = false;
                    }
                    memory.isEnteredSecondNum = false;
                }
                else {
                    memory.firstNum = displayMemory.value;
                    memory.secondNum = ''
                    memory.operator = operator;
                    memory.caculated = false;
                    memory.isEnteringOperator = true;
                    memory.isEnteredSecondNum = false;
                }
            }
        }

        // Calculateting function
        function caculate(operator, firstNum, secondNum) {

            firstNum = firstNum == '' ? 0 : firstNum;
            secondNum = secondNum == '' ? 0 : secondNum;

            const firstNumFractLength = firstNum.toString().length - Math.trunc(firstNum).toString().length - 1;
            const secondNumFractLength = secondNum.toString().length - Math.trunc(secondNum).toString().length - 1;
            
            let roundFactor = Math.max(firstNumFractLength, secondNumFractLength, 0);
            let result;

            switch (operator) {
                case '+':
                    result = firstNum + secondNum;
                    return Math.round(result * (10 ** roundFactor)) / (10 ** roundFactor);
                case '-':
                    result = firstNum - secondNum;
                    return Math.round(result * (10 ** roundFactor)) / (10 ** roundFactor);
                case 'x':
                    return firstNum * secondNum;
                case '/':
                    return firstNum / secondNum;
                default:
                    return undefined;
            }
        }

        // Function for handling value to display on screen
        function displayProcess(screen, valueContainer, registor, memory, displayMemory) {
            
            const modDisplay = screen.children[0];
            const expressionDisplay = screen.children[1];
            const valueDisplay = screen.children[2];

            if (registor.enable) {
                modDisplay.innerText = 'M';
            }
            else {
                modDisplay.innerText = '';
            }

            let expressionText;
            if (memory.caculated) {
                expressionText = `${memory.firstNum} ${memory.operator} ${memory.secondNum < 0 ? `(${memory.secondNum})` : memory.secondNum} =`;
            }
            else if (memory.isEnteringOperator) {
                expressionText = `${memory.firstNum} ${memory.operator}`;
            }
            else {
                expressionText = ``;
            }
            expressionDisplay.innerText = expressionText;

            let displayText = displayMemory.stringValue;
            valueDisplay.innerText = displayText;

            resizeText(screen, valueContainer);
        }

        // Resize text if the text is overflow
        function resizeText(screen, valueContainer)
        {   
            const screenWidth = screen.clientWidth;
            const valueContainerWidth = valueContainer.clientWidth;
            const fontSize = valueContainer.style.getPropertyValue('font-size').replace('px', '');
            let newFontSize = 0;

            if (valueContainerWidth > screenWidth) {
                newFontSize = Math.floor(screenWidth / valueContainerWidth * fontSize);
            }
            else {
                newFontSize = Math.min(Math.floor(fontSize / valueContainerWidth * screenWidth), fontSizeOffset);
            }
            valueContainer.style.fontSize = newFontSize + 'px';
        }

        function start() {

            displayProcess(screen, valueContainer, registor, memory, displayMemory);
        }

        start();
    }
}
