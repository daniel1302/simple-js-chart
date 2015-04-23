function getUnique() {
    return Math.round((1+ Math.random()) * 1000000);
}

var newElement = function(name, attr) {
    var svgNS = "http://www.w3.org/2000/svg";  
    var tmp = document.createElementNS(svgNS, name);
    for (k in attr) {
        if (k === 'style') {
            for (s in attr[k]) {
                tmp.style[s] = attr[k][s]; 
            }
        } else if (k === 'innerHTML') {
            tmp.innerSVG = attr[k];
        } else {
            tmp.setAttributeNS(null, k, attr[k]);
        }
    }
    
    return tmp;
};
//NIE DZIAŁA W IE!!! 
//if (typeof HTMLDocument !== 'undefined') 
 ///   HTMLDocument.prototype._new = createElem;
//else
 //   Document.prototype._new = createElem;
//

/**
 * Get Element By Class
 */
var ChartAbstract = function() {
    /**
     * Szerokość wykresu
     * @type number 
     */
    this.width = 0;
            
    /**
     * Wysokośc wykresu
     * @type number         
     **/
    this.width = 0;
            
    /**
     * Uchwyt kontenera
     * @type Object 
     */
    this.svgContainer = null;
    
    /**
     * Dane wykresu
     * @type Array 
     */
    this.data = [];
    
    /**
     * Etykiety dla wykresy
     * @type Array
     */
    this.labels = [];
    
    /**
     * Dane wykresu
     * @type Array 
     */
    this.config = [];
    
    /**
     * Która klatka wykresu jest obecnie rysowana przy aminacji
     * @type Number
     */
    this.frame = 0;
    
    /**
     * Definicje elementó składowych SVG np gradienty
     * @type Array
     */
    this.defs = [];
    
    /**
     * Stałe opisujące typy danych
     */
    this.NUMBER      = 'number';
    this.BOOLEAN     = 'boolean';
    this.OBJECT      = 'object';
    this.STRING      = 'string';
    this.UNDEFINED   = 'undefined';
    
    /**
     * Generuje unukalny kod
     */
    this.unique = getUnique();
    
    /**
     * Flaga mówi jak mamy rysowac etykiety na osi OX
     * 0: Poziomo
     * 1: Obrócone ukośnie
     */
    this.rotatedLabels = 0;
    
    /**
     * Określa miejsce na wykresie począwszy od spodu obszaru rysowania
     * w którym ejst punk neutralny 0
     * @type Number
     */
    this.y0 = 0;
    
    /**
     * Ilość przeskoków pod osią OX, czyli o ile musimy podnieśc wykres do góry
     * @type Number
     */
    this.marginBottomSteps = 0;
    
    /**
     * Tablica z warstwami
     * @type Array
     */
    this.layers = [[], [], [], [], [], [], [], [], [], []];  
    
    /**
     * Domyslna konfiguracja
     * @type Object
     */
    this.defaultConfig = {
        showLines: 1, //Czy pokazywać linie w tle
        linesColor: '167,167,167', //Kolor lini tła
        animate: 0, //Czy animować
        title: '', //Tytuł
        marginBottom: 5, //Margines dolny
        marginSide: 5, //margin boczny(zalezy od strony której 
        borderColor: '0, 0, 0', //Kolor obramownania
        showValues: 1, //Pokazuj wartości nad/obok słupkami/punktami
        legendX: '', //Legenda pozioma
        legendY: '', //Legenda pionowa
        rotateLabels: 1, //Czy pozwolić obrócić legendę
        showLabels: 1,
        animationFrames: 1000, //Ilośc klatek animacji
        animationTime: '600ms', //Czas animacji z dopiskiem [ms/s/m/g]
        showEvery: 1, //Wyświetlaj co ... etykietę
        fontSize: 14, //Wielkość czcionki
        circleR: 3, //Promieć punktu na wykresie[px]
        forceRotateLabels: 0, //Wymusza obrócenie legendy
        columnSpaccing: 0.75, //Ustala odstępy między kolumnami wykresu(jest to ułamek szerokości kolumny)
        enableGradient: 1, //Włącza gradient jeśli wykres posiada taką opcję 
        shadows: 1, //Jesli 1 to włącz generownaie cieni
        
        /**
         * Pole na tytuł
         * x:
         * +y:
         * width:
         * +height:
         */
        titleArea: { x: null, y: 30, width: null, height: 50 },
        
        /**
         * Pole na legende poziomą
         * side:
         * x:
         * +y: //Od dołu
         * width:
         * +height:
         */
        horizontalLegend: { x: null, y: 0, width: null, height: 35 },
        
        /**
         * Miejsce na legende pionową
         * +x:
         * y:
         * +width:
         * height:
         */
        verticalLegend: { side: 'left', x: 0, y: 130, width: 100, height: 20 },
        
        /**
         * Kolory w jakich rysowany będą elementy wykresu
         */
        colours: {
            0: '#BBDEF9',
            1: '#F7C93B',
            2: '#9FC62D'
        } 
    };    
  
    /**
     * Zwraca wartośc konfiguracji generatora(piewsze sprawdza przesłane przez użytkownika a póniej domyślną)
     * 
     * @param key Klucz konfiguracji z tablicy
     * @param type Opcjonalnie: Typ zmiennej, jeśli będzie się rónił rzuci wyjątek
     * @returns mixed
     */
    this.get = function(key, type) {
        var returnValue = null;
        
        if (typeof(this.config[key]) !== 'undefined') 
            returnValue = this.config[key];
        else if (typeof(this.defaultConfig[key]) !== 'undefined')
            returnValue = this.defaultConfig[key];
        else 
            throw 'Undefined property '+key+' in object';
        
        if (typeof(type) === 'string' && typeof(returnValue) !== type) {
            throw 'Invalid type of return value';
        }
        
        return returnValue;
    };
    
    
    this.setData = function(data) {
        if (typeof(data) !== 'undefined' && data.length > 0) 
            this.data = data; 
        
        return this.data;
    };
    
    this.setLabels = function(labels) {
        if (typeof(labels) !== 'undefined' && labels.length > 0) 
            this.labels = labels; 
        
        return this.labels;
    };
    
    this.setConfig = function(config) {
        if (typeof(config) !== 'undefined') 
            this.config = config; 
        
        return this.config;
    };
    
    /**
     * Funkcja pełni rolę konstruktora
     * 
     * @param chartWidth Szerokość wykresu w pixelach
     * @param chartHeight Wysokość wykresu w pixelach
     * @param chartData Obiekt z danymi którymi chcemy reprezentowa� na wykresie
     * @param chartLabels Obiekt z etykietami
     * @param chartConfig Obiekt z konfiguracją dla wykresu
     * @param containerObj Kontener w którym ma został osadzony element z wykresem
     */
    this.init = function(chartWidth, chartHeight, chartData, chartLabels, chartConfig, containerObj) {
        this.width = (typeof(chartWidth) === 'undefined') ? 700 : chartWidth;
        this.height = (typeof(chartHeight) === 'undefined') ? 300 : chartHeight;
        
        if (typeof containerObj === this.OBJECT)
            this.svgContainer = containerObj;
        
        this.setData(chartData);
        this.setConfig(chartConfig);
        this.setLabels(chartLabels);
            
        if (this.get('forceRotateLabels') === 1 && this.get('rotateLabels') !== 0) {
            this.rotatedLabels = 1;
        };
        
        this.fontSize = this.get('fontSize');
     
        //if (data.length < 1)
          //  throw 'Nie przesłano danych do wygenerowania wykresu';
        
        return null;
    };
    
    /**
     * Oblicza kluczowe pozycje oraz wymiary obszaru na którym będą prezentowane dane.
     * Wymiary prezentowane są od lewej i od dołu.
     * 
     * Zwraca obiekt typu z właściwościami:
     * x: Lewa kreska rozpoczynająca wykres
     * y: Spodnia kreska rozpoczynająca wykres
     * width: szerokość obszaru wykresu
     * height: Wysokośc obszaru wykresu
     * 
     * Do pozycji X uwzględniamy:
     * verticalLegend.x
     * varticalLegend.width
     * 
     * Do pozycji y uwzględniamy:
     * titleArea.y
     * titleArea.height
     */
    this.getChartArea = function() {
        //Pobierz najbardziej aktualne dane
        var verticalLegend = this.get('verticalLegend');
        var title = this.get('title', this.STRING);
        var titleArea = this.get('titleArea');

        var horizontalLegend = this.get('horizontalLegend');
   
        var marginBottom = this.get('marginBottom', this.NUMBER);
        var marginSide = this.get('marginSide', this.NUMBER);
        var x=0;
        var y=this.height;
        var width=this.width;
        var height=this.height;      
        
        var dx = 0; //Zmiana x względem ostatniej zmiany
        var dy = 0;
        
        
        if (verticalLegend.side === 'left') {
            if (verticalLegend.width <= 1) {
                dx += verticalLegend.width*width;
            } else {
                dx += verticalLegend.width;
            }
                
            
            dx += verticalLegend.x+marginSide;
            x += dx;
            width -= dx+5;
        } else {
            width -= (x+verticalLegend.width+marginSide);
        }
        
        if (title.length > 0) {
            height -= (titleArea.y+titleArea.height);
        }
        
        if (this.get('legendX').length > 0) {
            dy = horizontalLegend.y + horizontalLegend.height + marginBottom;
            y -= dy;
            height -= dy;
        }
        
        this.area = {
            x: x, 
            y: y,
            width: Math.round(width-0.07*width),//Odejmij 7%
            height: (height - 5) //Odejmij od góry, zeby uniknąć ucinania napisów
        };
        
        /**
         * Przy liczeniu wysokosci uwzględnij czy legende trzeba 
         * narysować poziomo czy pionowo i zmodyfikuj wymiary wg potrzeb.
         */
        if (horizontalLegend.height > 0 && typeof this.labels !== 'undefined' && this.labels.length > 0) {
            var hJumpSize = this.getRealHorizontalJumpSize(this.labels.length);
            
            for (x in this.labels) {
                if ((this.labels[x].length * this.fontSize/2) > hJumpSize) {
                    this.rotatedLabels = 1;
                    break;
                }
            }
            var diff = 0.2*this.area.height;
            this.area.y -= diff;
            this.area.height -= diff;
        }
        
        return this.area;
    };
    
    /**
     * Funkcja dostając wartośc maksymalna oraz ilość podziałów oblicza skok 
     * wartości jednego podziału, z zaokrąglaniem odpowiednio dla wartości:
     * 
     * <10          0.5;
     * <50          2.5
     * <100         5
     * <500         25
     * <1000        50
     * <5000        75
     * <10000       100
     * <50000       250
     * >50000       floor(log10(wartosci))
     * 
     * @param maxValue Największa wartość wyświetlana na wykresie
     * @param minValue Najmniejsza wartość
     * @returns number
    */
    this.getValueJump = function(minValue, maxValue) {        
        if (typeof maxValue !== this.NUMBER)
            maxValue = 1;
        if (typeof minValue !== this.NUMBER)
            maxValue = 0;
        
        var tempValue = 0;
        if (minValue > maxValue) {
            tempValue = maxValue;
            
            maxValue = minValue;
            minValue = maxValue;
        }
            
        
        maxValue = parseInt(maxValue);
        
        if (minValue < 0)
            var span = maxValue - minValue;
        else
            var span = maxValue;
        
        var amount = parseInt(this.jumps);

       

        var mistake = 0;
        if (span <= 10)             mistake = 0.5;
        else if (span <= 50)        mistake = 2.5;
        else if (span <= 100)       mistake = 5;
        else if (span <= 500)       mistake = 25;
        else if (span <= 1000)      mistake = 50;
        else if (span <= 5000)      mistake = 50;
        else if (span <= 10000)     mistake = 100;
        else if (span <= 50000)     mistake = 250;
        else                        mistake = 5 * (parseInt(maxValue.toString().length)- 2);

        var result = span / amount;

        var result = Math.round(result - Math.round(result % mistake)) + mistake;

        return result;    
    };
    
    /**
     * Rysuj warstwy
     * @param {Object} inSide Obiekt w którym mają być osadzone rysowane elementy
     * @param {Array} layers Warstwy do narysowania
     */
    this.drawLayers = function(inSide, layers) {
        for (var i in this.layers) {
            if (layers.length <= 0 || layers.indexOf(parseInt(i)) >= 0)
                this.drawNodesIn(this.layers[i], inSide);
        }       
    };
    
    /**
     * Rysuj tytuł
     * 
     * @returns null
     */
    this.drawTitle = function() {
        var titleArea = this.get('titleArea', this.OBJECT);
        this.layers[4]['title'] = newElement('text', {
            x:              (titleArea.x === null) ? this.width/2 : titleArea.x,
            y:              titleArea.y+13,
            'text-anchor':  'middle',
            fill:           '#000000',
            'font-size':    '25',
            innerHTML:      this.get('title', this.STRING)
        });
    };
    
    /*
     * 
     * @param {type} elementsArr
     * @returns {ChartAbstract.getMaxValue.elementsArr|Number}
     */
    this.drawLegends = function() {
        var horizontalLegen = this.get('horizontalLegend');
        var verticalLegend = this.get('verticalLegend');
        
        this.layers[4]['legend_x'] = newElement('text', {
            x:              (horizontalLegen.x === null) ? this.width/2 : horizontalLegen.x,
            y:              this.height - horizontalLegen.y - 4,
            'text-anchor':  'middle',
            fill:           '#000000',
            innerHTML:      this.get('legendX')
        });
        
       // var xRotate = this.get('legendY').length/2 + verticalLegend.x;
       // var yRotate = verticalLegend.y + this.fontSize/2;
        if (this.get('title').length > 0) {
            verticalLegend.y += parseInt(this.get('titleArea').height);
        }
        
        var xRotate = verticalLegend.x+20;
        var yRotate = verticalLegend.y;
        
        this.layers[4]['legend_y'] = newElement('text', {
            x:              verticalLegend.x,
            y:              verticalLegend.y,
            'text-anchor':  'middle',
            fill:           '#000000',
            transform:      'rotate(-90, '+xRotate+', '+yRotate+')',
            innerHTML:      this.get('legendY')
        });
    };
   
    /**
     * Łamie podany ciąg znaków po podanej długości
     * 
     * @param {String} string Ciąg znaków do połamania po "chars" znakach
     * @param {Number} chars Ilość znaków po jakich ciąg "string" ma być łamany
     * @param {Number} x Pozycja X w której ma być wstawiony tekst
     * @param {Boolean} rotated Określa czy tekst jest obrócony true-tak, false- nie
     */
    this.breakString = function(string, chars, x, rotated) {
        string = new String(string);
        chars = parseInt(chars);
        
        if (typeof rotated === 'undefined' || rotated !== true) {
            rotated = false;
        }
        
        var stringArr = string.split(' ');
        var strLen = 0;
        
        if (stringArr.length > chars)
            return newElement('tspan', {
                    innerHTML: string,
                    x:          x
                });             
        
        var tSpans = [];
        var text = '';
        var next = 0;
        var lineNumber = 0;
        for (var i=0; i<=stringArr.length; i++) {
            if (typeof stringArr[i] !== 'undefined' ) {
                next = (typeof stringArr[(i+1)] !== 'undefined') ? stringArr[(i+1)].length : 0;
                if ((strLen + next + stringArr[i].length) > chars) {
                    text = text+stringArr[i]+' ';
                    strLen = 0;
                } else {                
                    strLen += stringArr[i].length;
                    text = text+stringArr[i]+' '; 
                }  
            }
            
            if (typeof stringArr[i] === 'undefined' || strLen === 0) {
                tSpans[tSpans.length] = newElement('tspan', {
                    innerHTML:  text,
                    x:          (rotated === true) ? x-(3*i) : x,
                    dy:         (lineNumber > 0) ? '1em' : '0em'
                });     
                lineNumber++; 
               text = '';
            }
            
           
        }
        
       // string = stringArr.join(' ');
        
        return tSpans;
    };
    
    
    
    /**
     * @param {Object} nodes Element badź tablica elementów do umieszczenia w kontenerze inSide
     * @param {Object} inSide Element w któym umieszczamy elemeny nodes
     * @returns {undefined}
     */
    this.drawNodesIn = function(nodes, inSide) {
        var x = null;
        if (Array.isArray(nodes))
            for (x in nodes) {
                if (typeof nodes[x] !== 'undefined' && nodes[x] !== null)
                    inSide.appendChild(nodes[x]);
            }
        else 
            inSide.appendChild(nodes);
    };
    
    /**
     * Rysuje wszystko co związane z tłem. 
     * WAŻNE: MUSI POSIADAĆ ZDEFINIOWANE ZMIENNE:
     * this.area
     * this.realJumpSize
     * 
     * @returns {undefined}
     */
    this.drawBg = function() {
        var bgLineColor = this.get('linesColor');
        var borderColor = this.get('borderColor');
        var marginSide = this.get('marginSide', this.NUMBER);
        var marginBottom = this.get('marginBottom', this.NUMBER);
        
        
        var dx = 0; //Margines spodni
        var xText = 0; //Od którego miejsca zaczyna się tekst
        var textAnchor = '';
        if (this.get('verticalLegend').side === 'left') {
            this.layers[4]['line_0'] = newElement('line', {
                x1: this.area.x,
                x2: this.area.x,
                y1: (this.area.y+marginBottom),
                y2: (this.area.y-this.area.height),
                style: {
                    stroke:         'rgb('+borderColor+')',
                    'stroke-width': '0.5'
                } 
            });                    
        
            dx -= marginSide; 
            xText = this.get('verticalLegend').width;
            textAnchor = 'end';
        } else {
            this.layers[4]['line_0'] = newElement('line', {
                x1: (this.area.x+this.area.width),
                x2: (this.area.x+this.area.width),
                y1: (this.area.y+marginBottom),
                y2: (this.area.y-this.area.height),
                style:  {
                    stroke:         'rgb('+borderColor+')',
                    'stroke-width': '0.5'
                }
            });
          
            dx += marginSide;
            xText = this.area.x+this.area.width+5;
        }
        
        //Rysuj tytuł i legendy
        this.drawTitle();
        this.drawLegends();
        if (this.get('showLabels', this.NUMBER) === 1)
            this.drawLabels();
        
        
        
        //Linie poziome
        this.layers[4]['line_1'] = newElement('line', {
            x1: (dx+this.area.x),
            x2: (dx+this.area.x+this.area.width),
            y1: this.area.y,
            y2: this.area.y,
            style:  {
                stroke:         'rgb('+borderColor+')',
                'stroke-width': '0.5'
            }
        });
                
        /**
         * Uwzględnij część wkresu na liczbach ujemnych
         */
        var minValue = this.getMinValue(this.data);
        var tempNumber = minValue/this.valueJump;
        var startPoint = 0;
        
        if (tempNumber < 0) {
            this.marginBottomSteps = Math.floor(tempNumber);            
           // var startPoint = this.marginBottomSteps*this.valueJump;
        }
        
        
        
        for(var i=1;i<=this.jumps;i++) {
            if (this.get('showLines') === 1) {
                this.layers[4]['line_1_'+i] = newElement('line', {
                    x1: (this.area.x),
                    x2: (this.area.x+this.area.width),
                    y1: (-this.realJumpSize*i+this.area.y),
                    y2: (-this.realJumpSize*i+this.area.y),
                    style:  {
                        stroke:         'rgb('+borderColor+')',
                        'stroke-width': '0.4'
                    }
                });  
            }

            this.layers[4]['text_1_'+i] = newElement('text', {
                x:              xText,
                y:              (-this.realJumpSize*i+this.area.y+(this.fontSize/2)),
                'text-anchor':  textAnchor,
                fill:           '#000000',
                'font-size':    this.fontSize,
                innerHTML:      (startPoint + (i*this.valueJump))
            });
        }         
    };
    
    /**
     * Rysuj etykiety pod wykresem
     * 
     * @param {Number} leftShift Przesunięcie etykiet od lewej krawędzi.
     * @param {Number} hJumpSize Odstęp pomiędzy etykietami
     * @param {Boolean} center Automatycznie wyśrodkuj tekst tekst
     * @returns {undefined}
     */
    this.drawLabels = function(leftShift, hJumpSize, center) {
        if (typeof leftShift === 'undefined')
            leftShift = 0;
        if (typeof hJumpSize === 'undefined') 
            hJumpSize = this.getRealHorizontalJumpSize(this.labels.length-1);
        
        var l = 0;
        var _x = 0;
        var _y = 0;
        var _transform = '';
        var _label = '';
        var modulo = parseInt(this.get('showEvery'));
        
        for (l in this.labels) {
            if (modulo > 1 && l % modulo !== 0)
                continue;
            
            _x = (-1)*leftShift+(this.area.x + (l*hJumpSize));
            _y = (this.area.y + 15);
            
            
            /**
             * Dla wykresów kolumnowych
             */
            if (this.rotatedLabels === 0 && typeof center !== 'undefined' && center !== false) {
                _x -= (this.labels[l].length*6.5/2 - hJumpSize/(1+this.get('columnSpaccing'))/2);                
            }
            
            
            _label = newElement('tspan', {
                    innerHTML:  this.labels[l],
                    x:          _x
                });
            
            
            if (this.rotatedLabels === 1) {
                _x -= 3;
                _y -= 5;
                _label = this.breakString(this.labels[l], 7, _x-3, true);
                
                //Dla wykresów kolumnowych
                if (typeof center !== 'undefined') {
                    var dx = -leftShift/2 + parseInt((_label.length*this.fontSize)/2);
                    dx += dx*0.4;
                    _x += dx;
                    
                    _y += dx;
                }
                _transform = 'rotate(70, '+_x+', '+_y+')';
            } 
            
            this.layers[4]['label_'+l] = newElement('text', {
                x:              _x-10,
                y:              _y,
                'text-anchor':  'start',
                fill:           '#000000',
                'font-size':    this.fontSize,
               // innerHTML:      _label,
                transform:      _transform
            });
            //if (typeof _label != 'undefined' && _label.length > 10)
            this.drawNodesIn(_label, this.layers[4]['label_'+l]);
        }
    };
    
    /**
     * Zwraca największą wartość liczbową z pośród umieszczonych w tablicy
     * 
     * @param elementsArr
     * @returns Number
     */
    this.getMinValue = function(elementsArr) {
        var minValue = Number.POSITIVE_INFINITY;
        var x = 0;
        for (x in elementsArr) {
            if (parseFloat(elementsArr[x]) < parseFloat(minValue))
                minValue = elementsArr[x];
        }

        return (1.1*minValue);
    };
    
    /**
     * Zwraca największą wartość liczbową z pośród umieszczonych w tablicy(W tablicy mogą być tablice z wartościami)
     * 
     * @param elementsArr
     * @returns Number
     */
    this.getMaxValue = function(elementsArr) {
        var maxValue = this.getMaxValueRecursion(elementsArr);
        return (1.1*maxValue);
    };
    
    /**
     * Zwraca największa wartośc z tablicy wielowymiarowej
     * 
     * @param {Array} elementsArr Tablica tablic z wartościami. Maksymalny zalecany poziom zagnieżdżenia to 1
     * @returns {undefined}
     */
    this.getMaxValueRecursion = function(elementsArr) {       
        var maxValue = 0;
        var x = 0;
        var currentValue = 0;
        
        for (var x in elementsArr) {
            if (Array.isArray(elementsArr[x])) {               
                currentValue = this.getMaxValue(elementsArr[x]);
            } else {
                currentValue = parseFloat(elementsArr[x]);
            }
            
            if (currentValue > parseFloat(maxValue))
                maxValue = currentValue;
        }
        
        return maxValue;
    };
    
    /**
     * Sumuje wartości wszystkich elementów w tablicy, tablica może być wielowymiarowa
     * 
     * @param {mixed} arr Tablica z wartościami albo konkretna wartość(przy rekurencji)
     * @returns {Number}
     */
    this.arraySum = function(arr) {
        var value = 0;
        
        if (Array.isArray(arr)) {
            for (x in arr) {
                value += this.arraySum(arr[x]);
            }
        } else {
            value += parseInt(arr);
        }
      
        return value;
    };
    
    /**
     * Sumuje wszystkie wartosci w tablicy powyżej 1 poziomu(i zwraca tablicę jednowymiarową z sumami wartości)
     * 
     * @param {Array} dataArr Tablica przynajmniej jednowymiarowa z wartosciami
     * @returns {Array} Tablica jednowymiarowa z wartościami
     */    
    this.sumToTopLevel = function(dataArr) {
        var sumArr = [];
        var x;
        
        for (x in dataArr) {
            sumArr[sumArr.length] = this.arraySum(dataArr[x]);
        }
        
        return sumArr;
    };
    
    /**
     * Dodaje element do tablcy z definicjami
     * 
     * @param {Object} object Element który ma być dodany do tablicy z definicjami
     * @param {String} identifier Identyfikator obiektu
     * @returns {Boolean}
     */
    this.addDefinition = function(object, identifier) {
        if (typeof identifier === 'undefined')
            if (typeof object.id === 'undefined')
                identifier = this.defs.length;
            else
                identifier = object.id;
            
        this.defs[identifier] = object;
        
        return true;
    };
    
    /**
     * Wpisuje nam wcześniej zdefiniowane definicje do węzła SVG
     * 
     * @param {Object} to Element do którego wpisujemy(oppcjonalny)
     * @returns {Boolean}
     */
    this.appendDefinitions = function(to) {
        if (typeof to === 'undefined') {
            if (typeof this.svg === 'undefined')
                throw 'Undefined node to append definitions';
            
            to = this.svg;
        }
        var defs = newElement('defs', {});        
        for (x in this.defs) {
            defs.appendChild(this.defs[x]);
        }
        to.appendChild(defs);
        
        return true;
    };
    
    /**
     * Zwraca wartość co jaką jest rysowana linia tła pozioma(Wymiar w PX)
     * Musi Miec zdefiniowane:
     * this.area
     * this.jumps
     * 
     * @returns Number
     */
    this.getRealJumpSize = function() {
        return Math.floor(this.area.height / this.jumps);
    };
    
    /**
     * Dzieli pole wykresu w poziomie na równe części i zwraca odległośc jednego skoku
     * Musi Miec zdefiniowane:
     * this.area
     * 
     * @param {Number} jumps Ilość podziałów(skoków)
     * @returns Number
     */
    this.getRealHorizontalJumpSize = function(jumps) {
        return this.area.width / jumps;
    };
     
    this.draw = function() {
        //console.log('Drawing is not defined.');
    };
};



