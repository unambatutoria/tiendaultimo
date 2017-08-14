'use strict'

const express  = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Product = require('./models/product')



const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({ extended : false}))
app.use(bodyParser.json())

app.set("view engine","jade");
//ruta de tipo B para usar

app.get("/",function(req,res){
	res.render("insertar");
});
app.get("/insertar",function(req,res){

	res.render("insertar");
});

app.post("/users",function(req,res){
	var product=new Product({name: req.body.name, picture: req.body.picture, price: req.body.price, category: req.body.category, description: req.body.description});
	product.save(function(){
		res.send("Guardamos tus datos tus datos");
	})
	
});




app.get('/api/product',(req,res)=>{
	Product.find({}, (err, products)=>{
		if(err) return res.status(500).send({message:`error al realizar la peticion ${err}`})
		if(!products) return res.status(404).send({message: 'no existen los productos'})

		res.status(200).send({products})
		

	})

	
})

app.get('/api/product/:productId',(req,res)=>{
	let productId = req.params.productId

	Product.findById(productId,(err,product) =>{
		if(err) res.status(500).send({message: `error al realizar la peticion : ${err}`})
		if(!product) res.status(404).send({message: 'el producto no existe'})

		res.status(200).send({product })
	})
})

app.post('/api/product',(req,res)=>{
	console.log('POST /api/product')
	console.log(req.body)

	let product = new Product()
	product.name = 	req.body.name
	product.picture = req.body.picture
	product.price = req.body.price
	product.category = req.body.category
	product.description = req.body.description

	product.save((err,productStored) => {
		if(err) res.status(500).send({message:`error al salvar la base de datos ${err}`})

		res.status(200).send({product: productStored})
	})
})	

app.put('/api/product/:productId',(req,res)=>{
	let productId = req.params.productId
	let update = req.body

	Product.findByIdAndUpdate(productId, update , (err,productUpdated)=>{
		if(err) res.status(500).send({message:`error al actualizar el producto ${err}`})

		res.status(200).send({product: productUpdated})
	})
})

app.delete('/api/product/:productId',(req,res)=>{
	let productId = req.params.productId

	Product.findById(productId, (err, product) =>{
		if(err) res.status(500).send({message:`error al borrar el producto ${err}`})

		product.remove(err =>{
			if(err) res.status(500).send({message:`error al borrar el producto ${err}`})
			res.status(200).send({message:'el producto a sido eliminado'})
		})	
	})
})

app.get('/hola/:name',(req,res)=>{
	res.send({message: `Hola ${req.params.name}`})
})

//mongoose.connect('mongodb://localhost:27017/shop',(err,res)=>{
mongoose.connect('mongodb://admin:123456@ds161169.mlab.com:61169/unambatutoria',(err,res)=>{
	if(err) {
		return console.log(`error al conectar a la base de datos:${err}`)
	}

	app.listen(port , () => {
	console.log(`Corriendo en consola puerto ${port}`) 

	})
})
