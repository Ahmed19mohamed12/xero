// var favouritesList = [];
// import { firstStep } from "./js/pay.js";
var original = '<div class="main-card" id="creatine"><div class="card"><img src="products image/4.png" alt=""><div class="card__content" style="cursor: pointer;"><p class="card__title">Protein</p><p class="card__description">xfmffs</p></div></div><div class="product-title" style="cursor: pointer;"><h2>Protein</h2><h2>Max Muscle</h2></div><div class="product-price"><h3>1750L.E</h3></div><div class="btn-combo"><div class="cart"><a href="#" title="Add to Cart" class="btn-cart"><i class="fa-solid fa-cart-shopping"></i></a></div><div class="favourite"><a href="#" title="Add to Favourite" class="btn-fav"><i class="fa-regular fa-heart"></i></a></div></div></div>'
var div010929 = '<div class="card__content" style="cursor: pointer;"><p class="card__title">Protein</p><p class="card__description">xfmffs</p></div></div><div class="product-title" style="cursor: pointer;"><h2>Protein</h2><h2>Max Muscle</h2></div><div class="product-price"><h3>1750L.E</h3></div><div class="btn-combo"><div class="cart"><a href="#" title="Add to Cart" class="btn-cart"><i class="fa-solid fa-cart-shopping"></i></a></div><div class="favourite"><a href="#" title="Add to Favourite" class="btn-fav"><i class="fa-regular fa-heart"></i></a></div></div></div>'

