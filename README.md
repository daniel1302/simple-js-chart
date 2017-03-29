Instalation
===========
To install chart library we must to put below lines into our html page
```html
    <script type="text/javascript" src="innerSvg.js"></script>
    <script type="text/javascript" src="charts.js"></script>
```


Examples
=========

### Line chart
```html
<div id="lineChart" style="width: 700px; height: 450px;"></div>
```
```js
//Get handler for chart container
var container = document.getElementById('lineChart');

var chart = new LineChart;
data = [456, 95, 158, 250, 600, 956, 3250, 3050, 1000, 1200, 1000, 0];
labels = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień'
];
config = {
    title: 'Wykres miesięczny'
};

chart.init(700, 300, data, labels, config, container);

chart.draw();
chart.showLabelsOnPoints();
 ```
 
 ### Composed column chart
 ```html
 <div id="lineChart1" style="width: 700px; height: 500px;"></div>
 ```
 
```js
var container1 = document.getElementById('lineChart1');

var data1 = [
    [33.60, 31.34, 35.06],
    [33.48, 34.09, 32.43],
    [33.07, 33.40, 33.53]
];
var labels1 = ['narodziny', 'śluby', 'zgony'];
config1 = { 
    legendY: [
        'miejscowości które odnowotwały wzrost względem lat poprzednich',
        'miejscowości które nie odnowotwały zmian względem lat poprzednich',
        'miejscowości które odnowotwały spadek względem lat poprzednich'
    ],
    verticalLegend: { side: 'left', x: 0, y: 0, width: 0.4, height: 1 },
    rotateLabels: 1,
    forceRotateLabels: 0
};

var chart1 = new ComposedBarChart;
chart1.init(700, 400, data1, labels1, config1, container1);
chart1.draw();

```

### Poland map chart
```html
<div id="mapChart" style="width: 700px; height: 700px;"></div>
```
```js
var mapContainer = document.getElementById('mapChart');

var mapChart = new MapChart;
var mapConfig = {
    title: 'Mapa 1',
    animate: 1,
    shadows: 1,
    borderColor: '0, 0, 0',
    animateBorderColor: '10,105, 55',
    linesWidth: 1,
    animateLinesWidth: 3,
    events: {
        1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {}, 10: {},
        11: {}, 12: {}, 13: {}, 14: {}, 15: {}, 16: {}
    }
};

mapConfig.events[mapChart.PROVINCE_DOLNOSLASKIE].click = function() {console.log('1');}; 
mapConfig.events[mapChart.PROVINCE_KUJAWSKO_POMORSKIE].click = function() {console.log('2');}; 
mapConfig.events[mapChart.PROVINCE_LUBELSKIE].click = function() {console.log('3');}; 
mapConfig.events[mapChart.PROVINCE_LUBUSKIE].click = function() {console.log('4');}; 
mapConfig.events[mapChart.PROVINCE_LODZKIE].click = function() {console.log('5');}; 
mapConfig.events[mapChart.PROVINCE_MALOPOLSKIE].click = function() {console.log('6');}; 
mapConfig.events[mapChart.PROVINCE_MAZOWIECKIE].click = function() {console.log('7');}; 
mapConfig.events[mapChart.PROVINCE_OPOLSKIE].click = function() {console.log('8');}; 
mapConfig.events[mapChart.PROVINCE_PODKARPACKIE].click = function() {console.log('9');}; 
mapConfig.events[mapChart.PROVINCE_PODLASKIE].click = function() {console.log('10');}; 
mapConfig.events[mapChart.PROVINCE_POMORSKIE].click = function() {console.log('11');}; 
mapConfig.events[mapChart.PROVINCE_SLASKIE].click = function() {console.log('12');}; 
mapConfig.events[mapChart.PROVINCE_SWIETOKRZYSKIE].click = function() {console.log('13');}; 
mapConfig.events[mapChart.PROVINCE_WARMINSKO_MAZURSKIE].click = function() {console.log('14');}; 
mapConfig.events[mapChart.PROVINCE_WIELKOPOLSKIE].click = function() {console.log('15');}; 
mapConfig.events[mapChart.PROVINCE_ZACHODNIOPOMORSKIE].click = function() {console.log('16');}; 

mapLabels = [];
mapLabels[mapChart.PROVINCE_DOLNOSLASKIE] =         'Dolnośląskie';
mapLabels[mapChart.PROVINCE_KUJAWSKO_POMORSKIE] =   'Pomorskie';
mapLabels[mapChart.PROVINCE_LUBELSKIE] =            'Lubelskie';
mapLabels[mapChart.PROVINCE_LUBUSKIE] =             'Lubuskie';
mapLabels[mapChart.PROVINCE_LODZKIE] =              'Łódzkie';
mapLabels[mapChart.PROVINCE_MALOPOLSKIE] =          'Małopolskie';
mapLabels[mapChart.PROVINCE_MAZOWIECKIE] =          'Mazowieckie';
mapLabels[mapChart.PROVINCE_OPOLSKIE] =             'Opolskie';
mapLabels[mapChart.PROVINCE_PODKARPACKIE] =         'Podkarpackie';
mapLabels[mapChart.PROVINCE_PODLASKIE] =            'Podlaskie';
mapLabels[mapChart.PROVINCE_POMORSKIE] =            'Pomorskie';
mapLabels[mapChart.PROVINCE_SLASKIE] =              'Śląskie';
mapLabels[mapChart.PROVINCE_SWIETOKRZYSKIE] =       'Świętokrzyskie';
mapLabels[mapChart.PROVINCE_WARMINSKO_MAZURSKIE] =  'Warmińsko mazurskie';
mapLabels[mapChart.PROVINCE_WIELKOPOLSKIE] =        'Wielkopolskie';
mapLabels[mapChart.PROVINCE_ZACHODNIOPOMORSKIE] =   'Zachodniopomorskie';


mapChart.init(700, 400, data, mapLabels, mapConfig, mapContainer);
mapChart.draw();
```

### Multicolor circle chart
```html
<div id="circleChart" style="margin-top: 30px; text-align: center; width: 500px; height: 500px">
```
```js
var circleContainer = document.getElementById('circleChart');

var data = {
    '#F44C18': 25,
    '#FC8352': 15,
    '#ff00ff': 2,
    '#000000': 1,
    '#1F2845': 25
};
    
var circleChart = new PieChart();
var config = {
    linesWidth: 32,
    freeSpaceColor: '#bababa',
    spaceSize: 2,
};

circleChart.init(200, data, config, circleContainer);
circleChart.draw();
```

