//jshint esversion: 6
const express=require('express');
const bodyParser=require('body-parser');
const ejs = require('ejs');
const axios = require('axios').default;
const port = process.env.PORT || 3000;

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req,res)=>{
    const url='https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail';
    const drinks=[];
    const ids=[17252, 17242, 17245, 14842, 11000, 17212];
    axios.get(url)
        .then((res)=>{
            const results=res.data.drinks;
            ids.map(key=>{
                results.map(item=>{
                    if(item.idDrink==key){
                        drinks.push(
                            {name:item.strDrink, 
                            img:item.strDrinkThumb,
                            id:item.idDrink});
                    }
                });
            });
        })
        .catch(handleError)
        .then(()=>{
            res.render('pages/index', {drinks:drinks});
        });
});

app.get('/random-drinks', (req,res)=>{
    const url='https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail';
    const drinks=[];
    axios.get(url)
        .then((res)=>{
            const results=res.data.drinks;
            const randomDrinks=randomArrGenerator(results);
            randomDrinks.map(item=>{
                drinks.push({name:item.strDrink, img:item.strDrinkThumb, id:item.idDrink});
            });
        })
        .catch(handleError)
        .then(()=>{
            res.render('pages/random', {drinks:drinks});
        });
});

app.get('/drinks/:id', (req,res)=>{
    drink=[];
    const param=req.params.id;
    const url='https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + param;
    axios.get(url)
        .then((res)=>{
            const results=res.data.drinks;
            const ings=getIngredients(results);
            results.map(item=>{
                if(item.idDrink!=11118){
                    drink.push({
                        name:item.strDrink,
                        instruction: item.strInstructions,
                        img:item.strDrinkThumb,
                        tag:item.strIBA,
                        ings:ings
                    });
                }
            });
        })
        .catch(handleError)
        .then(()=>{
            res.render('pages/single', {drink:drink});
        });
});

app.get('/drinks/ingredients/:id', (req,res)=>{
    drinks=[];
    const param=req.params.id;
    let category='';
    if(param === "vodka") {
        category = 'vodka';
    } else if (param === 'gin') {
        category = 'gin';
    } else if (param === 'rum') {
        category = 'rum';
    } else if (param === 'tequila') {
        category = 'tequila';
    }
    else if (param === 'brandy') {
        category = 'brandy';
    }
    const url='https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + param;
    axios.get(url)
        .then((res)=>{
            const results=res.data.drinks;
            results.map(item=>{
                if(item.idDrink!=11118){
                    drinks.push({
                        name:item.strDrink,
                        img:item.strDrinkThumb,
                        id:item.idDrink,
                    });
                }
            });
        })
        .catch(handleError)
        .then(()=>{
            res.render('pages/ingredients', {drinks:drinks, param:category});
        });
});

app.get('/drinks/category/:id', (req,res)=>{
    drinks=[];
    let param=req.params.id;
    let category='';
    if(param === "non-alcoholic") {
        param = 'a=Non_Alcoholic';
        category = 'Non-Alcoholic';
    } else if (param === 'shot') {
        param = 'c=Shot';
        category = 'Shot';
    } else if (param === 'ordinary-drink') {
        param = 'c=Ordinary_Drink';
        category = 'Ordinary Drink';
    } else if (param === 'cocktail') {
        param = 'c=Cocktail';
        category = 'Cocktail';
    }
    const url='https://www.thecocktaildb.com/api/json/v1/1/filter.php?' + param;
    axios.get(url)
        .then((res)=>{
            let results=res.data.drinks;
            results.map(item=>{
                if(item.idDrink!=11118){
                    drinks.push({
                        name:item.strDrink,
                        img:item.strDrinkThumb,
                        id:item.idDrink,
                    });
                }
            });
        })
        .catch(handleError)
        .then(()=>{
            res.render('pages/category', {drinks:drinks, param:category});
        });
});

app.use('*', function(req,res){
    res.status(404);
    if(req.headers.accept.indexOf('html')){
      res.redirect('/');
    }
    else{
        res.redirect("/");
    }
});

function randomArrGenerator(arr){
    const randomArr=[];
    let limit=9;
    const amount=arr.length;
    if(limit>amount){
        limit = amount;
    }
    let i=randomArr.length;
    while(i<limit){
        const item = arr[Math.floor(Math.random() * amount)];
        if(randomArr.includes(item)){
        } else{
            randomArr.push(item);
            i++;
        }  
    }
    return randomArr;
}

function getIngredients(arr) {
    const ings=[];
    arr.map(item=>{
        ings.push(
            {ing:item.strIngredient1, measure:item.strMeasure1}, 
            {ing:item.strIngredient2, measure:item.strMeasure2}, 
            {ing:item.strIngredient3, measure:item.strMeasure3}, 
            {ing:item.strIngredient4, measure:item.strMeasure4},
            {ing:item.strIngredient5, measure:item.strMeasure5},
            {ing:item.strIngredient6, measure:item.strMeasure6},
            {ing:item.strIngredient7, measure:item.strMeasure7},
            {ing:item.strIngredient8, measure:item.strMeasure8}, 
            {ing:item.strIngredient9, measure:item.strMeasure9}, 
            {ing:item.strIngredient10, measure:item.strMeasure10}, 
            {ing:item.strIngredient11, measure:item.strMeasure11},
            {ing:item.strIngredient12, measure:item.strMeasure12},
            {ing:item.strIngredient13, measure:item.strMeasure13},
            {ing:item.strIngredient14, measure:item.strMeasure14}
            );
    });
    return ings;
}


function handleError(err){
     if (err.res) {
        console.log('Problem with response:' + err.res.status);
    } else if (err.req) {
        console.log('Problem with request.');
    } else {
        console.log('Error' + err.message);
    }
}


app.listen(port, function(){
    console.log('Server is running on port 3000');
});