/**
 * Obiekt kolumny
 * @type {Object}
 */
var Column = function() {
    /**
     * Referencja na obiekt wykresy do którego należy kolumna
     * @type {Object}
     */
    this.chart = null;
    
    /**
     * Współżędna X od której zaczynamy rysować kolumne
     * @type {Number}
     */
    this.x;
    
    /**
     * Współżędna Y od której zaczynamy rysować kolumnę
     * @type {Number}
     */
    this.y;
    
    /**
     * Szerokośc kolumny
     * @type {Number}
     */
    this.widtdh;
    
    /**
     * Wysokość kolumny[px]
     * @type {Number}
     */
    this.height;
    
    /**
     * Wartość jaką kolumna reprezentuje(realna wartość)
     * @type {Numer}
     */
    this.value;
    
    /**
     * Wypełnienie
     * @type {String}
     */
    this.fill;
    
    /**
     * Identyfikator wykresu
     * @type {String}
     */
    this.id;
    
    /**
     * Przetrzymuje utworzony już obiekt kolumny
     * @type {Object}
     */
    this.parent;
    
    /**
     * Szerokośc obramowania
     * @type {Number}
     */
    this.borderWidth = 1;
    
    /**
     * Kolor obramowania
     * @type {String}
     */
    this.borderColor = '#ffffff';

    /**
     * Określa czy wartość ma być w czy poza kolumną
     * @type {String}
     */
    this.textPosition = 'inside';
    
    /**
     * Wielkość czcionki
     * @type {Number}
     */
    this.fontSize = 14;
    
    /**
     * Obiekt etykiety
     * @type {Object}
     */
    this.textObj = null;
    
    /**
     * Obiekt cienia dla kolumny
     * @type {Object}
     */
    this.shadowObj = null;
    
    this.get = function(force) {
        if ((typeof this.object !== 'undefined' && force === true) || typeof this.object === 'undefined') {        
            if (typeof this.x === 'undefined' || typeof this.y === 'undefined' || typeof this.width === 'undefined' || typeof this.height === 'undefined')
                throw 'I can\'t generate SVG Chart. You must set sizes of rectangle';
            if (typeof this.fill === 'undefined')
                throw 'Set fill color to column';
            if (typeof this.borderWidth === 'undefined' || typeof this.borderColor === 'undefined')
                throw 'Set border to column';

            this.object = newElement('rect', {
                x:          this.x,
                y:          this.y,
                width:      this.width,
                height:     this.height,
                style: {
                    fill:           this.fill,
                    'stroke-width': this.borderWidth,
                    stroke:         this.borderColor
                }
            });
        }
               
        return this.object;
    };
    
    this.getTextObj = function(text) {
        if (text.length > 0 && this.height > 0) {
            var _y = -this.fontSize;
            var y = 0;
            var minHeight = this.fontSize*1.5;
            
            
            
            if (this.textPosition === 'inside') {
                _y *= -1;
            }
            y = this.y + _y;
            
            if (this.height < minHeight && this.textPosition === 'inside') {
                y = this.y - 0.2*this.fontSize;
            }
            
            this.textObj = newElement('text', {
                x:              this.x + this.width/2,
                y:              y,
                'font-size':    this.fontSize,
                'text-anchor':  'middle',
                innerHTML:      text
            });
            //console.log('AAA');
        }        
        
        return this.textObj;
    };
    
    this.getShadow = function() {
        if (this.object !== null) {
            this.shadowObj = newElement('rect', {
                x:          this.x+3,
                y:          this.y+3,
                width:      this.width,
                height:     this.height-6,
                style: {
                    fill:           '#E1E1E1'
                }
            });
        }
        
        return this.shadowObj;
    };
};

