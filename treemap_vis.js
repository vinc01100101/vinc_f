const tooltip = d3.select('#svg-container').append('div')
	.attr('id','tooltip')
	
const nodeCanvas = document.getElementById('svg-container')

//-------------------------------

const dataSets = {
	videogames: {
		url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json',
		title: 'Video Game Sales',
		desc: 'Top 100 Most Sold Video Games Grouped by Platform'
	},
	movies: {
		url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json',
		title: 'Movie Sales',
		desc: 'Top 100 Highest Grossing Movies Grouped By Genre'
	},
	kickstarters: {
		url: 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json',
		title: 'Kickstarter Pledges',
		desc: 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category'
	}
}

const dataName = new URLSearchParams(window.location.search).get('data')
console.log(dataName)

const orLogical = dataName || 'videogames';
document.getElementById('title').innerHTML = dataSets[orLogical].title;
document.getElementById('description').innerHTML = dataSets[orLogical].desc;

const req = new XMLHttpRequest();
req.open('GET',dataSets[orLogical].url,true);
req.send();
req.onload=()=>{
	const parsed = JSON.parse(req.responseText);
	initMain(parsed);
}

function initMain(subj){
	console.log('rendering...')
	
	const canvasW=1300,canvasH=900,padding=50;
	
	const root=
		d3.hierarchy(subj)
		.sum(d=>d.value)
		.sort((a, b)=>b.height - a.height || b.value - a.value)
	
	d3.treemap()
		.size([canvasW-(padding*2),canvasH-(padding*2)])
		.paddingInner(3)
		(root)
		
	console.log(root.leaves())
	
	const categories=
		root.leaves()
		.map(d=>d.data.category)
		.filter((d,i)=>i!=0?d!=root.leaves()[i-1].data.category:true);
		
	const colors=[
		'da9494',
		'dab994',
		'dad394',
		'bcda94',
		'99da94',
		'94dabb',
		'94dad7',
		'9694da',
		'b694da',
		'da94da',
		'da94ac',
		'd5d5d5',
		'8c8c8c',
		'4c4c4c',
		'efefef',
		'ff335b',
		'942828'
	]
	
	const scaleColors=
		d3.scaleOrdinal()
		.domain(categories)
		.range(colors)
	
	const svg=d3.select('#svg-container')
		.append('svg')
			.attrs({
				'width':canvasW,
				'height':canvasH
			})
			.style('background','#896a6a')
	
	const gTile = svg.selectAll('.gTile')
		.data(root.leaves())
		.enter().append('g')
		.attrs({
			'transform': d=> "translate(" + (d.x0 + padding) + "," + (d.y0 + padding) + ")",
			'class':'gTile'
		})
		
	gTile.append('rect')
		.attrs({
			'fill':d=>'#' + scaleColors(d.data.category),
			'width':d=>{return d.x1-d.x0},
			'height':d=>{return d.y1-d.y0},
			'stroke':'black'
		})
		.on('mousemove',d=>{
			tooltip.html(
				'Name: ' + d.data.name +
				'<br>Category: ' + d.data.category +
				'<br>Value: '+ d.data.value)
			tooltip.transition()
				.duration(0)
				.style('left',d3.mouse(nodeCanvas)[0] + 'px')
				.style('top',d3.mouse(nodeCanvas)[1] + 'px')
				.style('opacity',0.8)
				.style('transform','translate(25px,-15px)')
		})
		.on('mouseout',()=>{
			tooltip.style('opacity',0)
		})
			
			
	gTile.append("text")
    .attrs({
		'class': 'tile-text',
		'font-size': 10,
		'pointer-events': 'none'
	})
    .selectAll("tspan")
    .data(d=>d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append("tspan")
    .attr("x", 4)
    .attr("y",(d, i)=>13 + i * 10)
    .text(d=>d);
	
	const lg = svg.append('g');
	
	/* lg.selectAll('rect')
		.data(categories)
		.enter().append('rect')
		.attrs({
			'width':'15px',
			'height':'15px',
			'x': 
		}) */
	
}