var host = document.location.origin +"/php/";
function displaypopup(name,description) {
    // inspector("cookieHeading").innerText = name;
    // inspector("cookieDescription").innerText = description.replace("<br>","");
    // inspector("cardPopup").style.display = "flex"; 
    alert(name+"\n"+description.replaceAll("Quadro ","\n"));

}
function inspector(id){
    // console.log(id);
    return document.getElementById(id)
}
function dynamicValues(id,value) {
    document.getElementById(id).innerHTML = value;
}
function getcartElementsIds(listofimagesString) {
    // console.log(listofimagesString);
    var step1 = listofimagesString.replace("[", "").replace("]","").replace('"',"").replace(" ","");
    var images_array=step1.split(",");
    return images_array;
}
function changeUserDataVisiblity() {
    var inputs = document.getElementsByClassName("newinput");
    for (const input in inputs) {
        if (Object.hasOwnProperty.call(inputs, input)) {
            inputs[input].style.display = "block";
        }
    }
    var btnSubmitChange = inspector("submitChange");
    btnSubmitChange.setAttribute("onClick","phpCommands(12)");
    btnSubmitChange.innerText = "Submit Change";
}
var totalPrice = 0;
function checkId(id) {
    $.ajax(
        {
            url:host+"check_id.php",
            method:"post",
            dataType:"json",
            data:{
                idToCheck:id,
            }
        }
    ).always(
        function (jqXHR) {
            if (jqXHR.status == 303) {
                inspector("idinput").style.borderColor = "red";
                inspector("foundidornot").innerText = `${id} Allready Exists`;
                inspector("btnToAdd").setAttribute("disabled","true");
                inspector("btnToAdd").setAttribute("onclick","");
            }else if (jqXHR.status == 404) {
                inspector("idinput").style.borderColor = "green";
                inspector("foundidornot").innerText = `${id} is Allowed`;
                inspector("btnToAdd").removeAttribute("disabled");
                inspector("btnToAdd").setAttribute("onclick","phpCommands(15)");
            }
        }
    )
}
function hideCategory(button){
    if (button == "Reset") {
        var categories = [
            "Creatine",
            "Carp",
            "Protein",
            "Citrulline",
            "Protein Vegan",
            "Pre Workout",
        ];
        for (let index = 0; index < categories.length; index++) {
            const divName = categories[index];
            try {
                inspector("category-name-"+divName).style.display = "";
                inspector(divName+"-div").style.display = "";
            } catch (error) {
                continue;
            }
            
            
        }
    }else{
        var categories = [
            "Creatine",
            "Carp",
            "Protein",
            "Citrulline",
            "Protein Vegan",
            "Pre Workout",
        ];
        categories = categories.filter(category => category !== button);
        // console.log(categories);
        for (let index = 0; index < categories.length; index++) {
            const divName = categories[index];
            try {
                inspector(button+"-div").style.display ="";
                inspector("category-name-"+button).style.display = "";
                inspector("category-name-"+divName).style.display = "none";
                inspector(divName+"-div").style.display = "none";
            } catch (error) {
                continue;
            }
            
            
        }
    }
    
}
async function step2(token) {
    $.ajax({
        url:host+"get_stored_data.php",
        dataType:"json",
        method:"post",
    }).always(
        function (jqXHR) {
            if(jqXHR.status == 303){
                var response = jqXHR.responseText;
                var jsonData = JSON.parse(response);
                // console.log(jsonData);
                var myHeaders = new Headers();
                myHeaders.append("Content-Type","application/json");
                myHeaders.append("Authorization",token);
                var pricebtnvalue = parseInt(inspector("checkout-button").innerText.replace("Checkout (Pay ","").replace(")",""));
                var raw = JSON.stringify({
                    "amount_cents":pricebtnvalue+"00",
                    "payment_methods":[
                        4599003,
                        4568416
                    ],
                    "is_live":"true",
                    "full_name":jsonData['name'],
                    "email":jsonData['email'],
                    "phone_number":"+2"+jsonData['phone'],
                });
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    redirect: 'follow',
                    body:raw,
                };
                fetch("https://accept.paymob.com/api/ecommerce/payment-links", requestOptions)
                .then(response => response.text())
                .then(result => {
                    // console.log(result['client_url']);
                    let jsonData = JSON.parse(result);
                    localStorage.removeItem("currentOrderId");
                    localStorage.setItem("currentOrderId",jsonData['order']);
                    // console.log(jsonData['client_url']);
                    window.location.replace(jsonData['client_url']);
                })
                .catch(error => console.log('error', error));
            }
        }
    );
    
}
const API = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnVZVzFsSWpvaWFXNXBkR2xoYkNJc0ltTnNZWE56SWpvaVRXVnlZMmhoYm5RaUxDSndjbTltYVd4bFgzQnJJam94TmpZeE1EWjkuT29CTV9TZ0h3cGJzbXp3bV9wSFUtME9DNVp0alJGX25waDdwRm5zeVNPUTI2ZDRhLVBEbEhwRjhVai1iRGlrZWlOLVVJbWZzY0FtY0Y3NlN3NXpySFE=";
async function firstStep(price,items,email,firstname,phone) {
    let data = {
        "api_key":API
    };
    let request  = await fetch( 
        // card
        "https://accept.paymob.com/api/auth/tokens", {
            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
    )
    let response  = await request.json();
    let token = response.token;
    // return token;
    // console.log(token)
    secondStep(token,price,items,email,firstname,phone);
}
async function secondStep(token,price,items,email,firstname,phone) {
    let data = {
        "auth_token":  token,
        "delivery_needed": false,
        "amount_cents": price+"00",
        "currency": "EGP",
        "items": items,
        
    };
    for (let index = 0; index < items.length; index++) {
        const product = items[index];
        // console.log(product);
        product.quantity = "1";
        console.log(product);
    }

    let request = await fetch(
        "https://accept.paymob.com/api/ecommerce/orders", {
            method:"post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }
    );
    let response = await request.json();
    var id  = response.id;
    // console.log(response);
    thirdStep(token,price,id,email,firstname,phone)
}
async function thirdStep(token,price,id,email,firstname,phone) {
    let data = {
        "auth_token": token,
        "amount_cents": price+"00", 
        "expiration": 3600, 
        "order_id": id,
        "billing_data": {
          "apartment": "NA", 
          "email": email, 
          "floor": "NA", 
          "first_name": firstname, 
          "street": "NA", 
          "building": "NA", 
          "phone_number": phone, 
          "shipping_method": "NA", 
          "postal_code": "NA", 
          "city": "NA", 
          "country": "NA", 
          "last_name": firstname, 
          "state": "NA"
        }, 
        "currency": "EGP", 
        "integration_id": 4559856
      };
    let request = await fetch(
        "https://accept.paymob.com/api/acceptance/payment_keys",{
            method:"post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }
    );
    let response = await request.json();
    let token2  = response.token;
    mobileWallet(token2);
    // console.log(token2);
    // let iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/366586?payment_token=${token2}`
    // console.log(iframeUrl);
    // window.location.replace(iframeUrl);
}
async function mobileWallet(token) {
    let data = {
        "source": {
            "identifier": "01010101010", 
            "subtype": "WALLET"
        },
        "payment_token": token  // token obtained in step 3
    }
    let request = await fetch(
        "https://accept.paymob.com/api/acceptance/payments/pay",{
            method:"post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        }
    )
    let payment = await request.json()
    console.log(payment.redirect_url);
    window.location.replace(payment.redirect_url);
}
function manageQuantityplus(itemid,price) {
    var span = inspector("quantityof"+itemid);
    var quantity = parseInt(span.innerHTML);
    span.innerHTML = quantity + 1;
    inspector("totalPriceof"+itemid).innerText = "Price : "+ ((quantity+1) * price);
    var pricebtnvalue = parseInt(inspector("checkout-button").innerText.replace("Checkout (Pay ","").replace(")",""));
    var pricebtn = inspector("checkout-button");
    pricebtn.innerText = "Checkout (Pay "+(pricebtnvalue + price)+")";
    
}
function manageQuantityminus(itemid,price) {
    var span = inspector("quantityof"+itemid);
    var quantity = parseInt(span.innerHTML);
    if (quantity > 1) {
        span.innerHTML = quantity - 1;
        inspector("totalPriceof"+itemid).innerText = "Price : "+ ((quantity-1) * price);
        var pricebtnvalue = parseInt(inspector("checkout-button").innerText.replace("Checkout (Pay ","").replace(")",""));
        var pricebtn = inspector("checkout-button");
        pricebtn.innerText = "Checkout (Pay "+(pricebtnvalue - price)+")";
    }
    

    
}
function phpCommands(fileId,addetional1 = "",addetional2="",addetional3 = "") {
    var favourites = [];
    var cart = [];
    // registration
    if (fileId == 1) {
        var name = inspector('name1input').value + " " +inspector('name2input').value;
        var email = inspector('emailinputsignup').value;
        var phone = inspector('phoneinput').value;
        var secondphone = inspector('2ndphoneinput').value;
        var address = inspector('addressinput').value;
        var password = inspector('passwordinputsignup').value;
        $.ajax(
            {
                url:host+'store.php',
                type:'post',
                dataType:'json',
                data: {
                    'name':name,
                    'email':email,
                    'phone':phone,
                    '2ndphone':secondphone,
                    'address':address,
                    'password':password,
                }
            }
        ).always(
            function (jqXHR) {
                // console.log(jqXHR.status);
                var status = jqXHR.status;
                if (status == 302) {
                    //success
                    
                    $.ajax(
                        {
                            url:host+"createUser.php",
                            type:"post",
                            dataType:"json",
                        }
                    ).always(
                        function (jqXHR) {
                            var status2 = jqXHR.status;
                            if (status2==302) {
                                alert("Account Created SuccessFully");
                                window.location.replace("cards.php");
                            }else if(status2 == 301){
                                alert("Error, Please Try Again!");
                            }
                        }
                    )
                } else if(status == 301){
                    // failed not all fields
                    alert("Please Fill All Fields");
                }else if (status == 409) {
                    //allready exist
                    alert("User Already Exists!");
                }
            }
        )
    }
    // finish registration
    // get items
    else if (fileId == 0) {
        
        //get favourites
        if (favourites.length==0) {
            $.ajax(
                {
                    url:host+"getFavourites.php",
                    type:"post",
                    dataType:"json",
                    
                }
            ).always(
                function (jqXHR){
                    if (jqXHR.status == 303) {
                        var res = jqXHR.responseText;
                        // console.log(res);
                        var jsonData = JSON.parse(res);
                        // console.log(jsonData);
                        for (const item in jsonData) {
                            if (Object.hasOwnProperty.call(jsonData, item)) {
                                var finalItem = jsonData[item];
                                favourites.push(finalItem['itemid']);
                            }
                        }
                        // console.log(favourites);
                    }
                }
            );
        }
        // finish get favourites

        // get cart
        if (cart.length==0) {
            $.ajax(
                {
                    url:host+"getCart.php",
                    type:"post",
                    dataType:"json",
                }
            ).always(
                function (jqXHR) {
                    if (jqXHR.status==303) {
                        var response = jqXHR.responseText;
                        var jsonData = JSON.parse(response);
                        for (const item in jsonData) {
                            if (Object.hasOwnProperty.call(jsonData, item)) {
                                const finalItem = jsonData[item];
                                cart = getcartElementsIds(finalItem['items']);
                                console.log("Cart is now set to ", cart);
                            }
                        }
                    }
                }
            );
        }
        //
        // get all items
        $.ajax(
            {
                url:host+"getItems.php",
                type:"post",
                dataType:"json",
            }
        ).always(
            function(jqXHR){
                var status = jqXHR.status;
                if (status == 303) {
                    var res = jqXHR.responseText;
                    var jsonData = JSON.parse(res);
                    // console.log(jsonData);
                    // <i class="fa-solid fa-heart"></i> filled heart
                    // <i class="fa-regular fa-heart"> unfilled heart
                    for (const item in jsonData) {
                        // console.log(item);
                        if (Object.hasOwnProperty.call(jsonData, item)) {
                            const finalItem = jsonData[item];
                            // console.log(finalItem);
                            var images = getcartElementsIds(finalItem["images"]);
                            var url = '"'+'http://localhost/php/store/xero/Xero/Bootstrap/item.php?id='+finalItem["itemid"]+'"' ;
                            var donemessage = '"'+finalItem["itemname"]+" Link Copied To Clipboard"+'"';

                            // console.log(images);
                            // div.innerHTML += "<div id="+finalItem['itemid']+"><img src='"+finalItem['images']+"'></div>";
                            // var div1 = "<div class='itemCard' id="+finalItem['itemid']+">";
                            var div1 ="<div class='main-card' id='"+finalItem['category']+"'><i style='cursor:pointer;font-size:25px' onclick='navigator.clipboard.writeText("+url+");alert("+donemessage+");' class='fa-solid fa-link'></i><div onclick='window.location.replace("+url+")' class='card'>";
                            var div2 = "";
                            var div3 = "";
                            var itemname = "'"+finalItem['itemname']+"'";
                            // console.log(cart);
                            if (!favourites.includes(finalItem['itemid'])) {
                                if (!cart.includes(finalItem['itemid'])) {
                                    // console.log(finalItem['itemid']);
                                    // div3 = "<br><p>Price :"+finalItem['price']+"</p><button id='addtofavbtn"+finalItem['itemid']+"' onclick='phpCommands(2,"+finalItem['itemid']+","+itemname+")'>Add To Favourites</button><button id='addtocartbtn"+finalItem['itemid']+"' onclick='phpCommands(3,"+finalItem['itemid']+","+itemname+")'>Add To Cart</button></div>";
                                    
                                    div3 = '<div class="card__content" onclick="window.location.replace('+url+')" style="cursor: pointer;"><p class="card__title">'+finalItem["itemname"]+'</p><p class="card__description">'+finalItem["description"]+'</p></div></div><div class="product-title" onclick="window.location.replace('+url+')" style="cursor: pointer;"><h2>'+finalItem["itemname"]+'</h2><h2>Max Muscle</h2></div><div class="product-price"><h3>'+finalItem["price"]+' L.E</h3></div><div class="btn-combo"><div id="addtocartdiv'+finalItem["itemid"]+'" class="cart" onclick="phpCommands(3,'+finalItem["itemid"]+','+itemname+')"><a id="addtocartbtn'+finalItem["itemid"]+'" title="Add to Cart" class="btn-cart"><i class="fa-solid fa-cart-shopping"></i></a></div><div class="favourite"  id="addtofavdiv'+finalItem["itemid"]+'" onclick="phpCommands(2,'+finalItem["itemid"]+','+itemname+')"><a id="addtofavbtn'+finalItem["itemid"]+'" title="Add to Favourites" class="btn-fav"><i class="fa-regular fa-heart"></i></a></div></div></div>'
                                } else {
                                    // div3 = "<br><p>Price :"+finalItem['price']+"</p><button id='addtofavbtn"+finalItem['itemid']+"' onclick='phpCommands(2,"+finalItem['itemid']+","+itemname+")'>Add To Favourites</button><button id='removefromcartbtn"+finalItem['itemid']+"' onclick='phpCommands(7,"+finalItem['itemid']+","+itemname+")'>Remove From Cart</button></div>";
                                    div3 = '<div class="card__content" style="cursor: pointer;"><p class="card__title">'+finalItem["itemname"]+'</p><p class="card__description">'+finalItem["description"]+'</p></div></div><div class="product-title" onclick="window.location.replace('+url+')" style="cursor: pointer;"><h2>'+finalItem["itemname"]+'</h2><h2>Max Muscle</h2></div><div class="product-price"><h3>'+finalItem["price"]+' L.E</h3></div><div class="btn-combo"><div class="cart" id="removefromcartdiv'+finalItem["itemid"]+'" onclick="phpCommands(7,'+finalItem["itemid"]+','+itemname+')"><a id="removefromcartbtn'+finalItem["itemid"]+'" title="Remove From Cart" class="btn-cart"><i style="color:#181;" class="fa-solid fa-cart-shopping"></i></a></div><div  id="addtofavdiv'+finalItem["itemid"]+'" class="favourite" onclick="phpCommands(2,'+finalItem["itemid"]+','+itemname+')"><a id="addtofavbtn'+finalItem["itemid"]+'" title="Add to Favourites" class="btn-fav"><i class="fa-regular fa-heart"></i></a></div></div></div>'
                                }
                            } else {
                                if (!cart.includes(finalItem['itemid'])) {
                                    // div3 = "<br><p>Price :"+finalItem['price']+"</p><button id='removetofavbtn"+finalItem['itemid']+"' onclick='phpCommands(5,"+finalItem['itemid']+","+itemname+")'>Remove From Favourites</button><button id='addtocartbtn"+finalItem['itemid']+"' onclick='phpCommands(3,"+finalItem['itemid']+","+itemname+")'>Add To Cart</button></div>";
                                    div3 = '<div class="card__content" style="cursor: pointer;"><p class="card__title">'+finalItem["itemname"]+'</p><p class="card__description">'+finalItem["description"]+'</p></div></div><div onclick="window.location.replace('+url+')" class="product-title" style="cursor: pointer;"><h2>'+finalItem["itemname"]+'</h2><h2>Max Muscle</h2></div><div class="product-price"><h3>'+finalItem["price"]+' L.E</h3></div><div class="btn-combo"><div id="addtocartdiv'+finalItem["itemid"]+'" class="cart" onclick="phpCommands(3,'+finalItem["itemid"]+','+itemname+')"><a id="addtocartbtn'+finalItem["itemid"]+'" title="Add to Cart" class="btn-cart"><i class="fa-solid fa-cart-shopping"></i></a></div><div class="favourite" onclick="phpCommands(5,'+finalItem["itemid"]+','+itemname+')"><a title="Remove From Favourites" class="btn-fav"><i class="fa-solid fa-heart"></i></a></div></div></div>'
                                } else {
                                    div3 = '<div class="card__content" style="cursor: pointer;"><p class="card__title">'+finalItem["itemname"]+'</p><p class="card__description">'+finalItem["description"]+'</p></div></div><div onclick="window.location.replace('+url+')" class="product-title" style="cursor: pointer;"><h2>'+finalItem["itemname"]+'</h2><h2>Max Muscle</h2></div><div class="product-price"><h3>'+finalItem["price"]+' L.E</h3></div><div class="btn-combo"><div class="cart" id="removefromcartdiv'+finalItem["itemid"]+'" onclick="phpCommands(7,'+finalItem["itemid"]+','+itemname+')"><a id="removefromcartbtn'+finalItem["itemid"]+'" title="Remove From Cart" class="btn-cart"><i style="color:#181;" class="fa-solid fa-cart-shopping"></i></a></div><div class="favourite" onclick="phpCommands(5,'+finalItem["itemid"]+','+itemname+')"><a title="Remove From Favourites" class="btn-fav"><i class="fa-solid fa-heart"></i></a></div></div></div>'
                                }
                                
                            }
                            if (images.length>0) {
                                // for (let i = 0; i < images.length; i++) {
                                //     const imageUrl = images[i];
                                //     if (imageUrl !="") {
                                //         // console.log(imageUrl);
                                //         // div2+= '<img src="'+imageUrl+'"/>';
                                //         div2 += '<img src="'+imageUrl+'" alt="">'
                                //         // dynamicValues("content",div1+div2+div3);
                                //         // console.log("Added "+finalItem['itemid']+"mode 1");
                                //     }
                                // }
                                div2 += '<img src="'+images[0]+'" alt="">'
                            }
                            // console.log(finalItem['category']+"-div");
                            document.getElementById(finalItem['category']+"-div").innerHTML += div1+div2+div3;
                            
                        }
                    }
                    // console.log(jsonData);
                } else if(status == 200){
                    console.log("Success , but no items Found");
                }
            }
        );
        // finish get all items
    }
    // finish fetching items
    // add to favourites
    else if(fileId == 2){
        // console.log("pressed");
        $.ajax(
            {
                url: host+"update_favourites.php",
                type: "post",
                dataType: "json",
                data: {
                    favouriteid:addetional1,
                    favouritename:addetional2,
                }
            }
        ).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    // success
                    var button = inspector("addtofavbtn"+addetional1);
                    // button.innerHTML = "Remove From Favorites";
                    button.setAttribute("title","Remove From Favorites");
                    button.innerHTML = '<i class="fa-solid fa-heart"></i>';
                    button.setAttribute("id","removefromfavbtn"+addetional1);
                    var itemname = "'"+addetional2+"'";
                    inspector("addtofavdiv"+addetional1).setAttribute("onclick","phpCommands(5,"+addetional1+","+itemname+")");
                    inspector("addtofavdiv"+addetional1).setAttribute("id","removefromfavdiv"+addetional1);
                    favourites.push(addetional1);
                } else {
                    // failed
                    alert("Error Adding "+addetional2+" To Favorites");
                }
            }
        );
    }
    // fiinish add to favourites
    //get Email
    else if(fileId == 4){
        $.ajax({
            url: host+"getEmail.php",
            type:"post",
            dataType:'text',
        }).always(
            function (jqXHR) {
                return jqXHR.responseText;
            }
        )
    }
    // finish get email
    // remove from favourites
    else if (fileId == 5) {
        $.ajax(
            {
                url: host+"remove_from_favourites.php",
                type: "post",
                dataType: "json",
                data: {
                    favouriteid:addetional1,
                    favouritename:addetional2,
                }
            }
        ).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    // success
                    favourites.splice(favourites.indexOf(addetional1),1);
                    var button = inspector("removefromfavbtn"+addetional1);
                    // button.innerHTML = "Remove From Favorites";
                    button.setAttribute("title","Add To Favorites");
                    button.innerHTML = '<i class="fa-regular fa-heart">';
                    button.setAttribute("id","addtofavbtn"+addetional1);
                    var itemname = "'"+addetional2+"'";
                    inspector("removefromfavdiv"+addetional1).setAttribute("onclick","phpCommands(2,"+addetional1+","+itemname+")");
                    inspector("removefromfavdiv"+addetional1).setAttribute("id","addtofavdiv"+addetional1);
                } else {
                    // failed
                    alert("Error Removing "+addetional2+" From Favorites");
                }
            }
        );
    }
    // finish removing from favourites
    //add to cart
    else if (fileId == 3) {
        // console.log("add to cart");
        $.ajax(
            {
                url: host+"update_cart.php",
                type: "post",
                dataType: "json",
                data: {
                    newitem:addetional1
                }
            }
        ).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    // success
                    var button = inspector("addtocartbtn"+addetional1);
                    button.setAttribute("title","Remove From Cart");
                    button.setAttribute("id","removefromcartbtn"+addetional1);
                    button.innerHTML = '<i style="color:#181;" class="fa-solid fa-cart-shopping"></i>';
                    var itemname = "'"+addetional2+"'";
                    inspector("addtocartdiv"+addetional1).setAttribute("onclick","phpCommands(7,"+addetional1+","+itemname+")");
                    inspector("addtocartdiv"+addetional1).setAttribute("id","removefromcartdiv"+addetional1);
                    favourites.push(addetional1);
                    inspector("spanOfCount").innerText = 0;
                    phpCommands(9);
                    // inspector("spanOfCount").innerText = parseInt(inspector("spanOfCount").innerText) + 1;
                } else {
                    // failed
                    alert("Error Adding "+addetional2+" To Cart");
                }
            }
        );
    }
    // finish adding to cart
    //remove from cart
    else if (fileId == 7) {
        $.ajax(
            {
                url: host+"remove_from_cart.php",
                type: "post",
                dataType: "json",
                data: {
                    item:addetional1
                }
            }
        ).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    // success
                    var button = inspector("removefromcartbtn"+addetional1);
                    button.setAttribute("title","Add To Cart");
                    button.setAttribute("id","addtocartbtn"+addetional1);
                    button.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
                    var itemname = "'"+addetional2+"'";
                    inspector("removefromcartdiv"+addetional1).setAttribute("onclick","phpCommands(3,"+addetional1+","+itemname+")");
                    inspector("removefromcartdiv"+addetional1).setAttribute("id","addtocartdiv"+addetional1);
                    favourites.push(addetional1);
                    inspector("spanOfCount").innerText = 0;
                    phpCommands(9);
                    // inspector("spanOfCount").innerText = parseInt(inspector("spanOfCount").innerText) - 1;
                } else {
                    // failed
                    alert("Error Removing "+addetional2+" From Cart");
                }
            }
        );
    }
    // finish removing from cart
    // login
    else if (fileId == 8) {
        var email = inspector("emailinput").value;
        var password = inspector("passwordinput").value;
        // console.log(email);
        // console.log(password);
        $.ajax(
            {
                url:host+"storelogin.php",
                type:"post",
                dataType: 'json',
                data:{
                    email:email,
                    password:password
                }
            }
        ).always(
            function (jqXHR) {
                // console.log(jqXHR.status);
                var status =  jqXHR.status;
                if (status == 303) {
                    // success
                    $.ajax({
                        url:host+'login.php',
                        type:'post',
                        dataType:'json',
                    }).always(
                        function (jqXHR) {
                            var status2 = jqXHR.status;
                            //success ordinary user
                            if(status2==303){
                                alert("logged in");
                                window.location.replace("cards.php");
                            } 
                            //succes admin
                            else if (status2 == 301) {
                                alert("logged in");
                                window.location.replace("dashboard.php");
                            }else if (status2==401) {
                                alert("Wrong Email Or Password");
                            }
                        }
                    );
                } else if (status==401) {
                    // empty password
                    alert("Please fill your password.");
                } else if(status == 402){
                    // empty email
                    alert("Please fill your email address.")
                } else{
                    alert("Error , Check your connection and try again");
                }
            }
        );
    }
    // finish login
    // get cart
    else if (fileId == 9) {
        // get cart
        if (cart.length==0) {
            $.ajax(
                {
                    url:host+"getCart.php",
                    type:"post",
                    dataType:"json",
                }
            ).always(
                function (jqXHR) {
                    // var priceP = inspector("priceValue");
                    inspector("listCart-div").innerHTML ="";
                    var pricebtn = inspector("checkout-button");
                    var totalPrice = 0;
                    if (jqXHR.status==303) {
                        var response = jqXHR.responseText;
                        var jsonData = JSON.parse(response);
                        var cart = [];
                        for (const item in jsonData) {
                            if (Object.hasOwnProperty.call(jsonData, item)) {
                                const finalItem = jsonData[item];
                                cart = getcartElementsIds(finalItem['items']);
                                // console.log("Cart is now set to ", cart);
                                for (const cartItemId in cart) {
                                    if (Object.hasOwnProperty.call(cart, cartItemId)) {
                                        const idToGetElement = cart[cartItemId];
                                        const div = inspector("listCart-div"); //.innerHTML += `<p>${idToGetElement}</p>`;
                                        if (idToGetElement != "") {
                                            $.ajax(
                                                {
                                                    url:host+"getCartElement.php",
                                                    type:"post",
                                                    dataType:"json",
                                                    data:{
                                                        itemId: idToGetElement
                                                    }
                                                }
                                            ).always(
                                                function (jqXHR) {
                                                    // console.log(idToGetElement);
                                                    if (jqXHR.status == 303) {
                                                        inspector("spanOfCount").innerText = parseInt(inspector("spanOfCount").innerText) + 1;
                                                        var response2 = jqXHR.responseText;
                                                        var jsonData2 = JSON.parse(response2);
                                                        // console.log(jsonData2);
                                                        // console.log(finalItem2);
                                                        // console.log(jsonData2['price']);
                                                        if (jsonData2['price']== "") {
                                                            totalPrice+=0;
                                                        } else {
                                                            totalPrice += parseInt(jsonData2['price']);
                                                        }
                                                        
                                                        // console.log(totalPrice);
                                                        // priceP.innerText = totalPrice;
                                                        pricebtn.innerText ="Checkout    (Pay "+totalPrice.toString()+")" ;
                                                        var images2 = getcartElementsIds(jsonData2["images"]);
                                                        // var div1 = "<div class='itemCard' id="+jsonData2['itemid']+">";
                                                        // var div2 = "";
                                                        // var div3 = "<p>"+jsonData2['itemname']+"</p><br><p class='price' id='price"+jsonData2['itemid']+"'>Price : "+jsonData2['price']+"</p>";
                                                        var div1 = '<div class="item"><div class="image"><img src="'+images2[0]+'" alt=""></div>';
                                                        var div2 = '<div class="name">'+jsonData2["itemname"]+'</div>';
                                                        var div3 = '<div class="totalPrice" id="totalPriceof'+jsonData2["itemid"]+'">Price : '+jsonData2["price"]+'</div>';
                                                        var div4 = '<div class="quantity"><span onclick="manageQuantityminus('+jsonData2["itemid"]+','+jsonData2["price"]+')" class="minus">-</span><span id="quantityof'+jsonData2["itemid"]+'">1</span><span class="plus" onclick="manageQuantityplus('+jsonData2["itemid"]+','+jsonData2["price"]+')">+</span></div></div><hr>';
                                                        if (images2.length>0) {
                                                            // for (let i = 0; i < images2.length; i++) {
                                                            //     const imageUrl2 = images2[i];
                                                            //     if (imageUrl2 !="") {
                                                            //         div2+= '<img src="'+imageUrl2+'"/>';
                                                            //     }
                                                            // }
                                                        }
                                                        div.innerHTML+= div1+div2+div3+div4;
                                                    } else {
                                                        console.log(jqXHR.status);
                                                        alert("Error Getting Cart, Please Refresh");
                                                    }
                                                }
                                            )
                                        }
                                        
                                    }
                                }
                            }
                        }
                        // console.log(totalPrice);
                    }
                }
            );
        }
        //
    }
    // finish getting cart
    // start favourites Page
    else if (fileId == 10) {
        if (favourites.length==0) {
            $.ajax(
                {
                    url:host+"getFavourites.php",
                    type:"post",
                    dataType:"json",
                }
            ).always(
                function (jqXHR) {
                    if (jqXHR.status==303) {
                        var response = jqXHR.responseText;
                        var jsonData = JSON.parse(response);
                        for (const item in jsonData) {
                            if (Object.hasOwnProperty.call(jsonData, item)) {
                                const finalItem = jsonData[item];
                                var idToGetElement = finalItem['itemid'];
                                const div = inspector("main-cards");
                                $.ajax(
                                    {
                                        url:host+"getFavouriteElement.php",
                                        type:"post",
                                        dataType:"json",
                                        data:{
                                            itemId: idToGetElement
                                        }
                                    }
                                ).always(
                                    function (jqXHR) {
                                        if (jqXHR.status == 303) {
                                            var response2 = jqXHR.responseText;
                                            var jsonData2 = JSON.parse(response2);
                                            var itemname = '"'+finalItem['itemname']+'"';
                                            var images2 = getcartElementsIds(jsonData2["images"]);
                                            var url = '"'+'http://localhost/php/store/xero/Xero/Bootstrap/item.php?id='+finalItem["itemid"]+'"' ;
                                            var donemessage = '"'+finalItem["itemname"]+" Link Copied To Clipboard"+'"';
                                            // var div1 = "<div class='itemCard' id="+jsonData2['itemid']+">";
                                            // var div2 = "";
                                            // var div3 = "<p>"+jsonData2['itemname']+"</p><br><p class='price' id='price"+jsonData2['itemid']+"'>Price : "+jsonData2['price']+"</p><button id='removetofavbtn"+finalItem['itemid']+"' onclick='phpCommands(5,"+finalItem['itemid']+","+itemname+")'>Remove From Favourites</button>";
                                            var div1 ="<div class='main-card'><i style='cursor:pointer;font-size:25px' onclick='navigator.clipboard.writeText("+url+");alert("+donemessage+");' class='fa-solid fa-link'></i><div onclick='window.location.replace("+url+")' class='card'>";
                                            var div2 = "";
                                            var div3 = '<div class="card__content" onclick="window.location.replace('+url+')" style="cursor: pointer;"><p class="card__title">'+finalItem["itemname"]+'</p></div></div><div class="product-title" onclick="window.location.replace('+url+')" style="cursor: pointer;"><h2>'+finalItem["itemname"]+'</h2><h2>Max Muscle</h2></div></div>'
                                            if (images2.length>0) {
                                                for (let i = 0; i < images2.length; i++) {
                                                    const imageUrl2 = images2[i];
                                                    if (imageUrl2 !="") {
                                                        div2+= '<img src="'+imageUrl2+'"/>';
                                                    }
                                                }
                                            }
                                            div.innerHTML+= div1+div2+div3;
                                        } else {
                                            alert("Error Getting Favourites, Please Refresh");
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
            );
        }
        //
    }
    // finish favourites page
    // start getting User data
    else if (fileId == 11) {
        $.ajax({
            url:host+"getData.php",
            dataType: "json",
            method:"post",
        }).always(
            function(jqXHR){
                var status = jqXHR.status;
                if (status == 200){
                    alert("Error Please Log in Again");
                    header("Location: index.php");
                }else if (status == 303) {
                    var response = jqXHR.responseText;
                    var jsonData = JSON.parse(response);
                    var emailP = inspector("dataValueE");
                    var nameP = inspector("dataValueN");
                    var phoneP = inspector("dataValueP");
                    var secondPhoneP = inspector("dataValue2P");
                    var addressP = inspector("dataValueA");
                    emailP.innerText = jsonData['email'];
                    nameP.innerText=jsonData['name'];
                    phoneP.innerText=jsonData['phone'];
                    secondPhoneP.innerText=jsonData['2ndPhone'];
                    addressP.innerText=jsonData['address'];
                    inspector("newnameinput").value = jsonData['name'];
                    inspector("newphoneinput").value = jsonData['phone'];
                    inspector("new2ndphoneinput").value = jsonData['2ndPhone'];
                    inspector("newaddressinput").value = jsonData['address'];
                }
            }
        );
    }
    // finish getting user data
    // start changing user data
    else if (fileId == 12) {
        var newname = inspector("newnameinput").value;
        var newphone = inspector("newphoneinput").value;
        var newsecondphone = inspector("new2ndphoneinput").value;
        var newaddress = inspector("newaddressinput").value;
        var email = inspector("dataValueE").innerHTML;
        $.ajax(
            {
                url:host+'store2.php',
                type:'post',
                dataType:'json',
                data: {
                    'name': newname,
                    'email':email,
                    'phone':newphone,
                    '2ndphone':newsecondphone,
                    'address': newaddress,
                }
            }
        ).always(
            function(jqXHR){
                if (jqXHR.status == 302) {
                    $.ajax({
                        url: host+"updateUser.php",
                        type: "post",
                        dataType: "json",
                    }).always(
                        function (jqXHR) {
                            var status3 = jqXHR.status;
                            if (status3 == 302) {
                                alert("Data Updated");
                                window.location.reload();
                            } else {
                                alert("Error Updating Data");
                            }
                        }
                    );
                } else {
                    
                }
            }
        )
    }
    // finish changing user data
    // start logout
    else if (fileId == 13) {
        $.ajax({
            url: host+"unset_user_data.php",
            type: "post",
        }).always(
            function (jqXHR) {
                var status = jqXHR.status;
                if (status == 303) {
                    alert("Logged out");
                    window.location.reload();
                } else {
                    alert(`Error Logging out , Error Code: ${status}`);
                }
            }
        )
    }
    // finish logout
    // start submitting order
    else if (fileId == 14) {
        localStorage.setItem("items",JSON.stringify([]))
        $.ajax({
            url:host+"getData.php",
            dataType: "json",
            method:"post",
        }).always(
            function(jqXHR){
                var status = jqXHR.status;
                if (status == 200){
                    alert("Error Please Log in Again");
                    header("Location: index.php");
                }else if (status == 303) {
                    var response = jqXHR.responseText;
                    var jsonData = JSON.parse(response);
                    var emailP = jsonData['email'];
                    var nameP = jsonData['name'];
                    var phoneP = jsonData['phone'];
                    console.log(emailP);
                    var secondPhoneP = jsonData['2ndPhone'];
                    var addressP = jsonData['address'];
                    // getting items and price
                    $.ajax(
                        {
                            url:host+"getCart.php",
                            type:"post",
                            dataType:"json",
                        }
                    ).always(
                        function (jqXHR) {
                            if (jqXHR.status==303) {
                                var response = jqXHR.responseText;
                                var jsonData = JSON.parse(response);
                                var cart = [];
                                for (const item in jsonData) {
                                    if (Object.hasOwnProperty.call(jsonData, item)) {
                                        const finalItem = jsonData[item];
                                        cart = getcartElementsIds(finalItem['items']);
                                        // console.log("Cart is now set to ", cart);
                                        for (const cartItemId in cart) {
                                            if (Object.hasOwnProperty.call(cart, cartItemId)) {
                                                const idToGetElement = cart[cartItemId];
                                                if (idToGetElement == cart[cart.length-1]) {
                                                    $.ajax(
                                                        {
                                                            url:host+"getCartElement.php",
                                                            type:"post",
                                                            dataType:"json",
                                                            data:{
                                                                itemId: idToGetElement
                                                            }
                                                        }
                                                    ).always(
                                                        function (jqXHR) {
                                                            if (jqXHR.status == 303) {
                                                                var response2 = jqXHR.responseText;
                                                                var jsonData2 = JSON.parse(response2);
                                                                // console.log(jsonData2);
                                                                // console.log(finalItem2);
                                                                // console.log(jsonData2['price']);
                                                                totalPrice += parseInt(jsonData2['price']);
                                                                // console.log(totalPrice);
                                                                var items = JSON.parse(localStorage.getItem('items'));
                                                                items.push(jsonData2);
                                                                localStorage.removeItem('items');
                                                                localStorage.setItem('items',JSON.stringify(items));
                                                                // console.log(JSON.parse(localStorage.getItem('items')));
                                                                const finalitems = JSON.parse(localStorage.getItem('items').replace("itemname","name").replace("price","amount_cents").replace("images","description").replace("itemid","quantity"));
                                                                firstStep(totalPrice,finalitems,emailP,nameP,phoneP);
                                                            } else {
                                                                alert("Error Getting Cart, Please Refresh");
                                                            }
                                                        }
                                                    );
                                                }else{
                                                    $.ajax(
                                                        {
                                                            url:host+"getCartElement.php",
                                                            type:"post",
                                                            dataType:"json",
                                                            data:{
                                                                itemId: idToGetElement
                                                            }
                                                        }
                                                    ).always(
                                                        function (jqXHR) {
                                                            if (jqXHR.status == 303) {
                                                                var response2 = jqXHR.responseText;
                                                                var jsonData2 = JSON.parse(response2);
                                                                // console.log(jsonData2);
                                                                // console.log(finalItem2);
                                                                // console.log(jsonData2['price']);
                                                                totalPrice += parseInt(jsonData2['price']);
                                                                // console.log(totalPrice);
                                                                var items = JSON.parse(localStorage.getItem('items'));
                                                                items.push(jsonData2);
                                                                localStorage.removeItem('items');
                                                                localStorage.setItem('items',JSON.stringify(items).replace("itemname","name").replace("price","amount_cents").replace("images","description").replace("itemid","quantity"));
                                                                // console.log(JSON.parse(localStorage.getItem('items')));
                                                                // const finalitems = JSON.parse(localStorage.getItem('items').replace("itemname","name").replace("price","amount_cents").replace("images","description").replace("itemid","quantity"));
                                                            } else {
                                                                alert("Error Getting Cart, Please Refresh");
                                                            }
                                                        }
                                                    );
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                                
                            }
                        }
                    );
                    
                    
                    // finish getting items and price
                    //
                    // firstStep();
                    // console.log(token);
                }
            }
        );
    }
    // finish submitting order
    // start adding items
    else if (fileId == 15) {
        var itemname = document.getElementById("nameinput").value;
        var price = document.getElementById("priceinput").value;
        var id = document.getElementById("idinput").value;
        $.ajax({
            url:host+"add_item.php",
            dataType:"json",
            method:"post",
            data : {
                "itemname" : itemname,
                "price" : price,
                "id":id,
            }
        }).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    alert(`${itemname} Added Succesfully`);
                    inspector("nameinput").value = "";
                    inspector("priceinput").value = "";
                    inspector("idinput").value = "";
                    inspector("itemnameP").innerText = "type in inputs";
                    inspector("priceP").innerText = "Price :";
                    inspector("btnToAdd").innerText = "Add";
                } else if(jqXHR.status == 404){
                    alert(`Error Adding ${itemname}`);
                } else {
                    alert("Error in your connection");
                }
            }
        )
    }
    // finish adding items
    // start getting ids
    else if (fileId == 16) {
        $.ajax({
            url:host+"get_ids.php",
            method:'post',
            dataType:"json",
        }).always(
            function (jqXHR) {
                if (jqXHR.status != 303) {
                    alert("Please Reload....");
                }
            }
        )
    }
    // finish getting ids
    else if (fileId == 17) {
        $.ajax(
            {
                url:host+"getItems2.php",
                type:"post",
                dataType:"json",
            }
        ).always(
            // <div class="btn"><button class="del-button"><svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button></div></div></div></div>
            // <div class="main-card"><div class="card"><div class="combo"><div class="img-name"><img src="products image/1.png" alt=""><h1>1 Creatine <span>"Max Muscle"</span></h1></div><div class="btn"><button class="del-button"><svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button></div></div></div></div>
            function(jqXHR){
                var status = jqXHR.status;
                if (status == 303) {
                    var res = jqXHR.responseText;
                    var jsonData = JSON.parse(res);
                    for (const item in jsonData) {
                        if (Object.hasOwnProperty.call(jsonData, item)) {
                            const finalItem = jsonData[item];
                            var displayOrNot = finalItem['display'];
                            var images = getcartElementsIds(finalItem["images"]);
                            var itemname = '"'+finalItem['itemname']+'"';
                            //<button class="btnToArchive" onclick="phpCommands(21,'+finalItem['itemid']+','+itemname+')" id ="btnToArchive'+finalItem['itemid']+'"><i class="fa-solid fa-eye-slash"></i></button>
                            // <button class="btnToArchive" onclick="phpCommands(22,'+finalItem["itemid"]+','+itemname+')" id ="btnToArchive'+finalItem['itemid']+'"><i class="fa-solid fa-eye"></i></button>
                            var div1 = '<div id='+finalItem["itemid"]+' class="main-card"><div class="card"><div class="combo"><div class="img-name">';
                            if (displayOrNot == "true"){
                                // <i class="fa-solid fa-eye-slash"></i>
                                // var div1 = "<div class='itemCard' id="+finalItem['itemid']+"><button onclick='phpCommands(18,"+finalItem['itemid']+","+itemname+")'>Delete "+finalItem['itemname']+"</button><button onclick='phpCommands(21,"+finalItem['itemid']+","+itemname+")' id ='btnToArchive"+finalItem['itemid']+"'>Archive</button>";
                                // var div1 = '<div id='+finalItem["itemid"]+' class="main-card"><div class="card"><div class="combo"><div class="img-name">';
                                var div3 = `<div class="btn"><button onclick="phpCommands(18,${finalItem['itemid']},'${finalItem["itemname"]}')" class="del-button"><svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button></div><div class="btn"><button class="btnToArchive" onclick="phpCommands(21,${finalItem['itemid']},'${finalItem["itemname"]}')" id ="btnToArchive${finalItem['itemid']}"><i class="fa-solid fa-eye-slash"></i></button></div></div></div></div>`;
                            }else{
                                // var div1 = "<div class='itemCard' id="+finalItem['itemid']+"><button onclick='phpCommands(18,"+finalItem['itemid']+","+itemname+")'>Delete "+finalItem['itemname']+"</button><button onclick='phpCommands(22,"+finalItem['itemid']+","+itemname+")' id ='btnToArchive"+finalItem['itemid']+"'>Move Out From Archive</button>";
                                // var div1 = '<div id='+finalItem["itemid"]+' class="main-card"><div class="card"><div class="combo"><div class="img-name">';
                                var div3 = `<div class="btn"><button onclick="phpCommands(18,${finalItem['itemid']},'${finalItem["itemname"]}')" class="del-button"><svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button></div><div class="btn"><button class="btnToArchive" onclick="phpCommands(22,${finalItem['itemid']},'${finalItem["itemname"]}')"><i class="fa-solid fa-eye"></i></button></div></div></div></div>`;
                            }
                            var div2 = '<img src="'+images[0]+'" alt=""><h1> '+finalItem["category"]+' <span>"Max Muscle"</span></h1></div>';
                            // div3 = "<p id='namep"+finalItem['itemid']+"'>"+finalItem['itemname']+"</p><input id='newname"+finalItem['itemid']+"' class='"+finalItem['itemid']+"class' type='text' name='"+finalItem['itemid']+"class' style='display:none;' placeholder='Edit Product Name'><br><p id='pricep"+finalItem['itemid']+"'>Price :<span id='actualPrice"+finalItem['itemid']+"'>"+finalItem['price']+"</span></p><input id='newprice"+finalItem['itemid']+"' class='"+finalItem['itemid']+"class' type='text' name='"+finalItem['itemid']+"class' style='display:none;' placeholder='Edit Product Price'><br><button id='btnToEdit"+finalItem['itemid']+"' onclick='phpCommands(19,"+finalItem['itemid']+")'>Edit</button></div>";
                            
                            // if (images.length>0) {
                            //     for (let i = 0; i < images.length; i++) {
                            //         const imageUrl = images[i];
                            //         if (imageUrl !="") {
                            //             // console.log(imageUrl);
                            //             div2+= '<img src="'+imageUrl+'"/>';
                            //             // dynamicValues("content",div1+div2+div3);
                            //             // console.log("Added "+finalItem['itemid']+"mode 1");
                            //         }
                            //     }
                            // }
                            document.getElementById("main-contanier").innerHTML += div1+div2+div3;
                        }
                    }
                    // console.log(jsonData);
                } else if(status == 200){
                    console.log("Success , but no items Found");
                }
            }
        );
    } 
    // start deleting items
    else if (fileId == 18) {
        var itemid = addetional1;
        $.ajax({
            url:host+"delete_item.php",
            dataType:"json",
            method:"post",
            data: {
                itemid:itemid,
            },
        }).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    alert(addetional2+" Deleted Succesfully");
                    inspector(itemid).remove();
                }else if (jqXHR.status == 404) {
                    alert("Error Deleting "+addetional2);
                }else {
                    alert("Error, please reload");
                }
            }
        )
    }
    // finish deleting items
    // start enabling inputs
    else if (fileId == 19) {
        var inputs = document.getElementsByClassName(addetional1+"class");
        for (const input in inputs) {
            if (Object.hasOwnProperty.call(inputs, input)) {
                const final_input = inputs[input];
                final_input.style.display = "";
            }
        }
        var newName = inspector("newname"+addetional1);
        var newPrice = inspector("newprice"+addetional1);
        newName.value = inspector("namep"+addetional1).innerText;
        newPrice.value = inspector("actualPrice"+addetional1).innerText;
        var btn = inspector("btnToEdit"+addetional1);
        btn.setAttribute("onclick",`phpCommands(20,${addetional1})`);
        btn.innerText = "Save Changes";
    }
    // finish enabling inputs
    // start saving Edits Admin made
    else if (fileId == 20) {
        var newName = inspector("newname"+addetional1).value;
        var newPrice = inspector("newprice"+addetional1).value;
        $.ajax({
            url:host+"save_edits.php",
            dataType:"json",
            method: "post",
            data:{
                itemid : addetional1,
                newname : newName,
                newprice : newPrice,
            }
        }).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    alert("Updated Successfully");
                    var inputs = document.getElementsByClassName(addetional1+"class");
                    for (const input in inputs) {
                        if (Object.hasOwnProperty.call(inputs, input)) {
                            const final_input = inputs[input];
                            final_input.style.display = "none";
                        }
                    }
                    var btn = inspector("btnToEdit"+addetional1);
                    btn.setAttribute("onclick",`phpCommands(19,${addetional1})`);
                    btn.innerText = "Edit";
                    inspector("namep"+addetional1).innerText = newName;
                    inspector("pricep"+addetional1).innerText = newPrice;
                } else {
                    alert("Error in Saving Updates");
                }
            }
        )
        
    }
    //finish saving Edits Admin made
    // start archiving 
    else if(fileId == 21){
        var id = addetional1;
        var itemname = addetional2;
        $.ajax({
            url:host+"archive.php",
            dataType:"json",
            method: "post",
            data:{
                id : id,
                itemname : itemname,
            }
        }).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    // alert("Archived Successfully");
                    inspector("btnToArchive"+id).innerHTML = '<i class="fa-solid fa-eye"></i>';
                    inspector("btnToArchive"+id).setAttribute("onclick","phpCommands(22,'"+id+"','"+itemname+"')");
                }else{
                    alert("Error in Archiving");
                }
            }
        )
    }
    // finish archiving
    // start moving out from archive
    else if(fileId == 22){
        var id = addetional1;
        var itemname = addetional2;
        $.ajax({
            url:host+"moveoutfromarchive.php",
            dataType:"json",
            method: "post",
            data:{
                id : id,
                itemname : itemname,
            }
        }
        ).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    // alert("Moved Out From Archive Successfully");
                    inspector("btnToArchive"+id).innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
                    inspector("btnToArchive"+id).setAttribute("onclick","phpCommands(21,'"+id+"','"+itemname+"')");
                }else{
                    alert("Error in Moving Out From Archive");
                }
            }
        )
    }
    // finish moving out from archive
    // start getting orders 
    else if (fileId == 23) {
        $.ajax({
            url:host+"getorders.php",
            dataType:"json",
            method: "post",
        }).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    var response = jqXHR.responseText;
                    var jsonData = JSON.parse(response);
                    var ordersDiv = inspector("main-contanier");
                    for (const ordeJson in jsonData) {
                        if (Object.hasOwnProperty.call(jsonData, ordeJson)) {
                            const order = jsonData[ordeJson];
                            var items = JSON.parse(order['items']);
                            // console.log(items['1']);
                            // var itemsNames = localStorage.getItem('currentOrders');
                            // var itemsNames = [];
                            localStorage.setItem("currentorder","");

                            // var items = localStorage.getItem("currentorder");
                            for (const order2 in items) {
                                if (Object.hasOwnProperty.call(items, order2)) {
                                    const finalOrder = items[order2];
                                    // console.log(finalOrder);
                                    
                                    $.ajax({
                                        url:host+"getCartElement.php",
                                        dataType:"json",
                                        method:"post",
                                        data:{
                                            itemId:finalOrder['itemid']
                                        }
                                    }).always(
                                        function (jqXHR2) {
                                            if (jqXHR2.status == 303) {
                                                var responseText2 = jqXHR2.responseText;
                                                var response2 = JSON.parse(responseText2);
                                                var itemname = response2['itemname'] + " : " + finalOrder['quantity'] + "|";
                                                // console.log(itemname);
                                                var olditems = localStorage.getItem("currentorder");
                                                localStorage.setItem("currentorder",olditems+itemname);
                                                try {
                                                    document.getElementById(order["id"]).remove();
                                                } catch (error) {
                                                    
                                                }
                                                
                                                if (order['done']=="false") {
                                                    // ordersDiv.innerHTML += "<div class='itemCard' id='"+order['id']+"'><button id='btnToMark"+order['id']+"' onclick='phpCommands(24,"+order['id']+")'>Mark As Done</button><p>Name: "+order['name']+"</p><p>Phone :"+order['phone']+"</p><p>Order Id: "+order['orderid']+"</p><p>Email: "+order['email']+"</p></div>";
                                                    var descriptionofpopup ="'"+ 'Order ID: '+order['id']+'Quadro Phone Number : '+order['phone'] + 'Quadro Email : '+ order['email']+'Quadro Address : '+order['address']+"'";
                                                    ordersDiv.innerHTML += '<div style="border-color:red;" class="main-card" id ="'+order["id"]+'"><div class="card"><div class="combo"><div class="img-name"><h1>'+order["email"]+'<span> order id: '+order["id"]+'</span></h1></div><div onclick="displaypopup('+"'"+order["name"]+"'"+','+descriptionofpopup+')" class="btn">'+localStorage.getItem("currentorder")+'</div></div></div><button class="btnToMark" id="btnToMark'+order["id"]+'" onclick="phpCommands(24,'+order["id"]+')">Mark As Done</button></div>';
                                                }else{
                                                    ordersDiv.innerHTML += '<div style="border-color:green;" class="main-card" id ="'+order["id"]+'"><div class="card"><div class="combo"><div class="img-name"><h1>'+order["email"]+'<span> order id: '+order["id"]+'</span></h1></div><div onclick="displaypopup('+"'"+order["name"]+"'"+','+descriptionofpopup+')" class="btn">'+localStorage.getItem("currentorder")+'</div></div></div><button class="btnToMark" id="btnToMark'+order["id"]+'" onclick="phpCommands(25,'+order["id"]+')">Mark As Waiting</button></div>';
                                                    // ordersDiv.innerHTML += "<div style='border-color:green;' class='itemCard' id='"+order['id']+"'><button id='btnToMark"+order['id']+"' onclick='phpCommands(25,"+order['id']+")'>Mark As Waiting</button><p>Name: "+order['name']+"</p><p>Phone :"+order['phone']+"</p><p>Order Id: "+order['orderid']+"</p><p>Email: "+order['email']+"</p></div>";
                                                }            
                                            } else {

                                            }
                                        }
                                    );
                                }
                            }
                        }
                    }
                }
            }
        );
    }
    // finish getting orders
    // start marking as done
    else if (fileId == 24) {
        $.ajax({
            url:host+"change_done.php",
            dataType:"json",
            method:"post",
            data: {
                id:addetional1,
                mode:"1"
            }

        }).always(
        // <label class="switch-button" for="switch"><div class="switch-outer"><input id="switch" type="checkbox"><div class="button"><span class="button-toggle"></span><span class="button-indicator"></span></div></div></label>
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    inspector(addetional1).style.borderColor = "green";
                    inspector("btnToMark"+addetional1).innerText = "Mark As Waiting";
                    inspector("btnToMark"+addetional1).setAttribute("onclick","phpCommands(25,"+addetional1+")");
                }else{
                    alert("Error");
                }
            }
        );
    }
    // finish marking as done
    // start marking as waiting
    else if (fileId == 25) {
        $.ajax({
            url:host+"change_done.php",
            dataType:"json",
            method:"post",
            data: {
                id:addetional1,
                mode:"2"
            }

        }).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    inspector(addetional1).style.borderColor = "red";
                    inspector("btnToMark"+addetional1).innerText = "Mark As Done";
                    inspector("btnToMark"+addetional1).setAttribute("onclick","phpCommands(24,"+addetional1+")");
                }else{
                    alert("Error");
                }
            }
        );
    }
    // finish marking as waiting
    // start paymob 
    else if (fileId == 26) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type","application/json");
        var raw = JSON.stringify({
            "username": "01092995540",
            "password": "AhmedAdminQuadro4@"
        });
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        
        fetch("https://accept.paymob.com/api/auth/tokens", requestOptions)
        .then(response => response.text())
        .then(result => {
            // console.log(result);
            
            // console.log(jsonData['token']);
            
            $.ajax(
                {
                    url:host+"getCart.php",
                    type:"post",
                    dataType:"json",
                }
            ).always(
                function (jqXHR) {
                    if (jqXHR.status == 303) {
                        $.ajax({
                            url:host+"get_stored_data.php",
                            dataType:"json",
                            method:"post",
                        }).always(
                            function (jqXHR2) {
                                if(jqXHR2.status == 303){
                                    // email user data
                                    var response2 = jqXHR2.responseText;
                                    var jsonData2 = JSON.parse(response2);
                                    ///////////////////
                                    var response = jqXHR.responseText;
                                    var jsonData = JSON.parse(response);
                                    var cart = [];
                                    var cartMap = {};
                                    for (const item in jsonData) {
                                        if (Object.hasOwnProperty.call(jsonData, item)) {
                                            const finalItem = jsonData[item];
                                            cart = getcartElementsIds(finalItem['items']);
                                            for (const cartElementid in cart) {
                                                if (Object.hasOwnProperty.call(cart, cartElementid)) {
                                                    const finalElementId = cart[cartElementid];
                                                    if (finalElementId != "") {
                                                        // console.log("quantityof"+finalElementId);
                                                        var quantity = inspector("quantityof"+finalElementId).innerText;
                                                        cartMap[finalElementId]={
                                                            "itemid":finalElementId,
                                                            "quantity":quantity,
                                                            "email":jsonData2['email']
                                                        };
                                                    }
                                                    
                                                }
                                            }
                                        }
                                    }
                                    localStorage.removeItem("items");
                                    localStorage.setItem("items",JSON.stringify(cartMap));
                                    // console.log(JSON.stringify(cartMap))
                                    var pricebtnvalue = parseInt(inspector("checkout-button").innerText.replace("Checkout (Pay ","").replace(")",""));
                                    $.ajax({
                                        url:host+"store_items.php",
                                        dataType:"json",
                                        method:"post",
                                        data:{
                                            items:JSON.stringify(cartMap),
                                            amount_cents:pricebtnvalue+"00"
                                        }
                                    }).always(
                                        function (jqXHR44) {
                                            if (jqXHR44.status == 303) {
                                                let jsonData = JSON.parse(result);
                                                step2(jsonData['token']);
                                            }
                                        }
                                    );
                                    // console.log(localStorage.getItem("items"));
                                }
                            }
                        );
                        
                    }
                    
                }
            )
        })
    }
    // finish paymob
    //start getting user data for paymob
    else if (fileId == 27) {
        $.ajax({
            url:host+"get_stored_data.php",
            dataType:"json",
            method:"post",
        }).always(
            function (jqXHR) {
                if(jqXHR.status == 303){
                    var response = jqXHR.responseText;
                    var jsonData = JSON.parse(response);
                    console.log(jsonData);
                    return jsonData;
                }
            }
        );
    }
    // finish getting user data for paymob
    // start getting orders for ordinary user
    else if (fileId == 28) {
        $.ajax({
            url:host+"getorders.php",
            dataType:"json",
            method: "post",
        }).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    var response = jqXHR.responseText;
                    var jsonData = JSON.parse(response);
                    var ordersDiv = inspector("main-contanier");
                    for (const ordeJson in jsonData) {
                        if (Object.hasOwnProperty.call(jsonData, ordeJson)) {
                            const order = jsonData[ordeJson];
                            var items = JSON.parse(order['items']);
                            // console.log(items['1']);
                            // var itemsNames = localStorage.getItem('currentOrders');
                            // var itemsNames = [];
                            localStorage.setItem("currentorder","");

                            // var items = localStorage.getItem("currentorder");
                            for (const order2 in items) {
                                if (Object.hasOwnProperty.call(items, order2)) {
                                    const finalOrder = items[order2];
                                    // console.log(finalOrder);
                                    
                                    $.ajax({
                                        url:host+"getCartElement.php",
                                        dataType:"json",
                                        method:"post",
                                        data:{
                                            itemId:finalOrder['itemid']
                                        }
                                    }).always(
                                        function (jqXHR2) {
                                            if (jqXHR2.status == 303) {
                                                var responseText2 = jqXHR2.responseText;
                                                var response2 = JSON.parse(responseText2);
                                                var itemname = response2['itemname'] + " : " + finalOrder['quantity'] + "|";
                                                // console.log(itemname);
                                                var olditems = localStorage.getItem("currentorder");
                                                localStorage.setItem("currentorder",olditems+itemname);
                                                try {
                                                    document.getElementById(order["id"]).remove();
                                                } catch (error) {
                                                    
                                                }
                                                
                                                if (order['done']=="false") {
                                                    // ordersDiv.innerHTML += "<div class='itemCard' id='"+order['id']+"'><button id='btnToMark"+order['id']+"' onclick='phpCommands(24,"+order['id']+")'>Mark As Done</button><p>Name: "+order['name']+"</p><p>Phone :"+order['phone']+"</p><p>Order Id: "+order['orderid']+"</p><p>Email: "+order['email']+"</p></div>";
                                                    var descriptionofpopup ="'"+ 'Order ID: '+order['id']+'Quadro Phone Number : '+order['phone'] + 'Quadro Email : '+ order['email']+'Quadro Address : '+order['address']+"'";
                                                    ordersDiv.innerHTML += '<div style="border-color:red;" class="main-card" id ="'+order["id"]+'"><div class="card"><div class="combo"><div class="img-name"><h1>Not Finished Yet <span> order id: '+order["id"]+'</span></h1></div><div class="btn">'+localStorage.getItem("currentorder")+'</div></div></div></div>';
                                                }else{
                                                    ordersDiv.innerHTML += '<div style="border-color:green;" class="main-card" id ="'+order["id"]+'"><div class="card"><div class="combo"><div class="img-name"><h1>Finished<span> order id: '+order["id"]+'</span></h1></div><div class="btn">'+localStorage.getItem("currentorder")+'</div></div></div></div>';
                                                    // ordersDiv.innerHTML += "<div style='border-color:green;' class='itemCard' id='"+order['id']+"'><button id='btnToMark"+order['id']+"' onclick='phpCommands(25,"+order['id']+")'>Mark As Waiting</button><p>Name: "+order['name']+"</p><p>Phone :"+order['phone']+"</p><p>Order Id: "+order['orderid']+"</p><p>Email: "+order['email']+"</p></div>";
                                                }            
                                            } else {

                                            }
                                        }
                                    );
                                }
                            }
                        }
                    }
                }
            }
        );
    }
    // end getting orders for ordinary user
    else if (fileId == 29) {
        var pricebtnvalue = parseInt(inspector("checkout-button").innerText.replace("Checkout (Pay ","").replace(")",""));
        $.ajax({
            url: host+"cash_on_delivery.php",
            method:'post',
            dataType:'json',
            data: {
                amount_cents: pricebtnvalue,
            }
        }).always(
            function (jqXHR) {
                if (jqXHR.status == 303) {
                    alert("Order Placed Successfully");
                }else{
                    alert("Error, Please Check Your Internet Connection");
                }
                
            }
        )
    }
}