var ComposedBarChart = function() {
    /**
     * Suma wartości wszystkich części słupków
     * @type {Number}
     */
    this.topLevelSum = 0;
    
    /**
     * Ilośc kolumn
     * @type {Number}
     */
    this.columns = 0;
    
    /**
     * Olość powrórzeń pętli głównej
     * @type {Number}
     */
    this.loopIntervals = 0;
    
    /**
     * Ułamek szerokości kolumny określający szerokośc odstępu między kolumnami
     * @type {Number}
     */
    this.columnSpaccing = 0;
    
    /**
     * Szerokość kolumny[px](skok jednej jednostki)
     * @type {Number}
     */
    this.realHorizontalJumpSize = 0;
    
    /**
     * Obiekt obszru rysowania wykresu
     * @type {Object}
     */
    this.area = null;
    

    /**
     * Wykonuje wszystkie potrzebne obliczenia do narysowania wykresu
     * 
     * @returns null
     */
    this.calculate = function() {
        this.topLevelSum = this.sumToTopLevel(this.data);
        this.columns = this.topLevelSum.length;
        this.loopIntervals = 2*this.columns + 1;
        
        var horizontalJumpAmount = this.columns + this.columnSpaccing*(this.columns+1);
        this.realHorizontalJumpSize = this.getRealHorizontalJumpSize(horizontalJumpAmount);
        
        this.maxValue = this.getMaxValue(this.topLevelSum);
    };
    
    function _init(that) {
        that.svgContainer.innerHTML = '';
        
        //Wymuś wygląd wykresu
        if (typeof that.config.verticalLegend === 'undefined')
            that.config.verticalLegend = [];
        
        that.config.verticalLegend.side     = 'right';
        that.config.verticalLegend.x        = 0;
        that.config.verticalLegend.width    = that.width*0.40;
        
        
        that.area           = that.getChartArea();
        that.columnSpaccing = that.get('columnSpaccing');
        
        that.svg = newElement('svg', {
            id:         that.unique,
            height:     that.height,
            width:      that.width            
        });
    };
    
    
    /**
     * Rysuje linie poziome
     * 
     * @returns null
     */
    this.drawBg = function() {        
        var verticalJumps = 5;
        var i;
        
        for (i=0; i<verticalJumps; i++) {
            var _y = i*this.area.height/verticalJumps;
            
            this.layers[3]['line_'+i] = newElement('line', {
                x1: this.area.x,
                x2: this.area.x+this.area.width,
                y1: this.area.y-_y,
                y2: this.area.y-_y,
                style: {
                    stroke:         'rgb('+this.get('linesColor')+')',
                    'stroke-width': 0.5
                }
            });
        }
    };
    
    /**
     *  Rysuje legende.
     * @returns {undefined}
     */
    this.drawLegends = function() {
        var legendY = this.get('legendY');
        var legendElements = legendY.length;
        
        if (typeof legendY !== 'undefined' && legendElements > 0) {
            var x;
            var lines = 0;
            
            var _x;
            if (this.get('verticalLegend').side === 'left') {
                _x = 0;
            } else {
                _x = this.area.width;
            }
            
            var wrapLength = parseInt((this.width-this.area.width)/(this.fontSize/1.4));
            for (x in legendY) {               
                legendY[x] = this.breakString(legendY[x], wrapLength, _x + 60);
                lines += legendY[x].length;
            }
            
            /**
             * Legendę wyświetlamy zawsze na środku wysokości
             */
            var legendHeight = lines * this.fontSize * 1.1;            
            var _y = (this.height-legendHeight)/2;
            
            
            var colours = this.get('colours');
            for (x in legendY) {
                this.layers[4]['legend_rect_'+x] = newElement('rect', {
                    x:          _x+30,
                    y:          _y-this.fontSize/1.2 + x*8,
                    width:      this.fontSize,
                    height:     this.fontSize,
                    style: {
                        fill:           colours[x],
                        'stroke-width': 0.5,
                        stroke:         '#000000'
                    }
                });
                
                this.layers[4]['legend_'+x] = newElement('text', {
                    x: 30,
                    y: _y + x*8,
                    'font-size': this.fontSize
                });
                
                _y += legendY[x].length * this.fontSize * 1.1;
                this.drawNodesIn(legendY[x], this.layers[4]['legend_'+x]);
            }
        }
    };
    
    this.drawColumns = function() {        
        var tmpX = this.area.x;
        var i;
        var j;
        var k=0;
        //W sobotę do pracy a potem idę na urodziny chrzesniaka. Ale glowa mnie boli strasznie. Wrrr
        //
        
        var gradients = [];
        var colours = this.get('colours');
        var enabledShadow = this.get('shadows');
        var enableGradient = parseInt(this.get('enableGradient'));
        
        for (i=1; i<=this.loopIntervals; i++) {
            if (i%2 === 1) 
                tmpX += this.columnSpaccing*this.realHorizontalJumpSize;
            else {
                var tmpY = (this.area.y);
                var allColumnHeight = 0;
                
                for(j in this.data[k]) {
                    var tmpHeight = (this.area.height*this.data[k][j])/this.maxValue;
                    tmpY -= tmpHeight;
                    allColumnHeight += tmpHeight;
                    if (enableGradient === 1 && typeof gradients[j] === 'undefined') {
                        var gradient = newElement('linearGradient', {
                            id: 'gradient'+j,
                            x1: '0',
                            x2: '0',
                            y1: '0',
                            y2: '1'
                        });
                        gradient.appendChild(newElement('stop', {
                            offset: '20%',
                            'stop-color': colours[j]
                        }));
                        gradient.appendChild(newElement('stop', {
                            offset: '99%',
                            'stop-color': '#fefefc'
                        }));
                        this.addDefinition(gradient);
                        gradients[j] = 1;
                    }
                    
                    var column1 = new Column();
                    column1.x = tmpX;
                    column1.y = tmpY;
                    column1.width = this.realHorizontalJumpSize;
                    column1.height = tmpHeight;
                    if (enableGradient === 1) {
                        column1.fill = 'url(#gradient'+j+')';
                    }

                    column1.borderColor = '#000000';
                    column1.borderWidth = 0.5;
                    column1.parent = this.layers;
                    column1.id = 'column'+i+'_'+j;
                    column1.chart = this;
                    
                    
                    this.layers[6][column1.id] = column1.get();
                    this.layers[7][column1.id+'_text'] = column1.getTextObj(this.data[k][j].toString());
                }   
                tmpX += this.realHorizontalJumpSize;
                k++;
                
                //Cienie
                if (enabledShadow === 1) {
                    this.layers[2]['shadow_'+i] = newElement('rect', {
                        x:          tmpX-3,
                        y:          tmpY+2,
                        width:      5,
                        height:     allColumnHeight-3,
                        style: {
                            fill:           '#7F7F7F'
                        }
                    });
                }
            }
        }
    };
    
    this.draw = function() {
        
        
        /**
         * TODO:
         * - DODAĆ METODĘ SET ZAPISUJĄCĄ JEŚLI NIEMA W KONFIGURACJI PRZEKAZANEJ PRZEZ UŻYTKOWNIKA, ŻEBY UŻYTKOWNIK MÓGŁ NADPISAĆ WARTOŚCI BO TERAZ PUKI CO NIE MOŻNA NADPISAĆ WARTOŚCI
         * 
         */
        
        //Wywoałaj konstruktor i obliczenia
        _init(this);
        this.calculate();
        
        this.drawLegends();        
        this.drawBg();
        this.drawColumns();
        
        //this.config.forceRotateLabels = 0;
        //this.rotatedLabels = 0;
        this.drawLabels(-this.columnSpaccing*this.realHorizontalJumpSize, (this.realHorizontalJumpSize + this.columnSpaccing*this.realHorizontalJumpSize), true);
        this.appendDefinitions();        
        this.svgContainer.innerHTML = '';
        //Dodaj elementy tła        
        this.drawLayers(this.svg, [1,2,3,4,5,6,7,8,9]);
        this.svgContainer.appendChild(this.svg);
        
    };
};

