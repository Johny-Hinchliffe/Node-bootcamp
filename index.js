///////////////////////

//Blocking sync way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)
// const textOut = `This is what we know about the Avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.text', textOut)
// console.log(textOut)

// Non-blocking, async way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('ERROR')
// 	fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
// 		fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
// 			fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
// 				console.log('Your file has finally been written')
// 			})
// 		})
// 	})
// })

// console.log('Will read file!')
// SERVER

// Firstly use require() to include modules

const replaceTemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
	output = output.replace(/{%IMAGE%}/g, product.image)
	output = output.replace(/{%ID%}/g, product.id)
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
	output = output.replace(/{%QUANTITY%}/g, product.quantity)
	output = output.replace(/{%PRICE%}/g, product.price)
	output = output.replace(/{%DESCRIPTION%}/g, product.description)
	output = output.replace(/{%FROM%}/g, product.from)

	if (!product.organic)
		output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
	return output
}

const fs = require('fs') // this file system
const http = require('http')
const url = require('url')

// SERVER
const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8'
)
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8'
)
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	'utf-8'
)

// 1) read JSON file and put it into data variable
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8') // applied once so use SYNC

// 2) parse the data into an object (probably can do that in one move)
const dataObj = JSON.parse(data)

// 3) create a server variable
const server = http.createServer((req, res) => {
	const pathName = req.url
	// OVERVIEW PAGE
	if (pathName === '/' || pathName === '/overview') {
		res.writeHead(200, { 'Content-type': 'text/html' })

		const cardsHtml = dataObj.map((m) => replaceTemplate(tempCard, m)).join('')
		const output = tempOverview.replace('{%PRODUCTCARDS%}', cardsHtml)

		res.end(output) // end the response process with whatever is argument
		// PRODUCT PAGE
	} else if (pathName === '/product') {
		res.end('This is the product')

		//API PAGE
	} else if (pathName === '/api') {
		res.writeHead(200, { 'Content-type': 'application/json' }) // sends a response header to the request. the status code first followed by the content type (html)
		res.end(data)

		// NOT FOUND
	} else {
		res.writeHead(404, {
			'Content-type': 'text/html',
			'my-own-whatever': 'Yhaaaas-queen',
		})
		res.end('<h1>Page not found!</h1>')
	}
})

// 4) call the server using the listen() method with the port number and url
server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to request on port 8000')
})