/**
 * TODO:
 * Pierwszy punkt z lewej strony nie przesuwa się.
 * @returns {LineChart}
 */
var LineChart = function () {
    this.html = '';
    
    //Wartośc maksymalna
    this.maxValue = 0;       
    
    this.drawChart = function() {
        var dataLength = this.data.length;
        
        var hJumpSize = this.getRealHorizontalJumpSize(dataLength-1);
       
        var newY = null;
        var oldY = null;
        var oldX = null;
        var newX = null;
        var points = [];
        var marginBottom = Math.abs(this.marginBottomSteps) * this.realJumpSize;
     
        for (var i=0;i<dataLength;i++) {
            
            oldY = newY;
            oldX = newX;
            newY = this.area.y-((this.realJumpSize * this.data[i]) / this.valueJump);
            newX = (this.area.x+hJumpSize*i);
            
            points[points.length] = {x: newX, y: newY, v: this.data[i] };
            
            if (oldY !== null) {
                
                this.layers[5]['line_2_'+i] = newElement('line', {
                    id: this.unique+'_line_2_'+i,
                    x1: (oldX),
                    x2: newX,
                    y1: (oldY-marginBottom),
                    y2: (newY-marginBottom),
                    style:  {
                        stroke:         '#1D8BD1',
                        'stroke-width': '3'
                    }
                });
                
            }
        }
        
        
        var moveUp = 8; //Przesunięcie opisu do góry
        var moveLeft = 0; //Przesunięcie opisu w lewo
        
        

        
        var circleR = this.get('circleR', this.NUMBER);
        var i = 1;
        for (var j in points) {
            this.layers[5]['point_'+j] = newElement('circle', {
                id: this.unique+'_point_'+j,
                cx: points[j].x,
                cy: (points[j].y - marginBottom),
                r: circleR,
                fill: '#ffffff',
                style:  {
                    stroke:         '#1D8BD1',
                    'stroke-width': (circleR/3)
                }
            });                      
            
            if (typeof points[(parseInt(j)+1)] !== 'undefined' && ((points[j].y - points[(parseInt(j)+1)].y) > (5*moveUp))) {
                moveLeft = -13;
            } else if (typeof points[(parseInt(j)-1)] !== 'undefined' && ((points[j].y - points[(parseInt(j)-1)].y) > (5*moveUp))) {
                moveLeft = 13;
            } else {
                moveLeft = 0;
            }          
            
            if (++i >= points.length) 
                var _anchor = 'end';
            else
                var _anchor = 'middle';
            
            var _str = new String(points[j].v+' '+this.labels[j]);
            var _width = (_str.length*8 + 6);
            switch(_anchor) {
                case 'start': var _x = (points[j].x+moveLeft-3); break;
                case 'middle': var _x = (points[j].x+moveLeft-(_width/2)); break;
                case 'end': var _x = (points[j].x+moveLeft-(_width))+5; break;
            } 
            
            if (parseInt(j) === 0) 
                moveLeft = 5;
            
            this.layers[6]['rect_'+j] = newElement('rect', {
               id: this.unique+'_rect_'+j,
               x:  _x+2,
               y: (points[j].y-this.fontSize-moveUp-2-marginBottom),
               height: this.fontSize+6,
               width: _width,
               fill: '#ffffff',
               visibility: 'hidden',
               style: {
                   'stroke-width': 0.4,
                   stroke: '#000000'
               }
            });
            
            this.layers[6]['point_'+j+'_desc'] = newElement('text', {
                id:             this.unique+'_point_'+j+'_desc',
                x:              (points[j].x+moveLeft),
                y:              (points[j].y-moveUp-marginBottom),
                'text-anchor':  _anchor,
                'font-size':    this.fontSize,
                innerHTML:      (this.labels[j]+': '+points[j].v),
                visibility:     'hidden'
            });
            
            
            this.layers[2]['point_'+j+'_val'] = newElement('text', {
                id:             this.unique+'_point_'+j+'_val',
                x:              (points[j].x+moveLeft),
                y:              (points[j].y-moveUp-marginBottom),
                'text-anchor':  _anchor,
                innerHTML:      (points[j].v),
                'font-size':    this.fontSize,
                visibility:     (this.get('showValues') === 1) ? 'visible' : 'hidden'
            });
            
            
            /**
             * Animacje
             */
            if (this.get('animate') === 1) {
                this.setAnimations(j);
            }
        }
    };
    
    this.setAnimations = function(i) {
        if (typeof this.layers[5]['line_2_'+i] === 'undefined')
            return false;
        
        var startAnimationY = this.area.y - (this.area.height/2);
        var aTime = this.get('animationTime');
        
        var animation = newElement('animate', {
            attributeName: 'y1',
            from: startAnimationY,
            to: this.layers[5]['line_2_'+i].y1.baseVal.value,
            begin: '0',
            dur: aTime
        });
        var animation1 = newElement('animate', {
            attributeName: 'y2',
            from: startAnimationY,
            to: this.layers[5]['line_2_'+i].y2.baseVal.value,
            begin: '0',
            dur: aTime
        });
        var animation2 = newElement('animate', {
            attributeName: 'cy',
            from: startAnimationY,
            to: this.layers[5]['point_'+i].cy.baseVal.value,
            begin: '0',
            dur: aTime
        });
        var animation3 = newElement('animate', {
            attributeName: 'y',
            from: (startAnimationY-10),
            to: this.layers[5]['point_'+i].cy.baseVal.value,
            begin: '0',
            dur: aTime
        });
                
                

        this.layers[5]['line_2_'+i].appendChild(animation);
        this.layers[5]['line_2_'+i].appendChild(animation1);
        this.layers[5]['point_'+i].appendChild(animation2);
        this.layers[2]['point_'+i+'_val'].appendChild(animation3);
    };
    
    /**
     * 
     * @returns {undefined}
     */
    this.showLabelsOnPoints = function() {
        var tmpPoint = null;
        var tmpDesc = null;
        var j = 0;
        var desc = null;
        var that = this;
        
 
        
        while(j<this.data.length) {
            tmpPoint = document.getElementById(this.unique+'_point_'+j);
            
            if (typeof tmpPoint === 'undefined' || tmpPoint === null)
                break;
                     
            
            tmpPoint.addEventListener('mouseover', function() {
                var t = /([0-9]+)_\w+_(\d+)/.exec(this.id)[2];                
                desc = document.getElementById(this.id+'_desc');                
                desc.setAttribute('visibility', 'visible');
                document.getElementById(that.unique+'_rect_'+t).setAttribute('visibility', 'visible');
            });
            
            tmpPoint.addEventListener('mouseout', function() {                
                var t = /([0-9]+)_\w+_(\d+)/.exec(this.id)[2];
                desc.setAttribute('visibility', 'hidden');
                document.getElementById(that.unique+'_rect_'+t).setAttribute('visibility', 'hidden');
            });
            
            j++;
        }
        
    };
    
    /**
     * Funkcja wykonuje wszystkie potrzebne obliczenia
     * @returns {undefined}
     */
    this.calculate = function() {
        /**
         * DO PORZĄDKU
         */
        this.jumps = 5;            
        
        this.getChartArea();        
        var maxValue = this.getMaxValue(this.data); 
        var minValue = this.getMinValue(this.data); 
        this.valueJump = this.getValueJump(minValue, maxValue);
        this.realJumpSize = this.getRealJumpSize();
        this.drawBg();
        this.drawChart();
    };
    
    /**
     * @param {Array} layers Warstwy które wyrysować
     * @returns {undefined}
     */
    this.draw = function(layers) {        
        this.calculate();       
        if (typeof layers === 'undefined') {
            layers = [];
        }
        
        this.svg = newElement('svg', {
            id:         this.unique,
            height:     this.height,
            width:      this.width
        });
        
        this.svgContainer.innerHTML = '';
        //Dodaj elementy tła        
        this.drawLayers(this.svg, layers);
        this.svgContainer.appendChild(this.svg);
    };    
};

LineChart.prototype = new ChartAbstract;
ComposedBarChart.prototype = new ChartAbstract;